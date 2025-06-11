import React, { useState } from 'react';
import { Search, UserPlus, Eye, Edit, Trash2, X } from 'lucide-react';

const UsersView = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showAddPetugasForm, setShowAddPetugasForm] = useState(false);
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

  const [staffList, setStaffList] = useState([
    {
      id: 'STF001',
      name: 'Petugas 1',
      email: 'petugas1@gmail.com',
      phone: '0811111111',
      address: 'Pos Damkar 1, Makassar',
      kelurahan: 'Makassar 1',
      kecamatan: 'Makassar 1',
      role: 'petugas',
      status: 'active',
      reports: 15,
      joinDate: '2024-01-15'
    },
    {
      id: 'STF002',
      name: 'Petugas 2',
      email: 'petugas2@gmail.com',
      phone: '0822222222',
      address: 'Pos Damkar 2, Makassar',
      kelurahan: 'Makassar 1',
      kecamatan: 'Makassar 1',
      role: 'petugas',
      status: 'active',
      reports: 12,
      joinDate: '2024-02-10'
    },
    {
      id: 'STF003',
      name: 'Petugas 3',
      email: 'petugas3@gmail.com',
      phone: '0833333333',
      address: 'Pos Damkar 3, Makassar',
      kelurahan: 'Makassar 1',
      kecamatan: 'Makassar 1',
      role: 'petugas',
      status: 'active',
      reports: 18,
      joinDate: '2024-01-20'
    }
  ]);

  const getActiveColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const generateInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleAddPetugas = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPetugas = {
        id: `STF${String(staffList.length + 1).padStart(3, '0')}`,
        ...petugasForm,
        role: 'petugas',
        status: 'active',
        reports: 0,
        joinDate: new Date().toISOString().split('T')[0]
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

  const AddPetugasModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Tambah Petugas Baru</h3>
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
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={petugasForm.name}
                onChange={(e) => setPetugasForm({...petugasForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={petugasForm.email}
                onChange={(e) => setPetugasForm({...petugasForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={petugasForm.password}
                onChange={(e) => setPetugasForm({...petugasForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="tel"
                required
                value={petugasForm.phone}
                onChange={(e) => setPetugasForm({...petugasForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                required
                value={petugasForm.address}
                onChange={(e) => setPetugasForm({...petugasForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelurahan
              </label>
              <input
                type="text"
                required
                value={petugasForm.kelurahan}
                onChange={(e) => setPetugasForm({...petugasForm, kelurahan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                required
                value={petugasForm.kecamatan}
                onChange={(e) => setPetugasForm({...petugasForm, kecamatan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddPetugasForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manajemen Staff</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari staff..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
            />
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {generateInitials(staff.name)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                    <div className="text-sm text-gray-500">{staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActiveColor(staff.status)}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.reports}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
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
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada staff yang ditemukan</p>
          </div>
        )}
      </div>

      {showAddPetugasForm && <AddPetugasModal />}
    </div>
  );
};

export default UsersView;