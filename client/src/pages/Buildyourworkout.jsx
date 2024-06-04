import React from "react";
import { useState } from "react";
import Workout from "../pages/Workout";
const apiurl = "https://api.api-ninjas.com/v1/exercises";
import { useLocation } from "react-router-dom";

export default function BuildYourWorkout() {
  const [inputCriteria, setInputCriteria] = useState({
    muscle: "",
    type: "",
    difficulty: "",
  });
  const [workouts, setWorkouts] = useState([]);
  const muscles = [
    "abdominals",
    "abductors",
    "adductors",
    "biceps",
    "calves",
    "chest",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "lower_back",
    "middle_back",
    "neck",
    "quadriceps",
    "traps",
    "triceps",
  ];

  const handleMuscleChange = (e) => {
    setInputCriteria({ ...inputCriteria, muscle: e.target.value });
  };

  const difficulty = ["beginner", "intermediate", "expert"];

  const handleDifficultyChange = (e) => {
    setInputCriteria({ ...inputCriteria, difficulty: e.target.value });
  };

  const type = [
    "cardio",
    "olympic_weightlifting",
    "plyometrics",
    "powerlifting",
    "strength",
    "stretching",
    "strongman",
  ];

  const handleTypeChange = (e) => {
    setInputCriteria({ ...inputCriteria, type: e.target.value });
  };

  async function getWorkout() {
    try {
      const response = await fetch(
        `${apiurl}?muscle=${inputCriteria.muscle}&difficulty=${inputCriteria.difficulty}&type=${inputCriteria.type}`,

        {
          headers: {
            "X-Api-Key": "TAV8D89aex3FxVlNTvqVtA==DPoPSnNYBCrqU9ZY",
          },
        }
      );

      const exerciseList = await response.json();
      setWorkouts(exerciseList);
    } catch (err) {
      console.log("Error message here", err);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getWorkout();
  };

  return (
    <>
      <h2>🏋🏻‍♀️ I am your workout builder 🏋🏼</h2>
      <h4>Make your selection and I will render your workout</h4>
      <form onSubmit={handleSubmit}>
        <select
          name="muscle"
          value={inputCriteria.muscle}
          onChange={handleMuscleChange}
        >
          <option value="default">Choose muscle group</option>
          {muscles.map((muscle, idx) => (
            <option key={idx} value={muscle}>
              {muscle}
            </option>
          ))}
        </select>
        <select
          name="difficulty"
          value={inputCriteria.difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="default">Choose difficulty</option>
          {difficulty.map((difficulty, idx) => (
            <option key={idx} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        <select
          name="type"
          value={inputCriteria.type}
          onChange={handleTypeChange}
        >
          <option value="default">Choose workout type</option>
          {type.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>

      <Workout workouts={workouts} />
    </>
  );
}
