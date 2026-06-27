import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "../styles/Auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(containerRef.current, {
      opacity: 0,
      scaleY: 0.01,
      y: 100,
      transformOrigin: "bottom"
    });

    gsap.set(containerRef.current.querySelectorAll("h2, input, button"), {
      opacity: 0
    });

    tl.to(containerRef.current, {
      duration: 0.6,
      opacity: 1,
      y: 0,
      scaleY: 1,
      ease: "power2.out"
    })
    .add(() => containerRef.current.classList.add("floating"), "+=0.1")
    .to(containerRef.current.querySelector("h2"), { opacity: 1, duration: 0.6 })
    .to(containerRef.current.querySelectorAll("input"), {
      opacity: 1,
      duration: 0.5,
      stagger: 0.2
    })
    .to(containerRef.current.querySelector("button"), { opacity: 1, duration: 0.6 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://127.0.0.1:5000/auth/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to server. Please ensure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="beam"></div>

      <form className="auth-container" ref={containerRef} onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          placeholder="Name"
          className={error ? "input-error" : ""}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          type="email"
          className={error ? "input-error" : ""}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className={error ? "input-error" : ""}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">Account created successfully!</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : success ? "Success!" : "Register"}
        </button>
      </form>
    </div>
  );
}
