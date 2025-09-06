import React, { useState } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import MFCManagement from "./components/MFC/MFCManagement";
import OrderManagement from "./components/Orders/OrderManagement";
import SimulationDashboard from "./components/Simulation/SimulationDashboard";
import InventoryManagement from "./components/Inventory/InventoryManagement";
import ShipperManagement from "./components/Shippers/ShipperManagement";
import InventoryOptimization from "./components/Simulation/InventoryOptimization";
import { X, ChevronRight } from "lucide-react";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "simulation":
        return <SimulationDashboard />;
      case "mfc":
        return <MFCManagement />;
      case "orders":
        return <OrderManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "shippers":
        return <ShipperManagement />;
      case "ai-forecast":
        return <InventoryOptimization />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-gray-900 z-40">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Sidebar mobile */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 md:hidden">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <Sidebar
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setMobileSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header */}
        <Header
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
          sidebarOpen={true}
        />

        {/* Mobile open button */}
        {!mobileSidebarOpen && (
          <button
            className="fixed top-1/2 left-0 z-50 p-2 bg-blue-600 rounded-r-md md:hidden shadow-md"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Main content */}
        <main className="pt-20 px-6 py-8">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
