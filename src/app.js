const express = require("express");
const app = express();

const swaggerSpec = require("./config/swagger")
const expressUi = require("swagger-ui-express")

// router 불러오기
const naverAuthRouter = require("./routes/authNaver.router");
const firebaseAuthRouter = require("./routes/authFirebse.router");
const authRouter = require("./routes/auth.router");

const storesRouter = require("./routes/stores.router");
const unitsRouter = require("./routes/units.router");
// const storesRouter = require("./routes/stores.router");
// const unitRouter = require("./routes/units.router");
const reviewsRouter = require("./routes/reviews.router");
const usersRouter = require("./routes/users.router");
const reservationsRouter = require("./routes/reservations.router");

const errorHandler = require('./middleware/errorHandler')

app.use(express.json());

// routers 연결
app.use('/auth', authRouter)
app.use("/auth/naver", naverAuthRouter)
app.use("/auth/firebase", firebaseAuthRouter)
app.use("/stores", storesRouter);
app.use("/units", unitsRouter);
app.use("/api/stores", storesRouter);
app.use("/api/units", unitsRouter);
app.use("/reviews", reviewsRouter);
app.use("/users", usersRouter);
// app.use("/api/users", usersRouter);
app.use("/reservations", reservationsRouter);
//app.use("/api/reservations", reservationsRouter);
app.use("/reviews", reviewsRouter);
//app.use("/api/reviews", reviewsRouter);

app.use('/api-docs', expressUi.serve, expressUi.setup(swaggerSpec));


app.use("/", (req, res) => {
    res.send("서버 정상 동작중")
})

app.use(errorHandler);

module.exports = app;