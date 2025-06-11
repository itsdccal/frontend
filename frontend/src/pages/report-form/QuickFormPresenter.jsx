import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createReport, getUserDetail } from "../../services/api";
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

  const [previewImage, setPreviewImage] = useState(null);
  const [mlValidation, setMLValidation] = useState(null);
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

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ""));
  };

  const validateFileSize = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  };

  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return allowedTypes.includes(file.type);
  };

  const sanitizeInput = (input) => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/[<>]/g, "");
  };

  const simulateMLValidation = useCallback((text) => {
    const lowerText = text.toLowerCase();
    let confidence = 75;
    let isEmergency = false;
    let suggestions = [];

    if (
      lowerText.includes("korban") ||
      lowerText.includes("terjebak") ||
      lowerText.includes("luka") ||
      lowerText.includes("meninggal")
    ) {
      isEmergency = true;
      confidence = 95;
      suggestions.push("Situasi darurat terdeteksi - hubungi 113 segera");
    }

    if (
      lowerText.includes("besar") ||
      lowerText.includes("menyebar") ||
      lowerText.includes("cepat") ||
      lowerText.includes("tidak terkendali")
    ) {
      confidence = 90;
      isEmergency = true;
      suggestions.push("Kebakaran besar - prioritas tinggi");
    }

    if (
      lowerText.includes("asap") ||
      lowerText.includes("tebal") ||
      lowerText.includes("hitam")
    ) {
      suggestions.push("dengan asap tebal");
      confidence += 5;
    }

    if (
      lowerText.includes("gas") ||
      lowerText.includes("ledakan") ||
      lowerText.includes("meledak")
    ) {
      isEmergency = true;
      confidence = 98;
      suggestions.push("Potensi ledakan - evakuasi segera");
    }

    if (lowerText.includes("rescue") || lowerText.includes("penyelamatan")) {
      suggestions.push("Ini mungkin laporan rescue, bukan kebakaran");
      confidence = 60;
    }

    return {
      isKebakaran: !lowerText.includes("rescue"),
      confidence: Math.min(confidence, 98),
      isEmergency,
      suggestions,
      message: isEmergency
        ? `🚨 ML Detection: Emergency situation detected (${confidence}% confidence)`
        : `✅ ML Validation: Fire incident confirmed (${confidence}% confidence)`,
    };
  }, []);

  const validateWithML = useCallback(
    (description) => {
      if (!description || description.length < 10) {
        setMLValidation(null);
        return;
      }

      clearTimeout(validationTimeout);
      const timeout = setTimeout(async () => {
        try {
          const mlResult = simulateMLValidation(description);
          setMLValidation(mlResult);
        } catch (error) {
          console.error("ML validation error:", error);
          setMLValidation({
            isKebakaran: true,
            confidence: 50,
            isEmergency: false,
            suggestions: [],
            message: "⚠️ ML validation unavailable, please review manually",
          });
        }
      }, 1500);

      setValidationTimeout(timeout);
    },
    [validationTimeout, simulateMLValidation]
  );

  const validateForm = () => {
    const newErrors = {};
    const token = localStorage.getItem("token");

    if (!form.title.trim()) newErrors.title = "Judul laporan wajib diisi";
    if (!form.description.trim()) {
      newErrors.description = "Deskripsi kejadian wajib diisi";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Deskripsi terlalu singkat (minimal 10 karakter)";
    }
    if (!form.fireType) newErrors.fireType = "Jenis kebakaran wajib dipilih";
    if (!form.location.latitude || !form.location.longitude) {
      if (!form.location.address.trim()) {
        newErrors.location = "Koordinat atau alamat lokasi wajib diisi";
      }
    }

    if (!token) {
      console.log("Current form state:", form);
      if (!form.reporterInfo.name.trim())
        newErrors.reporterName = "Nama pelapor wajib diisi";
      if (!form.reporterInfo.phone.trim()) {
        newErrors.reporterPhone = "Nomor telepon pelapor wajib diisi";
      } else if (!validatePhone(form.reporterInfo.phone)) {
        newErrors.reporterPhone = "Format nomor telepon tidak valid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let sanitizedValue = typeof value === "string" ? sanitizeInput(value) : value;

    if (name === "image" && files && files[0]) {
      const file = files[0];

      if (!validateFileSize(file)) {
        alert("File terlalu besar (maksimal 10MB)");
        return;
      }

      if (!validateFileType(file)) {
        alert("Format file tidak didukung (hanya JPG, PNG, GIF)");
        return;
      }

      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, [name]: file }));
    } else if (name === "video" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
    } else if (name.startsWith("reporterInfo.")) {
      const reporterInfoField = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        reporterInfo: {
          ...prev.reporterInfo,
          [reporterInfoField]: sanitizedValue,
        },
      }));
    } else if (name.startsWith("location.address")) {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: sanitizedValue,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : sanitizedValue,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } else if (name.startsWith("reporterInfo.")) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.reporterName;
        delete newErrors.reporterPhone;
        return newErrors;
      });
    } else if (
      name === "location.address" ||
      name === "location.latitude" ||
      name === "location.longitude"
    ) {
      if (errors.location) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.location;
          return newErrors;
        });
      }
    }

    if (name === "description") {
      validateWithML(sanitizedValue);
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

  const removeImage = () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setForm((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applySuggestion = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      description: prev.description + (prev.description ? " " : "") + suggestion,
    }));
  };

  const onSubmit = async (e) => {
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
      formData.append("fireType", form.fireType);
      formData.append("urgencyLevel", form.urgencyLevel);
      formData.append("hasCasualties", form.hasCasualties.toString());
      formData.append("reportType", "darurat");

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
      alert(
        `✅ Laporan kebakaran berhasil dikirim!\n\n` +
          `ID Laporan: ${reportId}\n` +
          `Mode: Quick Report\n` +
          `Urgensi: ${form.urgencyLevel.toUpperCase()}\n\n` +
          `Tim Damkar akan segera menindaklanjuti.`
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

      let errorMessage = "❌ Gagal mengirim laporan. ";

      if (err.response?.status === 413) {
        errorMessage += "File terlalu besar (maksimal 10MB).";
      } else if (err.response?.status === 400) {
        errorMessage +=
          "Data tidak valid. Periksa kembali informasi yang Anda masukkan.";
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
    onSubmit: onSubmit,
    getCurrentLocation: getCurrentLocation,
    removeImage: removeImage,
    applySuggestion: applySuggestion,
  };

  return <QuickForm {...formProps} />;
}