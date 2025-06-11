import React from 'react';
import { BarChart3, FileText, Settings, X } from 'lucide-react';

const StaffSidebar = ({ 
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
      badge: '23'
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings
    }
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile Overlay
  if (isMobileMenuOpen) {
    return (
      <>
        {/* Background Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Mobile Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300">
          {/* Header */}
          <div className="p-4 border-b bg-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Staff Portal</h1>
                  <p className="text-sm text-blue-100">Damkar Makassar</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-blue-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
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

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Dinas Pemadam Kebakaran</p>
              <p className="text-xs text-gray-400">Kota Makassar</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:shadow-sm lg:border-r lg:min-h-screen">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Staff Portal</h1>
            <p className="text-sm text-gray-500">Damkar Makassar</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`
              w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors duration-200
              ${activeTab === item.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
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

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Dinas Pemadam Kebakaran</p>
          <p className="text-xs text-gray-400">Kota Makassar</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;