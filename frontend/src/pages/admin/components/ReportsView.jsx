import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Plus, Filter, FileText, X } from 'lucide-react';

const ReportsView = ({ 
  filteredReports, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'diproses': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'menunggu': return 'Menunggu';
      case 'diproses': return 'Diproses';
      case 'selesai': return 'Selesai';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleEdit = (report) => {
    alert(`Edit laporan ${report.id}`);
  };

  const handleDelete = (reportId) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      alert(`Laporan ${reportId} dihapus`);
    }
  };

  const handleAddReport = () => {
    alert('Tambah laporan baru');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Manajemen Laporan</h2>
          <button
            onClick={handleAddReport}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Laporan
          </button>
        </div>
        
        {/* Mobile Search & Filter Toggle */}
        <div className="flex flex-col space-y-3 sm:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
          </button>
          
          {showFilters && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          )}
        </div>

        {/* Desktop Search & Filter */}
        <div className="hidden sm:flex sm:flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64 lg:w-80"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto lg:w-48"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {filteredReports && filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-gray-50 active:bg-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">#{report.id}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2 text-base leading-tight">{report.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Pelapor:</span>
                      <span>{report.reporter}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-500">
                      <span className="font-medium mr-2">Lokasi:</span>
                      <span className="line-clamp-2">{report.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Tanggal:</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetail(report)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </button>
                    <button
                      onClick={() => handleEdit(report)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-base font-medium">Tidak ada laporan ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports && filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{report.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      <div className="text-sm text-gray-500">{report.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.reporter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetail(report)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <FileText className="w-12 h-12 text-gray-400" />
                      <p className="text-base font-medium">Tidak ada laporan ditemukan</p>
                      <p className="text-sm text-gray-400">Coba ubah filter pencarian</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredReports && filteredReports.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total: <span className="font-medium text-gray-900">{filteredReports.length}</span> laporan</span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Detail Laporan #{selectedReport.id}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedReport.status)}`}>
                    {getStatusText(selectedReport.status)}
                  </span>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
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
                    <p className="text-sm text-gray-900 font-medium">{selectedReport.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <p className="text-sm text-gray-900 leading-relaxed">{selectedReport.description}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <p className="text-sm text-gray-900">{selectedReport.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedReport.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Laporan</label>
                      <p className="text-sm text-gray-900 font-mono">#{selectedReport.id}</p>
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
                        <p className="text-sm text-gray-900">{selectedReport.reporter}</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Kontak</label>
                        <p className="text-sm text-gray-900">
                          {selectedReport.reporterPhone || 'Tidak tersedia'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                        <p className="text-sm text-gray-900">
                          {selectedReport.reporterEmail || 'Tidak tersedia'}
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
                          {selectedReport.casualties ? 'Ada korban' : 'Tidak ada korban'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Evidence */}
              {(selectedReport.photoUrl || selectedReport.videoUrl) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Bukti Kejadian</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedReport.photoUrl && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Foto</label>
                        <img
                          src={selectedReport.photoUrl}
                          alt="Bukti Laporan"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    
                    {selectedReport.videoUrl && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Video</label>
                        <video
                          controls
                          src={selectedReport.videoUrl}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Response Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline Penanganan</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Laporan Diterima</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedReport.createdAt)}</p>
                    </div>
                  </div>
                  
                  {selectedReport.status !== 'menunggu' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Dalam Penanganan</p>
                        <p className="text-xs text-gray-500">
                          {selectedReport.processedAt || 'Sedang diproses'}
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
                          {selectedReport.completedAt || 'Baru saja selesai'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedReport.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">{selectedReport.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => alert('Print laporan')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={() => alert('Export laporan')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    📄 Export
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedReport);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    ✏️ Edit Status
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
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
    </div>
  );
};

export default ReportsView;