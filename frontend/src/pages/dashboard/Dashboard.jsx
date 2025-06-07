import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => navigate("/reports")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition cursor-pointer"
        >
          Buat Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Laporan</h2>
          <p className="text-3xl font-bold text-red-500">123</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Laporan Hari Ini</h2>
          <p className="text-3xl font-bold text-blue-500">6</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
