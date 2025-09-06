// src/utils/optimization.js

// Haversine formula to calculate distance between two coordinates

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
import { getTrafficData, calculateDistance } from "../data/mockData";

export const optimizeOrderAllocation = (
  customerLat,
  customerLng,
  orderItems,
  productsList,
  mfcsList
) => {
  const analysis = [];

  for (const mfc of mfcsList) {
    // 1. Kiểm tra tồn kho
    const inventoryCheck = checkInventory(mfc, orderItems);
    if (!inventoryCheck.hasStock) {
      analysis.push({
        mfc,
        scores: {
          distance: 0,
          inventory: 0,
          shipper: 0,
          traffic: 0,
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
          distance: Math.max(0, 100 - distance * 10),
          inventory: 100,
          shipper: 0,
          traffic: 0,
          overall: 0,
        },
        details: {
          distanceKm: distance,
          inventoryStatus: "Đủ hàng",
          availableShippers: 0,
          estimatedTime: 0,
          trafficLevel: "unknown",
        },
        isSelected: false,
        eliminationReason: "Không có shipper khả dụng trong bán kính giao hàng",
      });
      continue;
    }

    // 3. Tính toán điểm số
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
    const shipperDistance = calculateDistance(
      bestShipper.lat,
      bestShipper.lng,
      customerLat,
      customerLng
    );
    const trafficData = getTrafficData(
      mfc.lat,
      mfc.lng,
      customerLat,
      customerLng
    );

    const distanceScore = Math.max(0, 100 - distance * 15);
    const inventoryScore = Math.min(100, inventoryCheck.stockLevel * 10);
    const shipperDistanceToMFC = calculateDistance(
      bestShipper.lat,
      bestShipper.lng,
      mfc.lat,
      mfc.lng
    );
    const shipperScore = Math.max(0, 100 - shipperDistanceToMFC * 20);

    let trafficScore = 100;
    switch (trafficData.trafficLevel) {
      case "high":
        trafficScore = 50;
        break;
      case "medium":
        trafficScore = 75;
        break;
      case "low":
        trafficScore = 100;
        break;
    }

    const overallScore =
      distanceScore * 0.3 +
      inventoryScore * 0.25 +
      shipperScore * 0.25 +
      trafficScore * 0.2;

    analysis.push({
      mfc,
      scores: {
        distance: Math.round(distanceScore),
        inventory: Math.round(inventoryScore),
        shipper: Math.round(shipperScore),
        traffic: Math.round(trafficScore),
        overall: Math.round(overallScore),
      },
      details: {
        distanceKm: Math.round(distance * 10) / 10,
        inventoryStatus: "Đủ hàng",
        availableShippers: availableShippers.length,
        estimatedTime: trafficData.estimatedTime + mfc.avgDeliveryTime,
        trafficLevel: getTrafficLevelText(trafficData.trafficLevel),
      },
      isSelected: false,
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

  const availableShippers = bestMFC.mfc.shippers.filter((shipper) => {
    const shipperDistance = calculateDistance(
      shipper.lat,
      shipper.lng,
      customerLat,
      customerLng
    );
    return shipper.isAvailable && shipperDistance <= shipper.deliveryRadius;
  });

  const selectedShipper = availableShippers.reduce((best, current) => {
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

  const route = [
    [bestMFC.mfc.lat, bestMFC.mfc.lng],
    [selectedShipper.lat, selectedShipper.lng],
    [customerLat, customerLng],
  ];

  return {
    selectedMFC: bestMFC.mfc,
    selectedShipper,
    totalScore: bestMFC.scores.overall,
    estimatedDeliveryTime: bestMFC.details.estimatedTime,
    route,
    analysis: analysis.sort((a, b) => b.scores.overall - a.scores.overall),
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
