import React from "react";
import { Routes, Route, Link } from "react-router-dom";

export default function navbar() {
  return (
    <>
      <div>navbar</div>

      <Link to="/Profile">Profile</Link>

      <Link to="/Login">Login</Link>

      <Link to="/Register">Register</Link>

      <Link to="/Homepage">Homepage</Link>
    </>
  );
}
