// import { useEffect, useState } from "react";

// function EditUserModal({ isOpen, onClose, user, managers, onUpdate }) {
//   const [formData, setFormData] = useState(null);
//   const [isDirty, setIsDirty] = useState(false);
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         role: user.role || "employee",
//         is_manager: user.is_manager || false,
//         reporting_to: user.reporting_to || "",
//       });
//       setIsDirty(false);
//     }
//   }, [user]);

//   if (!isOpen || !formData) return null;

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     const updatedValue = type === "checkbox" ? checked : value;

//     setFormData((prev) => {
//       const updated = { ...prev, [name]: updatedValue };

//       // if manager checked, clear reporting_to
//       if (name === "is_manager" && checked) {
//         updated.reporting_to = "";
//       }

//       return updated;
//     });

//     setIsDirty(true); // 🔥 enable Update button
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onUpdate(formData); // NEXT STEP: API
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//           />

//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//           />

//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg"
//           >
//             <option value="employee">Employee</option>
//             <option value="admin">Admin</option>
//           </select>

//           <label className="flex items-center gap-2 text-sm text-gray-700">
//             <input
//               type="checkbox"
//               name="is_manager"
//               checked={formData.is_manager}
//               onChange={handleChange}
//             />
//             Is Manager
//           </label>

//           {!formData.is_manager && (
//             <select
//               name="reporting_to"
//               value={formData.reporting_to}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg"
//             >
//               <option value="">Select Manager</option>

//               {(managers.length === 0 || (managers.length === 1 && managers[0]._id === user._id)) ? (
//                 <option disabled>
//                   First add managers, there are no managers in the organisation
//                 </option>
//               ) : (
//                 managers
//                   .filter(m => m._id !== user._id) // ❌ remove self
//                   .map(m => (
//                     <option key={m._id} value={m._id}>
//                       {m.name}
//                     </option>
//                   ))
//               )}
//             </select>
//           )}

//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded-lg"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={!isDirty}
//               className={`px-4 py-2 rounded-lg text-white
//                 ${isDirty ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-400 cursor-not-allowed"}
//               `}
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default EditUserModal;

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

      // if role is manager/admin → reporting not needed
      if (name === "role" && value !== "employee") {
        updated.reporting_to = "";
      }

      return updated;
    });

    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validate
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

          {/* ROLE */}
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

          {/* REPORTING MANAGER → only for employee */}
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
