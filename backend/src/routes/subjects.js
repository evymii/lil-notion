"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Subject_js_1 = require("../models/Subject.js");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const subjects = await Subject_js_1.Subject.find().sort({ name: 1 });
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch subjects" });
    }
});
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Subject name is required" });
        }
        const subject = new Subject_js_1.Subject({ name });
        await subject.save();
        res.status(201).json(subject);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Subject already exists" });
        }
        res.status(500).json({ error: "Failed to create subject" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const subject = await Subject_js_1.Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }
        res.json({ message: "Subject deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete subject" });
    }
});
exports.default = router;
//# sourceMappingURL=subjects.js.map