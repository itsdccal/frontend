import React, { useState } from 'react';
import { Search, UserPlus, Eye, Edit, Trash2, X, Shield, Mail, Phone, MapPin, Calendar, Award, AlertCircle, CheckCircle, User, Building } from 'lucide-react';

const UsersView = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showAddPetugasForm, setShowAddPetugasForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [petugasForm, setPetugasForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    kelurahan: '',
    kecamatan: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    kelurahan: '',
    kecamatan: ''
  });

  const [staffList, setStaffList] = useState([
    {
      id: 'STF001',
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@damkar.makassar.go.id',
      phone: '0811111111',
      address: 'Pos Damkar Pusat, Jl. Urip Sumoharjo No. 5, Makassar',
      kelurahan: 'Panakkukang',
      kecamatan: 'Panakkukang',
      role: 'petugas',
      status: 'active',
      reports: 25,
      joinDate: '2024-01-15',
      lastActive: '2025-06-11 08:30',
      specialization: 'Kebakaran & Evakuasi',
      experience: '3 tahun'
    },
    {
      id: 'STF002',
      name: 'Siti Rahmawati',
      email: 'siti.rahmawati@damkar.makassar.go.id',
      phone: '0822222222',
      address: 'Pos Damkar Timur, Jl. Perintis Kemerdekaan, Makassar',
      kelurahan: 'Tamalate',
      kecamatan: 'Tamalate',
      role: 'petugas',
      status: 'active',
      reports: 18,
      joinDate: '2024-02-10',
      lastActive: '2025-06-11 10:15',
      specialization: 'Emergency Response',
      experience: '2 tahun'
    },
    {
      id: 'STF003',
      name: 'Budi Hartono',
      email: 'budi.hartono@damkar.makassar.go.id',
      phone: '0833333333',
      address: 'Pos Damkar Barat, Jl. AP Pettarani, Makassar',
      kelurahan: 'Rappocini',
      kecamatan: 'Rappocini',
      role: 'petugas',
      status: 'inactive',
      reports: 32,
      joinDate: '2023-01-20',
      lastActive: '2025-06-08 16:45',
      specialization: 'Rescue & Medical',
      experience: '5 tahun'
    },
    {
      id: 'STF004',
      name: 'Dewi Permata',
      email: 'dewi.permata@damkar.makassar.go.id',
      phone: '0844444444',
      address: 'Pos Damkar Selatan, Jl. Hertasning, Makassar',
      kelurahan: 'Samata',
      kecamatan: 'Somba Opu',
      role: 'petugas',
      status: 'active',
      reports: 12,
      joinDate: '2024-05-01',
      lastActive: '2025-06-11 07:20',
      specialization: 'Koordinasi & Komunikasi',
      experience: '1 tahun'
    }
  ]);

  const getActiveColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getPerformanceColor = (reports) => {
    if (reports >= 25) return 'text-green-600';
    if (reports >= 15) return 'text-blue-600';
    return 'text-gray-600';
  };

  const generateInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         staff.phone.includes(userSearchTerm);
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (staff) => {
    setSelectedStaff(staff);
    setShowDetailModal(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      address: staff.address,
      kelurahan: staff.kelurahan,
      kecamatan: staff.kecamatan
    });
    setShowEditModal(true);
  };

  const handleDelete = async (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    if (window.confirm(`Apakah Anda yakin ingin menghapus petugas "${staff.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        setStaffList(prev => prev.filter(staff => staff.id !== staffId));
        alert('Petugas berhasil dihapus!');
      } catch (error) {
        alert('Gagal menghapus petugas');
      }
    }
  };

  const handleToggleStatus = async (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
    
    if (window.confirm(`Apakah Anda yakin ingin ${action} petugas "${staff.name}"?`)) {
      try {
        setStaffList(prev => 
          prev.map(staff => 
            staff.id === staffId 
              ? { ...staff, status: newStatus, lastActive: new Date().toLocaleString('id-ID') }
              : staff
          )
        );
        alert(`Status petugas berhasil diubah menjadi ${newStatus}!`);
      } catch (error) {
        alert('Gagal mengubah status');
      }
    }
  };

  const handleUpdateStaff = async () => {
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      alert('Harap isi semua field yang diperlukan');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStaffList(prev => 
        prev.map(staff => 
          staff.id === selectedStaff.id 
            ? { ...staff, ...editForm }
            : staff
        )
      );
      
      setShowEditModal(false);
      alert('Data petugas berhasil diperbarui!');
    } catch (error) {
      alert('Gagal memperbarui data petugas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPetugas = async (e) => {
    e.preventDefault();
    
    if (!petugasForm.name.trim() || !petugasForm.email.trim() || !petugasForm.password.trim()) {
      alert('Harap isi semua field yang diperlukan');
      return;
    }

    if (petugasForm.password.length < 6) {
      alert('Password minimal 6 karakter');
      return;
    }

    // Check if email already exists
    if (staffList.some(staff => staff.email === petugasForm.email)) {
      alert('Email sudah terdaftar, gunakan email lain');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPetugas = {
        id: `STF${String(staffList.length + 1).padStart(3, '0')}`,
        ...petugasForm,
        role: 'petugas',
        status: 'active',
        reports: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toLocaleString('id-ID'),
        specialization: 'General',
        experience: 'Baru'
      };
      
      setStaffList([...staffList, newPetugas]);
      
      setPetugasForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        kelurahan: '',
        kecamatan: ''
      });
      setShowAddPetugasForm(false);
      alert('Petugas berhasil ditambahkan!');
    } catch (error) {
      alert('Gagal menambahkan petugas');
    } finally {
      setIsLoading(false);
    }
  };

  const DetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Detail Petugas</h3>
              <p className="text-gray-600 mt-1">Informasi lengkap data petugas</p>
            </div>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {selectedStaff && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-2xl font-bold">
                          {generateInitials(selectedStaff.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h4>
                        <p className="text-gray-600 font-mono text-sm mt-1">{selectedStaff.id}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-semibold rounded-full border ${getActiveColor(selectedStaff.status)}`}>
                            {selectedStaff.status === 'active' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                            <span className="capitalize">{selectedStaff.status}</span>
                          </div>
                          <span className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            <Shield className="w-4 h-4" />
                            <span className="capitalize">{selectedStaff.role}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-semibold text-gray-900 border-b pb-2">Informasi Kontak</h5>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{selectedStaff.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{selectedStaff.phone}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                          <div className="flex items-start space-x-2 bg-white px-3 py-2 rounded border">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            <span className="text-gray-900">{selectedStaff.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-semibold text-gray-900 border-b pb-2">Informasi Lokasi</h5>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{selectedStaff.kelurahan}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{selectedStaff.kecamatan}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bergabung Sejak</label>
                          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded border">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{new Date(selectedStaff.joinDate).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-3">Statistik Performance</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Total Laporan</span>
                        <span className={`text-2xl font-bold ${getPerformanceColor(selectedStaff.reports)}`}>
                          {selectedStaff.reports}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Pengalaman</span>
                        <span className="font-semibold text-blue-900">{selectedStaff.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Spesialisasi</span>
                        <span className="font-semibold text-blue-900 text-right text-sm">{selectedStaff.specialization}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h5 className="font-semibold text-gray-900 mb-3">Aktivitas Terakhir</h5>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 text-sm">{selectedStaff.lastActive}</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h5 className="font-semibold text-yellow-900 mb-2">Rating Performance</h5>
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        {selectedStaff.reports >= 25 ? 'Excellent' : 
                         selectedStaff.reports >= 15 ? 'Good' : 'Average'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleToggleStatus(selectedStaff.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStaff.status === 'active' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selectedStaff.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedStaff);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Edit Data Petugas</h3>
            <button 
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan nomor telepon"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                value={editForm.address}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                <input
                  type="text"
                  value={editForm.kelurahan}
                  onChange={(e) => setEditForm({...editForm, kelurahan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Kelurahan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={editForm.kecamatan}
                  onChange={(e) => setEditForm({...editForm, kecamatan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Kecamatan"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStaff}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AddPetugasModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tambah Petugas Baru</h3>
            <button 
              onClick={() => setShowAddPetugasForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddPetugas} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={petugasForm.name}
                onChange={(e) => setPetugasForm({...petugasForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan nama lengkap petugas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={petugasForm.email}
                onChange={(e) => setPetugasForm({...petugasForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="contoh: nama@damkar.makassar.go.id"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength="6"
                value={petugasForm.password}
                onChange={(e) => setPetugasForm({...petugasForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Password minimal 6 karakter"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={petugasForm.phone}
                onChange={(e) => setPetugasForm({...petugasForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Contoh: 081234567890"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor/Pos</label>
              <textarea
                value={petugasForm.address}
                onChange={(e) => setPetugasForm({...petugasForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="Alamat pos damkar atau kantor..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                <input
                  type="text"
                  value={petugasForm.kelurahan}
                  onChange={(e) => setPetugasForm({...petugasForm, kelurahan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Kelurahan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={petugasForm.kecamatan}
                  onChange={(e) => setPetugasForm({...petugasForm, kecamatan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Kecamatan"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddPetugasForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Menyimpan...' : 'Tambah Petugas'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manajemen Staff</h2>
          <p className="text-gray-600 mt-1">Kelola data petugas Dinas Pemadam Kebakaran</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari staff..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non-Aktif</option>
          </select>
          
          <button 
            onClick={() => setShowAddPetugasForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Petugas
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Kontak
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Performance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Bergabung
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {generateInitials(staff.name)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.id}</div>
                        <div className="sm:hidden text-xs text-gray-400 mt-1">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                    <div className="text-sm text-gray-500">{staff.phone}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full border ${getActiveColor(staff.status)}`}>
                        {staff.status === 'active' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{staff.status}</span>
                      </div>
                      <div className="md:hidden">
                        <div className="text-xs text-gray-500">
                          {staff.reports} laporan
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center space-x-2">
                      <Award className={`w-4 h-4 ${getPerformanceColor(staff.reports)}`} />
                      <span className={`text-sm font-semibold ${getPerformanceColor(staff.reports)}`}>
                        {staff.reports} laporan
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{staff.specialization}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(staff.joinDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleViewDetail(staff)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors" 
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(staff)}
                        className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors" 
                        title="Edit Data"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(staff.id)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors" 
                        title="Hapus Petugas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Tidak ada staff ditemukan</p>
              <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian atau filter status</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Total: <span className="font-medium text-gray-900">{staffList.length}</span> petugas</span>
            <span>Ditampilkan: <span className="font-medium text-gray-900">{filteredStaff.length}</span> petugas</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
                <span className="text-xs text-gray-600">Aktif</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></div>
                <span className="text-xs text-gray-600">Non-Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddPetugasForm && <AddPetugasModal />}
      {showDetailModal && <DetailModal />}
      {showEditModal && <EditModal />}
    </div>
  );
};

export default UsersView;