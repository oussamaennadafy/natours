const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/").at(1);
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("file is not an image! please upload only images", 400),
      false,
    );
  }
};

const upload = multer({
  dest: "public/img/users",
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploeadUserPhoto = upload.single("photo");

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, fileds) => {
  const result = {};
  fileds.forEach((element) => {
    result[element] = obj[element];
  });
  return result;
};

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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

  if (req.file) {
    filteredObj.photo = req.file.filename;
  }

  // 3 - update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
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

const deleteUser = factory.deleteOne(User);
const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);

module.exports = {
  updateMe,
  deleteMe,
  getAllUsers,
  deleteUser,
  getUser,
  getMe,
  uploeadUserPhoto,
  resizeUserPhoto,
};
