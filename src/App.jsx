import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy loading all pages for optimal performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Income = lazy(() => import('./pages/Income'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Budgets = lazy(() => import('./pages/Budgets'));
const Goals = lazy(() => import('./pages/Goals'));
const AccountInformation = lazy(() => import('./pages/AccountInformation'));
const Settings = lazy(() => import('./pages/Settings'));
const FinancialLearning = lazy(() => import('./pages/FinancialLearning'));

// Premium Skeleton Loading Screen
const SkeletonLoaderPanel = () => (
  <div className="p-4 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full fade-in">
    <div className="h-16 w-full rounded-2xl skeleton-loader" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="h-24 rounded-xl skeleton-loader" />
      <div className="h-24 rounded-xl skeleton-loader" />
      <div className="h-24 rounded-xl skeleton-loader" />
      <div className="h-24 rounded-xl skeleton-loader" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-64 lg:col-span-1 rounded-xl skeleton-loader" />
      <div className="h-64 lg:col-span-2 rounded-xl skeleton-loader" />
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <Suspense fallback={<SkeletonLoaderPanel />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/income"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Income />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Expenses />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budgets"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Budgets />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/goals"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Goals />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account-information"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AccountInformation />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Settings />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/financial-learning"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <FinancialLearning />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallbacks */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
