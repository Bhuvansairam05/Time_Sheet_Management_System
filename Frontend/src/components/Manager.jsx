import { useState } from "react";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import logo from "../assets/Gradious_ai_logo.png";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx";
import toast from "react-hot-toast";
import ManagerDashboard from "./ManagerDashboard.jsx";
import MyTasks from "./MyTasks.jsx";
import { useLocation } from "react-router-dom";

function Manager() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-[1700px] 2xl:max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Gradious Logo"
                  className="h-7 w-auto object-contain"
                />
                <h1 className="text-2xl font-bold text-blue-600">
                  Gradious TimeSheet
                </h1>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                  Manager
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === "dashboard"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === "tasks"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  My Tasks
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
          <div className="md:hidden border-t border-gray-200">
            <div className="flex justify-around py-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === "dashboard"
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === "tasks"
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                My Tasks
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-[1700px] 2xl:max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "dashboard" && <ManagerDashboard user={user}/>}
          {activeTab === "tasks" && <MyTasks user={user}/>}
        </main>
        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      </div>
    </>
  );
}
export default Manager;