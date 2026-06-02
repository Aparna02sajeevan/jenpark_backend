function success(res, { statusCode = 200, message = 'OK', data = null, meta = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

function failure(res, { statusCode = 500, message = 'Error', details = null } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}

module.exports = { success, failure };
