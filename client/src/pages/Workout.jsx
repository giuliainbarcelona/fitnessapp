import React from "react";

export default function Workout({ workouts }) {
  return (
    <div>
      <h3>Your Workout Plan</h3>
      {workouts.length > 0 ? (
        <ul>
          {workouts.map((workout, index) => (
            <li key={index}>
              <h4>{workout.name}</h4>
              <p>Type: {workout.type}</p>
              <p>Muscle: {workout.muscle}</p>
              <p>Difficulty: {workout.difficulty}</p>
              <p>Equipment: {workout.equipment}</p>
              <p>Instructions: {workout.instructions}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts found. Please adjust your criteria and try again.</p>
      )}
    </div>
  );
}
