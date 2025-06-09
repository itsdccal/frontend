import React from 'react';
import { BarChart3, FileText, Users, Settings } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
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
      id: 'users',
      label: 'Pengguna',
      icon: Users
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="bg-red-500 text-white p-2 rounded">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">
            ADMIN<span className="text-red-500">PAK</span>
          </span>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu Utama
          </p>
        </div>
        
        <div className="mt-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;