import { useEffect, useState } from "react";
import AddProjectModal from "./AddProjectModal.jsx";
import toast from "react-hot-toast";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [updatedProjectName, setUpdatedProjectName] = useState("");
  const [updatedManager, setUpdatedManager] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/getProjects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        setProjects(result.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/getEmployees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      if (result.success) {
        const availableManagers = result.data.filter(
          (u) => u.role === "manager"
        );
        setManagers(availableManagers);
      }
    } catch (err) {
      console.error("Error fetching managers", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchManagers();
  }, []);
  const handleAddProject = async (projectData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/addProject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to add project");
        return;
      }
      fetchProjects();
      toast.success("Project created successfully");
      setShowAddProjectModal(false);
      fetchProjects();
      fetchManagers();

    } catch (error) {
      console.error("Add Project Error:", error);
      toast.error("Server error while adding project");
    } finally {
      setLoading(false);
    }
  };



  const handleEdit = (projectId) => {
    const project = projects.find(p => p.project_id === projectId);

    if (!project) return;

    setSelectedProject(project);
    setUpdatedProjectName(project.project_name);
    setUpdatedManager(project.manager_id || "");
    setShowUpdateModal(true);
  };

  const handleDelete = async (projectId, projectName) => {
    console.log("Delete project:", projectId, projectName);
  };
const handleUpdateProject = async () => {
  if (!updatedProjectName || !updatedManager) {
    toast.error("Please fill all fields");
    return;
  }

  toast((t) => (
    <div>
      <p className="font-semibold mb-2">Are you sure to update?</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-blue-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id);

            try {
              const token = localStorage.getItem("token");

              const res = await fetch(
                `http://localhost:5000/api/admin/updateProject/${selectedProject.project_id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    project_name: updatedProjectName,
                    manager_id: updatedManager,
                  }),
                }
              );

              const result = await res.json();

              if (!res.ok) {
                toast.error(result.message || "Update failed");
                return;
              }

              toast.success("Project updated successfully");
              setShowUpdateModal(false);
              fetchProjects();
              fetchManagers();

            } catch (error) {
              toast.error("Server error while updating");
            }
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Yes
        </button>
      </div>
    </div>
  ));
};
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Add Project
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Project Name</th>
              <th className="px-4 py-3">Managed By</th>
              <th className="px-4 py-3 text-center">Edit</th>
              <th className="px-4 py-3 text-center">Delete</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading projects...
                </td>
              </tr>
            )}

            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No projects found
                </td>
              </tr>
            )}

            {!loading &&
              projects.map((project, index) => (
                <tr key={project.project_id}>
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-center">
                    {project.project_name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {project.manager_name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(project.project_id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        handleDelete(
                          project.project_id,
                          project.project_name
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSubmit={handleAddProject}
        managers={managers}
      />
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Update Project
              </h2>
              <button
                onClick={() => setShowUpdateModal(false)}
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
                  value={updatedProjectName}
                  onChange={(e) => setUpdatedProjectName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Manager
                </label>
                <select
                  value={updatedManager}
                  onChange={(e) => setUpdatedManager(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>

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
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-blue-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProject}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Update Project
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Projects;
