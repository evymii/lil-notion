import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, default: "" },
    subject: { type: String, default: "Uncategorized" },
    created: { type: Date, default: Date.now },
}, { timestamps: true });
export const Note = mongoose.model("Note", noteSchema);
//# sourceMappingURL=Note.js.map