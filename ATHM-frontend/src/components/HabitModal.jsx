import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "Read 30 mins",
  "Drink 2L Water",
  "Exercise",
  "Code for 1 hour",
  "Meditation",
  "No Sugar",
];

const HabitModal = ({ onClose, onHabitAdded }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await api.post("/habits", { title });
      toast.success("Habit started!");
      onHabitAdded();
      onClose();
    } catch {
      toast.error("Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            New Habit
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What do you want to track?
            </label>
            <input
              autoFocus
              type="text"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="e.g., Morning Jog"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTitle(s)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading || !title.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Start Tracking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
