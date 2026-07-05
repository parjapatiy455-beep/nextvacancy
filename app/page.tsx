'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Section, SectionItem } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sections, setSections] = useState<(Section & { items: SectionItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      if (data.success) {
        setSections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/jobs');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                <img 
                  src="/logo.png" 
                  alt="Next Vacancy Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-blue-600 leading-none">
                  NEXT VACANCY
                </h1>
                <p className="text-xs text-gray-600">
                  Job Portal
                </p>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm flex-1 justify-center mx-4">
              <Link href="/" className="bg-gray-800 text-white px-2 sm:px-3 py-1 rounded hover:bg-gray-900 transition-colors duration-200">
                Home
              </Link>
              <Link href="/jobs" className="bg-gray-800 text-white px-2 sm:px-3 py-1 rounded hover:bg-gray-900 transition-colors duration-200">
                Jobs
              </Link>
            </nav>

            <Link
              href="/admin/login"
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 animate-in fade-in slide-in-from-top-2 duration-700">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-purple-600 px-6 py-2.5 rounded font-semibold hover:bg-gray-100 transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading sections...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No sections available. Admin panel can add content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Section Header */}
                  <div className={`${section.color} text-white px-4 py-4 font-bold text-base flex items-center gap-3 transition-all duration-300`}>
                    <span className="text-2xl">{section.icon}</span>
                    <span>{section.title}</span>
                  </div>

                  {/* Section Items List */}
                  <div className="p-4">
                    {section.items && section.items.length > 0 ? (
                      <ul className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <li 
                            key={item.id}
                            className="animate-in fade-in slide-in-from-left-2 duration-300"
                            style={{ animationDelay: `${index * 50 + itemIndex * 30}ms` }}
                          >
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-all duration-200 block hover:translate-x-1 transform"
                            >
                              → {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-center py-6 text-sm">
                        No items in this section
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            &copy; 2024 Next Vacancy. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Your gateway to government job opportunities
          </p>
        </div>
      </footer>
    </main>
  );
}
