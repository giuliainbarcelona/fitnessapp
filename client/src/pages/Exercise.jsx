import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { cardio } from "ldrs";

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState({});
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString();
  const totalExercises = exercise.exercises?.length;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      await performSearch(e.target.value);
    } else {
      setSearchResults([]);
    }
  };

  const performSearch = async (query) => {
    try {
      const response = await fetch(`/api/users/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error fetching search results", err);
    }
  };

  const handleUserSelect = async (user) => {
    console.log("User selected:", user); // debugging: this gets console logged.
    setSelectedUser(user);
    setSearchQuery(user.username);
    setSearchResults([]);
  };

  const handleSendWorkout = async () => {
    if (!selectedUser) {
      alert("Please select user to send workout to");
      return;
    }
    try {
      const response = await fetch("/api/workouts/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          workout_id: exercise.current.workout_id,
          target_user_id: selectedUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error response");
      }
      const result = await response.json();
      alert("Workout sent successfully!");
    } catch (err) {
      console.error("Error sending workout", err);
      alert("failed to send workout");
    }
  };

  return (
    <div className="container">
      <div className="exercise-details">
        <h1 className="page-title-less">
          <img src="/icon.svg" alt="Logo" style={{ height: "40px" }} /> Here is
          your exercise!{" "}
          <img src="/icon.svg" alt="Logo" style={{ height: "40px" }} />
        </h1>
        <br />
        <h3>Today's Date: {today}</h3>
        <br />
        <h3 className="text-start">Name: {exercise.current?.name}</h3>
        <h4 className="text-start">Type: {exercise.current?.type}</h4>
        <h4 className="text-start">Muscle: {exercise.current?.muscle}</h4>
        <h4 className="text-start">Equipment: {exercise.current?.equipment}</h4>
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
        <button
          className="btn btn-primary"
          onClick={() => handleNextExercise()}
        >
          {currentExerciseIndex === totalExercises - 1
            ? "Done! Go to Profile."
            : "Next Exercise"}
        </button>
        <br />
        <br />
        <h5 className="text-start">Want to send this workout to a friend?</h5>
        <div className="position-relative">
          <input
            className="text-start form-control"
            style={{ width: "200px" }}
            type="text"
            placeholder="type username here"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <ul className="dropdown">
              {searchResults.map((user) => (
                <li key={user.id} onClick={() => handleUserSelect(user)}>
                  {user.username}
                </li>
              ))}
            </ul>
          )}

          <br />
        </div>
        <div className="text-start">
          <button className="btn btn-info" onClick={handleSendWorkout}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
