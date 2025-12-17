import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const Subject = mongoose.model("Subject", subjectSchema);
//# sourceMappingURL=Subject.js.map