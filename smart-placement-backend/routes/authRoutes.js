const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  signup
);

router.post("/login", login);

module.exports = router;