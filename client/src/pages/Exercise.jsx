import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  

  useEffect(() => {
    const fetchExercises = async () => {
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
      } catch (err) {
        console.error("Error fetching exercise:", err);
      }
    };
    fetchExercises();
  }, [id]);

  if (!exercise) {
    return <div>Loading...</div>;
  }

  const totalExercises = 3;
  const today = new Date().toLocaleDateString();

  const handleNextExercise = () => {
    if (currentExercise < totalExercises) {
      setCurrentExercise(currentExercise + 1);
      setStepCount(stepCount + 1);
      history.pushState(`/exercise/${currentExercise + 1}`);
    } else {
      console.log("error");
    }
  };

  return (
    <div>
      <div className="exercise-details">
        <h1>Here is your exercise!</h1>
        <h3>Today's Date: {today}</h3>
        <p>
          You are on exercise {currentExercise} of {totalExercises}
        </p>
        <p>Name:{exercise.name}</p>
        <p>Type:{exercise.type}</p>
        <p>Muscle:{exercise.muscle}</p>
        <p>Instructions:{exercise.instructions}</p>
        <br />
        <p>Equipment:{exercise.equipment}</p>
        <button onClick={handleNextExercise}>Next Exercise</button>
      </div>
    </div>
  );
};

export default Exercise;
