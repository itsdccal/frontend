import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole") || "pelapor";

  const isAuthenticated = !!token;
  const isAdmin = userRole === "admin";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default AdminRoute;
