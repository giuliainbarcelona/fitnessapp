var express = require("express");
var router = express.Router();
const db = require("../model/helper");

router.get("/:id", async function (req, res, next) {
  try {
    const exerciseId = req.params.id;
    const exerciseInfo = await db(
      `SELECT * FROM exercises WHERE id = ${exerciseId}`
    );
    if (exerciseInfo.data.length === 0) {
      res.status(404).json({ error: "Workout not found" });
    } else {
      res.json(exerciseInfo.data[0]);
    }
  } catch (err) {
    console.error("Error getting workout info", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
