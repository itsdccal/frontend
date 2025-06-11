import React from 'react';
import { Users, FileText, Clock, CheckCircle, Eye } from 'lucide-react';

const DashboardView = ({ stats, recentReports }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'diproses': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const dashboardStatsArray = [
    {
      title: 'Total Pelapor',
      value: stats?.totalPelapor || 0,
      color: 'blue',
      icon: Users
    },
    {
      title: 'Total Staff',
      value: stats?.totalStaff || 0,
      color: 'green',
      icon: Users
    },
    {
      title: 'Total Laporan',
      value: stats?.totalReports || 0,
      color: 'yellow',
      icon: FileText
    },
    {
      title: 'Menunggu',
      value: stats?.pendingReports || 0,
      color: 'red',
      icon: Clock
    },
    {
      title: 'Selesai',
      value: stats?.completedReports || 0,
      color: 'green',
      icon: CheckCircle
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {dashboardStatsArray.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 bg-${stat.color}-100 rounded-lg mr-3 sm:mr-4`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Laporan Terbaru</h3>
          <span className="text-xs sm:text-sm text-gray-500">Update Terkini</span>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {recentReports && recentReports.length > 0 ? (
            recentReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">#{report.id}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status === 'menunggu' ? 'Menunggu' :
                         report.status === 'diproses' ? 'Diproses' :
                         report.status === 'selesai' ? 'Selesai' : report.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2 text-sm leading-tight">{report.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Pelapor:</span> {report.reporter}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Lokasi:</span> {report.location}
                  </p>
                  
                  <div className="flex justify-end">
                    <button className="flex items-center px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                      <Eye className="w-3 h-3 mr-1" />
                      Detail
                    </button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-sm font-medium text-gray-500">#{report.id}</span>
                      <h4 className="font-medium text-gray-900 truncate">{report.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {report.reporter} • {report.location}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(report.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status === 'menunggu' ? 'Menunggu' :
                       report.status === 'diproses' ? 'Diproses' :
                       report.status === 'selesai' ? 'Selesai' : report.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
              <p className="text-sm sm:text-base font-medium">Tidak ada laporan terbaru</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Belum ada laporan yang masuk hari ini</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {recentReports && recentReports.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 border-t">
            <button className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
              Lihat Semua Laporan
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Laporan Hari Ini</h4>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            {((stats?.pendingReports || 0) + 3)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">+2 dari kemarin</p>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Response Rate</h4>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">94%</p>
          <p className="text-xs sm:text-sm text-gray-500">Rata-rata respon</p>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border sm:col-span-2 lg:col-span-1">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900">Avg Response Time</h4>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">8 min</p>
          <p className="text-xs sm:text-sm text-gray-500">Target: 10 menit</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;