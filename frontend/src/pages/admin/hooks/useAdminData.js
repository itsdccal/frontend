import { useState, useMemo } from 'react';
import { FileText, Clock, Users, CheckCircle } from 'lucide-react';

export const useAdminData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const stats = [
    {
      title: "Total Laporan",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Laporan Pending",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: Clock,
      color: "yellow"
    },
    {
      title: "Total Users",
      value: "2,156",
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "green"
    },
    {
      title: "Response Rate",
      value: "95.3%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "emerald"
    }
  ];

  const recentReports = [
    {
      id: "RPT001",
      title: "Kebakaran Rumah Tinggal",
      reporter: "Ahmad Syahrul",
      location: "Jl. Pettarani No. 45",
      status: "pending",
      urgency: "high",
      date: "2025-01-10 14:30",
      type: "kebakaran"
    },
    {
      id: "RPT002", 
      title: "Penyelamatan Kucing dari Pohon",
      reporter: "Siti Aminah",
      location: "Kompleks BTN Antang",
      status: "in_progress",
      urgency: "medium",
      date: "2025-01-10 13:15",
      type: "rescue"
    },
    {
      id: "RPT003",
      title: "Kebakaran Kendaraan",
      reporter: "Budi Santoso",
      location: "Jl. Sultan Alauddin",
      status: "completed",
      urgency: "high", 
      date: "2025-01-10 11:45",
      type: "kebakaran"
    },
    {
      id: "RPT004",
      title: "Evakuasi Korban Kecelakaan",
      reporter: "Andi Wijaya",
      location: "Flyover Urip Sumoharjo",
      status: "pending",
      urgency: "critical",
      date: "2025-01-10 10:20",
      type: "rescue"
    },
    {
      id: "RPT005",
      title: "Pembongkaran Kunci Mobil",
      reporter: "Fitri Handayani",
      location: "Mall Panakkukang",
      status: "in_progress", 
      urgency: "low",
      date: "2025-01-10 09:30",
      type: "rescue"
    },
    {
      id: "RPT006",
      title: "Kebakaran Gudang",
      reporter: "Muhammad Ali",
      location: "Jl. Veteran Utara",
      status: "completed",
      urgency: "high",
      date: "2025-01-10 08:15",
      type: "kebakaran"
    },
    {
      id: "RPT007",
      title: "Penyelamatan dari Sumur",
      reporter: "Fatimah Zahra",
      location: "Kelurahan Rappocini",
      status: "rejected",
      urgency: "medium",
      date: "2025-01-10 07:45",
      type: "rescue"
    }
  ];

  const users = [
    {
      id: "USR001",
      name: "Ahmad Syahrul",
      email: "ahmad.syahrul@email.com",
      phone: "081234567890",
      role: "pelapor",
      status: "active",
      reports: 3,
      joinDate: "2024-12-15"
    },
    {
      id: "USR002",
      name: "Siti Aminah", 
      email: "siti.aminah@email.com",
      phone: "081234567891",
      role: "pelapor",
      status: "active",
      reports: 1,
      joinDate: "2024-12-20"
    },
    {
      id: "USR003",
      name: "Captain Fireman",
      email: "captain@damkar.go.id",
      phone: "081234567892", 
      role: "admin",
      status: "active",
      reports: 0,
      joinDate: "2024-01-01"
    },
    {
      id: "USR004",
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      phone: "081234567893",
      role: "pelapor", 
      status: "inactive",
      reports: 2,
      joinDate: "2024-11-30"
    },
    {
      id: "USR005",
      name: "Fitri Handayani",
      email: "fitri.handayani@email.com",
      phone: "081234567894",
      role: "pelapor",
      status: "active",
      reports: 1,
      joinDate: "2024-12-05"
    },
    {
      id: "USR006",
      name: "Muhammad Ali",
      email: "m.ali@email.com",
      phone: "081234567895",
      role: "pelapor",
      status: "active",
      reports: 2,
      joinDate: "2024-11-28"
    }
  ];

  const dailyActivity = {
    reportsToday: 8,
    completedToday: 5,
    pendingToday: 3,
    avgResponseTime: "7.5 menit",
    activeUsers: 234
  };

  const filteredReports = useMemo(() => {
    return recentReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [recentReports, searchTerm, statusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      return user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
             user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
             user.phone.includes(userSearchTerm);
    });
  }, [users, userSearchTerm]);

  return {
    stats,
    recentReports,
    users,
    dailyActivity,
    filteredReports,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    userSearchTerm,
    setUserSearchTerm
  };
};