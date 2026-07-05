'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu, X, Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/admin/session');
      const data = await response.json();

      if (data.success && data.data) {
        setIsLoggedIn(true);
        setAdminName(data.data.full_name || data.data.email);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link href="/admin" className="text-xl font-bold text-blue-600">
              Next Vacancy Admin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {adminName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative top-16 lg:top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-30
            transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-6 space-y-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === '/admin'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/sections"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === '/admin/sections' || pathname.startsWith('/admin/sections/')
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              Manage Sections
            </Link>
            <Link
              href="/admin/jobs"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === '/admin/jobs' || pathname.startsWith('/admin/jobs/')
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              Manage Jobs
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
