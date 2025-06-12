import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Flame, ArrowLeft, Clock, Phone, MapPin, Camera, AlertTriangle, CheckCircle, X, AlertCircle } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPicker({ onChange, position }) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (map && position && position[0] != null && position[1] != null) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

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

export default function QuickForm({
  form,
  previewImage,
  mlValidation,
  isSubmitting,
  errors,
  isOnline,
  locationLoading,
  userDataError,
  fileInputRef,
  onInputChange, 
  onLocationChange,
  onSubmit,
  getCurrentLocation,
  removeImage,
  applySuggestion,
}) {
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
            <form onSubmit={onSubmit} className="space-y-6 lg:space-y-8">
              {userDataError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <p className="font-bold">Error Memuat Data Pengguna:</p>
                  <p className="text-sm">{userDataError}</p>
                </div>
              )}

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
                    <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="reporterInfo.name" 
                      id="reporterName"
                      value={form.reporterInfo.name}
                      onChange={onInputChange}
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
                    <label htmlFor="reporterPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon/WA *
                    </label>
                    <input
                      type="tel"
                      name="reporterInfo.phone"
                      id="reporterPhone"
                      value={form.reporterInfo.phone}
                      onChange={onInputChange} 
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                        errors.reporterPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: 081234567890"
                      aria-describedby={errors.reporterPhone ? "reporterPhone-error" : undefined}
                      required
                    />
                    {errors.reporterPhone && (
                      <p id="reporterPhone-error" className="text-red-500 text-xs mt-1">{errors.reporterPhone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Laporan *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={form.title}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: Kebakaran di BTN Asal Mula"
                      aria-describedby={errors.title ? "title-error" : undefined}
                      required
                    />
                    {errors.title && (
                      <p id="title-error" className="text-red-500 text-xs mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fireType" className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kebakaran *
                    </label>
                    <select
                      name="fireType"
                      id="fireType"
                      value={form.fireType}
                      onChange={onInputChange} 
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

                  <div className="lg:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Singkat *
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={form.description}
                      onChange={onInputChange}
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
                    <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat Urgensi
                    </label>
                    <select
                      name="urgencyLevel"
                      id="urgencyLevel"
                      value={form.urgencyLevel}
                      onChange={onInputChange} 
                      className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base"
                    >
                      <option value="rendah">Rendah - Api kecil, terkendali</option> 
                      <option value="sedang">Sedang - Perlu perhatian</option>
                      <option value="tinggi">Tinggi - Api besar, menyebar</option>
                      <option value="kritis">Kritis - Ada korban/bahaya</option>
                    </select>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="hasCasualties"
                      checked={form.hasCasualties}
                      onChange={onInputChange}
                      className="mt-1 text-red-500 focus:ring-red-500"
                      id="casualties"
                    />
                    <label htmlFor="casualties" className="text-sm font-medium text-gray-700">
                      Ada korban terluka atau terjebak
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Jika ada korban, sebaiknya hubungi 113 segera
                      </p>
                    </label>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Kejadian (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={onInputChange}
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
                      form.location.latitude && form.location.longitude
                        ? [form.location.latitude, form.location.longitude]
                        : [-5.1477, 119.4327] 
                    }
                    zoom={13}
                    style={{ height: "250px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationPicker
                      onChange={onLocationChange} 
                      position={
                        form.location.latitude && form.location.longitude
                          ? [form.location.latitude, form.location.longitude]
                          : null
                      }
                    />
                  </MapContainer>
                </div>

                {(errors.location || errors.coordinates) && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                    <p className="text-red-600 text-xs flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location?.address || errors.coordinates || errors.location} 
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lokasi Kejadian *
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    id="locationAddress"
                    value={form.location.address}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm lg:text-base ${
                      errors.location?.address ? 'border-red-500' : 'border-gray-300' 
                    }`}
                    placeholder="Alamat lengkap lokasi kebakaran"
                    aria-describedby={errors.location?.address ? "location-address-error" : undefined}
                    required
                  />
                  {errors.location?.address && (
                    <p id="location-address-error" className="text-red-500 text-xs mt-1">
                      {errors.location.address}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-600 bg-white p-3 rounded mb-3">
                  <p className="font-medium mb-1">Koordinat:</p>
                  <p>Lat: {form.location.latitude ? parseFloat(form.location.latitude).toFixed(6) : 'Tap pada peta'}</p>
                  <p>Lng: {form.location.longitude ? parseFloat(form.location.longitude).toFixed(6) : 'untuk pilih lokasi'}</p>
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
                  <label htmlFor="acknowledgement" className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="acknowledgement"
                      className="mt-1 text-orange-500 focus:ring-orange-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      Saya menyatakan bahwa informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan.
                      Saya bersedia dihubungi oleh tim Damkar untuk koordinasi lebih lanjut.
                    </span>
                  </label>

                  {(form.hasCasualties || form.urgencyLevel === 'kritis' || mlValidation?.isEmergency) && (
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
                      **📞 Penting:** Pastikan nomor telepon Anda aktif. Tim Damkar akan menghubungi Anda
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
}