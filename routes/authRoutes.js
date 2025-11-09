const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgetPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);

module.exports = router;
