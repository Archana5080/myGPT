import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email });
    await User.register(user, password); // passport-local-mongoose

    // Automatically log in the user after signup
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Signup successful", user: { email: user.email } });
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.name === "UserExistsError") {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(400).json({ message: "Something went wrong", error: err.message });
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Login successful", user: { email: user.email } });
    });
  })(req, res, next);
});

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(400).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
