import React from "react";
import DashboardStats from "./DashboardStats";
import MFCStatusGrid from "../MFC/MFCStatusGrid";
import RecentOrders from "../Orders/RecentOrders";
import AIInsights from "../AI/AIInsights";

const Dashboard = () => {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2">
          Dashboard Tổng quan
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Theo dõi hiệu suất hệ thống MFC trong thời gian thực
        </p>
      </div>

      {/* Stats Cards */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-md">
        <DashboardStats />
      </div>

      {/* MFC Status & AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-md">
          <MFCStatusGrid />
        </div>
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-md">
          <AIInsights />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-md">
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;
