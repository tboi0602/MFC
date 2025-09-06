// mockData.js
/** @type {CustomerLocation[]} */
export const mfcData = [
  {
    id: "mfc-001",
    name: "MFC Quận 9",
    address: "115 Hoàng Hữu Nam",
    district: "Quận 9",
    coordinates: { lat: 10.78, lng: 106.69 },
    capacity: 1000,
    currentLoad: 850,
    status: "active",
    lastUpdated: "2025-01-01T10:30:00Z",
  },
  {
    id: "mfc-002",
    name: "MFC Gò Vấp",
    address: "267 Đường Phan Huy Ích",
    district: "Quận Gò Vấp",
    coordinates: { lat: 10.8, lng: 106.68 },
    capacity: 900,
    currentLoad: 700,
    status: "active",
    lastUpdated: "2025-01-01T10:25:00Z",
  },
  {
    id: "mfc-003",
    name: "MFC Quận 12",
    address: "143 Tân Thới Nhất 17",
    district: "Quận 12",
    coordinates: { lat: 10.74, lng: 106.67 },
    capacity: 1200,
    currentLoad: 920,
    status: "active",
    lastUpdated: "2025-01-01T10:20:00Z",
  },
  {
    id: "mfc-004",
    name: "MFC Bình Thạnh",
    address: "1803 Ngô Tất Tố",
    district: "Bình Thạnh",
    coordinates: { lat: 10.82, lng: 106.73 },
    capacity: 900,
    currentLoad: 450,
    status: "active",
    lastUpdated: "2025-01-01T09:15:00Z",
  },
  {
    id: "mfc-005",
    name: "MFC Bình Chánh",
    address: "87 Đường Số 14, Phong Phú",
    district: "Bình Chánh",
    coordinates: { lat: 10.86, lng: 106.79 },
    capacity: 800,
    currentLoad: 620,
    status: "active",
    lastUpdated: "2025-01-01T09:50:00Z",
  },
];

/** @type {Product[]} */
export const productData = [
  {
    id: "prod-001",
    name: "Áo Thun Nam Cotton",
    category: "Quần áo",
    price: 199000,
    demandScore: 90,
    popularDistricts: ["Quận 1", "Quận 3", "Gò Vấp"],
  },
  {
    id: "prod-002",
    name: "Quần Jean Nữ Skinny",
    category: "Quần áo",
    price: 499000,
    demandScore: 85,
    popularDistricts: ["Thủ Đức", "Quận 9", "Quận 12"],
  },
  {
    id: "prod-003",
    name: "Áo Sơ Mi Nam Dài Tay",
    category: "Quần áo",
    price: 399000,
    demandScore: 82,
    popularDistricts: ["Quận 1", "Bình Thạnh", "Quận 10"],
  },
  {
    id: "prod-004",
    name: "Váy Nữ Công Sở",
    category: "Quần áo",
    price: 699000,
    demandScore: 88,
    popularDistricts: ["Quận 7", "Quận 3", "Phú Nhuận"],
  },
  {
    id: "prod-005",
    name: "Áo Khoác Hoodie Unisex",
    category: "Quần áo",
    price: 599000,
    demandScore: 87,
    popularDistricts: ["Thủ Đức", "Bình Thạnh", "Quận 2"],
  },
  {
    id: "prod-006",
    name: "Quần Short Nam Thể Thao",
    category: "Quần áo",
    price: 299000,
    demandScore: 80,
    popularDistricts: ["Quận 9", "Quận 12", "Gò Vấp"],
  },
];

