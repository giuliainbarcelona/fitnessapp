import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

export default function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { signOut, currentUser } = auth;

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      {console.log("This is c", currentUser)}
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src="/icon.svg" alt="Logo" style={{ height: "40px" }} />
        </a>
        {auth.isLoggedIn ? (
          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Profile Pic"
              className="navbar-brand profile-pic-nav"
              src={`/img/${currentUser.image}`}
              sx={{ width: 56, height: 56 }}
            />
          </Stack>
        ) : null}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {auth.isLoggedIn ? (
              <>
                <li className="nav-item">Hello, {currentUser.username}: </li>
                <li className="nav-item">
                  <Link to="/Profile" className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleSignOut}
                    className="nav-link"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/Login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
