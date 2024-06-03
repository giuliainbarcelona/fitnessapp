import React from "react";
import { useState, useEffect } from "react";
const apiurl = "https://api-ninjas.com/api/exercises";

export default function buildyourowkworkout() {
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

  const difficulty = ["beginner", "intermediate", "expert"];

  const type = [
    "cardio",
    "olympic_weightlifting",
    "plyometrics",
    "powerlifting",
    "strength",
    "stretching",
    "strongman",
  ];

  async function getWorkout() {
    try {
      const options = await fetch(
        `https://api.api-ninjas.com/v1/exercises?muscle=${inputCriteria.muscles}&difficulty=${inputCriteria.difficulty}&type=${inputCriteria.type}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          "X-Api-Key": "TAV8D89aex3FxVlNTvqVtA==DPoPSnNYBCrqU9ZY",
        }
      );
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      const exerciseList = await options.json();
      setWorkouts(exerciseList);
    } catch (err) {
      res.status(500).send(err);
      console.log("Error message here", err);
    }
  }

  return (
    <>
      <select name="muscle" value={workouts.muscle}>
        {muscles.map((muscle, idx) => (
          <option key={idx} value={muscle}>
            {muscle}
          </option>
        ))}
      </select>
      {/* <select name="type" value={workout.type}>
        {workouts.map((workout) => (
          <option key={workout.id} value={workout.id}>
            {type}
          </option>
        ))}
      </select> */}
      {/* <select name="difficulty" value={workout.difficulty}>
        <option></option>
      </select> */}
      <div>workout builder let's see</div>
    </>
  );
}

{
  /* <select name="Next_1" value={step.Next_1}>
  {allSteps.map((step) => (
    <option key={step.id} value={step.id}>
      {step.Description}
    </option>
  ))}
</select>; */
}
