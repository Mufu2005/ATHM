import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import TaskModal from "../components/TaskModal";
import SubjectModal from "../components/SubjectModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Flag,
  Briefcase,
  User,
  Book,
} from "lucide-react";

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [mainTab, setMainTab] = useState("personal");
  const [filter, setFilter] = useState("all");

  const [sortPriority, setSortPriority] = useState("desc");
  const [sortDate, setSortDate] = useState("asc");

  const [loading, setLoading] = useState(true);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, subjectsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/subjects"),
      ]);
      setTasks(tasksRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, taskData);
        setTasks(tasks.map((t) => (t._id === editingTask._id ? data : t)));
        toast.success("Task updated");
      } else {
        const { data } = await api.post("/tasks", taskData);
        setTasks([...tasks, data]);
        toast.success("Task created");
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const { data } = await api.patch(`/tasks/${task._id}/toggle`);
      setTasks(tasks.map((t) => (t._id === task._id ? data : t)));
      toast.success("Status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const deleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setTasks(tasks.filter((t) => t._id !== taskToDelete._id));
      toast.success("Task deleted");
      setTaskToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const isTaskCompleted = (task) => {
    if (task.type === "assignment") {
      return task.completedBy?.includes(user?._id);
    }
    return task.status === "Completed";
  };

  const isTaskMissing = (task) => {
    if (!task.dueDate) return false;
    const isCompleted = isTaskCompleted(task);
    if (isCompleted) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };

  const togglePrioritySort = () => {
    if (sortPriority === "desc") setSortPriority("asc");
    else if (sortPriority === "asc") setSortPriority(null);
    else setSortPriority("desc");
  };

  const toggleDateSort = () => {
    if (sortDate === "asc") setSortDate("desc");
    else if (sortDate === "desc") setSortDate(null);
    else setSortDate("asc");
  };

  const processedTasks = tasks
    .filter((task) => {
      if (mainTab === "personal") return task.type === "personal";
      if (mainTab === "assignments") return task.type === "assignment";
      return true;
    })
    .filter((task) => {
      const isCompleted = isTaskCompleted(task);
      const isMissing = isTaskMissing(task);

      if (filter === "completed") return isCompleted;
      if (filter === "pending") return !isCompleted && !isMissing;
      if (filter === "missing") return isMissing;
      return true;
    })
    .sort((a, b) => {
      if (sortPriority) {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const valA = priorityOrder[a.priority] || 0;
        const valB = priorityOrder[b.priority] || 0;

        if (valA !== valB) {
          return sortPriority === "desc" ? valB - valA : valA - valB;
        }
      }
      if (sortDate) {
        const dateA = a.dueDate
          ? new Date(a.dueDate).getTime()
          : sortDate === "asc"
          ? 9999999999999
          : 0;
        const dateB = b.dueDate
          ? new Date(b.dueDate).getTime()
          : sortDate === "asc"
          ? 9999999999999
          : 0;

        if (dateA !== dateB) {
          return sortDate === "asc" ? dateA - dateB : dateB - dateA;
        }
      }
      return 0;
    });

  const SortIcon = ({ direction }) => {
    if (!direction) return null;
    return direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks & Work</h1>
          <p className="text-slate-500 mt-1">
            Stay organized across personal life and school.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowSubjectModal(true)}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm font-medium"
          >
            Subjects
          </button>
          {mainTab === "personal" && (
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
            >
              <Plus size={20} /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-fit mb-8 mx-auto sm:mx-0">
        <button
          onClick={() => setMainTab("personal")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mainTab === "personal"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <User size={18} /> My Tasks
        </button>
        <button
          onClick={() => setMainTab("assignments")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mainTab === "assignments"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Briefcase size={18} /> Assignments
        </button>
      </div>

      {/* CONTROLS BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100/80 rounded-full">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "To-Do" },
            { id: "missing", label: "Overdue" },
            { id: "completed", label: "Done" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
            Sort By
          </span>

          <button
            onClick={togglePrioritySort}
            className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              sortPriority
                ? "bg-slate-800 border-slate-800 text-white shadow-md hover:bg-slate-900"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Flag
              size={14}
              className={
                sortPriority
                  ? "text-yellow-400 fill-current"
                  : "text-slate-400"
              }
            />
            <span>Priority</span>
            {sortPriority && <SortIcon direction={sortPriority} />}
          </button>

          <button
            onClick={toggleDateSort}
            className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              sortDate
                ? "bg-blue-600 border-blue-600 text-white shadow-md hover:bg-blue-700"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Calendar
              size={14}
              className={sortDate ? "text-blue-100" : "text-slate-400"}
            />
            <span>Due Date</span>
            {sortDate && <SortIcon direction={sortDate} />}
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading tasks...
        </div>
      ) : processedTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-medium">
            {filter === "missing"
              ? "No overdue tasks!"
              : "No tasks found in this section."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {processedTasks.map((task) => {
            const isCompleted = isTaskCompleted(task);
            const isMissing = isTaskMissing(task);

            return (
              <div
                key={task._id}
                className={`group flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all 
                                    ${
                                      isMissing
                                        ? "border-red-200 bg-red-50/30"
                                        : "border-slate-200"
                                    }
                                    ${isCompleted ? "opacity-60" : ""}
                                `}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex-shrink-0 transition-colors ${
                      isCompleted
                        ? "text-green-500"
                        : isMissing
                        ? "text-red-400 hover:text-red-600"
                        : "text-slate-300 hover:text-blue-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} className="fill-current" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  <div>
                    <h3
                      className={`font-medium text-lg text-slate-800 ${
                        isCompleted ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      {isMissing && (
                        <span className="flex items-center gap-1 text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded text-xs">
                          <AlertCircle size={12} /> Overdue
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold
                                             ${
                                               task.priority === "High"
                                                 ? "bg-red-100 text-red-700"
                                                 : task.priority === "Medium"
                                                 ? "bg-orange-100 text-orange-700"
                                                 : "bg-green-100 text-green-700"
                                             }`}
                      >
                        {task.priority}
                      </span>

                      {task.type === "assignment" && task.classroom ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
                          <Book size={12} />
                          {task.classroom.name}
                        </span>
                      ) : task.type === "assignment" ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                          Assignment
                        </span>
                      ) : null}

                      {task.subject && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: `${task.subject.color}20`,
                            color: task.subject.color,
                          }}
                        >
                          {task.subject.name}
                        </span>
                      )}

                      {task.dueDate && (
                        <span
                          className={`flex items-center gap-1 ${
                            isMissing ? "text-red-500 font-medium" : ""
                          }`}
                        >
                          <Calendar size={14} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {task.type === "personal" && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setShowTaskModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={handleTaskSubmit}
          initialData={editingTask}
          subjects={subjects}
        />
      )}

      {showSubjectModal && (
        <SubjectModal
          isOpen={showSubjectModal}
          onClose={() => setShowSubjectModal(false)}
          subjects={subjects}
          setSubjects={setSubjects}
        />
      )}

      {taskToDelete && (
        <DeleteConfirmModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={deleteTask}
          title="Delete Task"
          message={`Are you sure you want to delete "${taskToDelete.title}"?`}
        />
      )}
    </div>
  );
};

export default TasksPage;