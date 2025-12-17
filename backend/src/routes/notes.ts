import express from "express";
import { Note } from "../models/Note.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { sortBy, subject, search } = req.query;
    let query: any = {};

    if (subject && subject !== "all") {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { content: { $regex: search as string, $options: "i" } },
      ];
    }

    let notes = await Note.find(query);

    if (sortBy === "date") {
      notes = notes.sort((a, b) => b.created.getTime() - a.created.getTime());
    } else if (sortBy === "subject") {
      notes = notes.sort((a, b) => a.subject.localeCompare(b.subject));
    }

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, content, subject } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Note name is required" });
    }
    const note = new Note({
      name: name.trim(),
      content: content || "",
      subject: subject || "Uncategorized",
    });
    await note.save();
    res.status(201).json(note);
  } catch (error: any) {
    console.error("Create note error:", error);
    res.status(500).json({ 
      error: "Failed to create note", 
      details: error.message 
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, content, subject } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (content !== undefined) updateData.content = content;
    if (subject !== undefined) updateData.subject = subject;

    const note = await Note.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error: any) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ error: "Failed to update note", details: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
