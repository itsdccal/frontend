import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Shield,
  Phone,
  Target,
  CheckCircle,
  MapPin,
  Mail,
  Star,
  Zap,
  X
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

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

  const features = [
    {
      icon: Zap,
      title: "Quick Report",
      description: "Laporan cepat untuk situasi kebakaran darurat dengan form minimal 2-3 menit.",
      color: "orange",
      bg: "bg-orange-100",
      iconColor: "text-orange-500"
    },
    {
      icon: Shield,
      title: "Standard Report",
      description: "Laporan lengkap untuk penyelamatan dan bantuan teknis dengan detail komprehensif.",
      color: "green",
      bg: "bg-green-100",
      iconColor: "text-green-500"
    },
    {
      icon: Phone,
      title: "Call Center 24/7",
      description: "Layanan darurat 113 tersedia 24 jam sehari, 7 hari seminggu.",
      color: "red",
      bg: "bg-red-100",
      iconColor: "text-red-500"
    },
    {
      icon: Target,
      title: "Response Cepat",
      description: "Rata-rata waktu respon 8 menit untuk mencapai lokasi kejadian.",
      color: "blue",
      bg: "bg-blue-100",
      iconColor: "text-blue-500"
    },
  ];


  const contactInfo = [
    { icon: Phone, title: "Call Center", value: "113", desc: "24/7 Emergency", bg: "hover:bg-red-50", color: "text-red-500" },
    { icon: MapPin, title: "Kantor Pusat", value: "Jl. DR. Ratulangi No.11", desc: "Makassar, Sulawesi Selatan", bg: "hover:bg-blue-50", color: "text-blue-500" },
    { icon: Mail, title: "Email", value: "info@damkar-makassar.go.id", desc: "Kontak resmi", bg: "hover:bg-green-50", color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="pt-[64px]">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4 lg:mb-6">
                <Flame className="w-8 h-8 lg:w-12 lg:h-12 mr-2 lg:mr-3 animate-pulse" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold animate-fade-in-up">
                  Tentang LaporPak
                </h1>
              </div>
              <p className="text-base md:text-lg lg:text-xl opacity-90 mb-4 animate-fade-in-up animation-delay-200">
                Sistem Pelaporan Digital Dinas Pemadam Kebakaran Kota Makassar
              </p>
              <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                Platform terintegrasi untuk melaporkan kejadian kebakaran dan permintaan bantuan penyelamatan dengan respon cepat dan akurat.
              </p>
              

            </div>
          </div>
        </section>


        {/* Mission & Vision Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 lg:mb-12">
                <h2 className="text-xl lg:text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up">
                  Visi & Misi Kami
                </h2>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Misi */}
                <div className="animate-fade-in-up animation-delay-300">
                  <div className="flex items-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <Target className="w-6 h-6 lg:w-8 lg:h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
                      Misi Kami
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-6">
                    Menyediakan layanan pelaporan yang cepat, akurat, dan mudah diakses untuk situasi darurat kebakaran dan penyelamatan di Kota Makassar.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm lg:text-base">
                        Respons darurat yang cepat dan efektif
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm lg:text-base">
                        Layanan 24/7 untuk masyarakat Makassar
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm lg:text-base">
                        Teknologi terdepan untuk keselamatan
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm lg:text-base">
                        Koordinasi optimal antar instansi terkait
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Visi */}
                <div className="animate-fade-in-up animation-delay-400">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Star className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
                      Visi Kami
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-6">
                    Menjadi sistem pelaporan darurat terdepan di Indonesia yang mampu menyelamatkan lebih banyak nyawa dan properti melalui teknologi digital yang inovatif.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 lg:p-6 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3 text-sm lg:text-base">
                      Target 2025
                    </h4>
                    <ul className="space-y-2 text-xs lg:text-sm text-blue-700">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        Response time rata-rata di bawah 6 menit
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        99% uptime sistem pelaporan
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        Integrasi dengan 50+ pos pemadam
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        AI detection akurasi 95%+
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-center mb-6 lg:mb-8 text-gray-800 animate-fade-in-up">
                Fitur Unggulan LaporPak
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`${feature.bg} w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                      <feature.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-gray-800 animate-fade-in-up">
                Hubungi Kami
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className={`bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${item.bg}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className={`text-lg font-bold ${item.color} mb-1`}>{item.value}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 lg:mt-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 lg:p-8 text-white animate-fade-in-up animation-delay-500">
                <h3 className="text-lg lg:text-xl font-bold mb-4">
                  Siap Melaporkan Kejadian?
                </h3>
                <p className="text-sm lg:text-base opacity-90 mb-6">
                  Gunakan LaporPak untuk melaporkan kejadian kebakaran atau meminta bantuan penyelamatan dengan cepat dan mudah.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleQuickForm}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    Quick Report
                  </button>
                  <button
                    onClick={handleStandardForm}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Standard Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      {selectedOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 lg:p-8 w-full max-w-md lg:max-w-lg xl:max-w-xl shadow-xl animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-800">
                {selectedOption === '/reports/quick' ? 'Form Kebakaran (Quick)' : 'Form Rescue (Lengkap)'}
              </h3>
              <button
                onClick={() => setSelectedOption(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
            
            <div className="mb-8">
              {selectedOption === '/reports/quick' ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                      <Flame className="w-6 h-6 lg:w-7 lg:h-7 text-orange-500 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                        Form Quick Report - Kebakaran
                      </h4>
                      <p className="text-gray-700 text-sm lg:text-base mb-3">
                        Anda akan diarahkan ke form quick report untuk laporan kebakaran yang membutuhkan respon cepat.
                      </p>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h5 className="font-medium text-orange-800 mb-2 text-sm lg:text-base">Fitur Utama:</h5>
                        <ul className="text-xs lg:text-sm text-orange-700 space-y-1.5">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                            Estimasi waktu pengisian: 2-3 menit
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                            Field minimal untuk respon cepat
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                            Prioritas tinggi dalam sistem
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                            Auto-detect lokasi GPS
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                      <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-green-500 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                        Form Standard Report - Rescue
                      </h4>
                      <p className="text-gray-700 text-sm lg:text-base mb-3">
                        Anda akan diarahkan ke form lengkap untuk laporan rescue/penyelamatan dengan detail komprehensif.
                      </p>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 className="font-medium text-green-800 mb-2 text-sm lg:text-base">Fitur Utama:</h5>
                        <ul className="text-xs lg:text-sm text-green-700 space-y-1.5">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                            Estimasi waktu pengisian: 5-7 menit
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                            Informasi detail lengkap kejadian
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                            Multiple upload foto dan dokumen
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                            Koordinasi dengan instansi terkait
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setSelectedOption(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 lg:py-4 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm lg:text-base"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmNavigation}
                className="flex-1 bg-red-500 text-white py-3 lg:py-4 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm lg:text-base flex items-center justify-center"
              >
                <span>Lanjutkan</span>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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

export default About;