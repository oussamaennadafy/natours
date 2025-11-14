const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { sendEmail } = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendRoken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    sttaus: "success",
    token,
    data: {
      user,
    },
  });
};

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

  createAndSendRoken(newUser, 201, res);
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
  createAndSendRoken(user, 200, res);
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
  await user.save({ validateBeforeSave: false });

  // 3 send it back as an email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forget your password, to change your password click on the link : ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token: (valide for 10min)",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "token has been sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("failed to send email!", 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1 - get the user by the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("token is invalid, or has expired", 400));
  }
  // 2 - set the new password only if token not expired and user exist
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3 - update the changedPassworedAt property in the durrent user
  // 4 - send the JWT to the client
  createAndSendRoken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1 - get user from collection
  const currentUser = await User.findById(req.user.id).select("+password");
  // 2 - check if posted current password is correct
  const isPasswordCorrect = await currentUser.correctPassword(
    req.body.passwordCurrent,
    currentUser.password,
  );

  if (!isPasswordCorrect) {
    return next(new AppError("your current password is wrong", 401));
  }
  // 3 - if so update password
  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;
  await currentUser.save();

  // 4 - log user in qnd send jwt
  createAndSendRoken(currentUser, 200, res);
});

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
