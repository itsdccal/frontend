import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Shield, ArrowLeft, MapPin, Users, Camera, Clock, CheckCircle, AlertTriangle, Upload, FileText, X, AlertCircle } from 'lucide-react';
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

const StandardFormComponent = () => {
  const [form, setForm] = useState({
    reporterName: "",
    reporterPhone: "",
    reporterAddress: "",
    reporterRT: "",
    reporterRW: "",
    reporterKelurahan: "",
    reporterKecamatan: "",
    rescueType: "",
    title: "",
    description: "",
    location: "",
    additionalInfo: "",
    latitude: "",
    longitude: "",
    images: []
  });

  const [mlValidation, setMLValidation] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationTimeout, setValidationTimeout] = useState(null);
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  const rescueTypes = [
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
      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  };

  const validateFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  };

  const validateFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov'];
    return allowedTypes.includes(file.type);
  };

  const sanitizeInput = (input) => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '');
  };

  const validateWithML = useCallback(async (description, rescueType) => {
    if (!description || description.length < 10) {
      setMLValidation(null);
      return;
    }

    clearTimeout(validationTimeout);
    const timeout = setTimeout(async () => {
      try {
        const mlResult = simulateMLValidation(description, rescueType);
        setMLValidation(mlResult);
      } catch (error) {
        console.error('ML validation error:', error);
        setMLValidation({
          isRescue: true,
          confidence: 50,
          suggestions: [],
          message: '⚠️ ML validation unavailable, please review manually'
        });
      }
    }, 1500); 
    
    setValidationTimeout(timeout);
  }, [validationTimeout]);

  const simulateMLValidation = (text, type) => {
    const lowerText = text.toLowerCase();
    let confidence = 75;
    let isCorrectCategory = true;
    let suggestions = [];

    if (lowerText.includes('kebakaran') || lowerText.includes('api') || lowerText.includes('terbakar') || lowerText.includes('asap')) {
      isCorrectCategory = false;
      confidence = 90;
      suggestions.push('Ini sepertinya laporan kebakaran, bukan rescue');
    } else if (lowerText.includes('kunci') && type !== 'pembongkaran_kunci') {
      suggestions.push('Mungkin yang dimaksud pembongkaran kunci?');
      confidence = 85;
    } else if ((lowerText.includes('hewan') || lowerText.includes('kucing') || lowerText.includes('anjing')) && !type.includes('hewan') && !type.includes('kucing')) {
      suggestions.push('Sepertinya terkait penyelamatan hewan');
      confidence = 80;
    } else if ((lowerText.includes('air') || lowerText.includes('sungai') || lowerText.includes('kolam')) && type !== 'penyelamatan_air') {
      suggestions.push('Mungkin penyelamatan dari air?');
      confidence = 82;
    }

    if (lowerText.includes('darurat') || lowerText.includes('segera') || lowerText.includes('urgent')) {
      suggestions.push('Prioritas tinggi terdeteksi');
      confidence += 5;
    }

    return {
      isRescue: isCorrectCategory,
      confidence: Math.min(confidence, 95),
      suggestions,
      message: isCorrectCategory 
        ? `✅ ML Validation: Rescue operation confirmed (${confidence}% confidence)`
        : `⚠️ ML Warning: This might be fire-related, not rescue (${confidence}% confidence)`
    };
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.reporterName.trim()) newErrors.reporterName = 'Nama wajib diisi';
      if (!form.reporterPhone.trim()) {
        newErrors.reporterPhone = 'Nomor telepon wajib diisi';
      } else if (!validatePhone(form.reporterPhone)) {
        newErrors.reporterPhone = 'Format nomor telepon tidak valid';
      }
      if (!form.reporterAddress.trim()) newErrors.reporterAddress = 'Alamat wajib diisi';
      if (!form.reporterKelurahan.trim()) newErrors.reporterKelurahan = 'Kelurahan wajib diisi';
      if (!form.reporterKecamatan.trim()) newErrors.reporterKecamatan = 'Kecamatan wajib diisi';
    }

    if (step === 2) {
      if (!form.rescueType) newErrors.rescueType = 'Jenis rescue wajib dipilih';
      if (!form.title.trim()) newErrors.title = 'Judul laporan wajib diisi';
      if (!form.description.trim()) {
        newErrors.description = 'Deskripsi kejadian wajib diisi';
      } else if (form.description.trim().length < 20) {
        newErrors.description = 'Deskripsi terlalu singkat (minimal 20 karakter)';
      }
    }

    if (step === 3) {
      if (!form.location.trim()) newErrors.location = 'Alamat lokasi wajib diisi';
      if (!form.latitude || !form.longitude) newErrors.coordinates = 'Koordinat lokasi wajib dipilih pada peta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "images" && files) {
      const newImages = Array.from(files);
      const validImages = [];
      const newPreviews = [];
      const fileErrors = [];

      newImages.forEach((file, index) => {
        if (!validateFileSize(file)) {
          fileErrors.push(`File ${file.name} terlalu besar (maksimal 10MB)`);
          return;
        }
        if (!validateFileType(file)) {
          fileErrors.push(`File ${file.name} format tidak didukung`);
          return;
        }
        
        validImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });

      if (fileErrors.length > 0) {
        alert(fileErrors.join('\n'));
      }

      setPreviewImages(prev => [...prev, ...newPreviews]);
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...validImages]
      }));
    } else {
      const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
      setForm(prev => ({
        ...prev,
        [name]: sanitizedValue,
      }));

      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      if (name === 'description' || name === 'rescueType') {
        validateWithML(name === 'description' ? sanitizedValue : form.description, name === 'rescueType' ? sanitizedValue : form.rescueType);
      }
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

  const removeImage = (index) => {
    if (previewImages[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewImages[index]);
    }
    
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
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
        if (key === 'images') {
          form.images.forEach((image, index) => {
            formData.append(`image_${index}`, image);
          });
        } else if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      formData.append('mlValidation', JSON.stringify(mlValidation));
      formData.append('reportType', 'rescue');
      formData.append('reportMode', 'standard');
      formData.append('reportDate', new Date().toISOString());

      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportId = Math.random().toString(36).substr(2, 9).toUpperCase();
      alert(`✅ Laporan rescue berhasil dikirim!\n\nID Laporan: ${reportId}\nTim Damkar akan segera menindaklanjuti.\n\nSimpan ID laporan untuk tracking.`);
      
      setForm({
        reporterName: "",
        reporterPhone: "",
        reporterAddress: "",
        reporterRT: "",
        reporterRW: "",
        reporterKelurahan: "",
        reporterKecamatan: "",
        rescueType: "",
        title: "",
        description: "",
        location: "",
        additionalInfo: "",
        latitude: "",
        longitude: "",
        images: []
      });
      setPreviewImages([]);
      setCurrentStep(1);
      setMLValidation(null);

    } catch (error) {
      alert('❌ Gagal mengirim laporan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const applySuggestion = (suggestion) => {
    setForm(prev => ({
      ...prev,
      description: prev.description + (prev.description ? ' ' : '') + suggestion
    }));
  };

  return (
    <div className="min-h-screen mt-[64px] bg-gradient-to-br from-green-50 to-blue-50">
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          ⚠️ Tidak ada koneksi internet - Mode offline
        </div>
      )}

      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
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
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                  Form Rescue & Penyelamatan
                </h1>
                <p className="text-xs lg:text-sm opacity-90">Estimasi waktu: 5-7 menit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 lg:w-20 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-xs lg:text-sm text-gray-600 text-center">
              Step {currentStep}/3: {
                currentStep === 1 ? 'Data Pelapor' :
                currentStep === 2 ? 'Detail Kejadian' : 'Lokasi & Submit'
              }
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 lg:p-8">
            {mlValidation && (
              <div className={`p-4 rounded-lg mb-6 ${
                mlValidation.isRescue 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start">
                  {mlValidation.isRescue ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
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

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 lg:p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Data Pelapor
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
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.reporterName ? 'border-red-500' : 'border-gray-300'
                        }`}
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
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
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
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Pelapor *
                    </label>
                    <input
                      type="text"
                      name="reporterAddress"
                      value={form.reporterAddress}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                        errors.reporterAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-describedby={errors.reporterAddress ? "reporterAddress-error" : undefined}
                      required
                    />
                    {errors.reporterAddress && (
                      <p id="reporterAddress-error" className="text-red-500 text-xs mt-1">{errors.reporterAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RT</label>
                      <input
                        type="text"
                        name="reporterRT"
                        value={form.reporterRT}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
                        maxLength="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RW</label>
                      <input
                        type="text"
                        name="reporterRW"
                        value={form.reporterRW}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
                        maxLength="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan *</label>
                      <input
                        type="text"
                        name="reporterKelurahan"
                        value={form.reporterKelurahan}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.reporterKelurahan ? 'border-red-500' : 'border-gray-300'
                        }`}
                        aria-describedby={errors.reporterKelurahan ? "reporterKelurahan-error" : undefined}
                        required
                      />
                      {errors.reporterKelurahan && (
                        <p id="reporterKelurahan-error" className="text-red-500 text-xs mt-1">{errors.reporterKelurahan}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan *</label>
                      <input
                        type="text"
                        name="reporterKecamatan"
                        value={form.reporterKecamatan}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.reporterKecamatan ? 'border-red-500' : 'border-gray-300'
                        }`}
                        aria-describedby={errors.reporterKecamatan ? "reporterKecamatan-error" : undefined}
                        required
                      />
                      {errors.reporterKecamatan && (
                        <p id="reporterKecamatan-error" className="text-red-500 text-xs mt-1">{errors.reporterKecamatan}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Lanjut →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 lg:p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Detail Kejadian
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Rescue/Penyelamatan *
                      </label>
                      <select
                        name="rescueType"
                        value={form.rescueType}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.rescueType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        aria-describedby={errors.rescueType ? "rescueType-error" : undefined}
                        required
                      >
                        <option value="">Pilih jenis penyelamatan...</option>
                        {rescueTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.rescueType && (
                        <p id="rescueType-error" className="text-red-500 text-xs mt-1">{errors.rescueType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Laporan *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Contoh: Pembongkaran kunci mobil di BTN Asal Mula"
                        aria-describedby={errors.title ? "title-error" : undefined}
                        required
                      />
                      {errors.title && (
                        <p id="title-error" className="text-red-500 text-xs mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Detail Kejadian *
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Jelaskan kronologi kejadian, kondisi saat ini, dan bantuan yang dibutuhkan secara detail..."
                        aria-describedby={errors.description ? "description-error" : undefined}
                        required
                      />
                      {errors.description && (
                        <p id="description-error" className="text-red-500 text-xs mt-1">{errors.description}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {form.description.length}/500 karakter
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informasi Tambahan
                      </label>
                      <textarea
                        name="additionalInfo"
                        value={form.additionalInfo}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
                        placeholder="Informasi lain yang perlu diketahui tim rescue..."
                        maxLength="300"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {form.additionalInfo.length}/300 karakter
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    ← Kembali
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Lanjut →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="bg-blue-50 p-4 lg:p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Lokasi Kejadian
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Alamat lengkap lokasi kejadian"
                        aria-describedby={errors.location ? "location-error" : undefined}
                        required
                      />
                      {errors.location && (
                        <p id="location-error" className="text-red-500 text-xs mt-1">{errors.location}</p>
                      )}
                    </div>
                    
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
                      <p>Lat: {form.latitude ? parseFloat(form.latitude).toFixed(6) : 'Klik pada peta'}</p>
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

                  <div className="bg-green-50 p-4 lg:p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Foto/Video Pendukung
                    </h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors mb-4">
                      <input
                        type="file"
                        name="images"
                        accept="image/jpeg,image/png,image/gif,video/mp4,video/mov"
                        onChange={handleInputChange}
                        multiple
                        className="hidden"
                        id="mediaUpload"
                        ref={fileInputRef}
                      />
                      <label htmlFor="mediaUpload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Klik untuk upload foto/video
                        </p>
                        <p className="text-xs text-gray-500">
                          Maksimal 10MB per file • Format: JPG, PNG, GIF, MP4, MOV
                        </p>
                      </label>
                    </div>

                    {previewImages.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                          File yang diupload ({previewImages.length}):
                        </p>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                                aria-label={`Hapus gambar ${index + 1}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Tips:</strong> Foto/video yang jelas akan membantu tim rescue mempersiapkan equipment yang tepat. Hindari foto yang mengandung informasi pribadi orang lain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex flex-col space-y-4">
                    <label className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        className="mt-1 text-green-500 focus:ring-green-500" 
                        required 
                      />
                      <span className="text-sm text-gray-700">
                        Saya menyatakan bahwa informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan. 
                        Saya bersedia dihubungi oleh tim Damkar untuk klarifikasi lebih lanjut.
                      </span>
                    </label>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <p className="text-sm text-blue-800">
                        <strong>📞 Penting:</strong> Pastikan nomor telepon Anda aktif. Tim rescue akan menghubungi Anda 
                        sebelum tiba di lokasi untuk koordinasi lebih lanjut.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        ← Kembali
                      </button>
                      <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isOnline}
                        className="flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                            <Shield className="w-4 h-4 mr-2" />
                            KIRIM LAPORAN RESCUE
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

      {/* Bottom padding for mobile CTA */}
      <div className="h-20 sm:h-0"></div>
    </div>
  );
};

export default StandardFormComponent;