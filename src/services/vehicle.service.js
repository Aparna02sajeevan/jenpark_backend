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
    ownerPhoneNumber: data.ownerPhoneNumber,
    plateImage: data.plateImage,
    addedBy: userId,
  });

  return vehicle;
}

/**
 * Check-out a vehicle
 * @param {string} id 
 * @param {Object} user 
 * @returns {Promise<Object>}
 */
async function checkOutVehicle(id, user) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle check-in record not found');
  }

  // Only the user who checked in the vehicle (or an admin) can check it out
  if (user && user.role !== 'admin' && vehicle.addedBy.toString() !== user.id) {
    throw new ApiError(403, 'Forbidden: You do not have permission to check out this vehicle');
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
 * @param {Object} user 
 * @returns {Promise<Object>}
 */
async function getVehicleById(id, user) {
  // Populate the addedBy field to return employee info (name, email, role)
  const vehicle = await vehicleRepository.findById(id).populate('addedBy', 'name email role');
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle check-in record not found');
  }

  // If user is not an admin, they can only view vehicles they added
  if (user && user.role !== 'admin' && vehicle.addedBy._id.toString() !== user.id) {
    throw new ApiError(403, 'Forbidden: You do not have permission to access this vehicle record');
  }
  return vehicle;
}

/**
 * List vehicle records with filter, pagination, and sorting
 * @param {Object} query 
 * @param {Object} user 
 * @returns {Promise<{vehicles: Array, count: number}>}
 */
async function listVehicles(query, user) {
  const { 
    vehicleNumber, 
    ownerName, 
    addedBy, 
    isActive, 
    limit = 50, 
    skip = 0, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = query;

  const filter = {};

  // If user is not an admin, they can only view vehicles they added
  if (user && user.role !== 'admin') {
    filter.addedBy = user.id;
  } else if (addedBy) {
    // Admin user can filter vehicles registered by a specific user
    filter.addedBy = addedBy;
  }

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

  // Construct sort criteria
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  // Fallback sort
  if (sortBy !== 'createdAt') {
    sort.createdAt = -1;
  }

  const count = await vehicleRepository.count(filter);
  const vehicles = await vehicleRepository.model
    .find(filter)
    .populate('addedBy', 'name email role')
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(limit));

  return { vehicles, count };
}

/**
 * Get the history of a specific vehicle by its number
 * @param {string} vehicleNumber 
 * @param {Object} user 
 * @returns {Promise<Array>}
 */
async function getVehicleHistory(vehicleNumber, user) {
  const filter = { vehicleNumber: vehicleNumber.toUpperCase() };

  // If user is not an admin, they can only see history records they added
  if (user && user.role !== 'admin') {
    filter.addedBy = user.id;
  }

  const history = await vehicleRepository.model
    .find(filter)
    .populate('addedBy', 'name email role')
    .sort({ createdAt: -1 });

  if (history.length === 0) {
    if (user && user.role !== 'admin') {
      throw new ApiError(403, 'Forbidden: You do not have permission to view the history of this vehicle');
    } else {
      throw new ApiError(404, 'No check-in history found for this vehicle number');
    }
  }

  return history;
}

async function getVehicleTimesById(id, user) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle check-in record not found');
  }

  // If user is not an admin, they can only view vehicle times they added
  if (user && user.role !== 'admin' && vehicle.addedBy.toString() !== user.id) {
    throw new ApiError(403, 'Forbidden: You do not have permission to view times for this vehicle');
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
