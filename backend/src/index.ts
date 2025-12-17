import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import notesRoutes from "./routes/notes.js";
import subjectsRoutes from "./routes/subjects.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/notion-notes";
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

app.use("/api/notes", notesRoutes);
app.use("/api/subjects", subjectsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Notion Notes API" });
});

if (process.env.VERCEL) {
  connectDB();
} else {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;

