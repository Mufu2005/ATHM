import { useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  LogOut,
  BookOpen,
} from "lucide-react";

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "User";
  const displayRole = user?.role || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  if (user?.role === "student") {
    menuItems.push(
      { path: "/tasks", label: "Tasks", icon: CheckSquare },
      { path: "/habits", label: "Habits", icon: Activity }
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 h-full hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="text-white" size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">
            ATHM.
          </span>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
              {displayInitial}
            </div>
            <div className="overflow-hidden">
              <p
                className="text-sm font-bold text-slate-800 truncate"
                title={displayName}
              >
                {displayName}
              </p>
              <p className="text-xs text-slate-500 capitalize">{displayRole}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-scroll bg-slate-50 relative">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;