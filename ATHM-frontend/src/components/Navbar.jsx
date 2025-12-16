import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { CheckSquare, Activity, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.includes(path)
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed w-full z-10 top-0 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-500">
                ATHM.
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/tasks"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "tasks"
                )}`}
              >
                <CheckSquare className="w-4 h-4 mr-2" /> Tasks
              </Link>
              <Link
                to="/habits"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                  "habits"
                )}`}
              >
                <Activity className="w-4 h-4 mr-2" /> Habits
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400 mr-4">
              Hi, {user?.username}
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 transition-colors duration-200">
        <Link
          to="/tasks"
          className={`flex flex-col items-center text-xs ${
            location.pathname.includes("tasks")
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <CheckSquare className="w-6 h-6 mb-1" />
          Tasks
        </Link>
        <Link
          to="/habits"
          className={`flex flex-col items-center text-xs ${
            location.pathname.includes("habits")
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Activity className="w-6 h-6 mb-1" />
          Habits
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
