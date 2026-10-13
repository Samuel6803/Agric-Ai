import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  MapPin,
  Globe,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Save,
  HelpCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useApp();

  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    farmName: userProfile.farmName,
    city: userProfile.location.city,
    state: userProfile.location.state || '',
    country: userProfile.location.country,
    farmSizeHectares: userProfile.farmSizeHectares,
    farmingExperience: userProfile.farmingExperience,
    primaryEnterprises: (userProfile.primaryEnterprises || userProfile.farmingInterests || []).join(', '),
    currency: userProfile.currency,
    language: userProfile.language || 'English',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      farmName: formData.farmName,
      location: {
        ...userProfile.location,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      },
      farmSizeHectares: Number(formData.farmSizeHectares),
      farmingExperience: formData.farmingExperience,
      primaryEnterprises: formData.primaryEnterprises
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      currency: formData.currency,
      language: formData.language,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            <span>Farm Enterprise Profile &amp; Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Farmer Profile &amp; Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Personalize your agronomic recommendations, currency defaults, and farm scale.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            Farmer &amp; Enterprise Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Farm / Business Name</label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Farming Experience</label>
              <select
                value={formData.farmingExperience}
                onChange={(e) => setFormData({ ...formData, farmingExperience: e.target.value as any })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="Beginner">Beginner (1st Time Farmer)</option>
                <option value="Intermediate">Intermediate (1 - 4 Years)</option>
                <option value="Commercial">Commercial / Seasoned Expert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Scale */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            Location &amp; Farmland Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">City / Town</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Farm Size (Hectares)</label>
              <input
                type="number"
                step="0.5"
                value={formData.farmSizeHectares}
                onChange={(e) => setFormData({ ...formData, farmSizeHectares: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Primary Enterprises (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.primaryEnterprises}
                onChange={(e) => setFormData({ ...formData, primaryEnterprises: e.target.value })}
                placeholder="e.g. Maize, Broilers, Catfish"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Currency & Language Localization */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            Financial &amp; Linguistic Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Currency Preference</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="KES">KES (KSh - Kenyan Shilling)</option>
                <option value="GHS">GHS (GH₵ - Ghanaian Cedi)</option>
                <option value="ZAR">ZAR (R - South African Rand)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Preferred Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              >
                <option value="English">English</option>
                <option value="Hausa">Hausa</option>
                <option value="Yoruba">Yoruba</option>
                <option value="Igbo">Igbo</option>
                <option value="Swahili">Swahili</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile &amp; Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
