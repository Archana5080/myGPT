import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out successfully" }));
});

// Protected route
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ user: req.user });
});

export default router;  //  instead of module.exports
