import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, AlertTriangle, Flame, Shield, MapPin, Clock, CheckCircle, FileText, Users, Building, X, Navigation } from 'lucide-react';

const Homepage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleEmergencyCall = () => {
    setShowEmergencyModal(true);
    setIsLoading(true);
    setCurrentStep(1);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setLocation(coords);
          setCurrentStep(2);
          setIsLoading(false);
        },
        (error) => {
          setCurrentStep(2);
          setIsLoading(false);
        }
      );
    } else {
      setCurrentStep(2);
      setIsLoading(false);
    }
  };

  const handleConfirmCall = () => {
    setCurrentStep(3);
    window.location.href = 'tel:113';
    setTimeout(() => {
      setShowEmergencyModal(false);
      navigate('/reports/quick');
    }, 3000);
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
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 lg:mb-6 ">
                <Flame className="w-8 h-8 lg:w-12 lg:h-12 mr-2 lg:mr-3 animate-pulse" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold animate-fade-in-up">
                  DINAS PEMADAM KEBAKARAN
                </h1>
              </div>
              <p className="text-base md:text-lg lg:text-xl opacity-90 mb-4 animate-fade-in-up animation-delay-200">
                Layanan Darurat 24 Jam - Call Center: 113
              </p>
              <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                Sampaikan laporan Anda langsung kepada Dinas Pemadam Kebakaran Kota Makassar
              </p>
            </div>
          </div>
        </section>

        <section className="bg-yellow-400 border-b-4 border-yellow-600 relative overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-yellow-300 opacity-30"></div>
          <div className="container mx-auto px-4 py-3 lg:py-4 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-800 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 " />
              <div className="text-yellow-900">
                <p className="font-bold text-sm lg:text-base">DARURAT? Hubungi Langsung: 113 atau 0411 854444</p>
                <p className="text-xs lg:text-sm">Untuk situasi mengancam nyawa, hubungi nomor darurat terlebih dahulu</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-center mb-6 lg:mb-8 text-gray-800 animate-fade-in-up">
                Pilih Jenis Laporan
              </h2>
              
              <div className="mb-6 lg:mb-8 animate-fade-in-up animation-delay-200">
                <button
                  onClick={handleEmergencyCall}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 lg:p-8 text-center hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-300 group"
                  aria-label="Emergency call 113"
                >
                  <Phone className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">🚨 DARURAT - CALL 113</h3>
                  <p className="text-sm lg:text-base opacity-90 mb-2">Situasi mengancam nyawa</p>
                  <p className="text-xs lg:text-sm opacity-80">
                    Kebakaran besar, ada korban, butuh bantuan segera
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="relative group cursor-pointer" onClick={handleQuickForm}>
                  <div className="w-full bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl p-6 lg:p-8 text-center group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300 shadow-lg group-hover:shadow-xl transform group-hover:scale-[1.02] animate-fade-in-up animation-delay-300">
                    <Flame className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 group-hover:animate-bounce" />
                    <h3 className="text-lg lg:text-xl font-bold mb-2">KEBAKARAN</h3>
                    <p className="text-sm lg:text-base opacity-90 mb-2">Quick Report (2-3 menit)</p>
                    <p className="text-xs lg:text-sm opacity-80">
                      Kebakaran rumah, kendaraan, lahan
                    </p>
                    <div className="mt-3 flex justify-center space-x-2">
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs animate-pulse">
                        Cepat
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs animate-pulse animation-delay-100">
                        Darurat
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/70 text-white rounded-xl p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center pointer-events-none">
                    <div className="text-center">
                      <Flame className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                      <h4 className="text-lg font-bold mb-3">Detail Quick Report</h4>
                      <ul className="text-sm space-y-2 text-left">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 flex-shrink-0"></span>
                          Field minimal untuk situasi darurat
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 flex-shrink-0"></span>
                          Auto-detect lokasi GPS
                        </li>
                      </ul>
                      <div className="mt-4 bg-orange-500/20 rounded-lg p-2">
                        <p className="text-xs text-orange-200">Klik untuk memulai laporan cepat</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group cursor-pointer" onClick={handleStandardForm}>
                  <div className="w-full bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-6 lg:p-8 text-center group-hover:from-green-500 group-hover:to-green-600 transition-all duration-300 shadow-lg group-hover:shadow-xl transform group-hover:scale-[1.02] animate-fade-in-up animation-delay-400">
                    <Shield className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 group-hover:animate-bounce" />
                    <h3 className="text-lg lg:text-xl font-bold mb-2">RESCUE</h3>
                    <p className="text-sm lg:text-base opacity-90 mb-2">Form Lengkap (5-7 menit)</p>
                    <p className="text-xs lg:text-sm opacity-80">
                      Penyelamatan, evakuasi, bantuan teknis
                    </p>
                    <div className="mt-3 flex justify-center space-x-2">
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs animate-pulse">
                        Lengkap
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs animate-pulse animation-delay-100">
                        Detail
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/70 text-white rounded-xl p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center pointer-events-none">
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto mb-3 text-green-400" />
                      <h4 className="text-lg font-bold mb-3">Detail Standard Report</h4>
                      <ul className="text-sm space-y-2 text-left">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                          Form lengkap dengan detail kejadian
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                          Multiple upload foto dan dokumen
                        </li>
                      </ul>
                      <div className="mt-4 bg-green-500/20 rounded-lg p-2">
                        <p className="text-xs text-green-200">Klik untuk memulai laporan lengkap</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl lg:text-2xl font-bold text-center mb-8 lg:mb-12 text-gray-800 animate-fade-in-up">
              Cara Kerja LaporPak
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {[
                { icon: FileText, title: "1. Tulis Laporan", desc: "Laporkan kejadian dengan mudah melalui form yang tersedia", bg: "bg-red-100", color: "text-red-500", delay: "animation-delay-100" },
                { icon: Building, title: "2. Verifikasi", desc: "Laporan diverifikasi dan diteruskan ke tim Damkar", bg: "bg-blue-100", color: "text-blue-500", delay: "animation-delay-200" },
                { icon: Users, title: "3. Tindak Lanjut", desc: "Tim Damkar menindaklanjuti sesuai tingkat prioritas", bg: "bg-orange-100", color: "text-orange-500", delay: "animation-delay-300" },
                { icon: CheckCircle, title: "4. Selesai", desc: "Anda mendapat update status hingga penyelesaian", bg: "bg-green-100", color: "text-green-500", delay: "animation-delay-400" }
              ].map((item, index) => (
                <div key={index} className={`text-center p-4 animate-fade-in-up ${item.delay} hover:transform hover:scale-105 transition-transform duration-300`}>
                  <div className={`${item.bg} w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:animate-pulse`}>
                    <item.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-sm lg:text-base mb-2">{item.title}</h3>
                  <p className="text-xs lg:text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-gray-800 animate-fade-in-up">
                Kontak Darurat
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[
                  { icon: Phone, title: "Call Center", value: "113", desc: "24/7 Emergency", bg: "hover:bg-red-50", color: "text-red-500", delay: "animation-delay-100" },
                  { icon: MapPin, title: "Kantor Pusat", value: "Jl. DR. Ratulangi No.11", desc: "Makassar, Sulawesi Selatan", bg: "hover:bg-blue-50", color: "text-blue-500", delay: "animation-delay-200" },
                  { icon: Clock, title: "Jam Operasional", value: "24 Jam Sehari", desc: "7 Hari Seminggu", bg: "hover:bg-green-50", color: "text-green-500", delay: "animation-delay-300" }
                ].map((item, index) => (
                  <div key={index} className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${item.delay} ${item.bg}`}>
                    <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className={`text-lg font-bold ${item.color} mb-1`}>{item.value}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl animate-scale-in">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Panggilan Darurat</h3>
                
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      <span className="text-sm text-gray-600">Mendapatkan lokasi GPS...</span>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-4">
                    {location && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-center space-x-2 text-green-700">
                          <Navigation className="w-4 h-4" />
                          <span className="text-sm font-medium">Lokasi GPS berhasil didapatkan</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">📍 {location}</p>
                      </div>
                    )}
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm mb-3">
                        Anda akan dihubungkan ke <strong>113</strong> untuk bantuan darurat.
                        {location && " Lokasi GPS akan dibagikan kepada petugas."}
                      </p>
                      <p className="text-red-700 text-xs">
                        Setelah panggilan selesai, Anda akan diarahkan untuk mengisi quick report.
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowEmergencyModal(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleConfirmCall}
                        className="flex-1 bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Hubungi 113
                      </button>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Menghubungkan ke 113...</span>
                      </div>
                      <p className="text-green-600 text-sm">
                        Setelah panggilan selesai, Anda akan diarahkan untuk mengisi quick report.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">
                {selectedOption === '/reports/quick' ? 'Form Kebakaran (Quick)' : 'Form Rescue (Lengkap)'}
              </h3>
              <button
                onClick={() => setSelectedOption(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              {selectedOption === '/reports/quick' ? (
                <div className="flex items-start space-x-3">
                  <Flame className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0 animate-pulse" />
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
                  <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 animate-pulse" />
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
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmNavigation}
                className="flex-1 bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 transition-colors"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
      
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
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

export default Homepage;