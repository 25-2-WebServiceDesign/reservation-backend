const express = require("express");
const app = express();

const swaggerSpec = require("./config/swagger")
const expressUi = require("swagger-ui-express")

// router 불러오기
const naverAuthRouter = require("./routes/authNaver.router");

const storesRouter = require("./routes/stores.router");
const unitsRouter = require("./routes/units.router");
// const storesRouter = require("./routes/stores.router");
const unitRouter = require("./routes/units.router");
const reviewRouter = require("./routes/reviews.router");

app.use(express.json());

// routers 연결
app.use("/auth/naver", naverAuthRouter)
app.use("/stores", storesRouter);
app.use("/units", unitsRouter);
app.use("/api/stores", storesRouter);
app.use("/api/units", unitsRouter);
app.use("/reviews", reviewsRouter);
app.use("/api/reviews", reviewsRouter);

app.use('/api-docs', expressUi.serve, expressUi.setup(swaggerSpec));


app.use("/", (req, res) => {
    res.send("서버 정상 동작중")
})

module.exports = app;