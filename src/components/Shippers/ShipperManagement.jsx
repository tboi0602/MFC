import { useState } from "react";
import { User, MapPin, Phone, Star, Truck, Plus, Search } from "lucide-react";
import { shipperData } from "../../data/mockData";

const ShipperManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [showAddShipperModal, setShowAddShipperModal] = useState(false);
  const [newShipper, setNewShipper] = useState({
    name: "",
    phone: "",
    vehicle: "motorbike",
    rating: 5,
    status: "available",
    assignedOrders: [],
  });

  const filteredShippers = shipperData.filter((shipper) => {
    const matchesSearch =
      shipper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || shipper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "busy":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Sẵn sàng";
      case "busy":
        return "Đang giao hàng";
      case "offline":
        return "Offline";
      default:
        return status;
    }
  };

  const getVehicleIcon = (vehicle) => <Truck className="h-4 w-4" />;
  const getVehicleText = (vehicle) =>
    vehicle === "motorbike" ? "Xe máy" : vehicle === "car" ? "Ô tô" : vehicle;

  const handleAddShipper = () => {
    // Đây chỉ là ví dụ giả lập thêm shipper
    console.log("Thêm shipper:", newShipper);
    setShowAddShipperModal(false);
    setNewShipper({
      name: "",
      phone: "",
      vehicle: "motorbike",
      rating: 5,
      status: "available",
      assignedOrders: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Shipper
          </h2>
          <p className="text-gray-600">
            Quản lý đội ngũ giao hàng và theo dõi hiệu suất
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mt-3 sm:mt-0"
          onClick={() => setShowAddShipperModal(true)}
        >
          <Plus className="h-5 w-5" />
          <span>Thêm Shipper</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Shipper sẵn sàng</p>
            <p className="text-2xl font-bold text-green-600">
              {shipperData.filter((s) => s.status === "available").length}
            </p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Đang giao hàng</p>
            <p className="text-2xl font-bold text-blue-600">
              {shipperData.filter((s) => s.status === "busy").length}
            </p>
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Đánh giá trung bình</p>
            <p className="text-2xl font-bold text-amber-600">
              {(
                shipperData.reduce((sum, s) => sum + s.rating, 0) /
                shipperData.length
              ).toFixed(1)}
            </p>
          </div>
          <Star className="h-8 w-8 text-amber-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Sẵn sàng</option>
            <option value="busy">Đang giao hàng</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Shippers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredShippers.length > 0 ? (
            filteredShippers.map((shipper) => (
              <div
                key={shipper.id}
                className={`bg-white rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedShipper === shipper.id
                    ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedShipper(shipper.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {shipper.name}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Phone className="h-4 w-4 mr-1" />
                        {shipper.phone}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                      shipper.status
                    )}`}
                  >
                    {getStatusText(shipper.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Phương tiện</div>
                    <div className="flex items-center font-medium">
                      {getVehicleIcon(shipper.vehicle)}
                      <span className="ml-1">
                        {getVehicleText(shipper.vehicle)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Đánh giá</div>
                    <div className="flex items-center font-medium">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      {shipper.rating}/5
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Đơn hàng</div>
                    <div className="font-medium">
                      {shipper.assignedOrders.length} đơn
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Vị trí</div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Đang cập nhật
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy shipper nào</p>
            </div>
          )}
        </div>

        {/* Shipper Details */}
        <div className="lg:col-span-1">
          {selectedShipper ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              {(() => {
                const shipper = shipperData.find(
                  (s) => s.id === selectedShipper
                );
                if (!shipper) return null;
                return (
                  <>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {shipper.name}
                        </h3>
                        <p className="text-gray-600">{shipper.phone}</p>
                        <p className="text-gray-600">
                          Trạng thái: {getStatusText(shipper.status)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Thông tin phương tiện
                        </h4>
                        <p>{getVehicleText(shipper.vehicle)}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Đánh giá
                        </h4>
                        <p>{shipper.rating}/5</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Đơn hàng được giao
                        </h4>
                        <ul className="list-disc list-inside">
                          {shipper.assignedOrders.map((orderId, idx) => (
                            <li key={idx}>{orderId}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chọn một shipper để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Shipper Modal */}
      {showAddShipperModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 shadow-xl p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowAddShipperModal(false)}
            >
              ✕
            </button>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center">
              Thêm Shipper mới
            </h3>

            {/* Form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên Shipper"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={newShipper.name}
                onChange={(e) =>
                  setNewShipper({ ...newShipper, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={newShipper.phone}
                onChange={(e) =>
                  setNewShipper({ ...newShipper, phone: e.target.value })
                }
              />

              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={newShipper.vehicle}
                onChange={(e) =>
                  setNewShipper({ ...newShipper, vehicle: e.target.value })
                }
              >
                <option value="motorbike">Xe máy</option>
                <option value="car">Ô tô</option>
              </select>

              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={newShipper.status}
                onChange={(e) =>
                  setNewShipper({ ...newShipper, status: e.target.value })
                }
              >
                <option value="available">Sẵn sàng</option>
                <option value="busy">Đang giao hàng</option>
                <option value="offline">Offline</option>
              </select>

              <button
                onClick={handleAddShipper}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                Thêm Shipper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperManagement;
