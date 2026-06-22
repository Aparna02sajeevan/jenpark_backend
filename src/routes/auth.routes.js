const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const upload = require('../middlewares/uploads');
const validate = require('../middlewares/validate');
const { register, login } = require('../validators/auth.validator');
const { authenticate } = require('../middlewares/auth');

router.post(
    '/register',
    upload.single('profilePicture'),
    validate(register),
    controller.register
);

router.post(
    '/login',
    validate(login),
    controller.login
);

router.get(
    '/profile',
    authenticate,
    controller.profile
);

router.post(
    '/logout',
    authenticate,
    controller.logout
);

module.exports = router;