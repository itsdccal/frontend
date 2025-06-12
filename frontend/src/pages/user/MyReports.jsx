import { useState } from 'react'; 
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  MapPin,
  Eye,
  AlertCircle,
  CheckCircle,
  Flame,
  Shield,
  Phone,
  Calendar,
  RefreshCw,
  Plus,
  X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { myReportsPresenter } from './MyReportsPresenter'; 

const MyReports = () => {
  const {
    filteredReports,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    error,
    refreshReports
  } = myReportsPresenter();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleShowDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      menunggu: { color: 'yellow', icon: Clock, text: 'Menunggu' },
      diproses: { color: 'blue', icon: RefreshCw, text: 'Diproses' },
      selesai: { color: 'green', icon: CheckCircle, text: 'Selesai' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      low: { color: 'gray', text: 'Rendah' },
      medium: { color: 'yellow', text: 'Sedang' },
      high: { color: 'red', text: 'Tinggi' },
      critical: { color: 'red', text: 'Kritis' }
    };

    const config = urgencyConfig[urgency] || urgencyConfig.medium;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'kebakaran' ? Flame : Shield;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLocation = (location) => {
    if (!location) return 'Lokasi tidak tersedia';
    return location.address || `${location.coordinates?.[0]}, ${location.coordinates?.[1]}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[64px]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Memuat laporan Anda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[64px]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="font-semibold text-lg mb-2">Terjadi Kesalahan!</p>
              <p className="mb-4">{error}</p>
              <button
                onClick={refreshReports}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[64px]">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center">
                <ClipboardList className="w-6 h-6 lg:w-8 lg:h-8 mr-3 text-blue-500" />
                Laporan Saya
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola dan pantau status laporan yang telah Anda kirim
              </p>
            </div>
            <Link
              to="/"
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Laporan Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID, judul, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="darurat">Kebakaran</option>
                  <option value="biasa">Rescue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredReports.length > 0 ? (
              <div className="space-y-4 p-4 lg:p-6">
                {filteredReports.map((report) => {
                  const TypeIcon = getTypeIcon(report.reportType); 

                  return (
                    <div key={report._id || report.id} className="bg-gray-50 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${report.reportType === 'kebakaran' ? 'bg-red-100' : 'bg-blue-100'}`}>
                              <TypeIcon className={`w-5 h-5 ${report.reportType === 'kebakaran' ? 'text-red-600' : 'text-blue-600'}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{report.title}</h3>
                                <div className="flex gap-2">
                                  {getStatusBadge(report.status)}
                                  {getUrgencyBadge(report.urgencyLevel)} 
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <span className="font-medium w-16">ID:</span>
                                  <span className="text-blue-600 font-mono">{report._id}</span>
                                </div>
                                <div className="flex items-start">
                                  <MapPin className="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                                  <span>{formatLocation(report.location)}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0">📝</span>
                                  <span>{report.description}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>Dibuat: {formatDate(report.createdAt)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>Response: {report.responseTime || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-3 h-3 mr-1">🚒</span>
                                  <span>{report.damkarTeam || 'Belum ditugaskan'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            onClick={() => handleShowDetail(report)} 
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan ditemukan</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Coba ubah filter pencarian Anda'
                    : 'Anda belum membuat laporan apapun'
                  }
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Laporan Pertama
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-500" />
            Informasi Kontak Darurat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="font-medium text-red-800 mb-1">Emergency Call</div>
              <div className="text-red-600 text-lg font-bold">113</div>
              <div className="text-red-600 text-xs">Untuk situasi mengancam nyawa</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="font-medium text-blue-800 mb-1">Call Center</div>
              <div className="text-blue-600 text-lg font-bold">(0411) 123-456</div>
              <div className="text-blue-600 text-xs">Informasi & konsultasi</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-medium text-green-800 mb-1">WhatsApp</div>
              <div className="text-green-600 text-lg font-bold">0812-3456-7890</div>
              <div className="text-green-600 text-xs">Chat & update laporan</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">Catatan Penting:</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Status laporan diperbarui secara otomatis oleh sistem</li>
                <li>Anda akan menerima notifikasi SMS/WhatsApp untuk setiap update</li>
                <li>Untuk laporan urgent, tim Damkar akan menghubungi langsung</li>
                <li>Pastikan nomor telepon Anda selalu aktif</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showDetailModal && selectedReport && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto my-8 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Detail Laporan: {selectedReport.title}</h2>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p><span className="font-semibold">ID Laporan:</span> {selectedReport._id}</p>
                  <p><span className="font-semibold">Status:</span> {getStatusBadge(selectedReport.status)}</p>
                  <p><span className="font-semibold">Tingkat Urgensi:</span> {getUrgencyBadge(selectedReport.urgencyLevel)}</p>
                  <p><span className="font-semibold">Jenis Laporan:</span> {selectedReport.reportType}</p>
                  <p><span className="font-semibold">Kategori:</span> {selectedReport.category.replace(/_/g, ' ') }</p>
                </div>
                <div>
                  <p><span className="font-semibold">Dibuat Pada:</span> {formatDate(selectedReport.createdAt)}</p>
                  <p><span className="font-semibold">Terakhir Diperbarui:</span> {formatDate(selectedReport.updatedAt)}</p>
                  <p><span className="font-semibold">Tim Damkar:</span> {selectedReport.damkarTeam || 'Belum ditugaskan'}</p>
                  <p><span className="font-semibold">Waktu Respon:</span> {selectedReport.responseTime || 'N/A'}</p>
                  <p><span className="font-semibold">Ada Korban:</span> {selectedReport.hasCasualties ? 'Ya' : 'Tidak'}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Lokasi:</p>
                <p className="text-gray-700">
                  <MapPin className="inline-block w-4 h-4 mr-1 text-gray-500" />
                  {formatLocation(selectedReport.location)}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">Deskripsi:</p>
                <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
              </div>

              {selectedReport.photoUrl && (
                <div>
                  <p className="font-semibold mb-1">Foto Laporan:</p>
                  <img
                    src={selectedReport.photoUrl}
                    alt="Bukti Laporan"
                    className="w-full h-auto max-h-80 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {selectedReport.videoUrl && (
                <div>
                  <p className="font-semibold mb-1">Video Laporan:</p>
                  <video
                    controls
                    src={selectedReport.videoUrl}
                    className="w-full h-auto max-h-80 object-contain rounded-lg border border-gray-200"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 text-right">
              <button
                onClick={handleCloseDetailModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;