/** @type {Inventory[]} */
export const inventoryData = [
  // MFC Quận 1
  {
    id: "inv-001",
    mfcId: "mfc-001",
    productId: "prod-001",
    quantity: 80,
    minThreshold: 30,
    maxCapacity: 200,
    lastRestocked: "2025-01-01T08:00:00Z",
  },
  {
    id: "inv-002",
    mfcId: "mfc-001",
    productId: "prod-003",
    quantity: 50,
    minThreshold: 20,
    maxCapacity: 120,
    lastRestocked: "2025-01-01T08:30:00Z",
  },
  {
    id: "inv-003",
    mfcId: "mfc-001",
    productId: "prod-005",
    quantity: 30,
    minThreshold: 15,
    maxCapacity: 100,
    lastRestocked: "2025-01-01T09:00:00Z",
  },

  // MFC Quận 3
  {
    id: "inv-004",
    mfcId: "mfc-002",
    productId: "prod-001",
    quantity: 120,
    minThreshold: 50,
    maxCapacity: 200,
    lastRestocked: "2025-01-01T09:15:00Z",
  },
  {
    id: "inv-005",
    mfcId: "mfc-002",
    productId: "prod-003",
    quantity: 90,
    minThreshold: 40,
    maxCapacity: 150,
    lastRestocked: "2025-01-01T09:30:00Z",
  },
  {
    id: "inv-006",
    mfcId: "mfc-002",
    productId: "prod-005",
    quantity: 70,
    minThreshold: 30,
    maxCapacity: 120,
    lastRestocked: "2025-01-01T09:45:00Z",
  },

  // MFC Quận 7
  {
    id: "inv-007",
    mfcId: "mfc-003",
    productId: "prod-001",
    quantity: 60,
    minThreshold: 30,
    maxCapacity: 150,
    lastRestocked: "2025-01-01T08:15:00Z",
  },
  {
    id: "inv-008",
    mfcId: "mfc-003",
    productId: "prod-002",
    quantity: 80,
    minThreshold: 40,
    maxCapacity: 150,
    lastRestocked: "2025-01-01T08:30:00Z",
  },
  {
    id: "inv-009",
    mfcId: "mfc-003",
    productId: "prod-004",
    quantity: 50,
    minThreshold: 20,
    maxCapacity: 100,
    lastRestocked: "2025-01-01T08:45:00Z",
  },

  // MFC Bình Thạnh
  {
    id: "inv-010",
    mfcId: "mfc-004",
    productId: "prod-001",
    quantity: 40,
    minThreshold: 20,
    maxCapacity: 100,
    lastRestocked: "2025-01-01T09:00:00Z",
  },
  {
    id: "inv-011",
    mfcId: "mfc-004",
    productId: "prod-004",
    quantity: 120,
    minThreshold: 50,
    maxCapacity: 200,
    lastRestocked: "2025-01-01T09:15:00Z",
  },

  // MFC Thủ Đức
  {
    id: "inv-012",
    mfcId: "mfc-005",
    productId: "prod-002",
    quantity: 100,
    minThreshold: 40,
    maxCapacity: 150,
    lastRestocked: "2025-01-01T09:30:00Z",
  },
  {
    id: "inv-013",
    mfcId: "mfc-005",
    productId: "prod-005",
    quantity: 90,
    minThreshold: 30,
    maxCapacity: 120,
    lastRestocked: "2025-01-01T09:45:00Z",
  },
  {
    id: "inv-014",
    mfcId: "mfc-005",
    productId: "prod-006",
    quantity: 60,
    minThreshold: 30,
    maxCapacity: 100,
    lastRestocked: "2025-01-01T10:00:00Z",
  },
];

/** @type {Order[]} */
export const orderData = [
  {
    id: "ord-001",
    customerId: "cust-001",
    customerAddress: "100 Lê Lợi, Quận 1",
    customerDistrict: "Quận 1",
    products: [
      {
        productId: "prod-001",
        productName: "Nước suối La Vie 500ml",
        quantity: 2,
        price: 8000,
      },
      {
        productId: "prod-003",
        productName: "Cà phê sữa đá",
        quantity: 1,
        price: 22000,
      },
    ],
    assignedMFC: "mfc-001",
    assignedShipper: "ship-001",
    status: "shipping",
    orderTime: "2025-01-01T10:15:00Z",
    estimatedDelivery: "2025-01-01T11:00:00Z",
    totalAmount: 38000,
  },
  {
    id: "ord-002",
    customerId: "cust-002",
    customerAddress: "200 Nguyễn Văn Linh, Quận 7",
    customerDistrict: "Quận 7",
    products: [
      {
        productId: "prod-002",
        productName: "Bánh mì sandwich",
        quantity: 3,
        price: 25000,
      },
    ],
    assignedMFC: "mfc-003",
    assignedShipper: "ship-002",
    status: "pending",
    orderTime: "2025-01-01T10:30:00Z",
    estimatedDelivery: "2025-01-01T11:30:00Z",
    totalAmount: 75000,
  },
  {
    id: "ord-003",
    customerId: "cust-003",
    customerAddress: "50 Nguyễn Thị Minh Khai, Quận 3",
    customerDistrict: "Quận 3",
    products: [
      {
        productId: "prod-003",
        productName: "Cà phê sữa đá",
        quantity: 2,
        price: 22000,
      },
      {
        productId: "prod-005",
        productName: "Sữa tươi Vinamilk 1L",
        quantity: 1,
        price: 29000,
      },
    ],
    assignedMFC: "mfc-002",
    assignedShipper: "ship-001",
    status: "shipping",
    orderTime: "2025-01-01T10:50:00Z",
    estimatedDelivery: "2025-01-01T11:40:00Z",
    totalAmount: 73000,
  },
];

