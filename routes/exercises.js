var express = require("express");
var router = express.Router();
const db = require("../model/helper");

router.get("/:id", async function (req, res, next) {
  try {
    const exerciseId = req.params.id;
    const exerciseInfo = await db(
      //fetch exercise information for a given exerciseid
      `SELECT * FROM exercises WHERE id = ${exerciseId}`
    );
    //ensure exercise exists
    if (exerciseInfo.data.length === 0) {
      res.status(404).json({ error: "Exercise not found" });
      return;
    }
    //extract exercise data from the result
    const exercise = exerciseInfo.data[0];
    //fetch exercise information for the exercise
    const allExercises = await db(
      //fetch exercise information based on workoutid
      `SELECT * FROM exercises WHERE workout_id = ${exercise.workout_id}`
    );

    const responseData = {
      current: exercise,
      exercises: allExercises.data,
    };

    //send combined exercise and workout info in response
    res.json(responseData);
  } catch (err) {
    console.error("Error getting workout and exercise info", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
