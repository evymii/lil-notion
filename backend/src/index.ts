import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import notesRoutes from "./routes/notes.js";
import subjectsRoutes from "./routes/subjects.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

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

app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
  }
  next();
});

app.use("/api/notes", notesRoutes);
app.use("/api/subjects", subjectsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Notion Notes API" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Notion Notes API" });
});

if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  connectDB();
}

export default app;
