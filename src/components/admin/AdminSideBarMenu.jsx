import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminSideBarMenu() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="relative z-40">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-700 rounded-lg sm:hidden 
                   hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 z-50 relative"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 
            010 1.5H2.75A.75.75 0 012 4.75zm0 
            10.5a.75.75 0 01.75-.75h7.5a.75.75 
            0 010 1.5h-7.5a.75.75 0 
            01-.75-.75zM2 10a.75.75 0 
            01.75-.75h14.5a.75.75 0 
            010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Overlay (visible only on mobile when sidebar open) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 sm:hidden ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 w-56 h-screen bg-white shadow-lg transform transition-transform duration-300 
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static sm:block z-50`}
      >
        <div className="h-full px-3 py-10 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/admin" onClick={handleCloseSidebar}>
                <p className="flex items-center p-2 rounded-lg hover:bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M15 21V9" />
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </p>
              </Link>
            </li>

            <li>
              <Link to="/admin/users" onClick={handleCloseSidebar}>
                <p className="flex items-center p-2 rounded-lg hover:bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="ms-3">Users</span>
                </p>
              </Link>
            </li>

            <li>
              <Link to="/admin/trainers" onClick={handleCloseSidebar}>
                <p className="flex items-center p-2 rounded-lg hover:bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="ms-3">Trainers</span>
                </p>
              </Link>
            </li>

            <li>
              <Link to="/admin/assignments" onClick={handleCloseSidebar}>
                <p className="flex items-center p-2 rounded-lg hover:bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 
                    1-2-2V6a2 2 0 0 1 2-2h5.34" />
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                  </svg>
                  <span className="ms-3">Assign Trainers</span>
                </p>
              </Link>
            </li>

            {/* Reports Dropdown */}
            <li>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center w-full p-2 text-base transition duration-75 rounded-lg hover:bg-blue-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 
                  2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 
                  1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <span className="flex-1 ms-3 text-left whitespace-nowrap">Reports</span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="py-2 space-y-2">
                  <li>
                    <Link to="/admin/usergoalstat" onClick={handleCloseSidebar}>
                      <span className="flex items-center w-full p-2 pl-11 rounded-lg hover:bg-blue-100">
                        Goal Achievement Rates
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/revenuestat" onClick={handleCloseSidebar}>
                      <span className="flex items-center w-full p-2 pl-11 rounded-lg hover:bg-blue-100">
                        Revenue Growth
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default AdminSideBarMenu;
