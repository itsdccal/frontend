// src/pages/about/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Shield,
  Phone,
  Clock,
  Users,
  Target,
  CheckCircle,
  Award,
  MapPin,
  Mail,
  Globe,
  ArrowRight,
  Star,
  Heart,
  Zap,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Quick Report",
      description:
        "Laporan cepat untuk situasi kebakaran darurat dengan form minimal 2-3 menit.",
      color: "orange",
    },
    {
      icon: Shield,
      title: "Standard Report",
      description:
        "Laporan lengkap untuk penyelamatan dan bantuan teknis dengan detail komprehensif.",
      color: "green",
    },
    {
      icon: Phone,
      title: "Call Center 24/7",
      description:
        "Layanan darurat 113 tersedia 24 jam sehari, 7 hari seminggu.",
      color: "red",
    },
    {
      icon: Target,
      title: "Response Cepat",
      description:
        "Rata-rata waktu respon 8 menit untuk mencapai lokasi kejadian.",
      color: "blue",
    },
  ];

  const stats = [
    { number: "1,247", label: "Total Laporan 2024", growth: "+12%" },
    {
      number: "8 Min",
      label: "Avg Response Time",
      target: "Target: <10 menit",
    },
    { number: "95%", label: "Success Rate", note: "Tingkat keberhasilan" },
    { number: "24/7", label: "Layanan Aktif", note: "Tanpa henti" },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Peluncuran LaporPak",
      description: "Sistem pelaporan digital pertama untuk Damkar Makassar",
    },
    {
      year: "2021",
      title: "Integrasi AI/ML",
      description: "Penambahan validasi otomatis menggunakan machine learning",
    },
    {
      year: "2022",
      title: "Mobile Optimization",
      description: "Optimalisasi untuk perangkat mobile dan tablet",
    },
    {
      year: "2023",
      title: "Quick Report Launch",
      description: "Peluncuran fitur laporan cepat untuk situasi darurat",
    },
    {
      year: "2024",
      title: "Enhanced Features",
      description:
        "Peningkatan fitur dengan GPS tracking dan real-time updates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="pt-[64px]">
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Flame className="w-12 h-12 mr-3" />
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Tentang LaporPak
                </h1>
              </div>
              <p className="text-xl lg:text-2xl opacity-90 mb-6">
                Sistem Pelaporan Digital Dinas Pemadam Kebakaran Kota Makassar
              </p>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Platform terintegrasi untuk melaporkan kejadian kebakaran dan
                permintaan bantuan penyelamatan dengan respon cepat dan akurat.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center mb-6">
                    <Target className="w-8 h-8 text-red-500 mr-3" />
                    <h2 className="text-3xl font-bold text-gray-800">
                      Misi Kami
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Menyediakan layanan pelaporan yang cepat, akurat, dan mudah
                    diakses untuk situasi darurat kebakaran dan penyelamatan di
                    Kota Makassar.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Respons darurat yang cepat dan efektif
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Layanan 24/7 untuk masyarakat Makassar
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Teknologi terdepan untuk keselamatan
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center mb-6">
                    <Star className="w-8 h-8 text-blue-500 mr-3" />
                    <h2 className="text-3xl font-bold text-gray-800">
                      Visi Kami
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Menjadi sistem pelaporan darurat terdepan di Indonesia yang
                    mampu menyelamatkan lebih banyak nyawa dan properti.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-3">
                      Target 2025
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• Response time rata-rata di bawah 6 menit</li>
                      <li>• 99% uptime sistem pelaporan</li>
                      <li>• Integrasi dengan 50+ pos pemadam</li>
                      <li>• AI detection akurasi 95%+</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Fitur Unggulan
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Platform LaporPak dilengkapi dengan teknologi terkini untuk
                  memberikan layanan terbaik kepada masyarakat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`w-6 h-6 text-${feature.color}-600`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Pencapaian Kami
                </h2>
                <p className="text-lg opacity-90">
                  Data kinerja dan statistik LaporPak tahun 2024
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
                      <div className="text-4xl lg:text-5xl font-bold mb-2">
                        {stat.number}
                      </div>
                      <div className="text-lg font-medium mb-2">
                        {stat.label}
                      </div>
                      <div className="text-sm opacity-80">
                        {stat.growth || stat.target || stat.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Perjalanan LaporPak
                </h2>
                <p className="text-gray-600 text-lg">
                  Evolusi platform dari tahun ke tahun
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-200"></div>

                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline dot */}
                      <div className="absolute left-6 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-md"></div>

                      {/* Content */}
                      <div className="ml-16 bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
                            {item.year}
                          </span>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Hubungi Kami
                </h2>
                <p className="text-gray-600 text-lg">
                  Tim LaporPak siap membantu Anda 24/7
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <Phone className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">Call Center</h3>
                  <p className="text-2xl font-bold text-red-500 mb-1">113</p>
                  <p className="text-sm text-gray-600">Darurat 24/7</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">Alamat</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    Jl. A.P. Pettarani No. 1
                  </p>
                  <p className="text-sm text-gray-600">
                    Makassar, Sulawesi Selatan
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <Mail className="w-8 h-8 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">Email</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    info@damkarmakassar.go.id
                  </p>
                  <p className="text-sm text-gray-600">Respon 1x24 jam</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <Heart className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Siap Melaporkan?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Gunakan LaporPak untuk melaporkan kejadian darurat dan bantuan
                penyelamatan. Setiap detik sangat berharga.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/reports/quick")}
                  className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                >
                  🔥 Quick Report Kebakaran
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>

                <button
                  onClick={() => navigate("/reports/standard")}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                >
                  🛡️ Standard Report Rescue
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
