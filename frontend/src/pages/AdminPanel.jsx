import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex flex-1 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
        {/* Sidebar */}
        <aside
          className="bg-white/90 backdrop-blur-md border-r border-indigo-100 
                         w-full max-w-60 shadow-sm"
        >
          {/* Profile Section */}
          <div className="flex flex-col items-center border-b border-indigo-100 py-6 gap-2">
            <div className="text-6xl text-indigo-500 cursor-pointer relative flex justify-center pt-5">
              {user?.profilePic ? (
                <img
                  src={user?.profilePic}
                  className="w-20 h-20 rounded-full shadow-md border border-indigo-200"
                  alt={user?.name}
                />
              ) : (
                <FaRegCircleUser />
              )}
            </div>
            <p className="capitalize text-lg font-semibold text-indigo-800">
              {user?.name}
            </p>
            <p className="text-sm text-slate-500">{user?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="grid p-3 gap-1">
            <Link
              to={"all-users"}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              All Users
            </Link>
            <Link
              to={"all-products"}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              All Products
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-full flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
