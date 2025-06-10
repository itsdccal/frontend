import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Edit } from 'lucide-react';
import { getStatusColor, getUrgencyColor } from '../../admin/utils/adminHelpers';

const StaffDashboardView = ({ stats, recentReports, dailyActivity }) => {
  const staffStats = stats.filter((_, index) => index !== 2);

  const handleViewReport = (reportId) => {
    alert(`Melihat detail laporan ${reportId}`);
  };

  const handleEditStatus = (reportId, currentStatus) => {
    const statusOptions = ['pending', 'in_progress', 'completed', 'rejected'];
    const newStatus = prompt(
      `Ubah status laporan ${reportId} dari "${currentStatus}" ke:`,
      currentStatus
    );
    
    if (newStatus && statusOptions.includes(newStatus)) {
      alert(`Status laporan ${reportId} berhasil diubah ke "${newStatus}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staffStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Laporan Terbaru</h3>
            <span className="text-sm text-gray-500">Butuh Tindakan</span>
          </div>
          <div className="space-y-3">
            {recentReports.slice(0, 6).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800 text-sm">{report.title}</h4>
                    <span className="text-xs text-gray-500">{report.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{report.reporter} • {report.location}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                      {report.urgency}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  <button 
                    onClick={() => handleViewReport(report.id)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditStatus(report.id, report.status)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Edit Status"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Aktivitas Harian</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Laporan Hari Ini</span>
              </div>
              <span className="font-semibold text-blue-600">{dailyActivity.reportsToday}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Laporan Selesai</span>
              </div>
              <span className="font-semibold text-green-600">{dailyActivity.completedToday}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Laporan Pending</span>
              </div>
              <span className="font-semibold text-yellow-600">{dailyActivity.pendingToday}</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Response Time Rata-rata</span>
                <span className="font-semibold">{dailyActivity.avgResponseTime}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: 10 menit</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
            <div className="text-center">
              <div className="text-red-600 font-semibold">Emergency Call</div>
              <div className="text-red-500 text-sm">113</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
            <div className="text-center">
              <div className="text-blue-600 font-semibold">Unit Tersedia</div>
              <div className="text-blue-500 text-sm">8/12 Unit</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
            <div className="text-center">
              <div className="text-green-600 font-semibold">Tim Aktif</div>
              <div className="text-green-500 text-sm">24 Personel</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
            <div className="text-center">
              <div className="text-purple-600 font-semibold">Status Siaga</div>
              <div className="text-purple-500 text-sm">Level 2</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardView;