import express from "express";
import { ObjectId } from "mongodb";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Utility: next review date
function getNextReviewDate(level) {
  const levelToDays = {
    "Day 1": 1,
    "Day 3": 3,
    "Day 7": 7,
    "Day 14": 14,
  };
  const daysToAdd = levelToDays[level] || 0;
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date;
}

// GET tasks (only user's)
router.get("/", protect, async (req, res) => {
  const tasks = await req.db
    .collection("tasks")
    .find({ userId: req.userId })
    .toArray();
  res.json(tasks);
});

// POST new task
router.post("/", protect, async (req, res) => {
  const { title, level } = req.body;

  const task = {
    title,
    level,
    lastReviewed: new Date(),
    nextReview: getNextReviewDate(level),
    completed: false,
    userId: req.userId,
  };

  const result = await req.db.collection("tasks").insertOne(task);
  res.status(201).json({ ...task, _id: result.insertedId });
});

// PATCH task (review progression)
router.patch("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { level } = req.body;

  const nextLevelMap = {
    "Day 1": { level: "Day 3", daysToAdd: 2 },
    "Day 3": { level: "Day 7", daysToAdd: 4 },
    "Day 7": { level: "Day 14", daysToAdd: 7 },
    "Day 14": { level: "Completed", daysToAdd: 0 }
  };

  const current = nextLevelMap[level] || { level: "Completed", daysToAdd: 0 };
  const now = new Date();
  const nextReview = current.daysToAdd > 0
    ? new Date(now.getTime() + current.daysToAdd * 24 * 60 * 60 * 1000)
    : null;

  const update = {
    level: current.level,
    completed: current.level === "Completed",
    lastReviewed: now,
    nextReview,
  };

  await req.db.collection("tasks").updateOne(
    { _id: new ObjectId(id), userId: req.userId },
    { $set: update }
  );

  res.sendStatus(200);
});

// DELETE task
router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;
  await req.db
    .collection("tasks")
    .deleteOne({ _id: new ObjectId(id), userId: req.userId });

  res.sendStatus(204);
});

export default router;
