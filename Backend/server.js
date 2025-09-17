import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import voiceRoutes from "./routes/voice.js";
import initializePassport from "./utils/passportConfig.js";
initializePassport(passport);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected with Database!");
  } catch (err) {
    console.log(" Failed to connect with Db", err);
  }
};
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

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