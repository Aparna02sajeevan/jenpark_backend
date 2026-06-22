const express = require('express');
const vehicleController = require('../controllers/vehicle.controller');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/uploads');
const validate = require('../middlewares/validate');
const vehicleValidator = require('../validators/vehicle.validator');

const router = express.Router();

/**
 * @openapi
 * /vehicles:
 *   post:
 *     summary: Register/Check-in a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleNumber
 *               - ownerName
 *               - plateImage
 *             properties:
 *               vehicleNumber:
 *                 type: string
 *                 example: "KA-01-MG-1234"
 *               ownerName:
 *                 type: string
 *                 example: "John Doe"
 *               plateImage:
 *                 type: string
 *                 format: binary
 *                 description: Image of the number plate (file upload)
 *     responses:
 *       201:
 *         description: Vehicle checked in successfully
 *       400:
 *         description: Validation failed or vehicle already checked in
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post(
  '/',
  authenticate,
  upload.single('plateImage'),
  (req, res, next) => {
    if (req.file) {
      req.body.plateImage = req.file.location || `/uploads/${req.file.filename}`;
    }
    next();
  },
  validate(vehicleValidator.checkIn),
  vehicleController.checkIn
);

/**
 * @openapi
 * /vehicles:
 *   get:
 *     summary: List all vehicles with filters and pagination
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vehicleNumber
 *         schema:
 *           type: string
 *         description: Filter by vehicle number (partial search)
 *       - in: query
 *         name: ownerName
 *         schema:
 *           type: string
 *         description: Filter by owner name (partial search)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter active check-ins (true = currently parked, false = checked out)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of records to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: List of vehicles retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticate,
  validate(vehicleValidator.query),
  vehicleController.list
);

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle check-in details by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vehicle record ID
 *     responses:
 *       200:
 *         description: Vehicle details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle record not found
 */
router.get(
  '/:id',
  authenticate,
  validate(vehicleValidator.getById),
  vehicleController.getById
);

/**
 * @openapi
 * /vehicles/{id}/times:
 *   get:
 *     summary: Get vehicle check-in and check-out times by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vehicle record ID
 *     responses:
 *       200:
 *         description: Vehicle times retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle record not found
 */
router.get(
  '/:id/times',
  authenticate,
  validate(vehicleValidator.getById),
  vehicleController.getTimes
);

/**
 * @openapi
 * /vehicles/{id}/checkout:
 *   patch:
 *     summary: Check-out a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The vehicle record ID
 *     responses:
 *       200:
 *         description: Vehicle checked out successfully
 *       400:
 *         description: Vehicle has already checked out
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle record not found
 */
router.patch(
  '/:id/checkout',
  authenticate,
  validate(vehicleValidator.checkOut),
  vehicleController.checkOut
);

/**
 * @openapi
 * /vehicles/history/{vehicleNumber}:
 *   get:
 *     summary: Get vehicle check-in/check-out history by vehicle number
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Exact vehicle number
 *     responses:
 *       200:
 *         description: Vehicle history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/history/:vehicleNumber',
  authenticate,
  validate(vehicleValidator.getHistory),
  vehicleController.getHistory
);

module.exports = router;
