import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import logo from "../../assets/branding/logo.png";
import "./Navbar.css";
import { useState } from "react";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await axios.post("http://127.0.0.1:5000/auth/logout", {}, { withCredentials: true });
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="App Logo" />
        <span>Memory</span>
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      <ul className={`navbar-links ${open ? "active" : ""}`}>
        {user ? (
          <>
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/today" onClick={() => setOpen(false)}>Today</Link></li>
            <li><Link to="/upcoming" onClick={() => setOpen(false)}>Upcoming</Link></li>
            <li><Link to="/tasks" onClick={() => setOpen(false)}>All Tasks</Link></li>
            <li><Link to="/new" onClick={() => setOpen(false)}>Add Task</Link></li>
            <li><Link to="/progress" onClick={() => setOpen(false)}>Progress</Link></li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setOpen(false)}>Sign In</Link></li>
            <li><Link to="/register" onClick={() => setOpen(false)}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
