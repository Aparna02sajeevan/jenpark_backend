const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const validate = require('../middlewares/validate');
const validator = require('../validators/user.validator');
const upload = require('../middlewares/uploads');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
router.get(
    '/',
    authenticate,
    authorize('admin'),
    controller.getUsers
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Optional profile picture (file upload)
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       409:
 *         description: Email already registered
 */
router.post(
    '/',
    authenticate,
    authorize('admin'),
    upload.single('profilePicture'),
    validate(validator.createUser),
    controller.createUser
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update an existing user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               role:
 *                 type: string
 *                 enum: [admin, user, staff]
 *               isActive:
 *                 type: boolean
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile picture (file upload)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: User not found
 */
router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    upload.single('profilePicture'),
    validate(validator.updateUser),
    controller.updateUser
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: User not found
 */
router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    controller.removeUser
);

module.exports = router;
