import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function TrainerSideMenuBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/trainer", label: "Dashboard" },
    { path: "/trainer/profile", label: "Trainer Profile" },
    { path: "/trainer/foodmaster", label: "Food Master" },
    { path: "/trainer/exercisemaster", label: "Exercise Master" },
    { path: "/trainer/dietplan", label: "Diet Plan" },
    { path: "/trainer/workoutplan", label: "Workout Plan" },
  ];

  return (
    <>
      {/* 🔘 Toggle Button (Mobile only) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        type="button"
        className="fixed top-3 left-3 z-[60] inline-flex items-center p-2 text-sm text-gray-700 rounded-lg 
        bg-white shadow lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 
              0 010 1.5H2.75A.75.75 0 
              012 4.75zm0 10.5a.75.75 0 
              01.75-.75h7.5a.75.75 0 
              010 1.5h-7.5a.75.75 0 
              01-.75-.75zM2 10a.75.75 0 
              01.75-.75h14.5a.75.75 
              0 010 1.5H2.75A.75.75 0 
              012 10z"
          />
        </svg>
      </button>

      {/* 🌙 Overlay (dark background when sidebar open) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* 🧭 Sidebar */}
      <aside
        className={`fixed left-0 z-50 w-56 h-[calc(100vh-64px)] top-[64px] bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block`}
      >
        <div className="h-full px-3 py-6 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block p-2 rounded-lg ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default TrainerSideMenuBar;
