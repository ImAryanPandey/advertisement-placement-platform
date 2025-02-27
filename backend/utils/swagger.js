const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Advertisement Placement API',
      version: '1.0.0',
      description: 'API documentation for managing properties',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60c72b2f5f1b2c001c8e4b0d' },
            title: { type: 'string', example: 'Billboard on Main Street' },
            description: { type: 'string', example: 'Large billboard in a high-traffic area.' },
            images: { type: 'array', items: { type: 'string', example: 'https://example.com/image.jpg' } },
            dimensions: { type: 'string', example: '10x20 ft' },
            address: { type: 'string', example: '123 Main Street, City, Country' },
            landmarks: { type: 'string', example: 'Near the shopping mall' },
            expectedTraffic: { type: 'integer', example: 5000 },
            owner: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Automatically scan all route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
module.exports = swaggerDocs;
