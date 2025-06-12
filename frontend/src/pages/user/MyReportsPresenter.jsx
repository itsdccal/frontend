import { useState, useEffect, useCallback } from 'react';
import { getAllReports } from '../../services/api'; 

export const myReportsPresenter = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const reporterId = user.userId;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!reporterId) {
        setReports([]);
        setFilteredReports([]);
        setLoading(false);
        console.warn("Reporter ID not found (user.userId is missing). User might not be logged in or user data is incomplete in localStorage.");
        return;
      }

      const apiResponse = await getAllReports({ userId: reporterId });

      if (apiResponse && Array.isArray(apiResponse.listReport)) {
        const userReports = apiResponse.listReport.filter(report => {
          const reportReporterId = report.reporterId && report.reporterId._id
                                    ? report.reporterId._id
                                    : null;
          
          return reportReporterId === reporterId;  
        });

        setReports(userReports); 
        setFilteredReports(userReports);

        if (userReports.length > 0) {
          console.log("Successfully fetched and filtered reports for current user:", userReports);
        } else {
          console.log("No reports found for the current user (ID:", reporterId, ")");
        }
      } else {
        setReports([]);
        setFilteredReports([]);
        console.warn("API response did not contain an array for 'listReport' or was malformed:", apiResponse);
        setError('Format data laporan tidak valid dari server.');
      }

    } catch (err) {
      setError('Gagal memuat laporan. Silakan coba lagi.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, [reporterId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    let currentFiltered = reports;

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        report._id?.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
    }

    if (statusFilter !== 'all') {
      currentFiltered = currentFiltered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      currentFiltered = currentFiltered.filter(report => report.reportType === typeFilter);
    }

    setFilteredReports(currentFiltered);
  }, [searchTerm, statusFilter, typeFilter, reports]);

  return {
    filteredReports,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    error,
    refreshReports: fetchReports
  };
};