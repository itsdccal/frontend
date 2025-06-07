import React, { useState } from 'react';
import { Search, Menu, FileText, Users, Building, CheckCircle, MapPin, Upload } from 'lucide-react';

const LaporPakHomepage = () => {
  const [reportType, setReportType] = useState('infrastruktur');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Layanan Aspirasi dan Pengaduan Online Rakyat
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang
          </p>
        </div>
      </section>

      {/* Report Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-500 text-white p-4">
              <h2 className="text-xl font-bold">Sampaikan Laporan Anda</h2>
              <p className="text-sm opacity-90">Laporan Anda akan diteruskan kepada instansi yang berwenang</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kategori Laporan yang Anda Pilih:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="reportType"
                        value="infrastruktur"
                        checked={reportType === 'infrastruktur'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-red-500"
                      />
                      <span className="ml-2">INFRASTRUKTUR</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="reportType"
                        value="layanan"
                        checked={reportType === 'layanan'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-red-500"
                      />
                      <span className="ml-2">LAYANAN</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="reportType"
                        value="lingkungan"
                        checked={reportType === 'lingkungan'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-red-500"
                      />
                      <span className="ml-2">LINGKUNGAN HIDUP</span>
                    </label>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    *Silahkan Anda Pilih Jenis Kategorisasi Pengaduan Yang Ingin Anda Sampaikan
                  </p>
                </div>

                {/* Report Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tulis Judul Laporan *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ketik judul laporan Anda"
                  />
                </div>

                {/* Report Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Isi Laporan *
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ketik isi laporan Anda"
                  />
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Lokasi Kejadian *
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    >
                      <option value="">Pilih Provinsi</option>
                      <option value="jawa-barat">Jawa Barat</option>
                      <option value="jawa-tengah">Jawa Tengah</option>
                      <option value="jawa-timur">Jawa Timur</option>
                    </select>
                  </div>
                  
                  <div>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Pilih Kota/Kabupaten</option>
                      <option value="bandung">Bandung</option>
                      <option value="jakarta">Jakarta</option>
                      <option value="surabaya">Surabaya</option>
                    </select>
                  </div>
                  
                  <div>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value="">Pilih Instansi Tujuan</option>
                      <option value="dinas-pekerjaan-umum">Dinas Pekerjaan Umum</option>
                      <option value="dinas-lingkungan-hidup">Dinas Lingkungan Hidup</option>
                      <option value="dinas-kesehatan">Dinas Kesehatan</option>
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload file pendukung
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-red-300">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Unggah foto/video laporan yang mendukung
                    </p>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    *File Upload Hanya Mendukung Format Image dan Video Saja dengan Maksimal 10 MB
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="text-red-500" />
                    <span className="ml-2 text-sm">Setuju dengan syarat</span>
                  </label>
                  <div className="space-x-3">
                    <button type="button" className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      BATALKAN
                    </button>
                    <button type="button" className="px-6 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600">
                      LAPOR!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold">Tulis Laporan</h3>
              <p className="text-sm text-gray-600">
                Laporkan keluhan atau aspirasi Anda dengan mudah
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Building className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold">Proses Verifikasi</h3>
              <p className="text-sm text-gray-600">
                Laporan Anda akan diverifikasi dan diteruskan ke instansi terkait
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold">Tindak Lanjut</h3>
              <p className="text-sm text-gray-600">
                Instansi akan menindaklanjuti dan memberikan respon
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold">Selesai</h3>
              <p className="text-sm text-gray-600">
                Laporan Anda akan mendapat tanggapan dan penyelesaian
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Reports Button */}
      <section className="py-8 text-center">
        <button className="border-2 border-red-500 text-red-500 px-8 py-3 rounded font-medium hover:bg-red-500 hover:text-white transition-colors">
          PELAJARI LEBIH LANJUT
        </button>
      </section>

      {/* Statistics Section */}
      <section className="bg-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">JUMLAH LAPORAN SEKARANG</h2>
          <div className="text-6xl font-bold mb-8">959,139</div>
        </div>
      </section>

      {/* Connected Institutions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">INSTANSI TERHUBUNG</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">34</div>
              <div className="text-sm text-gray-600">Kementerian</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">100</div>
              <div className="text-sm text-gray-600">Lembaga</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">396</div>
              <div className="text-sm text-gray-600">Pemerintah Daerah</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">94</div>
              <div className="text-sm text-gray-600">BUMN</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">34</div>
              <div className="text-sm text-gray-600">Perangkat</div>
            </div>
          </div>
          <button className="border-2 border-red-500 text-red-500 px-8 py-3 rounded font-medium hover:bg-red-500 hover:text-white transition-colors">
            LIHAT SELENGKAPNYA
          </button>
        </div>
      </section>
    </div>
  );
};

export default LaporPakHomepage;