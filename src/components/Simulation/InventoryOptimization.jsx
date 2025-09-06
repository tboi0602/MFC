import React, { useState } from "react";
import {
  Brain,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  mfcData,
  inventoryData,
  productData,
  demandForecastData,
} from "../../data/mockData";
import { optimizeInventoryDistribution } from "../../utils/algorithms";

const InventoryOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = optimizeInventoryDistribution(
      mfcData,
      inventoryData,
      productData,
      demandForecastData
    );

    setOptimizationResult(result);
    setIsOptimizing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Khẩn cấp";
      case "medium":
        return "Quan trọng";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  const inventoryStatus = mfcData.map((mfc) => {
    const mfcInventory = inventoryData.filter((inv) => inv.mfcId === mfc.id);
    const totalItems = mfcInventory.reduce((sum, inv) => sum + inv.quantity, 0);
    const lowStockItems = mfcInventory.filter(
      (inv) => inv.quantity <= inv.minThreshold
    ).length;
    const overStockItems = mfcInventory.filter(
      (inv) => inv.quantity >= inv.maxCapacity * 0.9
    ).length;

    return {
      mfc,
      totalItems,
      lowStockItems,
      overStockItems,
      efficiency: Math.round(
        ((mfcInventory.length - lowStockItems - overStockItems) /
          mfcInventory.length) *
          100
      ),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Tối ưu Tồn kho AI
          </h2>
          <p className="text-gray-600">
            Phân tích và tối ưu hóa phân phối hàng hóa giữa các MFC
          </p>
        </div>
        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang phân tích...</span>
            </>
          ) : (
            <>
              <Brain className="h-5 w-5" />
              <span>Chạy AI Tối ưu</span>
            </>
          )}
        </button>
      </div>

      {/* Current Inventory Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStatus.map((status) => (
          <div
            key={status.mfc.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status.mfc.name}</h3>
              <div
                className={`w-3 h-3 rounded-full ${
                  status.mfc.status === "active"
                    ? "bg-green-500"
                    : status.mfc.status === "maintenance"
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              ></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng sản phẩm</span>
                <span className="font-semibold">{status.totalItems}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hiệu suất kho</span>
                <span
                  className={`font-semibold ${
                    status.efficiency >= 80
                      ? "text-green-600"
                      : status.efficiency >= 60
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {status.efficiency}%
                </span>
              </div>

              {status.lowStockItems > 0 && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {status.lowStockItems} mặt hàng thiếu
                </div>
              )}

              {status.overStockItems > 0 && (
                <div className="flex items-center text-amber-600 text-sm">
                  <Package className="h-4 w-4 mr-1" />
                  {status.overStockItems} mặt hàng dư thừa
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optimization Results */}
      {isOptimizing && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-lg font-medium text-gray-700">
              AI đang phân tích dữ liệu tồn kho và dự báo nhu cầu...
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Đang xử lý {inventoryData.length} mặt hàng tại {mfcData.length} MFC
            centers
          </div>
        </div>
      )}

      {optimizationResult && !isOptimizing && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Kết quả Tối ưu hóa
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {
                    optimizationResult.recommendations.filter(
                      (r) => r.priority === "high"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Cần xử lý khẩn cấp</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {
                    optimizationResult.recommendations.filter(
                      (r) => r.priority === "medium"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Cần chú ý</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {
                    optimizationResult.recommendations.filter(
                      (r) => r.priority === "low"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Tối ưu thêm</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Khuyến nghị Tối ưu hóa
            </h4>

            <div className="space-y-4">
              {optimizationResult.recommendations.map((rec, index) => {
                const mfc = mfcData.find((m) => m.id === rec.mfcId);
                const product = productData.find((p) => p.id === rec.productId);

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getPriorityColor(
                      rec.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold">{mfc?.name}</div>
                        <div className="text-sm opacity-75">
                          {product?.name}
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/50">
                        {getPriorityText(rec.priority)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm opacity-75">Hiện tại</div>
                        <div className="font-bold text-lg">
                          {rec.currentStock}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm opacity-75">Khuyến nghị</div>
                        <div className="font-bold text-lg">
                          {rec.recommendedStock}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm opacity-90 mb-3">{rec.reason}</div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        Thay đổi:{" "}
                        <span
                          className={`font-semibold ${
                            rec.recommendedStock > rec.currentStock
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {rec.recommendedStock > rec.currentStock ? "+" : ""}
                          {rec.recommendedStock - rec.currentStock}
                        </span>
                      </div>
                      <button className="text-sm font-medium hover:underline">
                        Áp dụng
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Current Inventory Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Chi tiết Tồn kho Hiện tại
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  MFC
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Sản phẩm
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Hiện có
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Min/Max
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((inv) => {
                const mfc = mfcData.find((m) => m.id === inv.mfcId);
                const product = productData.find((p) => p.id === inv.productId);
                const isLow = inv.quantity <= inv.minThreshold;
                const isHigh = inv.quantity >= inv.maxCapacity * 0.9;

                return (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">{mfc?.name}</td>
                    <td className="py-3 px-4">{product?.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          isLow
                            ? "text-red-600"
                            : isHigh
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {inv.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {inv.minThreshold} / {inv.maxCapacity}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isLow
                            ? "bg-red-100 text-red-800"
                            : isHigh
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isLow ? "Thiếu hàng" : isHigh ? "Dư thừa" : "Tối ưu"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryOptimization;
