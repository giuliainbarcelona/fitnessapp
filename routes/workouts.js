var express = require("express");
var router = express.Router();
const db = require("../model/helper");

//creates the instance of the workout and connects the user with it.
router.get("/workout", async function (req, res, next) {
  try {
    const submitWorkout = `SELECT * FROM workouts WHERE id = ${user_id}`;
    res.status(200).send(submitWorkout.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

//collects the exercises from a given workoutid
router.post("/", async function (req, res, next) {
  try {
    const createWorkout = `INSERT INTO exercises (name, equipment) VALUES ("${req.body.name}", "${req.body.equipment}")`;
    await db(createWorkout);
    const workoutList = `SELECT * FROM exercises`;
    const result = await db(workoutList);
    res.status(200).send(result.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;