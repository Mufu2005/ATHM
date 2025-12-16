import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const TaskModal = ({ onClose, onTaskAdded, subjects, taskToEdit = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        subject: taskToEdit.subject?._id || taskToEdit.subject || "",
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : "",
        priority: taskToEdit.priority,
      });
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit._id}`, formData);
        toast.success("Task updated successfully");
      } else {
        await api.post("/tasks", formData);
        toast.success("Task added successfully");
      }
      onTaskAdded();
      onClose();
    } catch {
      toast.error(taskToEdit ? "Failed to update task" : "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none";
  const labelClass =
    "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden transition-colors scale-100">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {taskToEdit ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              autoFocus
              required
              type="text"
              className={inputClass}
              placeholder="e.g., Complete Chapter 5"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Subject</label>
              <select
                className={inputClass}
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option value="">No Subject</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Priority</label>
              <select
                className={inputClass}
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              className={`${inputClass} dark:[color-scheme:dark]`}
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center shadow-sm disabled:opacity-70 mt-2"
          >
            {loading
              ? "Saving..."
              : taskToEdit
              ? "Save Changes"
              : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
