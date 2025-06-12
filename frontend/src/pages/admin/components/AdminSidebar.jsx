import React from 'react';
import { BarChart3, FileText, Users, X } from 'lucide-react';

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isMobileMenuOpen = false, 
  setIsMobileMenuOpen = () => {} 
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: FileText,
    },
    {
      id: 'users',
      label: 'Staff',
      icon: Users
    }
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  if (isMobileMenuOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 flex flex-col">
          <div className="p-4 border-b bg-red-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Portal</h1>
                  <p className="text-sm text-red-100">Damkar Makassar</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-red-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="px-2 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu Admin
              </p>
            </div>
            
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-red-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50 mt-auto">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Dinas Pemadam Kebakaran</p>
              <p className="text-xs text-gray-400">Kota Makassar</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:shadow-sm lg:border-r lg:h-screen lg:fixed lg:left-0 lg:top-0">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm text-gray-500">Damkar Makassar</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="px-2 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu Admin
          </p>
        </div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`
              w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors duration-200
              ${activeTab === item.id
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-red-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t bg-gray-50 mt-auto">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Dinas Pemadam Kebakaran</p>
          <p className="text-xs text-gray-400">Kota Makassar</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;