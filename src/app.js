const express = require("express");
const app = express();

const swaggerSpec = require("./config/swagger")
const expressUi = require("swagger-ui-express")

app.use(express.json());

// routers 연결


app.use('/api-docs', expressUi.serve, expressUi.setup(swaggerSpec));

module.exports = app;