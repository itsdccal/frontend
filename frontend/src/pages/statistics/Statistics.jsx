// src/pages/statistics/Statistics.jsx
import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Flame,
  Shield,
  Users,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle,
  Phone,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedType, setSelectedType] = useState("all");

  const overallStats = [
    {
      title: "Total Laporan",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "blue",
    },
    {
      title: "Response Time Rata-rata",
      value: "8.2 Min",
      change: "-15%",
      trend: "up",
      icon: Clock,
      color: "green",
    },
    {
      title: "Success Rate",
      value: "95.3%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      title: "Emergency Calls",
      value: "324",
      change: "+8%",
      trend: "up",
      icon: Phone,
      color: "red",
    },
  ];

  const monthlyData = [
    { month: "Jan", kebakaran: 45, rescue: 32, emergency: 12 },
    { month: "Feb", kebakaran: 52, rescue: 28, emergency: 15 },
    { month: "Mar", kebakaran: 38, rescue: 41, emergency: 18 },
    { month: "Apr", kebakaran: 65, rescue: 35, emergency: 22 },
    { month: "May", kebakaran: 71, rescue: 43, emergency: 28 },
    { month: "Jun", kebakaran: 58, rescue: 39, emergency: 31 },
    { month: "Jul", kebakaran: 82, rescue: 47, emergency: 25 },
    { month: "Aug", kebakaran: 69, rescue: 52, emergency: 33 },
    { month: "Sep", kebakaran: 77, rescue: 41, emergency: 29 },
    { month: "Oct", kebakaran: 84, rescue: 48, emergency: 35 },
    { month: "Nov", kebakaran: 91, rescue: 55, emergency: 38 },
    { month: "Dec", kebakaran: 78, rescue: 49, emergency: 42 },
  ];

  const regionData = [
    { region: "Makassar Utara", total: 234, kebakaran: 145, rescue: 89 },
    { region: "Makassar Selatan", total: 198, kebakaran: 112, rescue: 86 },
    { region: "Makassar Timur", total: 176, kebakaran: 98, rescue: 78 },
    { region: "Makassar Barat", total: 165, kebakaran: 87, rescue: 78 },
    { region: "Makassar Tengah", total: 143, kebakaran: 76, rescue: 67 },
    { region: "Biringkanaya", total: 128, kebakaran: 71, rescue: 57 },
    { region: "Tamalanrea", total: 112, kebakaran: 58, rescue: 54 },
    { region: "Manggala", total: 91, kebakaran: 45, rescue: 46 },
  ];

  const responseTimeData = [
    { timeRange: "< 5 menit", count: 312, percentage: 25 },
    { timeRange: "5-10 menit", count: 587, percentage: 47 },
    { timeRange: "10-15 menit", count: 248, percentage: 20 },
    { timeRange: "15-20 menit", count: 75, percentage: 6 },
    { timeRange: "> 20 menit", count: 25, percentage: 2 },
  ];

  const incidentTypes = [
    { type: "Kebakaran Rumah", count: 425, percentage: 34, color: "red" },
    {
      type: "Kecelakaan Lalu Lintas",
      count: 298,
      percentage: 24,
      color: "orange",
    },
    {
      type: "Kebakaran Kendaraan",
      count: 187,
      percentage: 15,
      color: "yellow",
    },
    {
      type: "Penyelamatan Ketinggian",
      count: 143,
      percentage: 11,
      color: "blue",
    },
    { type: "Penyelamatan Air", count: 98, percentage: 8, color: "cyan" },
    { type: "Lainnya", count: 96, percentage: 8, color: "gray" },
  ];

  const getCurrentMonthData = () => {
    const currentMonth = new Date().toLocaleString("id-ID", { month: "long" });
    return {
      month: currentMonth,
      reports: 127,
      avgResponse: "7.8 menit",
      successRate: "96.2%",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Add padding top to compensate for fixed navbar */}
      <div className="pt-[64px]">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <BarChart3 className="w-12 h-12 mr-3" />
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Statistik Damkar
                </h1>
              </div>
              <p className="text-xl lg:text-2xl opacity-90 mb-4">
                Data Kinerja Dinas Pemadam Kebakaran Kota Makassar
              </p>
              <p className="text-lg opacity-80">
                Laporan lengkap aktivitas dan pencapaian tahun {selectedPeriod}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    Filter Data:
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024">Tahun 2024</option>
                    <option value="2023">Tahun 2023</option>
                    <option value="2022">Tahun 2022</option>
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Jenis</option>
                    <option value="kebakaran">Kebakaran</option>
                    <option value="rescue">Rescue</option>
                    <option value="emergency">Emergency</option>
                  </select>

                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overall Statistics */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
                Ringkasan Statistik {selectedPeriod}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {overallStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <stat.icon
                          className={`w-6 h-6 text-${stat.color}-600`}
                        />
                      </div>
                      <div
                        className={`flex items-center text-sm ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Trends Chart */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
                Tren Bulanan {selectedPeriod}
              </h2>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Kebakaran</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Rescue</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">Emergency</span>
                    </div>
                  </div>
                </div>

                {/* Simple chart representation */}
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 text-sm text-gray-600 font-medium">
                        {data.month}
                      </div>
                      <div className="flex-1 flex items-center space-x-1">
                        <div
                          className="bg-red-500 h-6 rounded"
                          style={{
                            width: `${(data.kebakaran / 100) * 100}%`,
                            minWidth: "2px",
                          }}
                        ></div>
                        <div
                          className="bg-green-500 h-6 rounded"
                          style={{
                            width: `${(data.rescue / 100) * 80}%`,
                            minWidth: "2px",
                          }}
                        ></div>
                        <div
                          className="bg-orange-500 h-6 rounded"
                          style={{
                            width: `${(data.emergency / 100) * 60}%`,
                            minWidth: "2px",
                          }}
                        ></div>
                      </div>
                      <div className="w-20 text-right text-sm text-gray-600 font-medium">
                        {data.kebakaran + data.rescue + data.emergency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Data */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
                Data Per Wilayah
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Laporan Per Kecamatan
                  </h3>
                  <div className="space-y-3">
                    {regionData.map((region, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {region.region}
                          </div>
                          <div className="text-sm text-gray-600">
                            Kebakaran: {region.kebakaran} | Rescue:{" "}
                            {region.rescue}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {region.total}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    Distribusi Response Time
                  </h3>
                  <div className="space-y-3">
                    {responseTimeData.map((data, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center flex-1">
                          <span className="text-sm text-gray-700 w-20">
                            {data.timeRange}
                          </span>
                          <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${data.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {data.count} ({data.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Incident Types */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
                Jenis Kejadian
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incidentTypes.map((incident, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">
                        {incident.type}
                      </h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full bg-${incident.color}-100 text-${incident.color}-700`}
                      >
                        {incident.percentage}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {incident.count}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${incident.color}-500 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${incident.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Current Month Summary */}
        <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8">
                Ringkasan Bulan {getCurrentMonthData().month}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-2">
                    {getCurrentMonthData().reports}
                  </div>
                  <div className="text-lg opacity-90">Total Laporan</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-2">
                    {getCurrentMonthData().avgResponse}
                  </div>
                  <div className="text-lg opacity-90">Avg Response</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-2">
                    {getCurrentMonthData().successRate}
                  </div>
                  <div className="text-lg opacity-90">Success Rate</div>
                </div>
              </div>

              <div className="mt-8 text-sm opacity-80">
                Data diperbarui setiap hari • Terakhir update:{" "}
                {new Date().toLocaleDateString("id-ID")}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Data Real-time
                </span>
                <span className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Update Otomatis
                </span>
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified Data
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                © 2025 Dinas Pemadam Kebakaran Kota Makassar. Data untuk
                keperluan internal dan publik.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Statistics;
