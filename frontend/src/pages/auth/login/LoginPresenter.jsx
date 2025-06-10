import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/api";
import LoginView from "./Login";

export default function LoginPresenter() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await login(form);
      console.log("Login response:", res);
      
      if (res.status === "success") {
        const token = res.loginResult.token;
        const userData = {
          userId: res.loginResult.userId,
          name: res.loginResult.name,
          role: res.loginResult.role,
          email: form.email
        };
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("User data saved:", userData);
        
        if (userData.role === "admin") {
          console.log("Redirecting to admin dashboard");
          navigate("/admin");
        } else {
          console.log("Redirecting to homepage");
          navigate("/");
        }
      } else {
        alert(res.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login gagal. Cek email & password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView 
      form={form} 
      onChange={handleChange} 
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}