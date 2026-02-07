const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getMyTours,
  updateUserData,
  alerts,
} = require("../controllers/viewsController");
const { isLogedIn, protect } = require("../controllers/authController");

const router = express.Router();

router.use(alerts);

router.get("/", isLogedIn, getOverview);
router.get("/tour/:slug", isLogedIn, getTour);
router.get("/login", isLogedIn, getLoginForm);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);

router.patch("/submit-user-data", protect, updateUserData);

module.exports = router;
