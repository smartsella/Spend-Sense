import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import {
  FiGrid,
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiUser,
  FiLogOut,
  FiMoon,
  FiSun,
  FiBell,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2,
  FiFolder,
  FiBookOpen,
  FiSettings,
  FiActivity,
  FiFileText,
} from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useFinance();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Income', path: '/income', icon: FiTrendingUp },
    { name: 'Expenses', path: '/expenses', icon: FiTrendingDown },
    { name: 'Budget', path: '/budgets', icon: FiFolder },
    { name: 'Goals', path: '/goals', icon: FiTarget },
    { name: 'Financial Learning', path: '/financial-learning', icon: FiBookOpen },
  ];

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    const apiBase = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';
    return `${apiBase}${imagePath}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Reusable bottom Profile Card component for Sidebar
  const ProfileSection = () => {
    return (
      <div className="glass-panel p-4 flex flex-col gap-3.5 shadow-sm border border-indigo-500/10 bg-white/20 dark:bg-black/20 backdrop-blur-md">
        {/* Profile Info Row - Clickable Link to Account Information */}
        <Link
          to="/account-information"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 pb-3.5 border-b border-gray-200/40 dark:border-gray-800/30 hover:opacity-85 transition-opacity cursor-pointer group/profile"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover/profile:border-indigo-500 transition-colors">
            {user?.profileImage ? (
              <img
                src={getProfileImageUrl(user.profileImage)}
                alt={user?.fullName || 'Profile'}
                className="w-full h-full object-cover animate-fade-in"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                }}
              />
            ) : (
              <FiUser className="text-xl text-gray-400 group-hover/profile:text-indigo-550 dark:group-hover/profile:text-indigo-400 transition-colors" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="font-heading font-bold text-xs text-gray-900 dark:text-white truncate leading-snug group-hover/profile:text-indigo-650 dark:group-hover/profile:text-indigo-400 transition-colors">
              {user?.fullName || 'Investor'}
            </h4>
            <p className="text-[10px] text-gray-400 font-semibold truncate leading-none mt-0.5">
              {user?.email || 'investor@spendsense.com'}
            </p>
          </div>
        </Link>

        {/* Action Links */}
        <div className="flex flex-col gap-1 text-xs">
          {/* Settings */}
          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-650 dark:text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <FiSettings className="text-sm shrink-0" />
            <span>Settings</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-650 dark:text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full text-left cursor-pointer"
          >
            {theme === 'dark' ? <FiSun className="text-sm shrink-0" /> : <FiMoon className="text-sm shrink-0" />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              setMobileOpen(false);
              setLogoutConfirmOpen(true);
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-red-650 dark:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer font-bold"
          >
            <FiLogOut className="text-sm shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex font-sans overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-66 bg-[var(--sidebar-bg)] border-r border-gray-200/50 dark:border-gray-800/40 rounded-none m-0 h-screen sticky top-0 p-5 z-30 transition-all">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-heading font-black text-xl">📈</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-base leading-none tracking-wide text-gray-800 dark:text-gray-100">
              SpendSense
            </h1>
            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1 block">
              Analytics Hub
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 py-2 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Determine active state with hash matching support to avoid duplicate selection highlights
            const active = item.name === 'Dashboard'
              ? location.pathname === '/dashboard' && !location.hash
              : item.name === 'Analytics'
                ? location.pathname === '/dashboard' && location.hash === '#analytics'
                : item.name === 'Reports'
                  ? location.pathname === '/dashboard' && location.hash === '#reports'
                  : item.name === 'Notifications'
                    ? location.pathname === '/dashboard' && location.hash === '#notifications'
                    : location.pathname === item.path;
            
            return (
              <Link
                key={item.name + item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 relative group ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {/* Active side indicator */}
                {active && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md" />
                )}
                <Icon className="text-base shrink-0" />
                <span>{item.name}</span>
                
                {/* Sidebar tooltip */}
                <span className="absolute left-full ml-3 px-2 py-1 rounded bg-gray-900 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 shadow-md">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Dedicated fixed bottom profile section */}
        <div className="mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-800/40 shrink-0">
          <ProfileSection />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
          {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[var(--sidebar-bg)] border-r border-gray-200/50 dark:border-gray-800/45 rounded-none z-50 p-6 flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-heading font-black text-xl">📈</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-base leading-none tracking-wide text-gray-800 dark:text-gray-100">
                SpendSense
              </h1>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1 block">
                Analytics Hub
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-500 cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>


        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 py-2 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.name === 'Dashboard'
              ? location.pathname === '/dashboard' && !location.hash
              : item.name === 'Analytics'
                ? location.pathname === '/dashboard' && location.hash === '#analytics'
                : item.name === 'Reports'
                  ? location.pathname === '/dashboard' && location.hash === '#reports'
                  : item.name === 'Notifications'
                    ? location.pathname === '/dashboard' && location.hash === '#notifications'
                    : location.pathname === item.path;

            return (
              <Link
                key={'mobile-' + item.name + item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Icon className="text-base shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Dedicated bottom fixed profile section */}
        <div className="mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-800/40 shrink-0">
          <ProfileSection />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 sticky top-0 bg-transparent backdrop-blur-md border-b border-gray-200/30 dark:border-gray-800/20 z-20 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/10 text-gray-600 dark:text-gray-300"
            >
              <FiMenu className="text-lg" />
            </button>
            
            {/* Dynamic personalized greeting */}
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 tracking-wider">
                {getGreeting()}
              </span>
              <h2 className="font-heading font-extrabold text-sm text-gray-800 dark:text-gray-100">
                Welcome, {user?.fullName || 'Investor'}
              </h2>
            </div>
          </div>



          <div className="flex items-center gap-3.5 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-indigo-500/10 border border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-300 transition-all relative"
              >
                <FiBell className="text-base" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Alerts */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel p-4 shadow-2xl z-50 scale-up border border-indigo-500/15">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50 dark:border-gray-800/50">
                    <h3 className="font-heading font-bold text-xs text-gray-800 dark:text-gray-100">
                      Notifications Alert Center ({unreadCount})
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-600"
                      >
                        Read All
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-[10px] text-gray-500 py-6 uppercase font-bold tracking-wider">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-3 rounded-xl text-xs flex gap-2 justify-between items-start transition-colors duration-150 border ${
                            n.isRead
                              ? 'bg-transparent border-transparent text-gray-500'
                              : 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/10 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <div className="flex gap-2">
                            {n.type === 'Goal Completion' ? (
                              <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5 text-base" />
                            ) : (
                              <FiAlertTriangle className="text-amber-500 shrink-0 mt-0.5 text-base" />
                            )}
                            <div>
                              <p className="font-semibold leading-relaxed text-[11px]">{n.message}</p>
                              <span className="text-[9px] text-gray-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0 items-center">
                            {!n.isRead && (
                              <button
                                onClick={() => markNotificationAsRead(n._id)}
                                className="text-[9px] text-indigo-500 font-bold uppercase hover:underline"
                              >
                                Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(n._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal Overlay */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 shadow-2xl relative border border-indigo-500/20 scale-up text-center bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <FiLogOut className="text-xl" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-405 mb-6 leading-relaxed">
              Are you sure you want to log out of your SpendSense account? You will need to sign in again to access your portfolio.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 border border-gray-200/50 dark:border-gray-800/40 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  handleLogout();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-650 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/10 cursor-pointer transition-colors"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
