import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function TrainerSideMenuBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: "/trainer", label: "Dashboard", icon: "M3 9h18M15 21V9M3 3h18v18H3z" },
        { path: "/trainer/profile", label: "Trainer Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8z" },
        { path: "/trainer/foodmaster", label: "Food Master", icon: "M20 14.66V20a2 2 0 0 1-2 2H4V6a2 2 0 0 1 2-2h5.34M18 2l4 4-10 10H8v-4z" },
        { path: "/trainer/exercisemaster", label: "Exercise Master", icon: "M20 14.66V20a2 2 0 0 1-2 2H4V6a2 2 0 0 1 2-2h5.34M18 2l4 4-10 10H8v-4z" },
        { path: "/trainer/dietplan", label: "Diet Plan", icon: "M20 14.66V20a2 2 0 0 1-2 2H4V6a2 2 0 0 1 2-2h5.34M18 2l4 4-10 10H8v-4z" },
        { path: "/trainer/workoutplan", label: "Workout Plan", icon: "M20 14.66V20a2 2 0 0 1-2 2H4V6a2 2 0 0 1 2-2h5.34M18 2l4 4-10 10H8v-4z" },
    ];

    return (
        <div>
            {/* 🔘 Toggle Sidebar Button (visible only on small screens) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-700 rounded-lg sm:hidden 
          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 
            10.5a.75.75 0 01.75-.75h7.5a.75.75 0 
            010 1.5h-7.5a.75.75 0 01-.75-.75zM2 
            10a.75.75 0 01.75-.75h14.5a.75.75 
            0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
            </button>

            {/* Overlay (visible only on mobile when sidebar open) */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 sm:hidden z-30"
                />
            )}

            {/* 🧭 Sidebar Menu */}
            <aside
                className={`fixed top-[60px] left-0 z-40 w-56 h-[calc(100vh-60px)] bg-white border-r border-gray-200 shadow-md transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 sm:static sm:block`}
            >
                <div className="h-full px-3 py-6 overflow-y-auto">
                    <ul className="space-y-1 font-medium">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-2 rounded-lg transition-colors duration-200 
                      ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`
                                        }
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d={item.icon} />
                                        </svg>
                                        <span className="ms-3 text-sm">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default TrainerSideMenuBar;
