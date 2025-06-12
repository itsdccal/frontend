export const sendWhatsAppMessage = (phoneNumber, message) => {
  try {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0")
      ? "62" + cleanPhone.slice(1)
      : cleanPhone.startsWith("62")
      ? cleanPhone
      : "62" + cleanPhone;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    return { success: true, url: whatsappUrl };
  } catch (error) {
    console.error("Error creating WhatsApp URL:", error);
    throw error;
  }
};

export const createReportWhatsAppMessage = (reportData, reportType) => {
  const {
    reportId,
    title,
    description,
    urgencyLevel,
    fireType,
    rescueType,
    reporterName,
    location,
  } = reportData;

  let message = `🚨 *LAPORAN BARU DITERIMA* 🚨\n\n`;
  message += `📋 *ID Laporan:* ${reportId}\n`;
  message += `👤 *Pelapor:* ${reporterName}\n`;
  message += `📝 *Judul:* ${title} (${fireType || ""})\n`;
  message += `📝 *Deskripsi:* ${description}\n`;
  message += `🏷️ *Jenis:* ${
    reportType === "darurat"
      ? "Laporan Darurat (Kebakaran)"
      : "Laporan Biasa (Rescue)"
  }\n`;

  if (reportType === "darurat" && urgencyLevel) {
    message += `⚠️ *Tingkat Urgensi:* ${urgencyLevel.toUpperCase()}\n`;
  }

  if (reportType === "biasa" && rescueType) {
    message += `🆘 *Tipe Rescue:* ${rescueType}\n`;
  }

  if (location && location.address) {
    message += `\n📍 *LOKASI KEJADIAN:*\n`;
    message += `🏠 Alamat: ${location.address}\n`;

  if (location.coordinates && location.coordinates.coordinates) {
      const [longitude, latitude] = location.coordinates.coordinates; 
      message += `📱 Google Maps: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}\n`;
    }
  }

  message += `\n✅ Tim Damkar akan segera menindaklanjuti laporan Anda.`;
  message += `\n📞 Pastikan nomor telepon Anda aktif untuk koordinasi lebih lanjut.`;
  message += `\n\n🔍 Untuk tracking status laporan, gunakan ID Laporan di atas.`;

  return message;
};
