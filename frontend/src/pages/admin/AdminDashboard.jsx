import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import UsersView from './components/UsersView';
import SettingsView from './components/SettingsView';
import { useAdminData } from './hooks/useAdminData';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    stats,
    recentReports,
    users,
    dailyActivity,
    filteredReports,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    userSearchTerm,
    setUserSearchTerm
  } = useAdminData();

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            stats={stats}
            recentReports={recentReports}
            dailyActivity={dailyActivity}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            filteredReports={filteredReports}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        );
      case 'users':
        return (
          <UsersView 
            filteredUsers={filteredUsers}
            userSearchTerm={userSearchTerm}
            setUserSearchTerm={setUserSearchTerm}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView 
            stats={stats}
            recentReports={recentReports}
            dailyActivity={dailyActivity}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1">
          <AdminHeader activeTab={activeTab} />
          
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;