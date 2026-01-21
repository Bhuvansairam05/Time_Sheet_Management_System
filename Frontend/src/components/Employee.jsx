import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import Loader from "./Loader.jsx";
import logo from "../assets/Logo_remove.png";

function Employee() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    project: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;
  const employeeId = user?.id || user?._id;

  /* ================= LOGOUT ================= */

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

  /* ================= FETCH TIMESHEETS ================= */

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/timesheet/employeeTimesheet/${employeeId}`
      );

      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  /* ================= FETCH PROJECTS ================= */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/timesheet/projectsList"
        );

        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { project, description, startTime, endTime } = formData;

    if (!project || !description || !startTime || !endTime) {
      toast.error("All fields are required");
      return;
    }

    const selectedProject = projects.find((p) => p._id === project);
    if (!selectedProject) {
      toast.error("Invalid project selected");
      return;
    }

    const managerId = selectedProject.manager_id;

    const today = new Date().toISOString().split("T")[0];
    const start_time = `${today}T${startTime}:00`;
    const end_time = `${today}T${endTime}:00`;

    if (new Date(end_time) <= new Date(start_time)) {
      toast.error("End time must be greater than start time");
      return;
    }

    try {
      setLoading(true);

      const body = {
        project_id: project,
        manager_id: managerId,
        employee_id: employeeId,
        start_time,
        end_time,
        description,
      };

      const res = await axios.post(
        "http://localhost:5000/api/timesheet/addTimesheet",
        body
      );

      if (res.data.success) {
        toast.success("Timesheet added successfully");
        fetchTasks();

        setFormData({
          project: "",
          description: "",
          startTime: "",
          endTime: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add timesheet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gray-50">
        {/* NAVBAR */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="TimeTrack Pro Logo"
                  className="h-7 w-auto object-contain"
                />
                <h1 className="text-2xl font-bold text-orange-600">
                  TimeTrack Pro
                </h1>
                <span className="ml-2 px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                  Employee
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {user?.name}, here is your work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT – TABLE */}
            <div className="bg-white rounded-md shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Task List
              </h3>

              {tasks.length === 0 ? (
                <p className="text-xs text-gray-500">No tasks added</p>
              ) : (
                <table className="w-full border text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">S.No</th>
                      <th className="border px-2 py-1">Project</th>
                      <th className="border px-2 py-1">Task</th>
                      <th className="border px-2 py-1">Hrs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, i) => (
                      <tr key={task._id || i}>
                        <td className="border px-2 py-1 text-center">
                          {i + 1}
                        </td>
                        <td className="border px-2 py-1">
                          {task.projectName}
                        </td>
                        <td className="border px-2 py-1">
                          {task.description}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {task.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* RIGHT – FORM */}
            <div className="bg-white rounded-md shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Add Task
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.project_name}
                    </option>
                  ))}
                </select>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border rounded px-3 py-1.5 text-sm"
                  placeholder="Task description"
                />

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-1.5 text-sm"
                />

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-1.5 text-sm"
                />

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-1.5 rounded text-sm hover:bg-orange-700"
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* LOGOUT MODAL */}
        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      </div>
    </>
  );
}

export default Employee;
