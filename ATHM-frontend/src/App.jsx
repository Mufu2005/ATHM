import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import HabitsPage from "./pages/HabitsPage";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#334155",
              color: "#fff",
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="habits" element={<HabitsPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
