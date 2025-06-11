import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Edit } from 'lucide-react';

const StaffDashboardView = ({ stats, recentReports, dailyActivity }) => {
  const handleViewReport = (reportId) => {
    alert(`Melihat detail laporan ${reportId}`);
  };

  const handleEditStatus = (reportId, currentStatus) => {
    const statusOptions = ['menunggu', 'diproses', 'selesai', 'ditolak'];
    const newStatus = prompt(
      `Ubah status laporan ${reportId} dari "${currentStatus}" ke:`,
      currentStatus
    );
    
    if (newStatus && statusOptions.includes(newStatus)) {
      alert(`Status laporan ${reportId} berhasil diubah ke "${newStatus}"`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'diproses':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      case 'ditolak':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const staffStatsArray = [
    {
      title: 'Total Laporan',
      value: stats.totalReports || 0,
      color: 'blue',
      icon: AlertCircle,
      trend: 'up',
      change: '+12%'
    },
    {
      title: 'Menunggu',
      value: stats.pendingReports || 0,
      color: 'yellow',
      icon: Clock,
      trend: 'down',
      change: '-5%'
    },
    {
      title: 'Selesai',
      value: stats.completedReports || 0,
      color: 'green',
      icon: CheckCircle,
      trend: 'up',
      change: '+8%'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {staffStatsArray.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center text-xs sm:text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold">Laporan Terbaru</h3>
            <span className="text-xs sm:text-sm text-gray-500">Butuh Tindakan</span>
          </div>
          
          <div className="space-y-3">
            {recentReports && recentReports.length > 0 ? (
              recentReports.slice(0, 6).map((report) => (
                <div key={report.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm flex-1 pr-2">{report.title}</h4>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {report.location?.address || 'Lokasi tidak tersedia'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewReport(report.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditStatus(report.id, report.status)}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Edit Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 text-sm truncate pr-2">{report.title}</h4>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {report.location?.address || 'Lokasi tidak tersedia'}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                      <button 
                        onClick={() => handleViewReport(report.id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditStatus(report.id, report.status)}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        title="Edit Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Tidak ada laporan terbaru</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Activity */}
        <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Aktivitas Harian</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base">Laporan Hari Ini</span>
              </div>
              <span className="font-semibold text-blue-600 text-sm sm:text-base">
                {dailyActivity?.reportsToday || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base">Laporan Selesai</span>
              </div>
              <span className="font-semibold text-green-600 text-sm sm:text-base">
                {dailyActivity?.completedToday || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base">Laporan Pending</span>
              </div>
              <span className="font-semibold text-yellow-600 text-sm sm:text-base">
                {dailyActivity?.pendingToday || 0}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Response Time Rata-rata</span>
                <span className="font-semibold text-sm">
                  {dailyActivity?.avgResponseTime || '8 menit'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: 10 menit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardView;