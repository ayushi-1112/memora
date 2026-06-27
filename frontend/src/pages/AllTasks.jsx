import "./AllTasks.css";
import { useEffect, useState } from "react";

function AllTasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/tasks", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Unauthorized");

      const tasks = await response.json();
      setAllTasks(tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      setAllTasks(allTasks.filter((task) => task._id !== taskId));
      showToast("Task deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleReview = async (task) => {
    try {
      await fetch(`http://127.0.0.1:5000/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ level: task.level }),
      });

      fetchTasks();
      showToast("Task reviewed.");
    } catch (err) {
      console.error("Review failed:", err);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredTasks = allTasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "due") {
      if (!task.nextReview || task.completed) return false;
      const reviewDate = new Date(task.nextReview);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    }
    return true;
  });

  return (
    <section className="all-tasks">
      <div className="task-header">
        <h2>All Tasks</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="due">Due Today</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty-msg">No tasks match this filter.</p>
      ) : (
        <ul className="task-grid">
          {filteredTasks.map((task) => {
            const reviewDate = new Date(task.nextReview);
            reviewDate.setHours(0, 0, 0, 0);
            const isDue = !task.completed && reviewDate <= today;

            return (
              <li key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <div className="task-meta">
                  <span className="task-level">{task.level}</span>
                  <span className={`task-due ${isDue ? "due-now" : "not-due"}`}>
                    {task.completed
                      ? "Done"
                      : isDue
                      ? "Due Today"
                      : "Upcoming"}
                  </span>
                </div>

                <div className="task-actions">
                  {!task.completed && (
                    <button
                      className="complete-btn"
                      onClick={() => handleReview(task)}
                    >
                      Review
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </section>
  );
}

export default AllTasks;
