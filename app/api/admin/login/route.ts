import { NextRequest, NextResponse } from 'next/server';
import { getAdminByEmail, updateAdminLastLogin } from '@/lib/d1';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get admin from database
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, admin.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    await createSession({
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
    });

    // Update last login
    await updateAdminLastLogin(admin.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: admin.id,
          email: admin.email,
          full_name: admin.full_name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
