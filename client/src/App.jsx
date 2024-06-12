import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import RequireAuth from "./components/RequireAuth";
import Homepage from "./pages/Homepage";
import Buildyourworkout from "./pages/Buildyourworkout";
import Calendar from "./pages/Calendar";
import Exercise from "./pages/Exercise";
import Workout from "./pages/Workout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SentWorkouts from "./pages/SentWorkouts";
import Navbar from "./components/Navbar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/Profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/Buildyourworkout"
          element={
            <RequireAuth>
              <Buildyourworkout />
            </RequireAuth>
          }
        />
        <Route
          path="/Calendar"
          element={
            <RequireAuth>
              <Calendar />
            </RequireAuth>
          }
        />
        <Route
          path="/Exercises/:id"
          element={
            <RequireAuth>
              <Exercise />
            </RequireAuth>
          }
        />
        <Route
          path="/Workout"
          element={
            <RequireAuth>
              <Workout />
            </RequireAuth>
          }
        />
        <Route
          path="/SentWorkouts"
          element={
            <RequireAuth>
              <SentWorkouts />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
