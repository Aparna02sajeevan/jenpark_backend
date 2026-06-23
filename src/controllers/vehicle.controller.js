const asyncHandler = require('../utils/asyncHandler');
const vehicleService = require('../services/vehicle.service');
const { success } = require('../utils/ApiResponse');
const { uploadToS3 } = require('../utils/s3');

const checkIn = asyncHandler(async (req, res) => {
  const employeeId = req.user.id;
  const vehicleData = { ...req.body };

  if (req.file) {
    vehicleData.plateImage = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      'vehicles',
      req.file.mimetype
    );
  }

  const vehicle = await vehicleService.checkInVehicle(vehicleData, employeeId);
  
  return success(res, {
    statusCode: 201,
    message: 'Vehicle checked in successfully',
    data: vehicle,
  });
});

const checkOut = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.checkOutVehicle(req.params.id, req.user, req.body);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle checked out successfully',
    data: vehicle,
  });
});

const getById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id, req.user);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle details retrieved successfully',
    data: vehicle,
  });
});

const list = asyncHandler(async (req, res) => {
  const result = await vehicleService.listVehicles(req.query, req.user);
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
  const history = await vehicleService.getVehicleHistory(req.params.vehicleNumber, req.user);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle history retrieved successfully',
    data: history,
  });
});

const getTimes = asyncHandler(async (req, res) => {
  const times = await vehicleService.getVehicleTimesById(req.params.id, req.user);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle times retrieved successfully',
    data: times,
  });
});

const getRevenueStats = asyncHandler(async (req, res) => {
  const stats = await vehicleService.getRevenueStats(req.query, req.user);
  return success(res, {
    statusCode: 200,
    message: 'Revenue statistics retrieved successfully',
    data: stats,
  });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.id, req.user);
  return success(res, {
    statusCode: 200,
    message: 'Vehicle check-in record deleted successfully',
    data: null,
  });
});

module.exports = {
  checkIn,
  checkOut,
  getById,
  list,
  getHistory,
  getTimes,
  getRevenueStats,
  deleteVehicle,
};
