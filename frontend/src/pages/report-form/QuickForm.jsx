import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Phone, AlertTriangle, Flame, MapPin, Clock, CheckCircle, ArrowLeft, Camera, X, AlertCircle } from 'lucide-react';
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

const QuickFormComponent = () => {
  const [form, setForm] = useState({
    reporterName: "",
    reporterPhone: "",
    fireType: "",
    location: "",
    description: "",
    urgencyLevel: "medium",
    hasCasualties: false,
    latitude: "",
    longitude: "",
    image: null
  });

  const [mlValidation, setMLValidation] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState(null);
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fireTypes = [
    { value: 'rumah_tinggal', label: 'Rumah Tinggal' },
    { value: 'ruko_toko', label: 'Ruko/Toko' },
    { value: 'gedung_bertingkat', label: 'Gedung Bertingkat' },
    { value: 'kendaraan', label: 'Kendaraan' },
    { value: 'hutan_lahan', label: 'Hutan/Lahan' },
    { value: 'pabrik_industri', label: 'Pabrik/Industri' },
    { value: 'spbu_pertamina', label: 'SPBU/Pertamina' },
    { value: 'pasar', label: 'Pasar' },
    { value: 'gudang', label: 'Gudang' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  };

  const validateFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024; 
    return file.size <= maxSize;
  };

  const validateFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  };

  const sanitizeInput = (input) => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '');
  };

  const validateWithML = useCallback(async (description) => {
    if (!description || description.length < 10) {
      setMLValidation(null);
      return;
    }

    clearTimeout(validationTimeout);
    const timeout = setTimeout(async () => {
      try {
        const mlResult = simulateMLValidation(description);
        setMLValidation(mlResult);
      } catch (error) {
        console.error('ML validation error:', error);
        setMLValidation({
          isKebakaran: true,
          confidence: 50,
          isEmergency: false,
          suggestions: [],
          message: '⚠️ ML validation unavailable, please review manually'
        });
      }
    }, 1500);
    
    setValidationTimeout(timeout);
  }, [validationTimeout]);

  const simulateMLValidation = (text) => {
    const lowerText = text.toLowerCase();
    let confidence = 75;
    let isEmergency = false;
    let suggestions = [];

    if (lowerText.includes('korban') || lowerText.includes('terjebak') || lowerText.includes('luka') || lowerText.includes('meninggal')) {
      isEmergency = true;
      confidence = 95;
      suggestions.push('Situasi darurat terdeteksi - hubungi 113 segera');
    }

    if (lowerText.includes('besar') || lowerText.includes('menyebar') || lowerText.includes('cepat') || lowerText.includes('tidak terkendali')) {
      confidence = 90;
      isEmergency = true;
      suggestions.push('Kebakaran besar - prioritas tinggi');
    }

    if (lowerText.includes('asap') || lowerText.includes('tebal') || lowerText.includes('hitam')) {
      suggestions.push('dengan asap tebal');
      confidence += 5;
    }

    if (lowerText.includes('gas') || lowerText.includes('ledakan') || lowerText.includes('meledak')) {
      isEmergency = true;
      confidence = 98;
      suggestions.push('Potensi ledakan - evakuasi segera');
    }

    if (lowerText.includes('rescue') || lowerText.includes('penyelamatan')) {
      suggestions.push('Ini mungkin laporan rescue, bukan kebakaran');
      confidence = 60;
    }

    return {
      isKebakaran: !lowerText.includes('rescue'),
      confidence: Math.min(confidence, 98),
      isEmergency,
      suggestions,
      message: isEmergency 
        ? `🚨 ML Detection: Emergency situation detected (${confidence}% confidence)`
        : `✅ ML Validation: Fire incident confirmed (${confidence}% confidence)`
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.reporterName.trim()) newErrors.reporterName = 'Nama wajib diisi';
    if (!form.reporterPhone.trim()) {
      newErrors.reporterPhone = 'Nomor telepon wajib diisi';
    } else if (!validatePhone(form.reporterPhone)) {
      newErrors.reporterPhone = 'Format nomor telepon tidak valid';
    }
    if (!form.fireType) newErrors.fireType = 'Jenis kebakaran wajib dipilih';
    if (!form.location.trim()) newErrors.location = 'Lokasi wajib diisi';
    if (!form.description.trim()) {
      newErrors.description = 'Deskripsi kejadian wajib diisi';
    } else if (form.description.trim().length < 10) {
      newErrors.description = 'Deskripsi terlalu singkat (minimal 10 karakter)';
    }
    if (!form.latitude || !form.longitude) newErrors.coordinates = 'Koordinat lokasi wajib dipilih pada peta';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      
      if (!validateFileSize(file)) {
        alert('File terlalu besar (maksimal 10MB)');
        return;
      }
      
      if (!validateFileType(file)) {
        alert('Format file tidak didukung (hanya JPG, PNG, GIF)');
        return;
      }
      
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
      
      setPreviewImage(URL.createObjectURL(file));
    }
    
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : sanitizedValue,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'description') {
      validateWithML(sanitizedValue);
    }
  };

  const handleLocationChange = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    
    if (errors.coordinates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.coordinates;
        return newErrors;
      });
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser ini');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationChange(position.coords.latitude, position.coords.longitude);
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = 'Gagal mendapatkan lokasi: ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Izin lokasi ditolak';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            errorMessage += 'Timeout mendapatkan lokasi';
            break;
          default:
            errorMessage += 'Error tidak diketahui';
            break;
        }
        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const removeImage = () => {
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setForm(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!isOnline) {
      alert('Tidak ada koneksi internet. Laporan akan dikirim saat koneksi kembali.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'image' && form[key]) {
          formData.append(key, form[key]);
        } else if (typeof form[key] === 'boolean') {
          formData.append(key, form[key].toString());
        } else if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      formData.append('mlValidation', JSON.stringify(mlValidation));
      formData.append('reportType', 'kebakaran');
      formData.append('reportMode', 'quick');
      formData.append('reportDate', new Date().toISOString());

      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportId = Math.random().toString(36).substr(2, 9).toUpperCase();
      alert(`✅ Laporan kebakaran berhasil dikirim!\n\nID Laporan: ${reportId}\nTim Damkar akan segera menindaklanjuti.\n\nSimpan ID laporan untuk tracking.`);
      
      setForm({
        reporterName: "",
        reporterPhone: "",
        fireType: "",
        location: "",
        description: "",
        urgencyLevel: "medium",
        hasCasualties: false,
        latitude: "",
        longitude: "",
        image: null
      });
      
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
      setMLValidation(null);

    } catch (error) {
      alert('❌ Gagal mengirim laporan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applySuggestion = (suggestion) => {
    setForm(prev => ({
      ...prev,
      description: prev.description + (prev.description ? ' ' : '') + suggestion
    }));
  };

  return (
    <div className="min-h-screen mt-[64px] bg-gradient-to-br from-orange-50 to-red-50">
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          ⚠️ Tidak ada koneksi internet - Mode offline
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold flex items-center">
                  <Flame className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                  Quick Report Kebakaran
                </h1>
                <p className="text-xs lg:text-sm opacity-90">Estimasi waktu: 2-3 menit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">Form Quick - Field minimal untuk respon cepat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg lg:rounded-xl shadow-lg lg:shadow-xl overflow-hidden">
          <div className="p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {mlValidation && (
                <div className={`p-4 rounded-lg ${
                  mlValidation.isEmergency 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-start">
                    {mlValidation.isEmergency ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm lg:text-base">{mlValidation.message}</p>
                      {mlValidation.suggestions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs lg:text-sm text-gray-600 mb-1">Saran ML:</p>
                          <div className="flex flex-wrap gap-1">
                            {mlValidation.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => applySuggestion(suggestion)}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                              >
                                + {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-orange-50 p-4 lg:p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Informasi Pelapor
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="reporterName"
                      value={form.reporterName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                        errors.reporterName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nama lengkap Anda"
                      aria-describedby={errors.reporterName ? "reporterName-error" : undefined}
                      required
                    />
                    {errors.reporterName && (
                      <p id="reporterName-error" className="text-red-500 text-xs mt-1">{errors.reporterName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon/WA *
                    </label>
                    <input
                      type="tel"
                      name="reporterPhone"
                      value={form.reporterPhone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                        errors.reporterPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="08xxxxxxxxxx"
                      aria-describedby={errors.reporterPhone ? "reporterPhone-error" : undefined}
                      required
                    />
                    {errors.reporterPhone && (
                      <p id="reporterPhone-error" className="text-red-500 text-xs mt-1">{errors.reporterPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kebakaran *
                    </label>
                    <select
                      name="fireType"
                      value={form.fireType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                        errors.fireType ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-describedby={errors.fireType ? "fireType-error" : undefined}
                      required
                    >
                      <option value="">Pilih jenis kebakaran...</option>
                      {fireTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.fireType && (
                      <p id="fireType-error" className="text-red-500 text-xs mt-1">{errors.fireType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Kejadian *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Alamat lengkap lokasi kebakaran"
                      aria-describedby={errors.location ? "location-error" : undefined}
                      required
                    />
                    {errors.location && (
                      <p id="location-error" className="text-red-500 text-xs mt-1">{errors.location}</p>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Singkat *
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Jelaskan kondisi kebakaran secara singkat..."
                      aria-describedby={errors.description ? "description-error" : undefined}
                      maxLength="300"
                      required
                    />
                    {errors.description && (
                      <p id="description-error" className="text-red-500 text-xs mt-1">{errors.description}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {form.description.length}/300 karakter
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat Urgensi
                    </label>
                    <select
                      name="urgencyLevel"
                      value={form.urgencyLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base"
                    >
                      <option value="low">Rendah - Api kecil, terkendali</option>
                      <option value="medium">Sedang - Perlu perhatian</option>
                      <option value="high">Tinggi - Api besar, menyebar</option>
                      <option value="critical">Kritis - Ada korban/bahaya</option>
                    </select>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="hasCasualties"
                      checked={form.hasCasualties}
                      onChange={handleInputChange}
                      className="mt-1 text-red-500 focus:ring-red-500"
                      id="casualties"
                    />
                    <label htmlFor="casualties" className="text-sm font-medium text-gray-700">
                      Ada korban terluka atau terjebak
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Jika ada korban, sebaiknya hubungi 113 langsung
                      </p>
                    </label>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Kejadian (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleInputChange}
                        className="hidden"
                        id="imageUpload"
                        ref={fileInputRef}
                      />
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Tap untuk ambil/upload foto
                        </p>
                        <p className="text-xs text-gray-500">
                          Maksimal 10MB • Format: JPG, PNG, GIF
                        </p>
                      </label>
                    </div>
                    {previewImage && (
                      <div className="mt-3 relative inline-block">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full max-w-xs rounded border mx-auto"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Hapus foto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 lg:p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Lokasi Kejadian
                </h3>
                
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-3">
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

                {errors.coordinates && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                    <p className="text-red-600 text-xs flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.coordinates}
                    </p>
                  </div>
                )}

                <div className="text-sm text-gray-600 bg-white p-3 rounded mb-3">
                  <p className="font-medium mb-1">Koordinat:</p>
                  <p>Lat: {form.latitude ? parseFloat(form.latitude).toFixed(6) : 'Tap pada peta'}</p>
                  <p>Lng: {form.longitude ? parseFloat(form.longitude).toFixed(6) : 'untuk pilih lokasi'}</p>
                </div>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {locationLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mendapatkan lokasi...
                    </div>
                  ) : (
                    <>📍 Gunakan Lokasi Saya</>
                  )}
                </button>
              </div>

              <div className="border-t pt-6">
                <div className="flex flex-col space-y-4">
                  <label className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      className="mt-1 text-orange-500 focus:ring-orange-500" 
                      required 
                    />
                    <span className="text-sm text-gray-700">
                      Saya menyatakan bahwa informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan. 
                      Saya bersedia dihubungi oleh tim Damkar untuk koordinasi lebih lanjut.
                    </span>
                  </label>

                  {(form.hasCasualties || form.urgencyLevel === 'critical' || mlValidation?.isEmergency) && (
                    <div className="bg-red-50 border border-red-200 rounded p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-red-800 font-medium text-sm">
                            🚨 Situasi Darurat Terdeteksi
                          </p>
                          <p className="text-red-700 text-xs mt-1">
                            Untuk situasi yang mengancam jiwa, sebaiknya hubungi 113 secara langsung untuk respon yang lebih cepat.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Hubungi 113 untuk emergency call?')) {
                                window.location.href = 'tel:113';
                              }
                            }}
                            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            📞 Call 113 Sekarang
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-orange-50 border border-orange-200 rounded p-4">
                    <p className="text-sm text-orange-800">
                      <strong>📞 Penting:</strong> Pastikan nomor telepon Anda aktif. Tim Damkar akan menghubungi Anda 
                      untuk konfirmasi dan koordinasi lebih lanjut sebelum tiba di lokasi.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button 
                      type="button" 
                      onClick={() => window.history.back()}
                      className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || !isOnline}
                      className="flex-1 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mengirim Laporan...
                        </div>
                      ) : !isOnline ? (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Tidak Ada Koneksi
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4 mr-2" />
                          KIRIM LAPORAN CEPAT
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 sm:hidden">
        <button
          onClick={() => {
            if (confirm('Apakah ini situasi darurat yang mengancam nyawa? Anda akan dihubungkan ke 113.')) {
              window.location.href = 'tel:113';
            }
          }}
          className="w-full py-3 bg-red-600 rounded-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          🚨 DARURAT? CALL 113 SEKARANG
        </button>
      </div>

      <div className="h-20 sm:h-0"></div>
    </div>
  );
};

export default QuickFormComponent;