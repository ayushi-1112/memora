import "./Today.css";
import { useEffect, useState } from "react";

function Today() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/tasks", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Unauthorized");

      const tasks = await response.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueTasks = tasks.filter((task) => {
        if (!task.nextReview || task.completed) return false;

        const reviewDate = new Date(task.nextReview);
        reviewDate.setHours(0, 0, 0, 0);

        return reviewDate <= today;
      });

      setTodayTasks(dueTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handleReviewed = async (task) => {
    try {
      await fetch(`http://127.0.0.1:5000/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ level: task.level }),
      });

      fetchTodayTasks();
      showToast("Task reviewed successfully!");
    } catch (err) {
      console.error("Failed to mark reviewed:", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      fetchTodayTasks();
      showToast("Task deleted.");
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <section className="today">
      <h2>Today's Revisions</h2>

      {todayTasks.length === 0 ? (
        <p className="empty-msg">You're all caught up for today! 🎉</p>
      ) : (
        <ul className="task-list">
          {todayTasks.map((task) => (
            <li key={task._id} className="task-card">
              <div className="task-info">
                <h3>{task.title}</h3>
                <span className="task-level">{task.level}</span>
              </div>

              <div className="task-actions">
                <button
                  className="review-btn"
                  onClick={() => handleReviewed(task)}
                >
                  Mark as Reviewed
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </section>
  );
}

export default Today;
