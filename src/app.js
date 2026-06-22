const express = require('express');
const path = require('path');

const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const logger = require('./utils/logger');
const routes = require('./routes');
const swaggerSpec = require('./swagger/swagger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

// Static file serving for uploads (profile pictures, etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Versioned API
app.use(env.apiPrefix, routes);

// Root
app.get('/', (_req, res) => {
  res.json({ success: true, service: 'jenpark-backend', docs: '/api/docs' });
});

// 404 + error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
