import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OnboardingIllustration } from '../components/Illustrations';
import { FiUser, FiMail, FiLock, FiCamera, FiAlertCircle } from 'react-icons/fi';
import logoImg from '../assets/logo.jpg';

const Register = () => {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // Handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      <div className="w-full max-w-5xl glass-panel overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] shadow-2xl scale-up">
        {/* Left Side: Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex w-10 h-10 rounded-xl overflow-hidden items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
              <img src={logoImg} alt="SpendSense Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-800 dark:text-white leading-tight">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Initialize your Wealth Portfolio Dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Profile Avatar Upload preview */}
            <div className="flex items-center gap-4 mb-2">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="text-2xl text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 shadow shadow-indigo-600/30 transition-colors">
                  <FiCamera className="text-[10px]" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Avatar Image</h4>
                <p className="text-[10px] text-gray-400">Select a local profile image (optional)</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
              <div className="input-icon-container">
                <div className="input-icon-left">
                  <FiUser className="text-gray-400 text-base" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glass-input glass-input-with-icon"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Password</label>
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

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Confirm Password</label>
                <div className="input-icon-container">
                  <div className="input-icon-left">
                    <FiLock className="text-gray-400 text-base" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input glass-input-with-icon"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center mt-5 text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Right Side: Showcase */}
        <div className="hidden md:col-span-5 bg-gradient-to-br from-indigo-950/20 to-violet-950/20 border-l border-white/5 p-8 sm:p-10 md:flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
              Secure Ledger Space
            </span>
            <h3 className="font-heading font-extrabold text-lg text-gray-800 dark:text-white mt-1.5">
              Portfolio Onboarding
            </h3>
          </div>

          <div className="w-full py-4">
            <OnboardingIllustration />
          </div>

          <div className="w-full text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
            Start tracking, customize budget caps, set savings benchmarks, and access automated reports.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
