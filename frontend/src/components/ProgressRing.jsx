import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Charts.css";

function ProgressRing({ completed, total }) {
  const ringRef = useRef(null);

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const degrees = percentage * 3.6;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ringRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    });

    return () => ctx.revert(); // Prevent memory leaks
  }, []);

  return (
    <div className="ring-wrapper">
      <div
        ref={ringRef}
        className="progress-ring"
        style={{
          background: `conic-gradient(#6366f1 ${degrees}deg, #1e293b 0deg)`
        }}
      >
        <div className="ring-inner">
          <h3>{percentage}%</h3>
          <p>Completed</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressRing;
