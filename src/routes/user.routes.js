const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const validate = require('../middlewares/validate');
const validator = require('../validators/user.validator');
const upload = require('../middlewares/uploads');

router.get(
    '/',
    authenticate,
    authorize('admin'),
    controller.getUsers
);

router.post(
    '/',
    authenticate,
    authorize('admin'),
    upload.single('profilePicture'),
    validate(validator.createUser),
    controller.createUser
);

router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    upload.single('profilePicture'),
    validate(validator.updateUser),
    controller.updateUser
);

router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    controller.removeUser
);

module.exports = router;
