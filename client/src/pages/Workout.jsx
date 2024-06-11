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
  const [workoutSaved, setWorkoutSaved] = useState(false); // New state to render the WO
  const [sentWorkouts, setSentWorkouts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getSavedWorkout() {
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
        setExercises(exercises.slice(0, 5)); // Limits the amout of WOs that will render
        console.log(exercises); // This is an array of objects!
        console.log(exercises.length); // Gets you back the number of workouts
      } catch (err) {
        console.log("Error message here", err);
      }
    }
    getSavedWorkout();
  }, [searchParams]);

  //CHAR IS MAKING THIS TO CONDITIONALLY BE RENDERED IF THE WORKOUT WAS SENT BY ANOTHER USER LOL GOOD LUCK
  // useEffect(() => {
  //   async function fetchSentWorkouts() {
  //     try {
  //       const response = await fetch("/api/workouts", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Fetched SENT workouts:", data);
  //         setSentWorkouts(data.sentWorkouts);
  //       } else {
  //         console.error(
  //           "Failed to getch any sent workouts:",
  //           response.statusText
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Error fetching sent workouts", err);
  //     }
  //   }
  //   fetchSentWorkouts();
  // }, []);

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
    console.log("This is your formatted date from the WO page", formattedDate);

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
      // alert("Your workout has been saved");
      setWorkoutSaved(true);
      // navigate(`/Calendar`);
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleExercise = async (e) => {
    e.preventDefault();

    const data = {
      date: "2024-06-06",
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
      const id = result.exercises[0].id;
      navigate(`/Exercises/${result.exercises[0].id}`, {
        state: { workout: result },
      });
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      console.log("You're done!");
    }
  };

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
              {!workoutSaved ? (
                <>
                  <p>Choose your workout day</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Basic date picker"
                        className="datepicker"
                        onChange={handleDateSelection}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <p>Your workout has been saved.</p>
                  <p>
                    You can see your full calendar <a href="/Calendar">here</a>.
                  </p>
                </>
              )}
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
