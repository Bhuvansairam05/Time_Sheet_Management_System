import { useEffect, useState } from "react";
function EditUserModal({ isOpen, onClose, user, managers, onUpdate }) {
  const [formData, setFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "employee",
        reporting_to: user.reporting_to || "",
      });
      setIsDirty(false);
    }
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "role" && value !== "employee") {
        updated.reporting_to = "";
      }

      return updated;
    });

    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.role === "employee" && !formData.reporting_to) {
      alert("Reporting manager is required for employees");
      return;
    }
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          { (
            <select
              name="reporting_to"
              value={formData.reporting_to}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required={formData.role==="employee"}
            >
              <option value="">Select Manager *</option>

              {managers
                .filter((m) => m._id !== user._id)
                .map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
            </select>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isDirty}
              className={`px-4 py-2 rounded-lg text-white ${
                isDirty
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditUserModal;