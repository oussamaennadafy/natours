const express = require("express");
const {
  updateMe,
  deleteMe,
  getAllUsers,
  deleteUser,
  getMe,
  getUser,
  uploeadUserPhoto,
  resizeUserPhoto,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

// protect for only logged in users
router.use(protect);

router.route("/me").get(getMe, getUser);
router.route("/updateMe").patch(uploeadUserPhoto, resizeUserPhoto, updateMe);
router.route("/deleteMe").delete(deleteMe);

// protect for only admins
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers);

router.route("/:id").delete(deleteUser);

module.exports = router;
