import React, { useState } from "react";
import { Search, Filter, Download, Eye, MapPin, Package } from "lucide-react";
import { orderData } from "../../data/mockData";
import * as XLSX from "xlsx";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orderData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const formatDateTime = (timeString) =>
    new Date(timeString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredOrders.map((o) => ({
        ID: o.id,
        Khách_hàng: o.customerName,
        Địa_chỉ: o.customerAddress,
        Sản_phẩm: o.products.map((p) => `${p.name} x${p.quantity}`).join(", "),
        Tổng_tiền: o.totalAmount,
        Trạng_thái: getStatusText(o.status),
        Thời_gian_đặt: formatDateTime(o.orderTime),
        Dự_kiến_giao: formatDateTime(o.estimatedDelivery),
        MFC: o.assignedMFC,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Đơn hàng
          </h2>
          <p className="text-gray-600">
            Theo dõi và quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>
        <div className="flex items-center mt-3 sm:mt-0">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            onClick={handleExportExcel}
          >
            <Download className="h-5 w-5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hoặc địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="picking">Đang lấy hàng</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          )}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedOrder === order.id
                  ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedOrder(order.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    #{order.id}
                  </h3>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{order.customerAddress}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Sản phẩm</div>
                  <div className="font-semibold">
                    {order.products.length} món
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tổng tiền</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(order.totalAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Đặt lúc</div>
                  <div className="font-semibold">
                    {formatDateTime(order.orderTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dự kiến giao</div>
                  <div className="font-semibold">
                    {formatDateTime(order.estimatedDelivery)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="h-4 w-4 mr-1" />
                  MFC: {order.assignedMFC}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              {(() => {
                const order = orderData.find((o) => o.id === selectedOrder);
                if (!order) return null;
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Chi tiết đơn hàng
                      </h3>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Thông tin khách hàng
                        </h4>
                        <p>{order.customerName}</p>
                        <p>{order.customerPhone}</p>
                        <p>{order.customerAddress}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Sản phẩm
                        </h4>
                        {order.products.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm py-1 border-b border-gray-100"
                          >
                            <span>
                              {p.name} x {p.quantity}
                            </span>
                            <span>{formatCurrency(p.price * p.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-green-600 mt-2">
                          <span>Tổng cộng</span>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Thông tin MFC
                        </h4>
                        <p>{order.assignedMFC}</p>
                        <p>Đặt lúc: {formatDateTime(order.orderTime)}</p>
                        <p>
                          Dự kiến giao:{" "}
                          {formatDateTime(order.estimatedDelivery)}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chọn một đơn hàng để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
