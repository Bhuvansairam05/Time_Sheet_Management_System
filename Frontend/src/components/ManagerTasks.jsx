import { useState } from "react";
import toast from "react-hot-toast";

function ManagerTasks() {
  const projects = ["Talent Farm", "HR Portal", "Timesheet System"];

  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    project: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    const diffMs = endDate - startDate;
    if (diffMs <= 0) return null;
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { project, description, startTime, endTime } = formData;

    if (!project || !description || !startTime || !endTime) {
      toast.error("All fields are required");
      return;
    }

    const duration = calculateDuration(startTime, endTime);
    if (!duration) {
      toast.error("End time must be after start time");
      return;
    }

    setTasks([...tasks, { project, description, duration }]);
    toast.success("Task added");

    setFormData({
      project: "",
      description: "",
      startTime: "",
      endTime: "",
    });
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
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Project</th>
                <th className="border px-2 py-1">Task</th>
                <th className="border px-2 py-1">Hrs</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 text-center">
                    {i + 1}
                  </td>
                  <td className="border px-2 py-1">
                    {task.project}
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
            className="w-full border rounded px-3 py-1.5 text-sm"
          >
            <option value="">Select Project</option>
            {projects.map((p, i) => (
              <option key={i} value={p}>
                {p}
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
  );
}

export default ManagerTasks;