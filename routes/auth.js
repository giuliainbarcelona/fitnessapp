var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var db = require("../model/helper");
require("dotenv").config();
var bcrypt = require("bcrypt");
const saltRounds = 10;
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
const supersecret = process.env.SUPER_SECRET;

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    await db(
      `INSERT INTO users (username, password, email) VALUES ("${username}", "${hash}", "${email}")`
    );

    res.send({ message: "Register successful" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await db(
      `SELECT * FROM users WHERE username = "${username}"`
    );
    const user = results.data[0];
    if (user) {
      const user_id = user.id;

      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) throw new Error("Incorrect password");

      // Assuming the username is stored in the user object fetched from the database
      const tokenPayload = { user_id, username: user.username };

      // Create the token with user_id and username as payload
      var token = jwt.sign(tokenPayload, supersecret);

      // Include the username in the response
      res.send({ message: "Login successful", username: user.username, token });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//Middleware to verify token and get user_id

//only for demo purposes (NOT NECESSARY FOR CODE)
router.get("/profile", userShouldBeLoggedIn, async (req, res) => {
  try {
    const results = await db(
      `SELECT username, email FROM users WHERE id=${req.user_id}`
    );
    const user = results.data[0];
    if (!user) throw new Error("User not found");
    res.send({ user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;

//token for "username": "testing"
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJpYXQiOjE3MTczNjEwNjB9.zVXRTxUJi2DD3YglpzklJD0_C6DF1B3yWw5wblNEV4I
