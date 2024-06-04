var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");


// This code snippet creates a new workout for a logged-in user in a database.
// It first stores the workout data (date) and retrieves the newly generated workout ID.
// Then, it iterates through a list of exercises and inserts them into the database linked to that workout ID.
// Finally, it retrieves the complete list of exercises for the created workout and sends it back as a response.
router.post("/", userShouldBeLoggedIn, async function (req, res, next) {
  try {
    const user_id = req.user_id; // comes from the guard
    const { date, exerciseList } = req.body; // getting the date and exs from the body of the req
    const createWorkout = `INSERT INTO workouts (user_id, date) VALUES (${user_id}, '${date}'); SELECT LAST_INSERT_ID()`;
    let workout_id = await db(createWorkout);
    workout_id = workout_id.data[0].insertId;
    console.log(workout_id);
    // console.log(workoutId.data[0].insertId);
    for (const exercise of exerciseList) {
      const insertExercise = `INSERT INTO exercises (workout_id, isDone, name, type, muscle, equipment, difficulty, instructions) VALUES (${workout_id}, 0, "${exercise.name}", "${exercise.type}", "${exercise.muscle}", "${exercise.equipment}", "${exercise.difficulty}", "${exercise.instructions}")`;
      await db(insertExercise);
    }
    const finalExerciseList = `SELECT * FROM exercises WHERE workout_id = ${workout_id}`;
    const result = await db(finalExerciseList);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error creating workout:", err);
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});


module.exports = router;
