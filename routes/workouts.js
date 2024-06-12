var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
const userShouldBeAssociatedWithWorkout = require("../guards/userShouldBeLoggedIn");
const workoutShouldExist = require("../guards/workoutShouldExist");

let group;
(async () => {
  const d3 = await import("d3");
  group = d3.group;
})();

router.get("/", userShouldBeLoggedIn, async function (req, res, next) {
  try {
    const user_id = req.user_id; // comes from the guard
    console.log("User ID:", user_id);

    // Combined SQL query to get workout and exercise details
    const combinedQuery = `
      SELECT 
        workouts.id AS workout_id, 
        workouts.user_id,
        workouts.date, 
        workouts.sender_id,
        users.username,
        exercises.id AS exercise_id,
        exercises.muscle,
        exercises.instructions,
        exercises.difficulty,
        exercises.equipment, 
        exercises.name,
        exercises.type
      FROM workouts
      LEFT JOIN users ON users.id = workouts.sender_id
      LEFT JOIN exercises ON workouts.id = exercises.workout_id
      WHERE workouts.user_id = ${user_id}
    `;

    const result = await db(combinedQuery);

    // Grouping by workout_id and formatting the data
    const workouts = {};
    result.data.forEach((row) => {
      const workout_id = row.workout_id;
      if (!workouts[workout_id]) {
        workouts[workout_id] = {
          user_id: row.user_id,
          id: row.workout_id,
          date: row.date,
          sender_id: row.sender_id,
          username: row.username,
          exercises: [],
        };
      }
      if (row.exercise_id) {
        workouts[workout_id].exercises.push({
          exercise_id: row.exercise_id,
          muscle: row.muscle,
          instructions: row.instructions,
          difficulty: row.difficulty,
          equipment: row.equipment,
          name: row.name,
          type: row.type,
        });
      }
    });

    // Converting workouts object to an array
    const formattedData = Object.values(workouts);

    res.status(200).send({
      userWorkouts: formattedData.filter(
        (workout) => workout.sender_id === null
      ),
      sentWorkouts: formattedData.filter(
        (workout) => workout.sender_id !== null
      ),
    });
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).send({ message: err.message });
  }
});

router.get("/:workout_id", async function (req, res, next) {
  try {
    const workout_id = req.params.workout_id;
    exercisesByWorkout = `SELECT exercises.*, workouts.date FROM workouts LEFT JOIN exercises ON workouts.id = exercises.workout_id WHERE workouts.id = ${workout_id}`;
    const result = await db(exercisesByWorkout);

    // This does the grouping by wo_id
    const groupedData = group(result.data, (d) => d.workout_id);
    // console.log(result.data);
    const formattedData = Array.from(groupedData, ([key, values]) => {
      return {
        id: key,
        date: values[0].date,
        exercises: values.map((exercise) => ({
          muscle: exercise.muscle,
          exercise_id: exercise.id,
        })),
      };
    });
    res.status(200).send(formattedData);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ message: err.message });
  }
});

router.put(
  "/:workout_id",
  userShouldBeLoggedIn,
  async function (req, res, next) {
    try {
      const workout_id = req.params.workout_id; // same as above
      const { date } = req.body; // Extract the updated date from the request body
      const exercisesByWorkoutUpdate = `UPDATE workouts SET date = '${date}' WHERE id = ${workout_id}`;
      await db(exercisesByWorkoutUpdate); // Update the workout date in the database
      res.status(200).send({ message: "Workout updated successfully" });
    } catch (err) {
      console.error("Error updating workout:", err);
      res.status(500).send({ message: err.message });
    }
  }
);

router.delete(
  "/:workout_id",

  [userShouldBeLoggedIn, workoutShouldExist, userShouldBeAssociatedWithWorkout],

  async function (req, res, next) {
    try {
      const workout_id = req.params.workout_id;
      const user_id = req.user_id;
      await db(`DELETE FROM exercises WHERE workout_id = ${workout_id}`);
      await db(`
        DELETE FROM workouts WHERE id = ${workout_id}
      `);
      console.log(`Workout ${workout_id} deleted successfully`);
      res.status(200).send({ message: "Workout deleted successfully" });
    } catch (err) {
      console.error("Error deleting workout:", err);
      res.status(500).send({ message: "Error deleting workout" });
    }
  }
);

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

//STEP 1
// get all exercises that match a specific workoutid
//pass the workout id from the frontend

//STEP 2
//duplicate the collection of exercises from step 1

router.post(
  "/duplicate",
  userShouldBeLoggedIn,
  async function (req, res, next) {
    try {
      const user_id = req.user_id;
      const { workout_id, target_user_id } = req.body;
      console.log(
        "Received request to duplicate workout:",
        workout_id,
        "for user:",
        target_user_id
      );
      //fetching workout details
      const workoutQuery = `SELECT * FROM workouts WHERE id = ${workout_id}`;
      const workoutResult = await db(workoutQuery);
      console.log("Workout Query Result:", workoutResult);
      if (workoutResult.data.length === 0) {
        return res.status(404).send({ message: "workout does not exist" });
      }
      const workout = workoutResult.data[0];
      console.log(workout);
      //making sure the workout exists
      const workoutDate = new Date(workout.date);
      const year = workoutDate.getFullYear();
      const month = String(workoutDate.getMonth() + 1).padStart(2, "0");
      const day = String(workoutDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      //create new workout for target user(to be sent)
      const newWorkoutQuery = `INSERT INTO workouts (user_id, date, sender_id) VALUES (${target_user_id}, '${formattedDate}', '${user_id}'); SELECT LAST_INSERT_ID();`;
      const newWorkoutResult = await db(newWorkoutQuery);
      console.log(newWorkoutResult);
      const newWorkoutId = newWorkoutResult.data[0].insertId;
      //fetch exercises associated with the specific workout
      const exercisesQuery = `SELECT * FROM exercises WHERE workout_id = ${workout_id}`;
      const exercisesResult = await db(exercisesQuery);
      const exercises = exercisesResult.data;
      //actual duplication of each exercises to be put into new workout
      for (let exercise of exercises) {
        const duplicateExerciseQuery = `INSERT INTO exercises (workout_id, isDone, name, type, muscle, equipment, difficulty, instructions) VALUES (${newWorkoutId}, 0, '${exercise.name}', '${exercise.type}', '${exercise.muscle}', '${exercise.equipment}', '${exercise.difficulty}', '${exercise.instructions}')`;
        await db(duplicateExerciseQuery);
      }
      res.status(200).send({ message: "Workout duplicated successfully, yay" });
    } catch (err) {
      console.error("Error with duplication process:", err);
      res.status(500).send({ message: "Failed to duplicate workout" });
    }
  }
);

module.exports = router;
