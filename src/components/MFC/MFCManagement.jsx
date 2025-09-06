import React, { useState } from "react";
import { MapPin, Package, Settings, AlertTriangle, Plus, X } from "lucide-react";
import { mfcData as initialMFCData, inventoryData as initialInventoryData, productData } from "../../data/mockData";

const MFCManagement = () => {
  const [mfcData, setMfcData] = useState(initialMFCData);
  const [inventoryData, setInventoryData] = useState(initialInventoryData);
  const [selectedMFC, setSelectedMFC] = useState(null);

  const [showAddMFCModal, setShowAddMFCModal] = useState(false);
  const [newMFCInfo, setNewMFCInfo] = useState({
    name: "",
    address: "",
    status: "active",
    capacity: 100,
    currentLoad: 0,
  });

  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [updateQuantities, setUpdateQuantities] = useState({});

  const getMFCInventory = (mfcId) => {
    return inventoryData
      .filter((inv) => inv.mfcId === mfcId)
      .map((inv) => {
        const product = productData.find((p) => p.id === inv.productId);
        return { ...inv, productName: product?.name || "Unknown" };
      });
  };

  const getStockStatus = (quantity, minThreshold) => {
    const ratio = quantity / minThreshold;
    if (ratio <= 1) return { status: "critical", color: "text-red-600 bg-red-50 border-red-200" };
    if (ratio <= 1.5) return { status: "low", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { status: "good", color: "text-green-600 bg-green-50 border-green-200" };
  };

  const handleAddMFC = () => {
    if (!newMFCInfo.name || !newMFCInfo.address) {
      alert("Vui lòng điền tên và địa chỉ MFC!");
      return;
    }
    const newMFC = { id: Date.now(), ...newMFCInfo, shippers: [] };
    setMfcData([newMFC, ...mfcData]);
    setShowAddMFCModal(false);
    setNewMFCInfo({ name: "", address: "", status: "active", capacity: 100, currentLoad: 0 });
    setSelectedMFC(newMFC.id);
  };

  const handleOpenUpdateStock = () => {
    const inv = getMFCInventory(selectedMFC);
    const initQuantities = {};
    inv.forEach((item) => {
      initQuantities[item.id] = item.quantity;
    });
    setUpdateQuantities(initQuantities);
    setShowUpdateStock(true);
  };

  const handleSaveUpdateStock = () => {
    const newInventory = inventoryData.map((item) =>
      updateQuantities[item.id] !== undefined ? { ...item, quantity: updateQuantities[item.id] } : item
    );
    setInventoryData(newInventory);
    setShowUpdateStock(false);
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý MFC Centers</h2>
        <button
          onClick={() => setShowAddMFCModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm MFC</span>
        </button>
      </div>

      {/* Grid layout responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* MFC list */}
        <div className="md:col-span-1 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mfcData.map((mfc) => {
              const loadPercentage = Math.round((mfc.currentLoad / mfc.capacity) * 100);
              const isSelected = selectedMFC === mfc.id;
              return (
                <div
                  key={mfc.id}
                  className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedMFC(mfc.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 items-start sm:items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{mfc.name}</h3>
                      <div className="flex items-center text-gray-500 mt-1 text-sm truncate">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{mfc.address}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">Trạng thái</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        mfc.status === "active"
                          ? "bg-green-100 text-green-800"
                          : mfc.status === "maintenance"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mfc.status === "active" ? "Hoạt động" : mfc.status === "maintenance" ? "Bảo trì" : "Ngừng hoạt động"}
                    </span>
                  </div>

                  {/* Capacity */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Sức chứa</span>
                      <span className="text-sm font-medium">{mfc.currentLoad}/{mfc.capacity} ({loadPercentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          loadPercentage > 90 ? "bg-red-500" : loadPercentage > 75 ? "bg-amber-500" : "bg-green-500"
                        }`}
                        style={{ width: `${loadPercentage}%` }}
                      />
                    </div>
                  </div>

                  {loadPercentage > 85 && (
                    <div className="flex items-center text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg mt-2">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Cần bổ sung không gian lưu kho
                    </div>
                  )}

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{getMFCInventory(mfc.id).length}</div>
                      <div className="text-xs text-gray-500">Loại sản phẩm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{Math.floor(Math.random() * 50) + 20}</div>
                      <div className="text-xs text-gray-500">Đơn hôm nay</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MFC Details */}
        <div className="md:col-span-1 lg:col-span-1">
          {selectedMFC ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 sticky top-6 md:top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chi tiết {mfcData.find((m) => m.id === selectedMFC)?.name}
              </h3>

              {/* Inventory */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2" /> Tồn kho hiện tại
                </h4>
                {getMFCInventory(selectedMFC).map((item) => {
                  const stockStatus = getStockStatus(item.quantity, item.minThreshold);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
                      <div>
                        <div className="font-medium text-gray-900 truncate">{item.productName}</div>
                        <div className="text-sm text-gray-500">
                          Min: {item.minThreshold} | Max: {item.maxCapacity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleOpenUpdateStock}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cập nhật tồn kho
              </button>

              {/* Update stock form */}
              {showUpdateStock && (
                <div className="bg-white border p-4 rounded-lg mt-2 space-y-2">
                  {getMFCInventory(selectedMFC).map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="truncate">{item.productName}</span>
                      <input
                        type="number"
                        value={updateQuantities[item.id]}
                        onChange={(e) =>
                          setUpdateQuantities({ ...updateQuantities, [item.id]: parseInt(e.target.value) })
                        }
                        className="border p-1 rounded w-20 text-right"
                      />
                    </div>
                  ))}
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      onClick={() => setShowUpdateStock(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={handleSaveUpdateStock}
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chọn một MFC để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm MFC */}
      {showAddMFCModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
          <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 z-10">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => setShowAddMFCModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-5 text-center">Thêm MFC mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên MFC</label>
                <input
                  type="text"
                  placeholder="Nhập tên MFC"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMFCInfo.name}
                  onChange={(e) => setNewMFCInfo({ ...newMFCInfo, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMFCInfo.address}
                  onChange={(e) => setNewMFCInfo({ ...newMFCInfo, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
                <input
                  type="number"
                  placeholder="Nhập sức chứa"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMFCInfo.capacity}
                  onChange={(e) =>
                    setNewMFCInfo({ ...newMFCInfo, capacity: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMFCInfo.status}
                  onChange={(e) => setNewMFCInfo({ ...newMFCInfo, status: e.target.value })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
              <button
                onClick={handleAddMFC}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Thêm MFC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFCManagement;
