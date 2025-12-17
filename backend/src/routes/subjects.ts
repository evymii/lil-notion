import express from "express";
import { Subject } from "../models/Subject.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Subject name is required" });
    }
    const subject = new Subject({ name });
    await subject.save();
    res.status(201).json(subject);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Subject already exists" });
    }
    res.status(500).json({ error: "Failed to create subject" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

export default router;

