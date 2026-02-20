import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import Loader from "./Loader.jsx";
import logo from "../assets/Logo_remove.png";
import { Clock, Calendar, TrendingUp, Plus, Filter } from "lucide-react";

function MyTasks() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Month");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [summary, setSummary] = useState({ totalHours: 0, totalTasks: 0 });
  const [customDates, setCustomDates] = useState({ from: "", to: "" });

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;
  const employeeId = user?.id || user?._id;

  /* ================= MULTI ENTRY ================= */

  const emptyTask = {
    project: "",
    description: "",
    timeWorked: "",
    date: new Date().toISOString().split("T")[0]
  };

  const [taskRows, setTaskRows] = useState([emptyTask]);

  const addRow = () => setTaskRows([...taskRows, emptyTask]);
  const closeModal = () => {
    setShowModal(false);
    setTaskRows([emptyTask]);
  };
  const removeRow = (index) => {
    if (taskRows.length === 1) {
      toast.error("At least one task required");
      return;
    }

    const updated = taskRows.filter((_, i) => i !== index);
    setTaskRows(updated);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...taskRows];
    updated[index][field] = value;
    setTaskRows(updated);
  };

  /* ================= SUBMIT ================= */

  const handleSubmitAll = async () => {
    try {
      setLoading(true);

      const payload = [];

      for (const row of taskRows) {
        if (!row.project || !row.timeWorked) {
          toast.error("Fill all required fields");
          return;
        }

        const selectedProject = projects.find(p => p._id === row.project);

        const start = new Date(row.date);
        const hours = parseFloat(row.timeWorked);
        const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

        payload.push({
          project_id: row.project,
          manager_id: selectedProject.manager_id,
          employee_id: employeeId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          description: row.description,
          date: row.date
        });
      }
      console.log(payload);
      const res = await axios.post(
        "https://repressedly-hyperopic-rosario.ngrok-free.dev/api/timesheet/addTimesheet",
        { tasks: payload }
      );

      if (res.data.success) {
        toast.success("Timesheets added");
        closeModal();
        fetchFilteredTasks(timeFilter);
      }

    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const fetchFilteredTasks = async (filterType, fromDate = "", toDate = "") => {
    try {
      setLoading(true);

      let url = `https://repressedly-hyperopic-rosario.ngrok-free.dev/api/timesheet/filteredTimesheet?type=${filterType.toLowerCase()}&employeeId=${employeeId}`;

      if (filterType === "Custom") {
        url += `&from=${fromDate}&to=${toDate}`;
      }

      const res = await axios.get(url);

      if (res.data.success) {
        setTasks(res.data.data.tasks);
        setSummary(res.data.data.summary);
      }
    } catch {
      toast.error("Failed to load filtered tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchFilteredTasks(timeFilter);
  }, [employeeId, timeFilter]);

  /* ================= FETCH PROJECTS ================= */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "https://repressedly-hyperopic-rosario.ngrok-free.dev/api/timesheet/projectsList"
        );

        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch {
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  /* ================= STATS ================= */

  const calculateStats = () => {
    const totalHours = tasks.reduce((sum, task) => {
      const hours = parseFloat(task.duration) || 0;
      return sum + hours;
    }, 0);

    const todayTasks = tasks.filter((task) => {
      const taskDate = new Date(task.start_time);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    });

    const todayHours = todayTasks.reduce((sum, task) => {
      const hours = parseFloat(task.duration) || 0;
      return sum + hours;
    }, 0);

    return {
      totalHours: totalHours.toFixed(2),
      todayHours: todayHours.toFixed(2),
      totalTasks: tasks.length,
      todayTasks: todayTasks.length,
    };
  };

  const stats = calculateStats();

  /* ================= LOGOUT ================= */

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    setShowLogoutModal(false);
    navigate("/");
  };

  /* ================= TIME OPTIONS ================= */

  const timeWorkedOptions = [
    { value: "0.5", label: "30 mins" },
    { value: "1", label: "1 hour" },
    { value: "1.5", label: "1.5 hours" },
    { value: "2", label: "2 hours" },
    { value: "2.5", label: "2.5 hours" },
    { value: "3", label: "3 hours" },
    { value: "3.5", label: "3.5 hours" },
    { value: "4", label: "4 hours" },
    { value: "4.5", label: "4.5 hours" },
    { value: "5", label: "5 hours" },
    { value: "5.5", label: "5.5 hours" },
    { value: "6", label: "6 hours" },
    { value: "6.5", label: "6.5 hours" },
    { value: "7", label: "7 hours" },
    { value: "7.5", label: "7.5 hours" },
    { value: "8", label: "8 hours" },
  ];

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* NAVBAR */}


        {/* CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">
              Track your tasks and manage your time effectively
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Today's Hours" value={stats.todayHours} icon={<Clock />} timeFilter={timeFilter} />
            <StatCard title="Total Hours" value={stats.totalHours} icon={<Calendar />} timeFilter={timeFilter} />
            <StatCard title="Total Tasks" value={stats.totalTasks} icon={<TrendingUp />} timeFilter={timeFilter} />
          </div>

          {/* TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">

              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Task History</h3>

                <div className="flex items-center gap-3">

                  {/* Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Filter className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{timeFilter}</span>
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {["Today", "Week", "Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setTimeFilter(option);
                              setShowFilterDropdown(false);
                              if (option !== "Custom") fetchFilteredTasks(option);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${timeFilter === option
                              ? "bg-blue-100 text-blue-600 font-medium"
                              : "text-gray-700"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Log */}
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg"
                  >
                    Log Hours
                  </button>

                </div>
              </div>
              {timeFilter === "Custom" && (
                <div className="flex gap-4 p-4 bg-blue-50 border-b border-blue-100">
                  <input
                    type="date"
                    value={customDates.from}
                    onChange={(e) =>
                      setCustomDates({ ...customDates, from: e.target.value })
                    }
                    className="border px-3 py-2 rounded-lg"
                  />
                  <input
                    type="date"
                    value={customDates.to}
                    onChange={(e) =>
                      setCustomDates({ ...customDates, to: e.target.value })
                    }
                    className="border px-3 py-2 rounded-lg"
                  />
                  <button
                    onClick={() =>
                      fetchFilteredTasks("Custom", customDates.from, customDates.to)
                    }
                    className="bg-blue-500 text-white px-4 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* TABLE BODY EXACT SAME */}
              <div className="overflow-x-auto">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No tasks added yet</p>
                    <p className="text-sm text-gray-400">
                      Start tracking your time by adding a task
                    </p>
                  </div>
                ) : (
                  <table className="w-full table-fixed">
                    <thead className="bg-blue-50 border-b border-blue-100">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">S.No</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Project Name</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Time Worked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tasks.map((task, i) => (
                        <tr key={task._id || i} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 text-center">{i + 1}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900 text-center">{task.projectName}</p>
                            <p className="text-xs text-gray-500 mt-1 text-center">{task.description}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                              {task.duration} hrs
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* <div className="p-6 border-t border-blue-100 bg-blue-50 text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                <p className="text-sm text-gray-700">
                  Total Tasks: <span className="font-bold">{summary.totalTasks}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Total Hours: <span className="font-bold">{summary.totalHours} hrs</span>
                </p>
              </div> */}

              <div className="border-t border-blue-100 bg-blue-50">
  <div className="grid grid-cols-3 items-center">

    {/* Empty column for S.No */}
    <div className="px-6 py-4"></div>

    {/* Align under Project Name */}
    <div className="px-6 py-4 text-center font-semibold text-gray-800">
      Total Tasks: {summary.totalTasks}
    </div>

    {/* Align under Time Worked */}
    <div className="px-6 py-4 text-center font-semibold text-blue-700">
      {summary.totalHours} hrs
    </div>

  </div>
</div>

            </div>
          </div>
        </main>

        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      </div>

      {/* MODAL SAME */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-auto rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">Log Hours</h2>

            {taskRows.map((row, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 mb-4">
                <select value={row.project} onChange={(e) => handleRowChange(index, "project", e.target.value)} className="border p-2 rounded">
                  <option value="">Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.project_name}</option>
                  ))}
                </select>

                <input placeholder="Description" value={row.description} onChange={(e) => handleRowChange(index, "description", e.target.value)} className="border p-2 rounded" />

                <select value={row.timeWorked} onChange={(e) => handleRowChange(index, "timeWorked", e.target.value)} className="border p-2 rounded">
                  <option value="">Hours</option>
                  {timeWorkedOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <input type="date" value={row.date} onChange={(e) => handleRowChange(index, "date", e.target.value)} className="border p-2 rounded" />
                <button
                  onClick={() => removeRow(index)}
                  className="bg-red-100 text-red-600 rounded px-3"
                >
                  ✕
                </button>

              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button onClick={addRow} className="bg-blue-200 px-4 py-2 rounded">Add More</button>
              <div className="flex gap-3">
                <button onClick={closeModal} className="border px-4 py-2 rounded">Cancel</button>
                <button onClick={handleSubmitAll} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

const StatCard = ({ title, value, icon, timeFilter }) => (
  <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
    <p className="text-left text-sm text-gray-600 mb-1">{(title !== "Today's Hours") ? "This " + timeFilter : ""}</p>
  </div>
);

export default MyTasks;


