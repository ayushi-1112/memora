import { useEffect, useState } from "react";
import "./Upcoming.css";

function Upcoming() {
  const [groups, setGroups] = useState({
    tomorrow: [],
    soon: [],
    later: []
  });

  useEffect(() => {
    fetchUpcomingTasks();
  }, []);

  const fetchUpcomingTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/tasks", {
        credentials: "include", // 🔥 send JWT cookie
      });

      if (!res.ok) throw new Error("Unauthorized");

      const tasks = await res.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = [];
      const soon = [];
      const later = [];

      tasks.forEach((task) => {
        if (task.completed || !task.nextReview) return;

        const reviewDate = new Date(task.nextReview);
        reviewDate.setHours(0, 0, 0, 0);

        const diffDays = (reviewDate - today) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) tomorrow.push(task);
        else if (diffDays >= 2 && diffDays <= 3) soon.push(task);
        else if (diffDays > 3) later.push(task);
      });

      setGroups({ tomorrow, soon, later });

    } catch (err) {
      console.error("Failed to load upcoming tasks:", err);
    }
  };

  const renderGroup = (title, tasks) => (
    <div className="upcoming-group">
      <h3>{title}</h3>
      {tasks.length === 0 ? (
        <p className="empty">No tasks</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="task-card">
              <span>{task.title}</span>
              <span className="level">{task.level}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section className="upcoming">
      <h2>Upcoming Reviews</h2>

      {renderGroup("📅 Tomorrow", groups.tomorrow)}
      {renderGroup("⏳ In 2–3 Days", groups.soon)}
      {renderGroup("📦 Later", groups.later)}
    </section>
  );
}

export default Upcoming;
