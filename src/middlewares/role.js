const ApiError = require('../utils/ApiError');

/**
 * Authorize specific roles.
 * Usage: router.get('/admin', authenticate, authorize('admin'), handler)
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Unauthenticated'));
    const role = req.user.role;
    if (!allowedRoles.includes(role)) {
      return next(new ApiError(403, 'Forbidden: insufficient role'));
    }
    next();
  };
}

module.exports = { authorize };
