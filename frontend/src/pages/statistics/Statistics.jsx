import React, { useState } from "react";
import {
  BarChart3,
  Shield,
  Filter,
  Eye,
  RefreshCw,
  Activity
} from "lucide-react";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedType, setSelectedType] = useState("all");


  const monthlyData = [
    { month: "Jan", kebakaran: 45, rescue: 32},
    { month: "Feb", kebakaran: 52, rescue: 28},
    { month: "Mar", kebakaran: 38, rescue: 41},
    { month: "Apr", kebakaran: 65, rescue: 35},
    { month: "May", kebakaran: 71, rescue: 43},
    { month: "Jun", kebakaran: 58, rescue: 39},
    { month: "Jul", kebakaran: 82, rescue: 47},
    { month: "Aug", kebakaran: 69, rescue: 52},
    { month: "Sep", kebakaran: 77, rescue: 41},
    { month: "Oct", kebakaran: 84, rescue: 48},
    { month: "Nov", kebakaran: 91, rescue: 55},
    { month: "Dec", kebakaran: 78, rescue: 49},
  ];

  const incidentTypes = [
    { type: "Kebakaran Rumah", count: 425, percentage: 34, color: "red" },
    { type: "Kecelakaan Lalu Lintas", count: 298, percentage: 24, color: "orange" },
    { type: "Kebakaran Kendaraan", count: 187, percentage: 15, color: "yellow" },
    { type: "Penyelamatan Ketinggian", count: 143, percentage: 11, color: "blue" },
    { type: "Penyelamatan Air", count: 98, percentage: 8, color: "cyan" },
    { type: "Lainnya", count: 96, percentage: 8, color: "gray" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="pt-[64px]">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4 lg:mb-6">
                <BarChart3 className="w-8 h-8 lg:w-12 lg:h-12 mr-2 lg:mr-3 animate-pulse" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold animate-fade-in-up">
                  Statistik Damkar
                </h1>
              </div>
              <p className="text-base md:text-lg lg:text-xl opacity-90 mb-4 animate-fade-in-up animation-delay-200">
                Data Kinerja Dinas Pemadam Kebakaran Kota Makassar
              </p>
              <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                Laporan lengkap aktivitas dan pencapaian tahun {selectedPeriod}
              </p>
            </div>
          </div>
        </section>

        {/* Alert Banner */}
        <section className="bg-yellow-400 border-b-4 border-yellow-600 relative overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-yellow-300 opacity-30"></div>
          <div className="container mx-auto px-4 py-3 lg:py-4 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-800 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 animate-bounce" />
              <div className="text-yellow-900">
                <p className="font-bold text-sm lg:text-base">DATA REAL-TIME: Update Otomatis Setiap 5 Menit</p>
                <p className="text-xs lg:text-sm">Informasi terkini untuk analisis dan pengambilan keputusan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm lg:text-base">
                    Filter Data Statistik:
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base"
                  >
                    <option value="2024">Tahun 2024</option>
                    <option value="2023">Tahun 2023</option>
                    <option value="2022">Tahun 2022</option>
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base"
                  >
                    <option value="all">Semua Jenis</option>
                    <option value="kebakaran">Kebakaran</option>
                    <option value="rescue">Rescue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Trends Chart */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 lg:mb-8 text-center animate-fade-in-up">
                Tren Bulanan {selectedPeriod}
              </h2>

              <div className="bg-gray-50 rounded-xl p-6 lg:p-8 animate-fade-in-up animation-delay-200">
                <div className="flex flex-wrap justify-center items-center mb-6 gap-4 lg:gap-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-sm lg:text-base text-gray-600 font-medium">Kebakaran</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-sm lg:text-base text-gray-600 font-medium">Rescue</span>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 lg:w-16 text-sm lg:text-base text-gray-600 font-medium">
                        {data.month}
                      </div>
                      <div className="flex-1 flex items-center space-x-1 mx-4">
                        <div
                          className="bg-red-500 h-4 lg:h-6 rounded hover:bg-red-600 transition-colors"
                          style={{
                            width: `${(data.kebakaran / 100) * 100}%`,
                            minWidth: "2px",
                          }}
                          title={`Kebakaran: ${data.kebakaran}`}
                        ></div>
                        <div
                          className="bg-green-500 h-4 lg:h-6 rounded hover:bg-green-600 transition-colors"
                          style={{
                            width: `${(data.rescue / 100) * 80}%`,
                            minWidth: "2px",
                          }}
                          title={`Rescue: ${data.rescue}`}
                        ></div>
                      </div>
                      <div className="w-16 lg:w-20 text-right text-sm lg:text-base text-gray-800 font-bold">
                        {data.kebakaran + data.rescue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Incident Types */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 lg:mb-8 text-center animate-fade-in-up">
                Jenis Kejadian
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {incidentTypes.map((incident, index) => (
                  <div
                    key={index}
                    className={`bg-gray-50 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800 text-sm lg:text-base">
                        {incident.type}
                      </h3>
                      <span className={`text-xs lg:text-sm px-2 py-1 rounded-full bg-${incident.color}-100 text-${incident.color}-700 font-medium`}>
                        {incident.percentage}%
                      </span>
                    </div>
                    <div className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
                      {incident.count}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${incident.color}-500 h-2 rounded-full transition-all duration-1000 hover:bg-${incident.color}-600`}
                        style={{ width: `${incident.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Information */}
        <section className="py-8 lg:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 text-sm lg:text-base text-gray-600 mb-4">
                <span className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <Eye className="w-4 h-4 mr-2 text-blue-500" />
                  Data Real-time
                </span>
                <span className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <RefreshCw className="w-4 h-4 mr-2 text-green-500" />
                  Update Otomatis
                </span>
                <span className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <Shield className="w-4 h-4 mr-2 text-red-500" />
                  Verified Data
                </span>
              </div>
              <p className="text-gray-500 text-xs lg:text-sm">
                © 2025 Dinas Pemadam Kebakaran Kota Makassar. Data untuk keperluan internal dan publik.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Statistics;