import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/d1';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();

    // Get all visible sections with their items
    const sections = await db.prepare(`
      SELECT * FROM sections WHERE visible = 1 ORDER BY order_index ASC
    `).all();

    const sectionsWithItems = [];
    for (const section of sections) {
      const items = await db.prepare(`
        SELECT * FROM section_items WHERE section_id = ? AND visible = 1 ORDER BY order_index ASC
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
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
