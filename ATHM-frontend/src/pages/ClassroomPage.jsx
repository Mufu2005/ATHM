import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import TaskDetailsModal from "../components/TaskDetailsModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Flag,
  BookOpen,
  Users,
  ClipboardList,
  Eye,
  UserMinus,
  Trash2,
  LogOut,
} from "lucide-react";

const ClassroomPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("assignments");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  const [studentToRemove, setStudentToRemove] = useState(null);
  const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await api.get(`/classrooms/${id}`);
        setClassroom(classRes.data);

        try {
          const tasksRes = await api.get(`/tasks/classroom/${id}`);
          setTasks(tasksRes.data);
        } catch (taskError) {
          console.error("Error loading tasks:", taskError);
          setTasks([]);
        }
      } catch (error) {
        console.error("CRITICAL ERROR loading classroom:", error);
        toast.error("Failed to load classroom details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/tasks", {
        ...formData,
        classroomId: id,
        type: "assignment",
      });
      setTasks([data, ...tasks]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
      });
      toast.success("Assignment posted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post assignment");
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
    try {
      await api.delete(`/classrooms/${id}/students/${studentToRemove._id}`);
      setClassroom((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s._id !== studentToRemove._id),
      }));
      toast.success("Student removed");
      setStudentToRemove(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove student");
    }
  };

  const handleDeleteClassroom = async () => {
    try {
      await api.delete(`/classrooms/${id}`);
      toast.success("Classroom deleted");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete classroom");
    }
  };

  const handleLeaveClassroom = async () => {
    try {
      await api.post(`/classrooms/${id}/leave`);
      toast.success("You left the classroom");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to leave classroom");
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading Classroom...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition font-medium text-sm"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6 relative">
        <div className="absolute top-6 right-6 flex gap-2">
          {user?.role === "teacher" && (
            <button
              onClick={() => setShowDeleteClassModal(true)}
              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="Delete Classroom"
            >
              <Trash2 size={20} />
            </button>
          )}

          {user?.role === "student" && (
            <button
              onClick={() => setShowLeaveModal(true)}
              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="Leave Classroom"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-blue-200 shadow-lg">
            <BookOpen size={28} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 pr-8">
              {classroom?.name || "Classroom"}
            </h1>
            <p className="text-slate-500">
              Instructor:{" "}
              <span className="font-semibold text-slate-700">
                {classroom?.teacher?.name || "Unknown"}
              </span>
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Class Code:
              </span>
              <span className="font-mono font-bold text-blue-600 text-lg tracking-widest select-all">
                {classroom?.classCode || "Generating..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "assignments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ClipboardList size={18} /> Assignments
        </button>
        <button
          onClick={() => setActiveTab("people")}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "people"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users size={18} /> People ({classroom?.students?.length || 0})
        </button>
      </div>

      {activeTab === "people" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
            Enrolled Students
          </div>
          {!classroom.students || classroom.students.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No students have joined yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classroom.students.map((student) => (
                <div
                  key={student._id}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {student.name || "Unknown Student"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {student.email || "No Email"}
                      </p>
                    </div>
                  </div>

                  {user?.role === "teacher" && (
                    <button
                      onClick={() => setStudentToRemove(student)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title="Remove student"
                    >
                      <UserMinus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "assignments" && (
        <>
          {user?.role === "teacher" && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
              >
                <Plus size={20} /> New Assignment
              </button>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <p className="text-slate-500 font-medium">
                No assignments posted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-800">
                        {task.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                                                            ${
                                                              task.priority ===
                                                              "High"
                                                                ? "bg-red-50 text-red-600"
                                                                : task.priority ===
                                                                  "Medium"
                                                                ? "bg-orange-50 text-orange-600"
                                                                : "bg-green-50 text-green-600"
                                                            }`}
                      >
                        <Flag size={12} fill="currentColor" /> {task.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4">
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Calendar
                            size={14}
                            className="mr-2 text-slate-400"
                          />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}

                      {user?.role === "teacher" && (
                        <div className="text-sm font-medium text-slate-500">
                          {task.completedBy?.length || 0} /{" "}
                          {classroom?.students?.length || 0} Turned In
                        </div>
                      )}
                    </div>
                  </div>

                  {user?.role === "teacher" && (
                    <div className="flex items-center">
                      <button
                        onClick={() => setViewTask(task)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
                      >
                        <Eye size={16} /> View Progress
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Post Assignment
            </h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Chapter 4 Reflection"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Instructions
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewTask && (
        <TaskDetailsModal
          task={viewTask}
          students={classroom?.students || []}
          onClose={() => setViewTask(null)}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        onConfirm={handleRemoveStudent}
        title="Remove Student"
        message={`Are you sure you want to remove ${studentToRemove?.name} from this class? They will no longer see assignments.`}
        confirmText="Remove"
      />

      <DeleteConfirmModal
        isOpen={showDeleteClassModal}
        onClose={() => setShowDeleteClassModal(false)}
        onConfirm={handleDeleteClassroom}
        title="Delete Classroom"
        message="Are you sure you want to delete this entire classroom? All assignments and student progress will be permanently lost."
        confirmText="Delete Class"
      />

      <DeleteConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveClassroom}
        title="Leave Classroom"
        message="Are you sure you want to leave this class? You will no longer see assignments on your dashboard."
        confirmText="Leave Class"
      />
    </div>
  );
};

export default ClassroomPage;