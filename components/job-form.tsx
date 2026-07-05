'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/types';
import { Save, ArrowLeft } from 'lucide-react';

interface JobFormProps {
  job?: Job;
  onSubmit?: (formData: any) => Promise<void>;
  isEditing?: boolean;
}

export function JobForm({ job, onSubmit, isEditing = false }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    position: job?.position || '',
    department: job?.department || '',
    salary: job?.salary || '',
    eligibility: job?.eligibility || '',
    requirements: job?.requirements || '',
    application_deadline: job?.application_deadline
      ? job.application_deadline.split('T')[0]
      : '',
    location: job?.location || '',
    cutoff_marks: job?.cutoff_marks || '',
    description: job?.description || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/jobs/${job?.id}` : '/api/admin/jobs';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save job');
        return;
      }

      router.push('/admin/jobs');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Job' : 'Add New Job'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              Job Position
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="e.g., Ministry of IT"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              value={formData.salary}
              onChange={handleChange}
              required
              placeholder="e.g., Rs. 50,000 - 80,000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., New Delhi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Eligibility */}
          <div>
            <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-2">
              Eligibility
            </label>
            <input
              id="eligibility"
              name="eligibility"
              type="text"
              value={formData.eligibility}
              onChange={handleChange}
              required
              placeholder="e.g., Bachelor&apos;s Degree"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Application Deadline */}
          <div>
            <label
              htmlFor="application_deadline"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Application Deadline
            </label>
            <input
              id="application_deadline"
              name="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Cutoff Marks */}
          <div className="md:col-span-2">
            <label htmlFor="cutoff_marks" className="block text-sm font-medium text-gray-700 mb-2">
              Cutoff Marks (Optional)
            </label>
            <input
              id="cutoff_marks"
              name="cutoff_marks"
              type="text"
              value={formData.cutoff_marks}
              onChange={handleChange}
              placeholder="e.g., 60% or higher"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Enter job requirements..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Enter detailed job description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Job'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
