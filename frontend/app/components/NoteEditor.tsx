"use client";

import { useState, useEffect } from "react";
import { NoteType } from "../nec/types";

type NoteEditorProps = {
  note: NoteType | null;
  subjects: string[];
  onSave: (note: Partial<NoteType>) => void;
  onDelete: (id: string) => void;
  allNotes?: NoteType[];
};

const suggestSubject = (
  allNotes: NoteType[],
  noteName: string,
  noteContent: string,
  currentNoteId?: string
): string => {
  if (!noteName.trim() && !noteContent.trim()) return "Uncategorized";
  if (allNotes.length === 0) return "Uncategorized";

  const noteText = (noteName + " " + noteContent).toLowerCase();
  const noteWords = noteText.split(/\s+/).filter((word) => word.length > 2);

  if (noteWords.length === 0) return "Uncategorized";

  const subjectScores: { [key: string]: number } = {};

  for (let i = 0; i < allNotes.length; i++) {
    const existingNote = allNotes[i];

    if (currentNoteId && existingNote._id === currentNoteId) {
      continue;
    }

    const existingText = (
      existingNote.name +
      " " +
      existingNote.content
    ).toLowerCase();
    let matchCount = 0;

    for (let j = 0; j < noteWords.length; j++) {
      if (existingText.includes(noteWords[j])) {
        matchCount += 1;
      }
    }

    if (matchCount > 0) {
      const currentScore = subjectScores[existingNote.subject] || 0;
      subjectScores[existingNote.subject] = currentScore + matchCount;
    }
  }

  let maxScore = 0;
  let mostLikely = "Uncategorized";
  const subjects = Object.keys(subjectScores);
  for (let i = 0; i < subjects.length; i++) {
    if (subjectScores[subjects[i]] > maxScore) {
      maxScore = subjectScores[subjects[i]];
      mostLikely = subjects[i];
    }
  }

  return mostLikely;
};

const NoteEditor = ({
  note,
  subjects,
  onSave,
  onDelete,
  allNotes = [],
}: NoteEditorProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("Uncategorized");

  useEffect(() => {
    if (note) {
      setName(note.name);
      setContent(note.content);
      setSubject(note.subject);
    } else {
      setName("");
      setContent("");
      setSubject("Uncategorized");
    }
  }, [note]);

  useEffect(() => {
    if (
      note &&
      subject === "Uncategorized" &&
      (name.trim() || content.trim()) &&
      allNotes.length > 0
    ) {
      const timeoutId = setTimeout(() => {
        const suggested = suggestSubject(allNotes, name, content, note._id);
        if (suggested !== "Uncategorized") {
          setSubject(suggested);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [name, content, note, subject, allNotes.length]);

  const handleSave = () => {
    if (!name.trim()) return;

    let finalSubject = subject;
    if (
      subject === "Uncategorized" &&
      (name.trim() || content.trim()) &&
      allNotes.length > 0
    ) {
      const suggested = suggestSubject(
        allNotes,
        name.trim(),
        content.trim(),
        note?._id
      );
      if (suggested !== "Uncategorized") {
        finalSubject = suggested;
        setSubject(suggested);
      }
    }

    onSave({
      name: name.trim(),
      content: content.trim(),
      subject: finalSubject,
    });
  };

  const handleDelete = () => {
    if (note && confirm("Are you sure you want to delete this note?")) {
      onDelete(note._id);
    }
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-[#9a9a9a] bg-[#fafafa]">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <div>Select a note to view or create a new one</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-[#d4d4d4] bg-[#fafafa]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-2xl font-semibold w-full border-none outline-none bg-transparent text-[#2d2d2d]"
          placeholder="Untitled"
        />
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-[#7a7a7a]">Created:</span>{" "}
            <span className="text-[#5a5a5a]">
              {new Date(note.created).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#7a7a7a]">Subject:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-[#d4d4d4] rounded px-2 py-1 text-[#5a5a5a] bg-white"
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#b8c5d6] text-[#4a5568] rounded hover:bg-[#a8b5c6] transition-colors font-medium"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-[#e8c5d4] text-[#6b4a5a] rounded hover:bg-[#d8b5c4] transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full border-none outline-none resize-none bg-transparent text-[#2d2d2d]"
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
};

export default NoteEditor;
