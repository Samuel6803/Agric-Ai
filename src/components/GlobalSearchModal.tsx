import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Sprout, ShoppingBag, Building2, BookOpen, Calculator, Bot, ArrowRight } from 'lucide-react';
import { AGRICULTURAL_GLOSSARY } from '../data/mockData';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    setActiveTab,
    setInitialAssistantQuery,
    listings,
    businesses,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    // 1. Marketplace products
    const matchedListings = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
    );

    // 2. Businesses
    const matchedBusinesses = businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.services.some((s) => s.toLowerCase().includes(q)) ||
        b.location.toLowerCase().includes(q)
    );

    // 3. Glossary & Terms
    const matchedTerms = AGRICULTURAL_GLOSSARY.filter(
      (g) => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)
    );

    // 4. Common Suggested Agricultural Questions
    const sampleQuestions = [
      'What should I plant this month?',
      'Why are tomato leaves turning yellow?',
      'How to start poultry farming with small capital?',
      'How much NPK fertilizer for 2 hectares maize?',
      'What feed should I give day-old broiler chicks?',
      'How to control fall armyworm organically?',
      'Best spacing for plantain suckers?',
      'How to calculate farm profit and break-even point?',
    ].filter((sq) => sq.toLowerCase().includes(q));

    return {
      listings: matchedListings,
      businesses: matchedBusinesses,
      terms: matchedTerms,
      questions: sampleQuestions,
    };
  }, [query, listings, businesses]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crops, pests, market produce, businesses, glossary..."
            className="w-full text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Default Quick Shortcuts when query is empty */}
          {!query.trim() && (
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Quick Navigation & Popular Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setInitialAssistantQuery('What crops should I plant this season for maximum profit?');
                    setActiveTab('assistant');
                    setIsGlobalSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-left text-xs font-semibold text-stone-800 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-600" />
                    What to plant this season?
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('diagnosis');
                    setIsGlobalSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-left text-xs font-semibold text-stone-800 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    Crop Disease Scan
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('calculators');
                    setIsGlobalSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-left text-xs font-semibold text-stone-800 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    Farm Calculators
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('marketplace');
                    setIsGlobalSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-left text-xs font-semibold text-stone-800 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    Agricultural Marketplace
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* Render Active Results */}
          {searchResults && (
            <>
              {/* Ask AgriAI questions */}
              {searchResults.questions.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    Ask AgriAI Assistant
                  </p>
                  <div className="space-y-1">
                    {searchResults.questions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInitialAssistantQuery(q);
                          setActiveTab('assistant');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-semibold text-stone-800 flex items-center justify-between group"
                      >
                        <span>"{q}"</span>
                        <span className="text-[11px] text-emerald-600 font-bold group-hover:underline">
                          Ask Now &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketplace items */}
              {searchResults.listings.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    Marketplace Listings ({searchResults.listings.length})
                  </p>
                  <div className="space-y-1.5">
                    {searchResults.listings.slice(0, 4).map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setActiveTab('marketplace');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-stone-100 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-stone-900">{l.title}</p>
                          <p className="text-[11px] text-stone-500">
                            {l.category} • {l.location}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-700">
                          {l.currency} {l.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Businesses */}
              {searchResults.businesses.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    Agri-Businesses ({searchResults.businesses.length})
                  </p>
                  <div className="space-y-1.5">
                    {searchResults.businesses.slice(0, 3).map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setActiveTab('directory');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-stone-100 hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-stone-900">{b.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {b.category} • {b.location}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-purple-700">
                          ★ {b.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary terms */}
              {searchResults.terms.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    Agricultural Terminology
                  </p>
                  <div className="space-y-2">
                    {searchResults.terms.slice(0, 3).map((t, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-stone-50 text-xs">
                        <p className="font-bold text-stone-900">{t.term}</p>
                        <p className="text-stone-600 mt-0.5 text-[11px]">{t.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.questions.length === 0 &&
                searchResults.listings.length === 0 &&
                searchResults.businesses.length === 0 &&
                searchResults.terms.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm font-semibold text-stone-600">
                      No exact results found for "{query}".
                    </p>
                    <button
                      onClick={() => {
                        setInitialAssistantQuery(query);
                        setActiveTab('assistant');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Bot className="w-4 h-4" />
                      Ask AgriAI to answer "{query}"
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
