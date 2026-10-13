import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
} from 'lucide-react';

type SubView = 'overview' | 'activities' | 'finances' | 'inventory' | 'livestock';

export const FarmManagerPage: React.FC = () => {
  const {
    activities,
    addActivity,
    expenses,
    addExpense,
    deleteExpense,
    sales,
    addSale,
    inventory,
    addInventoryItem,
    livestock,
    addLivestockRecord,
    formatCurrency,
    currencySymbol,
    userProfile,
  } = useApp();

  const [currentView, setCurrentView] = useState<SubView>('overview');

  // Modals state
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showAddLivestockModal, setShowAddLivestockModal] = useState(false);

  // Form states
  const [newActivity, setNewActivity] = useState({
    title: '',
    plotOrPen: 'Field A',
    category: 'Planting' as const,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [newExpense, setNewExpense] = useState({
    category: 'Feed' as const,
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const [newSale, setNewSale] = useState({
    commodity: '',
    quantity: 1,
    unit: 'bags',
    unitPrice: 0,
    buyerName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newInventory, setNewInventory] = useState({
    name: '',
    category: 'Feed' as const,
    quantity: 10,
    unit: 'bags (50kg)',
    reorderLevel: 5,
    location: 'Main Store',
    estimatedValue: 0,
  });

  const [newLivestock, setNewLivestock] = useState({
    animalType: 'Broilers',
    batchName: '',
    initialCount: 500,
    currentCount: 500,
    mortalityCount: 0,
    startDate: new Date().toISOString().split('T')[0],
    ageWeeks: 1,
    averageWeightKg: 0.1,
    notes: '',
  });

  // Financial calculations
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netMargin = totalRevenue - totalExpenses;
  const totalInventoryValuation = inventory.reduce((acc, i) => acc + i.estimatedValue, 0);

  // Low stock alert items
  const lowStockItems = inventory.filter((i) => i.quantity <= i.reorderLevel);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Farm Enterprise ERP &amp; Record Book</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            {userProfile.farmName || 'Farm Management Records'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Audit daily activities, track input purchases, record produce sales, monitor flock growth, and control inventory.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'overview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('activities')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'activities' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Activities ({activities.length})
          </button>
          <button
            onClick={() => setCurrentView('finances')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'finances' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Finances &amp; Sales
          </button>
          <button
            onClick={() => setCurrentView('inventory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'inventory' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setCurrentView('livestock')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'livestock' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Livestock Batches
          </button>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {currentView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Total Produce Sales</span>
              <p className="text-2xl font-black text-stone-900 mt-1">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{sales.length} transactions recorded</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Total Farm Expenses</span>
              <p className="text-2xl font-black text-rose-700 mt-1">{formatCurrency(totalExpenses)}</p>
              <div className="flex items-center gap-1 text-[11px] text-rose-700 font-semibold mt-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{expenses.length} expense entries</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Current Net Cash Margin</span>
              <p className={`text-2xl font-black mt-1 ${netMargin >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {formatCurrency(netMargin)}
              </p>
              <span className="text-[11px] text-stone-500 font-medium mt-1 block">
                {netMargin >= 0 ? 'Operating with surplus' : 'Current deficit outlay'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs font-semibold text-stone-500">Stored Inventory Valuation</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{formatCurrency(totalInventoryValuation)}</p>
              <span className="text-[11px] text-stone-500 font-medium mt-1 block">
                {inventory.length} store items cataloged
              </span>
            </div>
          </div>

          {/* Low Stock Warning Banner */}
          {lowStockItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  <strong>Stock Warning:</strong> {lowStockItems.length} input item(s) (
                  {lowStockItems.map((i) => i.name).join(', ')}) have dropped below safe reorder thresholds.
                </span>
              </div>
              <button
                onClick={() => setCurrentView('inventory')}
                className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 text-xs shrink-0"
              >
                Inspect Stock
              </button>
            </div>
          )}

          {/* Split Recent Tables: Activities & Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-bold text-stone-900">Recent Field Activities</h3>
                </div>
                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Activity
                </button>
              </div>

              <div className="space-y-3">
                {activities.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-stone-900">{act.title}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {act.plotOrPen} • {act.date}
                      </p>
                      {act.notes && <p className="text-[11px] text-stone-600 mt-1 italic">&ldquo;{act.notes}&rdquo;</p>}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        act.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-stone-900">Recent Produce Sales</h3>
                </div>
                <button
                  onClick={() => setShowAddSaleModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Sale
                </button>
              </div>

              <div className="space-y-3">
                {sales.slice(0, 4).map((sale) => (
                  <div
                    key={sale.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-stone-900">{sale.commodity}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {sale.quantity} {sale.unit} @ {formatCurrency(sale.unitPrice)} • {sale.buyerName}
                      </p>
                    </div>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {formatCurrency(sale.totalRevenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTIVITIES TAB --- */}
      {currentView === 'activities' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900">All Field &amp; Pen Logs</h2>
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Log Farm Activity
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Activity Description</th>
                  <th className="p-3">Plot / Pen</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activities.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/50">
                    <td className="p-3 whitespace-nowrap font-medium text-stone-600">{a.date}</td>
                    <td className="p-3 font-bold text-stone-900">{a.title}</td>
                    <td className="p-3 text-stone-700">{a.plotOrPen}</td>
                    <td className="p-3 text-stone-600">{a.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-500 text-[11px] max-w-xs truncate">{a.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- FINANCES TAB --- */}
      {currentView === 'finances' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expenses */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Operating Expenses</h3>
                <span className="text-[11px] text-stone-500">Total: {formatCurrency(totalExpenses)}</span>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Expense
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {expenses.map((e) => (
                <div
                  key={e.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-stone-900">{e.description}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {e.category} • {e.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-700">{formatCurrency(e.amount)}</span>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="p-1 rounded text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Revenue &amp; Harvest Sales</h3>
                <span className="text-[11px] text-stone-500">Total: {formatCurrency(totalRevenue)}</span>
              </div>
              <button
                onClick={() => setShowAddSaleModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Record Sale
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {sales.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-stone-900">{s.commodity}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {s.quantity} {s.unit} • Buyer: {s.buyerName} ({s.date})
                    </p>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {formatCurrency(s.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- INVENTORY TAB --- */}
      {currentView === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Input Inventory &amp; Supplies</h2>
              <span className="text-[11px] text-stone-500">
                Total Value: {formatCurrency(totalInventoryValuation)}
              </span>
            </div>
            <button
              onClick={() => setShowAddInventoryModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Inventory Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventory.map((item) => {
              const isLow = item.quantity <= item.reorderLevel;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLow ? 'bg-amber-50/50 border-amber-300' : 'bg-stone-50/50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">
                      {item.category}
                    </span>
                    {isLow && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mt-2">{item.name}</h4>
                  <p className="text-lg font-extrabold text-stone-900 mt-1">
                    {item.quantity}{' '}
                    <span className="text-xs font-normal text-stone-500">{item.unit}</span>
                  </p>
                  <div className="text-[11px] text-stone-500 mt-2 space-y-0.5">
                    <p>Reorder Alert: &le; {item.reorderLevel}</p>
                    <p>Location: {item.location}</p>
                    <p>Value: {formatCurrency(item.estimatedValue)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- LIVESTOCK BATCHES TAB --- */}
      {currentView === 'livestock' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900">Livestock &amp; Flock Headcount Records</h2>
            <button
              onClick={() => setShowAddLivestockModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Livestock Batch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {livestock.map((batch) => {
              const mortalityRate =
                batch.initialCount > 0 ? ((batch.mortalityCount / batch.initialCount) * 100).toFixed(1) : 0;

              return (
                <div key={batch.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{batch.batchName}</h4>
                      <p className="text-xs text-stone-500">{batch.animalType}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900">
                      Age: {batch.ageWeeks} wks
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-stone-100">
                      <span className="text-[10px] text-stone-400 block font-semibold">Active Count</span>
                      <strong className="text-sm font-black text-stone-900">{batch.currentCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-100">
                      <span className="text-[10px] text-stone-400 block font-semibold">Mortality</span>
                      <strong className="text-sm font-black text-rose-700">
                        {batch.mortalityCount} ({mortalityRate}%)
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-100">
                      <span className="text-[10px] text-stone-400 block font-semibold">Avg Weight</span>
                      <strong className="text-sm font-black text-emerald-700">{batch.averageWeightKg} kg</strong>
                    </div>
                  </div>

                  {batch.notes && (
                    <p className="text-[11px] text-stone-600 bg-white p-2.5 rounded-xl border border-stone-100 italic">
                      &ldquo;{batch.notes}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ADD ACTIVITY MODAL --- */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Log Daily Farm Activity
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Activity Title</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="e.g. Weeding along plot 3"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Field / Pen</label>
                  <input
                    type="text"
                    value={newActivity.plotOrPen}
                    onChange={(e) => setNewActivity({ ...newActivity, plotOrPen: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Planting">Planting</option>
                    <option value="Weeding">Weeding</option>
                    <option value="Fertilizing">Fertilizing</option>
                    <option value="Spraying">Spraying</option>
                    <option value="Harvesting">Harvesting</option>
                    <option value="Feeding">Feeding</option>
                    <option value="Vaccination">Vaccination</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Notes / Observations</label>
                <textarea
                  rows={2}
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newActivity.title.trim()) {
                    addActivity({
                      ...newActivity,
                      status: 'Completed',
                    });
                    setShowAddActivityModal(false);
                    setNewActivity({ title: '', plotOrPen: 'Field A', category: 'Planting', date: new Date().toISOString().split('T')[0], notes: '' });
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD EXPENSE MODAL --- */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Record Operational Farm Expense
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Expense Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g. 5 bags starter mash"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Feed">Feed</option>
                    <option value="Labor">Labor</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Seeds/Breeding">Seeds/Breeding</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Fuel/Machinery">Fuel/Machinery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newExpense.description.trim() && newExpense.amount > 0) {
                    addExpense({
                      ...newExpense,
                      currency: userProfile.currency,
                    });
                    setShowAddExpenseModal(false);
                    setNewExpense({ category: 'Feed', description: '', amount: 0, date: new Date().toISOString().split('T')[0] });
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD SALE MODAL --- */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Record Produce / Harvest Sale
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Commodity / Item Sold</label>
                <input
                  type="text"
                  value={newSale.commodity}
                  onChange={(e) => setNewSale({ ...newSale, commodity: e.target.value })}
                  placeholder="e.g. Dry Maize, Live Broilers"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({ ...newSale, quantity: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={newSale.unit}
                    onChange={(e) => setNewSale({ ...newSale, unit: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={newSale.unitPrice}
                    onChange={(e) => setNewSale({ ...newSale, unitPrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Buyer Name</label>
                <input
                  type="text"
                  value={newSale.buyerName}
                  onChange={(e) => setNewSale({ ...newSale, buyerName: e.target.value })}
                  placeholder="e.g. Local grain aggregator, Restaurant"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddSaleModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newSale.commodity.trim() && newSale.quantity > 0 && newSale.unitPrice > 0) {
                    addSale({
                      ...newSale,
                      totalRevenue: newSale.quantity * newSale.unitPrice,
                      currency: userProfile.currency,
                    });
                    setShowAddSaleModal(false);
                    setNewSale({ commodity: '', quantity: 1, unit: 'bags', unitPrice: 0, buyerName: '', date: new Date().toISOString().split('T')[0] });
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
              >
                Record Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD INVENTORY MODAL --- */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Add Store Inventory Item
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={newInventory.name}
                  onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                  placeholder="e.g. NPK 15-15-15, Broiler Finisher"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newInventory.category}
                    onChange={(e) => setNewInventory({ ...newInventory, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Feed">Feed</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Seed">Seed</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Tool">Tool</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newInventory.quantity}
                    onChange={(e) => setNewInventory({ ...newInventory, quantity: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Unit Description</label>
                  <input
                    type="text"
                    value={newInventory.unit}
                    onChange={(e) => setNewInventory({ ...newInventory, unit: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Reorder Level Alert</label>
                  <input
                    type="number"
                    value={newInventory.reorderLevel}
                    onChange={(e) => setNewInventory({ ...newInventory, reorderLevel: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Total Estimated Value ({currencySymbol})</label>
                <input
                  type="number"
                  value={newInventory.estimatedValue}
                  onChange={(e) => setNewInventory({ ...newInventory, estimatedValue: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddInventoryModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newInventory.name.trim() && newInventory.quantity >= 0) {
                    addInventoryItem(newInventory);
                    setShowAddInventoryModal(false);
                    setNewInventory({ name: '', category: 'Feed', quantity: 10, unit: 'bags (50kg)', reorderLevel: 5, location: 'Main Store', estimatedValue: 0 });
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD LIVESTOCK MODAL --- */}
      {showAddLivestockModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
              Register Livestock Flock or Fish Batch
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Batch Name / Code</label>
                <input
                  type="text"
                  value={newLivestock.batchName}
                  onChange={(e) => setNewLivestock({ ...newLivestock, batchName: e.target.value })}
                  placeholder="e.g. Batch 25-A (500 Broilers)"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Species / Type</label>
                  <input
                    type="text"
                    value={newLivestock.animalType}
                    onChange={(e) => setNewLivestock({ ...newLivestock, animalType: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Initial Headcount</label>
                  <input
                    type="number"
                    value={newLivestock.initialCount}
                    onChange={(e) => setNewLivestock({ ...newLivestock, initialCount: Number(e.target.value), currentCount: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Age (Weeks)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLivestock.ageWeeks}
                    onChange={(e) => setNewLivestock({ ...newLivestock, ageWeeks: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Average Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLivestock.averageWeightKg}
                    onChange={(e) => setNewLivestock({ ...newLivestock, averageWeightKg: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddLivestockModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newLivestock.batchName.trim() && newLivestock.initialCount > 0) {
                    addLivestockRecord(newLivestock);
                    setShowAddLivestockModal(false);
                    setNewLivestock({ animalType: 'Broilers', batchName: '', initialCount: 500, currentCount: 500, mortalityCount: 0, startDate: new Date().toISOString().split('T')[0], ageWeeks: 1, averageWeightKg: 0.1, notes: '' });
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
              >
                Register Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
