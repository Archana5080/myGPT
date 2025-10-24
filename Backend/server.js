

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import voiceRoutes from "./routes/voice.js";
import initializePassport from "./utils/passportConfig.js";

const app = express();
const PORT = process.env.PORT || 8080;

// DB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Connected to MongoDB"))
.catch((err) => console.log(" MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// Passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", chatRoutes);
app.use("/auth", authRoutes);
app.use("/api", voiceRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});



/*
app.post("/test", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: req.body.message
            }]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        console.log(data.choices[0].message.content); //reply
        res.send(data.choices[0].message.content);
    } catch(err) {
        console.log(err);
    }
});
*/






/*
import OpenAI from "openai";
import "dotenv/config";
const client = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
);

const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: "code for hello world in javascript\n"
});

console.log(response.output_text);
*/