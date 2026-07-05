'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Clock } from 'lucide-react';
import { Job } from '@/lib/types';

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    jobsClosingSoon: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (data.success) {
        const jobs = data.data || [];
        setJobs(jobs);

        // Calculate stats
        const closingSoon = jobs.filter((job: Job) => {
          const deadline = new Date(job.application_deadline).getTime();
          return deadline - Date.now() < 7 * 24 * 60 * 60 * 1000;
        }).length;

        setStats({
          totalJobs: jobs.length,
          jobsClosingSoon: closingSoon,
        });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your government jobs portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Jobs</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalJobs}</p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Closing Soon</p>
              <p className="text-4xl font-bold text-orange-600">{stats.jobsClosingSoon}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Jobs Management Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
          <Link
            href="/admin/jobs/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Job
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No jobs yet. Start by adding a new job.</p>
            <Link
              href="/admin/jobs/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{job.position}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{job.department}</td>
                    <td className="px-6 py-4 text-gray-600">{job.location}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
