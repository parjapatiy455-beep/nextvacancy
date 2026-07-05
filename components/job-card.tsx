import Link from 'next/link';
import { Job } from '@/lib/types';
import { MapPin, DollarSign, Calendar } from 'lucide-react';

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export function JobCard({ job, featured = false }: JobCardProps) {
  const deadlineDate = new Date(job.application_deadline);
  const isDeadlineSoon = (deadlineDate.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000; // Within 7 days

  return (
    <Link href={`/jobs/${job.id}`}>
      <div
        className={`
          group border rounded-lg p-6 transition-all duration-300 cursor-pointer
          ${featured
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg'
            : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
          }
        `}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
              {job.position}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{job.department}</p>
          </div>
          {featured && (
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            {job.salary}
          </div>
          <div className="flex items-center text-sm gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={isDeadlineSoon ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              Deadline: {deadlineDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {job.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {job.eligibility}
          </span>
          <span className="text-blue-600 font-semibold text-sm group-hover:gap-2 flex items-center gap-1 transition">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
