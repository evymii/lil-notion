"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    content: { type: String, default: "" },
    subject: { type: String, default: "Uncategorized" },
    created: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Note = mongoose_1.default.model("Note", noteSchema);
//# sourceMappingURL=Note.js.map