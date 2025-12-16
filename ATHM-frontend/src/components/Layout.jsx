import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="max-w-5xl mx-auto pt-20 pb-24 sm:pb-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
