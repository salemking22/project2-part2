const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Project 2 API',
            version: '1.0.0',
            description: 'API for Contacts and Tasks',
        },
    },
    apis: [path.join(__dirname, 'routes', '*.js')], // absolute path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;