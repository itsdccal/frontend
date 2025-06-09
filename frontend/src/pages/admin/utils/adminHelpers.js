export const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  export const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  export const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'pelapor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  export const getActiveColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const filterReports = (reports, searchTerm, statusFilter) => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };
  
  export const filterUsers = (users, searchTerm) => {
    return users.filter(user => {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.phone.includes(searchTerm);
    });
  };
  
  export const generateInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };