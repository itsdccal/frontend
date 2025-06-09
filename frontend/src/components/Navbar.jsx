import { Link, useNavigate } from "react-router-dom";
import { Search, FileText, ChevronDown, Flame, Shield, X, Menu, User, ClipboardList, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsReportDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsReportDropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
    <header className="bg-red-500 text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
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

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsReportDropdownOpen(!isReportDropdownOpen);
                }}
                className="flex items-center space-x-1 hover:text-red-200 transition-colors duration-200 focus:outline-none focus:text-red-200"
                aria-expanded={isReportDropdownOpen}
                aria-haspopup="true"
                type="button"
              >
                <span>LAPOR DAMKAR</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isReportDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              <div 
                className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 transition-all duration-200 ${
                  isReportDropdownOpen 
                    ? 'opacity-100 visible translate-y-0 z-[60]' 
                    : 'opacity-0 invisible -translate-y-2 z-[60] pointer-events-none'
                }`}
                style={{ 
                  minWidth: '320px',
                  maxWidth: '90vw'
                }}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Pilih Jenis Laporan</p>
                  <p className="text-xs text-gray-500">Sesuaikan dengan situasi yang dihadapi</p>
                </div>

                <Link
                  to="/reports/quick"
                  className="flex items-start space-x-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 group"
                  onClick={() => setIsReportDropdownOpen(false)}
                >
                  <div className="bg-red-100 p-2 rounded group-hover:bg-red-200 transition-colors">
                    <Flame className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-red-700">
                      Quick Report Kebakaran
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      2-3 menit • Untuk situasi darurat kebakaran
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Darurat
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Cepat
                      </span>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/reports/standard"
                  className="flex items-start space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 group"
                  onClick={() => setIsReportDropdownOpen(false)}
                >
                  <div className="bg-blue-100 p-2 rounded group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                      Standard Report Rescue
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      5-7 menit • Laporan lengkap untuk penyelamatan
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Lengkap
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Detail
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="border-t border-gray-100 mt-2 pt-2 px-4 py-2">
                  <p className="text-xs text-gray-400">
                    💡 Tip: Gunakan Quick Report untuk situasi yang membutuhkan respon segera
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-200 transition-colors duration-200 hidden sm:block" />

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/my-reports"
                  className="flex items-center space-x-1 hover:text-red-200 transition-colors duration-200"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Laporan Saya</span>
                </Link>

                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.name || 'User'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Saya</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-red-200 transition-colors duration-200"
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

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-red-600 rounded focus:outline-none focus:bg-red-600"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-red-600 border-t border-red-400 relative z-50">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/about"
              className="block hover:text-red-200 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TENTANG LAPOR
            </Link>
            <Link
              to="/statistics"
              className="block hover:text-red-200 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              STATISTIK
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-reports"
                className="block hover:text-red-200 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                LAPORAN SAYA
              </Link>
            )}

            <div className="space-y-3 pt-2 border-t border-red-400">
              <p className="text-sm font-medium text-red-100">LAPOR DAMKAR</p>
              
              <Link
                to="/reports/quick"
                className="block bg-red-700 hover:bg-red-800 rounded-lg p-3 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Flame className="w-5 h-5 text-orange-300" />
                  <div>
                    <div className="font-medium">Quick Report Kebakaran</div>
                    <div className="text-sm text-red-200">Situasi darurat • 2-3 menit</div>
                  </div>
                </div>
              </Link>

              <Link
                to="/reports/standard"
                className="block bg-red-700 hover:bg-red-800 rounded-lg p-3 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-300" />
                  <div>
                    <div className="font-medium">Standard Report Rescue</div>
                    <div className="text-sm text-red-200">Laporan lengkap • 5-7 menit</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="pt-4 border-t border-red-400 space-y-3">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="bg-red-700 rounded-lg p-3">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-red-200">{user.email}</div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block text-center hover:text-red-200 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    PROFILE SAYA
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-white text-red-500 px-4 py-2 rounded font-medium hover:bg-red-50 transition duration-200"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block text-center hover:text-red-200 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MASUK
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full bg-white text-red-500 px-4 py-2 rounded font-medium hover:bg-red-50 transition duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    DAFTAR
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}

export default Navbar;