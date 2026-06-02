const express = require('express');
const { getHealth } = require('../controllers/health.controller');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: API health check
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "JenPark API Running" }
 */
router.get('/health', getHealth);

module.exports = router;
