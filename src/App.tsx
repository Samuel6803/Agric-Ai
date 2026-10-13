import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import { PlannerPage } from './pages/PlannerPage';
import { FarmManagerPage } from './pages/FarmManagerPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { MarketWeatherPage } from './pages/MarketWeatherPage';
import { LearningPage } from './pages/LearningPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';

import {
  MessageSquare,
  Sprout,
  ShieldCheck,
  Heart,
  ExternalLink,
  HelpCircle,
  Wheat,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isGlobalSearchOpen, setIsGlobalSearchOpen } = useApp();

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'assistant':
        return <AssistantPage />;
      case 'diagnosis':
        return <DiagnosticPage />;
      case 'calculators':
        return <CalculatorsPage />;
      case 'planner':
        return <PlannerPage />;
      case 'farm-management':
        return <FarmManagerPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'directory':
        return <DirectoryPage />;
      case 'market-weather':
        return <MarketWeatherPage />;
      case 'learning':
        return <LearningPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'admin':
        return <AdminPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {renderActivePage()}
      </main>

      {/* Floating Action Button for Quick AI Chat (hidden when on Assistant tab or MobileNav) */}
      {activeTab !== 'assistant' && (
        <button
          onClick={() => setActiveTab('assistant')}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 group cursor-pointer"
          title="Ask AgriAI Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-300 absolute -top-0.5 -right-0.5 animate-pulse"></span>
          </div>
          <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
            Ask AgriAI
          </span>
        </button>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Footer */}
      <footer className="hidden md:block bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Wheat className="w-4 h-4" />
                </div>
                <span>AgriAI Platform</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Empowering smallholder farmers, agribusiness managers, and agricultural students with intelligent agronomic decision support, visual pest diagnosis, financial modeling, and direct market access.
              </p>
            </div>

            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Core Capabilities
              </p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('assistant')} className="hover:text-emerald-400 transition-colors">
                    Agricultural AI Assistant
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('diagnosis')} className="hover:text-emerald-400 transition-colors">
                    Vision Plant &amp; Animal Doctor
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculators')} className="hover:text-emerald-400 transition-colors">
                    Farm Precision Calculators
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('planner')} className="hover:text-emerald-400 transition-colors">
                    Bankable Agribusiness Proposals
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Trade &amp; Ecosystem
              </p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('marketplace')} className="hover:text-emerald-400 transition-colors">
                    Commodity &amp; Input Marketplace
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('directory')} className="hover:text-emerald-400 transition-colors">
                    Vetted Veterinary &amp; Tractor Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('market-weather')} className="hover:text-emerald-400 transition-colors">
                    Wholesale Grain Prices &amp; Weather
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('learning')} className="hover:text-emerald-400 transition-colors">
                    Agronomic Extension Manuals
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Governance &amp; Transparency
              </p>
              <p className="text-stone-400 text-[11px] leading-relaxed mb-3">
                AgriAI provides educational, economic, and agronomic guidance. For acute livestock emergencies or regulated quarantine pests, consult licensed state extension officers or registered veterinarians.
              </p>
              <div className="flex items-center gap-2 text-stone-500 text-[10px]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Hallucination Guardrails Active</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-2">
            <p>&copy; {new Date().getFullYear()} AgriAI Agricultural Business Platform. Powered by Google Gemini AI.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('admin')} className="hover:text-stone-400 transition-colors">
                System Health
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('documents')} className="hover:text-stone-400 transition-colors">
                Agri Invoicing
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('profile')} className="hover:text-stone-400 transition-colors">
                Preferences
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
