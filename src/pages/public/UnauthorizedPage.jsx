// src/pages/public/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
  const { logout, role } = useAuth();

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full border border-[#E6F2E8] text-center">
        <div className="flex justify-center">
          <ShieldAlert size={64} className="text-amber-500" />
        </div>
        
        <h1 className="mt-6 text-2xl font-bold text-gray-800">Access Denied</h1>
        
        <p className="mt-4 text-gray-600">
          You don't have permission to access this page. 
          {role && (
            <span> Your current role is <span className="font-semibold">{role}</span>.</span>
          )}
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="flex items-center justify-center py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go to Home
          </Link>
          
          <button
            onClick={logout}
            className="flex items-center justify-center py-2.5 px-4 bg-[#6BBF59] hover:bg-[#5CAF4A] text-white rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}