const vehicleRepository = require('../repositories/vehicle.repository');
const ApiError = require('../utils/ApiError');

/**
 * Check-in a vehicle
 * @param {Object} data 
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
async function checkInVehicle(data, userId) {
  // Check if there is an active check-in session for this vehicle number
  const activeSession = await vehicleRepository.findOne({
    vehicleNumber: data.vehicleNumber.toUpperCase(),
    checkOutTime: null,
  });

  if (activeSession) {
    throw new ApiError(400, `Vehicle ${data.vehicleNumber} is already checked in and has not checked out yet.`);
  }

  const vehicle = await vehicleRepository.create({
    vehicleNumber: data.vehicleNumber,
    ownerName: data.ownerName,
    plateImage: data.plateImage,
    addedBy: userId,
  });

  return vehicle;
}

/**
 * Check-out a vehicle
 * @param {string} id 
 * @returns {Promise<Object>}
 */
async function checkOutVehicle(id) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle check-in record not found');
  }

  if (vehicle.checkOutTime) {
    throw new ApiError(400, 'Vehicle has already checked out');
  }

  vehicle.checkOutTime = new Date();
  await vehicle.save();

  return vehicle;
}

/**
 * Retrieve vehicle details by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
async function getVehicleById(id) {
  // Populate the addedBy field to return employee info (name, email, role)
  const vehicle = await vehicleRepository.findById(id).populate('addedBy', 'name email role');
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle check-in record not found');
  }
  return vehicle;
}

/**
 * List vehicle records with filter, pagination, and sorting
 * @param {Object} query 
 * @returns {Promise<{vehicles: Array, count: number}>}
 */
async function listVehicles(query) {
  const { vehicleNumber, ownerName, isActive, limit = 50, skip = 0 } = query;

  const filter = {};

  if (vehicleNumber) {
    filter.vehicleNumber = { $regex: vehicleNumber, $options: 'i' };
  }

  if (ownerName) {
    filter.ownerName = { $regex: ownerName, $options: 'i' };
  }

  if (isActive !== undefined) {
    if (isActive === true || isActive === 'true') {
      filter.checkOutTime = null;
    } else if (isActive === false || isActive === 'false') {
      filter.checkOutTime = { $ne: null };
    }
  }

  const count = await vehicleRepository.count(filter);
  const vehicles = await vehicleRepository.model
    .find(filter)
    .populate('addedBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  return { vehicles, count };
}

/**
 * Get the history of a specific vehicle by its number
 * @param {string} vehicleNumber 
 * @returns {Promise<Array>}
 */
async function getVehicleHistory(vehicleNumber) {
  const history = await vehicleRepository.model
    .find({ vehicleNumber: vehicleNumber.toUpperCase() })
    .populate('addedBy', 'name email role')
    .sort({ createdAt: -1 });

  return history;
}

async function getVehicleTimesById(id) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle check-in record not found');
  }
  return {
    checkInTime: vehicle.checkInTime,
    checkOutTime: vehicle.checkOutTime,
  };
}

module.exports = {
  checkInVehicle,
  checkOutVehicle,
  getVehicleById,
  listVehicles,
  getVehicleHistory,
  getVehicleTimesById,
};
