import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import notesRoutes from "./routes/notes.js";
import subjectsRoutes from "./routes/subjects.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/notion-notes";
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
app.use("/api/notes", notesRoutes);
app.use("/api/subjects", subjectsRoutes);
app.get("/", (req, res) => {
    res.json({ message: "Notion Notes API" });
});
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map