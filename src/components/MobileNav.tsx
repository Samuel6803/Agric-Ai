import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import {
  Sprout,
  Bot,
  Camera,
  ClipboardList,
  ShoppingBag,
  MoreHorizontal,
  Calculator,
  Compass,
  Building2,
  TrendingUp,
  BookOpen,
  FileText,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const mainTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sprout className="w-5 h-5" /> },
    { id: 'assistant', label: 'AgriAI', icon: <Bot className="w-5 h-5" /> },
    { id: 'diagnosis', label: 'Scan', icon: <Camera className="w-5 h-5" /> },
    { id: 'farm-management', label: 'Manager', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'marketplace', label: 'Market', icon: <ShoppingBag className="w-5 h-5" /> },
  ];

  const moreItems: { id: NavigationTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'calculators', label: 'Farm Calculators', icon: <Calculator className="w-5 h-5 text-emerald-600" />, desc: 'Profit, feed, spacing & fertilizer' },
    { id: 'planner', label: 'Farm & Business Plans', icon: <Compass className="w-5 h-5 text-blue-600" />, desc: 'AI production schedules & bank plans' },
    { id: 'directory', label: 'Agri-Business Directory', icon: <Building2 className="w-5 h-5 text-purple-600" />, desc: 'Vets, feed mills, suppliers & silos' },
    { id: 'market-weather', label: 'Prices & Weather', icon: <TrendingUp className="w-5 h-5 text-amber-600" />, desc: 'Live commodities & meteorological advice' },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen className="w-5 h-5 text-teal-600" />, desc: 'Crop manuals, livestock guides & glossary' },
    { id: 'documents', label: 'Documents & Invoices', icon: <FileText className="w-5 h-5 text-indigo-600" />, desc: 'Agri receipts, bills & field reports' },
    { id: 'profile', label: 'My Farm Profile', icon: <User className="w-5 h-5 text-stone-600" />, desc: 'Location, scale, currency & settings' },
    { id: 'admin', label: 'Admin Moderation', icon: <ShieldCheck className="w-5 h-5 text-rose-600" />, desc: 'Review listings, businesses & flags' },
  ];

  return (
    <>
      {/* Fixed Bottom Bar on Small Screens */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {mainTabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMoreDrawerOpen(false);
                }}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-700 font-bold bg-emerald-50'
                    : 'text-stone-500 hover:text-stone-900 font-medium'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setMoreDrawerOpen(true)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all ${
              moreDrawerOpen ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-stone-500 hover:text-stone-900 font-medium'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Slide-up "More" Drawer for Mobile */}
      {moreDrawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-sm font-extrabold text-stone-900 tracking-tight">
                All AgriAI Features
              </span>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMoreDrawerOpen(false);
                  }}
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    activeTab === item.id
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                      : 'border-stone-100 hover:border-stone-200 bg-stone-50/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-stone-100">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900">{item.label}</p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
