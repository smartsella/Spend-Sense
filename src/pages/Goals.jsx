import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TargetIllustration, EmptyStateIllustration } from '../components/Illustrations';
import { FiPlus, FiTarget, FiTrash2, FiEdit2, FiCheckCircle, FiDollarSign, FiX } from 'react-icons/fi';

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, loading } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');

  // Add Savings Modal States
  const [savingsModalOpen, setSavingsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Edit Goal Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;
    try {
      await addGoal({
        title,
        targetAmount: Number(targetAmount),
        savedAmount: savedAmount ? Number(savedAmount) : 0,
      });
      setTitle('');
      setTargetAmount('');
      setSavedAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDeposit = (goal) => {
    setSelectedGoal(goal);
    setDepositAmount('');
    setSavingsModalOpen(true);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositAmount || !selectedGoal) return;
    try {
      const newSaved = selectedGoal.savedAmount + Number(depositAmount);
      await updateGoal(selectedGoal._id, {
        savedAmount: newSaved,
      });
      setSavingsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditTarget(goal.targetAmount);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editTarget) return;
    try {
      await updateGoal(editingGoal._id, {
        title: editTitle,
        targetAmount: Number(editTarget),
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this savings target?')) {
      try {
        await deleteGoal(id);
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
          Savings Targets
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">Create and allocate savings to check off your financial goals</p>
      </div>

      {/* Target creator card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="glass-panel p-6 shadow-sm lg:col-span-8 flex flex-col justify-center">
          <h3 className="font-heading font-bold text-sm text-gray-800 dark:text-white mb-4">Launch New Goal Target</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Goal Name</span>
              <input
                type="text"
                required
                placeholder="e.g. New Laptop, Vacation fund"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Target Value (₹)</span>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 70000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Initial Savings (₹)</span>
              <input
                type="number"
                placeholder="e.g. 25000 (Optional)"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FiPlus /> Start Goal
              </button>
            </div>
          </form>
        </div>

        {/* Showcase Illustration Panel */}
        <div className="hidden lg:flex lg:col-span-4 glass-card bg-gradient-to-br from-indigo-950/5 to-violet-950/5 p-5 flex-col justify-between items-center text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Milestones Vault</span>
          <div className="w-24">
            <TargetIllustration />
          </div>
          <p className="text-[10px] text-gray-400 leading-normal max-w-[200px]">
            Set target savings totals. You can log manual deposit contributions towards each savings chest in real-time.
          </p>
        </div>
      </div>

      {/* Goals Display Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
          <EmptyStateIllustration />
          <h3 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mt-4">
            No savings goals
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">
            Start saving today by specifying your goals and target budgets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const isCompleted = g.status === 'Completed' || g.savedAmount >= g.targetAmount;
            const percent = Math.min(Math.round((g.savedAmount / g.targetAmount) * 100), 100);
            const remaining = Math.max(g.targetAmount - g.savedAmount, 0);

            return (
              <div
                key={g._id}
                className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between ${
                  isCompleted ? 'border-emerald-500/20 shadow-md shadow-emerald-500/5' : ''
                }`}
              >
                <div>
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                        <FiTarget className="text-lg" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-gray-800 dark:text-white leading-snug">
                          {g.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          {isCompleted ? 'Goal Cleared' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleDelete(g._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing metrics */}
                  <div className="flex justify-between items-baseline mb-2 text-xs">
                    <span className="text-gray-450 font-semibold">Saved Balance</span>
                    <div>
                      <span className="font-bold text-gray-800 dark:text-white">
                        ₹{g.savedAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-400"> of ₹{g.targetAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Remaining text */}
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className={isCompleted ? 'text-emerald-500' : 'text-indigo-500'}>{percent}% Saved</span>
                    {!isCompleted && (
                      <span className="text-gray-405">₹{remaining.toLocaleString('en-IN')} remaining</span>
                    )}
                  </div>
                </div>

                {/* Bottom - Quick deposit button */}
                {!isCompleted && (
                  <button
                    onClick={() => handleOpenDeposit(g)}
                    className="w-full py-2.5 mt-5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-500 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FiDollarSign /> Contribute Savings
                  </button>
                )}

                {isCompleted && (
                  <div className="mt-5 py-2.5 w-full rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <FiCheckCircle /> Goal Accomplished!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Contribute Savings Modal */}
      {savingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 shadow-2xl relative border border-indigo-500/20 scale-up">
            <button
              onClick={() => setSavingsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 text-gray-400"
            >
              <FiX className="text-lg" />
            </button>

            <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-white mb-2">
              Contribute Savings
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Add a deposit towards your target "{selectedGoal?.title}"
            </p>

            <form onSubmit={handleDepositSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Deposit Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/40">
                <button
                  type="button"
                  onClick={() => setSavingsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Save Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 shadow-2xl relative border border-indigo-500/20 scale-up">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 text-gray-400"
            >
              <FiX className="text-lg" />
            </button>

            <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-white mb-2">
              Update Goal Target
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Adjust properties for goal "{editingGoal?.title}"
            </p>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Goal Name</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Value (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/40">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
