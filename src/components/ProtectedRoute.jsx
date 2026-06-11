import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0a1c] to-[#05020a] text-white">
        <div className="relative flex flex-col items-center">
          {/* Neon spinner */}
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-heading text-lg tracking-wider font-semibold animate-pulse text-violet-400">
            Securing Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
