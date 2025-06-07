import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/api";
import ReportForm from "./ReportForm";

export default function ReportFormPresenter() {
  const [form, setForm] = useState({
    // Original fields
    title: "",
    description: "",
    address: "",
    image: null,
    latitude: "",
    longitude: "",
    
    // New -specific fields
    reportType: "kebakaran",
    subCategory: "",
    urgencyLevel: "menengah",
    
    // Reporter data
    reporterName: "",
    reporterPhone: "",
    reporterAddress: "",
    reporterRT: "",
    reporterRW: "",
    reporterKelurahan: "",
    reporterKecamatan: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle image preview
    if (name === "image" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
    
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const onLocationChange = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.latitude || !form.longitude) {
      alert("Silakan pilih lokasi kejadian pada peta");
      return;
    }

    if (!form.reportType || !form.subCategory) {
      alert("Silakan pilih jenis laporan dan kategori spesifik");
      return;
    }

    const formData = new FormData();
    
    // Basic report data
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("image", form.image);
    
    // Enhanced location data with -specific info
    formData.append(
      "location",
      JSON.stringify({
        address: form.address,
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(form.longitude), parseFloat(form.latitude)],
        },
      })
    );
    
    // -specific data
    formData.append("reportType", form.reportType);
    formData.append("subCategory", form.subCategory);
    formData.append("urgencyLevel", form.urgencyLevel);
    
    // Reporter information
    formData.append(
      "reporter",
      JSON.stringify({
        name: form.reporterName,
        phone: form.reporterPhone,
        address: form.reporterAddress,
        rt: form.reporterRT,
        rw: form.reporterRW,
        kelurahan: form.reporterKelurahan,
        kecamatan: form.reporterKecamatan,
      })
    );
    
    // Add timestamp and additional metadata
    formData.append("reportDate", new Date().toISOString());
    formData.append("status", "pending");
    formData.append("source", "form");

    try {
      const res = await createReport(formData);
      
      // Success message with report ID if available
      const reportId = res.data?.id || "Tidak diketahui";
      alert(
        `Laporan berhasil dikirim!\n\n` +
        `ID Laporan: ${reportId}\n` +
        `Jenis: ${form.reportType} - ${form.subCategory}\n` +
        `Urgensi: ${form.urgencyLevel.toUpperCase()}\n\n` +
        `Petugas akan segera menindaklanjuti laporan Anda. ` +
        `Pastikan nomor telepon ${form.reporterPhone} selalu aktif.`
      );
      
      // Redirect to dashboard or success page
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting report:", err);
      
      // Enhanced error handling
      let errorMessage = "Gagal mengirim laporan. ";
      
      if (err.response?.status === 413) {
        errorMessage += "File gambar terlalu besar (maksimal 10MB).";
      } else if (err.response?.status === 400) {
        errorMessage += "Data yang dikirim tidak valid. Periksa kembali formulir.";
      } else if (err.response?.status === 401) {
        errorMessage += "Sesi Anda telah berakhir. Silakan login kembali.";
        navigate("/login");
        return;
      } else if (err.response?.status >= 500) {
        errorMessage += "Server sedang bermasalah. Coba lagi dalam beberapa menit.";
      } else {
        errorMessage += err.message || "Terjadi kesalahan tidak terduga.";
      }
      
      alert(errorMessage);
    }
  };

  return (
    <ReportForm
      form={form}
      onInputChange={onInputChange}
      onLocationChange={onLocationChange}
      onSubmit={onSubmit}
      previewImage={previewImage}
      setPreviewImage={setPreviewImage}
    />
  );
}