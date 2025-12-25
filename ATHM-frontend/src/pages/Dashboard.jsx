import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Copy, LogIn, GraduationCap, Users } from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const { data } = await api.get("/classrooms");
      setClassrooms(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load classrooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName) {
      toast.error("Please enter a class name");
      return;
    }

    try {
      // Send Name as Subject to satisfy backend requirement
      await api.post("/classrooms", {
        name: newClassName,
        subject: newClassName,
      });
      toast.success("Classroom created!");
      setShowCreateModal(false);
      setNewClassName("");
      fetchClassrooms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create class");
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      await api.post("/classrooms/join", { code: joinCode });
      toast.success("Joined successfully!");
      setShowJoinModal(false);
      setJoinCode("");
      fetchClassrooms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Code");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your academic journey.</p>
        </div>

        {user?.role === "teacher" ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
          >
            <Plus size={20} /> Create Class
          </button>
        ) : (
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm font-medium"
          >
            <LogIn size={20} /> Join Class
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          Loading your classes...
        </div>
      ) : classrooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            No Classes Yet
          </h3>
          <p className="text-slate-500 mt-1">
            {user?.role === "teacher"
              ? "Create your first classroom to get started."
              : "Join a classroom to see your assignments."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col overflow-hidden"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                    {classroom.name}
                  </h3>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Users size={12} />
                    {classroom.students?.length || 0}
                  </div>
                </div>

                {user?.role === "teacher" ? (
                  <div
                    className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex justify-between items-center group cursor-pointer"
                    onClick={() => copyCode(classroom.classCode)}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        Class Code
                      </p>
                      <p className="text-lg font-mono font-bold text-slate-700">
                        {classroom.classCode || "Generating..."}
                      </p>
                    </div>
                    <Copy
                      size={16}
                      className="text-slate-400 group-hover:text-blue-600 transition"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Instructor:{" "}
                    <span className="font-medium text-slate-700">
                      {classroom.teacher?.name}
                    </span>
                  </p>
                )}
              </div>

              <Link
                to={`/classrooms/${classroom._id}`}
                className="bg-slate-50 p-4 text-center text-blue-600 font-medium text-sm border-t border-slate-100 hover:bg-blue-50 transition"
              >
                Enter Classroom &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              New Classroom
            </h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Class Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Biology 101"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Join Classroom
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              Enter the 6-character code shared by your teacher.
            </p>
            <form onSubmit={handleJoinClass}>
              <input
                autoFocus
                type="text"
                maxLength={6}
                placeholder="X7K9P2"
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none mb-6 text-center text-2xl font-mono tracking-widest uppercase"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Join Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;