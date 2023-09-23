const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { json } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harryisagoodb$oy";

//Route 1: Create a user using: POST "/api/auth/createUser" . No login required
router.post(
  "/createUser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Enter a password with length").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    // This code is for checking the valiadation and see what error has been there
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check weather user with this email exist already
    try {
      // Using try and catch because it tells us the problem in the code
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          // success,
          error: "Sorry a user with this email already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      // user is the model exported from the model which is the schema of mongodb
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      let success = true;
      // res.json(user);
      res.json({ success, authToken });
      // Catch error
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);
// Route 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cann't be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        let success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      let success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server  error occured");
    }
  }
);

// Route 3: Get logged in User details using: POST "/api/auth/getuser". Login required
router.post(
  "/getuser",
  fetchuser,

  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

module.exports = router;
