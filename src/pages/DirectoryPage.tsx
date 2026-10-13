import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AgribusinessCategory, AgribusinessProfile } from '../types';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Star,
  Plus,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { businesses, addBusiness, userProfile } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Business Form State
  const [newBiz, setNewBiz] = useState({
    name: '',
    category: 'Veterinary Clinics' as AgribusinessCategory,
    description: '',
    location: `${userProfile.location.city}, ${userProfile.location.state || userProfile.location.country}`,
    phone: '+234 800 000 0000',
    email: '',
    openingHours: 'Mon - Sat: 8:00 AM - 5:00 PM',
    verified: true,
    rating: 5.0,
    reviewCount: 1,
    services: '',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
  });

  const categories = [
    'All',
    'Veterinary Clinics',
    'Equipment Suppliers',
    'Seed Producers',
    'Storage & Silos',
    'Farm Consultants',
    'Feed Mills',
    'Fertilizer Distributors',
  ];

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
      const matchCat = selectedCategory === 'All' || biz.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [businesses, selectedCategory, searchQuery]);

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiz.name.trim()) return;

    addBusiness({
      ...newBiz,
      services: newBiz.services.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setShowAddModal(false);
    setNewBiz({
      name: '',
      category: 'Veterinary Clinics',
      description: '',
      location: `${userProfile.location.city}, ${userProfile.location.state || userProfile.location.country}`,
      phone: '+234 800 000 0000',
      email: '',
      openingHours: 'Mon - Sat: 8:00 AM - 5:00 PM',
      verified: true,
      rating: 5.0,
      reviewCount: 1,
      services: '',
      imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Agricultural Ecosystem &amp; Service Providers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Agri-Business Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Locate certified veterinary doctors, tractor mechanization rental hubs, accredited seed breeders, hermetic cold storage facilities, and agricultural consultants.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Agribusiness</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search veterinary doctors, tractor rentals, cold silos, foundation seeds..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 border-t border-stone-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Badge */}
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img
                  src={biz.imageUrl}
                  alt={biz.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {biz.category}
                </span>

                {biz.verified && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" /> Accredited
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">{biz.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{biz.rating}</span>
                    <span className="text-stone-400 font-normal">({biz.reviewCount} farm audits)</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {biz.description}
                </p>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {biz.services.map((svc, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                    >
                      {svc}
                    </span>
                  ))}
                </div>

                {/* Contact Meta */}
                <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{biz.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{biz.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Contact Buttons */}
            <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center gap-2">
              <a
                href={`tel:${biz.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Center</span>
              </a>
              {biz.email && (
                <a
                  href={`mailto:${biz.email}`}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD BUSINESS MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">
                Register Your Agribusiness Profile
              </h3>
              <p className="text-xs text-stone-500">
                Reach regional farmers and agricultural enterprises across the directory
              </p>
            </div>

            <form onSubmit={handleCreateBusiness} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  value={newBiz.name}
                  onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })}
                  placeholder="e.g. AgroSafe Veterinary Advisory Ltd"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Service Category</label>
                <select
                  value={newBiz.category}
                  onChange={(e) => setNewBiz({ ...newBiz, category: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Veterinary Clinics">Veterinary Clinics</option>
                  <option value="Equipment Suppliers">Equipment Suppliers / Tractor Hubs</option>
                  <option value="Seed Producers">Certified Seed Producers</option>
                  <option value="Storage & Silos">Storage &amp; Cold Silos</option>
                  <option value="Farm Consultants">Farm Consultants &amp; Valuers</option>
                  <option value="Feed Mills">Feed Mills</option>
                  <option value="Fertilizer Distributors">Fertilizer Distributors</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Services Offered (Comma Separated)</label>
                <input
                  type="text"
                  value={newBiz.services}
                  onChange={(e) => setNewBiz({ ...newBiz, services: e.target.value })}
                  placeholder="e.g. Vaccination, Tractor Leasing, Seed Testing"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={newBiz.description}
                  onChange={(e) => setNewBiz({ ...newBiz, description: e.target.value })}
                  placeholder="Describe your capabilities, years in business, certifications..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Address / City, State</label>
                  <input
                    type="text"
                    value={newBiz.location}
                    onChange={(e) => setNewBiz({ ...newBiz, location: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Telephone / Hotline</label>
                  <input
                    type="text"
                    value={newBiz.phone}
                    onChange={(e) => setNewBiz({ ...newBiz, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={newBiz.email}
                    onChange={(e) => setNewBiz({ ...newBiz, email: e.target.value })}
                    placeholder="contact@business.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={newBiz.openingHours}
                    onChange={(e) => setNewBiz({ ...newBiz, openingHours: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                >
                  Publish Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
