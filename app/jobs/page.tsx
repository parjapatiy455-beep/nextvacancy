'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobCard } from '@/components/job-card';
import { Job } from '@/lib/types';
import { Search, Filter, Send, MessageCircle, Smartphone } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

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
        setFilteredJobs(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
      const matchesLocation = !selectedLocation || job.location === selectedLocation;

      return matchesSearch && matchesDepartment && matchesLocation;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedDepartment, selectedLocation]);

  const departments = Array.from(new Set(jobs.map((job) => job.department)));
  const locations = Array.from(new Set(jobs.map((job) => job.location)));

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans antialiased text-gray-900">
      {/* 1. TOP BRAND HEADER (Sarkari Result Theme) */}
      <header className="bg-[#cd0808] text-white py-6 border-b-4 border-[#05055f]">
        <div className="container mx-auto px-4 max-w-[1100px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <Link href="/" className="inline-block">
                <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-yellow-300 drop-shadow-md">
                  SARKARI RESULT
                </h1>
              </Link>
              <p className="text-sm sm:text-base font-bold text-white tracking-widest mt-1">
                WWW.SARKARIRESULT.COM.CM
              </p>
              <p className="text-xs text-gray-200 font-semibold italic mt-0.5">
                Next Vacancy - Live Government Jobs, Admit Cards & Results Portal 2026
              </p>
            </div>

            {/* Social / Connect Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <a 
                href="https://t.me/SarkariExam_info" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 border border-white hover:bg-white hover:text-[#cd0808] px-3 py-1.5 rounded transition"
              >
                <Send className="w-3.5 h-3.5" /> Telegram Group
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VaAbQf01NCrYADMLt00L" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 border border-white hover:bg-white hover:text-[#cd0808] px-3 py-1.5 rounded transition"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Channel
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.vinod.sarkarinaukri" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 border border-white hover:bg-white hover:text-[#cd0808] px-3 py-1.5 rounded col-span-2 justify-center transition"
              >
                <Smartphone className="w-3.5 h-3.5" /> Download Android App
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION BAR */}
      <nav className="bg-[#05055f] text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto max-w-[1100px] px-2 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap text-xs sm:text-sm font-bold divide-x divide-blue-800">
            <Link href="/" className="px-4 py-3.5 hover:bg-[#982704] transition-colors">
              Home
            </Link>
            <Link href="/jobs" className="px-4 py-3.5 bg-[#982704] hover:bg-[#982704] transition-colors">
              Latest Jobs
            </Link>
          </div>
          
          <Link 
            href="/admin/login" 
            className="text-xs bg-[#cd0808] hover:bg-red-700 px-3 py-1.5 rounded text-white font-bold my-2 mr-2 transition"
          >
            Admin Panel
          </Link>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 max-w-[1100px] py-8 bg-white shadow-sm border border-gray-200 mt-4 rounded">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 sticky top-20">
              <h2 className="text-base font-black text-[#05055f] mb-4 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                <Filter className="w-4 h-4 text-[#cd0808]" />
                Filter Options
              </h2>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Search Jobs
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Position, dept, keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Department Filter */}
                {departments.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Location Filter */}
                {locations.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">All Locations</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('');
                    setSelectedLocation('');
                  }}
                  className="w-full py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-300 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Listing Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-red-600 rounded-full animate-spin inline-block"></div>
                <p className="text-gray-500 mt-3 text-sm font-bold">Loading recruitment active database...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-sm font-bold mb-1">No jobs match the selected filters</p>
                <p className="text-gray-400 text-xs">Try searching for other keywords or reset your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Active Listings: {filteredJobs.length} Positions Available
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#05055f] text-white py-10 mt-12 border-t-4 border-[#cd0808]">
        <div className="container mx-auto px-4 max-w-[1100px] text-center space-y-4">
          <p className="text-sm font-extrabold">
            Copyright &copy; 2009 - 2026 | <Link href="/" className="text-yellow-300 hover:underline">SarkariResult.com.cm</Link> | All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-gray-300">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>|</span>
            <Link href="/jobs" className="hover:text-white transition">Jobs</Link>
            <span>|</span>
            <Link href="/admin" className="hover:text-white transition">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
