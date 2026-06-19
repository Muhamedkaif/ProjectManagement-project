const express = require("express");

const router = express.Router();

const protect= require("../middleware/authMiddleware");

const userController = require("../controllers/userController");

router.get(
  "/profile",
  protect,
  userController.getProfile
);

router.put(
  "/profile",
  protect,
  userController.updateProfile
);

router.delete(
  "/profile",
  protect,
  userController.deleteAccount
);

module.exports = router;