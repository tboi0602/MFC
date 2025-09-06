// types.js

/**
 * @typedef {Object} MFC
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {string} district
 * @property {{lat: number, lng: number}} coordinates
 * @property {number} capacity
 * @property {number} currentLoad
 * @property {'active' | 'maintenance' | 'inactive'} status
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} price
 * @property {number} demandScore
 * @property {string[]} popularDistricts
 */

/**
 * @typedef {Object} Inventory
 * @property {string} id
 * @property {string} mfcId
 * @property {string} productId
 * @property {number} quantity
 * @property {number} minThreshold
 * @property {number} maxCapacity
 * @property {string} lastRestocked
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {string} productName
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} customerId
 * @property {string} customerAddress
 * @property {string} customerDistrict
 * @property {OrderItem[]} products
 * @property {string} assignedMFC
 * @property {string} [assignedShipper]
 * @property {'pending' | 'assigned' | 'picking' | 'shipping' | 'delivered' | 'cancelled'} status
 * @property {string} orderTime
 * @property {string} estimatedDelivery
 * @property {number} totalAmount
 */

/**
 * @typedef {Object} Shipper
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {'motorbike' | 'car'} vehicle
 * @property {{lat: number, lng: number}} currentLocation
 * @property {'available' | 'busy' | 'offline'} status
 * @property {string[]} assignedOrders
 * @property {number} rating
 */

/**
 * @typedef {Object} DemandForecast
 * @property {string} productId
 * @property {string} district
 * @property {number} predictedDemand
 * @property {number} confidence
 * @property {'daily' | 'weekly' | 'monthly'} timeframe
 * @property {string[]} factors
 */
