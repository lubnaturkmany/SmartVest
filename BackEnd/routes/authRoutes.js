const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authControllers");

// تسجيل مستخدم جديد
router.post("/register", registerUser);

// تسجيل الدخول
router.post("/login", loginUser);

module.exports = router;