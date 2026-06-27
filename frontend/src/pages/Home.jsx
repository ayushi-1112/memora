import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import heroImage from "../assets/illustrations/hero.png";
import flowImage from "../assets/illustrations/hero-flow.png";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const heroTextRef = useRef();
  const heroImageRef = useRef();
  const flowImageRef = useRef();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasTasks, setHasTasks] = useState(false);

  // 🔥 Check if user already has tasks
  useEffect(() => {
    const checkTasks = async () => {
      if (user) {
        try {
          const res = await axios.get("http://127.0.0.1:5000/tasks", {
            withCredentials: true,
          });
          setHasTasks(res.data.length > 0);
        } catch {}
      }
    };
    checkTasks();
  }, [user]);

  const handleGetStarted = () => {
    if (!user) return navigate("/register");
    if (user && !hasTasks) return navigate("/new");
    navigate("/today");
  };

  useEffect(() => {
    gsap.fromTo(
      heroTextRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      heroImageRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(
      flowImageRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: flowImageRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <>
      <section className="home">
        <div className="home-content">
          <div className="home-text" ref={heroTextRef}>
            <h1>
              Revise Smarter.
              <br />
              Remember Forever.
            </h1>
            <p>
              Track tasks using science-backed spaced repetition.
              Revise at the right time and move knowledge into long-term memory.
            </p>

            <button onClick={handleGetStarted}>
              {!user
                ? "Start Learning"
                : hasTasks
                ? "Go to Today’s Review"
                : "Add Task’s"}
            </button>
          </div>

          <div className="home-image" ref={heroImageRef}>
            <img src={heroImage} alt="Memory revision illustration" />
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>
          Add tasks, revise them at the right time, and let spaced repetition
          turn short-term learning into permanent memory.
        </p>
        <div className="flow-container" ref={flowImageRef}>
          <img src={flowImage} alt="Task revision flow illustration" />
        </div>
      </section>
    </>
  );
}

export default Home;
