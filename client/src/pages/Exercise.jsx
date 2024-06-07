import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState({});
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString();
  const totalExercises = exercise.exercises?.length;

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${id}`, {
          headers: {
            authorization: "Bearer" + localStorage.getItem("token"),
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setExercise(result);
        console.log("Exercise:", result);
      } catch (err) {
        console.error("Error fetching exercise:", err);
      }
    };
    fetchExercise();
  }, [id]);

  if (!exercise.current) {
    return <div>Loading...</div>;
  }

  const currentExerciseIndex = exercise.exercises?.findIndex((e) => {
    return e.id === exercise.current.id;
  });
  const nextExerciseId = exercise.exercises?.[currentExerciseIndex + 1]?.id;
  const previousExerciseId = exercise.exercises?.[currentExerciseIndex - 1]?.id;

  const progress =
    totalExercises > 0
      ? ((currentExerciseIndex + 1) / totalExercises) * 100
      : 0;

  const handleNextExercise = () => {
    if (nextExerciseId) {
      navigate(`/Exercises/${nextExerciseId}`, {
        state: { workout: exercise },
      });
    } else {
      navigate(`/Profile`);
    }
  };

  const handlePreviousExercise = () => {
    if (previousExerciseId) {
      navigate(`/Exercises/${previousExerciseId}`, {
        state: { workout: exercise },
      });
    }
  };

  return (
    <div className="container">
      {/* Exercise details */}
      next exercise id: {nextExerciseId}
      <div className="exercise-details">
        <h1>Here is your exercise!</h1>
        <h3>Today's Date: {today}</h3>

        <h2 class="text-start">Name: {exercise.current?.name}</h2>
        <h4 class="text-start">Type: {exercise.current?.type}</h4>
        <h4 class="text-start">Muscle: {exercise.current?.muscle}</h4>
        <h4 class="text-start">Equipment: {exercise.current?.equipment}</h4>
        <div className="border p-3 bg-faded-blue text-dark-grey">
          <p>Instructions: {exercise.current?.instructions}</p>
        </div>
        <br />

        <p>
          You are on exercise {currentExerciseIndex + 1} of {totalExercises}
        </p>
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped bg-info"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        {currentExerciseIndex > 0 && (
          <button
            className="btn btn-secondary"
            onClick={handlePreviousExercise}
          >
            Previous Exercise
          </button>
        )}
        <button className="btn btn-primary" onClick={handleNextExercise}>
          {currentExerciseIndex === totalExercises - 1
            ? "Done! Go to Profile."
            : "Next Exercise"}
        </button>
        <h5>Want to send this workout to a friend?</h5>
        <input type="text" placeholder="type username here"></input>
        <br/>
        <button className="btn btn-info">Send</button>
      </div>
    </div>
  );
};

export default Exercise;
