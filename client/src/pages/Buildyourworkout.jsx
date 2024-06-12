import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuildYourWorkout() {
  const [inputCriteria, setInputCriteria] = useState({
    muscle: "",
    type: "",
    difficulty: "",
  });
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(inputCriteria).toString();
    navigate(`/Workout?${params}`);
  };

  return (
    <>
      <div className="buildyour-page">
        <div className="buildyour-content">
          <h2 className="page-title">
            <img
              src="/icon.svg"
              alt="Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />{" "}
            I am your workout builder{" "}
            <img
              src="/icon.svg"
              alt="Logo"
              style={{ height: "40px", marginLeft: "10px" }}
            />
          </h2>
          <br />
          <p>
            You need to choose which muscle group you want to train, <br /> for
            which difficulty level and which type of your workout you enojy the
            most.
          </p>
          <br />
          <h4>Make your selection and I will render your workout</h4>
          <br />
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
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#profileModal"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
