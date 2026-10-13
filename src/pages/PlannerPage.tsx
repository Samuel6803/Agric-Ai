import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateFarmPlan, generateBusinessPlan } from '../services/api';
import Markdown from 'react-markdown';
import {
  Compass,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  MapPin,
  HelpCircle,
  Briefcase,
} from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const { userProfile, currencySymbol } = useApp();

  const [activeMode, setActiveMode] = useState<'farm-plan' | 'business-plan'>('farm-plan');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // Farm Plan Inputs
  const [farmLocation, setFarmLocation] = useState(`${userProfile.location.city}, ${userProfile.location.country}`);
  const [farmSize, setFarmSize] = useState<number>(userProfile.farmSizeHectares || 3);
  const [sizeUnit, setSizeUnit] = useState('Hectares');
  const [enterprise, setEnterprise] = useState('White Maize Cultivation');
  const [budget, setBudget] = useState<number>(1500000);
  const [experience, setExperience] = useState<string>(userProfile.farmingExperience || 'Intermediate');
  const [equipment, setEquipment] = useState('Hired tractor for harrowing, manual knapsack sprayers, bore-hole available');
  const [targetMarket, setTargetMarket] = useState('Local grain feed mills, wholesalers, and retail food markets');
  const [season, setSeason] = useState('Upcoming Rainy / Wet Season');

  // Business Plan Inputs
  const [businessName, setBusinessName] = useState('Heritage Agro-Allied Enterprises');
  const [businessType, setBusinessType] = useState('Commercial Broiler Production & Processing');
  const [bizLocation, setBizLocation] = useState(`${userProfile.location.city}, ${userProfile.location.country}`);
  const [capital, setCapital] = useState<number>(3500000);
  const [bizFarmSize, setBizFarmSize] = useState('2 Standard Broiler Pens (Capacity: 2,500 birds)');
  const [products, setProducts] = useState('Fresh dressed whole broilers, frozen cut parts, organic poultry manure');
  const [targetCustomers, setTargetCustomers] = useState('Supermarkets, fast-food restaurants, hotels, and direct household buyers');
  const [productionCapacity, setProductionCapacity] = useState('1,200 birds processed every 6 weeks cycle');

  const handleGenerateFarmPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResult(null);

    try {
      const plan = await generateFarmPlan({
        location: farmLocation,
        farmSize,
        sizeUnit,
        enterprise,
        budget,
        currency: userProfile.currency,
        experience,
        equipment,
        targetMarket,
        season,
      });
      setGeneratedResult(plan);
    } catch (err: any) {
      setGeneratedResult(`⚠️ Could not generate farm plan: ${err.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBusinessPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResult(null);

    try {
      const plan = await generateBusinessPlan({
        businessName,
        businessType,
        location: bizLocation,
        capital,
        currency: userProfile.currency,
        farmSize: bizFarmSize,
        products,
        targetCustomers,
        productionCapacity,
      });
      setGeneratedResult(plan);
    } catch (err: any) {
      setGeneratedResult(`⚠️ Could not generate business plan: ${err.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeMode === 'farm-plan' ? 'AgriAI_Farm_Production_Plan' : 'AgriAI_Bankable_Business_Plan'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Farm Architecture &amp; Financial Roadmaps</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Farm &amp; Agribusiness Planning Engine
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Convert your farming idea into a structured production calendar or an investor-ready bankable business plan with capital allocations and risk safeguards.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => {
              setActiveMode('farm-plan');
              setGeneratedResult(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'farm-plan' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Farm Production Plan</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('business-plan');
              setGeneratedResult(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'business-plan' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Bankable Business Plan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {activeMode === 'farm-plan' ? (
            /* Farm Plan Form */
            <form
              onSubmit={handleGenerateFarmPlan}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-sm font-bold text-stone-900">Farm Plan Parameters</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  8-Stage Breakdown
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Farmland Location</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Land Size</label>
                  <input
                    type="number"
                    value={farmSize}
                    onChange={(e) => setFarmSize(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Unit</label>
                  <select
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value)}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  >
                    <option value="Hectares">Hectares</option>
                    <option value="Acres">Acres</option>
                    <option value="Plots (50x100ft)">Plots (50x100ft)</option>
                    <option value="Square Meters">Square Meters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Enterprise / Crop</label>
                <input
                  type="text"
                  value={enterprise}
                  onChange={(e) => setEnterprise(e.target.value)}
                  placeholder="e.g. Maize Cultivation, Broiler Farming, Catfish, Tomatoes"
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Available Capital ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Experience Level</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  >
                    <option value="Beginner">Beginner (1st Time)</option>
                    <option value="Intermediate">Intermediate (1-3 years)</option>
                    <option value="Commercial">Experienced Commercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Available Equipment &amp; Water</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="e.g. Hand tools only, Drip irrigation, Tractor lease nearby"
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Market / Off-taker</label>
                <input
                  type="text"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="e.g. Grain aggregators, Urban markets, Supermarket contract"
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Production Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate 8-Stage Farm Plan</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Business Plan Form */
            <form
              onSubmit={handleGenerateBusinessPlan}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-sm font-bold text-stone-900">Agribusiness Plan Parameters</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Bankable 12-Section Format
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Agribusiness Enterprise Type</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Startup Capital ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Operating Location</label>
                  <input
                    type="text"
                    value={bizLocation}
                    onChange={(e) => setBizLocation(e.target.value)}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Scale / Pen / Farmland Size</label>
                <input
                  type="text"
                  value={bizFarmSize}
                  onChange={(e) => setBizFarmSize(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Products &amp; Value-Adds</label>
                <input
                  type="text"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Customers &amp; Off-Takers</label>
                <input
                  type="text"
                  value={targetCustomers}
                  onChange={(e) => setTargetCustomers(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Production Capacity</label>
                <input
                  type="text"
                  value={productionCapacity}
                  onChange={(e) => setProductionCapacity(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authoring Agribusiness Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Bankable Business Plan</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs min-h-[600px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-stone-900">
                    {activeMode === 'farm-plan' ? 'Farm Production Blueprint' : 'Investor Agribusiness Proposal'}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Calculated for regional soil, market, and climatic parameters
                  </p>
                </div>

                {generatedResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700"
                      title="Download Markdown Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700"
                      title="Print Document"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="py-24 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">
                      Structuring Production Phases &amp; Financial Returns...
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      Calibrating input allocations, agronomic timelines, seed density, and risk controls.
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !generatedResult && (
                <div className="py-24 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Compass className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-stone-700">No Plan Generated Yet</p>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    Fill in your enterprise details on the left and click generate to create a detailed agronomic timeline or commercial loan proposal.
                  </p>
                </div>
              )}

              {/* Rendered Plan */}
              {generatedResult && (
                <div className="markdown-body">
                  <Markdown>{generatedResult}</Markdown>
                </div>
              )}
            </div>

            <div className="pt-6 mt-8 border-t border-stone-100 text-[11px] text-stone-500">
              Note: Cash flow projections and crop yield figures represent realistic estimates based on recommended agronomic practices. Actual harvests will vary with seasonal rainfall, pest incursions, and input quality.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
