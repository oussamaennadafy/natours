const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
} = require("../controllers/viewsController");
const { isLogedIn } = require("../controllers/authController");

const router = express.Router();

router.use(isLogedIn);

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLoginForm);

module.exports = router;
