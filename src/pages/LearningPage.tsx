import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AGRICULTURAL_GLOSSARY } from '../data/mockData';
import {
  BookOpen,
  Search,
  Sprout,
  Flame,
  ChevronDown,
  ChevronUp,
  Bot,
  ArrowRight,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

interface GuideItem {
  id: string;
  category: 'Crops' | 'Livestock';
  title: string;
  duration: string;
  overview: string;
  keySteps: { step: string; detail: string }[];
  cautions: string[];
}

const FARMING_GUIDES: GuideItem[] = [
  {
    id: 'g-1',
    category: 'Crops',
    title: 'High-Yield Commercial Maize Cultivation Guide',
    duration: '90 - 120 Days (Planting to Dry Harvest)',
    overview: 'Maize is a staple cereal requiring fertile, well-drained loamy soil, adequate sunlight, and disciplined weed control within the first 30 days.',
    keySteps: [
      { step: '1. Land Preparation', detail: 'Plough and harrow thoroughly to create a loose seedbed. Incorporate organic manure 2 weeks prior to ridging.' },
      { step: '2. Seed Selection & Spacing', detail: 'Use certified drought-tolerant hybrid seeds (e.g. SC 510 or Oba Super 2). Plant at 75cm between rows and 25cm between stands (53,333 plants/ha).' },
      { step: '3. Basal Fertilization', detail: 'Apply 4 to 5 bags of NPK 15-15-15 per hectare 10 to 14 days after emergence in bands 5cm away from plant stems.' },
      { step: '4. Fall Armyworm Defense', detail: 'Scout leaves at least twice weekly. Spray Emamectin Benzoate into the central whorl if pinholes and frass appear.' },
      { step: '5. Nitrogen Top-Dressing', detail: 'Apply 2 to 3 bags of Urea (46% N) per hectare at knee-high stage (4 to 6 weeks) when soil is moist.' },
      { step: '6. Harvest & Moisture Test', detail: 'Harvest when black layer forms at grain base. Sun-dry or mechanical-dry to strictly under 12.5% moisture before bagging.' },
    ],
    cautions: [
      'Never apply Urea fertilizer on dry, cracked soil as nitrogen will volatilize as gas.',
      'Hermetic bags (PICS bags) protect stored grains without requiring hazardous chemical fumigant tablets.',
    ],
  },
  {
    id: 'g-2',
    category: 'Livestock',
    title: '6-Week Commercial Broiler Poultry Master Guide',
    duration: '42 Days Cycle (Target Weight: 2.2kg - 2.5kg)',
    overview: 'Broiler production demands meticulous brooding temperature regulation, high-protein feed rationing, and strict biosecurity to attain optimal FCR (< 1.65).',
    keySteps: [
      { step: '1. Biosecure Pen Disinfection', detail: 'Wash pen walls with caustic soda or virucidal disinfectant 2 weeks prior to chick arrival. Lay dry wood shavings 5cm deep.' },
      { step: '2. Brooding Week 1 (Days 1–7)', detail: 'Maintain brooding temperature at 33°C–35°C with charcoal or gas brooders. Provide glucose and electrolyte water before feed.' },
      { step: '3. Vaccination Regimen', detail: 'Administer Newcastle disease (NDV-LaSota) on Day 1 (Hatchery/Day 8) and Gumboro (IBD) on Day 10 and Day 18 in clean skim-milk water.' },
      { step: '4. Feed Progression', detail: 'Broiler Starter Crumble (22-23% crude protein) from Days 1 to 21, transitioning gradually to Broiler Finisher Pellets (19-20% protein) until slaughter.' },
      { step: '5. Ventilation & Litter Care', detail: 'Rake wet litter around drinkers daily. Good airflow prevents ammonia gas buildup which causes ascites and respiratory infections.' },
    ],
    cautions: [
      'Never give chlorinated tap water when administering live viral vaccines, as chlorine destroys the vaccine virus.',
      'Sudden feed formula changes cause severe digestive upset; always blend old and new feed over 3 days.',
    ],
  },
  {
    id: 'g-3',
    category: 'Livestock',
    title: 'Commercial African Catfish (Clarias) Aquaculture Protocol',
    duration: '4 to 6 Months (Fingerling to 1kg Table Size)',
    overview: 'African sharp-tooth catfish are hardy, fast-growing carnivores capable of thriving in concrete tanks, tarpaulin vats, or earthen ponds.',
    keySteps: [
      { step: '1. Water Conditioning & Liming', detail: 'Fill pond with fresh borehole water. Maintain pH between 6.5 and 8.0, and dissolved oxygen (DO) above 4.5 mg/L.' },
      { step: '2. Fingerling Acclimatization', detail: 'Float transport bags in pond for 20 minutes to equalize temperature before releasing 5g to 10g fingerlings.' },
      { step: '3. Progressive Pellet Sizing', detail: 'Feed 2mm floating pellets (45% crude protein) for the first month, upgrading to 3mm, 4mm, and 6mm as mouth gape expands.' },
      { step: '4. Bi-Weekly Grading / Sorting', detail: 'Sort fish by size every 2 to 3 weeks into separate tanks to prevent large dominant "shooters" from cannibalizing smaller siblings.' },
      { step: '5. Water Exchange Rhythm', detail: 'In recirculating/tarpaulin systems, discharge ammonia-rich bottom water every 48 hours to preserve gill health.' },
    ],
    cautions: [
      'Overfeeding causes uneaten pellets to decompose on the bottom, rapidly depleting oxygen and producing toxic un-ionized ammonia.',
      'Always withhold feed 24 hours prior to long-distance live transportation to keep gut empty.',
    ],
  },
  {
    id: 'g-4',
    category: 'Crops',
    title: 'Disease-Resistant Cassava (Stem to Starch) Guide',
    duration: '10 to 12 Months (TME 419 / Pro-Vitamin A)',
    overview: 'Cassava is a resilient perennial tuber crop adapted to varied soil conditions, providing reliable carbohydrates and industrial starch.',
    keySteps: [
      { step: '1. Clean Stem Cutting Selection', detail: 'Use certified CMD-resistant stems (e.g. TME 419). Cut mature stems into 20cm to 25cm lengths with 4 to 6 viable nodes.' },
      { step: '2. Planting Angle & Depth', detail: 'Plant on ridges at a 45-degree angle or vertically with buds pointing upwards, buried two-thirds into the soil.' },
      { step: '3. Density & Weed Control', detail: 'Space at 1m x 1m (10,000 stands/ha). Apply pre-emergence herbicide within 24 hours of planting.' },
      { step: '4. Potassium Fertilization', detail: 'Apply Muriate of Potash (MOP) or NPK 12-12-17 at 8 weeks to stimulate tuber bulk development.' },
      { step: '5. Harvest Optimization', detail: 'Harvest when starch content peaks at 10-12 months. Fresh tubers must reach starch factories within 48 hours of uprooting.' },
    ],
    cautions: [
      'Cassava mosaic virus is spread by whiteflies and infected stem cuttings. Never propagate stems showing twisted, mottled leaves.',
    ],
  },
];

export const LearningPage: React.FC = () => {
  const { setActiveTab, setInitialAssistantQuery } = useApp();

  const [searchGlossary, setSearchGlossary] = useState('');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(FARMING_GUIDES[0].id);

  const filteredGlossary = AGRICULTURAL_GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(searchGlossary.toLowerCase()) ||
      g.definition.toLowerCase().includes(searchGlossary.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Agronomic Knowledge &amp; Extension Manuals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Learning Center &amp; Farm Manuals
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Detailed agronomic guides, vaccination calendars, feed formulations, and a comprehensive glossary of agricultural terminology.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Comprehensive Manuals (Left) & Glossary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Production Manuals (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Field Tested Production Protocols
            </h2>
            <span className="text-xs text-stone-500">{FARMING_GUIDES.length} comprehensive guides</span>
          </div>

          <div className="space-y-4">
            {FARMING_GUIDES.map((guide) => {
              const isExpanded = activeGuideId === guide.id;

              return (
                <div
                  key={guide.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs transition-all"
                >
                  {/* Header Button */}
                  <div
                    onClick={() => setActiveGuideId(isExpanded ? null : guide.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                          {guide.category}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {guide.duration}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-stone-900">{guide.title}</h3>
                      <p className="text-xs text-stone-500 leading-relaxed">{guide.overview}</p>
                    </div>

                    <button className="p-2 rounded-xl bg-stone-100 text-stone-600 mt-1 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-4">
                      {/* Steps */}
                      <div className="space-y-2.5">
                        <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                          Key Agronomic Steps:
                        </p>
                        {guide.keySteps.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1"
                          >
                            <p className="font-bold text-stone-900">{s.step}</p>
                            <p className="text-stone-600 text-[11px] leading-relaxed">{s.detail}</p>
                          </div>
                        ))}
                      </div>

                      {/* Cautions */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-950 space-y-1">
                        <p className="font-bold text-amber-900">Critical Pitfalls &amp; Cautions:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900">
                          {guide.cautions.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Ask AgriAI about this manual */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setInitialAssistantQuery(
                              `I am reading the ${guide.title}. Can you explain specific spacing, fertilizer schedule, and profit potential for my farm size?`
                            );
                            setActiveTab('assistant');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Consult AgriAI on this Guide</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Agricultural Glossary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Agricultural Glossary &amp; Terminology
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Understand core agronomic concepts in simple, accessible language
              </p>
            </div>

            {/* Glossary Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchGlossary}
                onChange={(e) => setSearchGlossary(e.target.value)}
                placeholder="Search term (e.g. FCR, NPK, fallowing, biosecurity)..."
                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Terms List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-stone-900">{item.term}</h4>
                    <button
                      onClick={() => {
                        setInitialAssistantQuery(
                          `Explain "${item.term}" in simple terms and how it practically applies to my farm.`
                        );
                        setActiveTab('assistant');
                      }}
                      className="text-[10px] text-teal-700 hover:underline font-bold"
                    >
                      Ask AI &rarr;
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}

              {filteredGlossary.length === 0 && (
                <div className="text-center py-8 text-xs text-stone-400">
                  No terminology matched "{searchGlossary}".
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
