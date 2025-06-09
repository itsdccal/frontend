import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/login/LoginPresenter";
import Register from "./pages/auth/register/RegisterPresenter";
import Homepage from "./pages/homepage/Homepage";
import MyReports from "./pages/user/MyReports";
import Profile from "./pages/user/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";

import StandardReportForm from "./pages/report-form/StandardFormPresenter";
import QuickReportForm from "./pages/report-form/QuickFormPresenter";

import About from "./pages/about/About";
import Statistics from "./pages/statistics/Statistics";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/statistics" element={<Statistics />} />
        
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
      </Routes>
    </Router>
  );
}

export default App;