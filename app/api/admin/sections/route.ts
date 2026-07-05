import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/d1';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

    const db = getDatabase();

    // Get all sections with their items
    const sections = await db.prepare(`
      SELECT * FROM sections ORDER BY order_index ASC
    `).all();

    const sectionsWithItems = [];
    for (const section of sections) {
      const items = await db.prepare(`
        SELECT * FROM section_items WHERE section_id = ? ORDER BY order_index ASC
      `).all(section.id);

      sectionsWithItems.push({
        ...section,
        items: items || []
      });
    }

    return NextResponse.json({
      success: true,
      data: sectionsWithItems,
    });
  } catch (error) {
    console.error('Fetch sections error:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized or failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { title, color, icon, order_index } = body;

    if (!title || !color || !icon) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const result = await db.prepare(`
      INSERT INTO sections (title, color, icon, order_index, visible)
      VALUES (?, ?, ?, ?, 1)
    `).run(title, color, icon, order_index || 0);

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid },
    });
  } catch (error) {
    console.error('Create section error:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized or failed to create section' },
      { status: 500 }
    );
  }
}
