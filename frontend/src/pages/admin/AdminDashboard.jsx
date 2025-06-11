import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import UsersView from './components/UsersView';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPelapor: 0,
    totalStaff: 0,
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    processedReports: 0
  });
  const [recentReports, setRecentReports] = useState([]);
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
        if (!user || !user.role || user.role !== 'admin') {
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
        totalUsers: 145,
        totalPelapor: 132,
        totalStaff: 13,
        totalReports: 89,
        pendingReports: 23,
        completedReports: 52,
        processedReports: 14
      };

      const mockRecentReports = [
        {
          id: 'RPT001',
          title: 'Kebakaran Rumah di Jl. Sudirman',
          reporter: 'Ahmad Syafiq',
          reporterPhone: '081234567890',
          reporterEmail: 'ahmad.syafiq@email.com',
          location: 'Jl. Sudirman No. 45, Makassar',
          status: 'menunggu',
          date: '2025-06-11 14:30',
          createdAt: '2025-06-11T14:30:00Z',
          description: 'Terjadi kebakaran di rumah tinggal lantai 2. Api mulai membesar dari dapur dan menyebar ke ruang tamu. Pemilik rumah sudah dievakuasi dengan selamat. Perlu penanganan segera karena ada rumah tetangga yang berdekatan.',
          incidentType: 'Kebakaran Rumah Tinggal',
          urgencyLevel: 'tinggi',
          casualties: false,
          photoUrl: 'https://images.unsplash.com/photo-1574867113539-8c78d2c9d6c5?w=500',
          notes: 'Lokasi mudah diakses, jalan lebar. Tim sudah standby di pos terdekat.'
        },
        {
          id: 'RPT002',
          title: 'Pohon Tumbang Menghalangi Jalan',
          reporter: 'Siti Nurhaliza',
          reporterPhone: '082345678901',
          reporterEmail: 'siti.nurhaliza@email.com',
          location: 'Jl. Veteran, Makassar',
          status: 'diproses',
          date: '2025-06-11 13:15',
          createdAt: '2025-06-11T13:15:00Z',
          description: 'Pohon besar tumbang karena angin kencang dan menghalangi seluruh badan jalan. Lalu lintas macet total, perlu penanganan segera untuk membersihkan jalan.',
          incidentType: 'Pohon Tumbang',
          urgencyLevel: 'sedang',
          casualties: false,
          processedAt: '2025-06-11 13:45',
          notes: 'Tim rescue sudah di lokasi. Membutuhkan alat berat untuk memotong pohon.'
        },
        {
          id: 'RPT003',
          title: 'Kebakaran Kecil di Warung',
          reporter: 'Budi Santoso',
          reporterPhone: '083456789012',
          reporterEmail: 'budi.santoso@email.com',
          location: 'Jl. Pengayoman, Makassar',
          status: 'selesai',
          date: '2025-06-11 10:45',
          createdAt: '2025-06-11T10:45:00Z',
          description: 'Kebakaran kecil di warung makan akibat korsleting listrik. Api sudah padam dengan bantuan warga sekitar menggunakan APAR. Tidak ada korban jiwa.',
          incidentType: 'Kebakaran Komersial',
          urgencyLevel: 'rendah',
          casualties: false,
          processedAt: '2025-06-11 11:00',
          completedAt: '2025-06-11 11:30',
          photoUrl: 'https://images.unsplash.com/photo-1526398977052-654221a252e5?w=500',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          notes: 'Penanganan berhasil. Pemilik warung sudah mendapat pengarahan tentang keselamatan listrik.'
        }
      ];

      const mockAllReports = [
        ...mockRecentReports,
        {
          id: 'RPT004',
          title: 'Kebakaran Pabrik Tekstil',
          reporter: 'Andi Rahman',
          location: 'Kawasan Industri Blok C',
          status: 'menunggu',
          date: '2025-06-10 16:20',
          createdAt: '2025-06-10T16:20:00Z',
          description: 'Kebakaran di pabrik tekstil'
        },
        {
          id: 'RPT005',
          title: 'Kebakaran Hutan',
          reporter: 'Maya Sari',
          location: 'Hutan Lindung Area B',
          status: 'diproses',
          date: '2025-06-10 14:10',
          createdAt: '2025-06-10T14:10:00Z',
          description: 'Kebakaran hutan di area konservasi'
        }
      ];

      setStats(mockStats);
      setRecentReports(mockRecentReports);
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
        report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
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
          <DashboardView 
            stats={stats}
            recentReports={recentReports}
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
        return <UsersView />;
      default:
        return (
          <DashboardView 
            stats={stats}
            recentReports={recentReports}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <AdminSidebar 
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
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader activeTab={activeTab} />
          <main className="flex-1 p-8">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col">
        <AdminHeader 
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

export default AdminDashboard;