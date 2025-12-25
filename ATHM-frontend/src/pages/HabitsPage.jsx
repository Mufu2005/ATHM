import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { Plus, Flame, Check, X, Trash2, Activity } from "lucide-react";

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  const [newHabitTitle, setNewHabitTitle] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data } = await api.get("/habits");
      setHabits(data || []);
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    try {
      const { data } = await api.post("/habits", { title: newHabitTitle });
      setHabits([...habits, data]);
      setNewHabitTitle("");
      setShowModal(false);
      toast.success("Habit started!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add habit");
    }
  };

  const toggleHabit = async (id) => {
    try {
      const { data } = await api.put(`/habits/${id}/toggle`);
      setHabits(habits.map((h) => (h._id === id ? data : h)));

      const justCompleted = isCompletedToday(data);
      if (justCompleted) {
        toast.success("Habit done! Keep the streak 🔥");
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit");
    }
  };

  const confirmDeleteHabit = async () => {
    if (!habitToDelete) return;
    try {
      await api.delete(`/habits/${habitToDelete._id}`);
      setHabits(habits.filter((h) => h._id !== habitToDelete._id));
      toast.success("Habit deleted");
      setHabitToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete habit");
    }
  };

  const isCompletedToday = (habit) => {
    if (!habit.completedDates) return false;
    const todayStr = new Date().toDateString();
    return habit.completedDates.some(
      (date) => new Date(date).toDateString() === todayStr
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">Loading Habits...</div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Habit Tracker</h1>
          <p className="text-slate-500 mt-1">
            Build consistency, one day at a time.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus size={20} /> New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-medium">No habits tracked yet.</p>
          <p className="text-sm text-slate-400 mt-1">Start small to win big.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <div
              key={habit._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-2">
                    {habit.title}
                  </h3>
                  <button
                    onClick={() => setHabitToDelete(habit)}
                    className="text-slate-300 hover:text-red-500 transition p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className={`p-2 rounded-lg ${
                      habit.streak > 0
                        ? "bg-orange-50 text-orange-600"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Flame
                      size={20}
                      fill={habit.streak > 0 ? "currentColor" : "none"}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {habit.streak || 0}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Day Streak
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleHabit(habit._id)}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${
                  isCompletedToday(habit)
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isCompletedToday(habit) ? (
                  <>
                    <Check size={20} /> Completed
                  </>
                ) : (
                  <>
                    <Activity size={20} /> Mark Done
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">New Habit</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={addHabit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Goal
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Read 10 pages"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition"
                >
                  Start Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        onConfirm={confirmDeleteHabit}
        title="Delete Habit"
        message={`Are you sure you want to stop tracking "${habitToDelete?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default HabitsPage;