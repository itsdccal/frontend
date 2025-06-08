// src/pages/report-form/QuickFormPresenter.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/api";
import QuickForm from "./QuickForm"; // Your improved quick form component

export default function QuickFormPresenter() {
  const [form, setForm] = useState({
    // Quick form fields - minimal for fast reporting
    reporterName: "",
    reporterPhone: "",
    fireType: "",
    location: "",
    description: "",
    urgencyLevel: "medium",
    hasCasualties: false,
    latitude: "",
    longitude: "",
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [mlValidation, setMLValidation] = useState(null);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
    
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
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

    // Quick validation
    if (!form.latitude || !form.longitude) {
      alert("Silakan pilih lokasi kejadian pada peta");
      return;
    }

    if (!form.fireType || !form.description) {
      alert("Silakan lengkapi jenis kebakaran dan deskripsi");
      return;
    }

    const formData = new FormData();
    
    // Quick report specific data
    Object.keys(form).forEach(key => {
      if (key === 'image' && form[key]) {
        formData.append(key, form[key]);
      } else if (typeof form[key] === 'boolean') {
        formData.append(key, form[key].toString());
      } else if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    // Add metadata for quick reports
    formData.append('mlValidation', JSON.stringify(mlValidation));
    formData.append('reportType', 'kebakaran');
    formData.append('reportMode', 'quick');
    formData.append('reportDate', new Date().toISOString());
    formData.append('status', 'urgent'); // Quick reports are usually urgent

    try {
      const res = await createReport(formData);
      
      const reportId = res.data?.id || Math.random().toString(36).substr(2, 9);
      alert(
        `✅ Laporan kebakaran berhasil dikirim!\n\n` +
        `ID Laporan: ${reportId}\n` +
        `Mode: Quick Report\n` +
        `Urgensi: ${form.urgencyLevel.toUpperCase()}\n\n` +
        `Tim Damkar akan segera menindaklanjuti. ` +
        `Pastikan nomor ${form.reporterPhone} aktif.`
      );
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting quick report:", err);
      
      let errorMessage = "Gagal mengirim laporan cepat. ";
      
      if (err.response?.status === 413) {
        errorMessage += "File gambar terlalu besar (maksimal 10MB).";
      } else if (err.response?.status === 400) {
        errorMessage += "Data tidak valid. Periksa kembali formulir.";
      } else if (err.response?.status >= 500) {
        errorMessage += "Server bermasalah. Coba lagi dalam beberapa menit.";
      } else {
        errorMessage += err.message || "Terjadi kesalahan tidak terduga.";
      }
      
      alert(errorMessage);
    }
  };

  return (
    <QuickForm
      form={form}
      onInputChange={onInputChange}
      onLocationChange={onLocationChange}
      onSubmit={onSubmit}
      previewImage={previewImage}
      setPreviewImage={setPreviewImage}
      mlValidation={mlValidation}
      setMLValidation={setMLValidation}
    />
  );
}