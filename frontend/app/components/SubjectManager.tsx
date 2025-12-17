"use client";

import { useState } from "react";
import { SubjectType } from "../nec/types";
import { createSubject, deleteSubject } from "../utils/api";

type SubjectManagerProps = {
  subjects: SubjectType[];
  onSubjectChange: () => void;
};

const SubjectManager = ({ subjects, onSubjectChange }: SubjectManagerProps) => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    try {
      await createSubject(newSubjectName.trim());
      setNewSubjectName("");
      setIsAdding(false);
      onSubjectChange();
    } catch (error) {
      alert("Failed to create subject");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      try {
        await deleteSubject(id);
        onSubjectChange();
      } catch (error) {
        alert("Failed to delete subject");
      }
    }
  };

  return (
    <div className="p-4 border-b border-[#d4d4d4] bg-[#f5f5f5]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#5a5a5a]">Subjects</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-[#7a8a9a] hover:text-[#6a7a8a] transition-colors"
        >
          {isAdding ? "Cancel" : "+ Add"}
        </button>
      </div>
      {isAdding && (
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
            className="flex-1 border border-[#d4d4d4] rounded px-2 py-1 text-sm bg-white"
            placeholder="Subject name"
            autoFocus
          />
          <button
            onClick={handleAddSubject}
            className="px-3 py-1 bg-[#b8c5d6] text-[#4a5568] rounded text-sm hover:bg-[#a8b5c6] transition-colors font-medium"
          >
            Add
          </button>
        </div>
      )}
      <div className="space-y-1">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            className="flex items-center justify-between group"
          >
            <span className="text-sm text-[#5a5a5a]">{subject.name}</span>
            <button
              onClick={() => handleDeleteSubject(subject._id)}
              className="opacity-0 group-hover:opacity-100 text-xs text-[#c89aa9] hover:text-[#b88a99] transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectManager;
