import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Charts.css";

function WeeklyBars({ tasks }) {
  const MAX_LIMIT = 10;
  const barsRef = useRef([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const counts = days.map(day =>
    tasks.filter(task => {
      if (!task.lastReviewed) return false;
      return new Date(task.lastReviewed).toDateString() === day.toDateString();
    }).length
  );

  const realMax = Math.max(...counts, 1);
  const visualMax = Math.min(realMax, MAX_LIMIT);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(barsRef.current, { transformOrigin: "bottom center", scaleY: 0 });

      gsap.to(barsRef.current, {
        scaleY: (i) => {
          if (counts[i] === 0) return 0.3; // tiny base
          const scaled = Math.min(counts[i], MAX_LIMIT);
          return scaled*2;
        },
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
    });

    return () => ctx.revert();
  }, [counts]);

  return (
    <div className="bars-wrapper">
      <h3>Last 7 Days Activity</h3>

      <div className="bars">
        {counts.map((count, i) => (
          <div key={i} className="bar-col">
            <div className="bar-wrapper">
              <div
                className="bar"
                ref={(el) => (barsRef.current[i] = el)}
              />
              <div className="tooltip">
                {count} review{count !== 1 && "s"}
              </div>
            </div>

            <span className="bar-label">
              {days[i].toLocaleDateString("en-US", { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyBars;
