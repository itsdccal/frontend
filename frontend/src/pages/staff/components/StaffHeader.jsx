import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffHeader = ({ activeTab }) => {
  const userName = localStorage.getItem("userName") || "Staff User";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getTitle = (tab) => {
    switch(tab) {
      case 'dashboard': return 'Dashboard Petugas';
      case 'reports': return 'Manajemen Laporan';
      case 'settings': return 'Pengaturan';
      default: return 'Dashboard Petugas';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getTitle(activeTab)}
            </h1>
            <p className="text-gray-600">Dinas Pemadam Kebakaran Kota Makassar</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || userName}</p>
                <p className="text-xs text-gray-500">Petugas Damkar</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user.name || userName).charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;