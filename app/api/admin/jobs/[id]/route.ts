import { NextRequest, NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/d1';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const jobId = parseInt(id, 10);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await getJobById(jobId);
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = await updateJob(jobId, body);

    if (result.changes === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update job' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: jobId,
          ...body,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const jobId = parseInt(id, 10);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await getJobById(jobId);
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const result = await deleteJob(jobId);

    if (result.changes === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete job' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