/** @type {Shipper[]} */
export const shipperData = [
  {
    id: "ship-001",
    name: "Nguyễn Văn A",
    vehicle: "xe máy",
    currentLocation: { lat: 10.775, lng: 106.685 },
    status: "busy",
    assignedOrders: ["ord-001"],
    rating: 4.8,
    district: "Quận 1",
  },
  {
    id: "ship-002",
    name: "Trần Thị B",
    vehicle: "xe máy",
    currentLocation: { lat: 10.785, lng: 106.695 },
    status: "available",
    assignedOrders: [],
    rating: 4.6,
    district: "Quận 1",
  },
  {
    id: "ship-003",
    name: "Lê Văn C",
    vehicle: "xe máy",
    currentLocation: { lat: 10.805, lng: 106.675 },
    status: "available",
    assignedOrders: [],
    rating: 4.7,
    district: "Quận 3",
  },
];

/** @type {DemandForecast[]} */
export const demandForecastData = [
  {
    productId: "prod-001",
    district: "Quận 1",
    predictedDemand: 150,
    confidence: 0.92,
    timeframe: "daily",
    factors: ["Thời tiết nắng nóng", "Giờ cao điểm trưa"],
  },
  {
    productId: "prod-003",
    district: "Quận 3",
    predictedDemand: 85,
    confidence: 0.88,
    timeframe: "daily",
    factors: ["Khu vực văn phòng", "Buổi sáng"],
  },
  {
    productId: "prod-002",
    district: "Quận 7",
    predictedDemand: 60,
    confidence: 0.8,
    timeframe: "daily",
    factors: ["Gần trường học", "Buổi chiều"],
  },
  {
    productId: "prod-004",
    district: "Bình Thạnh",
    predictedDemand: 70,
    confidence: 0.75,
    timeframe: "daily",
    factors: ["Vùng đông dân", "Mùa dịch"],
  },
];
// Dữ liệu giả cho MFC, sản phẩm và shippers

