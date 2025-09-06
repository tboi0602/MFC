import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { mfcData, inventoryData, productData } from "../../data/mockData";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(inventoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [mfcFilter, setMfcFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const getInventoryWithDetails = () =>
    inventory.map((inv) => {
      const mfc = mfcData.find((m) => m.id === inv.mfcId);
      const product = productData.find((p) => p.id === inv.productId);
      const stockRatio = inv.quantity / inv.minThreshold;

      let status = "optimal";
      if (inv.quantity <= inv.minThreshold) status = "critical";
      else if (inv.quantity <= inv.minThreshold * 1.5) status = "low";
      else if (inv.quantity >= inv.maxCapacity * 0.9) status = "overstocked";

      return {
        ...inv,
        mfcName: mfc?.name || "Unknown",
        productName: product?.name || "Unknown",
        productCategory: product?.category || "Unknown",
        status,
        stockRatio,
        needsAttention: status === "critical" || status === "overstocked",
      };
    });

  const filteredInventory = getInventoryWithDetails().filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mfcName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMFC = mfcFilter === "all" || item.mfcId === mfcFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesMFC && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "overstocked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "optimal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "critical":
        return "Thiếu nghiêm trọng";
      case "low":
        return "Sắp hết";
      case "overstocked":
        return "Dư thừa";
      case "optimal":
        return "Tối ưu";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <TrendingDown className="h-4 w-4" />;
      case "overstocked":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Tổng hợp số liệu summary
  const totalItems = filteredInventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const criticalItems = filteredInventory.filter(
    (item) => item.status === "critical"
  ).length;
  const lowStockItems = filteredInventory.filter(
    (item) => item.status === "low"
  ).length;
  const overstockedItems = filteredInventory.filter(
    (item) => item.status === "overstocked"
  ).length;

  // Modal actions
  const handleRestock = (item, qty) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === item.id ? { ...inv, quantity: inv.quantity + qty } : inv
      )
    );
    closeModal();
  };

  const handleTransfer = (item, targetMfcId, qty) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === item.id ? { ...inv, quantity: inv.quantity - qty } : inv
      )
    );
    closeModal();
  };

  const handleEdit = (item, updates) => {
    setInventory((prev) =>
      prev.map((inv) => (inv.id === item.id ? { ...inv, ...updates } : inv))
    );
    closeModal();
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Quản lý Tồn kho
          </h2>
          <p className="text-gray-600">
            Theo dõi và quản lý tồn kho tại tất cả MFC centers
          </p>
        </div>
        <button
          className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={() => setInventory([...inventoryData])}
        >
          <RefreshCw className="h-5 w-5" />
          <span>Đồng bộ tồn kho</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: "Tổng sản phẩm",
            value: totalItems,
            icon: <Package className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />,
          },
          {
            label: "Thiếu nghiêm trọng",
            value: criticalItems,
            icon: (
              <AlertTriangle className="h-6 sm:h-8 w-6 sm:w-8 text-red-600" />
            ),
          },
          {
            label: "Sắp hết hàng",
            value: lowStockItems,
            icon: (
              <TrendingDown className="h-6 sm:h-8 w-6 sm:w-8 text-amber-600" />
            ),
          },
          {
            label: "Dư thừa",
            value: overstockedItems,
            icon: (
              <TrendingUp className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
            ),
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 flex justify-between items-center"
          >
            <div>
              <p className="text-xs sm:text-sm text-gray-600">{card.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm hoặc MFC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <select
            value={mfcFilter}
            onChange={(e) => setMfcFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả MFC</option>
            {mfcData.map((mfc) => (
              <option key={mfc.id} value={mfc.id}>
                {mfc.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="critical">Thiếu nghiêm trọng</option>
            <option value="low">Sắp hết</option>
            <option value="optimal">Tối ưu</option>
            <option value="overstocked">Dư thừa</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-[700px] w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                MFC Center
              </th>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                Sản phẩm
              </th>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                Danh mục
              </th>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                Số lượng
              </th>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                Ngưỡng
              </th>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-3 sm:py-4 sm:px-6">{item.mfcName}</td>
                <td className="py-2 px-3 sm:py-4 sm:px-6">
                  {item.productName}
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 text-sm text-gray-600">
                  {item.productCategory}
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 flex items-center space-x-2">
                  <span
                    className={`font-bold text-sm sm:text-base ${
                      item.status === "critical"
                        ? "text-red-600"
                        : item.status === "low"
                        ? "text-amber-600"
                        : item.status === "overstocked"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.quantity}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {item.maxCapacity}
                  </span>
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Min: {item.minThreshold}
                  </div>
                  <div className="w-16 sm:w-20 h-2 sm:h-2.5 bg-gray-200 rounded-full mt-1">
                    <div
                      className={`h-2 sm:h-2.5 rounded-full ${
                        item.stockRatio <= 1
                          ? "bg-red-500"
                          : item.stockRatio <= 1.5
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (item.quantity / item.maxCapacity) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{getStatusText(item.status)}</span>
                  </span>
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  {item.status === "critical" || item.status === "low" ? (
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalType("restock");
                      }}
                    >
                      Bổ sung
                    </button>
                  ) : item.status === "overstocked" ? (
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalType("transfer");
                      }}
                    >
                      Chuyển kho
                    </button>
                  ) : null}
                  <button
                    className="text-gray-600 hover:text-gray-700 text-sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setModalType("edit");
                    }}
                  >
                    Chỉnh sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Modal chung */}
      {modalType && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm">
            {modalType === "restock" && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Bổ sung {selectedItem.productName}
                </h3>
                <input
                  type="number"
                  placeholder="Số lượng"
                  className="border p-2 w-full mb-4 rounded"
                  id="restockQty"
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                  onClick={() =>
                    handleRestock(
                      selectedItem,
                      Number(document.getElementById("restockQty").value)
                    )
                  }
                >
                  Xác nhận
                </button>
              </div>
            )}
            {modalType === "transfer" && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Chuyển kho {selectedItem.productName}
                </h3>
                <select
                  className="border p-2 w-full mb-2 rounded"
                  id="targetMfc"
                >
                  {mfcData.map((mfc) => (
                    <option key={mfc.id} value={mfc.id}>
                      {mfc.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Số lượng"
                  className="border p-2 w-full mb-4 rounded"
                  id="transferQty"
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                  onClick={() =>
                    handleTransfer(
                      selectedItem,
                      Number(document.getElementById("targetMfc").value),
                      Number(document.getElementById("transferQty").value)
                    )
                  }
                >
                  Xác nhận
                </button>
              </div>
            )}
            {modalType === "edit" && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Chỉnh sửa {selectedItem.productName}
                </h3>
                <input
                  type="number"
                  defaultValue={selectedItem.minThreshold}
                  placeholder="Min Threshold"
                  className="border p-2 w-full mb-2 rounded"
                  id="editMin"
                />
                <input
                  type="number"
                  defaultValue={selectedItem.maxCapacity}
                  placeholder="Max Capacity"
                  className="border p-2 w-full mb-4 rounded"
                  id="editMax"
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                  onClick={() =>
                    handleEdit(selectedItem, {
                      minThreshold: Number(
                        document.getElementById("editMin").value
                      ),
                      maxCapacity: Number(
                        document.getElementById("editMax").value
                      ),
                    })
                  }
                >
                  Xác nhận
                </button>
              </div>
            )}
            <button
              className="mt-4 text-gray-500 w-full text-center"
              onClick={closeModal}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
