import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab, Currency } from '../types';
import {
  Sprout,
  Bot,
  Camera,
  ClipboardList,
  Calculator,
  Compass,
  ShoppingBag,
  Building2,
  BookOpen,
  TrendingUp,
  FileText,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck,
  User,
  Sun,
  CloudSun,
  MapPin,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    updateUserProfile,
    weather,
    unreadNotificationsCount,
    setIsGlobalSearchOpen,
    notifications,
    markNotificationAsRead,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sprout className="w-4 h-4" /> },
    { id: 'assistant', label: 'AgriAI Chat', icon: <Bot className="w-4 h-4" /> },
    { id: 'diagnosis', label: 'Crop Scan', icon: <Camera className="w-4 h-4" /> },
    { id: 'farm-management', label: 'Farm Manager', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'calculators', label: 'Calculators', icon: <Calculator className="w-4 h-4" /> },
    { id: 'planner', label: 'Farm Planner', icon: <Compass className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'directory', label: 'Agri-Directory', icon: <Building2 className="w-4 h-4" /> },
    { id: 'market-weather', label: 'Prices & Weather', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const currencies: Currency[] = ['NGN', 'USD', 'KES', 'GHS', 'ZAR', 'EUR'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 flex items-center gap-1">
                  Agri<span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase text-stone-500">
                  Agricultural Intelligence
                </span>
              </div>
            </button>

            {/* Quick Live Weather Pill (Desktop) */}
            {weather && (
              <button
                onClick={() => handleNavClick('market-weather')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 font-medium transition-colors ml-2"
                title="View local farm weather insights"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                <span>{weather.current.temp}°C</span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-600 truncate max-w-[110px]">{weather.location}</span>
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 7).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}

            {/* More Dropdown for remaining links */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50">
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-2 hidden group-hover:block hover:block z-50">
                {navItems.slice(7).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-stone-100 my-1"></div>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-stone-600 hover:bg-stone-50"
                >
                  <ShieldCheck className="w-4 h-4 text-stone-400" />
                  Admin Panel
                </button>
              </div>
            </div>
          </nav>

          {/* Right Action Icons: Search, Notifications, Currency, Profile */}
          <div className="flex items-center gap-2">
            {/* Spotlight Search Trigger */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Global Search (Crops, Markets, Directory)"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Farming Notifications
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {unreadNotificationsCount} unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs cursor-pointer hover:bg-stone-50 transition-colors ${
                          !n.read ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-stone-900">{n.title}</p>
                          <span className="text-[10px] text-stone-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-stone-600 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-stone-100 text-center">
                    <button
                      onClick={() => {
                        notifications.forEach((n) => markNotificationAsRead(n.id));
                        setNotificationsOpen(false);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700"
              >
                <span>{userProfile.currency}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>
              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        updateUserProfile({ currency: curr });
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-800 ${
                        userProfile.currency === curr ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Avatar / Quick Switch */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-stone-100 text-stone-700'
              }`}
              title="Farmer Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                {userProfile.name.charAt(0)}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-stone-800 truncate max-w-[100px]">
                {userProfile.name.split(' ')[0]}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-1 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="mb-3 p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-semibold text-emerald-900">
                {userProfile.location.city}, {userProfile.location.country}
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              {userProfile.farmingExperience}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 py-2"
            >
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              Admin Moderation
            </button>
            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-2"
            >
              <User className="w-4 h-4" />
              My Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
