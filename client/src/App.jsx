import React from "react";
import Buildyourworkout from "./pages/Buildyourworkout";
import Calendar from "./pages/Calendar";
import Workout from "./pages/Workout";
import Exercise from "./pages/Exercise";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./pages/Sidebar";
import SentWorkouts from "./pages/SentWorkouts";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <>
      <AuthProvider>
        <div>
          <Navbar />
        </div>
        <div>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Buildyourworkout" element={<Buildyourworkout />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Exercises/:id" element={<Exercise />} />
            <Route path="/Workout" element={<Workout />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/SentWorkouts" element={<SentWorkouts />} />
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
