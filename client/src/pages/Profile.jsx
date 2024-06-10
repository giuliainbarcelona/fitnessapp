// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Calendar from "../pages/Calendar";
// import { Link } from "react-router-dom";

// export default function profile() {
//   const [userData, setUserData] = useState(null);

//   //fetching userdata from backend
//   const fetchUserData = async () => {
//     try {
//       const response = await fetch("/api/auth/profile", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.json();
//       setUserData(data.user);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   return (
//     <>
//       <div>
//         <br />
//         <h1>
//           Hi {userData ? userData.username : ""}, welcome to your beautiful
//           profile
//         </h1>
//         {userData ? (
//           <div>
//             <p>Username: {userData.username}</p>
//             <p>Email: {userData.email}</p>
//           </div>
//         ) : (
//           <p>Loading user data...</p>
//         )}
//       </div>
//       <div>
//         <p>Access your calendar here:</p>
//         <Routes>
//           <Route path="/Calendar" element={<Calendar />} />
//         </Routes>
//         <Calendar />
//         <div className="workout-call-to-action">
//           <p>Actually, I want to</p>
//           <Link to="/Buildyourworkout" className="workout-now-button">
//             ..WORKOUT NOW
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Calendar from "../pages/Calendar";
import { Link } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);

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
      setUserData(data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
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

  return (
    <>
      {renderProfileModal()}
      <div>
        <br />
        <h1>
          Hi {userData ? userData.username : ""}, welcome to your beautiful
          profile
        </h1>
        <br />
        <button
          type="button"
          className="btn btn-primary profile-btn-profile"
          data-bs-toggle="modal"
          data-bs-target="#profileModal"
        >
          View Profile Details
        </button>
        <Link
          to="/Buildyourworkout"
          className="btn btn-primary exercise-btn-profile"
        >
          Exercise now 💪🏽
        </Link>
      </div>
      <div>
        <Routes>
          <Route path="/Calendar" element={<Calendar />} />
        </Routes>
        <Calendar />
      </div>
    </>
  );
}
