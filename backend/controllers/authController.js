import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const db = req.db;
  const { name, email, password } = req.body;

  const existing = await db.collection("users").findOne({ email });
  if (existing) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  await db.collection("users").insertOne({
    name,
    email,
    password: hashed,
    createdAt: new Date()
  });

  res.status(201).json({ message: "Registered" });
};

export const loginUser = async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid" });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
});
  res.json({ message: "Login success" });
};
