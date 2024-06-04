import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Calendar from "../pages/Calendar";
import { Link } from "react-router-dom";

export default function profile() {
  const [userData, setUserData] = useState(null);

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
    fetchUserData();
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
        <Calendar />
        <div className = "workout-call-to-action">
        <p>Actually, I want to</p>
        <Link to="/Exercises" className="workout-now-button">
          ..WORKOUT NOW
        </Link>
        </div>
      </div>
    </>
  );
}
