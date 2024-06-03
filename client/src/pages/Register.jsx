import React, { useState } from "react";

export default function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

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

  const onSubmit = async (e) => {
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
      if (responseJson.message === "Yay! Successful Registration.") {
      } else {
        console.log("Error message");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div>
      <h1>register</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
        {errors.username && <span className="error">{errors.username}</span>}
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
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
        <br/>
        <button type="Submit">Register</button>
      </form>
    </div>
  );
}
