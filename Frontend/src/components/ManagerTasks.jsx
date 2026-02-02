

// function ManagerTasks({ user }) {
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]);

//   const [formData, setFormData] = useState({
//     project: "",
//     description: "",
//     startTime: "",
//     endTime: "",
//   });

//   // 🔑 IDs
//   const employeeId = user?._id || user?.id;
//   const managerId = user?.reporting_to; // assuming employee has reporting_to

//   /* ================= FETCH TIMESHEETS ================= */

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/timesheet/employeeTimesheet/${employeeId}`
//       );

//       if (res.data.success) {
//         setTasks(res.data.data);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load tasks");
//     }
//   };

//   useEffect(() => {
//     if (employeeId) {
//       fetchTasks();
//     }
//   }, [employeeId]);

//   /* ================= FETCH PROJECTS ================= */

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/timesheet/projectsList"
//         );

//         if (res.data.success) {
//           setProjects(res.data.data);
//         }
//       } catch (error) {
//         toast.error("Failed to load projects");
//       }
//     };

//     fetchProjects();
//   }, []);

//   /* ================= HANDLERS ================= */

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { project, description, startTime, endTime } = formData;

//     if (!project || !description || !startTime || !endTime) {
//       toast.error("All fields are required");
//       return;
//     }

//     // Build proper DateTime
//     const today = new Date().toISOString().split("T")[0];

//     const start_time = new Date(`${today}T${startTime}`);
//     const end_time = new Date(`${today}T${endTime}`);

//     if (end_time <= start_time) {
//       toast.error("End time must be greater than start time");
//       return;
//     }

//     try {
//       const body = {
//         project_id: project,
//         manager_id: managerId,
//         employee_id: employeeId,
//         start_time,
//         end_time,
//         description,
//       };

//       const res = await axios.post(
//         "http://localhost:5000/api/timesheet/addTimesheet",
//         body
//       );

//       if (res.data.success) {
//         toast.success("Timesheet added successfully");

//         // 🔁 REFRESH TABLE
//         fetchTasks();

//         // Reset form
//         setFormData({
//           project: "",
//           description: "",
//           startTime: "",
//           endTime: "",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to add timesheet");
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* LEFT – TABLE */}
//       <div className="bg-white rounded-md shadow p-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">
//           Task List
//         </h2>

//         {tasks.length === 0 ? (
//           <p className="text-xs text-gray-500">No tasks added</p>
//         ) : (
//           <table className="w-full border text-xs">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-2 py-1">S.No</th>
//                 <th className="border px-2 py-1">Project</th>
//                 <th className="border px-2 py-1">Task</th>
//                 <th className="border px-2 py-1">Hrs</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((task, i) => (
//                 <tr key={task._id}>
//                   <td className="border px-2 py-1 text-center">
//                     {i + 1}
//                   </td>
//                   <td className="border px-2 py-1">
//                     {task.projectName}
//                   </td>
//                   <td className="border px-2 py-1">
//                     {task.description}
//                   </td>
//                   <td className="border px-2 py-1 text-center">
//                     {task.duration}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* RIGHT – FORM */}
//       <div className="bg-white rounded-md shadow p-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-3">
//           Add Task
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <select
//             name="project"
//             value={formData.project}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-1.5 text-sm 
//               focus:outline-none 
//               focus:border-orange-500 
//               focus:ring-2 
//               focus:ring-orange-400"
//           >
//             <option value="">Select Project</option>
//             {projects.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.project_name}
//               </option>
//             ))}
//           </select>

//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="2"
//             className="w-full border rounded px-3 py-1.5 text-sm"
//             placeholder="Task description"
//           />

//           <div className="text-left">
//             <label htmlFor="startTime">Start time</label>
//           </div>
//           <input
//             id="startTime"
//             type="time"
//             name="startTime"
//             value={formData.startTime}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-1.5 text-sm"
//           />

//           <div className="text-left">
//             <label htmlFor="endTime">End time</label>
//           </div>
//           <input
//             id="endTime"
//             type="time"
//             name="endTime"
//             value={formData.endTime}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-1.5 text-sm"
//           />

//           <button
//             type="submit"
//             className="w-full bg-orange-600 text-white py-1.5 rounded text-sm hover:bg-orange-700"
//           >
//             Add Task
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ManagerTasks;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import Loader from "./Loader.jsx";
import logo from "../assets/Logo_remove.png";
import { Clock, Calendar, TrendingUp, Plus, Filter } from "lucide-react";

function ManagerTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Month");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [summary, setSummary] = useState({ totalHours: 0, totalTasks: 0 });
  const [customDates, setCustomDates] = useState({ from: "", to: "" });

  const [formData, setFormData] = useState({
    project: "",
    description: "",
    timeWorked: "", // Changed from startTime/endTime to dropdown
  });
  const fetchFilteredTasks = async (filterType, fromDate = "", toDate = "") => {
    try {
      setLoading(true);

      let url = `http://localhost:5000/api/timesheet/filteredTimesheet?type=${timeFilter.toLowerCase()}&employeeId=${employeeId}`;

      if (filterType === "Custom") {
        url += `&from=${fromDate}&to=${toDate}`;
      }

      const res = await axios.get(url);

      if (res.data.success) {
        setTasks(res.data.data.tasks);
        setSummary(res.data.data.summary);
      }
    } catch (err) {
      toast.error("Failed to load filtered tasks");
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;
  const employeeId = user?.id || user?._id;

  // Time worked options (in hours)
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
      fetchFilteredTasks("Week");
    }
  }, [employeeId,timeFilter]);


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

  /* ================= CALCULATE STATISTICS ================= */

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

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { project, description, timeWorked } = formData;

    if (!project || !description || !timeWorked) {
      toast.error("All fields are required");
      return;
    }

    const selectedProject = projects.find((p) => p._id === project);
    if (!selectedProject) {
      toast.error("Invalid project selected");
      return;
    }

    const managerId = selectedProject.manager_id;

    // Calculate start and end time based on timeWorked
    const now = new Date();
    const start_time = new Date(now);
    const hours = parseFloat(timeWorked);
    const end_time = new Date(start_time.getTime() + hours * 60 * 60 * 1000);

    try {
      setLoading(true);

      const body = {
        project_id: project,
        manager_id: managerId,
        employee_id: employeeId,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        description,
      };

      const res = await axios.post(
        "http://localhost:5000/api/timesheet/addTimesheet",
        body
      );

      if (res.data.success) {
        toast.success("Task added successfully");
        fetchTasks();

        setFormData({
          project: "",
          description: "",
          timeWorked: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* NAVBAR */}
      

        {/* CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">Track your tasks and manage your time effectively</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today's Hours</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.todayHours}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.todayTasks} tasks</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalHours}</p>
                  <p className="text-xs text-gray-500 mt-1">This period</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalTasks}</p>
                  <p className="text-xs text-gray-500 mt-1">Completed</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT – TABLE (2/3 width) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Task History</h3>

                {/* Time Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <Filter className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">{timeFilter}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>


                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {["Today", "Week", "Month", "Custom"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setTimeFilter(option);
                            setShowFilterDropdown(false);

                            if (option !== "Custom") {
                              fetchFilteredTasks(option);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${timeFilter === option
                              ? "bg-orange-100 text-orange-600 font-medium"
                              : "text-gray-700"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>


                  )}
                </div>
              </div>
              {timeFilter === "Custom" && (
                <div className="flex gap-4 p-4 bg-orange-50 border-b border-orange-100">
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
                    className="bg-orange-500 text-white px-4 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-orange-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No tasks added yet</p>
                    <p className="text-sm text-gray-400">Start tracking your time by adding a task</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-orange-50 border-b border-orange-100">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Project Name
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Time Worked
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tasks.map((task, i) => (
                        <tr key={task._id || i} className="hover:bg-orange-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {i + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {task.projectName}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {task.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                              {task.duration} hrs
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-6 border-t border-orange-100 bg-orange-50">
                <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                <p className="text-sm text-gray-700">
                  Total Tasks: <span className="font-bold">{summary.totalTasks}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Total Hours: <span className="font-bold">{summary.totalHours} hrs</span>
                </p>
              </div>

            </div>

            {/* RIGHT – FORM (1/3 width) */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project *
                  </label>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  >
                    <option value="">Choose a project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.project_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all resize-none"
                    placeholder="What did you work on?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Worked *
                  </label>
                  <select
                    name="timeWorked"
                    value={formData.timeWorked}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  >
                    <option value="">Select duration</option>
                    {timeWorkedOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
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

export default ManagerTasks;
