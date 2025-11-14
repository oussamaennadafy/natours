const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const updateMe = catchAsync(async (req, res, next) => {
  // 1 - throw error if the user posted a password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "this route is not for password update please use updatePassword",
        400,
      ),
    );
  }
  // 2 - update user document
  res.status(200).json({
    sttaus: "success",
  });
});

module.exports = {
  updateMe,
};
