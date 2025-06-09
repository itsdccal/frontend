import React from 'react';
import { TrendingUp } from 'lucide-react';
import { getStatusColor, getUrgencyColor } from '../utils/adminHelpers';

const DashboardView = ({ stats, recentReports, dailyActivity }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold mb-4">Laporan Terbaru</h3>
          <div className="space-y-3">
            {recentReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.reporter} • {report.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                    {report.urgency}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Aktivitas Harian</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Laporan Hari Ini</span>
              <span className="font-semibold">{dailyActivity.reportsToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Laporan Selesai</span>
              <span className="font-semibold text-green-600">{dailyActivity.completedToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Laporan Pending</span>
              <span className="font-semibold text-yellow-600">{dailyActivity.pendingToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Time Rata-rata</span>
              <span className="font-semibold">{dailyActivity.avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Aktif</span>
              <span className="font-semibold">{dailyActivity.activeUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;