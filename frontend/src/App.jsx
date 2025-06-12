import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/login/LoginPresenter";
import Register from "./pages/auth/register/RegisterPresenter";
import Homepage from "./pages/homepage/Homepage";
import MyReports from "./pages/user/MyReports";
import Profile from "./pages/user/Profile";

import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

import StaffRoute from "./routes/StaffRoute";
import StaffDashboard from "./pages/staff/StaffDashboard";

import StandardReportForm from "./pages/report-form/StandardFormPresenter";
import QuickReportForm from "./pages/report-form/QuickFormPresenter";

import About from "./pages/about/About";

import "leaflet/dist/leaflet.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <>
      {!isAdminRoute && !isStaffRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        
        <Route path="/reports/quick" element={<QuickReportForm />} />
        <Route path="/reports/standard" element={<StandardReportForm />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/reports/quick/protected" element={<QuickReportForm />} />
          <Route path="/reports/standard/protected" element={<StandardReportForm />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<StaffRoute />}>
          <Route path="/staff" element={<StaffDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;