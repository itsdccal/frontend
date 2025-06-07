import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Users, Building, CheckCircle, Upload, FileText, Phone, MapPin, Clock, AlertTriangle, Flame, Shield } from 'lucide-react';
import "leaflet/dist/leaflet.css";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationPicker({ onChange, position }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onChange(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

const ReportForm = ({ 
  form, 
  onInputChange, 
  onLocationChange, 
  onSubmit,
  previewImage,
  setPreviewImage 
}) => {
  const reportCategories = {
    kebakaran: [
      { value: 'rumah_tinggal', label: 'Kebakaran Rumah Tinggal' },
      { value: 'ruko_toko', label: 'Kebakaran Ruko/Toko' },
      { value: 'gedung_bertingkat', label: 'Kebakaran Gedung Bertingkat' },
      { value: 'pabrik_industri', label: 'Kebakaran Pabrik/Industri' },
      { value: 'kendaraan_pribadi', label: 'Kebakaran Kendaraan Pribadi' },
      { value: 'kendaraan_umum', label: 'Kebakaran Kendaraan Umum' },
      { value: 'hutan_lahan', label: 'Kebakaran Hutan/Lahan' },
      { value: 'pasar_tradisional', label: 'Kebakaran Pasar Tradisional' },
      { value: 'gudang_penyimpanan', label: 'Kebakaran Gudang Penyimpanan' },
      { value: 'spbu_pertamina', label: 'Kebakaran SPBU/Pertamina' },
      { value: 'rumah_sakit', label: 'Kebakaran Rumah Sakit/Faskes' },
      { value: 'sekolah_kampus', label: 'Kebakaran Sekolah/Kampus' }
    ],
    penyelamatan: [
      { value: 'pembongkaran_pintu', label: 'Pembongkaran Kunci/Pintu Rumah' },
      { value: 'evakuasi_korban_kebakaran', label: 'Evakuasi Korban Kebakaran' },
      { value: 'evakuasi_korban_banjir', label: 'Evakuasi Korban Banjir' },
      { value: 'penyelamatan_ketinggian', label: 'Penyelamatan dari Ketinggian' },
      { value: 'penyelamatan_sumur', label: 'Penyelamatan dari Sumur' },
      { value: 'penyelamatan_air', label: 'Penyelamatan dari Air/Sungai' },
      { value: 'penyelamatan_hewan', label: 'Penyelamatan Hewan Ternak' },
      { value: 'penyelamatan_kucing', label: 'Penyelamatan Kucing dari Pohon' },
      { value: 'evakuasi_medis', label: 'Evakuasi Medis Darurat' },
      { value: 'pembebasan_jepitan', label: 'Pembebasan Korban Terjepit' },
      { value: 'penyelamatan_gua', label: 'Penyelamatan dari Gua/Lubang' },
      { value: 'bantuan_persalinan', label: 'Bantuan Persalinan Darurat' }
    ],
    bencana: [
      { value: 'banjir_bandang', label: 'Banjir Bandang' },
      { value: 'banjir_genangan', label: 'Banjir Genangan' },
      { value: 'longsor_besar', label: 'Tanah Longsor Besar' },
      { value: 'longsor_kecil', label: 'Tanah Longsor Kecil' },
      { value: 'angin_puting_beliung', label: 'Angin Puting Beliung' },
      { value: 'angin_kencang', label: 'Angin Kencang/Badai' },
      { value: 'gempa_bumi', label: 'Gempa Bumi' },
      { value: 'pohon_tumbang', label: 'Pohon Tumbang' },
      { value: 'bangunan_roboh', label: 'Bangunan Roboh' },
      { value: 'jembatan_rusak', label: 'Jembatan Rusak/Putus' },
      { value: 'abrasi_pantai', label: 'Abrasi Pantai' },
      { value: 'cuaca_ekstrem', label: 'Cuaca Ekstrem Lainnya' }
    ]
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    onInputChange(e);
    
    // Reset sub category when main category changes
    if (name === 'reportType') {
      onInputChange({ target: { name: 'subCategory', value: '' } });
      onInputChange({ target: { name: 'urgencyLevel', value: 'menengah' } });
    }
    
    // Auto-set urgency when sub category is selected
    if (name === 'subCategory' && value) {
      const selectedCategory = reportCategories[form.reportType]?.find(cat => cat.value === value);
      if (selectedCategory) {
        onInputChange({ target: { name: 'urgencyLevel', value: selectedCategory.urgency } });
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
    onInputChange(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-12 h-12 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">
              DINAS PEMADAM KEBAKARAN
            </h1>
          </div>
          <p className="text-xl opacity-90">
            Layanan Darurat 24 Jam - Call Center: 113
          </p>
          <p className="text-lg opacity-80 mt-2">
            Laporkan Kebakaran, Penyelamatan & Bencana
          </p>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="bg-yellow-100 border-l-4 border-yellow-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <p className="text-yellow-800 font-semibold">DARURAT? Hubungi Langsung: 113 atau 112</p>
              <p className="text-yellow-700 text-sm">Untuk situasi darurat yang memerlukan respon cepat, hubungi nomor darurat terlebih dahulu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-red-500 text-white p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold">Sampaikan Laporan Darurat Anda</h2>
                  <p className="text-red-100">Tanggal: {getCurrentDateTime()}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={onSubmit} className="p-8">
              <div className="space-y-8">
                {/* Jenis Laporan */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    JENIS LAPORAN/ADUAN
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
                      <input
                        type="radio"
                        name="reportType"
                        value="kebakaran"
                        checked={form.reportType === 'kebakaran'}
                        onChange={handleCategoryChange}
                        className="text-red-600 mr-3"
                      />
                      <Flame className="w-6 h-6 text-red-600 mr-3" />
                      <span className="font-semibold text-gray-800">KEBAKARAN</span>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name="reportType"
                        value="penyelamatan"
                        checked={form.reportType === 'penyelamatan'}
                        onChange={handleCategoryChange}
                        className="text-blue-600 mr-3"
                      />
                      <Shield className="w-6 h-6 text-blue-600 mr-3" />
                      <span className="font-semibold text-gray-800">PENYELAMATAN</span>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                      <input
                        type="radio"
                        name="reportType"
                        value="bencana"
                        checked={form.reportType === 'bencana'}
                        onChange={handleCategoryChange}
                        className="text-orange-600 mr-3"
                      />
                      <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                      <span className="font-semibold text-gray-800">BENCANA ALAM</span>
                    </label>
                  </div>

                  {/* Sub Kategori */}
                  {form.reportType && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih Jenis Spesifik *
                      </label>
                      <select
                        name="subCategory"
                        value={form.subCategory || ''}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">Pilih jenis spesifik...</option>
                        {reportCategories[form.reportType]?.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Tingkat Urgensi - Auto Set */}
                  {form.subCategory && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tingkat Urgensi 
                      </label>
                      <div className="flex items-center space-x-4">
                        {form.urgencyLevel === 'darurat' && (
                          <div className="flex items-center px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-600 font-bold">DARURAT</span>
                          </div>
                        )}
                        {form.urgencyLevel === 'menengah' && (
                          <div className="flex items-center px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600 mr-2" />
                            <span className="text-orange-600 font-bold">MENENGAH</span>
                          </div>
                        )}
                        {form.urgencyLevel === 'rendah' && (
                          <div className="flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-green-600 font-bold">RENDAH</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-500">
                          Tingkat urgensi ditentukan secara otomatis berdasarkan jenis laporan
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Pelapor */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    DATA PELAPOR
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pelapor *
                      </label>
                      <input
                        type="text"
                        name="reporterName"
                        value={form.reporterName || ''}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No. Telepon/WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="reporterPhone"
                        value={form.reporterPhone || ''}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Pelapor *
                    </label>
                    <input
                      type="text"
                      name="reporterAddress"
                      value={form.reporterAddress || ''}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Alamat lengkap pelapor"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RT</label>
                      <input
                        type="text"
                        name="reporterRT"
                        value={form.reporterRT || ''}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RW</label>
                      <input
                        type="text"
                        name="reporterRW"
                        value={form.reporterRW || ''}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan *</label>
                      <input
                        type="text"
                        name="reporterKelurahan"
                        value={form.reporterKelurahan || ''}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Kelurahan"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan *</label>
                      <input
                        type="text"
                        name="reporterKecamatan"
                        value={form.reporterKecamatan || ''}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Kecamatan"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Detail Laporan & Lokasi */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Report Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Laporan *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Contoh: Kebakaran Rumah Warga di BTN Asal Mula"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Kejadian *
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={onInputChange}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Jelaskan secara detail kejadian yang dilaporkan..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lokasi Kejadian *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Alamat lengkap lokasi kejadian"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Foto Kejadian *
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mt-3 rounded border border-gray-300 w-full max-w-xs h-40 object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Column - Map */}
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      LOKASI KEJADIAN PADA PETA
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Klik pada peta untuk menandai lokasi kejadian dengan tepat
                    </p>
                    
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                      <MapContainer
                        center={
                          form.latitude && form.longitude
                            ? [form.latitude, form.longitude]
                            : [-5.1477, 119.4327]
                        }
                        zoom={13}
                        style={{ height: "300px", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <LocationPicker 
                          onChange={onLocationChange}
                          position={
                            form.latitude && form.longitude
                              ? [form.latitude, form.longitude]
                              : null
                          }
                        />
                      </MapContainer>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <strong>Koordinat:</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Latitude: {form.latitude || 'Belum dipilih'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Longitude: {form.longitude || 'Belum dipilih'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Catatan Penting */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-bold text-red-800 mb-3">CATATAN PENTING:</h4>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>• Pastikan lokasi yang dilaporkan mudah diakses oleh petugas</li>
                    <li>• Sertakan foto kondisi kejadian untuk mempercepat respon</li>
                    <li>• Siapkan fotokopi KK pelapor dan tetangga sekitar yang terdampak</li>
                    <li>• Hadir saat petugas di lokasi dan selalu aktifkan nomor telepon/WA</li>
                    <li>• Untuk darurat kebakaran, segera hubungi 113 sebelum mengisi form</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <label className="flex items-center">
                    <input type="checkbox" className="text-red-600 mr-2" required />
                    <span className="text-sm">Saya menyatakan bahwa informasi yang diberikan adalah benar</span>
                  </label>
                  <div className="space-x-3">
                    <button type="button" className="px-6 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      BATAL
                    </button>
                    <button type="submit" className="px-8 py-3 bg-red-500 text-white rounded font-medium hover:bg-red-600 flex items-center transition-colors">
                      <Phone className="w-4 h-4 mr-2" />
                      LAPOR!
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-red-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">KONTAK DARURAT DAMKAR MAKASSAR</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Darurat</p>
              <p className="text-red-100">113 / 112</p>
            </div>
            <div>
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Call Center</p>
              <p className="text-red-100">(0411) 872119</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Kantor Pusat</p>
              <p className="text-red-100">Jl. Urip Sumoharjo, Makassar</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportForm;