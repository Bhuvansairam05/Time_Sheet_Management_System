import { useState } from "react";
import toast from "react-hot-toast";

function ManagerTasks() {
  const [formData, setFormData] = useState({
    project: "",
    description: "",
    hours: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.project || !formData.description || !formData.hours) {
      toast.error("All fields are required");
      return;
    }

    // 🔜 Backend integration later
    toast.success("Task added successfully");

    setFormData({
      project: "",
      description: "",
      hours: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        My Tasks
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Task Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Describe your work"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Hours Worked
          </label>
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="e.g. 4"
            min="0"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManagerTasks;