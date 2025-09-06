import React from "react";
import { MapPin, Package, AlertTriangle, Info } from "lucide-react";
import { mfcData } from "../../data/mockData";

const MFCStatusGrid = () => {
  const getStatusStyle = (status, loadPercentage) => {
    if (status === "maintenance")
      return { badge: "bg-amber-100 text-amber-800 border-amber-300", bar: "bg-amber-500" };
    if (status === "inactive")
      return { badge: "bg-red-100 text-red-800 border-red-300", bar: "bg-red-500" };
    if (loadPercentage > 90)
      return { badge: "bg-red-100 text-red-800 border-red-300", bar: "bg-red-500" };
    if (loadPercentage > 75)
      return { badge: "bg-amber-100 text-amber-800 border-amber-300", bar: "bg-amber-500" };
    return { badge: "bg-green-100 text-green-800 border-green-300", bar: "bg-green-500" };
  };

  const getStatusText = (status, loadPercentage) => {
    if (status === "maintenance") return "Bảo trì";
    if (status === "inactive") return "Ngừng hoạt động";
    if (loadPercentage > 90) return "Quá tải";
    if (loadPercentage > 75) return "Gần đầy";
    return "Hoạt động tốt";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h3 className="text-2xl font-bold text-gray-800">📦 Trạng thái MFC Centers</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium self-start sm:self-auto">
          Xem tất cả
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {mfcData.map((mfc) => {
          const loadPercentage = Math.round((mfc.currentLoad / mfc.capacity) * 100);
          const { badge, bar } = getStatusStyle(mfc.status, loadPercentage);
          const statusText = getStatusText(mfc.status, loadPercentage);

          return (
            <div
              key={mfc.id}
              className="relative rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Info Tooltip */}
              <div className="absolute top-3 right-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md z-10">
                {mfc.description || "Thông tin chi tiết MFC"}
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg truncate">{mfc.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1 truncate">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    {mfc.district}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${badge}`}>
                  {statusText}
                </span>
              </div>

              {/* Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-1" />
                    Sử dụng
                  </div>
                  <span className="font-medium text-gray-800">
                    {mfc.currentLoad}/{mfc.capacity} ({loadPercentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${bar} transition-all duration-500 ease-in-out`}
                    style={{ width: `${loadPercentage}%` }}
                  />
                </div>
              </div>

              {/* Alert */}
              {loadPercentage > 85 && (
                <div className="flex items-center mt-3 text-amber-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Cần bổ sung hàng hóa
                </div>
              )}

              {/* Info Icon */}
              <Info className="absolute top-3 right-3 h-4 w-4 text-gray-400 group-hover:text-gray-200 cursor-pointer" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MFCStatusGrid;
