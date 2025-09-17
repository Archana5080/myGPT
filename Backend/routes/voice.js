import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const router = express.Router();

//  ensure files are saved with `.webm` extension
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🎤 Voice → Text (Speech-to-Text)
router.post("/voice-to-text", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = req.file.path;

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe", // OpenAI Whisper
    });

    fs.unlinkSync(filePath); // ✅ clean up temp file

    if (!transcription.text || transcription.text.trim() === "") {
      return res.status(400).json({ error: "Empty transcription" });
    }

    res.json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to transcribe" });
    }
  }
});

export default router;
