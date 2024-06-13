import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import axios from "axios";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState([]);
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

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    console.log(event);
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = async () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("imagefile", selectedFile, selectedFile.name);

    try {
      // Request made to the backend api
      // Send formData object
      const res = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
      getImage();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Submit form clicked!");
    if (errors.username || errors.email || errors.password) {
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("imagefile", selectedFile);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    try {
      // Send POST request to backend with FormData
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type header for FormData
        },
      });

      console.log("Response JSON:", response.data);
      if (response.data.message === "Register successful") {
        
        handleLogin(); // If registration successful, proceed to login
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <h1 className="page-title">Register</h1>
        <br />
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleRegister} className="register-form">
                  <div className="form-group">
                    <label htmlFor="username" className="label-register">
                      Username:
                    </label>
                    <input
                      className="input-register"
                      type="text"
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                    {errors.username && (
                      <span className="error">{errors.username}</span>
                    )}
                    <br />
                    <br />
                    <label htmlFor="email" className="label-register">
                      Email:
                    </label>
                    <input
                      className="input-register input-register-email"
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {errors.email && (
                      <span className="error">{errors.email}</span>
                    )}
                    <br />
                    <br />
                    <label htmlFor="password" className="label-register">
                      Password:
                    </label>
                    <input
                      className="input-register"
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {errors.password && (
                      <span className="error-register">{errors.password}</span>
                    )}
                    <br />
                    <br />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3>Select file to upload:</h3>
                <input type="file" onChange={onFileChange} />
                <button type="button" onClick={onFileUpload}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row justify-content-center">
          <div className="col-md-4">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
