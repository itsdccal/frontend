import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createReport, getUserDetail } from "../../services/api"; 
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
    rescueType: "",
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
    const maxSize = 10 * 1024 * 1024; // 10MB
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
      .replace(/[<>]/g, "");
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
      clearTimeout(validationTimeout); 
    };
  }, [validationTimeout]);

  useEffect(() => {
      return () => {
        previewImages.forEach((previewItem) => {
          if (previewItem.url && previewItem.url.startsWith("blob:")) {
            URL.revokeObjectURL(previewItem.url);
          }
        });
      };
    }, [previewImages]);

  const simulateMLValidation = useCallback((text, type) => {
    const lowerText = text.toLowerCase();
    let confidence = 75;
    let isCorrectCategory = true;
    let suggestions = [];

    if (lowerText.includes('kebakaran') || lowerText.includes('api') || lowerText.includes('terbakar') || lowerText.includes('asap')) {
      isCorrectCategory = false;
      confidence = 90;
      suggestions.push('Ini sepertinya laporan kebakaran, bukan rescue');
    } else if (lowerText.includes('kunci') && type !== 'pembongkaran_kunci') {
      suggestions.push('Mungkin yang dimaksud pembongkaran kunci?');
      confidence = 85;
    } else if ((lowerText.includes('hewan') || lowerText.includes('kucing') || lowerText.includes('anjing')) && !type.includes('hewan') && !type.includes('kucing')) {
      suggestions.push('Sepertinya terkait penyelamatan hewan');
      confidence = 80;
    } else if ((lowerText.includes('air') || lowerText.includes('sungai') || lowerText.includes('kolam')) && type !== 'penyelamatan_air') {
      suggestions.push('Mungkin penyelamatan dari air?');
      confidence = 82;
    }

    if (lowerText.includes('darurat') || lowerText.includes('segera') || lowerText.includes('urgent')) {
      suggestions.push('Prioritas tinggi terdeteksi');
      confidence += 5;
    }

    return {
      isRescue: isCorrectCategory,
      confidence: Math.min(confidence, 95),
      suggestions,
      message: isCorrectCategory
        ? `✅ ML Validation: Rescue operation confirmed (${confidence}% confidence)`
        : `⚠️ ML Warning: This might be fire-related, not rescue (${confidence}% confidence)`
    };
  }, []); 

  const validateWithML = useCallback(
    (description, rescueType) => {
      if (!description || description.length < 10) {
        setMLValidation(null);
        return;
      }

      clearTimeout(validationTimeout);
      const timeout = setTimeout(async () => {
        try {
          const mlResult = simulateMLValidation(description, rescueType);
          setMLValidation(mlResult);
        } catch (error) {
          console.error("ML validation error:", error);
          setMLValidation({
            isRescue: true,
            confidence: 50,
            suggestions: [],
            message: "⚠️ Validasi ML tidak tersedia, harap tinjau manual",
          });
        }
      }, 1500);
      setValidationTimeout(timeout);
    },
    [validationTimeout, simulateMLValidation]
  );

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
      if (!form.rescueType) newErrors.rescueType = "Jenis rescue wajib dipilih";
      if (!form.title.trim()) newErrors.title = "Judul laporan wajib diisi";
      if (!form.description.trim()) {
        newErrors.description = "Deskripsi kejadian wajib diisi";
      } else if (form.description.trim().length < 20) {
        newErrors.description = "Deskripsi terlalu singkat (minimal 20 karakter)";
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
          newPreviews.push({ type: 'image', url: URL.createObjectURL(file), name: file.name });
        } else if (file.type.startsWith("video/")) {
          newVideo = file;
          newPreviews.push({ type: 'video', url: URL.createObjectURL(file), name: file.name });
        }
      });

      if (fileErrors.length > 0) {
        alert(fileErrors.join("\n"));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.reporterName;
        delete newErrors.reporterPhone;
        delete newErrors.reporterAddress;
        delete newErrors.reporterKelurahan;
        delete newErrors.reporterKecamatan;
        return newErrors;
      });
    }
    if (name.startsWith("location.")) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.location;
        delete newErrors.coordinates;
        return newErrors;
      });
    }

    if (name === "description" || name === "rescueType") {
      validateWithML(
        name === "description" ? sanitizeInput(value) : form.description,
        name === "rescueType" ? sanitizeInput(value) : form.rescueType
      );
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

  const removeImage = (index) => {
    if (previewImages[index] && previewImages[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(previewImages[index].url);
    }

    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);

    let newImage = form.image;
    let newVideo = form.video;

    const removedFile = previewImages[index];
    if (removedFile.type === 'image') {
        newImage = null; 
    } else if (removedFile.type === 'video') {
        newVideo = null; 
    }

    setForm((prev) => ({
      ...prev,
      image: newImage,
      video: newVideo,
    }));

    if (updatedPreviews.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const applySuggestion = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      description: prev.description + (prev.description ? " " : "") + suggestion,
    }));
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

      formData.append("rescueType", form.rescueType);
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
          } else if (pair[0] === "location") {
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
      alert(
        `✅ Laporan rescue berhasil dikirim!\n\n` +
          `ID Laporan: ${reportId}\n` +
          `Mode: Standard Report\n` +
          `Jenis: ${form.rescueType}\n\n` +
          `Tim Damkar akan segera menindaklanjuti. Simpan ID laporan untuk tracking.`
      );

      setForm({
        title: "",
        description: "",
        location: {
          address: "",
          latitude: "",
          longitude: "",
        },
        images: [],
        video: null,
        rescueType: "",
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
      });
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