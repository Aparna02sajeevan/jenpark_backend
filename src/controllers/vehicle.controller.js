const asyncHandler = require('../utils/asyncHandler');
const vehicleService = require('../services/vehicle.service');
const { success } = require('../utils/ApiResponse');

const checkIn = asyncHandler(async (req, res) => {
  // addedBy comes from authenticated user payload (set by authenticate middleware)
  const employeeId = req.user.id;
  const vehicle = await vehicleService.checkInVehicle(req.body, employeeId);
  
  return success(res, {
    statusCode: 201,
    message: 'Vehicle checked in successfully',
    data: vehicle,
  });
});

const checkOut = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.checkOutVehicle(req.params.id);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle checked out successfully',
    data: vehicle,
  });
});

const getById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle details retrieved successfully',
    data: vehicle,
  });
});

const list = asyncHandler(async (req, res) => {
  const result = await vehicleService.listVehicles(req.query);
  return success(res, {
    statusCode: 200,
    message: 'Vehicles listed successfully',
    data: result.vehicles,
    meta: {
      total: result.count,
      limit: Number(req.query.limit || 50),
      skip: Number(req.query.skip || 0),
    },
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await vehicleService.getVehicleHistory(req.params.vehicleNumber);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle history retrieved successfully',
    data: history,
  });
});

const getTimes = asyncHandler(async (req, res) => {
  const times = await vehicleService.getVehicleTimesById(req.params.id);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle times retrieved successfully',
    data: times,
  });
});

module.exports = {
  checkIn,
  checkOut,
  getById,
  list,
  getHistory,
  getTimes,
};
