import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api";
import LoginView from "./Login";

export default function LoginPresenter() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.email === "admin@damkar.go.id" && form.password === "admin123") {
      localStorage.setItem("token", "admin-token");
      navigate("/admin");
      return;
    }
    
    try {
      const res = await login(form);
      if (res.status === "success") {
        localStorage.setItem("token", res.loginResult.token);
        navigate("/");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Login gagal. Cek email & password.");
    }
  };

  return (
    <LoginView form={form} onChange={handleChange} onSubmit={handleSubmit} />
  );
}