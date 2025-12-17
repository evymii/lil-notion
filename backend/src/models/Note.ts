import mongoose from "mongoose";

type NoteDocument = {
  name: string;
  content: string;
  subject: string;
  created: Date;
};

const noteSchema = new mongoose.Schema<NoteDocument>(
  {
    name: { type: String, required: true },
    content: { type: String, default: "" },
    subject: { type: String, default: "Uncategorized" },
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Note = mongoose.model<NoteDocument>("Note", noteSchema);
