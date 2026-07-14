import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎯 Collab
        </Link>

        {isAuthenticated ? (
          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/projects" className="nav-link">
              Projects
            </Link>
            <div className="navbar-user">
              <span className="user-name">{user?.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
