import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const mockReports = [
    {
      id: 'RPT001',
      type: 'kebakaran',
      title: 'Kebakaran Rumah Tinggal',
      location: 'Jl. Perintis Kemerdekaan No. 45',
      description: 'Kebakaran di rumah tinggal lantai 2, api menyebar cepat',
      status: 'resolved',
      urgency: 'high',
      createdAt: '2024-12-08T10:30:00',
      updatedAt: '2024-12-08T14:20:00',
      responseTime: '8 menit',
      damkarTeam: 'Unit 3 - Makassar Utara'
    },
    {
      id: 'RPT002',
      type: 'rescue',
      title: 'Penyelamatan Kucing dari Pohon',
      location: 'Kompleks BTN Minasa Upa',
      description: 'Kucing terjebak di pohon setinggi 5 meter, sudah 2 hari',
      status: 'in_progress',
      urgency: 'medium',
      createdAt: '2024-12-09T08:15:00',
      updatedAt: '2024-12-09T09:30:00',
      responseTime: '12 menit',
      damkarTeam: 'Unit 5 - Tim Rescue'
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports(mockReports);
        setFilteredReports(mockReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, typeFilter, reports]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: Clock, text: 'Menunggu' },
      in_progress: { color: 'blue', icon: RefreshCw, text: 'Diproses' },
      resolved: { color: 'green', icon: CheckCircle, text: 'Selesai' },
      cancelled: { color: 'red', icon: AlertCircle, text: 'Dibatalkan' }
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
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelReport = (reportId) => {
    if (confirm('Apakah Anda yakin ingin membatalkan laporan ini?')) {
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'cancelled', updatedAt: new Date().toISOString() }
            : report
        )
      );
      alert('Laporan berhasil dibatalkan');
    }
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
                  <option value="pending">Menunggu</option>
                  <option value="in_progress">Diproses</option>
                  <option value="resolved">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="kebakaran">Kebakaran</option>
                  <option value="rescue">Rescue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredReports.length > 0 ? (
              <div className="space-y-4 p-4 lg:p-6">
                {filteredReports.map((report) => {
                  const TypeIcon = getTypeIcon(report.type);
                  
                  return (
                    <div key={report.id} className="bg-gray-50 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${report.type === 'kebakaran' ? 'bg-red-100' : 'bg-blue-100'}`}>
                              <TypeIcon className={`w-5 h-5 ${report.type === 'kebakaran' ? 'text-red-600' : 'text-blue-600'}`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{report.title}</h3>
                                <div className="flex gap-2">
                                  {getStatusBadge(report.status)}
                                  {getUrgencyBadge(report.urgency)}
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <span className="font-medium w-16">ID:</span>
                                  <span className="text-blue-600 font-mono">{report.id}</span>
                                </div>
                                <div className="flex items-start">
                                  <MapPin className="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                                  <span>{report.location}</span>
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
                                  <span>Response: {report.responseTime}</span>
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
                            onClick={() => alert(`Detail laporan ${report.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </button>
                          {report.status === 'pending' && (
                            <button 
                              className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                              onClick={() => handleCancelReport(report.id)}
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Batalkan
                            </button>
                          )}
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
    </div>
  );
};

export default MyReports;