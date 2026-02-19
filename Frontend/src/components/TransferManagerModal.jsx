import { useState } from "react";
function TransferManagerModal({
  isOpen,
  onClose,
  manager,
  managers,
  projects,
  onConfirm,
}) {
  const [newManager, setNewManager] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3">
          Transfer Projects from {manager.name}
        </h2>

        <p className="text-sm text-gray-600 mb-2">
          Select another manager to reassign responsibilities.
        </p>
        <select
          value={newManager}
          onChange={(e) => setNewManager(e.target.value)}
          className="border w-full p-2 rounded mb-4"
        >
          <option value="">Select Manager</option>
          {managers
            .filter((m) => m._id !== manager._id)
            .map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
        </select>
        <div className="max-h-40 overflow-auto border p-2 rounded mb-4">
          {projects.map((p) => (
            <p key={p._id} className="text-sm">
              • {p.project_name}
            </p>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            disabled={!newManager}
            onClick={() => onConfirm(newManager)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
export default TransferManagerModal;