require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  if (req.user.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ error: "Access denied: admin only" });
}

module.exports = { authenticateToken, isAdmin };
