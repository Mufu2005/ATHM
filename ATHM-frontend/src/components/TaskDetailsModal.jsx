import { X, CheckCircle2, XCircle } from "lucide-react";

const TaskDetailsModal = ({ task, students = [], onClose }) => {
  if (!task) return null;

  const completedList = task.completedBy || [];

  const completedIds = new Set(
    completedList.map((s) => (s._id || s).toString())
  );

  const notCompletedCount = students.length - completedIds.size;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{task.title}</h2>
            <p className="text-sm text-slate-500">Completion Status</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 transition"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex border-b border-slate-100">
          <div className="flex-1 p-4 text-center border-r border-slate-100">
            <p className="text-2xl font-bold text-green-600">
              {completedIds.size}
            </p>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Turned In
            </p>
          </div>
          <div className="flex-1 p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">
              {notCompletedCount > 0 ? notCompletedCount : 0}
            </p>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Missing
            </p>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {students.length === 0 ? (
            <p className="text-center text-slate-500 py-4">
              No students in this class yet.
            </p>
          ) : (
            students.map((student) => {
              const isDone = completedIds.has(student._id.toString());
              return (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDone
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">
                        {student.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </div>
                  </div>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      <XCircle size={12} /> Pending
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;