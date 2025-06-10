import React, { useState } from 'react';
import StaffSidebar from './components/StaffSidebar';
import StaffHeader from './components/StaffHeader';
import StaffDashboardView from './components/StaffDashboardView';
import StaffReportsView from './components/StaffReportsView';
import StaffSettingsView from './components/StaffSettingsView';
import { useAdminData } from '../admin/hooks/useAdminData';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    stats,
    recentReports,
    dailyActivity,
    filteredReports,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
  } = useAdminData();

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <StaffDashboardView 
            stats={stats}
            recentReports={recentReports}
            dailyActivity={dailyActivity}
          />
        );
      case 'reports':
        return (
          <StaffReportsView 
            filteredReports={filteredReports}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        );
      case 'settings':
        return <StaffSettingsView />;
      default:
        return (
          <StaffDashboardView 
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
        <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1">
          <StaffHeader activeTab={activeTab} />
          
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;