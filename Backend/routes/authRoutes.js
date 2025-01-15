const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Debugging middleware for auth routes
router.use((req, res, next) => {
  console.log(`AuthRoutes: ${req.method} ${req.url}`);
  next();
});

router.post("/signup", registerUser); // User registration route
router.post("/login", loginUser); // User login route

module.exports = router;
