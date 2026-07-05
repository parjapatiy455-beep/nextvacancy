import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/d1';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();

    // Create tables
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        position TEXT NOT NULL,
        department TEXT NOT NULL,
        salary TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        requirements TEXT NOT NULL,
        application_deadline TEXT NOT NULL,
        location TEXT NOT NULL,
        cutoff_marks TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        visible BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS section_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        link TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        visible BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `).run();

    // Check if admin exists
    const adminExists = await db.prepare('SELECT id FROM admin_users LIMIT 1').get();

    if (!adminExists) {
      const passwordHash = await hashPassword('password123');
      await db.prepare(`
        INSERT INTO admin_users (email, password_hash, full_name)
        VALUES (?, ?, ?)
      `).run('admin@nextvacancy.com', passwordHash, 'Admin User');
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
