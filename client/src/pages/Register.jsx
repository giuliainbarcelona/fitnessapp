import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const auth = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value === "") {
      setErrors({ ...errors, username: "Soz, username required" });
    } else {
      setErrors({ ...errors, username: "" });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setErrors({ ...errors, email: "Soz, email is required" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      setErrors({ ...errors, password: "Soz, password required" });
    } else {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleLogin = async (e) => {
    const data = { username, password };
    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      console.log(responseJson);

      if (
        responseJson &&
        responseJson.message &&
        responseJson.message.includes("successful")
      ) {
        console.log("You did it!");
        localStorage.setItem("token", responseJson.token);
        auth.signIn(responseJson);
        navigate("/buildyourworkout", { state: { token: responseJson.token } });
        // signIn();
      } else {
        console.error("Login error:", responseJson.message);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Submit form clicked!");
    if (errors.username || errors.email || errors.password) {
      return;
    }
    const data = { username, email, password };
    try {
      const response = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const responseJson = await response.json();
      console.log("Response JSON:", responseJson);
      if (responseJson.message === "Register successful") {
        handleLogin();
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div>
      <h1 className="page-title">Register</h1>
      <br />
      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
        {errors.username && <span className="error">{errors.username}</span>}
        <br />
        <br />
        <label htmlFor="email">Email:</label>

        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
        <br />
        <br />
        <button
          type="submit"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#profileModal"
        >
          Register
        </button>
      </form>
    </div>
  );
}
