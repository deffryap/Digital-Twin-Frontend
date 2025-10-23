import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, UserCircle, Menu, X, BarChart3, Target } from "lucide-react";

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center space-x-3">
            <button
              className="inline-flex items-center p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/dtfm2.png" alt="FlexoTwin Logo" className="w-8 h-8" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900">FlexoTwin</div>
                <div className="text-xs text-gray-500">Digital Twin System</div>
              </div>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => handleNavClick('/prediction')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/prediction'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="font-medium">Prediksi</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => {
                  setNotifOpen((s) => !s);
                  setUserOpen(false);
                }}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setUserOpen((s) => !s);
                  setNotifOpen(false);
                }}
                className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <UserCircle className="w-8 h-8 text-gray-700" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  Admin
                </span>
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => onLogout && onLogout()}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavClick('/prediction')}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                location.pathname === '/prediction'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Prediksi</span>
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onLogout && onLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
