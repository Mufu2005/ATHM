import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import {
  Plus,
  Flame,
  Check,
  Trash2,
  Moon,
  Sun,
  TrendingUp,
} from "lucide-react";
import HabitModal from "../components/HabitModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  const { theme, toggleTheme } = useTheme();

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits");
      setHabits(res.data);
    } catch {
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const initiateDelete = (id) => {
    setHabitToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!habitToDelete) return;

    const previousHabits = [...habits];

    setHabits(habits.filter((h) => h._id !== habitToDelete));
    setIsDeleteModalOpen(false);

    try {
      await api.delete(`/habits/${habitToDelete}`);
      toast.success("Habit removed");
    } catch {
      setHabits(previousHabits);
      toast.error("Failed to delete habit");
    }
  };

  const checkIn = async (id) => {
    try {
      const res = await api.put(`/habits/${id}/complete`);
      setHabits(habits.map((h) => (h._id === id ? res.data : h)));
      toast.success("Keep it up!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast("Already completed today!", { icon: "👏" });
      } else {
        toast.error("Check-in failed");
      }
    }
  };

  const isCompletedToday = (lastDate) => {
    if (!lastDate) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    const last = new Date(lastDate).setHours(0, 0, 0, 0);
    return today === last;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">
            Habit Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Consistency is key.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> New Habit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 dark:text-slate-400 py-10">
          Loading habits...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              No habits being tracked. Start one today!
            </div>
          )}

          {habits.map((habit) => {
            const doneToday = isCompletedToday(habit.lastCompletedDate);

            return (
              <div
                key={habit._id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg min-h-[200px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight break-words">
                      {habit.title}
                    </h3>
                    <button
                      onClick={() => initiateDelete(habit._id)}
                      className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-6 mb-8">
                    <div className="flex items-center text-orange-500 dark:text-orange-400">
                      <Flame
                        className={`w-6 h-6 mr-2 ${
                          habit.streak > 0 ? "fill-current" : ""
                        }`}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl leading-none">
                          {habit.streak}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Streak
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-6 h-6 mr-2" />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl leading-none">
                          Active
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Status
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => !doneToday && checkIn(habit._id)}
                  disabled={doneToday}
                  className={`w-full py-3 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                    doneToday
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default ring-1 ring-emerald-500/20"
                      : "bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {doneToday ? (
                    <>
                      <Check className="w-5 h-5 mr-2" /> Completed Today
                    </>
                  ) : (
                    "Mark Complete"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <HabitModal
          onClose={() => setIsModalOpen(false)}
          onHabitAdded={fetchHabits}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Stop Tracking?"
        message="Are you sure? This will remove your current streak history for this habit."
      />
    </div>
  );
};

export default HabitsPage;
