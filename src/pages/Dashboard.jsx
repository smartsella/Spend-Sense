import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnalyticsIllustration } from '../components/Illustrations';
import { getChartConfig } from '../utils/themeConfig';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiTarget,
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiInfo,
  FiHeart,
  FiCalendar,
  FiChevronDown,
  FiTrendingUp as FiSavings,
} from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Count-up counter with rAF (Memoized for peak rendering performance)
const AnimatedCounter = React.memo(({ value, duration = 800, prefix = '₹', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(value);
    if (isNaN(end) || end === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
      {suffix}
    </span>
  );
});

const COLORS = ['#6366f1', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#4f46e5', '#f43f5e', '#14b8a6', '#64748b'];

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { incomes, expenses, budgets, goals, insights, stats, loading } = useFinance();

  // Exporter Form States
  const [reportType, setReportType] = useState('monthly'); // 'monthly' | 'quarterly' | 'yearly'
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedQuarter, setSelectedQuarter] = useState('1'); // '1' | '2' | '3' | '4'
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [exporting, setExporting] = useState(false);

  const statementRef = useRef(null);
  const chartConfig = useMemo(() => getChartConfig(theme), [theme]);

  // Dynamic values based on selected timeframe for PDF Report
  const filteredReportData = useMemo(() => {
    let start = new Date();
    let end = new Date();

    if (reportType === 'monthly') {
      const [y, m] = selectedMonth.split('-');
      start = new Date(parseInt(y), parseInt(m) - 1, 1);
      end = new Date(parseInt(y), parseInt(m), 0, 23, 59, 59, 999);
    } else if (reportType === 'quarterly') {
      const year = parseInt(selectedYear);
      const q = parseInt(selectedQuarter);
      start = new Date(year, (q - 1) * 3, 1);
      end = new Date(year, q * 3, 0, 23, 59, 59, 999);
    } else {
      const year = parseInt(selectedYear);
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    const reportIncomes = incomes.filter((i) => {
      const d = new Date(i.date);
      return d >= start && d <= end;
    });

    const reportExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });

    const totalIncome = reportIncomes.reduce((s, x) => s + x.amount, 0);
    const totalExpense = reportExpenses.reduce((s, x) => s + x.amount, 0);
    const netSavings = totalIncome - totalExpense;

    // Category distribution
    const categoryBreakdown = reportExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return {
      startRange: start.toLocaleDateString(),
      endRange: end.toLocaleDateString(),
      incomes: reportIncomes,
      expenses: reportExpenses,
      totalIncome,
      totalExpense,
      netSavings,
      categoryBreakdown,
    };
  }, [reportType, selectedMonth, selectedQuarter, selectedYear, incomes, expenses]);

  // Overall summaries calculations
  const summaries = useMemo(() => {
    const todayStr = new Date().toDateString();
    
    const dailyIncome = incomes
      .filter((i) => new Date(i.date).toDateString() === todayStr)
      .reduce((sum, item) => sum + item.amount, 0);

    const dailyExpense = expenses
      .filter((e) => new Date(e.date).toDateString() === todayStr)
      .reduce((sum, item) => sum + item.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyIncome = incomes
      .filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyExpense = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const totalSavings = stats.totalSavings;
    const savingsScore = stats.totalIncome > 0 
      ? Math.min(Math.round((totalSavings / stats.totalIncome) * 100), 100) 
      : 0;

    const spendRatio = stats.totalIncome > 0 ? (stats.totalExpense / stats.totalIncome) * 100 : 0;
    const spendingHealthScore = Math.max(Math.round(100 - spendRatio), 0);

    return {
      dailyIncome,
      dailyExpense,
      monthlyIncome,
      monthlyExpense,
      savingsScore,
      spendingHealthScore,
    };
  }, [incomes, expenses, stats]);

  const pieData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.keys(categoryTotals).map((cat) => ({
      name: cat,
      value: categoryTotals[cat],
    }));
  }, [expenses]);

  const trendData = useMemo(() => {
    const months = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = d.toLocaleString('en-US', { month: 'short' });
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[mKey] = { month: mName, Income: 0, Expense: 0 };
    }

    incomes.forEach((inc) => {
      const d = new Date(inc.date);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (months[mKey]) {
        months[mKey].Income += inc.amount;
      }
    });

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (months[mKey]) {
        months[mKey].Expense += exp.amount;
      }
    });

    return Object.values(months);
  }, [incomes, expenses]);

  const savingsGrowthData = useMemo(() => {
    const allTransactions = [
      ...incomes.map((i) => ({ date: new Date(i.date), amount: i.amount })),
      ...expenses.map((e) => ({ date: new Date(e.date), amount: -e.amount })),
    ].sort((a, b) => a.date - b.date);

    let runningBalance = 0;
    const data = allTransactions.map((t) => {
      runningBalance += t.amount;
      return {
        date: t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Balance: runningBalance,
      };
    });

    if (data.length === 0) {
      return [{ date: 'Today', Balance: 0 }];
    }

    return data.slice(-15);
  }, [incomes, expenses]);

  const budgetSummary = useMemo(() => {
    const d = new Date();
    const currentMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthlyBudgets = budgets.filter((b) => b.month === currentMonthKey);
    const exceeded = monthlyBudgets.filter((b) => b.currentSpent > b.limit).length;

    return {
      total: monthlyBudgets.length,
      exceeded,
    };
  }, [budgets]);

  // Download filtered PDF report
  const handleDownloadReport = async () => {
    if (!statementRef.current) return;
    setExporting(true);

    try {
      // Temporarily toggle display of printable statement
      statementRef.current.style.display = 'block';

      const canvas = await html2canvas(statementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff', // Corporate clean print white background
      });

      // Hide statement element back
      statementRef.current.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`SpendSense_Financial_Analytics_Report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Statement PDF error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 fade-in-slide">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white leading-none">
          SpendSense Dashboard
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">Configure your financial ledger parameters</p>
      </div>

      {/* Dynamic Exporter card at top */}
      <div className="glass-panel p-5 shadow-sm">
        <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
          Report Generator Center
        </span>
        <h3 className="font-heading font-bold text-sm text-gray-800 dark:text-white mt-1 mb-4">
          Export Branded Statements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Report Scope</span>
            <div className="input-icon-container">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="glass-input cursor-pointer appearance-none text-xs"
              >
                <option value="monthly">Monthly Statement</option>
                <option value="quarterly">Quarterly Statement</option>
                <option value="yearly">Yearly Statement</option>
              </select>
              <FiChevronDown className="absolute right-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Timeframe filters */}
          {reportType === 'monthly' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Select Month</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="glass-input text-xs"
              />
            </div>
          )}

          {reportType === 'quarterly' && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Select Quarter</span>
                <div className="input-icon-container">
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="glass-input cursor-pointer appearance-none text-xs"
                  >
                    <option value="1">Q1 (Jan - Mar)</option>
                    <option value="2">Q2 (Apr - Jun)</option>
                    <option value="3">Q3 (Jul - Sep)</option>
                    <option value="4">Q4 (Oct - Dec)</option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Select Year</span>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>
            </>
          )}

          {reportType === 'yearly' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Select Year</span>
              <input
                type="number"
                min="2020"
                max="2030"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="glass-input text-xs"
              />
            </div>
          )}

          <button
            onClick={handleDownloadReport}
            disabled={exporting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FiFileText />
            {exporting ? 'Compiling Statement...' : 'Download Statement'}
          </button>
        </div>
      </div>

      {/* Welcome Hero */}
      <div className="glass-panel p-6 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 relative">
        <div className="flex-1 flex flex-col text-center md:text-left">
          <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
            Financial Registry
          </span>
          <h3 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white mt-1">
            Welcome to SpendSense, {user?.fullName}!
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-lg leading-relaxed">
            Track incomes, expenses, budgets, savings goals, automated insights, and generate financial reports.
          </p>
        </div>
        <div className="w-full max-w-[150px] shrink-0">
          <AnalyticsIllustration />
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 flex items-center justify-between border-l-4 border-l-indigo-500">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Current Balance</span>
            <h3 className="font-heading font-extrabold text-xl text-gray-800 dark:text-white mt-1">
              <AnimatedCounter value={stats.currentBalance} />
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <FiDollarSign className="text-lg" />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Income</span>
            <h3 className="font-heading font-extrabold text-xl text-gray-800 dark:text-white mt-1">
              <AnimatedCounter value={stats.totalIncome} />
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <FiTrendingUp className="text-lg" />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Expenses</span>
            <h3 className="font-heading font-extrabold text-xl text-gray-800 dark:text-white mt-1">
              <AnimatedCounter value={stats.totalExpense} />
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <FiTrendingDown className="text-lg" />
          </div>
        </div>

        <div className="glass-card p-5 flex items-center justify-between border-l-4 border-l-pink-500">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Goals Savings</span>
            <h3 className="font-heading font-extrabold text-xl text-gray-800 dark:text-white mt-1">
              <AnimatedCounter value={stats.totalSavings} />
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
            <FiTarget className="text-lg" />
          </div>
        </div>
      </div>

      {/* Daily & Monthly Summaries and Health Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Spending Health</span>
            <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-1 mb-3">
              Health Score
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
              <FiHeart className="text-xl" />
            </div>
            <div>
              <span className="text-2xl font-heading font-extrabold text-gray-800 dark:text-white">
                {summaries.spendingHealthScore}%
              </span>
              <span className="text-[9px] uppercase font-bold text-gray-400 block">
                {summaries.spendingHealthScore > 80 ? 'Excellent' : summaries.spendingHealthScore > 50 ? 'Moderate' : 'Critical'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Savings Index</span>
            <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-1 mb-3">
              Savings Score
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <FiSavings className="text-xl" />
            </div>
            <div>
              <span className="text-2xl font-heading font-extrabold text-gray-800 dark:text-white">
                {summaries.savingsScore}%
              </span>
              <span className="text-[9px] uppercase font-bold text-gray-400 block">
                {summaries.savingsScore > 20 ? 'Optimal Savings' : 'Low Savings Rate'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Daily Balance</span>
            <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-1 mb-3">
              Logged Today
            </h4>
          </div>
          <div className="text-xs font-semibold flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-gray-450">Income:</span>
              <span className="text-emerald-500">₹{summaries.dailyIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-450">Expense:</span>
              <span className="text-red-500">₹{summaries.dailyExpense.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Monthly Balance</span>
            <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-1 mb-3">
              Logged This Month
            </h4>
          </div>
          <div className="text-xs font-semibold flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-gray-450">Income:</span>
              <span className="text-emerald-500">₹{summaries.monthlyIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-450">Expense:</span>
              <span className="text-red-500">₹{summaries.monthlyExpense.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets & insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget limit warnings */}
        <div className="glass-card p-5 flex flex-col justify-between lg:col-span-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Budgets Monitoring Status</span>
            <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-1 mb-4">
              Limit Warnings
            </h4>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Current Month Budgets Set</span>
                <span className="text-gray-800 dark:text-white">{budgetSummary.total} active</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Exceeded Limits</span>
                <span className={`px-2 py-0.5 rounded ${budgetSummary.exceeded > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {budgetSummary.exceeded} categories
                </span>
              </div>
            </div>
          </div>

          {budgetSummary.exceeded > 0 ? (
            <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 text-red-500 text-xs flex items-center gap-2 font-medium">
              <FiAlertTriangle className="shrink-0 text-base" />
              <span>You have exceeded {budgetSummary.exceeded} category limits this month!</span>
            </div>
          ) : (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2 font-medium">
              <FiCheckCircle className="shrink-0 text-base" />
              <span>All category spend is well within budgets!</span>
            </div>
          )}
        </div>

        {/* Insights advisor */}
        <div className="glass-card p-5 lg:col-span-2">
          <span className="text-[10px] uppercase font-bold text-gray-400">Smart Financial Advisor</span>
          <h4 className="font-heading font-bold text-base text-gray-800 dark:text-white mt-1 mb-4 flex items-center gap-1.5">
            <FiActivity className="text-indigo-500 dark:text-indigo-400 animate-pulse" /> Automated Insights Engine
          </h4>

          <div className="flex flex-col gap-3">
            {insights.length === 0 ? (
              <div className="py-6 flex items-center gap-2.5 text-xs text-gray-500">
                <FiInfo className="text-lg shrink-0" />
                <span>No data-driven insights available yet. Record transactions to compile.</span>
              </div>
            ) : (
              insights.map((ins, index) => {
                let alertTheme = 'bg-indigo-500/5 dark:bg-indigo-500/10 border-l-2 border-indigo-500 text-gray-700 dark:text-gray-300';
                if (ins.severity === 'warning' || ins.severity === 'danger') {
                  alertTheme = 'bg-red-500/5 dark:bg-red-500/10 border-l-2 border-red-500 text-gray-700 dark:text-gray-300';
                } else if (ins.severity === 'success') {
                  alertTheme = 'bg-emerald-500/5 dark:bg-emerald-500/10 border-l-2 border-emerald-500 text-gray-700 dark:text-gray-300';
                }

                return (
                  <div key={index} className={`p-3 rounded-xl text-xs leading-normal font-semibold ${alertTheme}`}>
                    {ins.message}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="glass-card p-5 h-80 flex flex-col justify-between">
          <h5 className="font-heading font-bold text-sm text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
            <FiPieChart className="text-indigo-500" /> Expense Allocation by Category
          </h5>
          <div className="flex-1 min-h-0">
            {pieData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                No expense records to analyze.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartConfig.tooltipStyle} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={chartConfig.legendStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="glass-card p-5 h-80 flex flex-col justify-between">
          <h5 className="font-heading font-bold text-sm text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
            <FiBarChart2 className="text-indigo-500" /> Monthly Spending Trends
          </h5>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridStroke} />
                <XAxis dataKey="month" stroke={chartConfig.axisStroke} fontSize={10} />
                <YAxis stroke={chartConfig.axisStroke} fontSize={10} />
                <Tooltip contentStyle={chartConfig.tooltipStyle} />
                <Bar dataKey="Expense" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 */}
        <div className="glass-card p-5 h-80 flex flex-col justify-between">
          <h5 className="font-heading font-bold text-sm text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
            <FiActivity className="text-indigo-500" /> Cash Flow Variance (Income vs Expense)
          </h5>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridStroke} />
                <XAxis dataKey="month" stroke={chartConfig.axisStroke} fontSize={10} />
                <YAxis stroke={chartConfig.axisStroke} fontSize={10} />
                <Tooltip contentStyle={chartConfig.tooltipStyle} />
                <Legend verticalAlign="top" height={36} wrapperStyle={chartConfig.legendStyle} />
                <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4 */}
        <div className="glass-card p-5 h-80 flex flex-col justify-between">
          <h5 className="font-heading font-bold text-sm text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
            <FiTrendingUp className="text-indigo-500" /> Cumulative Wealth Accumulation
          </h5>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridStroke} />
                <XAxis dataKey="date" stroke={chartConfig.axisStroke} fontSize={9} />
                <YAxis stroke={chartConfig.axisStroke} fontSize={10} />
                <Tooltip contentStyle={chartConfig.tooltipStyle} />
                <Area type="monotone" dataKey="Balance" stroke="#6366f1" fillOpacity={0.15} fill="url(#colorSavings)" strokeWidth={2.5} />
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* HIDDEN BRANDED CORPORATE STATEMENT PDF - RENDERED ONLY DURING CAPTURE */}
      <div
        ref={statementRef}
        className="p-10 w-[790px] bg-white text-gray-900 border border-gray-200"
        style={{ display: 'none', fontFamily: 'serif' }}
      >
        {/* Header Branding */}
        <div className="flex justify-between items-center border-b-2 border-indigo-600 pb-5 mb-6">
          <div>
            <h1 className="font-heading font-black text-2xl tracking-widest text-indigo-600 uppercase">
              SpendSense
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Financial Analytics Platform
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
              SpendSense Financial Analytics Report
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* User profile details */}
        <div className="bg-gray-50 border border-gray-200/50 p-4 rounded-xl mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2.5">
            Statement Metadata Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <p className="text-gray-400">Account Owner:</p>
              <p className="text-gray-800">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400">Email Address:</p>
              <p className="text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Statement Scope:</p>
              <p className="text-gray-800 uppercase text-indigo-500 font-bold">
                {reportType} ({filteredReportData.startRange} to {filteredReportData.endRange})
              </p>
            </div>
            <div>
              <p className="text-gray-400">Occupation Details:</p>
              <p className="text-gray-800">{user?.occupation || 'Not Configured'}</p>
            </div>
          </div>
        </div>

        {/* Transaction Totals Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2.5">
            Statement Balance Sheet
          </h3>
          <table className="w-full text-left text-xs border border-gray-200 border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                <th className="p-2.5">Inflows (Income)</th>
                <th className="p-2.5">Outflows (Expenses)</th>
                <th className="p-2.5">Net Savings</th>
                <th className="p-2.5">Savings Index</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              <tr className="border-b border-gray-200">
                <td className="p-2.5 text-emerald-600">₹{filteredReportData.totalIncome.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-red-500">₹{filteredReportData.totalExpense.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-indigo-600">₹{filteredReportData.netSavings.toLocaleString('en-IN')}</td>
                <td className="p-2.5">
                  {filteredReportData.totalIncome > 0
                    ? Math.round((filteredReportData.netSavings / filteredReportData.totalIncome) * 100)
                    : 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Categorized spending breakdown */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2.5">
            Category Spending Allocations
          </h3>
          {Object.keys(filteredReportData.categoryBreakdown).length === 0 ? (
            <p className="text-xs text-gray-400 italic">No category expenses recorded in this statement range.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              {Object.entries(filteredReportData.categoryBreakdown).map(([cat, val]) => {
                const ratio = filteredReportData.totalExpense > 0 ? Math.round((val / filteredReportData.totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500">{cat}</span>
                    <span className="text-gray-800 font-bold">
                      ₹{val.toLocaleString('en-IN')} ({ratio}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Financial Advisor Insights */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2.5">
            Automated Financial Insights
          </h3>
          <div className="flex flex-col gap-2">
            {insights.map((ins, index) => (
              <p key={index} className="text-xs font-semibold text-gray-700 leading-normal">
                • {ins.message}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-5 mt-10 text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} SpendSense Corporation. All Rights Reserved. Confidential analytics report.</p>
          <p className="mt-1">Verified secure ledger statement.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