// Data MFC
export const mfcs = [
  {
    id: "mfc1",
    name: "MFC Quận 9 (Thủ Đức)",
    lat: 10.854927,
    lng: 106.813474,
    inventory: {
      prod1: 50,
      prod2: 30,
      prod3: 20,
      prod4: 0,
      prod5: 45,
    },
    avgDeliveryTime: 25,
    operationalHours: "6:00 - 22:00",
    shippers: [
      {
        id: "ship1",
        name: "Nguyễn Văn A",
        lat: 10.849, // cách MFC ~0.005
        lng: 106.805,
        isAvailable: true,
        rating: 4.8,
        deliveryRadius: 5,
      },
      {
        id: "ship2",
        name: "Trần Thị B",
        lat: 10.86,
        lng: 106.82,
        isAvailable: true,
        rating: 4.6,
        deliveryRadius: 4,
      },
    ],
  },
  {
    id: "mfc2",
    name: "MFC Gò Vấp",
    lat: 10.8364,
    lng: 106.6357,
    inventory: {
      prod1: 20,
      prod2: 60,
      prod3: 35,
      prod4: 25,
      prod5: 10,
    },
    avgDeliveryTime: 20,
    operationalHours: "6:00 - 23:00",
    shippers: [
      {
        id: "ship3",
        name: "Lê Văn C",
        lat: 10.842,
        lng: 106.645,
        isAvailable: true,
        rating: 4.9,
        deliveryRadius: 6,
      },
      {
        id: "ship4",
        name: "Phạm Thị D",
        lat: 10.828,
        lng: 106.628,
        isAvailable: true,
        rating: 4.7,
        deliveryRadius: 5,
      },
    ],
  },
  {
    id: "mfc3",
    name: "MFC Quận 12",
    lat: 10.823836,
    lng: 106.621693,
    inventory: {
      prod1: 40,
      prod2: 25,
      prod3: 50,
      prod4: 30,
      prod5: 35,
    },
    avgDeliveryTime: 18,
    operationalHours: "5:30 - 22:30",
    shippers: [
      {
        id: "ship5",
        name: "Hoàng Văn E",
        lat: 10.817,
        lng: 106.615,
        isAvailable: true,
        rating: 4.8,
        deliveryRadius: 7,
      },
    ],
  },
  {
    id: "mfc4",
    name: "MFC Bình Thạnh",
    lat: 10.8046591,
    lng: 106.7078477,
    inventory: {
      prod1: 15,
      prod2: 40,
      prod3: 25,
      prod4: 50,
      prod5: 20,
    },
    avgDeliveryTime: 22,
    operationalHours: "6:30 - 22:00",
    shippers: [
      {
        id: "ship6",
        name: "Vũ Thị F",
        lat: 10.798,
        lng: 106.715,
        isAvailable: true,
        rating: 4.5,
        deliveryRadius: 4,
      },
      {
        id: "ship7",
        name: "Đỗ Văn G",
        lat: 10.812,
        lng: 106.7,
        isAvailable: true,
        rating: 4.9,
        deliveryRadius: 6,
      },
    ],
  },
  {
    id: "mfc5",
    name: "MFC Bình Chánh",
    lat: 10.76,
    lng: 106.66,
    inventory: {
      prod1: 25,
      prod2: 20,
      prod3: 30,
      prod4: 15,
      prod5: 40,
    },
    avgDeliveryTime: 24,
    operationalHours: "6:00 - 21:30",
    shippers: [
      {
        id: "ship8",
        name: "Ngô Thị H",
        lat: 10.768,
        lng: 106.668,
        isAvailable: true,
        rating: 4.6,
        deliveryRadius: 5,
      },
    ],
  },
];

export const products = [
  {
    id: "prod1",
    name: "Áo Thun Nam Cotton",
    price: 199000,
    category: "Quần áo",
    weight: 250, // gram
  },
  {
    id: "prod2",
    name: "Quần Jean Nữ Skinny",
    price: 499000,
    category: "Quần áo",
    weight: 600,
  },
  {
    id: "prod3",
    name: "Áo Sơ Mi Nam Dài Tay",
    price: 399000,
    category: "Quần áo",
    weight: 350,
  },
  {
    id: "prod4",
    name: "Váy Nữ Công Sở",
    price: 699000,
    category: "Quần áo",
    weight: 500,
  },
  {
    id: "prod5",
    name: "Áo Khoác Hoodie Unisex",
    price: 599000,
    category: "Quần áo",
    weight: 700,
  },
];

// Hàm tính toán dữ liệu giao thông giả
export const getTrafficData = (fromLat, fromLng, toLat, toLng) => {
  const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
  const baseTime = distance * 3; // 3 phút/km cơ bản

  // Random traffic level
  const rand = Math.random();
  let trafficMultiplier = 1;
  let trafficLevel = "low";

  if (rand < 0.3) {
    trafficLevel = "high";
    trafficMultiplier = 1.8;
  } else if (rand < 0.6) {
    trafficLevel = "medium";
    trafficMultiplier = 1.3;
  }

  return {
    fromLat,
    fromLng,
    toLat,
    toLng,
    estimatedTime: Math.round(baseTime * trafficMultiplier),
    trafficLevel,
  };
};

// Hàm tính khoảng cách theo công thức Haversine
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
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
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};
