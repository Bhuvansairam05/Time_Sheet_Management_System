import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function ManagerTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    project: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  // 🔑 IDs
  const employeeId = user?._id || user?.id;
  const managerId = user?.reporting_to; // assuming employee has reporting_to

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

    // Build proper DateTime
    const today = new Date().toISOString().split("T")[0];

    const start_time = new Date(`${today}T${startTime}`);
    const end_time = new Date(`${today}T${endTime}`);

    if (end_time <= start_time) {
      toast.error("End time must be greater than start time");
      return;
    }

    try {
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

        // 🔁 REFRESH TABLE
        fetchTasks();

        // Reset form
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
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* LEFT – TABLE */}
      <div className="bg-white rounded-md shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Task List
        </h2>

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
                <tr key={task._id}>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Add Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1.5 text-sm 
              focus:outline-none 
              focus:border-orange-500 
              focus:ring-2 
              focus:ring-orange-400"
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

          <div className="text-left">
            <label htmlFor="startTime">Start time</label>
          </div>
          <input
            id="startTime"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1.5 text-sm"
          />

          <div className="text-left">
            <label htmlFor="endTime">End time</label>
          </div>
          <input
            id="endTime"
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
  );
}

export default ManagerTasks;
