import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, UserPlus, User, Phone, Mail, X, Filter } from 'lucide-react';

const UsersView = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showAddPetugasForm, setShowAddPetugasForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
      name: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@damkar.makassar.go.id',
      phone: '081111111111',
      address: 'Pos Damkar Pusat, Jl. Ahmad Yani No. 10, Makassar',
      kelurahan: 'Wajo',
      kecamatan: 'Wajo',
      role: 'petugas'
    },
    {
      id: 'STF002',
      name: 'Siti Fatimah',
      email: 'siti.fatimah@damkar.makassar.go.id',
      phone: '082222222222',
      address: 'Pos Damkar Utara, Jl. Perintis Kemerdekaan, Makassar',
      kelurahan: 'Tamalate',
      kecamatan: 'Tamalate',
      role: 'petugas'
    },
    {
      id: 'STF003',
      name: 'Budi Santoso',
      email: 'budi.santoso@damkar.makassar.go.id',
      phone: '083333333333',
      address: 'Pos Damkar Timur, Jl. AP Pettarani, Makassar',
      kelurahan: 'Rappocini',
      kecamatan: 'Rappocini',
      role: 'petugas'
    },
    {
      id: 'STF004',
      name: 'Dewi Permata',
      email: 'dewi.permata@damkar.makassar.go.id',
      phone: '084444444444',
      address: 'Pos Damkar Selatan, Jl. Hertasning, Makassar',
      kelurahan: 'Samata',
      kecamatan: 'Somba Opu',
      role: 'petugas'
    }
  ]);

  const generateInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         staff.phone.includes(userSearchTerm);
    return matchesSearch;
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
    if (window.confirm(`Apakah Anda yakin ingin menghapus petugas "${staff.name}"?`)) {
      try {
        setStaffList(prev => prev.filter(staff => staff.id !== staffId));
        alert('Petugas berhasil dihapus!');
      } catch (error) {
        alert('Gagal menghapus petugas');
      }
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
        role: 'petugas'
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
        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {filteredStaff && filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <div key={staff.id} className="p-4 hover:bg-gray-50 active:bg-gray-100">
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
                      <p className="text-sm text-gray-600 mb-1">#{staff.id}</p>
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
                      onClick={() => handleViewDetail(staff)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </button>
                    <button
                      onClick={() => handleEdit(staff)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-base font-medium">Tidak ada staff ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter status</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff && filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
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
                          <div className="text-sm text-gray-500">#{staff.id}</div>
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
                          onClick={() => handleViewDetail(staff)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors" 
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(staff)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors" 
                          title="Edit Data"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors" 
                          title="Hapus Petugas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <User className="w-12 h-12 text-gray-400" />
                      <p className="text-base font-medium">Tidak ada staff ditemukan</p>
                      <p className="text-sm text-gray-400">Coba ubah kata kunci pencarian atau filter status</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={petugasForm.phone}
                  onChange={(e) => setPetugasForm({...petugasForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={petugasForm.address}
                  onChange={(e) => setPetugasForm({...petugasForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kelurahan</label>
                  <input
                    type="text"
                    value={petugasForm.kelurahan}
                    onChange={(e) => setPetugasForm({...petugasForm, kelurahan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
                  <input
                    type="text"
                    value={petugasForm.kecamatan}
                    onChange={(e) => setPetugasForm({...petugasForm, kecamatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPetugasForm(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Menyimpan...' : 'Tambah Petugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  <p className="text-sm text-gray-500">#{selectedStaff.id}</p>
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
                  {selectedStaff.kelurahan}, {selectedStaff.kecamatan}
                </p>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            
            <div className="p-4 sm:p-6 space-y-4">
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
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    // Handle update logic here
                    setShowEditModal(false);
                    alert('Data staff berhasil diperbarui!');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;