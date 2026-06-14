import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SecureAuthIllustration } from '../components/Illustrations';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import logoImg from '../assets/logo.jpg';

const Login = () => {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    setError(null);
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      // Handled by AuthContext state
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotOpen(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Dynamic Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      <div className="w-full max-w-5xl glass-panel overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] shadow-2xl scale-up">
        {/* Left Side: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-flex w-10 h-10 rounded-xl overflow-hidden items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
              <img src={logoImg} alt="SpendSense Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-800 dark:text-white leading-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your credentials to access your finance cockpit
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <div className="input-icon-container">
                <div className="input-icon-left">
                  <FiMail className="text-gray-400 text-base" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input glass-input-with-icon"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <div className="input-icon-container">
                <div className="input-icon-left">
                  <FiLock className="text-gray-400 text-base" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input glass-input-with-icon"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-1 text-xs">
              <label className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Right Side: Showcase Panel */}
        <div className="hidden md:col-span-5 bg-gradient-to-br from-indigo-950/20 to-violet-950/20 border-l border-white/5 p-8 sm:p-10 md:flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
              Secure Ledger Space
            </span>
            <h3 className="font-heading font-extrabold text-lg text-gray-800 dark:text-white mt-1.5">
              Fintech Intelligence
            </h3>
          </div>

          <div className="w-full py-4">
            <SecureAuthIllustration />
          </div>

          <div className="w-full text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
            SpendSense guards transactions with AES-style local memory registries and automated budget limiters.
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 shadow-2xl relative border border-indigo-500/20 scale-up">
            <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-white mb-2">
              Forgot Password
            </h3>
            <p className="text-xs text-gray-400 mb-5 leading-normal">
              Provide email address. A simulated recovery ticket will trigger automatically.
            </p>

            {forgotSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                <FiCheckCircle className="text-lg shrink-0" />
                <span>Simulated recovery link sent!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiMail className="text-gray-400 text-base" />
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="glass-input glass-input-with-icon"
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-white/10 text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
