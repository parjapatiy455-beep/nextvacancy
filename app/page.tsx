'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Flame, Smartphone, Send, MessageCircle } from 'lucide-react';
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

  // Helper to check if item is recently added (within last 7 days)
  const isNewItem = (createdAt?: string) => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Categorize sections dynamically based on title keywords
  const getSectionByCategory = (keywords: string[]) => {
    return sections.find(s => keywords.some(kw => s.title.toLowerCase().includes(kw)));
  };

  const resultsSec = getSectionByCategory(['result']);
  const admitSec = getSectionByCategory(['admit']);
  const jobsSec = getSectionByCategory(['job', 'vacancy']);
  const answerSec = getSectionByCategory(['answer']);
  const syllabusSec = getSectionByCategory(['syllabus']);
  const admissionSec = getSectionByCategory(['admission']);
  const importantSec = getSectionByCategory(['important']);
  const verificationSec = getSectionByCategory(['verification', 'certificate']);

  // IDs of sections already placed in specific columns
  const categorizedIds = [
    resultsSec?.id,
    admitSec?.id,
    jobsSec?.id,
    answerSec?.id,
    syllabusSec?.id,
    admissionSec?.id,
    importantSec?.id,
    verificationSec?.id
  ].filter(Boolean);

  // Remaining other sections to render below
  const otherSecs = sections.filter(s => !categorizedIds.includes(s.id));

  // Extract all items from all sections for marquee and quick links
  const allItems = sections.flatMap(s => 
    (s.items || []).map(item => ({
      ...item,
      sectionTitle: s.title
    }))
  );

  // Sort by id descending (latest first)
  const latestItems = [...allItems].sort((a, b) => b.id - a.id);
  const marqueeItems = latestItems.slice(0, 10);
  const quickLinksItems = latestItems.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#f7f7f7] font-sans antialiased text-gray-900">
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
            <Link href="/jobs" className="px-4 py-3.5 hover:bg-[#982704] transition-colors">
              Latest Jobs
            </Link>
            {resultsSec && (
              <a href="#results" className="px-4 py-3.5 hover:bg-[#982704] transition-colors">
                Results
              </a>
            )}
            {admitSec && (
              <a href="#admit-cards" className="px-4 py-3.5 hover:bg-[#982704] transition-colors">
                Admit Cards
              </a>
            )}
            {answerSec && (
              <a href="#answer-keys" className="px-4 py-3.5 hover:bg-[#982704] transition-colors">
                Answer Key
              </a>
            )}
            {syllabusSec && (
              <a href="#syllabus" className="px-4 py-3.5 hover:bg-[#982704] transition-colors">
                Syllabus
              </a>
            )}
          </div>
          
          <Link 
            href="/admin/login" 
            className="text-xs bg-[#cd0808] hover:bg-red-700 px-3 py-1.5 rounded text-white font-bold my-2 mr-2 transition"
          >
            Admin Panel
          </Link>
        </div>
      </nav>

      {/* 3. MARQUEE BANNER (Scrolling News Updates) */}
      {marqueeItems.length > 0 && (
        <div className="bg-[#fffebb] border-b border-gray-300 py-2.5 shadow-inner">
          <div className="container mx-auto max-w-[1100px] px-4 flex items-center gap-2">
            <div className="bg-red-600 text-white text-xs font-black uppercase px-2 py-1 rounded flex items-center gap-1 animate-pulse shrink-0">
              <Flame className="w-3.5 h-3.5" /> Latest
            </div>
            <marquee className="text-xs sm:text-sm font-bold text-blue-900" scrollamount="4">
              {marqueeItems.map((item, idx) => (
                <span key={item.id}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 hover:underline">
                    {item.title}
                  </a>
                  {idx !== marqueeItems.length - 1 && <span className="mx-6 text-gray-400">|</span>}
                </span>
              ))}
            </marquee>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-[1100px] py-6 bg-white shadow-sm border border-gray-200 mt-4 rounded">
        {/* Search Section */}
        <div className="mb-6 bg-gray-50 border border-gray-200 p-4 rounded">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search jobs, results, admit cards, online forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1.5 transition"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </form>
        </div>

        {/* 4. QUICK LINKS / FEATURED LINKS GRID */}
        {quickLinksItems.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {quickLinksItems.map(item => (
                <a 
                  key={item.id}
                  href={item.link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-[#0000ff] bg-blue-50/40 hover:bg-blue-50 hover:shadow transition p-2.5 text-center rounded text-xs font-extrabold text-[#0000c0] flex items-center justify-center min-h-[55px] relative"
                >
                  <span>{item.title}</span>
                  {isNewItem(item.created_at) && (
                    <span className="absolute -top-1.5 -right-1 bg-red-600 text-white text-[9px] px-1 py-0.5 rounded font-black animate-blink">
                      New
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-red-600 rounded-full animate-spin inline-block"></div>
            <p className="text-gray-500 mt-3 text-sm font-bold">Fetching latest recruitment listings...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-semibold">
            No active recruitment sections found. Go to Admin Panel to initialize the database tables.
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 5. PRIMARY 3-COLUMN TABLE GRID (Results, Admit Card, Latest Jobs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded divide-y md:divide-y-0 md:divide-x divide-gray-300">
              
              {/* Column 1: Results */}
              <div id="results" className="flex flex-col bg-white">
                <div className="bg-[#008000] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Results
                </div>
                <div className="p-3 flex-1">
                  {resultsSec && resultsSec.items && resultsSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {resultsSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No active results declared.</p>
                  )}
                </div>
              </div>

              {/* Column 2: Admit Card */}
              <div id="admit-cards" className="flex flex-col bg-white">
                <div className="bg-[#cd0808] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Admit Card
                </div>
                <div className="p-3 flex-1">
                  {admitSec && admitSec.items && admitSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {admitSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No admit cards released.</p>
                  )}
                </div>
              </div>

              {/* Column 3: Latest Jobs */}
              <div id="latest-jobs" className="flex flex-col bg-white">
                <div className="bg-[#0000ff] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Latest Jobs
                </div>
                <div className="p-3 flex-1">
                  {jobsSec && jobsSec.items && jobsSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {jobsSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No active applications open.</p>
                  )}
                </div>
              </div>

            </div>

            {/* 6. SECONDARY 3-COLUMN TABLE GRID (Answer Key, Syllabus, Admission) */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded divide-y md:divide-y-0 md:divide-x divide-gray-300">
              
              {/* Column 1: Answer Key */}
              <div id="answer-keys" className="flex flex-col bg-white">
                <div className="bg-[#7a0c02] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Answer Key
                </div>
                <div className="p-3 flex-1">
                  {answerSec && answerSec.items && answerSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {answerSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No answer keys published.</p>
                  )}
                </div>
              </div>

              {/* Column 2: Syllabus */}
              <div id="syllabus" className="flex flex-col bg-white">
                <div className="bg-[#7a0c02] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Syllabus
                </div>
                <div className="p-3 flex-1">
                  {syllabusSec && syllabusSec.items && syllabusSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {syllabusSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No syllabus files available.</p>
                  )}
                </div>
              </div>

              {/* Column 3: Admission */}
              <div id="admission" className="flex flex-col bg-white">
                <div className="bg-[#7a0c02] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Admission
                </div>
                <div className="p-3 flex-1">
                  {admissionSec && admissionSec.items && admissionSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {admissionSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No admissions listings found.</p>
                  )}
                </div>
              </div>

            </div>

            {/* 7. TERTIARY 2-COLUMN TABLE GRID (Important, Certificate Verification) */}
            <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-300 rounded divide-y md:divide-y-0 md:divide-x divide-gray-300">
              
              {/* Column 1: Important */}
              <div id="important" className="flex flex-col bg-white">
                <div className="bg-[#7a0c02] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Important Info / Updates
                </div>
                <div className="p-3 flex-1">
                  {importantSec && importantSec.items && importantSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {importantSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No notices updated.</p>
                  )}
                </div>
              </div>

              {/* Column 2: Certificate Verification */}
              <div id="verification" className="flex flex-col bg-white">
                <div className="bg-[#7a0c02] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                  Certificate Verification
                </div>
                <div className="p-3 flex-1">
                  {verificationSec && verificationSec.items && verificationSec.items.length > 0 ? (
                    <ul className="space-y-2 text-[13px]">
                      {verificationSec.items.map(item => (
                        <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                          <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                            {item.title}
                          </a>
                          {isNewItem(item.created_at) && (
                            <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                              [New]
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-center py-6 text-xs">No verification requests.</p>
                  )}
                </div>
              </div>

            </div>

            {/* 8. OTHER CUSTOM SECTIONS (Dynamic) */}
            {otherSecs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherSecs.map(section => (
                  <div key={section.id} className="border border-gray-300 rounded overflow-hidden bg-white">
                    <div className="bg-[#7a0c02] text-white font-black text-center py-2.5 text-sm uppercase tracking-wider">
                      {section.title}
                    </div>
                    <div className="p-3">
                      {section.items && section.items.length > 0 ? (
                        <ul className="space-y-2 text-[13px]">
                          {section.items.map(item => (
                            <li key={item.id} className="border-b border-dashed border-gray-100 pb-1.5 last:border-0">
                              <a href={item.link} className="text-blue-800 hover:text-red-600 hover:underline font-semibold leading-relaxed">
                                {item.title}
                              </a>
                              {isNewItem(item.created_at) && (
                                <span className="ml-1.5 text-red-600 text-[10px] font-extrabold uppercase animate-blink">
                                  [New]
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-center py-6 text-xs">No current items.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 9. FAQs Section (Exactly matching reference site) */}
        <div className="mt-12 bg-white border border-gray-200 p-6 rounded shadow-inner">
          <h2 className="text-2xl font-black text-[#05055f] mb-4 border-b border-gray-200 pb-2">FAQ - Sarkari Result</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-700">
            <div>
              <p className="font-extrabold text-gray-900">Q: What is Sarkari Result?</p>
              <p className="mt-1 pl-4 border-l-2 border-red-500">Sarkari Result: Find Latest Sarkari Job Vacancies And Sarkari Exam Results At Next Vacancy. Get All The Information You Need On Govt Jobs And Online Forms, Exam Syllabus, Results, Admit Card In One Place.</p>
            </div>
            <div>
              <p className="font-extrabold text-gray-900">Q: How can I check the latest government job vacancies?</p>
              <p className="mt-1 pl-4 border-l-2 border-red-500">You can visit our official Sarkari Result website and navigate to the &quot;Latest Jobs&quot; section to check the latest government job vacancies.</p>
            </div>
            <div>
              <p className="font-extrabold text-gray-900">Q: How do I download my exam Admit Card?</p>
              <p className="mt-1 pl-4 border-l-2 border-red-500">To download your admit card, navigate to the &quot;Admit Card&quot; column on the homepage, click on your relevant exam name link, and input your registration number and birth date on the official site that opens.</p>
            </div>
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
    </main>
  );
}
