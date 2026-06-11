import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiSettings,
  FiShield,
  FiBell,
  FiCpu,
  FiDollarSign,
  FiCheck,
} from 'react-icons/fi';

const Settings = () => {
  const { changePassword } = useAuth();
  const { theme, setTheme } = useTheme();

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Preference Toggle States
  const [budgetAlerts, setBudgetAlerts] = useState(() => {
    return localStorage.getItem('pref_budget_alerts') !== 'false';
  });
  const [advisorInsights, setAdvisorInsights] = useState(() => {
    return localStorage.getItem('pref_advisor_insights') !== 'false';
  });
  const [emailDigest, setEmailDigest] = useState(() => {
    return localStorage.getItem('pref_email_digest') === 'true';
  });

  // Password Validations
  const isLengthValid = newPassword.length >= 6;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const matchesConfirm = newPassword === confirmPassword && confirmPassword !== '';

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!isLengthValid || !hasNumber) {
      setPasswordError('New password does not meet the validation criteria');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Password update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggle = (key, state, setter) => {
    const nextState = !state;
    setter(nextState);
    localStorage.setItem(key, String(nextState));
  };

  return (
    <div className="flex flex-col gap-6 fade-in-slide">
      {/* Page Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white leading-none">
          Settings
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">Manage themes, password security, and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Theme & Preferences */}
        <div className="flex flex-col gap-6">
          {/* Theme Settings Card */}
          <div className="glass-panel p-6 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Theme Management
            </span>
            <h3 className="font-heading font-bold text-sm text-gray-800 dark:text-white mt-1 mb-6 flex items-center gap-2">
              <FiSun className="text-indigo-500" /> Theme Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Mode Selector Card */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-3 group relative ${
                  theme === 'light'
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white/40 dark:bg-black/10 border-gray-200/50 dark:border-gray-800/40 hover:border-indigo-500/50'
                }`}
              >
                {theme === 'light' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <FiCheck className="text-xs" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <FiSun className="text-lg" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white">Light Mode</h4>
                  <p className="text-[10px] text-gray-450 mt-1 font-semibold leading-relaxed">
                    Sleek white dashboard layout with dark slate text tokens.
                  </p>
                </div>
              </button>

              {/* Dark Mode Selector Card */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-3 group relative ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/15'
                    : 'bg-white/40 dark:bg-black/10 border-gray-200/50 dark:border-gray-800/40 hover:border-indigo-500/50'
                }`}
              >
                {theme === 'dark' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <FiCheck className="text-xs" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <FiMoon className="text-lg" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white">Dark Mode</h4>
                  <p className="text-[10px] text-gray-450 mt-1 font-semibold leading-relaxed">
                    Premium deep space gradient layout with high-visibility white text.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* User Preferences Card */}
          <div className="glass-panel p-6 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Account Preferences
            </span>
            <h3 className="font-heading font-bold text-sm text-gray-800 dark:text-white mt-1 mb-6 flex items-center gap-2">
              <FiSettings className="text-indigo-500" /> User Preferences
            </h3>

            <div className="flex flex-col gap-4">
              {/* Option 1 */}
              <div className="flex justify-between items-center py-2 border-b border-gray-200/40 dark:border-gray-800/20">
                <div className="flex gap-3 items-start pr-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FiBell className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white leading-tight">Budget Limit Alerts</h4>
                    <p className="text-[10px] text-gray-450 mt-0.5 leading-relaxed font-semibold">
                      Notify me when expenses exceed 80% of category limits.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('pref_budget_alerts', budgetAlerts, setBudgetAlerts)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    budgetAlerts ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      budgetAlerts ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex justify-between items-center py-2 border-b border-gray-200/40 dark:border-gray-800/20">
                <div className="flex gap-3 items-start pr-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCpu className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white leading-tight">Automated Insights</h4>
                    <p className="text-[10px] text-gray-450 mt-0.5 leading-relaxed font-semibold">
                      Enable the smart financial advisor algorithm recommendations.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('pref_advisor_insights', advisorInsights, setAdvisorInsights)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    advisorInsights ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      advisorInsights ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex justify-between items-center py-2">
                <div className="flex gap-3 items-start pr-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FiDollarSign className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white leading-tight">Email Statement Digest</h4>
                    <p className="text-[10px] text-gray-450 mt-0.5 leading-relaxed font-semibold">
                      Email me generated monthly statement ledger reports.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('pref_email_digest', emailDigest, setEmailDigest)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    emailDigest ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      emailDigest ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Security Settings
            </span>
            <h3 className="font-heading font-bold text-sm text-gray-800 dark:text-white mt-1 mb-6 flex items-center gap-2">
              <FiShield className="text-indigo-500" /> Change Password
            </h3>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                <FiCheckCircle className="shrink-0 text-base" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                <FiAlertCircle className="shrink-0 text-base" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Old Password</label>
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="glass-input glass-input-with-icon text-xs"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">New Password</label>
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-input glass-input-with-icon text-xs"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Confirm New Password</label>
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input glass-input-with-icon text-xs"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Password Validation Requirements */}
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200/30 dark:border-gray-800/30 flex flex-col gap-2.5 text-[10px] font-semibold">
                <span className="uppercase text-gray-400 tracking-wider">Validation Criteria</span>
                
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isLengthValid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-200 text-gray-400 dark:bg-white/5'
                  }`}>
                    <FiCheck className="text-[10px]" />
                  </div>
                  <span className={isLengthValid ? 'text-emerald-500' : 'text-gray-450'}>At least 6 characters</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    hasNumber ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-200 text-gray-400 dark:bg-white/5'
                  }`}>
                    <FiCheck className="text-[10px]" />
                  </div>
                  <span className={hasNumber ? 'text-emerald-500' : 'text-gray-450'}>At least one numeric digit (0-9)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    matchesConfirm ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-200 text-gray-400 dark:bg-white/5'
                  }`}>
                    <FiCheck className="text-[10px]" />
                  </div>
                  <span className={matchesConfirm ? 'text-emerald-500' : 'text-gray-450'}>Passwords match</span>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
