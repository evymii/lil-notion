"use client";

import { useState, useEffect } from "react";
import { NoteType, SubjectType } from "./nec/types";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getSubjects,
} from "./utils/api";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import SubjectManager from "./components/SubjectManager";

const searchInNotes = (notes: NoteType[], searchTerm: string): NoteType[] => {
  if (!searchTerm.trim()) return notes;
  const term = searchTerm.toLowerCase();
  const results: NoteType[] = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (
      note.name.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    ) {
      results.push(note);
    }
  }
  return results;
};

const findMostLikelySubject = (
  notes: NoteType[],
  searchTerm: string
): string => {
  if (!searchTerm.trim()) return "Uncategorized";
  const term = searchTerm.toLowerCase();
  const searchWords = term.split(/\s+/).filter((word) => word.length > 2);
  const subjectScores: { [key: string]: number } = {};

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const noteText = (note.name + " " + note.content).toLowerCase();
    let matchScore = 0;

    for (let j = 0; j < searchWords.length; j++) {
      if (noteText.includes(searchWords[j])) {
        matchScore += 1;
      }
    }

    if (matchScore > 0) {
      const currentScore = subjectScores[note.subject] || 0;
      subjectScores[note.subject] = currentScore + matchScore;
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

const suggestSubjectForNote = (
  notes: NoteType[],
  noteName: string,
  noteContent: string
): string => {
  if (!noteName.trim() && !noteContent.trim()) return "Uncategorized";
  if (notes.length === 0) return "Uncategorized";

  const noteText = (noteName + " " + noteContent).toLowerCase();
  const noteWords = noteText.split(/\s+/).filter((word) => word.length > 2);

  if (noteWords.length === 0) return "Uncategorized";

  const subjectScores: { [key: string]: number } = {};

  for (let i = 0; i < notes.length; i++) {
    const existingNote = notes[i];
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

export default function Home() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "subject">("date");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await getNotes(sortBy, selectedSubject, searchTerm);
      setNotes(data);
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  useEffect(() => {
    loadNotes();
    loadSubjects();
  }, [sortBy, selectedSubject]);

  useEffect(() => {
    if (isSearching && searchTerm) {
      loadNotes();
    }
  }, [searchTerm, isSearching]);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        name: "Untitled",
        content: "",
        subject: selectedSubject !== "all" ? selectedSubject : "Uncategorized",
      });
      setSelectedNote(newNote);
      loadNotes();
    } catch (error) {
      alert("Failed to create note");
    }
  };

  const handleSaveNote = async (noteData: Partial<NoteType>) => {
    if (!selectedNote) return;
    try {
      let finalNoteData = { ...noteData };

      const noteName = noteData.name || selectedNote.name || "";
      const noteContent = noteData.content || selectedNote.content || "";

      if (
        noteData.subject === "Uncategorized" ||
        !noteData.subject ||
        selectedNote.subject === "Uncategorized"
      ) {
        const otherNotes = notes.filter((n) => n._id !== selectedNote._id);
        const suggestedSubject = suggestSubjectForNote(
          otherNotes,
          noteName,
          noteContent
        );
        if (suggestedSubject !== "Uncategorized") {
          finalNoteData.subject = suggestedSubject;
        }
      }

      const updated = await updateNote(selectedNote._id, finalNoteData);
      setSelectedNote(updated);
      loadNotes();
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to save note: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setSelectedNote(null);
      loadNotes();
    } catch (error) {
      alert("Failed to delete note");
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    const filtered = searchInNotes(notes, searchTerm);
    setNotes(filtered);
    if (filtered.length > 0) {
      const likelySubject = findMostLikelySubject(notes, searchTerm);
      setSelectedSubject(
        likelySubject === "Uncategorized" ? "all" : likelySubject
      );
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    loadNotes();
  };

  const recategorizeAllNotes = async () => {
    if (
      !confirm(
        "This will check and update all 'Uncategorized' notes. Continue?"
      )
    ) {
      return;
    }

    try {
      const allNotesData = await getNotes("date", "all", "");
      const uncategorizedNotes = allNotesData.filter(
        (n: NoteType) => n.subject === "Uncategorized"
      );

      if (uncategorizedNotes.length === 0) {
        alert("No uncategorized notes found.");
        return;
      }

      let updatedCount = 0;
      for (let i = 0; i < uncategorizedNotes.length; i++) {
        const note = uncategorizedNotes[i];
        const otherNotes = allNotesData.filter(
          (n: NoteType) => n._id !== note._id
        );
        const suggestedSubject = suggestSubjectForNote(
          otherNotes,
          note.name,
          note.content
        );

        if (suggestedSubject !== "Uncategorized") {
          await updateNote(note._id, { subject: suggestedSubject });
          updatedCount += 1;
        }
      }

      alert(`Updated ${updatedCount} note(s) with suggested subjects.`);
      loadNotes();
    } catch (error) {
      console.error("Recategorize error:", error);
      alert("Failed to recategorize notes");
    }
  };

  const subjectNames = ["Uncategorized", ...subjects.map((s) => s.name)];

  return (
    <div className="flex h-screen bg-[#fafafa]">
      <div className="w-80 border-r border-[#d4d4d4] flex flex-col bg-[#f5f5f5]">
        <div className="p-4 border-b border-[#d4d4d4]">
          <h1 className="text-xl font-bold text-[#3d3d3d] mb-4">Class Notes</h1>
          <div className="space-y-2">
            <button
              onClick={handleCreateNote}
              className="w-full px-4 py-2 bg-[#b8c5d6] text-[#4a5568] rounded hover:bg-[#a8b5c6] transition-colors text-sm font-medium"
            >
              + New Note
            </button>
            <button
              onClick={recategorizeAllNotes}
              className="w-full px-4 py-2 bg-[#d4c5e8] text-[#6a5a7a] rounded hover:bg-[#c4b5d8] transition-colors text-sm font-medium"
            >
              Check All Notes
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("date")}
                className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                  sortBy === "date"
                    ? "bg-[#d4c5e8] text-[#6a5a7a]"
                    : "bg-[#e5e5e5] text-[#5a5a5a] hover:bg-[#d5d5d5]"
                }`}
              >
                By Date
              </button>
              <button
                onClick={() => setSortBy("subject")}
                className={`flex-1 px-3 py-1 rounded text-xs transition-colors ${
                  sortBy === "subject"
                    ? "bg-[#d4c5e8] text-[#6a5a7a]"
                    : "bg-[#e5e5e5] text-[#5a5a5a] hover:bg-[#d5d5d5]"
                }`}
              >
                By Subject
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search notes..."
                className="flex-1 border border-[#d4d4d4] rounded px-2 py-1 text-xs bg-white"
              />
              {isSearching ? (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1 bg-[#e5e5e5] text-[#5a5a5a] rounded text-xs hover:bg-[#d5d5d5] transition-colors"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={handleSearch}
                  className="px-3 py-1 bg-[#b8c5d6] text-[#4a5568] rounded text-xs hover:bg-[#a8b5c6] transition-colors font-medium"
                >
                  Done
                </button>
              )}
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-[#d4d4d4] rounded px-2 py-1 text-xs bg-white"
            >
              <option value="all">All Subjects</option>
              {subjectNames.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>
        <SubjectManager subjects={subjects} onSubjectChange={loadSubjects} />
        <NotesList
          notes={notes}
          selectedNoteId={selectedNote?._id || null}
          onSelectNote={setSelectedNote}
          sortBy={sortBy}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <NoteEditor
          note={selectedNote}
          subjects={subjectNames}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          allNotes={notes}
        />
      </div>
    </div>
  );
}
