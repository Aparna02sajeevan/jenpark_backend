const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const upload = require('../middlewares/uploads');
const validate = require('../middlewares/validate');
const { register, login, updateProfile } = require('../validators/auth.validator');
const { authenticate } = require('../middlewares/auth');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - profilePicture
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 enum: [admin, user, staff]
 *                 default: user
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Required profile picture (file upload)
 *     responses:
 *       201:
 *         description: Registered and logged in successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already registered
 */
router.post(
    '/register',
    upload.single('profilePicture'),
    validate(register),
    controller.register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
    '/login',
    validate(login),
    controller.login
);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/profile',
    authenticate,
    controller.profile
);

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     summary: Update the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile picture (file upload)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.put(
    '/profile',
    authenticate,
    upload.single('profilePicture'),
    validate(updateProfile),
    controller.updateProfile
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/logout',
    authenticate,
    controller.logout
);

module.exports = router;