const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} = require("../controllers/viewsController");
const { isLogedIn, protect } = require("../controllers/authController");

const router = express.Router();

router.get("/", isLogedIn, getOverview);
router.get("/tour/:slug", isLogedIn, getTour);
router.get("/login", isLogedIn, getLoginForm);
router.get("/me", protect, getAccount);

module.exports = router;
