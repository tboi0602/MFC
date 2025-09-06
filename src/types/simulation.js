// types.js

/**
 * @typedef {Object} CustomerLocation
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {{lat: number, lng: number}} coordinates
 * @property {string} district
 */

/**
 * @typedef {Object} SimulationOrder
 * @property {string} customerId
 * @property {CustomerLocation} customerLocation
 * @property {{productId: string, quantity: number}[]} requestedProducts
 * @property {string} timestamp
 */

/**
 * @typedef {Object} DistanceCalculation
 * @property {string} mfcId
 * @property {number} distance
 * @property {number} travelTime
 */

/**
 * @typedef {Object} InventoryCheck
 * @property {string} mfcId
 * @property {boolean} hasAllProducts
 * @property {{productId: string, available: number, requested: number, sufficient: boolean}[]} availableProducts
 * @property {number} totalScore
 */

/**
 * @typedef {Object} ShipperAssignment
 * @property {string} shipperId
 * @property {string} estimatedArrival
 * @property {{distance: number, estimatedTime: number, trafficFactor: number}} routeOptimization
 */

/**
 * @typedef {Object} AlgorithmResult
 * @property {string} selectedMFC
 * @property {string} assignedShipper
 * @property {{
 *   distanceAnalysis: DistanceCalculation[],
 *   inventoryAnalysis: InventoryCheck[],
 *   shipperAnalysis: ShipperAssignment[],
 *   finalScore: number
 * }} reasoning
 * @property {{
 *   mfcId: string,
 *   productUpdates: {
 *     productId: string,
 *     oldQuantity: number,
 *     newQuantity: number,
 *     needsRestock: boolean
 *   }[]
 * }[]} inventoryUpdates
 */

/**
 * @typedef {Object} SimulationStep
 * @property {number} step
 * @property {string} title
 * @property {string} description
 * @property {any} data
 * @property {number} duration
 */
