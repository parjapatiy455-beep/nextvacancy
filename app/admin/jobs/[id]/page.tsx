'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { JobForm } from '@/components/job-form';
import { Job } from '@/lib/types';

export default function EditJobPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();

      if (data.success) {
        setJob(data.data);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      setError('Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading job...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600">{error || 'Job not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <JobForm job={job} isEditing={true} />
    </div>
  );
}
