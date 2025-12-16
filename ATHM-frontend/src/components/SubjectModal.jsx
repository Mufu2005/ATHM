import { useState } from "react";
import { X, Check } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#84cc16", // Lime
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
];

const SubjectModal = ({ onClose, onSubjectAdded }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.post("/subjects", { name, color: selectedColor });
      toast.success("Subject added successfully");
      onSubjectAdded();
      onClose();
    } catch {
      toast.error("Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 scale-100 transition-colors">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Add New Subject
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subject Name
            </label>
            <input
              autoFocus
              type="text"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-700 dark:text-slate-100 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="e.g., Data Structures"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Color Tag
            </label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-md ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-110 shadow-md"
                      : "shadow-sm"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check className="w-4 h-4 text-white drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading || !name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Create Subject"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
