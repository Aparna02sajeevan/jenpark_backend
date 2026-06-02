const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use(healthRoutes);

// Mount additional feature routers here:
// router.use('/auth', require('./auth.routes'));
// router.use('/users', require('./user.routes'));

module.exports = router;
