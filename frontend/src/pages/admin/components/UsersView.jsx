import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Edit, Trash2, UserPlus, User, Phone, Mail, X } from 'lucide-react';
import { 
  getUsers, 
  getUserDetail, 
  updateStaff, 
  deleteStaff,
  addStaff 
} from '../../../services/api'; 

const UsersView = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showAddPetugasForm, setShowAddPetugasForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState(null);

  const [authToken] = useState(localStorage.getItem('token')); 

  const [petugasForm, setPetugasForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    rt: '', 
    rw: '', 
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

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers({ role: 'petugas' }); 
      
      if (response && response.status === 'success' && Array.isArray(response.listUser)) {
        setStaffList(response.listUser);
      } else {
        console.warn('API response structure for staff is not as expected:', response);
        setStaffList([]); 
        setError(response?.message || 'Data staff tidak ditemukan atau format tidak valid.');
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      setError(err.message || 'Gagal memuat data staf. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchStaff();
    } else {
      setError('Autentikasi diperlukan. Silakan login kembali.');
      setIsLoading(false);
    }
  }, [fetchStaff, authToken]);

  const generateInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredStaff = staffList.filter(staff => {
    const searchTermLower = userSearchTerm.toLowerCase();
    const name = staff.name?.toLowerCase() || '';
    const email = staff.email?.toLowerCase() || '';
    const phone = staff.phone || ''; 

    const matchesName = name.includes(searchTermLower);
    const matchesEmail = email.includes(searchTermLower);
    const matchesPhone = phone.includes(userSearchTerm);

    return matchesName || matchesEmail || matchesPhone;
  });

  const handleViewDetail = async (staffId) => {
    if (!staffId || !authToken) {
      alert("ID staf atau autentikasi tidak lengkap.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserDetail(staffId);
      if (response && response.status === 'success' && response.user) {
        setSelectedStaff(response.user); 
        setShowDetailModal(true);
      } else {
        console.warn('API response structure for user detail is not as expected:', response);
        setError(response?.message || 'Detail staff tidak ditemukan atau format tidak valid.');
      }
    } catch (err) {
      console.error("Gagal mengambil detail staff:", err);
      setError(err.message || "Gagal memuat detail staff. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (staffId) => {
    if (!staffId || !authToken) {
      alert("ID staf atau autentikasi tidak lengkap.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserDetail(staffId);
      if (response && response.status === 'success' && response.user) {
        const detail = response.user;
        setSelectedStaff(detail);
        setEditForm({
          name: detail.name || '',
          email: detail.email || '',
          phone: detail.phone || '',
          address: detail.address || '',
          kelurahan: detail.kelurahan || '',
          kecamatan: detail.kecamatan || ''
        });
        setShowEditModal(true);
      } else {
        console.warn('API response structure for user detail is not as expected for edit:', response);
        setError(response?.message || 'Data staff untuk edit tidak ditemukan atau format tidak valid.');
      }
    } catch (err) {
      console.error("Gagal mengambil data staff untuk edit:", err);
      setError(err.message || "Gagal memuat data staff untuk edit. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaff || !selectedStaff._id || !authToken) {
      alert("Autentikasi atau ID staff tidak lengkap.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await updateStaff(selectedStaff._id, editForm, authToken);
      if (response && response.status === 'success') {
        alert('Data staff berhasil diperbarui!');
        setShowEditModal(false);
        fetchStaff(); 
      } else {
        console.warn('API response for update staff is not as expected:', response);
        setError(response?.message || 'Gagal memperbarui staff: Respons tidak valid.');
      }
    } catch (err) {
      console.error("Gagal memperbarui staff:", err);
      setError(err.message || 'Terjadi kesalahan saat memperbarui staff.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (staffId) => {
    const staff = staffList.find(s => (s.id || s._id) === staffId); 
    if (!staff) {
      alert("Staf tidak ditemukan di daftar.");
      return;
    }

    if (!authToken) {
      alert("Autentikasi diperlukan untuk menghapus staff.");
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus petugas "${staff.name}"?`)) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await deleteStaff(staffId, authToken);

        if (response && response.status === 'success') {
          alert('Petugas berhasil dihapus!');
          fetchStaff();
        } else {
          console.warn('API response for delete staff is not as expected:', response);
          setError(response?.message || 'Gagal menghapus petugas: Respons tidak valid.');
        }
      } catch (err) {
        if (err.message && err.message.includes('CORS')) {
          setError('Terjadi kesalahan CORS: Pastikan server mendukung permintaan dari origin ini.');
        } else {
          console.error("Gagal menghapus petugas:", err);
          setError(err.message || 'Terjadi kesalahan saat menghapus petugas.');
        }
        alert(err.message || 'Terjadi kesalahan saat menghapus petugas.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddPetugas = async (e) => {
    e.preventDefault();
    
    if (!petugasForm.name.trim() || 
        !petugasForm.email.trim() || 
        !petugasForm.password.trim() ||
        !petugasForm.phone.trim() || 
        !petugasForm.address.trim() || 
        !petugasForm.kelurahan.trim() || 
        !petugasForm.kecamatan.trim() 
    ) {
      alert('Harap isi semua field yang diperlukan (Nama, Email, Password, Telepon, Alamat, Kelurahan, Kecamatan).');
      return;
    }

    if (petugasForm.password.length < 6) {
      alert('Password minimal 6 karakter.');
      return;
    }

    if (!authToken) {
      alert("Autentikasi diperlukan untuk menambah petugas.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const staffDataPayload = {
        name: petugasForm.name,
        email: petugasForm.email,
        password: petugasForm.password,
        phone: petugasForm.phone,
        address: petugasForm.address,
        rt: petugasForm.rt || null, 
        rw: petugasForm.rw || null, 
        kelurahan: petugasForm.kelurahan,
        kecamatan: petugasForm.kecamatan,
        role: 'petugas' 
      };

      const response = await addStaff(staffDataPayload, authToken);
      
      if (response && response.status === 'success') {
        alert('Petugas berhasil ditambahkan!');
        setPetugasForm({
          name: '', email: '', password: '', phone: '', address: '',
          rt: '', rw: '', kelurahan: '', kecamatan: ''
        });
        setShowAddPetugasForm(false);
        fetchStaff(); 
      } else {
        console.warn('API response for add staff is not as expected:', response);
        setError(response?.message || 'Gagal menambahkan petugas: Respons tidak valid.');
      }
    } catch (err) {
      console.error("Gagal menambahkan petugas:", err);
      setError(err.message || 'Terjadi kesalahan saat menambahkan petugas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Manajemen Staff</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola data petugas Dinas Pemadam Kebakaran</p>
          </div>
          <button
            onClick={() => setShowAddPetugasForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Petugas
          </button>
        </div>
        
        {/* Mobile Search */}
        <div className="flex flex-col space-y-3 sm:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari staff..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
            />
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden sm:flex sm:flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari staff..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64 lg:w-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data staff...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-base font-medium">Tidak ada staff ditemukan</p>
            <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter status</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {filteredStaff.map((staff) => {
                const keyDiv = staff._id; 
                return (
                  <div key={keyDiv} className="p-4 hover:bg-gray-50 active:bg-gray-100">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {generateInitials(staff.name)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{staff.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">#{staff._id}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{staff.phone}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(staff._id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </button>
                      <button
                        onClick={() => handleEdit(staff._id)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto max-h-[400px]">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.map((staff) => {
                  const keyTr = staff._id;
                  return (
                    <tr key={keyTr} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{staff.email}</div>
                        <div className="text-sm text-gray-500">{staff.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => handleViewDetail(staff._id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors" 
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(staff._id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors" 
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(staff._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors" 
                            title="Hapus Petugas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Total: <span className="font-medium text-gray-900">{staffList.length}</span> petugas</span>
            <span>Ditampilkan: <span className="font-medium text-gray-900">{filteredStaff.length}</span> petugas</span>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddPetugasForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Tambah Petugas Baru</h3>
                <button 
                  onClick={() => setShowAddPetugasForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddPetugas} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={petugasForm.name}
                  onChange={(e) => setPetugasForm({...petugasForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={petugasForm.email}
                  onChange={(e) => setPetugasForm({...petugasForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={petugasForm.password}
                  onChange={(e) => setPetugasForm({...petugasForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
                <input
                  type="tel"
                  value={petugasForm.phone}
                  onChange={(e) => setPetugasForm({...petugasForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat *</label>
                <textarea
                  value={petugasForm.address}
                  onChange={(e) => setPetugasForm({...petugasForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RT</label>
                  <input
                    type="text"
                    value={petugasForm.rt}
                    onChange={(e) => setPetugasForm({...petugasForm, rt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RW</label>
                  <input
                    type="text"
                    value={petugasForm.rw}
                    onChange={(e) => setPetugasForm({...petugasForm, rw: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan *</label>
                  <input
                    type="text"
                    value={petugasForm.kelurahan}
                    onChange={(e) => setPetugasForm({...petugasForm, kelurahan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan *</label>
                  <input
                    type="text"
                    value={petugasForm.kecamatan}
                    onChange={(e) => setPetugasForm({...petugasForm, kecamatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required 
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Menyimpan...' : 'Tambah Petugas'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPetugasForm(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Detail Staff - {selectedStaff.name}</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {generateInitials(selectedStaff.name)}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedStaff.name}</h4>
                  <p className="text-sm text-gray-500">#{selectedStaff._id}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedStaff.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedStaff.phone}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <p className="text-sm text-gray-900">{selectedStaff.address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedStaff.rt && selectedStaff.rw 
                    ? `RT: ${selectedStaff.rt} RW: ${selectedStaff.rw}, `
                    : ''}
                  Kelurahan: {selectedStaff.kelurahan}, Kecamatan: {selectedStaff.kecamatan}
                </p>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex ml-auto"              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Edit Staff - {selectedStaff.name}</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateStaff} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan</label>
                  <input
                    type="text"
                    value={editForm.kelurahan}
                    onChange={(e) => setEditForm({...editForm, kelurahan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
                  <input
                    type="text"
                    value={editForm.kecamatan}
                    onChange={(e) => setEditForm({...editForm, kecamatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;