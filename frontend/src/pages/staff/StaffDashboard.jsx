import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './components/StaffSidebar';
import StaffHeader from './components/StaffHeader';
import StaffDashboardView from './components/StaffDashboardView';
import StaffReportsView from './components/StaffReportsView';
import StaffSettingsView from './components/StaffSettingsView';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    processedReports: 0,
    completedReports: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [dailyActivity, setDailyActivity] = useState({});
  const [filteredReports, setFilteredReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) {
        navigate('/login');
        return false;
      }

      try {
        const user = JSON.parse(userString);
        if (!user || !user.role || (user.role !== 'admin' && user.role !== 'petugas')) {
          navigate('/login');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
        return false;
      }
    };

    if (checkAuth()) {
      fetchData();
    }
  }, [navigate]);

  useEffect(() => {
    filterReports();
  }, [allReports, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const mockStats = {
        totalReports: 156,
        pendingReports: 23,
        processedReports: 45,
        completedReports: 88
      };

      const mockRecentReports = [
        {
          id: 1,
          title: "Kebakaran Rumah Tinggal",
          location: { address: "Jl. Merdeka No. 15" },
          status: "menunggu",
          createdAt: "2025-06-12T10:30:00Z",
          reporterId: "user123",
          description: "Kebakaran di rumah tinggal lantai 2"
        },
        {
          id: 2,
          title: "Kebakaran Hutan",
          location: { address: "Hutan Pinus Area B" },
          status: "diproses",
          createdAt: "2025-06-12T09:15:00Z",
          reporterId: "user456",
          description: "Kebakaran hutan di area konservasi"
        },
        {
          id: 3,
          title: "Kebakaran Kendaraan",
          location: { address: "Jl. Veteran Km 8" },
          status: "selesai",
          createdAt: "2025-06-12T08:45:00Z",
          reporterId: "user789",
          description: "Mobil terbakar di jalan raya"
        }
      ];

      const mockDailyActivity = {
        reportsToday: 6,
        completedToday: 4,
        pendingToday: 2,
        avgResponseTime: '8 menit'
      };

      const mockAllReports = [
        ...mockRecentReports,
        {
          id: 4,
          title: "Kebakaran Pabrik",
          location: { address: "Kawasan Industri Blok C" },
          status: "menunggu",
          createdAt: "2025-06-11T16:20:00Z",
          reporterId: "user111",
          description: "Kebakaran di pabrik tekstil"
        },
        {
          id: 5,
          title: "Kebakaran Warung Makan",
          location: { address: "Jl. Sudirman No. 45" },
          status: "diproses",
          createdAt: "2025-06-11T14:10:00Z",
          reporterId: "user222",
          description: "Api dari kompor gas merembet"
        }
      ];

      setStats(mockStats);
      setRecentReports(mockRecentReports);
      setDailyActivity(mockDailyActivity);
      setAllReports(mockAllReports);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = allReports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32 sm:h-64">
          <div className="text-base sm:text-lg text-gray-600">Loading...</div>
        </div>
      );
    }

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <StaffSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-1">
        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0">
          <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <StaffHeader activeTab={activeTab} />
          <main className="flex-1 p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col">
        <StaffHeader 
          activeTab={activeTab} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1 p-3 sm:p-4 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;