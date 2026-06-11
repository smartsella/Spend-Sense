import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { EmptyStateIllustration } from '../components/Illustrations';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiTag,
  FiX,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiInfo,
} from 'react-icons/fi';

const Income = () => {
  const { incomes, addIncome, updateIncome, deleteIncome, loading } = useFinance();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Sort States
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setTitle('');
    setAmount('');
    setCategory('Salary');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (income) => {
    setEditingIncome(income);
    setTitle(income.title);
    setAmount(income.amount);
    setCategory(income.category);
    setDate(new Date(income.date).toISOString().split('T')[0]);
    setNotes(income.notes || '');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = { title, amount: Number(amount), category, date, notes };
    try {
      if (editingIncome) {
        await updateIncome(editingIncome._id, data);
      } else {
        await addIncome(data);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income stream?')) {
      try {
        await deleteIncome(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredIncomes = useMemo(() => {
    return incomes
      .filter((inc) => {
        const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || inc.category === categoryFilter;

        let matchesDate = true;
        if (startDate) {
          matchesDate = matchesDate && new Date(inc.date) >= new Date(startDate);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && new Date(inc.date) <= end;
        }

        let matchesAmount = true;
        if (minAmount) {
          matchesAmount = matchesAmount && inc.amount >= Number(minAmount);
        }
        if (maxAmount) {
          matchesAmount = matchesAmount && inc.amount <= Number(maxAmount);
        }

        return matchesSearch && matchesCategory && matchesDate && matchesAmount;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else {
          comparison = a.title.localeCompare(b.title);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [incomes, search, categoryFilter, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder]);

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
  };

  return (
    <div className="flex flex-col gap-6 fade-in-slide">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white leading-none">
            Incomes Ledger
          </h2>
          <p className="text-xs text-gray-400 mt-1.5">Manage and record your financial cash flow streams</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <FiPlus className="text-sm" /> Add Income Stream
        </button>
      </div>

      {/* Advanced Filter Block with centered icons and inputs */}
      <div className="glass-panel p-5 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Aligned Search */}
          <div className="input-icon-container">
            <div className="input-icon-left">
              <FiSearch className="text-gray-400 text-base" />
            </div>
            <input
              type="text"
              placeholder="Search income by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input glass-input-with-icon"
            />
          </div>

          {/* Aligned Category */}
          <div className="input-icon-container">
            <div className="input-icon-left">
              <FiTag className="text-gray-400 text-base" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input glass-input-with-icon cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold text-gray-400 shrink-0">Sort By:</span>
            <button
              onClick={() => handleSortToggle('date')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                sortBy === 'date'
                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                  : 'text-gray-500 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
            </button>
            <button
              onClick={() => handleSortToggle('amount')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                sortBy === 'amount'
                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                  : 'text-gray-500 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Amount {sortBy === 'amount' && (sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />)}
            </button>
          </div>
        </div>

        {/* Date and Amount Ranges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-200/50 dark:border-gray-800/40 pt-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-bold text-gray-400">Start Date</span>
            <div className="input-icon-container">
              <div className="input-icon-left">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="glass-input glass-input-with-icon"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-bold text-gray-400">End Date</span>
            <div className="input-icon-container">
              <div className="input-icon-left">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="glass-input glass-input-with-icon"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-bold text-gray-400">Min Amount (₹)</span>
            <input
              type="number"
              placeholder="Min value..."
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="glass-input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-bold text-gray-400">Max Amount (₹)</span>
            <input
              type="number"
              placeholder="Max value..."
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="glass-input"
            />
          </div>
        </div>

        {(search || categoryFilter !== 'All' || startDate || endDate || minAmount || maxAmount) && (
          <div className="flex justify-end mt-1">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-red-500 font-semibold hover:text-red-650 border border-red-500/10 hover:border-red-500/20 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <FiX /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Ledger Table Grid with Sticky Headers */}
      <div className="glass-panel p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <EmptyStateIllustration />
            <h3 className="font-heading font-semibold text-lg text-gray-800 dark:text-gray-200 mt-4">
              No incomes recorded
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">
              Ensure you configure filters or add a new cash flow stream above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px]">
            <table className="premium-table text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-4">Title</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Amount</th>
                  <th className="pb-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/40 dark:divide-gray-800/20">
                {filteredIncomes.map((inc) => (
                  <tr key={inc._id}>
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-800 dark:text-gray-150">{inc.title}</p>
                      {inc.notes && <p className="text-[10px] text-gray-400 mt-0.5 max-w-xs truncate">{inc.notes}</p>}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        {inc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-500 dark:text-gray-400">
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-bold text-right text-emerald-500">
                      ₹{inc.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(inc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(inc._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 shadow-2xl relative fade-in border border-indigo-500/20">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 text-gray-400"
            >
              <FiX className="text-lg" />
            </button>

            <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white mb-6">
              {editingIncome ? 'Edit Income Stream' : 'Record Income Stream'}
            </h3>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Salary, Consultation Fee, Freelance..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="glass-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</label>
                  <div className="input-icon-container">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="glass-input cursor-pointer appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Date</label>
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="glass-input glass-input-with-icon"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Notes (Optional)</label>
                <textarea
                  placeholder="Additional descriptions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="glass-input h-20 resize-none py-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Save Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
