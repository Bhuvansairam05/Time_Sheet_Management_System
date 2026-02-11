import { useEffect, useState } from "react";
function AddProjectModal({
  isOpen,
  onClose,
  onSubmit,
  managers = [],
}) {
  const [projectName, setProjectName] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  useEffect(() => {
    if (isOpen) {
      setProjectName("");
      setSelectedManager("");
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = () => {
    if (!projectName || !selectedManager) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({
      project_name: projectName,
      manager_id: selectedManager,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Add Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Manager
            </label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Manager</option>

              {managers.length === 0 && (
                <option disabled>No managers available</option>
              )}

              {managers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddProjectModal;