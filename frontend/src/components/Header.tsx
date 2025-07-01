import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plane, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center  gap-3 sm:gap-0 py-3 sm:py-4">
          
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-xl shadow-sm">
              <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gray-900">FFP Manager</h1>
              <p className="text-xs sm:text-sm text-gray-500 leading-tight">Frequent Flyer Program</p>
            </div>
          </div>

          {/* User Info + Logout */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-gray-700">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <User className="h-4 w-4" />
              <span className="font-medium truncate max-w-[120px] sm:max-w-none">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-primary-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
