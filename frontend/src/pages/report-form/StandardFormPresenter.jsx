// src/pages/report-form/StandardFormPresenter.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/api";
import StandardForm from "./StandardForm"; // Your improved standard form component

export default function StandardFormPresenter() {
  const [form, setForm] = useState({
    // Standard form fields - comprehensive data collection
    reporterName: "",
    reporterPhone: "",
    reporterAddress: "",
    reporterRT: "",
    reporterRW: "",
    reporterKelurahan: "",
    reporterKecamatan: "",
    rescueType: "",
    title: "",
    description: "",
    location: "",
    additionalInfo: "",
    latitude: "",
    longitude: "",
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [mlValidation, setMLValidation] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "images" && files) {
      const newImages = Array.from(files);
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    // Comprehensive validation
    if (!form.latitude || !form.longitude) {
      alert("Silakan pilih lokasi kejadian pada peta");
      return;
    }

    if (!form.rescueType || !form.description) {
      alert("Silakan lengkapi jenis rescue dan deskripsi");
      return;
    }

    const formData = new FormData();
    
    // Standard report data
    Object.keys(form).forEach(key => {
      if (key === 'images') {
        form.images.forEach((image, index) => {
          formData.append(`image_${index}`, image);
        });
      } else if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    // Add metadata for standard reports
    formData.append('mlValidation', JSON.stringify(mlValidation));
    formData.append('reportType', 'rescue');
    formData.append('reportMode', 'standard');
    formData.append('reportDate', new Date().toISOString());
    formData.append('status', 'pending');

    try {
      const res = await createReport(formData);
      
      const reportId = res.data?.id || Math.random().toString(36).substr(2, 9);
      alert(
        `✅ Laporan rescue berhasil dikirim!\n\n` +
        `ID Laporan: ${reportId}\n` +
        `Mode: Standard Report\n` +
        `Jenis: ${form.rescueType}\n\n` +
        `Tim Damkar akan segera menindaklanjuti. ` +
        `Simpan ID laporan untuk tracking.`
      );
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting standard report:", err);
      
      let errorMessage = "Gagal mengirim laporan lengkap. ";
      
      if (err.response?.status === 413) {
        errorMessage += "File terlalu besar (maksimal 10MB per file).";
      } else if (err.response?.status === 400) {
        errorMessage += "Data tidak valid. Periksa kembali semua field.";
      } else if (err.response?.status >= 500) {
        errorMessage += "Server bermasalah. Coba lagi dalam beberapa menit.";
      } else {
        errorMessage += err.message || "Terjadi kesalahan tidak terduga.";
      }
      
      alert(errorMessage);
    }
  };

  return (
    <StandardForm
      form={form}
      onInputChange={onInputChange}
      onLocationChange={onLocationChange}
      onSubmit={onSubmit}
      previewImages={previewImages}
      setPreviewImages={setPreviewImages}
      mlValidation={mlValidation}
      setMLValidation={setMLValidation}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );
}