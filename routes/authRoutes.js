const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.get("/logout", logout);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(protect, updatePassword);

module.exports = router;
