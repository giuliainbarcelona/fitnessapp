import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/authContext";

export default function login() {
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { username, password };
    console.log(username);
    console.log(password);
    try {
      const response = await fetch("/api/auth/login", {
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

  return (
    <div className="login-page">
      <div className="login-content">
        <h1 className="page-title">Login</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <br />
          <br />
          <button
            type="submit"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#profileModal"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
