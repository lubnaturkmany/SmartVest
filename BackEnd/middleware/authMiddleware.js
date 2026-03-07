const jwt = require("jsonwebtoken");

// Verify JWT token
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided. Access denied." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, workerID }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Restrict access to specific roles
// Usage: authorizeRoles("Admin", "Supervisor")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};