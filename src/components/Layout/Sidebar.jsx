import React from "react";
import {
  Home,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart3,
  Brain,
  MapPin,
  Package,
  Play,
  TrendingUp,
} from "lucide-react";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "simulation", label: "Mô phỏng quy trình", icon: Play },
    { id: "mfc", label: "MFC Centers", icon: Warehouse },
    { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
    { id: "inventory", label: "Kho hàng", icon: Package },
    { id: "shippers", label: "Shipper", icon: Users },
    { id: "ai-forecast", label: "Tối ưu Kho", icon: TrendingUp },
  ];

  return (
    <aside className="w-64  bg-gray-900 text-white h-full fixed top-0 left-0 pt-20 overflow-y-auto">
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
