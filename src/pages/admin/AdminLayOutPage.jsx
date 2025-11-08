import React from "react";
import { Outlet } from "react-router-dom";
import SideBarMenu from "../../components/admin/AdminSideBarMenu";
import UserHeader from "../../components/user/UserHeader";

function AdminLayOutPage() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <UserHeader />
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row pt-16">
        <div className="sm:w-56 sm:shrink-0">
          <SideBarMenu />
        </div>

        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayOutPage;
