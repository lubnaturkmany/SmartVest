const express = require("express");
const router = express.Router();
const { register, login, getMe, setPasswordController } = require("../controllers/authControllers");
const { protect , authorizeRoles  } = require("../middleware/authMiddleware");

// POST /api/auth/register
//router.post("/register",protect,authorizeRoles("ADMIN"),register);
router.post("/register", (req,res) =>{
    return res.send("working");
});
// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

router.post("/set-password", setPasswordController);

module.exports = router;