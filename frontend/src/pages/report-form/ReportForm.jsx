import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Phone, AlertTriangle, Flame, Shield, MapPin, Clock, CheckCircle, Upload, Users } from 'lucide-react';
import "leaflet/dist/leaflet.css";

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

const ReportForm = () => {
  const [reportMode, setReportMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    image: null,
    latitude: "",
    longitude: "",
    reportType: "",
    subCategory: "",
    urgencyLevel: "menengah",
    reporterName: "",
    reporterPhone: "",
    reporterAddress: "",
    reporterRT: "",
    reporterRW: "",
    reporterKelurahan: "",
    reporterKecamatan: "",
  });
  
  const [mlValidation, setMLValidation] = useState(null);
  const [showMLSuggestion, setShowMLSuggestion] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [validationTimeout, setValidationTimeout] = useState(null);

  const emergencyCategories = {
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
      { value: 'spbu_pertamina', label: 'Kebakaran SPBU/Pertamina' }
    ],
    rescue: [
      { value: 'pembongkaran_kunci', label: 'Pembongkaran Kunci/Pintu' },
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
    ]
  };

  const validateWithML = async (description, category) => {
    if (!description || description.length < 10 || !category) return;

    clearTimeout(validationTimeout);
    const timeout = setTimeout(async () => {
      try {
        const mlResult = simulateMLValidation(description, category);
        setMLValidation(mlResult);
        setShowMLSuggestion(!mlResult.isMatch);
      } catch (error) {
        console.error('ML validation error:', error);
      }
    }, 1000);
    
    setValidationTimeout(timeout);
  };

  const simulateMLValidation = (text, userCategory) => {
    const lowerText = text.toLowerCase();
    let mlCategory = 'rescue';
    let confidence = 75;

    if (lowerText.includes('kebakaran') || lowerText.includes('api') || lowerText.includes('terbakar') || lowerText.includes('asap')) {
      mlCategory = 'kebakaran';
      confidence = 90;
    } else if (lowerText.includes('kunci') || lowerText.includes('terkunci') || lowerText.includes('penyelamatan') || lowerText.includes('evakuasi')) {
      mlCategory = 'rescue';
      confidence = 85;
    }

    return {
      userChoice: userCategory,
      mlPrediction: mlCategory,
      confidence,
      isMatch: userCategory === mlCategory,
      message: userCategory === mlCategory 
        ? `ML confirms your choice (${confidence}% confidence)`
        : `ML suggests "${mlCategory}" instead (${confidence}% confidence)`
    };
  };

  const handleEmergencyCall = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = `${position.coords.latitude},${position.coords.longitude}`;
        alert(`🚨 Menghubungi 113...\n📍 Lokasi GPS: ${location}\n\nSetelah menelpon, Anda akan diarahkan untuk mengisi quick report.`);
        window.location.href = 'tel:113';
        setTimeout(() => setReportMode('post-call'), 5000);
      });
    } else {
      alert('🚨 Menghubungi 113...\n\nSetelah menelpon, Anda akan diarahkan untuk mengisi quick report.');
      window.location.href = 'tel:113';
      setTimeout(() => setReportMode('post-call'), 5000);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setForm(prev => ({ ...prev, reportType: category }));
    
    if (category === 'kebakaran') {
      setReportMode('quick-form');
    } else {
      setReportMode('standard-form');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
    
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (name === 'description') {
      validateWithML(value, selectedCategory);
    }
  };

  const handleLocationChange = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.latitude || !form.longitude) {
      alert("Silakan pilih lokasi kejadian pada peta");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'image' && form[key]) {
        formData.append(key, form[key]);
      } else if (typeof form[key] === 'string') {
        formData.append(key, form[key]);
      }
    });

    formData.append('mlValidation', JSON.stringify(mlValidation));
    formData.append('reportMode', reportMode);
    formData.append('reportDate', new Date().toISOString());

    try {
      alert(`Laporan ${selectedCategory} berhasil dikirim!\nID: ${Math.random().toString(36).substr(2, 9)}\nPerugas akan segera menindaklanjuti.`);
    } catch (error) {
      alert('Gagal mengirim laporan: ' + error.message);
    }
  };

  const switchCategory = (newCategory) => {
    setSelectedCategory(newCategory);
    setForm(prev => ({ ...prev, reportType: newCategory }));
    setShowMLSuggestion(false);
    
    if (newCategory === 'kebakaran') {
      setReportMode('quick-form');
    } else {
      setReportMode('standard-form');
    }
  };

  if (!reportMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <Flame className="w-12 h-12 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold">DINAS PEMADAM KEBAKARAN</h1>
            </div>
            <p className="text-xl opacity-90">Layanan Darurat 24 Jam - Call Center: 113</p>
          </div>
        </section>

        <section className="bg-yellow-100 border-l-4 border-yellow-500 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-semibold">DARURAT? Hubungi Langsung: 113 atau 112</p>
                <p className="text-yellow-700 text-sm">Untuk situasi mengancam nyawa, hubungi nomor darurat terlebih dahulu</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Pilih Jenis Laporan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-500 text-white rounded-lg p-6 text-center cursor-pointer hover:bg-red-600 transition-colors"
                     onClick={handleEmergencyCall}>
                  <Phone className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">DARURAT</h3>
                  <p className="text-sm opacity-90">Call 113 Langsung</p>
                  <p className="text-xs mt-2">Situasi mengancam nyawa</p>
                </div>

                <div className="bg-orange-500 text-white rounded-lg p-6 text-center cursor-pointer hover:bg-orange-600 transition-colors"
                     onClick={() => handleCategorySelect('kebakaran')}>
                  <Flame className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">KEBAKARAN</h3>
                  <p className="text-sm opacity-90">Form Laporan</p>
                  <p className="text-xs mt-2">Semua jenis kebakaran</p>
                </div>

                <div className="bg-green-500 text-white rounded-lg p-6 text-center cursor-pointer hover:bg-green-600 transition-colors"
                     onClick={() => handleCategorySelect('rescue')}>
                  <Shield className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">RESCUE</h3>
                  <p className="text-sm opacity-90">Form Lengkap</p>
                  <p className="text-xs mt-2">Penyelamatan, evakuasi</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const renderForm = () => {
    const isEmergency = reportMode === 'emergency-form' || reportMode === 'post-call';
    const isQuick = reportMode === 'quick-form';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Flame className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {reportMode === 'post-call' ? 'Quick Report Setelah Call' : 
                     isEmergency ? 'Form Darurat' : 
                     isQuick ? 'Quick Report' : 'Form Rescue'}
                  </h1>
                  <p className="text-red-100">
                    {selectedCategory === 'kebakaran_darurat' ? 'Kebakaran Darurat' :
                     selectedCategory === 'kebakaran_standar' ? 'Kebakaran Standar' : 
                     'Rescue & Evakuasi'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReportMode(null)}
                className="bg-white text-red-500 px-4 py-2 rounded font-medium hover:bg-red-50"
              >
                Kembali
              </button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="space-y-6">
                  {/* ML Validation Feedback */}
                  {mlValidation && (
                    <div className={`p-4 rounded-lg ${
                      mlValidation.isMatch 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {mlValidation.isMatch ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                          )}
                          <span className="font-medium">
                            {mlValidation.isMatch ? '✅ ML Validation:' : '⚠️ ML Suggestion:'}
                          </span>
                        </div>
                        {!mlValidation.isMatch && (
                          <button
                            type="button"
                            onClick={() => switchCategory(mlValidation.mlPrediction)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                          >
                            Switch ke {mlValidation.mlPrediction}
                          </button>
                        )}
                      </div>
                      <p className="text-sm mt-1">{mlValidation.message}</p>
                    </div>
                  )}

                  {/* Jenis Spesifik */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Jenis Spesifik</h3>
                    <select
                      name="subCategory"
                      value={form.subCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Pilih jenis spesifik...</option>
                      {emergencyCategories[selectedCategory]?.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data Pelapor */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Data Pelapor
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pelapor *</label>
                        <input
                          type="text"
                          name="reporterName"
                          value={form.reporterName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon/WA *</label>
                        <input
                          type="tel"
                          name="reporterPhone"
                          value={form.reporterPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                    </div>

                    {!isEmergency && (
                      <>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Pelapor *</label>
                          <input
                            type="text"
                            name="reporterAddress"
                            value={form.reporterAddress}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">RT</label>
                            <input
                              type="text"
                              name="reporterRT"
                              value={form.reporterRT}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">RW</label>
                            <input
                              type="text"
                              name="reporterRW"
                              value={form.reporterRW}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan *</label>
                            <input
                              type="text"
                              name="reporterKelurahan"
                              value={form.reporterKelurahan}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan *</label>
                            <input
                              type="text"
                              name="reporterKecamatan"
                              value={form.reporterKecamatan}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Detail Laporan & Lokasi */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isEmergency ? 'Judul Singkat *' : 'Judul Laporan *'}
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder={isEmergency ? "Singkat dan jelas" : "Judul lengkap laporan"}
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
                          onChange={handleInputChange}
                          rows={isEmergency ? 3 : 5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Jelaskan kejadian secara detail..."
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
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Alamat lengkap lokasi kejadian"
                          required
                        />
                      </div>

                      {!isEmergency && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Foto Kejadian *
                          </label>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required={!isEmergency}
                          />
                          {previewImage && (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="mt-3 rounded border border-gray-300 w-full max-w-xs h-40 object-cover"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Map */}
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Lokasi Kejadian
                      </h3>
                      
                      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <MapContainer
                          center={
                            form.latitude && form.longitude
                              ? [form.latitude, form.longitude]
                              : [-5.1477, 119.4327]
                          }
                          zoom={13}
                          style={{ height: "250px", width: "100%" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap'
                          />
                          <LocationPicker 
                            onChange={handleLocationChange}
                            position={
                              form.latitude && form.longitude
                                ? [form.latitude, form.longitude]
                                : null
                            }
                          />
                        </MapContainer>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        <p><strong>Koordinat:</strong></p>
                        <p>Lat: {form.latitude || 'Belum dipilih'}</p>
                        <p>Lng: {form.longitude || 'Belum dipilih'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <label className="flex items-center">
                      <input type="checkbox" className="text-red-600 mr-2" required />
                      <span className="text-sm">Informasi yang diberikan adalah benar</span>
                    </label>
                    <div className="space-x-3">
                      <button 
                        type="button" 
                        onClick={() => setReportMode(null)}
                        className="px-6 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      >
                        BATAL
                      </button>
                      <button 
                        type="button" 
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-red-500 text-white rounded font-medium hover:bg-red-600 flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {isEmergency ? 'KIRIM DARURAT!' : 'KIRIM LAPORAN!'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return renderForm();
};

export default ReportForm;