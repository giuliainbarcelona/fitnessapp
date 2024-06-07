const db = require("../model/helper");

async function workoutShouldExist(req, res, next) {
  try {
    const workout_id = req.params.workout_id;

    const sql = `SELECT * FROM workouts WHERE id = ${workout_id}`;
    const result = await db(sql);

    if (result.data.length) {
      req.workout = result.data[0];
      next();
    } else {
      res.status(404).send({ message: "Workout does not exist" });
    }
  } catch (err) {
    console.error("Error checking workout existence:", err);
    res.status(500).send({ message: "Error checking workout existence" });
  }
}

module.exports = workoutShouldExist;
