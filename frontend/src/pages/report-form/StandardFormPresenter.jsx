import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createReport, getUserDetail } from "../../services/api"; 
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
      .trim();
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getUserDetail("me");
          if (userData && userData.data) {
            setForm((prev) => ({
              ...prev,
              reporterInfo: {
                name: userData.data.name || "",
                phone: userData.data.phone || "",
                address: userData.data.address || "",
                rt: userData.data.rt || "",
                rw: userData.data.rw || "",
                kelurahan: userData.data.kelurahan || "",
                kecamatan: userData.data.kecamatan || "",
              },
            }));
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          setUserDataError("Gagal memuat data pengguna. Silakan isi manual.");
        }
      }
    };

    loadUserData();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung di browser ini.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          },
        }));

        fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted;
              setForm((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: address,
                },
              }));
            }
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
          })
          .finally(() => {
            setLocationLoading(false);
          });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const validateMLInput = useCallback((title, description, type) => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    const timeout = setTimeout(() => {
      const combinedText = `${title} ${description}`.toLowerCase();
      const rescueType = type.toLowerCase();
      
      let confidence = 70;
      let suggestions = [];
      let isCorrectCategory = true;

      const rescueKeywords = ['selamat', 'tolong', 'bantuan', 'terjebak', 'tenggelam', 'jatuh', 'terjepit'];
      const hasRescueKeywords = rescueKeywords.some(keyword => combinedText.includes(keyword));

      if (!hasRescueKeywords && combinedText.length > 0) {
        suggestions.push('Pastikan ini adalah laporan penyelamatan/rescue');
        confidence = 60;
        isCorrectCategory = false;
      } else if (hasRescueKeywords) {
        confidence = 85;
      }

      if ((combinedText.includes('hewan') || combinedText.includes('kucing') || combinedText.includes('anjing')) && !rescueType.includes('hewan') && !rescueType.includes('kucing')) {
        suggestions.push('Sepertinya terkait penyelamatan hewan');
        confidence = 80;
      } else if ((combinedText.includes('air') || combinedText.includes('sungai') || combinedText.includes('kolam')) && rescueType !== 'penyelamatan_air') {
        suggestions.push('Mungkin penyelamatan dari air?');
        confidence = 82;
      }

      if (combinedText.includes('darurat') || combinedText.includes('segera') || combinedText.includes('urgent')) {
        suggestions.push('Prioritas tinggi terdeteksi');
        confidence += 5;
      }

      setMLValidation({
        isRescue: isCorrectCategory,
        confidence: Math.min(confidence, 95),
        suggestions,
        message: isCorrectCategory
          ? `Laporan rescue tervalidasi (${confidence}% confidence)`
          : `Mungkin bukan laporan rescue (${confidence}% confidence)`
      });
    }, 1000);

    setValidationTimeout(timeout);
  }, [validationTimeout]);

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    
    const newForm = { ...form };
    if (index === 0 && previewImages[0]?.type === 'image') {
      newForm.image = null;
    } else if (index === 0 && previewImages[0]?.type === 'video') {
      newForm.video = null;
    } else if (index === 1 && previewImages[1]?.type === 'video') {
      newForm.video = null;
    }
    
    setForm(newForm);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applySuggestion = (suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();
    if (lowerSuggestion.includes('hewan')) {
      setForm(prev => ({ ...prev, rescueType: 'penyelamatan_hewan' }));
    } else if (lowerSuggestion.includes('air')) {
      setForm(prev => ({ ...prev, rescueType: 'penyelamatan_air' }));
    }
    
    setMLValidation(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s !== suggestion)
    }));
  };

  const validateStep = useCallback((step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.title.trim()) newErrors.title = "Judul laporan wajib diisi";
      if (!form.description.trim()) newErrors.description = "Deskripsi wajib diisi";
      if (!form.rescueType) newErrors.rescueType = "Jenis rescue wajib dipilih";
    } else if (step === 2) {
      if (!form.location.address.trim()) {
        newErrors.locationAddress = "Alamat lokasi wajib diisi atau klik pada peta.";
      }
    } else if (step === 3) {
      if (!form.reporterInfo.name.trim()) newErrors.reporterName = "Nama pelapor wajib diisi";
      if (!form.reporterInfo.phone.trim()) {
        newErrors.reporterPhone = "Nomor telepon wajib diisi";
      } else if (!validatePhone(form.reporterInfo.phone)) {
        newErrors.reporterPhone = "Format nomor telepon tidak valid";
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        if (!form.reporterInfo.kelurahan.trim()) newErrors.reporterKelurahan = "Kelurahan wajib diisi";
        if (!form.reporterInfo.kecamatan.trim()) newErrors.reporterKecamatan = "Kecamatan wajib diisi";
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
      const reporterInfoField = name.split(".")[1];
      if (errors[`reporter${reporterInfoField.charAt(0).toUpperCase() + reporterInfoField.slice(1)}`]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`reporter${reporterInfoField.charAt(0).toUpperCase() + reporterInfoField.slice(1)}`];
          return newErrors;
        });
      }
    }

    if (name === "title" || name === "description" || name === "rescueType") {
      validateMLInput(
        name === "title" ? value : form.title,
        name === "description" ? value : form.description,
        name === "rescueType" ? value : form.rescueType
      );
    }
  };

  const handleLocationChange = (address, latitude, longitude) => {
    setForm((prev) => ({
      ...prev,
      location: {
        address: address || "",
        latitude: latitude?.toString() || "",
        longitude: longitude?.toString() || "",
      },
    }));

    if (errors.locationAddress) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.locationAddress;
        return newErrors;
      });
    }
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
      
      const whatsappMessage = createReportWhatsAppMessage({
        reportId,
        title: form.title,
        rescueType: form.rescueType,
        reporterName: form.reporterInfo.name,
        phone: form.reporterInfo.phone,
        location: form.location
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
          `Jenis: ${form.rescueType}\n\n` +
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