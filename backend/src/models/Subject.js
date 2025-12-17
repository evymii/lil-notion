"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subjectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Subject = mongoose_1.default.model("Subject", subjectSchema);
//# sourceMappingURL=Subject.js.map