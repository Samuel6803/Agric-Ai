import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceCategory, MarketplaceListing } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Tag,
  Star,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const {
    listings,
    addListing,
    deleteListing,
    formatCurrency,
    userProfile,
    setActiveTab,
    setInitialAssistantQuery,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [contactModalListing, setContactModalListing] = useState<MarketplaceListing | null>(null);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: '',
    category: 'Produce' as MarketplaceCategory,
    description: '',
    price: 0,
    currency: userProfile.currency,
    unit: '100kg bag',
    quantityAvailable: 10,
    location: `${userProfile.location.city}, ${userProfile.location.state || userProfile.location.country}`,
    sellerName: userProfile.name,
    sellerPhone: '+234 803 000 0000',
    sellerRating: 5.0,
    sellerVerified: true,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    status: 'active' as const,
  });

  const categories = ['All', 'Produce', 'Livestock', 'Seeds', 'Fertilizers', 'Equipment', 'Feeds'];

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLoc =
        selectedLocation === 'All' || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchCat && matchQuery && matchLoc;
    });
  }, [listings, selectedCategory, searchQuery, selectedLocation]);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title.trim() || newListing.price <= 0) return;

    addListing(newListing);
    setShowAddModal(false);
    setNewListing({
      title: '',
      category: 'Produce',
      description: '',
      price: 0,
      currency: userProfile.currency,
      unit: '100kg bag',
      quantityAvailable: 10,
      location: `${userProfile.location.city}, ${userProfile.location.state || userProfile.location.country}`,
      sellerName: userProfile.name,
      sellerPhone: '+234 803 000 0000',
      sellerRating: 5.0,
      sellerVerified: true,
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      status: 'active',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Direct Agricultural Trade &amp; Commodities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Directly buy or sell grains, vegetables, point-of-lay pullets, foundation seeds, tractor equipment, and animal feeds without middleman inflation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Produce or Equipment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search maize, cassava, day-old chicks, knapsack sprayers, seeds..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Kano">Kano</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Oyo">Oyo / Ibadan</option>
              <option value="Ogun">Ogun / Abeokuta</option>
              <option value="Lagos">Lagos</option>
              <option value="Taraba">Taraba</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 border-t border-stone-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                  {listing.category}
                </span>

                {listing.sellerVerified && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" /> Verified Seller
                  </span>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1">{listing.title}</h3>
                </div>

                <p className="text-lg font-black text-emerald-700">
                  {listing.currency} {listing.price.toLocaleString()}
                  <span className="text-xs font-normal text-stone-500 ml-1">/ {listing.unit}</span>
                </p>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {listing.description}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {listing.location}
                  </span>
                  <span className="font-semibold text-stone-700">
                    Stock: {listing.quantityAvailable} {listing.unit}s
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Bar & CTA */}
            <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {listing.sellerName.charAt(0)}
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-stone-900 truncate max-w-[110px]">{listing.sellerName}</p>
                  <p className="text-amber-600 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {listing.sellerRating}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setContactModalListing(listing)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Contact Seller
              </button>
            </div>
          </div>
        ))}

        {filteredListings.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">No listings found</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              We couldn't find items matching "{searchQuery}" in "{selectedCategory}". Try broadening your filters or post a new listing.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedLocation('All');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline pt-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* --- POST LISTING MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">
                Post Produce, Seeds or Farm Equipment
              </h3>
              <p className="text-xs text-stone-500">
                List your items directly on the AgriAI verified marketplace
              </p>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Listing Title</label>
                <input
                  type="text"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  placeholder="e.g. Dry White Maize (100kg Bags)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Produce">Produce / Grains</option>
                    <option value="Livestock">Livestock / Poultry</option>
                    <option value="Seeds">Seeds &amp; Tubers</option>
                    <option value="Fertilizers">Fertilizers &amp; Boosters</option>
                    <option value="Equipment">Farm Equipment</option>
                    <option value="Feeds">Feeds &amp; Nutrition</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Price per Unit ({newListing.currency})
                  </label>
                  <input
                    type="number"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Unit Description</label>
                  <input
                    type="text"
                    value={newListing.unit}
                    onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                    placeholder="e.g. 100kg bag, bird, crate"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Quantity Available</label>
                  <input
                    type="number"
                    value={newListing.quantityAvailable}
                    onChange={(e) =>
                      setNewListing({ ...newListing, quantityAvailable: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Item Description &amp; Quality Specs</label>
                <textarea
                  rows={3}
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  placeholder="e.g. Sun-dried, moisture under 12%, no weevil infestation..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Location (City, State)</label>
                  <input
                    type="text"
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Seller Contact Phone</label>
                  <input
                    type="text"
                    value={newListing.sellerPhone}
                    onChange={(e) => setNewListing({ ...newListing, sellerPhone: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
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
                  className="px-5 py-2 font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONTACT SELLER MODAL --- */}
      {contactModalListing && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-stone-200 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Connect with Seller</h3>
              <p className="text-xs text-stone-500">{contactModalListing.title}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Seller / Farm:</span>
                <strong className="text-stone-900 font-bold">{contactModalListing.sellerName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Location:</span>
                <strong className="text-stone-900 font-bold">{contactModalListing.location}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Unit Price:</span>
                <strong className="text-emerald-700 font-black text-sm">
                  {contactModalListing.currency} {contactModalListing.price.toLocaleString()} / {contactModalListing.unit}
                </strong>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`tel:${contactModalListing.sellerPhone}`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Seller ({contactModalListing.sellerPhone})</span>
              </a>

              <button
                onClick={() => {
                  const inquiry = `Hello ${contactModalListing.sellerName}, I saw your listing for "${contactModalListing.title}" (${contactModalListing.currency} ${contactModalListing.price.toLocaleString()} / ${contactModalListing.unit}) on AgriAI. I am interested in purchasing.`;
                  setInitialAssistantQuery(`Draft a professional purchase inquiry or contract message to buy ${contactModalListing.title} from ${contactModalListing.sellerName} at ${contactModalListing.currency} ${contactModalListing.price}.`);
                  setActiveTab('assistant');
                  setContactModalListing(null);
                }}
                className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Draft Purchase Proposal with AgriAI</span>
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              Safety Advice: Inspect agricultural produce, check grain moisture, or verify veterinary records before remitting full bank transfers.
            </p>

            <div className="text-center pt-2">
              <button
                onClick={() => setContactModalListing(null)}
                className="text-xs font-bold text-stone-500 hover:text-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
