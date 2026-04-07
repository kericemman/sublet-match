import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { isLandlord, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            
            <span className="text-xl font-bold text-[#242B38]">Sublet<span className="text-[#3BC0E9]">Match</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-[#3BC0E9]' 
                  : 'text-gray-700 hover:text-[#3BC0E9]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/listings"
              className={`text-sm font-medium transition-colors ${
                isActive('/listings') 
                  ? 'text-[#3BC0E9]' 
                  : 'text-gray-700 hover:text-[#3BC0E9]'
              }`}
            >
              Listings
            </Link>
            {/* <Link
              to="/blogs"
              className={`text-sm font-medium transition-colors ${
                isActive('/blog') 
                  ? 'text-[#3BC0E9]' 
                  : 'text-gray-700 hover:text-[#3BC0E9]'
              }`}
            >
              Blog
            </Link> */}
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-[#3BC0E9]' 
                  : 'text-gray-700 hover:text-[#3BC0E9]'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLandlord && !isAdmin ? (
              <>
                <Link
                  to="/landlord/login"
                  className="text-sm font-medium text-gray-700 hover:text-[#3BC0E9] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/landlord/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] rounded-lg hover:shadow-md transition-all"
                >
                  Post Your Apartment
                </Link>
              </>
            ) : null}

            {isLandlord && (
              <div className="flex items-center space-x-3">
                <Link
                  to="/landlord/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-[#3BC0E9] transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'L'}
                  </span>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-[#3BC0E9] transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 my-1 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-gray-100`}
      >
        <div className="px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            to="/listings"
            onClick={closeMobileMenu}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
          >
            Listings
          </Link>
          <Link
            to="/blogs"
            onClick={closeMobileMenu}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/about"
            onClick={closeMobileMenu}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
          >
            About
          </Link>

          <div className="border-t border-gray-100 pt-3 mt-2">
            {!isLandlord && !isAdmin ? (
              <>
                <Link
                  to="/landlord/login"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/landlord/register"
                  onClick={closeMobileMenu}
                  className="block mt-2 px-4 py-2 text-center text-base font-medium text-white bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] rounded-lg hover:shadow-md transition-all"
                >
                  Post Your Apartment
                </Link>
              </>
            ) : null}

            {isLandlord && (
              <>
                <Link
                  to="/landlord/dashboard"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#3BC0E9] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* User Info in Mobile Menu */}
          {user && (
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#242B38]">{user?.fullName || user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;