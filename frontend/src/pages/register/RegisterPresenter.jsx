// src/pages/register/RegisterPresenter.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import RegisterView from "./Register";

export default function RegisterPresenter() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "pelapor",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);

      if (res.status === "success") {
        alert(res.message || "Registrasi berhasil!");
        navigate("/login");
      } else {
        alert(res.message || "Registrasi gagal.");
      }

    } catch (error) {
      console.error("Register Error:", error);
      alert(error.message || "Registrasi gagal. Cek console untuk detail.");
    }
  };

  return (
    <RegisterView
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
