const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../model/helper");
require("dotenv").config();
var bcrypt = require("bcrypt");
const saltRounds = 10;
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
const supersecret = process.env.SUPER_SECRET;
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "public/img/" });

const getUsers = async (req, res) => {
  try {
    const results = await db("SELECT * FROM users;");
    res.send(results.data);
  } catch (err) {
    res.status(500).send(err);
  }
};

router.get("/", getUsers);

router.post("/register", upload.single("imagefile"), async (req, res) => {
  const { username, password, email } = req.body;
  const imagefile = req.file;
  // check the extension of the file
  const extension = mime.extension(imagefile.mimetype);
  // create a new random name for the file
  const filename = uuidv4() + "." + extension;
  // grab the filepath for the temporary file
  const tmp_path = imagefile.path;
  // construct the new path for the final file
  const target_path = path.join(__dirname, "../public/img/") + filename;

  try {
    await fs.rename(tmp_path, target_path);
    const hash = await bcrypt.hash(password, saltRounds);

    await db(
      `INSERT INTO users (username, password, email, image) VALUES ("${username}", "${hash}", "${email}", "${filename}")`
    );

    res.send({ message: "Register successful" });
  } catch (err) {
    res.status(400).send({ message: `${err.message}, testing` });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const results = await db(
      `SELECT * FROM users WHERE username = "${username}"`,
      "login"
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
      res.send({
        message: "Login successful",
        username: user.username,
        token,
        image: user.image,
      });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//Middleware to verify token and get user_id
router.get("/profile", userShouldBeLoggedIn, async (req, res) => {
  try {
    const results = await db(
      `SELECT username, email, image FROM users WHERE id=${req.user_id}`
    );
    const user = results.data[0];
    if (!user) throw new Error("User not found");
    res.send({ user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
