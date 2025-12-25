import { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";

const SubjectModal = ({ isOpen, onClose, subjects, setSubjects }) => {
  const [newSubject, setNewSubject] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  if (!isOpen) return null;

  const colors = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#10B981",
    "#06B6D4",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#64748B",
  ];

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    try {
      const { data } = await api.post("/subjects", {
        name: newSubject,
        color: selectedColor,
      });
      setSubjects([...subjects, data]);
      setNewSubject("");
      toast.success("Subject added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add subject");
    }
  };

  const initiateDelete = (subject) => {
    setSubjectToDelete(subject);
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;

    try {
      await api.delete(`/subjects/${subjectToDelete._id}`);
      setSubjects(subjects.filter((s) => s._id !== subjectToDelete._id));
      toast.success("Subject deleted");
      setSubjectToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subject");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">
              Manage Subjects
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {/* Add Form */}
            <form onSubmit={handleAddSubject} className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Add New Subject
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Math, Science, etc."
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!newSubject.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* Color Picker */}
              <div className="flex gap-2 justify-between">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </form>

            {/* List */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Existing Subjects
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {subjects.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-2">
                    No subjects yet.
                  </p>
                ) : (
                  subjects.map((subject) => (
                    <div
                      key={subject._id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium text-slate-700">
                          {subject.name}
                        </span>
                      </div>
                      <button
                        onClick={() => initiateDelete(subject)}
                        className="text-slate-300 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={confirmDeleteSubject}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? Tasks associated with this subject will lose their tag.`}
        confirmText="Delete"
      />
    </>
  );
};

export default SubjectModal;