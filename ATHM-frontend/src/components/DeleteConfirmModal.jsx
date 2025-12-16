import { X, AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-slate-100 dark:border-slate-700">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            {title || "Delete Item?"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {message ||
              "Are you sure you want to delete this? This action cannot be undone."}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
