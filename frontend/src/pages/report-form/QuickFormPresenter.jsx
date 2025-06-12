import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createReport, getUserDetail } from "../../services/api";
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

  const validateMLInput = useCallback((title, description, fireType) => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    const timeout = setTimeout(() => {
      const combinedText = `${title} ${description}`.toLowerCase();
      const type = fireType.toLowerCase();
      
      let confidence = 70;
      let suggestions = [];
      let isCorrectCategory = true;

      const fireKeywords = ['api', 'bakar', 'kebakaran', 'terbakar', 'asap', 'flame'];
      const hasFireKeywords = fireKeywords.some(keyword => combinedText.includes(keyword));

      if (!hasFireKeywords && combinedText.length > 0) {
        suggestions.push('Pastikan ini adalah laporan kebakaran');
        confidence = 60;
        isCorrectCategory = false;
      } else if (hasFireKeywords) {
        confidence = 85;
        if (combinedText.includes('besar') || combinedText.includes('parah')) {
          suggestions.push('Situasi terlihat serius - pertimbangkan urgensi tinggi');
          confidence = 90;
        }
      }

      if (combinedText.includes('korban') || combinedText.includes('luka') || combinedText.includes('terjebak')) {
        suggestions.push('Ada indikasi korban - aktifkan "Ada Korban Jiwa"');
        confidence += 5;
      }

      if (type.includes('rumah') && !combinedText.includes('rumah')) {
        suggestions.push('Tambahkan detail lokasi rumah di deskripsi');
      } else if (type.includes('kendaraan') && !combinedText.includes('mobil') && !combinedText.includes('motor')) {
        suggestions.push('Spesifikasikan jenis kendaraan di deskripsi');
      }

      setMLValidation({
        isFire: isCorrectCategory,
        confidence: Math.min(confidence, 95),
        suggestions,
        message: isCorrectCategory 
          ? `Laporan kebakaran tervalidasi (${confidence}% confidence)`
          : `Mungkin bukan laporan kebakaran (${confidence}% confidence)`
      });
    }, 1000);

    setValidationTimeout(timeout);
  }, [validationTimeout]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image" && files) {
      const selectedFile = files[0];
      if (selectedFile) {
        if (!validateFileSize(selectedFile)) {
          alert("Ukuran file terlalu besar (maksimal 10MB)");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setPreviewImage(null);
          setForm(prev => ({ ...prev, image: null }));
          return;
        }
        if (!validateFileType(selectedFile)) {
          alert("Format file tidak didukung (JPG, PNG, WEBP, MP4, MOV, WEBM)");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setPreviewImage(null);
          setForm(prev => ({ ...prev, image: null }));
          return;
        }

        setForm(prev => ({ ...prev, image: selectedFile }));
        
        if (selectedFile.type.startsWith('image/')) {
          setPreviewImage(URL.createObjectURL(selectedFile));
        } else {
          setPreviewImage(null);
        }
      }
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
      const fieldValue = type === "checkbox" ? checked : sanitizeInput(value);
      setForm((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "title" || name === "description" || name === "fireType") {
      validateMLInput(
        name === "title" ? value : form.title,
        name === "description" ? value : form.description,
        name === "fireType" ? value : form.fireType
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

      for (let pair of formData.entries()) {
        if (pair[0] === "image" || pair[0] === "video") {
          console.log(pair[0], ":", pair[1].name); 
        } else if (pair[0] === "location" || pair[0] === "reporterInfo") {
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
        urgencyLevel: form.urgencyLevel,
        reporterName: form.reporterInfo.name,
        phone: form.reporterInfo.phone,
        location: form.location
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
          `Urgensi: ${form.urgencyLevel.toUpperCase()}\n\n` +
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