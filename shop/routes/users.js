const express = require("express");
const router = express.Router();
const { register, login, profile } = require("../controllers/userController");

const { authenticateToken } = require("../middleware/auth");

// Реєстрація
router.post("/register", register);

// Логін
router.post("/login", login);

// Приклад захищеного маршруту
router.get("/profile", authenticateToken, profile);

module.exports = router;
