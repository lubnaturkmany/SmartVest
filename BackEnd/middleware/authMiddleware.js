const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Verifies JWT token and attaches user to req
const protect = async (req, res, next) => {
  try {
    console.log("enter protect");
    const authHeader = req.headers.authorization;
    console.log("header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded" , decoded);

    // Attach full user (including factory field) to req
    const user = await User.findById(decoded.id).select("-password");
    console.log("user from ds", user);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("error in protect", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Checks if user has one of the allowed roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userRole = req.user.role?.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());

    console.log("USER ROLE:", userRole);
    console.log("ALLOWED ROLES:", allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };