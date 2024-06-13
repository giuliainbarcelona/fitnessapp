import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Calendar from "../pages/Calendar";
import { Link } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [sentWorkouts, setSentWorkouts] = useState([]);

  console.log("This is my userData", userData);

  // Fetching user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("User Data:", data.user);
      setUserData(data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  useEffect(() => {
    fetchAllWorkouts();
  }, []);

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

  useEffect(() => {
    //fetch user data and sent workouts when the component mounts
    fetchUserData();
    // fetchSentWorkouts();
  }, []);
  const renderProfileModal = () => {
    return (
      <div
        className="modal fade"
        id="profileModal"
        tabIndex="-1"
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="profileModalLabel">
                <img src="/icon.svg" alt="Logo" style={{ height: "40px" }} />{" "}
                Your Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {userData ? (
                <div>
                  <p>Username: {userData.username}</p>
                  <p>Email: {userData.email}</p>
                  Profile Image:
                  {userData.image && (
                    <img
                      src={`/img/${userData.image}`}
                      alt="Profile Image"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  )}
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  function onDelete() {
    fetchAllWorkouts();
  }

  return (
    <>
      {renderProfileModal()}
      <div>
        <br />
        <h1 className="page-title-less">
          Hi {userData ? userData.username : ""}, welcome to your beautiful
          profile
        </h1>
        <br />
        <div className="profile-buttons">
          <button
            type="button"
            className="btn btn-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#profileModal"
          >
            View Profile 📝
          </button>
          <Link to="/SentWorkouts" className="btn btn-primary me-2">
            Workouts Sent By Friends 👯‍♂️
          </Link>
          <Link
            to="/Buildyourworkout"
            className="btn btn-primary exercise-btn-profile"
          >
            Exercise now 💪
          </Link>
        </div>
      </div>
      <br />
      <br />
      <div>
        <Routes>
          <Route path="/Calendar" element={<Calendar />} />
        </Routes>
        <Calendar userWorkouts={userWorkouts} onDelete={onDelete} />
      </div>
    </>
  );
}
