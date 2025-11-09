const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signup = catchAsync(async (req, res, next) => {
  const { name, email, photo, password, passwordConfirm, passwordChangedAt } =
    req.body;

  const newUser = await User.create({
    name,
    email,
    photo,
    password,
    passwordConfirm,
    passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    sttaus: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check body data
  if (!email) return next(new AppError("please provide email", 400));
  if (!password) return next(new AppError("please provide password", 400));

  // select user
  const user = await User.findOne({ email }).select("+password");

  // checking user not exist or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorect email or password"), 401);

  // generate token
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1 - get the token and check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ").at(1);
  }
  if (!token) return next(new AppError("you are not logged in", 401));
  // 2 - verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 -  if user is exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("user no longer exist", 401));

  // 4 - check if user changed password after token was issued
  const isPasswordChanged = currentUser.changedPasswordAfter(decoded.iat);
  if (isPasswordChanged)
    return next(
      new AppError("user changed password recently, please log in again", 401),
    );

  // if everything is okey, we graint access to protected route
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next("your not authorize to perform this action", 403);
    }
    next();
  });

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1 get user based on received email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  // 2 generate the random token
  const resetToken = user.createPasswordResetToken();
  await User.save({ validateBeforeSave: false });

  // 3 send it back as an email
});

const resetPassword = catchAsync(async (req, res, next) => {});

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
