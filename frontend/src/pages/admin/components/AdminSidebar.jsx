import React from 'react';
import { BarChart3, FileText, Users, Menu, X } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
      label: 'Staff',
      icon: Users
    }
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white border-b px-4 py-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
          <span className="ml-2 font-medium">Menu</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r min-h-screen transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold">
            ADMIN<span className="text-red-500">PAK</span>
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block p-6">
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
              Menu Admin
            </p>
          </div>
          
          <div className="mt-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full text-left flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
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
    </>
  );
};
export default AdminSidebar;