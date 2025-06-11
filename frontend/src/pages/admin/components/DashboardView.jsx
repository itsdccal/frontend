import React from 'react';
import { Users, FileText, Clock, CheckCircle, Eye } from 'lucide-react';

const DashboardView = () => {
  const dashboardStats = {
    totalUsers: 145,
    totalPelapor: 132,
    totalStaff: 13,
    totalReports: 89,
    pendingReports: 23,
    completedReports: 52
  };

  const recentReports = [
    {
      id: 'RPT001',
      title: 'Kebakaran Rumah di Jl. Sudirman',
      reporter: 'Ahmad Syafiq',
      location: 'Jl. Sudirman No. 45, Makassar',
      status: 'pending',
      date: '2025-06-11 14:30'
    },
    {
      id: 'RPT002',
      title: 'Pohon Tumbang Menghalangi Jalan',
      reporter: 'Siti Nurhaliza',
      location: 'Jl. Veteran, Makassar',
      status: 'process',
      date: '2025-06-11 13:15'
    },
    {
      id: 'RPT003',
      title: 'Kebakaran Kecil di Warung',
      reporter: 'Budi Santoso',
      location: 'Jl. Pengayoman, Makassar',
      status: 'completed',
      date: '2025-06-11 10:45'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'process': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pelapor</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalPelapor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Laporan</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.completedReports}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Laporan Terbaru</h3>
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{report.title}</h4>
                <p className="text-sm text-gray-600">{report.reporter} • {report.location}</p>
                <p className="text-xs text-gray-500">{report.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800 p-1">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;