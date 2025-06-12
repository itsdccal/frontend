import React, { useState, useCallback, useEffect } from 'react';
import {
  getAllReports,
  updateReportStatus,
} from '../../../services/api';

import {
  Clock, CheckCircle, AlertCircle, Eye, Edit, X
} from 'lucide-react';

const StaffDashboardView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportsList, setReportsList] = useState([]); 
  const [selectedReport, setSelectedReport] = useState(null); 
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
  });
  const [dailyActivity, setDailyActivity] = useState({
    reportsToday: 0,
    completedToday: 0,
    pendingToday: 0,
  });

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllReports();

      if (response && response.status === 'success' && Array.isArray(response.listReport)) {
        setReportsList(response.listReport);

        const totalReports = response.listReport.length;
        const pendingReports = response.listReport.filter((report) => report.status === 'menunggu').length;
        const completedReports = response.listReport.filter((report) => report.status === 'selesai').length;

        setStats({
          totalReports,
          pendingReports,
          completedReports,
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const reportsCreatedToday = response.listReport.filter(report => {
          const createdAt = new Date(report.createdAt);
          return createdAt >= today; 
        });

        const completedToday = response.listReport.filter(report => {
          if (report.status === 'selesai' && report.updatedAt) {
            const updatedAt = new Date(report.updatedAt);
            updatedAt.setHours(0, 0, 0, 0); 
            return updatedAt >= today; 
          }
          return false;
        }).length;

        const pendingToday = reportsCreatedToday.filter(report => report.status === 'menunggu').length;

        let totalResponseTime = 0;
        let completedCountForResponseTime = 0;
        response.listReport.forEach(report => {
            if (report.status === 'selesai' && report.createdAt && report.updatedAt) { 
                const created = new Date(report.createdAt);
                const updated = new Date(report.updatedAt); 
                const timeDiff = updated.getTime() - created.getTime(); 
                totalResponseTime += timeDiff;
                completedCountForResponseTime++;
            }
        });

        setDailyActivity({
          reportsToday: reportsCreatedToday.length,
          completedToday: completedToday, 
          pendingToday: pendingToday, 
        });

      } else {
        console.warn('API response structure for reports is not as expected:', response);
        setReportsList([]);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(err.message || 'Gagal memuat laporan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'diproses':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getDisplayLocation = (report) => {
    if (typeof report.location === 'object' && report.location.address) {
      return report.location.address;
    }
    if (typeof report.location === 'string') {
      return report.location;
    }
    return 'N/A';
  };

  const handleViewDetail = async (reportId) => {
    setIsLoading(true); 
    try {
      const report = reportsList.find(r => r._id === reportId); 

      if (report) {
        setSelectedReport(report);
        setShowDetailModal(true);
      } else {
        alert("Laporan tidak ditemukan.");
      }
    } catch (err) {
      console.error("Gagal mengambil detail laporan:", err);
      alert("Gagal memuat detail laporan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null); 
  };

    const handleOpenEditStatusModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatusSubmit = async () => {
    if (!selectedReport || !newStatus) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await updateReportStatus(selectedReport._id, { status: newStatus });

      if (response && response.message === 'Status laporan berhasil diperbarui') {
        const updatedId = selectedReport._id;
        const updatedStatus = newStatus;

        setReportsList(prevReports =>
          prevReports.map(report =>
            report._id === updatedId ? { ...report, status: updatedStatus } : report
          )
        );

        setSelectedReport(prev => {
          if (prev && prev._id === updatedId) {
            return { ...prev, status: updatedStatus };
          }
          return prev;
        });

        alert('Status laporan berhasil diperbarui!');
        setShowEditStatusModal(false);
      } else {
        fetchReports();
      }
    } catch (err) {
      console.error('Gagal memperbarui status laporan:', err);
      setError(err.message || 'Gagal memperbarui status laporan.');
      alert(err.message || 'Gagal memperbarui status laporan.');
    } finally {
      setIsLoading(false);
    }
  };


  const staffStatsArray = [
    {
      title: 'Total Laporan',
      value: stats.totalReports, 
      color: 'blue',
      icon: AlertCircle,
    },
    {
      title: 'Menunggu',
      value: stats.pendingReports,
      color: 'yellow',
      icon: Clock,
    },
    {
      title: 'Selesai',
      value: stats.completedReports,
      color: 'green',
      icon: CheckCircle,
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {staffStatsArray.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold">Laporan Terbaru</h3>
            <span className="text-xs sm:text-sm text-gray-500">Butuh Tindakan</span>
          </div>

          <div className="space-y-3">
            {reportsList && reportsList.length > 0  ? (
              reportsList.slice(-3).reverse().map((report) => (
                <div key={report._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm flex-1 pr-2">{report.title}</h4>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {getDisplayLocation(report)}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status === 'menunggu' ? 'Menunggu' :
                          report.status === 'diproses' ? 'Diproses' :
                          report.status === 'selesai' ? 'Selesai' : report.status}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(report._id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditStatusModal(report)} 
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Edit Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 text-sm truncate pr-2">{report.title}</h4>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {getDisplayLocation(report)}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status === 'menunggu' ? 'Menunggu' :
                            report.status === 'diproses' ? 'Diproses' :
                            report.status === 'selesai' ? 'Selesai' : report.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                      <button
                        onClick={() => handleViewDetail(report._id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Tidak ada laporan terbaru yang membutuhkan tindakan</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Activity */}
        <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Aktivitas Harian</h3>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base">Laporan Hari Ini</span>
              </div>
              <span className="font-semibold text-blue-600 text-sm sm:text-base">
                {dailyActivity.reportsToday}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base">Laporan Selesai Hari Ini</span>
              </div>
              <span className="font-semibold text-green-600 text-sm sm:text-base">
                {dailyActivity.completedToday}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base">Laporan Menunggu Hari Ini</span>
              </div>
              <span className="font-semibold text-yellow-600 text-sm sm:text-base">
                {dailyActivity.pendingToday}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Report Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 mb-0">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Detail Laporan #{selectedReport._id?.substring(0, 8)}</h3>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedReport.title || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <p className="text-sm text-gray-900 leading-relaxed">{selectedReport.description || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kejadian</label>
                    <p className="text-sm text-gray-900">{getDisplayLocation(selectedReport)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan</label>
                      <p className="text-sm text-gray-900">{formatDateTime(selectedReport.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Reporter Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Informasi Pelapor</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nama Pelapor</label>
                        <p className="text-sm text-gray-900">{selectedReport.reporterInfo?.name || selectedReport.reporterId?.name || 'Anonim'}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Kontak</label>
                        <p className="text-sm text-gray-900">
                          {selectedReport.reporterInfo?.phone || selectedReport.reporterId?.phone || 'Tidak tersedia'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                        <p className="text-sm text-gray-900">
                          {selectedReport.reporterInfo?.email || selectedReport.reporterId?.email || 'Tidak tersedia'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Details */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="text-sm font-medium text-red-900 mb-3">Detail Kejadian</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-red-700 mb-1">Jenis Kejadian</label>
                        <p className="text-sm text-red-900">
                          {selectedReport.incidentType || 'Kebakaran'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-red-700 mb-1">Tingkat Bahaya</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedReport.urgencyLevel === 'kritis' ? 'bg-red-100 text-red-800' :
                          selectedReport.urgencyLevel === 'tinggi' ? 'bg-orange-100 text-orange-800' :
                          selectedReport.urgencyLevel === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedReport.urgencyLevel || 'Sedang'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-red-700 mb-1">Korban Jiwa</label>
                        <p className="text-sm text-red-900">
                          {selectedReport.hasCasualties ? 'Ada korban' : 'Tidak ada korban'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                  {(selectedReport.photoUrl || selectedReport.videoUrl) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Lampiran Media</h4>
                      {selectedReport.photoUrl && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Foto</label>
                          <a href={selectedReport.photoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block">
                            Lihat Foto
                          </a>
                          <img src={selectedReport.photoUrl} alt="Foto Laporan" className="mt-2 max-w-full h-auto rounded-md" />
                        </div>
                      )}
                      {selectedReport.videoUrl && (
                        <div className="mt-4">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Video</label>
                          <a href={selectedReport.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block">
                            Lihat Video
                          </a>
                          <video src={selectedReport.videoUrl} controls className="mt-2 max-w-full h-auto rounded-md"></video>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Response Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline Penanganan</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Laporan Diterima</p>
                      <p className="text-xs text-gray-500">{formatDateTime(selectedReport.createdAt)}</p>
                    </div>
                  </div>

                  {selectedReport.status !== 'menunggu' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Dalam Penanganan</p>
                        <p className="text-xs text-gray-500">
                          {selectedReport.processedAt ? formatDateTime(selectedReport.processedAt) : 'Sedang diproses'}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedReport.status === 'selesai' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Penanganan Selesai</p>
                        <p className="text-xs text-gray-500">
                          {selectedReport.completedAt ? formatDateTime(selectedReport.completedAt) : 'Baru saja selesai'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedReport.additionalInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">{selectedReport.additionalInfo}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => alert('Fitur ekspor laporan sedang dikembangkan.')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    📄 Export
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenEditStatusModal(selectedReport);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    ✏️ Edit Status
                  </button>
                  <button
                    onClick={handleCloseDetailModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {showEditStatusModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 mb-0">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Ubah Status Laporan</h3>
              <button
                onClick={() => setShowEditStatusModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4 text-gray-700">Laporan: <span className="font-semibold">{selectedReport.title}</span></p>
            <div className="mb-4">
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">Status Baru</label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="menunggu">Menunggu</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditStatusModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStatusSubmit}
                className={`px-4 py-2 bg-green-500 text-white rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                disabled={isLoading}
              >
                {isLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Error Indicators */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-lg">Memuat data...</div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-lg">{error}</div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboardView;