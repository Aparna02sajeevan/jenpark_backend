const Joi = require('joi');

const checkIn = {
  body: Joi.object({
    vehicleNumber: Joi.string().min(4).max(20).uppercase().trim().required().messages({
      'any.required': 'Vehicle number is required',
    }),
    ownerName: Joi.string().min(2).max(100).trim().required().messages({
      'any.required': 'Owner name is required',
    }),
    ownerPhoneNumber: Joi.string().min(4).max(20).trim().required().messages({
      'any.required': 'Owner phone number is required',
    }),
    parkingSlot: Joi.string().min(1).max(50).trim().required().messages({
      'any.required': 'Parking slot is required',
    }),
    plateImage: Joi.string().required().messages({
      'any.required': 'Number plate image is required. Please upload an image file.',
    }),
  }),
};

const checkOut = {
  params: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid vehicle record ID format',
      'any.required': 'Vehicle record ID is required',
    }),
  }),
  body: Joi.object({
    revenue: Joi.number().min(0).optional(),
  }),
};

const query = {
  query: Joi.object({
    vehicleNumber: Joi.string().trim().optional(),
    ownerName: Joi.string().trim().optional(),
    addedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
      'string.pattern.base': 'Invalid addedBy user ID format',
    }),
    isActive: Joi.boolean().optional(),
    limit: Joi.number().integer().min(1).max(100).default(50),
    skip: Joi.number().integer().min(0).default(0),
    sortBy: Joi.string().valid('createdAt', 'vehicleNumber', 'ownerName', 'addedBy', 'parkingSlot').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const getById = {
  params: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid vehicle record ID format',
      'any.required': 'Vehicle record ID is required',
    }),
  }),
};

const getHistory = {
  params: Joi.object({
    vehicleNumber: Joi.string().trim().required().messages({
      'any.required': 'Vehicle number is required',
    }),
  }),
};

const revenueStats = {
  query: Joi.object({
    addedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
      'string.pattern.base': 'Invalid addedBy user ID format',
    }),
    groupBy: Joi.string().valid('day', 'month', 'user').default('day'),
  }),
};

module.exports = {
  checkIn,
  checkOut,
  query,
  getById,
  getHistory,
  revenueStats,
};
