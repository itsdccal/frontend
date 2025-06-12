import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createReport, getUserDetail, predictedCategory } from "../../services/api";
import { sendWhatsAppMessage, createReportWhatsAppMessage } from "../../services/whatsappservice";
import StandardForm from "./StandardForm";

export default function StandardFormPresenter() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: {
      address: "",
      latitude: "",
      longitude: "",
    },
    image: null,
    video: null,
    additionalInfo: "",
    reporterInfo: {
      name: "",
      phone: "",
      address: "",
      rt: "",
      rw: "",
      kelurahan: "",
      kecamatan: "",
    },
    category: null,
    predictResult: null, 
  });

  const [mlValidation, setMLValidation] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationTimeout, setValidationTimeout] = useState(null);
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userDataError, setUserDataError] = useState(null);
  const fileInputRef = useRef(null);

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ""));
  };

  const validateFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024;
    return file.size <= maxSize;
  };

  const validateFileType = (file) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/webm"];
    return allowedImageTypes.includes(file.type) || allowedVideoTypes.includes(file.type);
  };

  const sanitizeInput = (input) => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
  };

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = localStorage.getItem("user");
          const userDataFromLocalStorage = JSON.parse(user);
          const userId = userDataFromLocalStorage.userId;

          const responseData = await getUserDetail(userId);
          const userProfile = responseData.user;

          setForm((prevForm) => ({
            ...prevForm,
            reporterInfo: {
              name: userProfile.name || "",
              phone: userProfile.phone || "",
              address: userProfile.address || "",
              rt: userProfile.rt || "",
              rw: userProfile.rw || "",
              kelurahan: userProfile.kelurahan || "",
              kecamatan: userProfile.kecamatan || "",
            },
          }));
        } catch (error) {
          console.error("Error fetching user data for form defaults:", error);
          setUserDataError(
            `Gagal memuat data profil: ${error.message || "Terjadi kesalahan."}`
          );
        }
      }
    };
    fetchAndSetUserData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      previewImages.forEach(p => URL.revokeObjectURL(p.url));
      clearTimeout(validationTimeout);
    };
  }, [previewImages, validationTimeout]);

  const validateMLInput = useCallback((title, description) => { 
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    if (!title && !description) {
      setMLValidation(null);
      setForm(prev => ({ ...prev, category: null, predictResult: null }));
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await predictedCategory(title, description);

        if (result.status === "success" && result.predictResult) {
          const mlResult = result.predictResult;
          const predictedCategoryName = mlResult.category;
          const predictedScore = mlResult.score || 0;
          let suggestions = [];

          if (predictedCategoryName === "kebakaran") {
            suggestions.push("Laporan ini terindikasi *kebakaran* oleh AI. Harap gunakan 'Laporan Darurat' untuk kasus kebakaran.");
          } else if (!predictedCategoryName.includes("penyelamatan") && !predictedCategoryName.includes("lingkungan")) {
            suggestions.push(`AI memprediksi: "${predictedCategoryName.replace(/_/g, ' ')}" (Skor: ${(predictedScore * 100).toFixed(2)}%). Pastikan deskripsi Anda sudah jelas untuk laporan rescue.`);
          }

          setMLValidation({
            isRescue: predictedCategoryName !== "kebakaran",
            confidence: predictedScore,
            suggestions: suggestions,
            message: `Prediksi kategori: ${predictedCategoryName ? predictedCategoryName.replace(/_/g, ' ') : 'Tidak diketahui'} (Skor: ${(predictedScore * 100).toFixed(2)}%)`,
          });

          setForm((prev) => ({
            ...prev,
            category: predictedCategoryName, 
            predictResult: mlResult, 
          }));
        } else {
          setMLValidation({
            isRescue: false,
            confidence: 0,
            suggestions: [],
            message: result.message || "Gagal memvalidasi kategori laporan dari backend. Silakan coba lagi.",
          });
          setForm((prev) => ({
            ...prev,
            category: null,
            predictResult: { status: "error", message: result.message || "Prediction failed from backend" },
          }));
        }
      } catch (error) {
        console.error("Error dalam prediksi kategori dari backend:", error);
        setMLValidation({
          isRescue: false,
          confidence: 0,
          suggestions: [],
          message: "Gagal memvalidasi kategori laporan. Terjadi kesalahan saat menghubungi backend.",
        });
        setForm((prev) => ({
          ...prev,
          category: null,
          predictResult: { status: "error", message: "System error calling backend for prediction" },
        }));
      }
    }, 3000);

    setValidationTimeout(timeout);
  }, [validationTimeout]); 

  const removeImage = (indexToRemove) => {
    setPreviewImages(prev => {
      const newPreviews = prev.filter((_, i) => i !== indexToRemove);
      if (prev[indexToRemove] && prev[indexToRemove].url) {
        URL.revokeObjectURL(prev[indexToRemove].url);
      }
      return newPreviews;
    });

    setForm(prev => {
        const newForm = { ...prev };
        const updatedPreviews = previewImages.filter((_, i) => i !== indexToRemove);

        if (updatedPreviews.some(p => p.type === 'image')) {
            newForm.image = updatedPreviews.find(p => p.type === 'image')?.file || null;
            newForm.video = null; 
        } else if (updatedPreviews.some(p => p.type === 'video')) {
            newForm.video = updatedPreviews.find(p => p.type === 'video')?.file || null;
            newForm.image = null; 
        } else {
            newForm.image = null;
            newForm.video = null;
        }
        return newForm;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applySuggestion = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();
    if (lowerSuggestion.includes('kebakaran')) {
        alert("Laporan ini terindikasi kebakaran. Silakan buat 'Laporan Darurat' untuk kasus kebakaran.");
    }

    setMLValidation(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s !== suggestion)
    }));
  };

  const validateStep = useCallback((step) => {
    const newErrors = {};
    const token = localStorage.getItem("token");

    if (step === 1) {
      if (!token) {
        if (!form.reporterInfo.name?.trim()) newErrors.reporterName = "Nama wajib diisi";
        if (!form.reporterInfo.phone?.trim()) {
          newErrors.reporterPhone = "Nomor telepon wajib diisi";
        } else if (!validatePhone(form.reporterInfo.phone)) {
          newErrors.reporterPhone = "Format nomor telepon tidak valid";
        }
        if (!form.reporterInfo.address?.trim()) newErrors.reporterAddress = "Alamat wajib diisi";
        if (!form.reporterInfo.kelurahan?.trim()) newErrors.reporterKelurahan = "Kelurahan wajib diisi";
        if (!form.reporterInfo.kecamatan?.trim()) newErrors.reporterKecamatan = "Kecamatan wajib diisi";
      }
    }
    if (step === 2) {
      if (!form.title.trim()) newErrors.title = "Judul laporan wajib diisi";
      if (!form.description.trim()) {
        newErrors.description = "Deskripsi kejadian wajib diisi";
      } else if (form.description.trim().length < 20) {
        newErrors.description = "Deskripsi terlalu singkat (minimal 20 karakter)";
      }
      if ((form.title.trim() || form.description.trim()) && !form.category) {
        newErrors.category = "Sistem sedang memprediksi kategori. Harap tunggu atau perbaiki judul/deskripsi.";
      }
      if (form.category === "kebakaran") {
        newErrors.category = "Laporan ini terindikasi kebakaran. Harap buat Laporan Darurat.";
      }
    }
    if (step === 3) {
      if (!form.location.address.trim() && (!form.location.latitude || !form.location.longitude)) {
        newErrors.location = "Alamat lokasi wajib diisi";
        newErrors.coordinates = "Atau pilih lokasi pada peta";
      }
      if (form.location.address.trim() && (!form.location.latitude || !form.location.longitude)) {
        newErrors.coordinates = "Koordinat belum dipilih pada peta. Harap klik pada peta.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, validatePhone]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mediaUpload" && files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 2) {
        alert("Anda hanya dapat mengunggah maksimal satu gambar dan satu video.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        previewImages.forEach(p => URL.revokeObjectURL(p.url));
        setPreviewImages([]);
        setForm(prev => ({ ...prev, image: null, video: null }));
        return;
      }

      let newImage = null;
      let newVideo = null;
      const newPreviews = [];
      const fileErrors = [];

      selectedFiles.forEach((file) => {
        if (!validateFileSize(file)) {
          fileErrors.push(`File ${file.name} terlalu besar (maksimal 10MB)`);
          return;
        }
        if (!validateFileType(file)) {
          fileErrors.push(`File ${file.name} format tidak didukung (JPG, PNG, WEBP, MP4, MOV, WEBM)`);
          return;
        }

        if (file.type.startsWith("image/")) {
          newImage = file;
          newPreviews.push({ type: 'image', url: URL.createObjectURL(file), name: file.name, file: file });
        } else if (file.type.startsWith("video/")) {
          newVideo = file;
          newPreviews.push({ type: 'video', url: URL.createObjectURL(file), name: file.name, file: file });
        }
      });

      if (fileErrors.length > 0) {
        alert(fileErrors.join("\n"));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        previewImages.forEach(p => URL.revokeObjectURL(p.url));
        setPreviewImages([]);
        setForm(prev => ({ ...prev, image: null, video: null }));
        return;
      }

      setPreviewImages(newPreviews);
      setForm((prev) => ({
        ...prev,
        image: newImage,
        video: newVideo,
      }));

    } else if (name.startsWith("reporterInfo.")) {
      const reporterInfoField = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        reporterInfo: {
          ...prev.reporterInfo,
          [reporterInfoField]: sanitizeInput(value),
        },
      }));
    } else if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: sanitizeInput(value),
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: sanitizeInput(value),
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (name.startsWith("reporterInfo.")) {
      const reporterInfoField = name.split(".")[1];
      if (errors[`reporter${reporterInfoField.charAt(0).toUpperCase() + reporterInfoField.slice(1)}`]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`reporter${reporterInfoField.charAt(0).toUpperCase() + reporterInfoField.slice(1)}`];
          return newErrors;
        });
      }
    }

    if (name === "title" || name === "description") {
      const currentTitle = name === "title" ? sanitizeInput(value) : form.title;
      const currentDescription = name === "description" ? sanitizeInput(value) : form.description;
      validateMLInput(currentTitle, currentDescription);
    }
  };

  const handleLocationChange = useCallback(
    async (lat, lng, addressFromMap = null) => {
      setLocationLoading(true);
      try {
        let addressToSet = form.location.address;
        if (addressFromMap !== null) {
          addressToSet = addressFromMap;
        } else if (lat && lng) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          addressToSet = data.display_name || "Alamat tidak ditemukan";
        }

        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: lat,
            longitude: lng,
            address: addressToSet,
          },
        }));

        if (errors.location || errors.coordinates) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.location;
            delete newErrors.coordinates;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("Gagal mendapatkan alamat dari koordinat.");
        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: lat,
            longitude: lng,
            address: form.location.address || "Gagal mendapatkan alamat",
          },
        }));
      } finally {
        setLocationLoading(false);
      }
    },
    [errors, form.location.address]
  );

  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationChange(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        let errorMessage = "Gagal mendapatkan lokasi: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Izin lokasi ditolak";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia";
            break;
          case error.TIMEOUT:
            errorMessage += "Timeout mendapatkan lokasi";
            break;
          default:
            errorMessage += "Error tidak diketahui";
            break;
        }
        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert("Harap lengkapi semua field yang wajib diisi di setiap langkah.");
      const firstErrorElement = document.querySelector(".border-red-500");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (form.category === "kebakaran") {
        alert("Laporan ini terindikasi kebakaran oleh AI. Harap buat 'Laporan Darurat' untuk kasus kebakaran.");
        setIsSubmitting(false);
        return;
    }
    if ((form.title.trim() || form.description.trim()) && !form.category) {
        alert("Sistem masih memproses prediksi kategori. Harap tunggu sebentar.");
        setIsSubmitting(false);
        return;
    }

    if (!isOnline) {
      alert("Tidak ada koneksi internet. Silakan coba lagi saat online.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("reportType", "biasa"); 

      formData.append("rescueType", form.category || ""); 
      formData.append("category", form.category || "");

      if (form.predictResult) {
        formData.append("predictResult", JSON.stringify(form.predictResult));
      }

      const locationData = {
        address: form.location.address,
        coordinates: {
          type: "Point",
          coordinates: [
            form.location.longitude ? parseFloat(form.location.longitude) : null,
            form.location.latitude ? parseFloat(form.location.latitude) : null,
          ],
        },
      };
      if (locationData.coordinates.coordinates[0] === null || locationData.coordinates.coordinates[1] === null) {
        locationData.coordinates = null;
      }
      formData.append("location", JSON.stringify(locationData));

      if (form.additionalInfo) formData.append("additionalInfo", form.additionalInfo);

      if (form.image) formData.append("image", form.image);
      if (form.video) formData.append("video", form.video);

      const token = localStorage.getItem("token");
      if (!token) {
        formData.append("name", form.reporterInfo.name);
        formData.append("phone", form.reporterInfo.phone);
        formData.append("address", form.reporterInfo.address || "");
        formData.append("rt", form.reporterInfo.rt || "");
        formData.append("rw", form.reporterInfo.rw || "");
        formData.append("kelurahan", form.reporterInfo.kelurahan || "");
        formData.append("kecamatan", form.reporterInfo.kecamatan || "");
      } else {
        formData.append("name", form.reporterInfo.name);
        formData.append("phone", form.reporterInfo.phone);
        formData.append("address", form.reporterInfo.address || "");
        formData.append("rt", form.reporterInfo.rt || "");
        formData.append("rw", form.reporterInfo.rw || "");
        formData.append("kelurahan", form.reporterInfo.kelurahan || "");
        formData.append("kecamatan", form.reporterInfo.kecamatan || "");
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      for (let pair of formData.entries()) {
        if (pair[0] === "image" || pair[0] === "video") {
          console.log(pair[0], ":", pair[1].name);
        } else if (pair[0] === "location" || pair[0] === "predictResult") {
          try {
            console.log(pair[0], ":", JSON.parse(pair[1]));
          } catch (e) {
            console.log(pair[0], ":", pair[1]);
          }
        }
        else {
          console.log(pair[0], ":", pair[1]);
        }
      }

      const response = await createReport(formData, headers);

      const reportId = response.report_id || "UNKNOWN";

      const whatsappLocation = {
        address: form.location.address,
        coordinates: {
          type: "Point",
          coordinates: [
            form.location.longitude ? parseFloat(form.location.longitude) : null,
            form.location.latitude ? parseFloat(form.location.latitude) : null,
          ],
        },
      };

      if (whatsappLocation.coordinates.coordinates[0] === null || whatsappLocation.coordinates.coordinates[1] === null || isNaN(whatsappLocation.coordinates.coordinates[0]) || isNaN(whatsappLocation.coordinates.coordinates[1])) {
        whatsappLocation.coordinates = null;
      }

      const whatsappMessage = createReportWhatsAppMessage({
        reportId,
        title: form.title,
        description: form.description,
        rescueType: form.category ? form.category.replace(/_/g, ' ') : 'Tidak Diketahui',
        reporterName: form.reporterInfo.name,
        location: whatsappLocation,
      }, 'biasa');

      try {
        sendWhatsAppMessage('082253217049', whatsappMessage);
      } catch (waError) {
        console.error('Error sending WhatsApp message:', waError);
      }

      alert(
        `✅ Laporan rescue berhasil dikirim!\n\n` +
        `ID Laporan: ${reportId}\n` +
        `Mode: Standard Report\n` +
        `Jenis: ${form.category ? form.category.replace(/_/g, ' ') : 'Tidak Diketahui'}\n\n` +
        `Tim Damkar akan segera menindaklanjuti. Simpan ID laporan untuk tracking.\n\n` +
        `📱 WhatsApp akan terbuka untuk konfirmasi laporan.`
      );

      setForm({
        title: "",
        description: "",
        location: {
          address: "",
          latitude: "",
          longitude: "",
        },
        image: null,
        video: null,
        additionalInfo: "",
        reporterInfo: {
          name: "",
          phone: "",
          address: "",
          rt: "",
          rw: "",
          kelurahan: "",
          kecamatan: "",
        },
        category: null,
        predictResult: null,
      });
      previewImages.forEach(p => URL.revokeObjectURL(p.url));
      setPreviewImages([]);
      setMLValidation(null);
      setCurrentStep(1);
      setErrors({});
      setUserDataError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      navigate("/");
    } catch (err) {
      console.error("Error submitting standard report:", err);

      let errorMessage = "❌ Gagal mengirim laporan. ";

      if (err.response?.status === 413) {
        errorMessage += "Ukuran total file terlalu besar. Maksimal 10MB per file.";
      } else if (err.response?.status === 400) {
        errorMessage += "Data tidak valid. Periksa kembali informasi yang Anda masukkan.";
        if (err.response?.data?.message) {
          errorMessage += `\nDetail: ${err.response.data.message}`;
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage += "Autentikasi gagal. Silakan login kembali.";
      } else if (err.response?.status >= 500) {
        errorMessage += "Server bermasalah, coba beberapa saat lagi.";
      } else {
        errorMessage += err.message || "Terjadi kesalahan tidak terduga.";
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      const firstErrorElement = document.querySelector(".border-red-500");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const formProps = {
    form,
    previewImages,
    mlValidation,
    isSubmitting,
    currentStep,
    errors,
    isOnline,
    locationLoading,
    userDataError,
    fileInputRef,
    onInputChange: handleInputChange,
    onLocationChange: handleLocationChange,
    onSubmit: handleSubmit,
    getCurrentLocation: getCurrentLocation,
    removeImage: removeImage,
    applySuggestion: applySuggestion,
    nextStep: nextStep,
    prevStep: prevStep,
  };

  return <StandardForm {...formProps} />;
}