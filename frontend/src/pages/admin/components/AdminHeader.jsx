import React from 'react';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ 
  activeTab, 
  isMobileMenuOpen = false, 
  setIsMobileMenuOpen = () => {} 
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getTitle = (tab) => {
    switch(tab) {
      case 'dashboard': return 'Dashboard Admin';
      case 'reports': return 'Manajemen Laporan';
      case 'users': return 'Manajemen Staff';
      default: return 'Dashboard Admin';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            {/* Menu Button & Title */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {getTitle(activeTab)}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  Damkar Makassar
                </p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* User Avatar */}
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {(user.name || 'Admin User').charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {(user.name || 'Admin User').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {getTitle(activeTab)}
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Dinas Pemadam Kebakaran Kota Makassar
            </p>
          </div>
          
          {/* User Info & Actions */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 truncate max-w-32 xl:max-w-none">
                  {user.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
              
              {/* Avatar */}
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-base font-medium">
                  {(user.name || 'Admin User').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;