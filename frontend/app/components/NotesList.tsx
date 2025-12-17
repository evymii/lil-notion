"use client";

import { NoteType } from "../nec/types";

type NotesListProps = {
  notes: NoteType[];
  selectedNoteId: string | null;
  onSelectNote: (note: NoteType) => void;
  sortBy: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const NotesList = ({
  notes,
  selectedNoteId,
  onSelectNote,
  sortBy,
}: NotesListProps) => {
  const sortedNotes = [...notes];

  if (sortBy === "date") {
    sortedNotes.sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return dateB - dateA;
    });
  } else if (sortBy === "subject") {
    sortedNotes.sort((a, b) => {
      if (a.subject < b.subject) return -1;
      if (a.subject > b.subject) return 1;
      return 0;
    });
  }

  return (
    <div className="h-full overflow-y-auto bg-[#fafafa]">
      <div className="p-4 border-b border-[#d4d4d4] bg-[#f5f5f5]">
        <h2 className="text-sm font-semibold text-[#5a5a5a]">
          {sortBy === "date"
            ? "Notes sorted by date"
            : "Notes sorted by subject"}
        </h2>
      </div>
      <div className="divide-y divide-[#e5e5e5]">
        {sortedNotes.length === 0 ? (
          <div className="p-4 text-sm text-[#9a9a9a]">No notes found</div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note._id}
              onClick={() => onSelectNote(note)}
              className={`p-4 cursor-pointer hover:bg-[#f0f0f0] transition-colors ${
                selectedNoteId === note._id
                  ? "bg-[#e8e8f0] border-l-4 border-[#b8c5d6]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-[#9a9a9a] mt-1">📄</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#3d3d3d] truncate">
                    {note.name}
                  </div>
                  <div className="text-xs text-[#7a7a7a] mt-1">
                    {formatDate(note.created)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
