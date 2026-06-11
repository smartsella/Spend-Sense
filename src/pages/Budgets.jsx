import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BudgetIllustration, EmptyStateIllustration } from '../components/Illustrations';
import { FiPlus, FiTrash2, FiEdit2, FiAlertTriangle, FiChevronDown, FiX } from 'react-icons/fi';

const Budgets = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, loading } = useFinance();

  const [category, setCategory] = useState('All');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editLimit, setEditLimit] = useState('');

  const categories = [
    'All',
    'Food',
    'Travel',
    'Shopping',
    'Education',
    'Medical',
    'Entertainment',
    'Bills',
    'Rent',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !limit || !month) return;
    try {
      await addBudget({ category, limit: Number(limit), month });
      setLimit('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (b) => {
    setEditingBudget(b);
    setEditLimit(b.limit);
    setModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editLimit) return;
    try {
      await updateBudget(editingBudget._id, { limit: Number(editLimit) });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget limit?')) {
      try {
        await deleteBudget(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 fade-in-slide">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white leading-none">
          Budgets Hub
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">Configure and track monthly spending targets by category</p>
      </div>

      {/* Target setter grid card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="glass-panel p-6 shadow-sm lg:col-span-8 flex flex-col justify-center">
          <h3 className="font-heading font-bold text-sm text-gray-800 dark:text-white mb-4">Set Monthly Budget Target</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</span>
              <div className="input-icon-container">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input cursor-pointer appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'Overall Budget (All)' : cat}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Limit (₹)</span>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 15000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Month</span>
              <input
                type="month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FiPlus /> Save Target
              </button>
            </div>
          </form>
        </div>

        {/* Showcase Tips Panel */}
        <div className="hidden lg:flex lg:col-span-4 glass-card bg-gradient-to-br from-indigo-950/5 to-violet-950/5 p-5 flex-col justify-between items-center text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Budget Planning</span>
          <div className="w-24">
            <BudgetIllustration />
          </div>
          <p className="text-[10px] text-gray-400 leading-normal max-w-[200px]">
            Defining budget limits helps SpendSense calculate category spend thresholds and trigger warnings before over-spending occurs.
          </p>
        </div>
      </div>

      {/* Grid displays */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
          <EmptyStateIllustration />
          <h3 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mt-4">
            No active budgets
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">
            Create monthly budget limits above to monitor your category expenses in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const percent = b.limit > 0 ? Math.min(Math.round((b.currentSpent / b.limit) * 100), 200) : 0;
            const isExceeded = b.currentSpent > b.limit;
            const isWarning = percent >= 80 && percent <= 100;

            let barColor = 'bg-indigo-500';
            if (isExceeded) barColor = 'bg-red-500';
            else if (isWarning) barColor = 'bg-amber-500';

            return (
              <div
                key={b._id}
                className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between ${
                  isExceeded ? 'border-red-500/25 shadow-md shadow-red-500/5' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {b.month}
                      </span>
                      <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-0.5">
                        {b.category === 'All' ? 'Overall Budget' : b.category}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-gray-500 font-medium">Spent Status</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-800 dark:text-white">
                        ₹{b.currentSpent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-400 font-medium"> of ₹{b.limit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${barColor}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isExceeded
                        ? 'bg-red-500/10 text-red-500'
                        : isWarning
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-indigo-500/10 text-indigo-500'
                    }`}
                  >
                    {percent}% used
                  </span>

                  {isExceeded && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                      <FiAlertTriangle /> Exceeded
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 shadow-2xl relative border border-indigo-500/20 scale-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 text-gray-400"
            >
              <FiX className="text-lg" />
            </button>

            <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-white mb-2">
              Update Budget Limit
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Adjust parameters for "{editingBudget?.category}" in {editingBudget?.month}
            </p>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">New Limit (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editLimit}
                  onChange={(e) => setEditLimit(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
