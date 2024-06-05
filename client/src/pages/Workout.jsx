import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

const apiurl = "https://api.api-ninjas.com/v1/exercises";

export default function Workout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState(); // if it does not work do null
  const navigate = useNavigate();

  useEffect(() => {
    async function getWorkout() {
      try {
        const muscle = searchParams.get("muscle");
        const difficulty = searchParams.get("difficulty");
        const type = searchParams.get("type");

        const response = await fetch(
          `${apiurl}?muscle=${muscle}&difficulty=${difficulty}&type=${type}`,
          {
            headers: {
              "X-Api-Key": "TAV8D89aex3FxVlNTvqVtA==DPoPSnNYBCrqU9ZY",
            },
          }
        );

        const exercises = await response.json();
        setExercises(exercises.slice(0, 3)); // Limits the amout of WOs that will render
        console.log(exercises); // This is an array of objects!
        console.log(exercises.length); // Gets you back the number of workouts
      } catch (err) {
        console.log("Error message here", err);
      }
    }
    getWorkout();
  }, [searchParams]);

  const handleDateSelection = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleSave = async (e) => {
    // Handle save logic here: saving the selected date to state to pass it to the calendar
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    const formattedDate = `${selectedDate.$y}-${String(
      selectedDate.$M + 1
    ).padStart(2, "0")}-${String(selectedDate.$D).padStart(2, "0")}`;

    const data = {
      date: formattedDate,
      exercises: exercises,
    };

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Success;", result);
      navigate(`/Calendar`);
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleExercise = (e) => {
    e.preventDefault();
    console.log("Handle exercise function being called");
    if (exercises.length > 0) {
      const firstWorkout = exercises[0];
      if (firstWorkout.exercises.length > 0) {
        const firstExercise = firstWorkout.exercises[0];
        navigate(`/exercises/${firstExercise.id}`);
      }
    }
  };

  //     navigate(`/Exercises/${workout_id}`); // navigate(`/Workout?${params}`); with date values

  return (
    <div className="container">
      <h3>Your Workout Plan</h3>
      <br />

      <div className="row">
        <div className="col-sm-6 mb-3 mb-sm-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Workout Names</h5>
              {exercises.map((workout, index) => (
                <p key={index} className="card-text">
                  {workout.name}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"> Equipments Needed</h5>
              {exercises.map((workout, index) => (
                <p key={index} className="card-text">
                  {workout.equipment}
                </p>
              ))}
            </div>
          </div>
        </div>
        <h3>Choose your next step</h3>
        <br />
        <div className="col-sm-6">
          <br />
          <div className="card">
            <div className="card-body">
              <p>Choose your workout day</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Basic date picker"
                    onChange={(newValue) => handleDateSelection(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <br />
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
        <br />
        <div className="col-sm-6">
          <br />
          <div className="card">
            <div className="card-body">
              <Button
                variant="contained"
                color="primary"
                onClick={handleExercise}
              >
                Exercise Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
