// src/utils/optimization.js

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate travel time based on distance and traffic conditions
export function calculateTravelTime(distance, vehicleType = "motorbike") {
  const baseSpeed = vehicleType === "motorbike" ? 25 : 20; // km/h in HCMC traffic
  const trafficFactor = 1.2 + Math.random() * 0.3; // Random traffic factor
  return (distance / baseSpeed) * trafficFactor * 60; // minutes
}

// Analyze distance from customer to all MFCs
export function analyzeDistances(customerLocation, mfcs) {
  return mfcs
    .map((mfc) => {
      const distance = calculateDistance(
        customerLocation.coordinates.lat,
        customerLocation.coordinates.lng,
        mfc.coordinates.lat,
        mfc.coordinates.lng
      );
      const travelTime = calculateTravelTime(distance);

      return {
        mfcId: mfc.id,
        distance: Math.round(distance * 100) / 100,
        travelTime: Math.round(travelTime),
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

// Check inventory availability at each MFC
export function analyzeInventory(requestedProducts, mfcs, inventory) {
  return mfcs
    .map((mfc) => {
      const mfcInventory = inventory.filter((inv) => inv.mfcId === mfc.id);
      const availableProducts = requestedProducts.map((requested) => {
        const inventoryItem = mfcInventory.find(
          (inv) => inv.productId === requested.productId
        );
        const available = inventoryItem?.quantity || 0;

        return {
          productId: requested.productId,
          available,
          requested: requested.quantity,
          sufficient: available >= requested.quantity,
        };
      });

      const hasAllProducts = availableProducts.every((p) => p.sufficient);
      const fulfillmentRate =
        availableProducts.reduce(
          (acc, p) =>
            acc + (p.sufficient ? 1 : Math.min(p.available / p.requested, 1)),
          0
        ) / availableProducts.length;

      return {
        mfcId: mfc.id,
        hasAllProducts,
        availableProducts,
        totalScore: fulfillmentRate * 100,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

// Find optimal shipper assignment
export function analyzeShipperAssignment(
  selectedMFC,
  customerLocation,
  shippers
) {
  const availableShippers = shippers.filter((s) => s.status === "available");

  return availableShippers
    .map((shipper) => {
      const distanceToMFC = calculateDistance(
        shipper.currentLocation.lat,
        shipper.currentLocation.lng,
        selectedMFC.coordinates.lat,
        selectedMFC.coordinates.lng
      );

      const distanceToCustomer = calculateDistance(
        selectedMFC.coordinates.lat,
        selectedMFC.coordinates.lng,
        customerLocation.coordinates.lat,
        customerLocation.coordinates.lng
      );

      const totalDistance = distanceToMFC + distanceToCustomer;
      const pickupTime = calculateTravelTime(distanceToMFC, shipper.vehicle);
      const deliveryTime = calculateTravelTime(
        distanceToCustomer,
        shipper.vehicle
      );
      const totalTime = pickupTime + deliveryTime + 5;

      const trafficFactor = 1 + Math.random() * 0.2;
      const estimatedArrival = new Date(
        Date.now() + totalTime * 60000
      ).toISOString();

      return {
        shipperId: shipper.id,
        estimatedArrival,
        routeOptimization: {
          distance: Math.round(totalDistance * 100) / 100,
          estimatedTime: Math.round(totalTime),
          trafficFactor: Math.round(trafficFactor * 100) / 100,
        },
      };
    })
    .sort(
      (a, b) =>
        a.routeOptimization.estimatedTime - b.routeOptimization.estimatedTime
    );
}

// Main algorithm
export function executeOptimizationAlgorithm(order, mfcs, inventory, shippers) {
  const distanceAnalysis = analyzeDistances(order.customerLocation, mfcs);
  const inventoryAnalysis = analyzeInventory(
    order.requestedProducts,
    mfcs,
    inventory
  );

  const mfcScores = mfcs
    .map((mfc) => {
      const distanceData = distanceAnalysis.find((d) => d.mfcId === mfc.id);
      const inventoryData = inventoryAnalysis.find((i) => i.mfcId === mfc.id);

      const distanceScore = Math.max(0, 100 - distanceData.distance * 10);
      const inventoryScore = inventoryData.totalScore;
      const finalScore = inventoryScore * 0.6 + distanceScore * 0.4;

      return {
        mfcId: mfc.id,
        finalScore,
        canFulfill: inventoryData.hasAllProducts && mfc.status === "active",
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);

  const selectedMFCScore = mfcScores.find((score) => score.canFulfill);
  if (!selectedMFCScore) throw new Error("No MFC can fulfill this order");

  const selectedMFC = mfcs.find((m) => m.id === selectedMFCScore.mfcId);
  const shipperAnalysis = analyzeShipperAssignment(
    selectedMFC,
    order.customerLocation,
    shippers
  );
  const selectedShipper = shipperAnalysis[0]?.shipperId;
  if (!selectedShipper) throw new Error("No available shipper found");

  const inventoryUpdates = {
    mfcId: selectedMFC.id,
    productUpdates: order.requestedProducts.map((requested) => {
      const inventoryItem = inventory.find(
        (inv) =>
          inv.mfcId === selectedMFC.id && inv.productId === requested.productId
      );

      const newQuantity = inventoryItem.quantity - requested.quantity;
      const needsRestock = newQuantity <= inventoryItem.minThreshold;

      return {
        productId: requested.productId,
        oldQuantity: inventoryItem.quantity,
        newQuantity,
        needsRestock,
      };
    }),
  };

  return {
    selectedMFC: selectedMFC.id,
    assignedShipper: selectedShipper,
    reasoning: {
      distanceAnalysis,
      inventoryAnalysis,
      shipperAnalysis,
      finalScore: selectedMFCScore.finalScore,
    },
    inventoryUpdates,
  };
}

// Inventory optimization
export function optimizeInventoryDistribution(
  mfcs,
  inventory,
  products,
  demandForecast
) {
  const recommendations = [];

  mfcs.forEach((mfc) => {
    const mfcInventory = inventory.filter((inv) => inv.mfcId === mfc.id);

    mfcInventory.forEach((inv) => {
      const product = products.find((p) => p.id === inv.productId);
      const forecast = demandForecast.find(
        (f) => f.productId === inv.productId && f.district === mfc.district
      );

      if (product && forecast) {
        const predictedDemand = forecast.predictedDemand;
        const currentStock = inv.quantity;
        const optimalStock = Math.max(
          inv.minThreshold,
          Math.ceil(predictedDemand * 1.5)
        );

        if (currentStock < inv.minThreshold) {
          recommendations.push({
            mfcId: mfc.id,
            productId: inv.productId,
            currentStock,
            recommendedStock: optimalStock,
            reason: `Below minimum threshold (${inv.minThreshold})`,
            priority: "high",
          });
        } else if (currentStock < optimalStock) {
          recommendations.push({
            mfcId: mfc.id,
            productId: inv.productId,
            currentStock,
            recommendedStock: optimalStock,
            reason: `High demand forecast (${predictedDemand}/day)`,
            priority: "medium",
          });
        } else if (currentStock > inv.maxCapacity * 0.9) {
          recommendations.push({
            mfcId: mfc.id,
            productId: inv.productId,
            currentStock,
            recommendedStock: Math.ceil(inv.maxCapacity * 0.7),
            reason: "Excess stock, consider transferring",
            priority: "low",
          });
        }
      }
    });
  });

  return {
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }),
  };
}
import { getTrafficData } from "../data/mockData";

export const optimizeOrderAllocation = (
  customerLat,
  customerLng,
  orderItems,
  productsList,
  mfcsList
) => {
  const analysis = [];

  // Hệ số trọng số cho chấm điểm MFC
  const ALPHA = 0.4; // ưu tiên tốc độ giao
  const BETA = 0.3; // ưu tiên chi phí
  const GAMMA = 0.2; // ưu tiên tồn kho
  const DELTA = 0.1; // ưu tiên cân bằng tải

  for (const mfc of mfcsList) {
    // 1. Kiểm tra tồn kho
    const inventoryCheck = checkInventory(mfc, orderItems);
    if (!inventoryCheck.hasStock) {
      analysis.push({
        mfc,
        scores: {
          eta: 0,
          cost: 0,
          inventory: 0,
          loadBalance: 0,
          overall: 0,
        },
        details: {
          distanceKm: calculateDistance(
            mfc.lat,
            mfc.lng,
            customerLat,
            customerLng
          ),
          inventoryStatus: `Thiếu ${inventoryCheck.missingItems.join(", ")}`,
          availableShippers: mfc.shippers.filter((s) => s.isAvailable).length,
          estimatedTime: 0,
          trafficLevel: "unknown",
          totalCost: 0,
          currentLoad: 0,
        },
        isSelected: false,
        eliminationReason: "Không đủ hàng trong kho",
      });
      continue;
    }

    // 2. Kiểm tra shipper
    const availableShippers = mfc.shippers.filter((shipper) => {
      const shipperDistance = calculateDistance(
        shipper.lat,
        shipper.lng,
        customerLat,
        customerLng
      );
      return shipper.isAvailable && shipperDistance <= shipper.deliveryRadius;
    });

    if (availableShippers.length === 0) {
      const distance = calculateDistance(
        mfc.lat,
        mfc.lng,
        customerLat,
        customerLng
      );
      analysis.push({
        mfc,
        scores: {
          eta: Math.max(0, 100 - distance * 10),
          cost: 100,
          inventory: 100,
          loadBalance: 0,
          overall: 0,
        },
        details: {
          distanceKm: distance,
          inventoryStatus: "Đủ hàng",
          availableShippers: 0,
          estimatedTime: 0,
          trafficLevel: "unknown",
          totalCost: 0,
          currentLoad: 0,
        },
        isSelected: false,
        eliminationReason: "Không có shipper khả dụng trong bán kính giao hàng",
      });
      continue;
    }

    // 3. Tính toán điểm số MFC theo công thức mới
    // Score(MFC) = (α×ETA) + (β×Cost) + (γ×InventoryMatch) + (δ×LoadBalance)

    const bestShipper = availableShippers.reduce((best, current) => {
      const currentDist = calculateDistance(
        current.lat,
        current.lng,
        customerLat,
        customerLng
      );
      const bestDist = calculateDistance(
        best.lat,
        best.lng,
        customerLat,
        customerLng
      );
      const currentScore = (10 - currentDist) * 10 + current.rating * 10;
      const bestScore = (10 - bestDist) * 10 + best.rating * 10;
      return currentScore > bestScore ? current : best;
    });

    const distance = calculateDistance(
      mfc.lat,
      mfc.lng,
      customerLat,
      customerLng
    );

    const shipperToMFCDistance = calculateDistance(
      bestShipper.lat,
      bestShipper.lng,
      mfc.lat,
      mfc.lng
    );

    const trafficData = getTrafficData(
      mfc.lat,
      mfc.lng,
      customerLat,
      customerLng
    );

    // Tính ETA Score (Estimated Time of Arrival) - điểm càng cao càng nhanh
    const totalDeliveryTime =
      trafficData.estimatedTime +
      mfc.avgDeliveryTime +
      shipperToMFCDistance * 3;
    const etaScore = Math.max(0, 100 - (totalDeliveryTime / 60) * 20); // Normalize theo giờ

    // Tính Cost Score - điểm càng cao càng rẻ
    const fuelCost = distance * 2000; // 2000 VND/km
    const shipperCost = bestShipper.rating * 10000; // Shipper rating cao thì cost cao
    const totalCost = fuelCost + shipperCost;
    const costScore = Math.max(0, 100 - (totalCost / 50000) * 20); // Normalize

    // Tính Inventory Match Score - điểm dựa trên mức độ phù hợp inventory
    const inventoryScore = Math.min(100, inventoryCheck.stockLevel * 20);

    // Tính Load Balance Score - điểm dựa trên tải hiện tại của MFC
    const currentLoadPercentage = mfc.currentLoad
      ? (mfc.currentLoad / mfc.capacity) * 100
      : 50;
    const loadBalanceScore = Math.max(0, 100 - currentLoadPercentage); // MFC ít tải hơn thì điểm cao hơn

    // Áp dụng công thức chấm điểm MFC
    const overallScore =
      ALPHA * etaScore +
      BETA * costScore +
      GAMMA * inventoryScore +
      DELTA * loadBalanceScore;

    analysis.push({
      mfc,
      scores: {
        eta: Math.round(etaScore),
        cost: Math.round(costScore),
        inventory: Math.round(inventoryScore),
        loadBalance: Math.round(loadBalanceScore),
        overall: Math.round(overallScore),
      },
      details: {
        distanceKm: Math.round(distance * 10) / 10,
        inventoryStatus: "Đủ hàng",
        availableShippers: availableShippers.length,
        estimatedTime: Math.round(totalDeliveryTime),
        trafficLevel: getTrafficLevelText(trafficData.trafficLevel),
        totalCost: Math.round(totalCost),
        currentLoad: Math.round(currentLoadPercentage),
      },
      isSelected: false,
      bestShipper: bestShipper,
    });
  }

  const validMFCs = analysis.filter((a) => !a.eliminationReason);
  if (validMFCs.length === 0) {
    throw new Error("Không tìm thấy MFC nào phù hợp với đơn hàng");
  }

  const bestMFC = validMFCs.reduce((best, current) =>
    current.scores.overall > best.scores.overall ? current : best
  );
  bestMFC.isSelected = true;

  // Chấm điểm tuyến đường cho shipper được chọn
  // Priority(Route) = (α×ETA) + (β×Cost) + (γ×LoadBalance)
  const selectedShipper = bestMFC.bestShipper;

  // Tính điểm tuyến đường
  const routeDistance = calculateDistance(
    selectedShipper.lat,
    selectedShipper.lng,
    customerLat,
    customerLng
  );

  const routeTrafficData = getTrafficData(
    selectedShipper.lat,
    selectedShipper.lng,
    customerLat,
    customerLng
  );

  const routeETA = routeTrafficData.estimatedTime;
  const routeETAScore = Math.max(0, 100 - (routeETA / 60) * 15);

  const routeCost = routeDistance * 2000 + selectedShipper.rating * 5000;
  const routeCostScore = Math.max(0, 100 - (routeCost / 30000) * 20);

  // Load balance cho route (dựa trên số đơn hàng hiện tại của shipper)
  const shipperCurrentOrders = selectedShipper.assignedOrders
    ? selectedShipper.assignedOrders.length
    : 0;
  const routeLoadBalanceScore = Math.max(0, 100 - shipperCurrentOrders * 25);

  const routePriority =
    ALPHA * routeETAScore +
    BETA * routeCostScore +
    GAMMA * routeLoadBalanceScore;

  const route = [
    [selectedShipper.lat, selectedShipper.lng],
    [bestMFC.mfc.lat, bestMFC.mfc.lng],
    [customerLat, customerLng],
  ];

  return {
    selectedMFC: bestMFC.mfc,
    selectedShipper,
    totalScore: bestMFC.scores.overall,
    routePriority: Math.round(routePriority),
    estimatedDeliveryTime: bestMFC.details.estimatedTime,
    totalCost: bestMFC.details.totalCost,
    route,
    analysis: analysis.sort((a, b) => b.scores.overall - a.scores.overall),
    algorithmDetails: {
      mfcFormula:
        "Score(MFC) = (α×ETA) + (β×Cost) + (γ×InventoryMatch) + (δ×LoadBalance)",
      routeFormula: "Priority(Route) = (α×ETA) + (β×Cost) + (γ×LoadBalance)",
      weights: {
        alpha: ALPHA,
        beta: BETA,
        gamma: GAMMA,
        delta: DELTA,
      },
      routeAnalysis: {
        etaScore: Math.round(routeETAScore),
        costScore: Math.round(routeCostScore),
        loadBalanceScore: Math.round(routeLoadBalanceScore),
        finalPriority: Math.round(routePriority),
      },
    },
  };
};

const checkInventory = (mfc, orderItems) => {
  const missingItems = [];
  let totalStock = 0;
  let totalRequired = 0;

  for (const item of orderItems) {
    const available = mfc.inventory[item.productId] || 0;
    totalRequired += item.quantity;

    if (available < item.quantity) {
      missingItems.push(item.productId);
    } else {
      totalStock += available;
    }
  }

  return {
    hasStock: missingItems.length === 0,
    missingItems,
    stockLevel:
      totalRequired > 0 ? Math.min(10, totalStock / totalRequired) : 10,
  };
};

const getTrafficLevelText = (level) => {
  switch (level) {
    case "low":
      return "Thông thoáng";
    case "medium":
      return "Bình thường";
    case "high":
      return "Đông đúc";
    default:
      return "Không xác định";
  }
};
