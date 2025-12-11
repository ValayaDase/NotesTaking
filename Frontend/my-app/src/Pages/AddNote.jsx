import { useState } from "react";
import { useEffect } from "react";

function AddNoteModal({ isOpen, onClose, onSave, editNote }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState(new Set());

  const allCategories = ["work", "important", "home", "study", "personal", "shopping"];


  useEffect(() => {
  if (editNote) {
    setTitle(editNote.title);
    setDescription(editNote.description);
    setCategories(new Set(editNote.categories || [])); // convert array to Set
  } else {
    setTitle("");
    setDescription("");
    setCategories(new Set());
  }
}, [editNote]);





  const toggleCategory = (cat) => {
    setCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({ title, description, categories: Array.from(categories) });
    setTitle("");
    setDescription("");
    setCategories(new Set());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editNote ? "Edit Note" : "Add New Note"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {allCategories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={categories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={!title.trim() || !description.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNoteModal;
