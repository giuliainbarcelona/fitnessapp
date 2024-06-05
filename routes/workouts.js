var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");

// Get all workouts for the logged-in user
router.get("/", userShouldBeLoggedIn, async function (req, res, necxt) {
  try {
    const user_id = req.user_id; // comes from the guard
    const calendarSelection = `SELECT * FROM workouts WHERE user_id = ${user_id}`; // Gets all the WO linked to the logged user.
    const result = await db(calendarSelection);
    res.status(200).send(result.data);
  } catch (err) {
    console.error("Error in the calendar:", err);
    res.status(500).send({ message: err.message });
  }
});

// This code snippet creates a new workout for a logged-in user in a database.
// It first stores the workout data (date) and retrieves the newly generated workout ID.
// Then, it iterates through a list of exercises and inserts them into the database linked to that workout ID.
// Finally, it retrieves the complete list of exercises for the created workout and sends it back as a response.
router.post("/", userShouldBeLoggedIn, async function (req, res, next) {
  try {
    const user_id = req.user_id; // comes from the guard
    const { date, exercises } = req.body; // getting the date and exs from the body of the req
    const createWorkout = `INSERT INTO workouts (user_id, date) VALUES (${user_id}, '${date}'); SELECT LAST_INSERT_ID()`; // Insert a new wokrout into the table with the given user_id and date.
    // Retrives the last inserted ID
    let workout_id = await db(createWorkout);
    workout_id = workout_id.data[0].insertId; // Extracts the generated workout ID from the result
    console.log(workout_id); // This is to check
    for (const exercise of exercises) {
      // Iterates though each exercise of the exList
      const insertExercise = `INSERT INTO exercises (workout_id, isDone, name, type, muscle, equipment, difficulty, instructions) VALUES (${workout_id}, 0, "${exercise.name}", "${exercise.type}", "${exercise.muscle}", "${exercise.equipment}", "${exercise.difficulty}", "${exercise.instructions}")`;
      await db(insertExercise);
    }
    const finalExerciseList = `SELECT * FROM exercises WHERE workout_id = ${workout_id}`; // This give me back an array of exercises
    const finalExerciseResult = await db(finalExerciseList);
    const finalWorkout = `SELECT * FROM workouts WHERE id = ${workout_id}`; // This gives me back a number
    const finalWorkoutResult = await db(finalWorkout);
    const workout = finalWorkoutResult.data[0];
    workout.exercises = finalExerciseResult.data;
    // Extracts the workout details and exercises from the results of the database queries.
    res.status(200).send(workout);
  } catch (err) {
    console.error("Error creating workout:", err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
