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
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value === "") {
      setErrors({ ...errors, username: "Username required" });
    } else {
      setErrors({ ...errors, username: "" });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setErrors({ ...errors, email: "Email is required" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      setErrors({ ...errors, password: "Password required" });
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

      if (
        responseJson &&
        responseJson.message &&
        responseJson.message.includes("successful")
      ) {
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

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append("imagefile", selectedFile, selectedFile.name);

    try {
      const res = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (errors.username || errors.email || errors.password) {
      return;
    }

    const formData = new FormData();
    formData.append("imagefile", selectedFile);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message === "Register successful") {
        handleLogin();
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleCombinedActions = async (e) => {
    e.preventDefault();
    await onFileUpload();
    handleRegister(e);
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
              <div className="card-body" style={{ textAlign: "center" }}>
                <h3>Select profile picture:</h3>
                <div className="card-select-profile-pic-container">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  ) : (
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        className="input-select-profile-pic btn"
                        onChange={onFileChange}
                      />
                      Choose your picture
                    </label>
                  )}
                </div>
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
              onClick={handleCombinedActions}
            >
              Register
            </button>
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
