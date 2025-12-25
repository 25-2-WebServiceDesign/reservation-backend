const swaggerJSDoc = require("swagger-jsdoc");
const swaggerSchemaModels = require("./swaggerSchemaModels");
const swaggerSchemas = require("./swaggerSchemas")

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
            },
            {
                url: "http://54.180.83.86:3000",
                description: "aws server"
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
                ...swaggerSchemas,
                ...swaggerSchemaModels
            },
        },
    },
    apis: ['./src/docs/*.swagger.js'],
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;