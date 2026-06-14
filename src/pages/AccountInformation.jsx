import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { AchievementBadge } from '../components/Illustrations';
import API, { getProfileImageUrl } from '../services/api';
import {
  FiUser,
  FiMail,
  FiCamera,
  FiAlertCircle,
  FiCheckCircle,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiFileText,
  FiBriefcase,
  FiDollarSign,
  FiTarget,
  FiCalendar,
} from 'react-icons/fi';



const AccountInformation = () => {
  const { user, updateProfile } = useAuth();
  const { incomes, expenses, budgets, goals } = useFinance();

  // Profile Form Fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [country, setCountry] = useState(user?.country || '');
  const [state, setState] = useState(user?.state || '');
  const [city, setCity] = useState(user?.city || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || '');
  const [financialGoalText, setFinancialGoalText] = useState(user?.financialGoalText || '');
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Stats
  const [stats, setStats] = useState(null);

  // Status indicators
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
      setCountry(user.country || '');
      setState(user.state || '');
      setCity(user.city || '');
      setOccupation(user.occupation || '');
      setMonthlyIncome(user.monthlyIncome || '');
      setFinancialGoalText(user.financialGoalText || '');
      setAboutMe(user.aboutMe || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/auth/profile/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Stats error:', err);
      }
    };
    fetchStats();
  }, [incomes, expenses]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileError('File size must be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    // Phone number verification
    if (phoneNumber && phoneNumber.trim() !== '') {
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      const isPhoneValid = /^\+?[0-9]{10,15}$/.test(cleanPhone);
      if (!isPhoneValid) {
        setProfileError('Invalid mobile number. It must be a valid 10-15 digit number.');
        setProfileLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('occupation', occupation);
    formData.append('monthlyIncome', monthlyIncome);
    formData.append('financialGoalText', financialGoalText);
    formData.append('aboutMe', aboutMe);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      await updateProfile(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      setProfileSuccess('Profile updated successfully!');
      setProfileImage(null);
      setImagePreview(null);
      setUploadProgress(null);
    } catch (err) {
      setProfileError(err.message || 'Profile update failed');
      setUploadProgress(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // Profile completion calculation (out of 11 fields)
  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const fields = [
      user.fullName,
      user.email,
      user.phoneNumber,
      user.country,
      user.state,
      user.city,
      user.occupation,
      user.monthlyIncome,
      user.profileImage,
      user.financialGoalText,
      user.aboutMe,
    ];
    const filled = fields.filter((f) => f !== undefined && f !== '' && f !== null && f !== 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  // Achievements checks
  const achievements = useMemo(() => {
    return {
      beginner: expenses.length > 0,
      budget_master: budgets.length > 0,
      savings_champion: goals.length > 0,
      goal_achiever: goals.some((g) => g.status === 'Completed' || g.savedAmount >= g.targetAmount),
    };
  }, [expenses, budgets, goals]);

  return (
    <div className="flex flex-col gap-6 fade-in-slide">
      {/* Page Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white leading-none">
          Account Information
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">View and update your personal portfolio details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Dynamic Badges */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* User Card */}
          <div className="glass-panel p-6 flex flex-col items-center text-center shadow-sm relative">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 border-4 border-indigo-500/20 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profileImage ? (
                  <img
                    src={getProfileImageUrl(user.profileImage)}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-4xl text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 shadow transition-colors">
                <FiCamera className="text-xs" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="w-full max-w-[150px] mb-4 flex flex-col gap-1.5 mx-auto">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-indigo-500">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-gray-150">
              {user?.fullName}
            </h3>
            <p className="text-xs text-gray-450 font-semibold truncate max-w-xs">{user?.email}</p>

            <div className="w-full mt-4 flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                <span>Profile Completion</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>

            {/* Member since metadata */}
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4 flex items-center gap-1">
              <FiCalendar /> Member Since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          {/* Global Statistics Card */}
          <div className="glass-panel p-5 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-gray-400">Ledger Summary</span>
            <h4 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mt-1 mb-4">
              Financial Health
            </h4>

            <div className="flex flex-col gap-3.5 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-gray-450">Balance Value</span>
                <span className="text-gray-800 dark:text-white">₹{(stats?.currentBalance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450">Total Income</span>
                <span className="text-emerald-500">₹{(stats?.totalIncome || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450">Total Expenses</span>
                <span className="text-red-500">₹{(stats?.totalExpense || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450">Goals Savings</span>
                <span className="text-indigo-500">₹{(stats?.totalSavings || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450">Active Milestones</span>
                <span className="text-gray-800 dark:text-white">{goals.length} target chests</span>
              </div>
            </div>
          </div>

          {/* Badges Box */}
          <div className="glass-panel p-5 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-gray-400">Accomplishments</span>
            <h4 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mt-1 mb-4">
              Milestone Badges
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <AchievementBadge type="beginner" unlocked={achievements.beginner} />
              <AchievementBadge type="budget_master" unlocked={achievements.budget_master} />
              <AchievementBadge type="savings_champion" unlocked={achievements.savings_champion} />
              <AchievementBadge type="goal_achiever" unlocked={achievements.goal_achiever} />
            </div>
          </div>
        </div>

        {/* Right Columns: Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Account Details Forms */}
          <div className="glass-panel p-6 shadow-sm">
            <h3 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FiUser className="text-indigo-500" /> Personal Details
            </h3>

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                <FiCheckCircle className="shrink-0 text-base" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                <FiAlertCircle className="shrink-0 text-base" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input text-xs"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input text-xs"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Mobile Number</label>
                  <div className="input-icon-container">
                    <div className="input-icon-left">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="glass-input glass-input-with-icon text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Country</label>
                  <div className="input-icon-container">
                    <div className="input-icon-left">
                      <FiGlobe className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="glass-input glass-input-with-icon text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">State</label>
                  <div className="input-icon-container">
                    <div className="input-icon-left">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Tamil Nadu"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="glass-input glass-input-with-icon text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">City</label>
                  <div className="input-icon-container">
                    <div className="input-icon-left">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="glass-input glass-input-with-icon text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Occupation</label>
                  <div className="input-icon-container">
                    <div className="input-icon-left">
                      <FiBriefcase className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="glass-input glass-input-with-icon text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Monthly Income (₹)</label>
                  <div className="input-icon-container">
                    <div className="input-icon-left">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="e.g. 80000"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="glass-input glass-input-with-icon text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Financial Goal</label>
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiTarget className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Buy a flat by 2028, Clear credit card dues..."
                    value={financialGoalText}
                    onChange={(e) => setFinancialGoalText(e.target.value)}
                    className="glass-input glass-input-with-icon text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">About Me</label>
                <div className="input-icon-container">
                  <div className="input-icon-left !items-start pt-3">
                    <FiFileText className="text-gray-400" />
                  </div>
                  <textarea
                    placeholder="Tell us about your financial philosophy, interests, or background..."
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    className="glass-input glass-input-with-icon h-24 resize-none py-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
                >
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
