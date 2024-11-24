const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IoT Project API',
            version: '1.0.0',
            description: 'API documentation for IoT project',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Update this with your server URL
            },
        ],
    },
    apis: ['src/route/router.js'], // Path to your API documentation in code comments
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
