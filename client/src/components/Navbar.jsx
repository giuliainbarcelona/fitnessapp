import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function navbar() {
  const auth = useAuth();
  // console.log(auth);
  const navigate = useNavigate();
  const { signOut } = auth;

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
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
              {!auth.isLoggedIn && (
                <li className="nav-item">
                  <Link to="/Login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}
              {!auth.isLoggedIn && (
                <li className="nav-item">
                  <Link to="/Register" className="nav-link">
                    Register
                  </Link>
                </li>
              )}
              {auth.isLoggedIn && (
                <li className="nav-item">
                  <Link to="/Profile" className="nav-link">
                    Profile
                  </Link>
                </li>
              )}
              {auth.isLoggedIn && (
                <li className="nav-item">
                  <button
                    onClick={handleSignOut}
                    className="nav-link"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
