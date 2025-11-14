const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, fileds) => {
  const result = {};
  fileds.forEach((element) => {
    result[element] = obj[element];
  });
  return result;
};

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

  // 2 - filter request body object
  const filteredObj = filterObj(req.body, ["name", "email"]);

  // 3 - update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    sttaus: "success",
    user: updateUser,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  updateMe,
  deleteMe,
};
