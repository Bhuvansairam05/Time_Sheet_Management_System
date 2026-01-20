import { useState, useEffect } from "react";

/* 🔹 reusable initial state */
const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "employee",
  is_manager: false,
  reporting_to: "",
};

function AddUserModal({ isOpen, onClose, onSubmit, managers }) {
  const [formData, setFormData] = useState(initialFormData);

  /* 🔹 reset form whenever modal closes */
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "is_manager" && checked ? { reporting_to: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      reporting_to: formData.is_manager ? null : formData.reporting_to,
    };

    onSubmit(payload);

    setFormData(initialFormData); // ✅ reset after submit
    onClose();                    // ✅ close modal
  };

  const handleClose = () => {
    setFormData(initialFormData); // ✅ reset on cancel / X
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add User</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_manager"
              checked={formData.is_manager}
              onChange={handleChange}
            />
            Is Manager
          </label>

          {!formData.is_manager && (
            <select
              name="reporting_to"
              value={formData.reporting_to}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Manager</option>

              {managers.length === 0 ? (
                <option value="" disabled>
                  First add managers, there are no managers in the organisation
                </option>
              ) : (
                managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))
              )}
            </select>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
