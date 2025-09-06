import React, { useState } from "react";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";

const Header = ({ sidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header
      className={`bg-white border-b border-gray-200 px-4 sm:px-6 py-3 z-50 fixed top-0 right-0  shadow-sm transition-all duration-300 ${
        sidebarOpen ? "w-full" : "ml-0 w-full"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo + Location */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            MFC Management
          </h1>
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            TP. Hồ Chí Minh
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 relative">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full">
            <Bell className="h-5 sm:h-6 w-5 sm:w-6" />
            <span className="absolute -top-1 -right-1 h-3 sm:h-4 w-3 sm:w-4 bg-red-500 text-white text-xs sm:text-xs rounded-full flex items-center justify-center font-semibold">
              3
            </span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <User className="h-4 sm:h-5 w-4 sm:w-5" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                Admin User
              </span>
              <ChevronDown
                className={`h-3 sm:h-4 w-3 sm:w-4 text-gray-500 transition-transform ${
                  userMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 sm:py-2 z-50 opacity-100 transition-opacity animate-fadeIn">
                <button className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                  <Settings className="h-4 w-4 mr-2" /> Cài đặt
                </button>
                <button className="flex items-center px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                  <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
