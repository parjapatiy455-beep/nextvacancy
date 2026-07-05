'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Section, SectionItem } from '@/lib/types';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<(Section & { items: SectionItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    color: 'bg-red-600',
    icon: '',
    order_index: 0,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sections');
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

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ title: '', color: 'bg-red-600', icon: '', order_index: 0 });
        setShowAddForm(false);
        fetchSections();
      }
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const colorOptions = [
    { value: 'bg-red-600', label: 'Red' },
    { value: 'bg-green-600', label: 'Green' },
    { value: 'bg-blue-600', label: 'Blue' },
    { value: 'bg-purple-600', label: 'Purple' },
    { value: 'bg-yellow-600', label: 'Yellow' },
    { value: 'bg-orange-600', label: 'Orange' },
    { value: 'bg-pink-600', label: 'Pink' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Sections</h1>
        <p className="text-gray-600">Create and manage homepage sections and their items</p>
      </div>

      {/* Add New Section Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium mb-6"
        >
          <Plus className="w-5 h-5" />
          Add New Section
        </button>
      )}

      {/* Add Section Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Section</h2>
          <form onSubmit={handleAddSection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Latest Jobs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon/Emoji
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 💼 or 📋"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save Section
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No sections yet. Create your first section!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Section
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Section Header */}
              <div className={`${section.color} text-white px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{section.title}</h3>
                    <p className="text-white text-opacity-90 text-sm">{section.items?.length || 0} items</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/sections/${section.id}`}
                    className="bg-white text-gray-900 p-2 rounded hover:bg-gray-100 transition"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Delete this section and all its items?')) {
                        // Delete section
                      }
                    }}
                    className="bg-white text-red-600 p-2 rounded hover:bg-gray-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Section Items */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                {section.items && section.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500 truncate">{item.link}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Delete this item?')) {
                              // Delete item
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items in this section</p>
                )}

                <button
                  onClick={() => {
                    // Navigate to add item page
                  }}
                  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
