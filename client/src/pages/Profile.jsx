import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Calendar from "../pages/Calendar";
import { Link } from "react-router-dom";

export default function profile() {
  const [userData, setUserData] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [sentWorkouts, setSentWorkouts] = useState([]);

  //fetching userdata from backend
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUserData(data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    async function fetchAllWorkouts() {
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
          console.log("Fetched all workouts:", data);
          setUserWorkouts(data.userWorkouts);
          setSentWorkouts(data.sentWorkouts);
        } else {
          console.error("Failed to fetch workouts:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    }

    fetchAllWorkouts();
  }, []);

  //fetch workouts sent by users to backend
  // const fetchSentWorkouts = async () => {
  //   try {
  //     //fetch to collect workouts sent to a user
  //     const response = await fetch("/api/workouts", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch sent workouts");
  //     }
  //     const data = await response.json();
  //     return data.sentWorkouts;
  //   } catch (err) {
  //     console.error("Error fetching sent workouts:", err);
  //     return [];
  //   }
  // };

  useEffect(() => {
    //fetch user data and sent workouts when the component mounts
    fetchUserData();
    // fetchSentWorkouts();
  }, []);

  return (
    <>
      <div>
        <h1>Hi, welcome to your beautiful profile</h1>
        {userData ? (
          <div>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <div>
        <p>Access your calendar here:</p>
        <Routes>
          <Route path="/Calendar" element={<Calendar />} />
        </Routes>
        <Calendar userWorkouts={userWorkouts} />
        <div className="workout-call-to-action">
          <p>Actually, I want to</p>
          <Link to="/Buildyourworkout" className="workout-now-button">
            ..WORKOUT NOW
          </Link>
        </div>
      </div>
      <h3 className="text-start">Workouts sent to you by friends:</h3>
      <ul>
        {sentWorkouts.map((workout) => (
          <li key={workout.id} className="text-start">
            <em>The user:**{workout.sender_id}**</em> has sent you a workout,
            check it out!
          </li>
        ))}
      </ul>
    </>
  );
}
