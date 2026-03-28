const express = require("express");
const router = express.Router();

const { register, login, getMe, changePassword } = require("../controllers/authControllers");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 🟢 ADMIN creates users
router.post("/register", protect, authorizeRoles("ADMIN" , "FACTORY_MANAGER"), register);

// 🟢 login
router.post("/login", login);

// 🟢 get current user
router.get("/me", protect, getMe);

// 🟢 change password (first time or later)
router.post("/change-password", changePassword);

module.exports = router;