import { useState, useCallback } from "react";
import Map from "../Simulation/Map";
import ProductSelector from "../Simulation/ProductSelector";
import AlgorithmAnalysis from "../Simulation/AlgorithmAnalysis";
import { mfcs, products, formatCurrency } from "../../data/mockData";
import { optimizeOrderAllocation } from "../../utils/algorithms";
import {
  MapPin,
  ShoppingBag,
  AlertCircle,
  Zap,
  Target,
  Clock,
} from "lucide-react";

function SimulationDashboard() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [algorithmResult, setAlgorithmResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSelect = useCallback((lat, lng) => {
    setSelectedLocation({ lat, lng });
    setAlgorithmResult(null);
  }, []);

  const handleUpdateOrderItems = useCallback((items) => {
    setOrderItems(items);
    setAlgorithmResult(null);
  }, []);

  const runOptimization = async () => {
    if (!selectedLocation) {
      setError("Vui lòng chọn vị trí khách hàng trên bản đồ");
      return;
    }
    if (orderItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = optimizeOrderAllocation(
        selectedLocation.lat,
        selectedLocation.lng,
        orderItems,
        products,
        mfcs
      );

      const allShippers = mfcs.flatMap((mfc) => mfc.shippers);

      let selectedShipper = null;
      if (result && result.selectedMFC) {
        const mfc = result.selectedMFC;
        selectedShipper = allShippers
          .filter((s) => s.isAvailable)
          .reduce((closest, s) => {
            const distance = (lat1, lng1, lat2, lng2) =>
              Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
            if (!closest) return s;
            return distance(s.lat, s.lng, mfc.lat, mfc.lng) <
              distance(closest.lat, closest.lng, mfc.lat, mfc.lng)
              ? s
              : closest;
          }, null);
      }

      let route = null;
      if (selectedShipper && result?.selectedMFC) {
        route = [
          [selectedShipper.lat, selectedShipper.lng],
          [result.selectedMFC.lat, result.selectedMFC.lng],
          [selectedLocation.lat, selectedLocation.lng],
        ];
      }

      setAlgorithmResult({
        ...result,
        selectedShipper,
        route,
      });
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi chạy thuật toán");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass-card border-b-0 rounded-none">
        <div className="max-w-7xl mx-auto px-1 sm:px-3 py-1 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-1 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <ShoppingBag className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold gradient-text">
                  Hệ thống Phân bổ Đơn hàng MFC
                </h1>
                <p className="text-gray-600 font-medium text-xs sm:text-base">
                  Tối ưu hóa giao hàng thông minh với AI
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">MFC Centers</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Shippers</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-1 sm:px-3 py-2 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="xl:col-span-4 space-y-4 sm:space-y-6">
            <div className="glass-card rounded-2xl p-2 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-3">
                  <MapPin className="h-4 w-4 sm:h-7 sm:w-7 text-blue-600" />
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    Bản đồ giao hàng
                  </h2>
                </div>
                {selectedLocation && (
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-blue-50 rounded-lg border border-blue-200 text-xs sm:text-sm">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      Vị trí: {selectedLocation.lat.toFixed(4)},{" "}
                      {selectedLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-[350px] sm:h-[500px] rounded-xl overflow-hidden shadow-inner border border-gray-200">
                <Map
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                  mfcs={mfcs}
                  selectedMFC={algorithmResult?.selectedMFC}
                  selectedShipper={algorithmResult?.selectedShipper}
                  route={algorithmResult?.route}
                />
              </div>
              <div className="mt-2 sm:mt-4 p-1 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-700">
                💡 <strong>Hướng dẫn:</strong> Nhập địa chỉ của bạn để chọn địa
                chỉ giao hàng
              </div>
            </div>
            {algorithmResult && <AlgorithmAnalysis result={algorithmResult} />}
          </div>

          {/* Right Column */}
          <div className="space-y-3 sm:space-y-5 xl:col-span-2">
            <ProductSelector
              products={products}
              orderItems={orderItems}
              onUpdateOrderItems={handleUpdateOrderItems}
            />

            {/* Order Summary */}
            <div className="glass-card rounded-2xl p-2 sm:p-4">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                Tóm tắt đơn hàng
              </h3>
              {orderItems.length > 0 ? (
                <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-4">
                  {orderItems.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    if (!product) return null;
                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center py-1 sm:py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                          <span className="text-gray-500 ml-1 sm:ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(product.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 sm:p-3 rounded-xl border border-blue-200 text-xs sm:text-sm">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-gray-700 font-medium">
                        Tổng số lượng:
                      </span>
                      <span className="font-bold text-gray-900">
                        {getTotalItems()} sản phẩm
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">
                        Tổng tiền:
                      </span>
                      <span className="text-lg sm:text-2xl font-bold gradient-text">
                        {formatCurrency(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 sm:py-4">
                  <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-1 sm:mb-2" />
                  <p className="text-gray-500 font-medium text-xs sm:text-base">
                    Chưa có sản phẩm nào được chọn
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Hãy chọn sản phẩm để bắt đầu
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-2 sm:mb-4 p-1 sm:p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={runOptimization}
                disabled={
                  isLoading || !selectedLocation || orderItems.length === 0
                }
                className={`w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
                  isLoading || !selectedLocation || orderItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-primary pulse-glow"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang tối ưu hóa...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" /> Chạy thuật toán
                    tối ưu
                  </>
                )}
              </button>

              {algorithmResult && (
                <div className="mt-2 sm:mt-4 p-1 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-700 font-bold">
                      ✅ Đã tìm thấy MFC tối ưu:{" "}
                      {algorithmResult.selectedMFC.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    <p className="text-green-600 font-medium text-xs sm:text-sm">
                      Thời gian giao hàng dự kiến:{" "}
                      {algorithmResult.estimatedDeliveryTime} phút
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="glass-card rounded-2xl p-2 sm:p-4">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-base">
                <Target className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" /> Thống
                kê hệ thống
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="metric-card text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {mfcs.length}
                  </div>
                  <div className="text-gray-600 font-medium">MFC Centers</div>
                </div>
                <div className="metric-card text-center">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {mfcs.reduce(
                      (total, mfc) => total + mfc.shippers.length,
                      0
                    )}
                  </div>
                  <div className="text-gray-600 font-medium">Shippers</div>
                </div>
                <div className="metric-card text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {products.length}
                  </div>
                  <div className="text-gray-600 font-medium">Sản phẩm</div>
                </div>
                <div className="metric-card text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {
                      mfcs.filter((mfc) =>
                        mfc.shippers.some((s) => s.isAvailable)
                      ).length
                    }
                  </div>
                  <div className="text-gray-600 font-medium">MFC hoạt động</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="glass-card rounded-2xl p-2 sm:p-4">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-xs sm:text-base">
                Hướng dẫn sử dụng
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {[
                  {
                    step: 1,
                    text: "Nhấp vào bản đồ để chọn vị trí khách hàng",
                    icon: MapPin,
                  },
                  {
                    step: 2,
                    text: "Chọn sản phẩm và số lượng cần giao",
                    icon: ShoppingBag,
                  },
                  {
                    step: 3,
                    text: "Nhấn nút tối ưu để chạy thuật toán",
                    icon: Zap,
                  },
                  {
                    step: 4,
                    text: "Xem phân tích chi tiết kết quả",
                    icon: Target,
                  },
                ].map(({ step, text, icon: Icon }) => (
                  <div
                    key={step}
                    className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    <div className="w-5 h-5 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                      {step}
                    </div>
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulationDashboard;
