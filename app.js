const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const viewRouter = require("./routes/viewRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1 - MIDDLEWARE

// serving static files
app.use(express.static(path.join(__dirname, "public")));

// cookie parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

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

// fix middleware for xss and mongoSanitize middlewares in express 5
app.use((req, _res, next) => {
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: true,
  });

  next();
});

// data sanitization against XSS
app.use(xss());

// data sanitization against NoSQL query injections
app.use(mongoSanitize());

// prevent parametre pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 - ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

// catch all unmatched requestes
app.all("/*splat", (req, res, next) => {
  next(new AppError(`route ${req.originalUrl} not found`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
