'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Job } from '@/lib/types';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (data.success) {
        setJobs(data.data || []);
      }
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      setDeleting(jobId);
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== jobId));
      } else {
        setError('Failed to delete job');
      }
    } catch (err) {
      setError('An error occurred while deleting');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
          <p className="text-gray-600">Add, edit, and remove job listings</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Job
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No jobs yet. Create your first job posting.</p>
            <Link
              href="/admin/jobs/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add First Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => {
                  const deadline = new Date(job.application_deadline);
                  const isClosingSoon =
                    deadline.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{job.position}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{job.department}</td>
                      <td className="px-6 py-4 text-gray-600">{job.location}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {deadline.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            isClosingSoon
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isClosingSoon ? 'Closing Soon' : 'Open'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/jobs/${job.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit job"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job.id)}
                            disabled={deleting === job.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
