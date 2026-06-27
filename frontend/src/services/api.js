import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000", // change if your port differs
  withCredentials: true, // VERY IMPORTANT for cookies (JWT)
});

// ---------- AUTH ----------
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");

// ---------- TASKS ----------
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.patch(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ---------- STATS ----------
export const getStats = () => API.get("/stats");
