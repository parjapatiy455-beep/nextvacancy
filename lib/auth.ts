// Admin authentication utilities
import { cookies } from 'next/headers';

const SESSION_NAME = 'admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default-dev-secret-change-in-production';

export interface AdminSession {
  id: number;
  email: string;
  full_name: string;
  iat: number;
  exp: number;
}

// Helper to hash password with SHA-256 using native Web Crypto API
async function hashSHA256(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hash password for storing in database (using native Web Crypto SHA-256)
export async function hashPassword(password: string): Promise<string> {
  const saltArray = new Uint8Array(16);
  crypto.getRandomValues(saltArray);
  const salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
  const hash = await hashSHA256(password, salt);
  return `${salt}:${hash}`;
}

// Verify password against stored hash (Web Crypto SHA-256)
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const computedHash = await hashSHA256(password, salt);
    return computedHash === hash;
  } catch (e) {
    console.error('Web Crypto verification failed:', e);
    return false;
  }
}

// Create session cookie
export async function createSession(admin: { id: number; email: string; full_name: string }): Promise<void> {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  cookieStore.set(SESSION_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

// Get current admin session
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_NAME);

  if (!session?.value) {
    return null;
  }

  try {
    const sessionData = JSON.parse(session.value) as AdminSession;

    // Check if session has expired
    if (sessionData.exp < Date.now()) {
      await clearSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    return null;
  }
}

// Clear session (logout)
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_NAME);
}

// Middleware to check admin authentication
export async function requireAdminAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized: Admin session required');
  }

  return session;
}
