const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// 1 - MIDDLEWARE middleware

// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this ip, please try again in an hour!",
});
app.use("/api", limiter);

// body parser, read data from body into req.body
app.use(express.json({ limit: "10kb" }));

// serving static files
app.use(express.static(`/${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 - ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

// catch all unmatched requestes
app.all("/*splat", (req, res, next) => {
  next(new AppError(`route ${req.originalUrl} not found`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
