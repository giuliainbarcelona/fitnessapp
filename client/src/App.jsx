import React from "react";
import Buildyourworkout from "./pages/Buildyourworkout";
import Calendar from "./pages/Calendar";
import Workout from "./pages/Workout";
import Exercises from "./pages/Exercises";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <div>Hello</div>
      <Routes>
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Buildyourworkout" element={<Buildyourworkout />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Exercises" element={<Exercises />} />
        <Route path="/Workout" element={<Workout />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
