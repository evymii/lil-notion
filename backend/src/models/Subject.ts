import mongoose from "mongoose";

type SubjectDocument = {
  name: string;
  createdAt: Date;
};

const subjectSchema = new mongoose.Schema<SubjectDocument>(
  {
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Subject = mongoose.model<SubjectDocument>("Subject", subjectSchema);

