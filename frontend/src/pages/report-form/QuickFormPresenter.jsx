import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createReport, getUserDetail, predictedCategory } from "../../services/api";
import { sendWhatsAppMessage, createReportWhatsAppMessage } from "../../services/whatsappservice";
import QuickForm from "./QuickForm";

export default function QuickFormPresenter() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    fireType: "",
    urgencyLevel: "rendah",
    hasCasualties: false,
    location: {
      address: "",
      latitude: "",
      longitude: "",
    },
    image: null,
    video: null,
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
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState(null); 
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userDataError, setUserDataError] = useState(null);
  const fileInputRef = useRef(null);

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
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      clearTimeout(validationTimeout);
    };
  }, [previewImage, validationTimeout]);

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
      .replace(/[<>]/g, "");
  };

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
          const isFireFromML = mlResult.category === "kebakaran";

          setMLValidation({
            isFire: isFireFromML,
            confidence: mlResult.score || 0, 
            suggestions: isFireFromML ? ["Laporan ini terindikasi sebagai kebakaran."] : ["Laporan ini terindikasi sebagai non-kebakaran."],
            message: `Prediksi kategori: ${mlResult.category ? mlResult.category.replace(/_/g, ' ') : 'Tidak diketahui'} (Skor: ${(mlResult.score * 100).toFixed(2)}%)`,
          });

          setForm((prev) => ({
            ...prev,
            category: mlResult.category,
            predictResult: mlResult,
          }));
        } else {
          setMLValidation({
            isFire: false,
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
          isFire: false,
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

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let updatedForm = { ...form };
    let fieldValue = type === "checkbox" ? checked : sanitizeInput(value);

    if (name === "image" && files) {
      const selectedFile = files[0];
      if (selectedFile) {
        if (!validateFileSize(selectedFile)) {
          alert("Ukuran file terlalu besar (maksimal 10MB)");
          if (fileInputRef.current) fileInputRef.current.value = "";
          setPreviewImage(null);
          updatedForm.image = null;
          setForm(updatedForm);
          return;
        }
        if (!validateFileType(selectedFile)) {
          alert("Format file tidak didukung (JPG, PNG, WEBP, MP4, MOV, WEBM)");
          if (fileInputRef.current) fileInputRef.current.value = "";
          setPreviewImage(null);
          updatedForm.image = null;
          setForm(updatedForm);
          return;
        }

        updatedForm.image = selectedFile;
        if (selectedFile.type.startsWith('image/')) {
          setPreviewImage(URL.createObjectURL(selectedFile));
        } else {
          setPreviewImage(null);
        }
      }
    } else if (name.startsWith("reporterInfo.")) {
      const reporterInfoField = name.split(".")[1];
      updatedForm.reporterInfo = {
        ...updatedForm.reporterInfo,
        [reporterInfoField]: fieldValue,
      };
    } else if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      updatedForm.location = {
        ...updatedForm.location,
        [locationField]: fieldValue,
      };
    } else {
      updatedForm[name] = fieldValue;
    }

    setForm(updatedForm);

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "title" || name === "description") {
      const currentTitle = name === "title" ? fieldValue : updatedForm.title;
      const currentDescription = name === "description" ? fieldValue : updatedForm.description;
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

        if (errors.location) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.location;
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

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Judul laporan wajib diisi";
    if (!form.description.trim()) newErrors.description = "Deskripsi wajib diisi";
    if (!form.fireType) newErrors.fireType = "Jenis kebakaran wajib dipilih";
    if (!form.urgencyLevel) newErrors.urgencyLevel = "Tingkat urgensi wajib dipilih";
    if (!form.location.address.trim()) newErrors.locationAddress = "Alamat lokasi wajib diisi";
    if (!form.reporterInfo.name.trim()) newErrors.reporterName = "Nama pelapor wajib diisi";
    if (!form.reporterInfo.phone.trim()) {
      newErrors.reporterPhone = "Nomor telepon wajib diisi";
    } else if (!validatePhone(form.reporterInfo.phone)) {
      newErrors.reporterPhone = "Format nomor telepon tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
      formData.append("reportType", "darurat");
      formData.append("fireType", form.fireType);
      formData.append("hasCasualties", form.hasCasualties);
      formData.append("urgencyLevel", form.urgencyLevel);

      if (form.category) {
        formData.append("category", form.category);
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

      if (
        locationData.coordinates.coordinates[0] === null &&
        locationData.coordinates.coordinates[1] === null
      ) {
        locationData.coordinates = null;
      }

      formData.append("location", JSON.stringify(locationData));

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
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

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

      let effectiveUrgencyLevel = form.urgencyLevel;
      if(form.hasCasualties) {
          effectiveUrgencyLevel = "kritis (ada korban)";
      }

      const whatsappMessage = createReportWhatsAppMessage({
        reportId,
        title: form.title,
        description: form.description,
        urgencyLevel: effectiveUrgencyLevel,
        fireType: form.fireType,
        reporterName: form.reporterInfo.name,
        location: whatsappLocation,
        hasCasualties: form.hasCasualties,
      }, 'darurat');

      try {
        sendWhatsAppMessage('082253217049', whatsappMessage);
      } catch (waError) {
        console.error('Error sending WhatsApp message:', waError);
      }

      alert(
        `✅ Laporan kebakaran berhasil dikirim!\n\n` +
          `ID Laporan: ${reportId}\n` +
          `Mode: Quick Report\n` +
          `Urgensi: ${effectiveUrgencyLevel.toUpperCase()}\n\n` +
          `Tim Damkar akan segera menindaklanjuti.\n\n` +
          `📱 WhatsApp akan terbuka untuk konfirmasi laporan.`
      );

      setForm({
        title: "",
        description: "",
        fireType: "",
        urgencyLevel: "rendah",
        hasCasualties: false,
        location: {
          address: "",
          latitude: "",
          longitude: "",
        },
        image: null,
        video: null,
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
      setPreviewImage(null);
      setMLValidation(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setErrors({});
      setUserDataError(null);

      navigate("/");
    } catch (err) {
      console.error("Error submitting quick report:", err);

      let errorMessage = "❌ Gagal mengirim laporan.";

      if (err.response?.status === 413) {
        errorMessage += " Ukuran file terlalu besar (maksimal 10MB).";
      } else if (err.response?.status === 400) {
        errorMessage += " Data tidak valid. Periksa kembali informasi yang Anda masukkan.";
        if (err.response?.data?.message) {
          errorMessage += `\nDetail: ${err.response.data.message}`;
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage += " Autentikasi gagal. Silakan login kembali.";
      } else if (err.response?.status >= 500) {
        errorMessage += " Server bermasalah, coba beberapa saat lagi.";
      } else {
        errorMessage += ` ${err.message || "Terjadi kesalahan tidak terduga."}`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formProps = {
    form,
    previewImage,
    mlValidation,
    isSubmitting,
    errors,
    isOnline,
    locationLoading,
    userDataError,
    fileInputRef,
    onInputChange: handleInputChange,
    onLocationChange: handleLocationChange,
    onSubmit: handleSubmit,
    getCurrentLocation: getCurrentLocation,
  };

  return <QuickForm {...formProps} />;
}