const express = require("express");
const { updateMe, deleteMe } = require("../controllers/userController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/updateMe").patch(protect, updateMe);
router.route("/deleteMe").delete(protect, deleteMe);

module.exports = router;
