import { Link, useNavigate } from "react-router-dom";
import { Search, FileText } from "lucide-react";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-red-500 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 select-none">
            <div className="bg-white text-red-500 p-2 rounded">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">
              LAPOR<span className="text-red-200">PAK</span>
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/about"
              className="hover:text-red-200 transition-colors duration-200"
            >
              TENTANG LAPOR
            </Link>
            <Link
              to="/statistics"
              className="hover:text-red-200 transition-colors duration-200"
            >
              STATISTIK
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="hover:text-red-200 transition-colors duration-200"
              >
                DASHBOARD
              </Link>
            )}
              <Link
                to="/reports"
                className="hover:text-red-200 transition-colors duration-200"
              >
                LAPOR DAMKAR
              </Link>
            
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-200 transition-colors duration-200" />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-red-500 px-4 py-2 rounded font-medium hover:bg-red-50 transition duration-200"
            >
              LOGOUT
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline hover:text-red-200 transition-colors duration-200"
              >
                MASUK
              </Link>
              <Link
                to="/register"
                className="bg-white text-red-500 px-4 py-2 rounded font-medium hover:bg-red-50 transition duration-200"
              >
                DAFTAR
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
