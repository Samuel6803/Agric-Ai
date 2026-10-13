import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  Bot,
  Camera,
  ClipboardList,
  Calculator,
  Compass,
  ShoppingBag,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CloudSun,
  Flame,
  HelpCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    setActiveTab,
    setInitialAssistantQuery,
    weather,
    marketPrices,
    formatCurrency,
    userProfile,
  } = useApp();

  const [questionInput, setQuestionInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      setInitialAssistantQuery(questionInput.trim());
      setActiveTab('assistant');
    } else {
      setActiveTab('assistant');
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInitialAssistantQuery(promptText);
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white p-6 sm:p-10 lg:p-14 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Agricultural Business & Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Learn, Plan, Manage &amp; Grow Your{' '}
            <span className="text-emerald-400">Agricultural Business</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            The intelligent companion for farmers, agribusinesses, agricultural students, and food producers.
            Ask questions in everyday language, diagnose crop diseases, calculate production costs, and trade in the marketplace.
          </p>

          {/* Natural Language Prompt Query Bar */}
          <form
            onSubmit={handleAskSubmit}
            className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto text-stone-900"
          >
            <div className="flex items-center gap-3 w-full px-3 py-1.5">
              <Bot className="w-6 h-6 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask anything: &ldquo;How do I start poultry with ₦500,000?&rdquo;"
                className="w-full text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Ask AgriAI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dual Action Prominent CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setInitialAssistantQuery('What should I plant this season for my location and budget?');
                setActiveTab('assistant');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Ask AgriAI
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 font-bold text-xs sm:text-sm transition-all"
            >
              Start Your Farm
            </button>
            <button
              onClick={() => setActiveTab('diagnosis')}
              className="px-5 py-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-emerald-300 border border-emerald-500/30 font-semibold text-xs sm:text-sm transition-all inline-flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              Scan Sick Crop / Pest
            </button>
          </div>

          {/* Frequent Question Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] font-semibold text-stone-400">Popular:</span>
            {[
              'Why are my tomato leaves turning yellow?',
              'Calculate cost of raising 500 chickens',
              'What fertilizer does maize need at 3 weeks?',
              'Current market price of white maize',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(chip)}
                className="text-[11px] font-medium px-3 py-1 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700/60 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Commodity Ticker & Weather Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Market Highlights */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-stone-900">Live Agricultural Market Prices</h2>
            </div>
            <button
              onClick={() => setActiveTab('market-weather')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Full Board &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {marketPrices.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab('market-weather')}
                className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-100 cursor-pointer transition-colors"
              >
                <p className="text-[11px] font-bold text-stone-700 truncate">{item.commodity}</p>
                <p className="text-sm font-extrabold text-stone-900 mt-1">
                  {formatCurrency(item.price)}
                  <span className="text-[10px] font-normal text-stone-500"> / {item.unit}</span>
                </p>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                  <span className="truncate">{item.market.split(' ')[0]}</span>
                  <span className={`font-bold ${item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-rose-600' : 'text-stone-500'}`}>
                    {item.change24h > 0 ? `+${item.change24h}%` : `${item.change24h}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Weather & Farm Agronomic Advice */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-amber-500" />
                Live Farm Meteorology
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {userProfile.location.city}
              </span>
            </div>

            {weather ? (
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">{weather.current.temp}°C</span>
                  <span className="text-xs font-semibold text-stone-500">{weather.current.condition}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                  <span>Humidity: {weather.current.humidity}%</span>
                  <span>Wind: {weather.current.windSpeed} km/h</span>
                </div>
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900">
                  <span className="font-bold">Agronomic Insight: </span>
                  {weather.current.farmAdvice}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 mt-3">Loading regional meteorological conditions...</p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('market-weather')}
            className="text-xs font-bold text-emerald-700 hover:underline pt-2 text-right"
          >
            7-Day Forecast & Rain Odds &rarr;
          </button>
        </div>
      </section>

      {/* Primary Feature Hub (Bento Style) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Core Agribusiness Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Everything required to run a productive, commercially viable farm in one connected platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: AgriAI Assistant */}
          <div
            onClick={() => setActiveTab('assistant')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                AgriAI Expert Assistant
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ask about crop varieties, poultry feeding formulas, land preparation, pest defense, and farm business advice in simple, step-by-step natural language.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 gap-1">
              <span>Start Conversation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: AI Crop & Pest Scanner */}
          <div
            onClick={() => setActiveTab('diagnosis')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                AI Crop &amp; Pest Diagnostics
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upload leaf or plant photos to analyze symptoms, identify fungal blights, bacterial rot, nutrient chlorosis, or insect pests, with safe management steps.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>Upload / Scan Photo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Farm Calculators & Budgets */}
          <div
            onClick={() => setActiveTab('calculators')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-700 transition-colors">
                Agricultural Calculators
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calculate break-even points, gross/net profits, crop spacing seed requirements, NPK fertilizer dosages, and livestock feed conversion ratios (FCR).
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-blue-700 gap-1">
              <span>Open Calculators</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Farm Records & Financials */}
          <div
            onClick={() => setActiveTab('farm-management')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                Farm Management &amp; Records
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Log daily farm activities, track production expenses, register produce sales, monitor feed/fertilizer inventory, and audit flock/herd headcounts.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-purple-700 gap-1">
              <span>View Farm Records</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Agricultural Marketplace */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                Agricultural Marketplace
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Buy and sell grains, vegetables, day-old chicks, livestock, foundation seeds, knapsack sprayers, fertilizers, and connect with verified buyers.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-amber-700 gap-1">
              <span>Browse Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: AI Business & Production Planner */}
          <div
            onClick={() => setActiveTab('planner')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-indigo-700 transition-colors">
                Farm &amp; Business Plans
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generate 8-stage production schedules or full 12-section bankable agribusiness proposals with cash flow projections and risk mitigation roadmaps.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-indigo-700 gap-1">
              <span>Generate Plans</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Agricultural Specialties Grid */}
      <section className="bg-stone-100/70 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Specialized Crop &amp; Livestock Knowledge
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Engineered with deep agronomic data across tropical and temperate farming systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Farming Panel */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Crop Farming Specialties</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'White & Yellow Maize',
                'Paddy & Milled Rice',
                'Cassava (Tubers & Stems)',
                'Yam (Mini-sett & Tubers)',
                'Plantain & Banana',
                'Roma Tomatoes',
                'Hot & Sweet Pepper',
                'Onions',
                'Soybeans & Cowpeas',
                'Groundnuts',
                'Irish & Sweet Potatoes',
                'Cocoa & Oil Palm',
              ].map((c, i) => (
                <span
                  key={i}
                  onClick={() => handleQuickPrompt(`Give me complete planting, spacing, and fertilization guide for ${c}`)}
                  className="cursor-pointer text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-stone-500">
              Guidance includes land prep, certified seed varieties, planting spacing, weed/pest management, irrigation, harvesting, and post-harvest hermetic storage.
            </p>
          </div>

          {/* Livestock Panel */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Livestock &amp; Aquaculture</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Broiler Chickens',
                'Commercial Layers',
                'Noiler / Cockerels',
                'African Catfish (Clarias)',
                'Tilapia Aquaculture',
                'Goats (Boer & Red Sokoto)',
                'Sheep & Rams',
                'Commercial Swine / Pigs',
                'Rabbits',
                'Giant African Land Snails',
                'Apiculture (Beekeeping)',
              ].map((l, i) => (
                <span
                  key={i}
                  onClick={() => handleQuickPrompt(`What are the housing, feeding requirements, and cost breakdown for raising ${l}?`)}
                  className="cursor-pointer text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200 transition-colors"
                >
                  {l}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-stone-500">
              Covers housing design, brooding temperature, feed formulation, routine vaccination schedules, and water quality testing with cautious veterinary safety protocols.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Reliable Foundation Disclaimer */}
      <section className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
          <p>
            <strong className="text-stone-900">Responsible Agricultural Intelligence:</strong> AgriAI clearly distinguishes verified facts, mathematical estimates, and recommendations. For critical livestock symptoms or chemical pesticide hazards, we advocate certified veterinary and agronomic extension support.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('directory')}
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-white border border-stone-300 font-bold text-stone-800 hover:bg-stone-50"
        >
          Find Local Vets &amp; Experts
        </button>
      </section>
    </div>
  );
};
