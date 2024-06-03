import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const apiurl = "https://api.api-ninjas.com/v1/exercises";

export default function Workout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workouts, setWorkouts] = useState([]);

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

        const workouts = await response.json();
        setWorkouts(workouts.slice(0, 5)); // Limits the amout of WOs that will render
        console.log(workouts); // This is an array of objects!
        console.log(workouts.length); // Gets you back the number of workouts
      } catch (err) {
        console.log("Error message here", err);
      }
    }
    getWorkout();
  }, [searchParams]);

  return (
    <div className="container">
      <h3>Your Workout Plan</h3>
      <br />

      <div className="row">
        <div className="col-sm-6 mb-3 mb-sm-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Workout Names</h5>
              {workouts.map((workout, index) => (
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
              {workouts.map((workout, index) => (
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
              <button>Exercise Now</button>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <br />
          <div className="card">
            <div className="card-body">
              <p>Date range picker</p>
              <button>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
