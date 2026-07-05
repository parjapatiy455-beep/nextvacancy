import { NextRequest, NextResponse } from 'next/server';
import { createJob } from '@/lib/d1';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'position',
      'department',
      'salary',
      'eligibility',
      'requirements',
      'application_deadline',
      'location',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const result = await createJob({
      position: body.position,
      department: body.department,
      salary: body.salary,
      eligibility: body.eligibility,
      requirements: body.requirements,
      application_deadline: body.application_deadline,
      location: body.location,
      cutoff_marks: body.cutoff_marks || undefined,
      description: body.description || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.lastInsertRowid,
          ...body,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
