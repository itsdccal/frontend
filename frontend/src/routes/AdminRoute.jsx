import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const userString = localStorage.getItem("user");
    if (!userString) {
      return <Navigate to="/login" />;
    }

    const user = JSON.parse(userString);
    
    if (!user || !user.role || user.role !== "admin") {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;