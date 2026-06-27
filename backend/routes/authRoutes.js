import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// NEW ROUTES
import { ObjectId } from "mongodb";

router.get("/me", protect, async (req, res) => {
  const user = await req.db.collection("users").findOne(
    { _id: new ObjectId(req.userId) },  // 🔥 FIX HERE
    { projection: { password: 0 } }
  );

  res.json({ user });
});


router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;
