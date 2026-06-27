import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await api.getTasks();
      setTasks(data.tasks);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    const { data } = await api.createTask(taskData);
    setTasks((prev) => [...prev, data.task]);
  };

  const reviewTask = async (id, level) => {
    const { data } = await api.updateTask(id, { level });
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? data.task : t))
    );
  };

  const removeTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, loading, fetchTasks, addTask, reviewTask, removeTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
