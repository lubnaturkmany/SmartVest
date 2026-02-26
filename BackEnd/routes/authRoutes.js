const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/auth/register", register);

// POST /api/auth/login
router.post("/auth/login", login);

// GET /api/auth/me  (protected)
router.get("/auth/me", protect, getMe);

module.exports = router;