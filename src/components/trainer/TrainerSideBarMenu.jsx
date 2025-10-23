import React, { useState } from "react";
import { Link } from "react-router-dom";

function TrainerSideMenuBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div>
            {/* Toggle Sidebar button (mobile) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden 
                   hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
                   dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" >
                    <path clipRule="evenodd" fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 
                        010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-10 left-0 z-40 w-64 h-screen transition-transform 
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`} aria-label="Sidebar" >
                <div className="h-full px-3 py-10 overflow-y-auto  dark:bg-gray-950">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to='/trainer' >
                                <p href="#" className="flex items-center p-2 rounded-lg  hover:bg-blue-600 dark:hover:bg-blue-700 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M15 21V9" /></svg>
                                    <span className="ms-3">Dashboard</span>
                                </p></Link>
                        </li>
                        <li>
                            <Link to='/trainer/users' >
                                <p className="flex items-center p-2 rounded-lg   dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <span className="ms-3">Trainer Profile</span>
                                </p></Link>
                        </li>

                        <li>
                            <Link to='/trainer/foodmaster' >
                                <p href="#" className="flex items-center p-2 rounded-lg   dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                    <span className="ms-3">Food Master</span>
                                </p></Link>
                        </li>
                        <li>
                            <Link to='/trainer/exercisemaster' >
                                <p href="#" className="flex items-center p-2 rounded-lg   dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                    <span className="ms-3">Exercise Master</span>
                                </p></Link>
                        </li>
                        <li>
                            <Link to='/trainer/dietplan' >
                                <p href="#" className="flex items-center p-2  rounded-lg   dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                    <span className="ms-3">Diet Plan</span>
                                </p></Link>
                        </li>
                        <li>
                            <Link to='/trainer/workoutplan' >
                                <p href="#" className="flex items-center p-2  rounded-lg   dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                    <span className="ms-3">WorkOut Plan</span>
                                </p></Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default TrainerSideMenuBar
