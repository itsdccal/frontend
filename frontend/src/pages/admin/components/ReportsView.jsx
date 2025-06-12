import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Eye, Edit, Trash2, Plus, Filter, FileText, X, MapPin, Clock, RefreshCcw, CheckCircle, AlertCircle, Flame, Video, Upload
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import {
  getAllReports,
  createReport,
  updateReportStatus,
  deleteReport
} from '../../../services/api';

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

const rescueTypes = [
  { value: 'evakuasi_penyelamatan_hewan', label: 'Evakuasi/Penyelamatan Hewan' },
  { value: 'kebakaran', label: 'Kebakaran' },
  { value: 'layanan_lingkungan_dan_fasilitas_umum', label: 'Layanan Lingkungan & Fasilitas Umum' },
  { value: 'penyelamatan_non_hewan_dan_bantuan_teknis', label: 'Penyelamatan Non Hewan & Bantuan Teknis' },
];

const ReportsView = () => {
  const [reportsList, setReportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddReportForm, setShowAddReportForm] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');

  const [previewImage, setPreviewImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      latitude: '',
      longitude: '',
    },
    image: null,
    video: null,
    reporterInfo: {
      name: '',
      phone: '',
      address: '',
      rt: '',
      rw: '',
      kelurahan: '',
      kecamatan: '',
    },
    fireType: '',
    hasCasualties: false,
    urgencyLevel: 'rendah',
    rescueType: '',
    additionalInfo: '',
  });

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllReports();
      if (response && response.status === 'success' && Array.isArray(response.listReport)) {
        setReportsList(response.listReport);
      } else {
        console.warn('API response structure for reports is not as expected:', response);
        setReportsList([]);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(err.message || 'Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

    const getDisplayLocation = (report) => {
    if (!report || !report.location) return 'Lokasi tidak tersedia';
    if (typeof report.location === 'object' && report.location.address) {
        return report.location.address;
    }
    if (typeof report.location === 'string') {
        return report.location;
    }
    return 'Lokasi tidak tersedia';
    };

  const getStatusBadge = (status) => {
    const statusConfig = {
      menunggu: { color: 'yellow', icon: Clock, text: 'Menunggu' },
      diproses: { color: 'blue', icon: RefreshCcw, text: 'Diproses' },
      selesai: { color: 'green', icon: CheckCircle, text: 'Selesai' },
    };

    const config = statusConfig[status?.toLowerCase()] || { color: 'gray', icon: AlertCircle, text: 'Tidak Diketahui' };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Tanggal tidak valid';
    }
  };

const filteredReports = reportsList.filter(report => {
  const displayLocation = getDisplayLocation(report);

  const matchesSearch =
    (report._id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.reporterInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.reporterId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (displayLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.address?.toLowerCase().includes(searchTerm.toLowerCase()));

  const matchesStatus =
    statusFilter === 'all' || report.status?.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesStatus;
});

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
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

  const handleDeleteReport = async (reportId) => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus laporan ini?');
    if (!isConfirmed) return;

    setIsLoading(true);
    setError(null);
    try {
      await deleteReport(reportId);
      setReportsList(prevReports => prevReports.filter(report => report._id !== reportId));
      alert('Laporan berhasil dihapus!');
    } catch (err) {
      console.error('Failed to delete report:', err);
      setError(err.message || 'Gagal menghapus laporan.');
      alert(err.message || 'Gagal menghapus laporan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReportClick = () => {
    setReportForm({
      title: '',
      description: '',
      location: {
        address: '',
        latitude: '',
        longitude: '',
      },
      image: null,
      video: null,
      reporterInfo: {
        name: '',
        phone: '',
        address: '',
        rt: '',
        rw: '',
        kelurahan: '',
        kecamatan: '',
      },
      fireType: '',
      hasCasualties: false,
      urgencyLevel: 'rendah',
      rescueType: '',
      additionalInfo: '',
    });
    setSelectedReportType('');
    setPreviewImage(null);
    setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    setShowAddReportForm(true);
  };

  const handleAddReportChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
      setReportForm((prev) => ({ ...prev, [name]: file }));
    } else if (name === "video" && files && files[0]) {
      const file = files[0];
      setReportForm((prev) => ({ ...prev, [name]: file }));
    } else if (name.startsWith("reporterInfo.")) {
      const reporterInfoField = name.split(".")[1];
      setReportForm((prev) => ({
        ...prev,
        reporterInfo: {
          ...prev.reporterInfo,
          [reporterInfoField]: value,
        },
      }));
    } else if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setReportForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setReportForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLocationChange = useCallback(
    async (lat, lng, addressFromMap = null) => {
      setLocationLoading(true);
      try {
        let addressToSet = addressFromMap || reportForm.location.address; 
        if (!addressFromMap && lat && lng) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          addressToSet = data.display_name || "Alamat tidak ditemukan";
        }

        setReportForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: lat,
            longitude: lng,
            address: addressToSet,
          },
        }));

        if (formErrors.location) {
          setFormErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.location;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("Gagal mendapatkan alamat dari koordinat.");
        setReportForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: lat,
            longitude: lng,
            address: reportForm.location.address || "Gagal mendapatkan alamat", 
          },
        }));
      } finally {
        setLocationLoading(false);
      }
    },
    [formErrors, reportForm.location.address] 
  );

    const handleAddReportSubmit = async (event) => {
    event.preventDefault(); 
    if (!selectedReportType) return;

    setIsLoading(true);
    setError(null);

    try {
        const formData = new FormData();
        formData.append("reportType", selectedReportType);
        formData.append("title", reportForm.title);
        formData.append("description", reportForm.description);
        formData.append("name", reportForm.reporterInfo.name);
        formData.append("phone", reportForm.reporterInfo.phone);
        formData.append("address", reportForm.reporterInfo.address || "");
        formData.append("rt", reportForm.reporterInfo.rt || "");
        formData.append("rw", reportForm.reporterInfo.rw || "");
        formData.append("kelurahan", reportForm.reporterInfo.kelurahan || "");
        formData.append("kecamatan", reportForm.reporterInfo.kecamatan || "");

        const locationData = {
        address: reportForm.location.address,
        coordinates: {
            type: "Point",
            coordinates: [
            reportForm.location.longitude ? parseFloat(reportForm.location.longitude) : null,
            reportForm.location.latitude ? parseFloat(reportForm.location.latitude) : null,
            ],
        },
        };

        if (locationData.coordinates.coordinates[0] === null && locationData.coordinates.coordinates[1] === null) {
        locationData.coordinates = null; 
        }
        formData.append("location", JSON.stringify(locationData));

        if (reportForm.image) formData.append("image", reportForm.image);
        if (reportForm.video) formData.append("video", reportForm.video);

        if (selectedReportType === 'darurat') {
        formData.append("fireType", reportForm.fireType);
        formData.append("hasCasualties", reportForm.hasCasualties.toString());
        formData.append("urgencyLevel", reportForm.urgencyLevel);
        } else if (selectedReportType === 'biasa') {
        formData.append("rescueType", reportForm.rescueType);
        formData.append("additionalInfo", reportForm.additionalInfo || "");
        }

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await createReport(formData, headers);

        if (response && response.status === 'success' && response.message === 'Laporan berhasil dibuat') {
        alert('Laporan berhasil ditambahkan!');
        setShowAddReportForm(false);

        setReportForm({
            title: '',
            description: '',
            location: {
            address: '',
            latitude: '',
            longitude: '',
            },
            image: null,
            video: null,
            reporterInfo: {
            name: '',
            phone: '',
            address: '',
            rt: '',
            rw: '',
            kelurahan: '',
            kecamatan: '',
            },
            fireType: '',
            hasCasualties: false,
            urgencyLevel: 'rendah',
            rescueType: '',
            additionalInfo: '',
        });

        setSelectedReportType('');
        setPreviewImage(null);
        setFormErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";

        fetchReports();
        } else {
        fetchReports();
        }
    } catch (err) {
        console.error('Gagal menambahkan laporan:', err);
        setError(err.message || 'Gagal menambahkan laporan.');
        alert(err.message || 'Gagal menambahkan laporan.');
    } finally {
        setIsLoading(false);
    }
    };

  const removeFile = (type) => {
    if (type === 'image') {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(null);
      setReportForm((prev) => ({ ...prev, image: null }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (type === 'video') {
      setReportForm((prev) => ({ ...prev, video: null }));
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationChange(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        let errorMessage = "Gagal mendapatkan lokasi: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Izin lokasi ditolak";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia";
            break;
          case error.TIMEOUT:
            errorMessage += "Timeout mendapatkan lokasi";
            break;
          default:
            errorMessage += "Error tidak diketahui";
            break;
        }
        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };


  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Manajemen Laporan</h2>
          <button
            onClick={handleAddReportClick}
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
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div key={report._id} className="p-4 hover:bg-gray-50 active:bg-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500">#{report._id?.substring(0, 8)}</span>
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-2 text-base leading-tight">{report.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Pelapor:</span>
                        <span>{report.reporterInfo?.name || report.reporterId?.name || 'Anonim'}</span>
                      </div>
                      <div className="flex items-start text-sm text-gray-500">
                        <span className="font-medium mr-2">Lokasi:</span>
                        <span className="line-clamp-2">{getDisplayLocation(report)}</span>
                      </div>
                      {report.address && ( 
                        <div className="flex items-start text-sm text-gray-500">
                          <span className="font-medium mr-2">Alamat Lengkap:</span>
                          <span className="line-clamp-2">{report.address}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Tanggal:</span>
                        <span>{formatDateTime(report.createdAt)}</span>
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
                        onClick={() => handleOpenEditStatusModal(report)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
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
          <div className="hidden lg:block overflow-x-auto max-h-[400px]">
            <table className="w-full min-w-[700px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul & Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length > 0 ? (
                  filteredReports.reverse().map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{report._id?.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-3">{getDisplayLocation(report)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.reporterInfo?.name || report.reporterId?.name || 'Anonim'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(report.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetail(report)}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditStatusModal(report)}
                            className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                            title="Ubah Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                            title="Hapus Laporan"
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
      )}

      {/* Summary */}
      {!isLoading && !error && filteredReports.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total: <span className="font-medium text-gray-900">{filteredReports.length}</span> laporan</span>
          </div>
        </div>
      )}

      {/* Add Report Form Modal */}
      {showAddReportForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tambah Laporan Baru</h3>
              <button
                onClick={() => setShowAddReportForm(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddReportSubmit} className="space-y-4">
              {/* Pemilihan Jenis Laporan */}
              <div className="mb-4">
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Laporan *
                </label>
                <select
                  id="reportType"
                  name="reportType"
                  value={selectedReportType}
                  onChange={(e) => {
                    setSelectedReportType(e.target.value);
                    setReportForm(prev => ({
                      ...prev,
                      fireType: '',
                      hasCasualties: false,
                      urgencyLevel: 'rendah',
                      rescueType: '',
                      additionalInfo: '',
                    }));
                    if (formErrors.reportType) {
                      setFormErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.reportType;
                        return newErrors;
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.reportType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                  }`}
                  required
                >
                  <option value="">Pilih Jenis Laporan</option>
                  <option value="darurat">Darurat / Kebakaran</option>
                  <option value="biasa">Biasa / Rescue</option>
                </select>
                {formErrors.reportType && <p className="mt-1 text-sm text-red-500">{formErrors.reportType}</p>}
              </div>

              {selectedReportType && (
                <>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={reportForm.title}
                      onChange={handleAddReportChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                      }`}
                      required
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={reportForm.description}
                      onChange={handleAddReportChange}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                      }`}
                      required
                    ></textarea>
                    {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                  </div>

                  <div className="bg-red-50 p-4 lg:p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Lokasi Kejadian
                    </h3>

                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-3">
                      <MapContainer
                        center={
                          reportForm.location.latitude && reportForm.location.longitude
                            ? [reportForm.location.latitude, reportForm.location.longitude]
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
                          onChange={handleLocationChange}
                          position={
                            reportForm.location.latitude && reportForm.location.longitude
                              ? [reportForm.location.latitude, reportForm.location.longitude]
                              : null
                          }
                        />
                      </MapContainer>
                    </div>

                    {formErrors.location && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                        <p className="text-red-600 text-xs flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.location}
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
                        value={reportForm.location.address}
                        onChange={handleAddReportChange}
                        className={`w-full px-3 py-2 lg:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base ${
                          formErrors.location ? 'border-red-500' : 'border-gray-300' 
                        }`}
                        placeholder="Alamat lengkap lokasi kejadian"
                        required={!reportForm.location.latitude && !reportForm.location.longitude} 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="locationLatitude" className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input
                          type="text"
                          name="location.latitude"
                          id="locationLatitude"
                          value={reportForm.location.latitude}
                          onChange={handleAddReportChange}
                          className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base"
                          placeholder="Contoh: -5.1477"
                          disabled
                        />
                      </div>
                      <div>
                        <label htmlFor="locationLongitude" className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input
                          type="text"
                          name="location.longitude"
                          id="locationLongitude"
                          value={reportForm.location.longitude}
                          onChange={handleAddReportChange}
                          className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base"
                          placeholder="Contoh: 119.4327"
                          disabled
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center"
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <>
                          <RefreshCcw className="animate-spin w-4 h-4 mr-2" />
                          Mencari Lokasi...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          Gunakan Lokasi Saat Ini
                        </>
                      )}
                    </button>
                  </div>

                  {/* Form Khusus Tipe Darurat (Kebakaran) */}
                  {selectedReportType === 'darurat' && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                        <Flame className="w-4 h-4 mr-2" />
                        Detail Kebakaran
                      </h4>
                      <div className="mb-3">
                        <label htmlFor="fireType" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kebakaran *</label>
                        <select
                          id="fireType"
                          name="fireType"
                          value={reportForm.fireType}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.fireType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        >
                          <option value="">Pilih Jenis</option>
                          {fireTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        {formErrors.fireType && <p className="mt-1 text-sm text-red-500">{formErrors.fireType}</p>}
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apakah ada korban? *</label>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="hasCasualties"
                              value="true"
                              checked={reportForm.hasCasualties === true}
                              onChange={handleAddReportChange}
                              className="form-radio text-red-600"
                            />
                            <span className="ml-2 text-gray-700">Ya</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="hasCasualties"
                              value="false"
                              checked={reportForm.hasCasualties === false}
                              onChange={handleAddReportChange}
                              className="form-radio text-red-600"
                            />
                            <span className="ml-2 text-gray-700">Tidak</span>
                          </label>
                        </div>
                    </div>
                      <div className="mb-3">
                        <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700 mb-1">Tingkat Urgensi *</label>
                        <select
                          id="urgencyLevel"
                          name="urgencyLevel"
                          value={reportForm.urgencyLevel}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.urgencyLevel ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        >
                          <option value="rendah">Rendah</option>
                          <option value="sedang">Sedang</option>
                          <option value="tinggi">Tinggi</option>
                          <option value="kritis">Kritis</option>
                        </select>
                        {formErrors.urgencyLevel && <p className="mt-1 text-sm text-red-500">{formErrors.urgencyLevel}</p>}
                      </div>
                    </div>
                  )}

                  {/* Form Khusus Tipe Biasa (Rescue) */}
                  {selectedReportType === 'biasa' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Detail Penyelamatan
                      </h4>
                      <div className="mb-3">
                        <label htmlFor="rescueType" className="block text-sm font-medium text-gray-700 mb-1">Jenis Penyelamatan *</label>
                        <select
                          id="rescueType"
                          name="rescueType"
                          value={reportForm.rescueType}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.rescueType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        >
                          <option value="">Pilih Jenis</option>
                          {rescueTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        {formErrors.rescueType && <p className="mt-1 text-sm text-red-500">{formErrors.rescueType}</p>}
                      </div>
                      <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Informasi Tambahan</label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          value={reportForm.additionalInfo}
                          onChange={handleAddReportChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Media
                    </h4>
                    <div className="mb-3">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Gambar (Opsional)</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleAddReportChange}
                        ref={fileInputRef}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-red-700 hover:file:bg-violet-100"
                      />
                      {previewImage && (
                        <div className="mt-2 relative">
                          <img src={previewImage} alt="Preview" className="max-w-xs h-auto rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={() => removeFile('image')}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">Video (Opsional)</label>
                      <input
                        type="file"
                        id="video"
                        name="video"
                        accept="video/*"
                        onChange={handleAddReportChange}
                        ref={videoInputRef}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-red-700 hover:file:bg-violet-100"
                      />
                      {reportForm.video && (
                        <div className="mt-2 relative">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Video className="w-4 h-4 mr-1" />
                            {reportForm.video.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile('video')}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-opacity"
                            aria-label="Remove video"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informasi Pelapor */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Informasi Pelapor
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                        <input
                          type="text"
                          id="reporterName"
                          name="reporterInfo.name"
                          value={reportForm.reporterInfo.name}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.reporterName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        />
                        {formErrors.reporterName && <p className="mt-1 text-sm text-red-500">{formErrors.reporterName}</p>}
                      </div>
                      <div>
                        <label htmlFor="reporterPhone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon *</label>
                        <input
                          type="tel"
                          id="reporterPhone"
                          name="reporterInfo.phone"
                          value={reportForm.reporterInfo.phone}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.reporterPhone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        />
                        {formErrors.reporterPhone && <p className="mt-1 text-sm text-red-500">{formErrors.reporterPhone}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="reporterAddress" className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
                        <textarea
                          id="reporterAddress"
                          name="reporterInfo.address"
                          value={reportForm.reporterInfo.address}
                          onChange={handleAddReportChange}
                          rows="2"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.reporterAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        ></textarea>
                        {formErrors.reporterAddress && <p className="mt-1 text-sm text-red-500">{formErrors.reporterAddress}</p>}
                      </div>
                      <div>
                        <label htmlFor="reporterRt" className="block text-sm font-medium text-gray-700 mb-1">RT</label>
                        <input
                          type="text"
                          id="reporterRt"
                          name="reporterInfo.rt"
                          value={reportForm.reporterInfo.rt}
                          onChange={handleAddReportChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="reporterRw" className="block text-sm font-medium text-gray-700 mb-1">RW</label>
                        <input
                          type="text"
                          id="reporterRw"
                          name="reporterInfo.rw"
                          value={reportForm.reporterInfo.rw}
                          onChange={handleAddReportChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="reporterKelurahan" className="block text-sm font-medium text-gray-700 mb-1">Kelurahan *</label>
                        <input
                          type="text"
                          id="reporterKelurahan"
                          name="reporterInfo.kelurahan"
                          value={reportForm.reporterInfo.kelurahan}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.reporterKelurahan ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        />
                        {formErrors.reporterKelurahan && <p className="mt-1 text-sm text-red-500">{formErrors.reporterKelurahan}</p>}
                      </div>
                      <div>
                        <label htmlFor="reporterKecamatan" className="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
                        <input
                          type="text"
                          id="reporterKecamatan"
                          name="reporterInfo.kecamatan"
                          value={reportForm.reporterInfo.kecamatan}
                          onChange={handleAddReportChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.reporterKecamatan ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                          required
                        />
                        {formErrors.reporterKecamatan && <p className="mt-1 text-sm text-red-500">{formErrors.reporterKecamatan}</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddReportForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="animate-spin w-4 h-4 mr-2" />
                      Menambahkan...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Laporan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Detail Laporan #{selectedReport._id}</h3>
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
                        <p className="text-sm text-gray-900">{selectedReport.reporterInfo?.name || selectedReport.reporterId?.name}</p>
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
                        {selectedReport.category === 'evakuasi_penyelamatan_hewan'
                            ? 'Evakuasi/Penyelamatan Hewan'
                            : selectedReport.category === 'kebakaran'
                            ? 'Kebakaran'
                            : selectedReport.category === 'layanan_lingkungan_dan_fasilitas_umum'
                            ? 'Layanan Lingkungan & Fasilitas Umum'
                            : selectedReport.category === 'penyelamatan_non_hewan_dan_bantuan_teknis'
                            ? 'Penyelamatan Non Hewan & Bantuan Teknis'
                            : 'Kebakaran'}
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

      {/* Modal Edit Status */}
      {showEditStatusModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
    </div>
  );
};

export default ReportsView;