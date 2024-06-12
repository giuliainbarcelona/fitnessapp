import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NextStepSelection from "../components/NextStepSelection";

export default function SentWorkouts() {
  const [sentWorkouts, setSentWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const colorOptions = [
    "lightblue",
    "lightskyblue",
    "lightsteelblue",
    "lightsalmon",
  ];
  const navigate = useNavigate();

  const fetchSentWorkouts = async () => {
    try {
      const response = await fetch("/api/workouts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSentWorkouts(data.sentWorkouts);
      } else {
        console.error("Failure fetching workouts", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching workouts", err);
    }
  };

  useEffect(() => {
    fetchSentWorkouts();
    console.log(sentWorkouts);
  }, []);

  const handleViewWorkout = (workout) => {
    setSelectedWorkout(workout);
    console.log(workout);
  };

  const getRandomColor = () => {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };

  return (
    <div>
      <h1>Here, you have a list of workouts from your friends!</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sentWorkouts.map((workout) => (
          <li
            key={workout.id}
            className="text-start"
            style={{ marginBottom: "10px" }}
          >
            <span style={{ fontWeight: "bold" }}>Sent by:</span>{" "}
            {workout.username} <br />
            <span style={{ fontWeight: "bold" }}>Muscle:</span>{" "}
            {workout.exercises[0].muscle} <br />
            <div>
              <button
                type="button"
                className="btn btn-outline-info btn-sm"
                style={{
                  marginTop: "5px",
                  borderRadius: "5px",
                  transition: "background-color 0.3s",
                }}
                onClick={() => {
                  handleViewWorkout(workout);
                }}
              >
                View Workout🙈
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedWorkout &&
        selectedWorkout.exercises &&
        selectedWorkout.exercises.length > 0 && (
          <div
            className="workout-summary-box"
            style={{ backgroundColor: getRandomColor() }}
          >
            <h2>Here's your workout summary</h2>

            <h3>Exercises</h3>
            <ul>
              {selectedWorkout.exercises.map((exercise) => (
                <div>
                  <li key={exercise.exercise_id}>
                    <strong>{exercise.name}</strong> - {exercise.muscle} (
                    {exercise.difficulty})
                  </li>
                </div>
              ))}
            </ul>
            <NextStepSelection selectedWorkout={selectedWorkout} />
          </div>
        )}
    </div>
  );
}
