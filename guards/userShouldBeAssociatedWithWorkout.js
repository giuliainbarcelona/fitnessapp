async function userShouldBeAssociatedWithWorkout(req, res, next) {
  const userId = req.user_id;
  const workoutUserId = req.workout.userId;

  //check if the user is associated with the workout

  if (userId === workoutUserId) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "User not associated with this workout" });
  }
}

module.exports = userShouldBeAssociatedWithWorkout;
