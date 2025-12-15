const express = require("express");
const app = express();

const swaggerSpec = require("./config/swagger")
const expressUi = require("swagger-ui-express")

// router 불러오기
const naverAuthRouter = require("./routes/authNaver.router");


app.use(express.json());

// routers 연결
app.use("/auth/naver", naverAuthRouter)


app.use('/api-docs', expressUi.serve, expressUi.setup(swaggerSpec));


app.use("/", (req, res) => {
    res.send("서버 정상 동작중")
})

module.exports = app;