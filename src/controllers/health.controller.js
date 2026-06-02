const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');

const getHealth = asyncHandler(async (req, res) => {
  return success(res, {
    statusCode: 200,
    message: 'JenPark API Running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    },
  });
});

module.exports = { getHealth };
