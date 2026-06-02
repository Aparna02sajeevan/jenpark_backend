const swaggerJSDoc = require('swagger-jsdoc');
const env = require('../config/env');

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'JenPark API',
    version: '0.1.0',
    description: 'JenPark backend REST API documentation',
    contact: { name: 'Jenx AI Technologies' },
  },
  servers: [{ url: `http://localhost:${env.port}${env.apiPrefix}` }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  definition,
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

module.exports = swaggerJSDoc(options);
