import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Streak calculation
function calculateStreak(tasks) {
  const dates = tasks
    .filter(t => t.lastReviewed)
    .map(t => {
      const d = new Date(t.lastReviewed);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

  const uniqueDays = [...new Set(dates)].sort((a, b) => b - a);
  if (uniqueDays.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = (uniqueDays[i - 1] - uniqueDays[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// GET stats (user specific)
router.get("/", protect, async (req, res) => {
  const tasks = await req.db
    .collection("tasks")
    .find({ userId: req.userId })
    .toArray();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const todayReviews = tasks.filter(task => {
    if (!task.lastReviewed) return false;
    const reviewed = new Date(task.lastReviewed);
    reviewed.setHours(0, 0, 0, 0);
    return reviewed.getTime() === today.getTime();
  }).length;

  const streak = calculateStreak(tasks);

  res.json({ total, completed, pending, todayReviews, streak });
});

export default router;
