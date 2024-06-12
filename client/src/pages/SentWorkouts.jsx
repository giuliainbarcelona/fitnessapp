import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SentWorkouts() {
  const [sentWorkouts, setSentWorkouts] = useState([]);
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

  const handleViewWorkout = async (workout) => {};

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
          </li>
        ))}
      </ul>
    </div>
  );
}
