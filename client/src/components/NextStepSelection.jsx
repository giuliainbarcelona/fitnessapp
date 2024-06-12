import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useNavigate } from "react-router-dom";

const NextStepSelection = ({ selectedWorkout }) => {
  const [workoutSaved, setWorkoutSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [exercises, setExercises] = useState([]);
  //   const [sentWorkouts, setSentWorkouts] = useState([]);
  const navigate = useNavigate();
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

  const handleExercise = () => {
    try {
      console.log(selectedWorkout);
      const id = selectedWorkout.exercises[0].exercise_id;

      navigate(`/Exercises/${id}`, {
        state: { workout: selectedWorkout },
      });
    } catch (error) {
      console.error("Error navigating to exercise page:", error);
    }
  };

  return (
    <div>
      <h4 className="title-next-step">Choose your next step</h4>
      <br />
      <div className="col-sm-6">
        <br />
        <div className="card datepicker-card">
          <div className="card-body">
            {!workoutSaved ? (
              <>
                <p>Save it for later 🗓️</p>
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
                  You can see your full calendar <Link to="/Profile">here</Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <br />
      <div className="col-sm-6">
        <br />
        <div className="card exercis-btn-card">
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
  );
};

export default NextStepSelection;
