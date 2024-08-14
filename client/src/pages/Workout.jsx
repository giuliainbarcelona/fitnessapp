import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { cardio } from "ldrs";

cardio.register();

import "bootstrap/dist/css/bootstrap.min.css";

const apiurl = "https://api.api-ninjas.com/v1/exercises";

export default function Workout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [workoutSaved, setWorkoutSaved] = useState(false);
  const [sentWorkouts, setSentWorkouts] = useState([]);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWorkouts() {
      const muscle = searchParams.get("muscle");
      const difficulty = searchParams.get("difficulty");
      const type = searchParams.get("type");

      if (muscle && difficulty && type) {
        // Fetch saved workouts
        try {
          setLoadingExercise(true);
          setLoadingEquipment(true);
          const response = await fetch(
            `${apiurl}?muscle=${muscle}&difficulty=${difficulty}&type=${type}`,
            {
              headers: {
                "X-Api-Key": import.meta.env.VITE_RAPIDID_API_KEY,
              },
            }
          );

          const exercisesData = await response.json();
          setExercises(exercisesData.slice(0, 5)); // Limits the amount of workouts
          setLoadingExercise(false);
          setLoadingEquipment(false);
        } catch (err) {
          console.error("Error fetching saved workouts:", err);
        }
      } else {
        // Connected to the backend router.get(“/”);
        // Retrives all the sent workouts
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
            console.error(
              "Failed to fetch any sent workouts:",
              response.statusText
            );
          }
        } catch (err) {
          console.error("Error fetching sent workouts:", err);
        }
      }
    }

    fetchWorkouts();
  }, [searchParams]);

  const handleDateSelection = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleTimeSelection = (newValue) => {
    setSelectedTime(newValue);
  };

  const handleSave = async (e) => {
    // Handle save logic here: saving the selected date to state to pass it to the calendar
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date and time.");
      return;
    }
    const data = {
      date: `${selectedDate.format("YYYY-MM-DD")}T${selectedTime.format(
        "HH:mm:ss.SSS"
      )}`,
      exercises: exercises,
    };
    // Connected to the backend: router.post(“/”);
    // Created the workout and saves it for later
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
      setWorkoutSaved(true);
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleExercise = async (e) => {
    e.preventDefault();

    const data = {
      date: "2024-08-14",
      exercises: exercises,
    };

    // Connected to the backend: router.post(“/”);
    // Created the workout and saves it for later and starts the exercise
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
      <h3 className="page-title-less">Your Workout Plan</h3>
      <br />

      <div className="row">
        <div className="col-sm-6 mb-3 mb-sm-4">
          <div className="card exercise-card" style={{ minHeight: "300px" }}>
            <div className="card-body text-center d-flex align-items-center justify-content-center fixed height">
              {loadingExercise && (
                <l-cardio size="50" stroke="4" speed="2" color="black" />
              )}
              {!loadingExercise && (
                <div>
                  <h5 className="card-title">Exercise Name</h5>
                  {exercises.map((workout, index) => (
                    <p key={index} className="card-text">
                      {workout.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card equipments-card" style={{ minHeight: "300px" }}>
            <div className="card-body text-center d-flex align-items-center justify-content-center fixed height">
              {loadingEquipment && (
                <l-cardio size="50" stroke="4" speed="2" color="black" />
              )}
              {!loadingEquipment && (
                <div>
                  <h5 className="card-title"> Equipment Needed</h5>
                  {exercises.map((workout, index) => (
                    <p key={index} className="card-text">
                      {workout.equipment}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <h4 className="title-next-step">Choose your next step</h4>
        <br />
        <div className="col-sm-6 mb-3 mb-sm-4">
          <br />
          <div className="card datepicker-card" style={{ height: "100%" }}>
            <div className="card-body">
              {!workoutSaved ? (
                <>
                  <p>Save it for later 🗓️</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Basic date picker"
                      className="datepicker"
                      onChange={handleDateSelection}
                    />
                  </LocalizationProvider>
                  <br />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Basic time picker"
                      className="datepicker"
                      onChange={handleTimeSelection}
                    />
                  </LocalizationProvider>
                  <br />
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#profileModal"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p>Your workout has been saved.</p>
                  <p>
                    You can see your full calendar{" "}
                    <Link to="/Profile">here</Link>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="col-sm-6 mb-3 mb-sm-4">
          <br />
          <div className="card exercise-btn-card" style={{ height: "100%" }}>
            <div className="card-body">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#profileModal"
                onClick={handleExercise}
              >
                Exercise Now 💪🏽
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
