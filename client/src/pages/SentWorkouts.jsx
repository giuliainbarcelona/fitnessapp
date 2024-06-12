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
    <div className="container">
      <h1 className="page-title-less">
        Here, you have a list of workouts from your friends!
      </h1>
      <br />
      <div className="row">
        {/* Left column for sent workouts */}
        <div className="col-md-6">
          <div className="row">
            {sentWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="col-md-6 mb-3"
                style={{ height: "100%" }}
              >
                <div className="card">
                  <div className="card-header">
                    Workout from {workout.username}
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Muscle: {workout.exercises[0].muscle}
                    </li>
                    <li className="list-group-item">
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
                        View Workout 🙈
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column for workout summary */}
        <div className="col-md-6">
          {selectedWorkout &&
            selectedWorkout.exercises &&
            selectedWorkout.exercises.length > 0 && (
              <div className="workout-summary-box">
                <h2>Here's your workout summary</h2>
                <br />
                <div className="text-start">
                  <ul>
                    {selectedWorkout.exercises.map((exercise) => (
                      <li key={exercise.exercise_id}>
                        <strong>{exercise.name}</strong> - {exercise.muscle} (
                        {exercise.difficulty})
                      </li>
                    ))}
                    <br />
                  </ul>
                </div>
                <NextStepSelection selectedWorkout={selectedWorkout} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
