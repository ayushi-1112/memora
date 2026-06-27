import { useState } from "react";
import "./NewTask.css";

function NewTask() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Day 1");
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title: title.trim(),
      level,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("Request failed");

      setTitle("");
      setLevel("Day 1");
      showToast("Task added successfully!");

    } catch (err) {
      console.error("Failed to add task:", err);
      showToast("You must be logged in.");
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <section className="new-task">
      <h2>Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="Day 1">Day 1</option>
          <option value="Day 3">Day 3</option>
          <option value="Day 7">Day 7</option>
          <option value="Day 14">Day 14</option>
        </select>

        <button type="submit">Add Task</button>
      </form>

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </section>
  );
}

export default NewTask;
