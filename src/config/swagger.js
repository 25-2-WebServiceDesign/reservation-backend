const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Reservation Service API",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local test"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
            schemas: {

            },
        },
    },
    apis: ['./src/docs/*.swagger.js'],
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;