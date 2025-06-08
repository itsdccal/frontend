import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, AlertTriangle, Flame, Shield, MapPin, Clock, CheckCircle, FileText, Users, Building, X } from 'lucide-react';

const Homepage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleEmergencyCall = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`;
          alert(`🚨 Menghubungi 113...\n📍 Lokasi GPS: ${location}\n\nSetelah menelpon, Anda akan diarahkan untuk mengisi quick report.`);
          window.location.href = 'tel:113';
          // After call, redirect to quick form
          setTimeout(() => {
            navigate('/reports/quick');
          }, 3000);
        },
        (error) => {
          alert('🚨 Menghubungi 113...\n\nSetelah menelpon, Anda akan diarahkan untuk mengisi quick report.');
          window.location.href = 'tel:113';
          setTimeout(() => {
            navigate('/reports/quick');
          }, 3000);
        }
      );
    } else {
      alert('🚨 Menghubungi 113...\n\nSetelah menelpon, Anda akan diarahkan untuk mengisi quick report.');
      window.location.href = 'tel:113';
      setTimeout(() => {
        navigate('/reports/quick');
      }, 3000);
    }
  };

  const handleQuickForm = () => {
    setSelectedOption('/reports/quick');
  };

  const handleStandardForm = () => {
    setSelectedOption('/reports/standard');
  };

  const handleConfirmNavigation = () => {
    if (selectedOption) {
      navigate(selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="pt-[64px]">
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 lg:mb-6">
                <Flame className="w-8 h-8 lg:w-12 lg:h-12 mr-2 lg:mr-3" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
                  DINAS PEMADAM KEBAKARAN
                </h1>
              </div>
              <p className="text-base md:text-lg lg:text-xl opacity-90 mb-4">
                Layanan Darurat 24 Jam - Call Center: 113
              </p>
              <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto">
                Sampaikan laporan Anda langsung kepada Dinas Pemadam Kebakaran Kota Makassar
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Alert Banner */}
        <section className="bg-yellow-400 border-b-4 border-yellow-600">
          <div className="container mx-auto px-4 py-3 lg:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-800 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0" />
              <div className="text-yellow-900">
                <p className="font-bold text-sm lg:text-base">DARURAT? Hubungi Langsung: 113 atau 112</p>
                <p className="text-xs lg:text-sm">Untuk situasi mengancam nyawa, hubungi nomor darurat terlebih dahulu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Report Selection Section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-center mb-6 lg:mb-8 text-gray-800">
                Pilih Jenis Laporan
              </h2>
              
              {/* Emergency Call Button */}
              <div className="mb-6 lg:mb-8">
                <button
                  onClick={handleEmergencyCall}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 lg:p-8 text-center hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-300"
                  aria-label="Emergency call 113"
                >
                  <Phone className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4" />
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">🚨 DARURAT - CALL 113</h3>
                  <p className="text-sm lg:text-base opacity-90 mb-2">Situasi mengancam nyawa</p>
                  <p className="text-xs lg:text-sm opacity-80">
                    Kebakaran besar, ada korban, butuh bantuan segera
                  </p>
                </button>
              </div>

              {/* Quick vs Standard Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <button
                  onClick={handleQuickForm}
                  className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl p-6 lg:p-8 text-center hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-300"
                  aria-label="Quick fire report"
                >
                  <Flame className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4" />
                  <h3 className="text-lg lg:text-xl font-bold mb-2">KEBAKARAN</h3>
                  <p className="text-sm lg:text-base opacity-90 mb-2">Quick Report (2-3 menit)</p>
                  <p className="text-xs lg:text-sm opacity-80">
                    Kebakaran rumah, kendaraan, lahan
                  </p>
                  <div className="mt-3 flex justify-center space-x-2">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                      Cepat
                    </span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                      Darurat
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleStandardForm}
                  className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-6 lg:p-8 text-center hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-300"
                  aria-label="Standard rescue report"
                >
                  <Shield className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4" />
                  <h3 className="text-lg lg:text-xl font-bold mb-2">RESCUE</h3>
                  <p className="text-sm lg:text-base opacity-90 mb-2">Form Lengkap (5-7 menit)</p>
                  <p className="text-xs lg:text-sm opacity-80">
                    Penyelamatan, evakuasi, bantuan teknis
                  </p>
                  <div className="mt-3 flex justify-center space-x-2">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                      Lengkap
                    </span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                      Detail
                    </span>
                  </div>
                </button>
              </div>

              {/* Info Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Flame className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-sm">Quick Report - Kebakaran</h4>
                      <p className="text-blue-700 text-xs mt-1">
                        Ideal untuk situasi kebakaran yang membutuhkan respon cepat. Form singkat dengan field minimal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800 text-sm">Standard Report - Rescue</h4>
                      <p className="text-green-700 text-xs mt-1">
                        Untuk laporan penyelamatan dan bantuan teknis yang membutuhkan informasi detail lengkap.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl lg:text-2xl font-bold text-center mb-8 lg:mb-12 text-gray-800">
              Cara Kerja LaporPak
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="text-center p-4">
                <div className="bg-red-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 lg:w-10 lg:h-10 text-red-500" />
                </div>
                <h3 className="font-bold text-sm lg:text-base mb-2">1. Tulis Laporan</h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Laporkan kejadian dengan mudah melalui form yang tersedia
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-blue-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 lg:w-10 lg:h-10 text-blue-500" />
                </div>
                <h3 className="font-bold text-sm lg:text-base mb-2">2. Verifikasi</h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Laporan diverifikasi dan diteruskan ke tim Damkar
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-orange-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 lg:w-10 lg:h-10 text-orange-500" />
                </div>
                <h3 className="font-bold text-sm lg:text-base mb-2">3. Tindak Lanjut</h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Tim Damkar menindaklanjuti sesuai tingkat prioritas
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="bg-green-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-green-500" />
                </div>
                <h3 className="font-bold text-sm lg:text-base mb-2">4. Selesai</h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Anda mendapat update status hingga penyelesaian
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">STATISTIK DAMKAR MAKASSAR</h2>
            <p className="text-sm lg:text-base opacity-80 mb-8">Data performa dan pencapaian terbaru</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-3xl lg:text-4xl font-bold mb-2">1,247</div>
                <div className="text-sm lg:text-base opacity-90">Total Laporan 2024</div>
                <div className="text-xs opacity-70 mt-1">+12% dari tahun lalu</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-3xl lg:text-4xl font-bold mb-2">8 Min</div>
                <div className="text-sm lg:text-base opacity-90">Avg Response Time</div>
                <div className="text-xs opacity-70 mt-1">Target: &lt;10 menit</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-3xl lg:text-4xl font-bold mb-2">95%</div>
                <div className="text-sm lg:text-base opacity-90">Success Rate</div>
                <div className="text-xs opacity-70 mt-1">Tingkat keberhasilan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-gray-800">
                Kontak Darurat
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <Phone className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Call Center</h3>
                  <p className="text-lg font-bold text-red-500">113</p>
                  <p className="text-sm text-gray-600">24/7 Emergency</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Kantor Pusat</h3>
                  <p className="text-sm text-gray-700">Jl. A.P. Pettarani No. 1</p>
                  <p className="text-sm text-gray-600">Makassar, Sulawesi Selatan</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Jam Operasional</h3>
                  <p className="text-sm text-gray-700">24 Jam Sehari</p>
                  <p className="text-sm text-gray-600">7 Hari Seminggu</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 sm:hidden shadow-lg z-40">
        <div className="flex space-x-2">
          <button
            onClick={handleEmergencyCall}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            🚨 DARURAT
          </button>
          <button
            onClick={handleQuickForm}
            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            🔥 KEBAKARAN
          </button>
          <button
            onClick={handleStandardForm}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            🛡️ RESCUE
          </button>
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20 sm:h-0"></div>

      {/* Confirmation Modal */}
      {selectedOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">
                {selectedOption === '/reports/quick' ? 'Form Kebakaran (Quick)' : 'Form Rescue (Lengkap)'}
              </h3>
              <button
                onClick={() => setSelectedOption(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              {selectedOption === '/reports/quick' ? (
                <div className="flex items-start space-x-3">
                  <Flame className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 text-sm mb-2">
                      Anda akan diarahkan ke form quick report untuk laporan kebakaran.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Estimasi waktu: 2-3 menit</li>
                      <li>• Field minimal untuk respon cepat</li>
                      <li>• Cocok untuk situasi darurat</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 text-sm mb-2">
                      Anda akan diarahkan ke form lengkap untuk laporan rescue/penyelamatan.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Estimasi waktu: 5-7 menit</li>
                      <li>• Informasi detail lengkap</li>
                      <li>• Untuk kasus rescue dan bantuan teknis</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedOption(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmNavigation}
                className="flex-1 bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;