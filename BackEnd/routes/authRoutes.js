const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {getUsers, register, login, getMe, changePassword } = require("../controllers/authControllers");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 🟢 Get all users (ADMIN & FACTORY_MANAGER only)
router.get("/", protect, authorizeRoles("ADMIN", "FACTORY_MANAGER"), getUsers);

// 🟢 ADMIN creates users
router.post("/register", protect, authorizeRoles("ADMIN" , "FACTORY_MANAGER"), register);

// 🟢 login
router.post("/login", login);

// 🟢 get current user
router.get("/me", protect, getMe);

// 🟢 change password (first time or later)
router.post("/change-password", changePassword);

module.exports = router;