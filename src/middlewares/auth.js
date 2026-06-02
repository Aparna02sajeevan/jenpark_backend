const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authorization token missing');

    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticate };
