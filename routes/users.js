var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const userShouldExist = require("../guards/userShouldExist");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//unfinished, working on it
router.get("/search", async function (req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Query paramater is required 'q'" });
    }
    const searchQuery = `SELECT id, username FROM users WHERE username LIKE '%${q}%'`;
    console.log("Generated SQL Query:", searchQuery);
    const result = await db(searchQuery);
    res.status(200).json(result.data);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:user_id", userShouldExist, async function (req, res, next) {
  try {
    const userId = req.params.user_id;
    //returns user information with a specific user id
    const userQuery = `SELECT * FROM users WHERE id = ${userId}`;
    const result = await db(userQuery);
    if (result.data.length) {
      res.status(200).json(result.data[0]);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
