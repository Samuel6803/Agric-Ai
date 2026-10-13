import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Activity,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  Lock,
  Terminal,
  RefreshCw,
  ShoppingBag,
  Building2,
  HelpCircle,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { listings, businesses, activities, expenses, sales } = useApp();

  const [aiModelStatus, setAiModelStatus] = useState<'Healthy' | 'Degraded' | 'Offline'>('Healthy');
  const [geminiLatencyMs, setGeminiLatencyMs] = useState<number>(340);

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Administrator Control &amp; Platform Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Platform System Operations
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Live AI orchestration status, veterinary safety guardrail enforcement, active database counts, and regional node metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span>All Production Microservices Online</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Gemini 2.5 Model Engine</span>
            <Cpu className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">{aiModelStatus}</p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Avg Inference Latency: {geminiLatencyMs}ms
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Marketplace Listings</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">{listings.length}</p>
          <span className="text-[11px] text-stone-500 mt-1 block">Active agricultural trade lots</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Vetted Agribusinesses</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">{businesses.length}</p>
          <span className="text-[11px] text-stone-500 mt-1 block">Veterinary, seed &amp; tractor hubs</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Farm Ledger Records</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">
            {activities.length + expenses.length + sales.length}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">Activities, costs &amp; harvest sales</span>
        </div>
      </div>

      {/* Safety & System Guardrails Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Safety Guardrails */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">
              Agronomic Safety &amp; Guardrail Policies
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Veterinary Medication Disclaimer:</strong>
                <p className="text-stone-500 mt-0.5">
                  AI must never prescribe toxic chemical doses without an explicit recommendation to consult a licensed veterinary doctor or registered extension agent.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Fact vs. Assumption Tagging:</strong>
                <p className="text-stone-500 mt-0.5">
                  Financial forecasts must explicitly differentiate confirmed spot prices from projected margins and weather contingencies.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Secure Server-Side AI Execution:</strong>
                <p className="text-stone-500 mt-0.5">
                  Gemini API keys are protected strictly within Express server routes; zero credentials exposed to client web browsers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Server System Topology */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-stone-900">Environment &amp; Infrastructure</h3>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 text-stone-300 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">Runtime:</span>
              <span className="text-emerald-400">Node.js Express + Vite React 19</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">AI Framework:</span>
              <span className="text-emerald-400">@google/genai (Gemini 2.5)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Reverse Proxy Port:</span>
              <span className="text-emerald-400">3000 (0.0.0.0)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Weather Grounding:</span>
              <span className="text-emerald-400">Open-Meteo Agronomic Models</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Local Persistence:</span>
              <span className="text-emerald-400">Active (LocalStorage fallback sync)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-stone-800">
              <span className="text-stone-500">Developed By:</span>
              <span className="text-emerald-300 font-semibold">Salako Samuel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
