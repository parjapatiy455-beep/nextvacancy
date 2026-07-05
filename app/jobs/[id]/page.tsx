'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/types';
import { MapPin, DollarSign, Calendar, Users, ArrowLeft } from 'lucide-react';

export default function JobDetailPage() {
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
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">{error || 'Job not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const deadlineDate = new Date(job.application_deadline);
  const isDeadlineSoon = (deadlineDate.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
          <h1 className="text-4xl font-bold mb-4">{job.position}</h1>
          <p className="text-blue-100 text-lg">{job.department}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              {/* Key Information */}
              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{job.location}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Salary</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{job.salary}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Application Deadline</span>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      isDeadlineSoon ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {deadlineDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Eligibility</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{job.eligibility}</p>
                </div>
              </div>

              {/* Description */}
              {job.description && (
                <div className="mb-8 pb-8 border-b">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Job</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-8 pb-8 border-b">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              )}

              {/* Cutoff Marks */}
              {job.cutoff_marks && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cutoff Marks</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.cutoff_marks}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Info</h3>

              <div className="space-y-4 mb-8 pb-8 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posted on</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(job.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="font-semibold text-gray-900">{job.department}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      isDeadlineSoon
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isDeadlineSoon ? 'Closing Soon' : 'Open'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={`mailto:apply@nextvacancy.com?subject=Application for ${job.position}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition text-center block mb-4"
              >
                Apply Now
              </a>

              <Link
                href="/jobs"
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition text-center block"
              >
                View All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
