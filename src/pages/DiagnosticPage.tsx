import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeAgriculturalImage } from '../services/api';
import { SAMPLE_DIAGNOSTIC_IMAGES } from '../data/mockData';
import Markdown from 'react-markdown';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

export const DiagnosticPage: React.FC = () => {
  const { userProfile } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [notes, setNotes] = useState<string>('');
  const [category, setCategory] = useState<string>('Crops & Leaves');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Sample image selection
  const handleSelectSample = async (sample: typeof SAMPLE_DIAGNOSTIC_IMAGES[0]) => {
    setNotes(sample.notes);
    setCategory(sample.category);
    setError(null);
    setAnalysisResult(null);

    // Convert sample url to base64 so backend can analyze with Gemini
    try {
      const res = await fetch(sample.thumbnail);
      const blob = await res.blob();
      setMimeType(blob.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Fallback
      setSelectedImage(sample.thumbnail);
    }
  };

  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeAgriculturalImage(
        selectedImage,
        mimeType,
        notes,
        category
      );
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "We couldn't analyze this image. Please upload a clearer image.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>AI Multimodal Crop &amp; Livestock Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Agricultural Image Scanner &amp; Pathology
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Upload clear photos of plant leaves, stems, fruits, soil conditions, livestock symptoms, or pests.
            AgriAI inspects visual traits, identifies probable pathogens, and provides practical field management steps.
          </p>
        </div>

        {/* Responsible Safety Badge */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 max-w-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Diagnostic Integrity</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-normal">
            Visual inspection provides observational guidance. Do not treat uncertain image analysis as a definitive laboratory assay.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Upload & Input Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900">1. Upload Agricultural Photo</h2>

            {/* Upload Area / Dropzone */}
            <div className="border-2 border-dashed border-stone-200 hover:border-emerald-500 rounded-2xl p-4 text-center transition-colors bg-stone-50/50">
              {selectedImage ? (
                <div className="space-y-3">
                  <div className="relative max-h-64 rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Crop to diagnose"
                      className="max-h-64 object-contain mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setAnalysisResult(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">
                    Click to upload photo or capture with camera
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Supports JPG, PNG, WEBP (leaf, stem, fruit, insect pest, livestock)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>

            {/* Context Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category of Subject
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Crops & Leaves">Crops, Leaves &amp; Foliage</option>
                  <option value="Fruits & Vegetables">Fruits &amp; Vegetables</option>
                  <option value="Insects & Pests">Insect Pests &amp; Larvae</option>
                  <option value="Soil & Roots">Soil Structure &amp; Roots</option>
                  <option value="Poultry & Livestock">Livestock / Poultry Condition</option>
                  <option value="Equipment & Irrigation">Farm Equipment &amp; Drip Lines</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  What did you observe? (Optional Context)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Yellow spots started 4 days ago after heavy rain; lower leaves wilting..."
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:border-emerald-500 placeholder:text-stone-400"
                />
              </div>

              {/* Diagnose Action Button */}
              <button
                onClick={handleRunDiagnosis}
                disabled={!selectedImage || analyzing}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  selectedImage && !analyzing
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image Pathology...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Agricultural Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sample Photos */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">
                Or Test With Curated Farm Samples:
              </span>
              <span className="text-[11px] text-stone-500">1-click test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_DIAGNOSTIC_IMAGES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-2 rounded-xl border border-stone-100 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer transition-all flex flex-col gap-1.5"
                >
                  <img
                    src={sample.thumbnail}
                    alt={sample.title}
                    className="w-full h-20 object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-stone-800 line-clamp-1">{sample.title}</p>
                    <p className="text-[10px] text-stone-500 line-clamp-1">{sample.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Structured Diagnostic Output (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs min-h-[500px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-stone-900">
                    Pathology &amp; Diagnosis Report
                  </h2>
                  <p className="text-xs text-stone-500">
                    Generated with Gemini 3.8 Flash Multimodal Vision
                  </p>
                </div>

                {analysisResult && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                )}
              </div>

              {/* Status Display */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Image Analysis Inconclusive</p>
                    <p className="mt-1">{error}</p>
                    <p className="mt-2 text-rose-700">
                      Recommendation: Ensure the subject is well-lit, close-up, and sharply focused without glare.
                    </p>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">
                      Inspecting Botanical &amp; Pathological Traits...
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      Analyzing chlorosis patterns, necrotic ring margins, sporulation, and nutritional deficiencies.
                    </p>
                  </div>
                </div>
              )}

              {!analyzing && !analysisResult && !error && (
                <div className="py-20 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-stone-700">No Image Analyzed Yet</p>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    Upload an agricultural photo from your phone or choose a curated sample on the left to receive a structured breakdown of observations, causes, and next steps.
                  </p>
                </div>
              )}

              {/* Result Content */}
              {analysisResult && (
                <div className="space-y-6">
                  <div className="markdown-body">
                    <Markdown>{analysisResult}</Markdown>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Caution note */}
            <div className="pt-6 mt-8 border-t border-stone-100 text-[11px] text-stone-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Standard Agronomic Protocol: Always isolate severely infected plants immediately to prevent pathogen transmission across the entire field block. For critical livestock epidemics or sudden bird mortality, contact your district veterinary officer promptly.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
