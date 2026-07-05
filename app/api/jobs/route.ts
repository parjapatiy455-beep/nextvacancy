import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs } from '@/lib/d1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const location = searchParams.get('location') || '';

    const filter: Record<string, string> = {};
    if (department) filter.department = department;
    if (location) filter.location = location;

    const jobs = await getAllJobs(search, filter);

    return NextResponse.json(
      {
        success: true,
        data: jobs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
