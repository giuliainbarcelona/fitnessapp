import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Workout from "../pages/Workout";



function exerciseList() {
  const [exercises, setExercises] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { workoutId } = useParams();
        if (!workoutId) {
          return;
        }
        const response = await fetch(`end point that Giuia and Char made`);
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      }
    };
    fetchExercises();
  }, [searchParams]);


  return
  (
  <div>
    <h2>Your Workout:</h2>
    {exercises.map((exercise) => (
      <div key={exercise.id}>
        <h3>{exercise.name}</h3>
        <p> Type: {exercise.type} </p>
        <p> Muscle: {exercise.muscle}</p>
      </div>
    ))}
  </div>
  )
}

export default exerciseList;
