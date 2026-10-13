import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAgriDocument } from '../services/api';
import Markdown from 'react-markdown';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { userProfile, formatCurrency, currencySymbol } = useApp();

  const [docType, setDocType] = useState<'invoice' | 'receipt' | 'report' | 'purchase_order' | 'proposal'>('invoice');
  const [loading, setLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Common Form Fields
  const [clientOrBuyer, setClientOrBuyer] = useState('Premier Grain Aggregators Ltd');
  const [itemOrService, setItemOrService] = useState('Dry White Maize (100kg Bags)');
  const [quantity, setQuantity] = useState(50);
  const [unitPrice, setUnitPrice] = useState(68000);
  const [paymentTerms, setPaymentTerms] = useState('50% advance upon loading, 50% upon destination weighbridge confirmation');
  const [notesOrObservations, setNotesOrObservations] = useState('Moisture level tested at 11.8%, aflatoxin certified negative.');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedDoc(null);

    try {
      const doc = await generateAgriDocument(docType, {
        farmName: userProfile.farmName,
        farmerName: userProfile.name,
        location: `${userProfile.location.city}, ${userProfile.location.country}`,
        currency: userProfile.currency,
        currencySymbol,
        clientOrBuyer,
        itemOrService,
        quantity,
        unitPrice,
        totalAmount: quantity * unitPrice,
        paymentTerms,
        notes: notesOrObservations,
        date: new Date().toLocaleDateString(),
      });
      setGeneratedDoc(doc);
    } catch (err: any) {
      setGeneratedDoc(`⚠️ Error generating document: ${err.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    const blob = new Blob([generatedDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriAI_${docType}_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Farm Records &amp; Formal Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Agricultural Invoices &amp; Reports Generator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Quickly draft professional sales invoices, official delivery receipts, field scouting logs, and off-taker contract supply agreements.
          </p>
        </div>

        {/* Document Type Selector */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
          {[
            { id: 'invoice', label: 'Sales Invoice' },
            { id: 'receipt', label: 'Payment Receipt' },
            { id: 'report', label: 'Field Report' },
            { id: 'purchase_order', label: 'Purchase Order' },
            { id: 'proposal', label: 'Supply Proposal' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setDocType(t.id as any);
                setGeneratedDoc(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                docType === t.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleGenerate}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs"
          >
            <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
              <span className="font-bold text-stone-900 uppercase tracking-wider">
                Document Details
              </span>
              <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
                {docType.replace('_', ' ')}
              </span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {docType === 'report' ? 'Farm / Field Block' : 'Client, Buyer or Recipient Name'}
              </label>
              <input
                type="text"
                value={clientOrBuyer}
                onChange={(e) => setClientOrBuyer(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {docType === 'report' ? 'Scouted Enterprise / Crop' : 'Commodity / Service Name'}
              </label>
              <input
                type="text"
                value={itemOrService}
                onChange={(e) => setItemOrService(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Unit Price ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {docType === 'report' ? 'Agronomic Conditions' : 'Terms & Delivery Schedule'}
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Special Quality Specs or Field Observations
              </label>
              <textarea
                rows={3}
                value={notesOrObservations}
                onChange={(e) => setNotesOrObservations(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
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
                  <span>Drafting Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Formal {docType.replace('_', ' ')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Document Preview (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs min-h-[550px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-stone-900 capitalize">
                    {docType.replace('_', ' ')} Preview
                  </h2>
                  <p className="text-xs text-stone-500">
                    Official agricultural transaction document
                  </p>
                </div>

                {generatedDoc && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                      title="Copy text"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                      title="Download Markdown"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                      title="Print Document"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {loading && (
                <div className="py-24 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-stone-800">
                    Formatting Formal Commercial Document...
                  </p>
                </div>
              )}

              {!loading && !generatedDoc && (
                <div className="py-24 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-stone-700">No Document Generated Yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Enter transaction values on the left and click generate to create a verified, printable agricultural invoice or report.
                  </p>
                </div>
              )}

              {generatedDoc && (
                <div className="markdown-body p-4 bg-stone-50/50 rounded-2xl border border-stone-200">
                  <Markdown>{generatedDoc}</Markdown>
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-stone-100 text-[11px] text-stone-400 text-center">
              Generated by AgriAI Platform • Verified Agricultural Ledger Format
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
