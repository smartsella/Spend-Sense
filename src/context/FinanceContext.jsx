import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('finance_incomes');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finance_expenses');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finance_budgets');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finance_goals');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('finance_notifications');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [insights, setInsights] = useState(() => {
    const saved = localStorage.getItem('finance_insights');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('finance_stats');
    try {
      return saved ? JSON.parse(saved) : {
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: 0,
        totalSavings: 0,
      };
    } catch (e) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: 0,
        totalSavings: 0,
      };
    }
  });

  // Fetch all user transactional & goal data
  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [incRes, expRes, budRes, goalRes, notRes, insRes] = await Promise.all([
        API.get('/income'),
        API.get('/expense'),
        API.get('/budgets'),
        API.get('/goals'),
        API.get('/notifications'),
        API.get('/insights'),
      ]);

      setIncomes(incRes.data);
      setExpenses(expRes.data);
      setBudgets(budRes.data);
      setGoals(goalRes.data);
      setNotifications(notRes.data);
      setInsights(insRes.data);

      localStorage.setItem('finance_incomes', JSON.stringify(incRes.data));
      localStorage.setItem('finance_expenses', JSON.stringify(expRes.data));
      localStorage.setItem('finance_budgets', JSON.stringify(budRes.data));
      localStorage.setItem('finance_goals', JSON.stringify(goalRes.data));
      localStorage.setItem('finance_notifications', JSON.stringify(notRes.data));
      localStorage.setItem('finance_insights', JSON.stringify(insRes.data));

      // Calculate totals
      const totalIncome = incRes.data.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expRes.data.reduce((sum, item) => sum + item.amount, 0);
      const currentBalance = totalIncome - totalExpense;
      // Total Savings are accumulated in Goal collections savedAmount
      const totalSavings = goalRes.data.reduce((sum, item) => sum + item.savedAmount, 0);

      const calculatedStats = {
        totalIncome,
        totalExpense,
        currentBalance,
        totalSavings,
      };
      setStats(calculatedStats);
      localStorage.setItem('finance_stats', JSON.stringify(calculatedStats));
    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setIncomes([]);
      setExpenses([]);
      setBudgets([]);
      setGoals([]);
      setNotifications([]);
      setInsights([]);
      setStats({
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: 0,
        totalSavings: 0,
      });
      localStorage.removeItem('finance_incomes');
      localStorage.removeItem('finance_expenses');
      localStorage.removeItem('finance_budgets');
      localStorage.removeItem('finance_goals');
      localStorage.removeItem('finance_notifications');
      localStorage.removeItem('finance_insights');
      localStorage.removeItem('finance_stats');
    }
  }, [user, fetchAllData]);

  // Income Operations
  const addIncome = async (data) => {
    const res = await API.post('/income', data);
    await fetchAllData();
    return res.data;
  };

  const updateIncome = async (id, data) => {
    const res = await API.put(`/income/${id}`, data);
    await fetchAllData();
    return res.data;
  };

  const deleteIncome = async (id) => {
    const res = await API.delete(`/income/${id}`);
    await fetchAllData();
    return res.data;
  };

  // Expense Operations
  const addExpense = async (data) => {
    const res = await API.post('/expense', data);
    await fetchAllData();
    return res.data;
  };

  const updateExpense = async (id, data) => {
    const res = await API.put(`/expense/${id}`, data);
    await fetchAllData();
    return res.data;
  };

  const deleteExpense = async (id) => {
    const res = await API.delete(`/expense/${id}`);
    await fetchAllData();
    return res.data;
  };

  // Budget Operations
  const addBudget = async (data) => {
    const res = await API.post('/budgets', data);
    await fetchAllData();
    return res.data;
  };

  const updateBudget = async (id, data) => {
    const res = await API.put(`/budgets/${id}`, data);
    await fetchAllData();
    return res.data;
  };

  const deleteBudget = async (id) => {
    const res = await API.delete(`/budgets/${id}`);
    await fetchAllData();
    return res.data;
  };

  // Goal Operations
  const addGoal = async (data) => {
    const res = await API.post('/goals', data);
    await fetchAllData();
    return res.data;
  };

  const updateGoal = async (id, data) => {
    const res = await API.put(`/goals/${id}`, data);
    await fetchAllData();
    return res.data;
  };

  const deleteGoal = async (id) => {
    const res = await API.delete(`/goals/${id}`);
    await fetchAllData();
    return res.data;
  };

  // Notification Operations
  const markNotificationAsRead = async (id) => {
    const res = await API.put(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((not) => (not._id === id ? { ...not, isRead: true } : not))
    );
    return res.data;
  };

  const markAllNotificationsAsRead = async () => {
    const res = await API.put('/notifications/read-all');
    setNotifications((prev) => prev.map((not) => ({ ...not, isRead: true })));
    return res.data;
  };

  const deleteNotification = async (id) => {
    const res = await API.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((not) => not._id !== id));
    return res.data;
  };

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        budgets,
        goals,
        notifications,
        insights,
        stats,
        loading,
        refreshData: fetchAllData,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
