import React from "react";
import { Clock, MapPin, Package } from "lucide-react";
import { orderData } from "../../data/mockData";

const RecentOrders = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipping":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "picking":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Đã giao";
      case "shipping":
        return "Đang giao";
      case "picking":
        return "Đang lấy hàng";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatTime = (timeString) =>
    new Date(timeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Đơn hàng gần đây</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Xem tất cả
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Mã đơn",
                "Địa chỉ giao",
                "Sản phẩm",
                "Thành tiền",
                "Trạng thái",
                "Thời gian",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left px-4 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orderData.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <div>
                      <div className="font-medium">
                        {order.customerDistrict}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerAddress}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-1 text-gray-400" />
                    {order.products.length} sản phẩm
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {formatTime(order.orderTime)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {orderData.map((order) => (
          <div
            key={order.id}
            className="p-4 border rounded-lg shadow-sm bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">{order.id}</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              <span>
                {order.customerDistrict} - {order.customerAddress}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <Package className="h-4 w-4 mr-1 text-gray-400" />
              {order.products.length} sản phẩm
            </div>

            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              {formatTime(order.orderTime)}
            </div>

            <div className="mt-2 font-semibold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
