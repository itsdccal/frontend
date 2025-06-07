// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/login/LoginPresenter";
import Register from "./pages/register/RegisterPresenter";
import Dashboard from "./pages/dashboard/Dashboard";
import Homepage from "./pages/homepage/Homepage";
import ReportForm from "./pages/report-form/ReportFormPresenter";

import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<ReportForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
