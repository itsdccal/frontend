import React, { useState } from 'react';
import { Search, Eye, Edit, Clock, MapPin, Phone, FileText, Plus } from 'lucide-react';

const StaffReportsView = ({ 
  filteredReports, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    urgency: 'sedang',
    reporter: {
      name: '',
      phone: '',
      email: '',
      address: ''
    }
  });

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleEditStatus = (report) => {
    setSelectedReport(report);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = (reportId, newStatus, notes) => {
    alert(`Status laporan ${reportId} berhasil diubah ke "${newStatus}"\nCatatan: ${notes}`);
    setShowStatusModal(false);
    setSelectedReport(null);
  };

  const handleAddReport = () => {
    setShowAddReportModal(true);
  };

  const handleSubmitNewReport = () => {
    alert(`Laporan baru "${newReport.title}" berhasil ditambahkan`);
    setShowAddReportModal(false);
    setNewReport({
      title: '',
      description: '',
      category: '',
      location: '',
      urgency: 'sedang',
      reporter: {
        name: '',
        phone: '',
        email: '',
        address: ''
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Laporan</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="in_progress">Dalam Progress</option>
            <option value="completed">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
          <button
            onClick={handleAddReport}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambahkan Laporan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports?.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500">{report.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status === 'pending' ? 'Menunggu' :
                       report.status === 'in_progress' ? 'Dalam Progress' :
                       report.status === 'completed' ? 'Selesai' : 'Ditolak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(report)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditStatus(report)}
                        className="text-green-600 hover:text-green-900"
                        title="Update Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Detail Laporan #{selectedReport.id}</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                  <p className="text-sm text-gray-900">{selectedReport.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <p className="text-sm text-gray-900">{selectedReport.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <p className="text-sm text-gray-900">{selectedReport.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status === 'pending' ? 'Menunggu' :
                       selectedReport.status === 'in_progress' ? 'Dalam Progress' :
                       selectedReport.status === 'completed' ? 'Selesai' : 'Ditolak'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedReport.location}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kontak Pelapor</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {selectedReport.reporter_phone}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedReport.created_at}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Update Status Laporan</h3>
                <button 
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Baru</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="pending">Menunggu</option>
                    <option value="in_progress">Dalam Progress</option>
                    <option value="completed">Selesai</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tambahkan catatan untuk perubahan status..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedReport.id, 'in_progress', 'Status diupdate')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">Tambah Laporan Baru</h3>
                <button 
                  onClick={() => setShowAddReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Informasi Laporan</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Judul Laporan *</label>
                      <input
                        type="text"
                        value={newReport.title}
                        onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan judul laporan"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Lengkap *</label>
                      <textarea
                        rows="4"
                        value={newReport.description}
                        onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Jelaskan detail laporan dengan lengkap"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                        <select
                          value={newReport.category}
                          onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="infrastruktur">Infrastruktur</option>
                          <option value="keamanan">Keamanan</option>
                          <option value="kebersihan">Kebersihan</option>
                          <option value="layanan">Layanan Publik</option>
                          <option value="kesehatan">Kesehatan</option>
                          <option value="pendidikan">Pendidikan</option>
                          <option value="lingkungan">Lingkungan</option>
                          <option value="transportasi">Transportasi</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kejadian *</label>
                      <textarea
                        rows="2"
                        value={newReport.location}
                        onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Alamat lengkap lokasi kejadian (Jalan, RT/RW, Kelurahan, Kecamatan)"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Data Pelapor</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap Pelapor *</label>
                      <input
                        type="text"
                        value={newReport.reporter.name}
                        onChange={(e) => setNewReport({
                          ...newReport, 
                          reporter: {...newReport.reporter, name: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama lengkap sesuai identitas"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
                      <input
                        type="tel"
                        value={newReport.reporter.phone}
                        onChange={(e) => setNewReport({
                          ...newReport, 
                          reporter: {...newReport.reporter, phone: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={newReport.reporter.email}
                        onChange={(e) => setNewReport({
                          ...newReport, 
                          reporter: {...newReport.reporter, email: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com (opsional)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Pelapor *</label>
                      <textarea
                        rows="3"
                        value={newReport.reporter.address}
                        onChange={(e) => setNewReport({
                          ...newReport, 
                          reporter: {...newReport.reporter, address: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Alamat lengkap pelapor (Jalan, RT/RW, Kelurahan, Kecamatan, Kota)"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-sm text-blue-800">
                          <strong>Catatan:</strong>
                          <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                            <li>Data pelapor akan dijaga kerahasiaannya</li>
                            <li>Informasi kontak digunakan untuk follow-up laporan</li>
                            <li>Laporan akan diverifikasi sebelum diproses</li>
                            <li>Field bertanda (*) wajib diisi</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowAddReportModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitNewReport}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Tambah Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffReportsView;