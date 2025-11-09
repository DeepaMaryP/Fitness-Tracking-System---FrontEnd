import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function UserSideMenuBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const auth = useSelector((state) => state.auth)

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
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 sm:hidden z-30"
                />
            )}

            <aside className={`z-40 h-screen transition-transform bg-white border-r border-gray-200
                    ${isSidebarOpen ? "fixed top-0 left-0 w-40 translate-x-0" : "fixed top-0 left-0 w-40 -translate-x-full"} 
                    sm:static sm:translate-x-0 sm:w-48`} aria-label="Sidebar"  >

                <div className="h-full py-10 pt-20 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to='/user' >
                                <p href="#" className="flex items-center p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                    <span className="ms-2">My Trackers</span>
                                </p></Link>
                        </li>
                        <li>
                            <Link to={`/user/profile/${auth.userId}`} >
                                <p className="flex items-center p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <circle cx="12" cy="7" r="4" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /> </svg>                                  
                                    <span className="ms-3">My Profile</span>
                                </p></Link>
                        </li>
                        <li>
                            <Link to={`/user/target`} >
                                <p className="flex items-center p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 group"     >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <circle cx="12" cy="12" r="10" strokeWidth="2" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2" /> </svg>
                                    <span className="ms-3">Fitness Goal</span>
                                </p></Link>
                        </li>
                        {auth.isSubscribed &&
                            <li>
                                <Link to={`/user/foodhistory`} >
                                    <p className="flex items-center p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 group"     >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /> </svg>
                                        <span className="ms-3">Food History</span>
                                    </p></Link>
                            </li>}
                        {auth.isSubscribed &&
                            <li>
                                <Link to={`/user/bodymeasurements`} >
                                    <p className="flex items-center p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 group"     >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1M4.2 4.2l.7.7M19.1 19.1l.7.7M1 12h1m20 0h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7" /> </svg>
                                        <span className="ms-3">Body Measurements</span>
                                    </p></Link>
                            </li>}
                        {auth.isSubscribed &&
                            <li>
                                <Link to={`/user/workout`} >
                                    <p className="flex items-center p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-200 group"     >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M12 9v6M4 6h16M4 18h16" /> </svg>
                                        <span className="ms-3">WorkOuts</span>
                                    </p></Link>
                            </li>}

                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default UserSideMenuBar;
