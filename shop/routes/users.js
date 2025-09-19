const express = require("express");
const router = express.Router();
const { register, login, profile, logout } = require("../controllers/userController");

const { authenticateToken } = require("../middleware/auth");

// Реєстрація
router.post("/register", register);

// Логін
router.post("/login", login);


// Вихід (logout)
router.post("/logout", authenticateToken, logout);

// Приклад захищеного маршруту
router.get("/profile", authenticateToken, profile);

module.exports = router;
