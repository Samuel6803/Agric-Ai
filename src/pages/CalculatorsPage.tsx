import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Sprout,
  Flame,
  CheckCircle2,
  Info,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

type CalculatorTab = 'profit' | 'spacing' | 'fertilizer' | 'livestock-feed';

export const CalculatorsPage: React.FC = () => {
  const { userProfile, formatCurrency, currencySymbol } = useApp();
  const [activeCalc, setActiveCalc] = useState<CalculatorTab>('profit');

  // --- 1. Profitability & Break-Even State ---
  const [produceName, setProduceName] = useState('White Maize');
  const [expectedYield, setExpectedYield] = useState<number>(40); // e.g. 40 bags
  const [yieldUnit, setYieldUnit] = useState('100kg bags');
  const [unitSellingPrice, setUnitSellingPrice] = useState<number>(68000);
  const [landPreparationCost, setLandPreparationCost] = useState<number>(120000);
  const [seedCost, setSeedCost] = useState<number>(90000);
  const [fertilizerCost, setFertilizerCost] = useState<number>(380000);
  const [laborCost, setLaborCost] = useState<number>(240000);
  const [otherCosts, setOtherCosts] = useState<number>(150000);

  // Computations
  const totalCost = landPreparationCost + seedCost + fertilizerCost + laborCost + otherCosts;
  const grossRevenue = expectedYield * unitSellingPrice;
  const netProfit = grossRevenue - totalCost;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const breakEvenUnits = unitSellingPrice > 0 ? totalCost / unitSellingPrice : 0;
  const breakEvenPrice = expectedYield > 0 ? totalCost / expectedYield : 0;

  // --- 2. Spacing & Plant Population State ---
  const [landSize, setLandSize] = useState<number>(1);
  const [landSizeUnit, setLandSizeUnit] = useState<'hectares' | 'acres' | 'sqm'>('hectares');
  const [rowSpacingCm, setRowSpacingCm] = useState<number>(75);
  const [plantSpacingCm, setPlantSpacingCm] = useState<number>(25);
  const [seedsPerHole, setSeedsPerHole] = useState<number>(1);

  // Convert area to m²
  const areaSqm =
    landSizeUnit === 'hectares'
      ? landSize * 10000
      : landSizeUnit === 'acres'
      ? landSize * 4046.86
      : landSize;

  const plantSpacingMeters = (rowSpacingCm / 100) * (plantSpacingCm / 100);
  const totalPlantPopulation = plantSpacingMeters > 0 ? Math.floor(areaSqm / plantSpacingMeters) : 0;
  const totalSeedsNeeded = totalPlantPopulation * seedsPerHole;
  // Approximation: average maize 4,000 seeds per kg
  const estimatedSeedWeightKg = (totalSeedsNeeded / 4000).toFixed(1);

  // --- 3. Fertilizer Estimator State ---
  const [cropType, setCropType] = useState('Maize / Corn');
  const [fertAreaHa, setFertAreaHa] = useState<number>(2);
  const [fertSoilType, setFertSoilType] = useState('Loamy Soil (Moderate Fertility)');
  const [fertType, setFertType] = useState('NPK 15-15-15 + Urea 46%');
  const [bagPrice, setBagPrice] = useState<number>(38000);

  // Standard agronomic recommendations: ~4-6 bags NPK basal + 2-3 bags Urea top-dress per ha
  const basalBagsPerHa = fertSoilType.includes('Sandy') ? 6 : 5;
  const topDressBagsPerHa = 3;
  const totalBagsNeeded = (basalBagsPerHa + topDressBagsPerHa) * fertAreaHa;
  const totalFertCost = totalBagsNeeded * bagPrice;

  // --- 4. Livestock Feed & FCR State ---
  const [animalCategory, setAnimalCategory] = useState<'Broilers' | 'Catfish' | 'Layers' | 'Pigs'>('Broilers');
  const [flockCount, setFlockCount] = useState<number>(500);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(2.2); // kg
  const [expectedFcr, setExpectedFcr] = useState<number>(1.65);
  const [feedBagKg, setFeedBagKg] = useState<number>(25);
  const [feedBagPrice, setFeedBagPrice] = useState<number>(19500);

  // Computations:
  // Total meat produced = flockCount * targetWeightKg
  const totalBiomassProducedKg = flockCount * targetWeightKg;
  // Total feed required = totalBiomassProducedKg * expectedFcr
  const totalFeedKg = totalBiomassProducedKg * expectedFcr;
  const totalFeedBags = Math.ceil(totalFeedKg / feedBagKg);
  const totalFeedExpense = totalFeedBags * feedBagPrice;
  const feedCostPerKgMeat = totalBiomassProducedKg > 0 ? totalFeedExpense / totalBiomassProducedKg : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Farm Financial &amp; Agronomic Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Agricultural Calculators &amp; Estimators
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Project profits, plant populations, fertilizer requirements, and feed conversion ratios with transparent, field-tested formulas.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveCalc('profit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCalc === 'profit' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Profit &amp; Break-Even
          </button>
          <button
            onClick={() => setActiveCalc('spacing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCalc === 'spacing' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Spacing &amp; Seeds
          </button>
          <button
            onClick={() => setActiveCalc('fertilizer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCalc === 'fertilizer' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Fertilizer NPK
          </button>
          <button
            onClick={() => setActiveCalc('livestock-feed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCalc === 'livestock-feed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Feed &amp; FCR
          </button>
        </div>
      </div>

      {/* --- 1. PROFIT & BREAK-EVEN CALCULATOR --- */}
      {activeCalc === 'profit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Production Expenses &amp; Projected Revenue
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Crop / Enterprise</label>
                <input
                  type="text"
                  value={produceName}
                  onChange={(e) => setProduceName(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Unit of Sale</label>
                <input
                  type="text"
                  value={yieldUnit}
                  onChange={(e) => setYieldUnit(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Expected Output Units</label>
                <input
                  type="number"
                  value={expectedYield}
                  onChange={(e) => setExpectedYield(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Selling Price Per Unit</label>
                <input
                  type="number"
                  value={unitSellingPrice}
                  onChange={(e) => setUnitSellingPrice(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-3">
              <p className="text-xs font-bold text-stone-800">Operational Cost Breakdown ({currencySymbol})</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-stone-500 text-[11px] block">Land Preparation / Tractor</label>
                  <input
                    type="number"
                    value={landPreparationCost}
                    onChange={(e) => setLandPreparationCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-stone-500 text-[11px] block">Seeds / Stock Purchase</label>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={(e) => setSeedCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-stone-500 text-[11px] block">Fertilizer / Chemical / Feeds</label>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-stone-500 text-[11px] block">Farm Labor &amp; Weeding</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 mt-0.5"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-stone-500 text-[11px] block">Logistics, Fuel &amp; Contingency</label>
                  <input
                    type="number"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
                Financial Health &amp; Break-Even Output
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500">Gross Revenue</span>
                  <p className="text-lg font-extrabold text-stone-900 mt-1">{formatCurrency(grossRevenue)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500">Total Production Cost</span>
                  <p className="text-lg font-extrabold text-rose-700 mt-1">{formatCurrency(totalCost)}</p>
                </div>
              </div>

              {/* Net Profit Banner */}
              <div
                className={`p-5 rounded-2xl border ${
                  netProfit >= 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">Projected Net Margin</span>
                    <p className="text-2xl sm:text-3xl font-black mt-1">{formatCurrency(netProfit)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold">Return on Cost</span>
                    <p className="text-xl font-extrabold">{profitMargin.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Break-Even Points */}
              <div className="p-4 rounded-2xl bg-stone-100/70 space-y-2 text-xs">
                <p className="font-bold text-stone-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  Break-Even Thresholds (Zero-Loss Line)
                </p>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Minimum Units to Harvest &amp; Sell:</span>
                  <strong className="text-stone-900 font-extrabold">
                    {Math.ceil(breakEvenUnits)} {yieldUnit}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Minimum Price per Unit to Cover Costs:</span>
                  <strong className="text-stone-900 font-extrabold">
                    {formatCurrency(Math.ceil(breakEvenPrice))}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. CROP SPACING & SEED POPULATION --- */}
      {activeCalc === 'spacing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Farmland Dimensions &amp; Agronomic Spacing
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Land Size</label>
                  <input
                    type="number"
                    value={landSize}
                    onChange={(e) => setLandSize(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Unit of Measure</label>
                  <select
                    value={landSizeUnit}
                    onChange={(e) => setLandSizeUnit(e.target.value as any)}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  >
                    <option value="hectares">Hectares (10,000 m²)</option>
                    <option value="acres">Acres (4,047 m²)</option>
                    <option value="sqm">Square Meters (m²)</option>
                  </select>
                </div>
              </div>

              {/* Crop Preset Chips */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 block mb-1">
                  Preset Spacings (Standard Commercial):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Maize (75cm x 25cm)', r: 75, p: 25, s: 1 },
                    { name: 'Cassava (100cm x 100cm)', r: 100, p: 100, s: 1 },
                    { name: 'Tomato (60cm x 45cm)', r: 60, p: 45, s: 1 },
                    { name: 'Plantain (300cm x 200cm)', r: 300, p: 200, s: 1 },
                    { name: 'Soybean (50cm x 10cm)', r: 50, p: 10, s: 1 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRowSpacingCm(preset.r);
                        setPlantSpacingCm(preset.p);
                        setSeedsPerHole(preset.s);
                      }}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Inter-Row Spacing (cm)
                  </label>
                  <input
                    type="number"
                    value={rowSpacingCm}
                    onChange={(e) => setRowSpacingCm(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Intra-Row Spacing (cm)
                  </label>
                  <input
                    type="number"
                    value={plantSpacingCm}
                    onChange={(e) => setPlantSpacingCm(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Seeds / Seedlings per Hill (Stand)
                </label>
                <input
                  type="number"
                  value={seedsPerHole}
                  onChange={(e) => setSeedsPerHole(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>

          {/* Spacing Results */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Plant Population &amp; Seed Quantities
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-800">Total Plant Population</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  {totalPlantPopulation.toLocaleString()}
                  <span className="text-xs font-normal text-emerald-800 ml-1">stands</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <span className="text-[11px] font-semibold text-teal-800">Total Seed Count</span>
                <p className="text-2xl font-black text-teal-950 mt-1">
                  {totalSeedsNeeded.toLocaleString()}
                  <span className="text-xs font-normal text-teal-800 ml-1">seeds</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-700">
                <span>Total Farmland Surface Area:</span>
                <strong className="text-stone-900 font-bold">{areaSqm.toLocaleString()} m²</strong>
              </div>
              <div className="flex items-center justify-between text-stone-700">
                <span>Effective Space Per Plant:</span>
                <strong className="text-stone-900 font-bold">{plantSpacingMeters.toFixed(3)} m²</strong>
              </div>
              <div className="flex items-center justify-between text-stone-700">
                <span>Estimated Seed Weight (e.g. Maize):</span>
                <strong className="text-emerald-700 font-extrabold">{estimatedSeedWeightKg} kg</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Germination Cushion: In commercial practice, add 10% to 15% extra seeds for gap filling (supplying) to account for germination rates below 100% or early rodent damage.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- 3. FERTILIZER & NPK ESTIMATOR --- */}
      {activeCalc === 'fertilizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Crop &amp; Soil Nutrition Parameters
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Crop</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                >
                  <option value="Maize / Corn">Maize / Corn (Heavy Nitrogen Feeder)</option>
                  <option value="Rice (Paddy)">Rice (Paddy - FARO 44 / Uplands)</option>
                  <option value="Cassava">Cassava (High Potassium Demands)</option>
                  <option value="Vegetables">Tomatoes &amp; Leafy Vegetables</option>
                  <option value="Legumes">Soybean &amp; Cowpea (Requires Phosphorus)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hectares Under Cultivation</label>
                  <input
                    type="number"
                    value={fertAreaHa}
                    onChange={(e) => setFertAreaHa(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cost Per 50kg Bag ({currencySymbol})</label>
                  <input
                    type="number"
                    value={bagPrice}
                    onChange={(e) => setBagPrice(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Soil Texture / Condition</label>
                <select
                  value={fertSoilType}
                  onChange={(e) => setFertSoilType(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                >
                  <option value="Loamy Soil (Moderate Fertility)">Loamy Soil (Moderate Fertility)</option>
                  <option value="Sandy Soil (Leaches Rapidly - Needs Higher Dose)">Sandy Soil (Leaches Rapidly)</option>
                  <option value="Clay / Heavy Soil (High Nutrient Retention)">Clay / Heavy Soil (High Nutrient Retention)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Fertilizer Program &amp; Cost Projection
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-semibold text-amber-800">Total 50kg Bags Required</span>
                <p className="text-2xl font-black text-amber-950 mt-1">
                  {totalBagsNeeded} <span className="text-xs font-normal text-amber-800">bags</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-semibold text-stone-600">Total Fertilizer Budget</span>
                <p className="text-xl font-black text-stone-900 mt-1">{formatCurrency(totalFertCost)}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-stone-900">Application Timeline Protocol:</p>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-stone-900">Basal Dressing (Day 0–14)</p>
                  <p className="text-stone-600 text-[11px]">
                    Apply {basalBagsPerHa * fertAreaHa} bags of NPK 15-15-15 at planting or 10-14 days after emergence along rows.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-stone-900">Top Dressing (Knee-High Stage / Week 4–6)</p>
                  <p className="text-stone-600 text-[11px]">
                    Apply {topDressBagsPerHa * fertAreaHa} bags of Urea (46% N) when soil is moist to accelerate vegetative mass.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 4. LIVESTOCK FEED & FCR CALCULATOR --- */}
      {activeCalc === 'livestock-feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Flock / Stock Parameters &amp; Feed Costs
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Livestock Species</label>
                  <select
                    value={animalCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setAnimalCategory(cat);
                      if (cat === 'Broilers') {
                        setTargetWeightKg(2.2);
                        setExpectedFcr(1.65);
                      } else if (cat === 'Catfish') {
                        setTargetWeightKg(1.0);
                        setExpectedFcr(1.2);
                      } else if (cat === 'Pigs') {
                        setTargetWeightKg(70);
                        setExpectedFcr(3.2);
                      }
                    }}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  >
                    <option value="Broilers">Commercial Broiler Chickens</option>
                    <option value="Catfish">Catfish Aquaculture (Ponds/Tanks)</option>
                    <option value="Pigs">Grower / Finisher Pigs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Flock / Fish Headcount</label>
                  <input
                    type="number"
                    value={flockCount}
                    onChange={(e) => setFlockCount(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Live Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Feed Conversion Ratio (FCR)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={expectedFcr}
                    onChange={(e) => setExpectedFcr(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Bag Weight (kg)</label>
                  <input
                    type="number"
                    value={feedBagKg}
                    onChange={(e) => setFeedBagKg(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Price per Bag ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={feedBagPrice}
                    onChange={(e) => setFeedBagPrice(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Feed Requirement &amp; Cost Projections
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <span className="text-[11px] font-semibold text-indigo-800">Total Feed Consumed</span>
                <p className="text-2xl font-black text-indigo-950 mt-1">
                  {totalFeedBags} <span className="text-xs font-normal text-indigo-800">bags ({totalFeedKg.toLocaleString()} kg)</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-800">Total Meat/Fish Harvest</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  {totalBiomassProducedKg.toLocaleString()} <span className="text-xs font-normal text-emerald-800">kg live</span>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-700">
                <span>Total Expected Feed Outlay:</span>
                <strong className="text-rose-700 font-extrabold text-sm">{formatCurrency(totalFeedExpense)}</strong>
              </div>
              <div className="flex items-center justify-between text-stone-700">
                <span>Feed Cost Per Kilogram of Meat Produced:</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{formatCurrency(Math.round(feedCostPerKgMeat))}/kg</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-100 text-[11px] text-stone-600">
              <span className="font-bold text-stone-800">Feed Conversion Fact: </span>
              Feed constitutes approximately 65% to 75% of total operating expenditure in commercial poultry and aquaculture. Lowering FCR through clean water, good genetics, and climate control directly increases profitability.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
