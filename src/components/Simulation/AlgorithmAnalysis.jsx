import React from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  Navigation,
  Star,
  TrendingUp,
  MapPin,
  Users,
} from "lucide-react";

const AlgorithmAnalysis = ({ result }) => {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "score-excellent border";
    if (score >= 60) return "score-good border";
    return "score-poor border";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <Clock className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
          <Navigation className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Phân tích thuật toán tối ưu
        </h2>
      </div>

      {/* Kết quả được chọn */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600 rounded-xl">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-green-800">
            MFC được chọn: {result.selectedMFC.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Shipper</span>
            </div>
            <p className="text-green-700 font-bold">
              {result.selectedShipper.name}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs text-green-600">
                {result.selectedShipper.rating}/5.0
              </span>
            </div>
          </div>

          <div className="bg-white/70 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Thời gian</span>
            </div>
            <p className="text-green-700 font-bold">
              {result.estimatedDeliveryTime} phút
            </p>
            <p className="text-xs text-green-600">Dự kiến giao hàng</p>
          </div>

          <div className="bg-white/70 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Điểm số</span>
            </div>
            <p className="text-green-700 font-bold">{result.totalScore}/100</p>
            <p className="text-xs text-green-600">Tổng thể</p>
          </div>
        </div>
      </div>

      {/* Chi tiết phân tích từng MFC */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">
            So sánh chi tiết các MFC
          </h3>
        </div>

        {result.analysis.map((analysis, index) => (
          <div
            key={analysis.mfc.id}
            className={`border-2 rounded-2xl p-6 transition-all duration-300 ${
              analysis.isSelected
                ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg"
                : analysis.eliminationReason
                ? "border-red-300 bg-gradient-to-r from-red-50 to-pink-50"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {analysis.isSelected ? (
                  <div className="p-2 bg-green-600 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                ) : analysis.eliminationReason ? (
                  <div className="p-2 bg-red-600 rounded-xl">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {analysis.mfc.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {analysis.mfc.operationalHours}
                  </p>
                </div>
              </div>

              {!analysis.eliminationReason && (
                <div
                  className={`px-4 py-2 rounded-xl text-lg font-bold border-2 ${getScoreColor(
                    analysis.scores.overall
                  )}`}
                >
                  {analysis.scores.overall}/100
                </div>
              )}
            </div>

            {analysis.eliminationReason ? (
              <div className="flex items-center gap-3 p-4 bg-red-100 rounded-xl border border-red-200">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-700">
                  {analysis.eliminationReason}
                </span>
              </div>
            ) : (
              <>
                {/* Điểm số chi tiết */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div
                    className={`p-4 rounded-xl text-center border-2 ${getScoreColor(
                      analysis.scores.distance
                    )}`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {getScoreIcon(analysis.scores.distance)}
                      <span className="text-2xl font-bold">
                        {analysis.scores.distance}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-1">
                      Khoảng cách
                    </div>
                    <div className="text-xs opacity-75">
                      {analysis.details.distanceKm}km
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl text-center border-2 ${getScoreColor(
                      analysis.scores.inventory
                    )}`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {getScoreIcon(analysis.scores.inventory)}
                      <span className="text-2xl font-bold">
                        {analysis.scores.inventory}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-1">Tồn kho</div>
                    <div className="text-xs opacity-75">
                      {analysis.details.inventoryStatus}
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl text-center border-2 ${getScoreColor(
                      analysis.scores.shipper
                    )}`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {getScoreIcon(analysis.scores.shipper)}
                      <span className="text-2xl font-bold">
                        {analysis.scores.shipper}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-1">Shipper</div>
                    <div className="text-xs opacity-75">
                      {analysis.details.availableShippers} khả dụng
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl text-center border-2 ${getScoreColor(
                      analysis.scores.traffic
                    )}`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {getScoreIcon(analysis.scores.traffic)}
                      <span className="text-2xl font-bold">
                        {analysis.scores.traffic}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-1">Giao thông</div>
                    <div className="text-xs opacity-75">
                      {analysis.details.trafficLevel}
                    </div>
                  </div>
                </div>

                {/* Thông tin bổ sung */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        Giờ hoạt động
                      </span>
                      <p className="text-xs text-gray-600">
                        {analysis.mfc.operationalHours}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        Thời gian dự kiến
                      </span>
                      <p className="text-xs text-gray-600">
                        {analysis.details.estimatedTime} phút
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Giải thích thuật toán */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Cách thức hoạt động của thuật toán
        </h3>
        <div className="space-y-4 text-sm text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>
                  <strong>Lọc tồn kho:</strong> Loại bỏ MFC không đủ hàng
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>
                  <strong>Kiểm tra shipper:</strong> Loại bỏ MFC không có
                  shipper khả dụng
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>
                  <strong>Tính điểm:</strong> Đánh giá 4 yếu tố chính
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <span>
                  <strong>Chọn tối ưu:</strong> MFC có điểm cao nhất
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/70 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">Trọng số đánh giá:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>
                  <strong>Khoảng cách:</strong> 30%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3" />
                <span>
                  <strong>Tồn kho:</strong> 25%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>
                  <strong>Shipper:</strong> 25%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                <span>
                  <strong>Giao thông:</strong> 20%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmAnalysis;
