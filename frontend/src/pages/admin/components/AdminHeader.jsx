import React from 'react';

const AdminHeader = ({ activeTab }) => {
  const userName = localStorage.getItem("userName") || "Admin User";

  const getTitle = (tab) => {
    switch(tab) {
      case 'dashboard': return 'Dashboard Admin';
      case 'reports': return 'Manajemen Laporan';
      case 'users': return 'Manajemen Pengguna';
      case 'settings': return 'Pengaturan';
      default: return 'Dashboard Admin';
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
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block">{userName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;