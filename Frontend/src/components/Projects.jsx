import { useEffect, useState } from "react";
import AddProjectModal from "./AddProjectModal.jsx";
import toast from "react-hot-toast";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 modal state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  /* ===============================
     FETCH PROJECTS
  ================================ */
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

  /* ===============================
     FETCH MANAGERS (not_in_project)
     (temporary frontend filter)
  ================================ */
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
        // ⚠️ TEMP: filtering here
        const availableManagers = result.data.filter(
          (u) => u.is_manager && u.status === "not_in_project"
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

  /* ===============================
     ADD PROJECT (UI ONLY FOR NOW)
  ================================ */
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

    // ✅ SUCCESS FLOW
    fetchProjects();
    toast.success("Project created successfully");

    // ✅ CLOSE MODAL (THIS WAS THE ISSUE)
    setShowAddProjectModal(false);

    // refresh data
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
    console.log("Edit project:", projectId);
  };

  const handleDelete = async (projectId, projectName) => {
    console.log("Delete project:", projectId, projectName);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
        >
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
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
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {project.project_name}
                  </td>
                  <td className="px-4 py-3">
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

      {/* ✅ ADD PROJECT MODAL */}
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSubmit={handleAddProject}
        managers={managers}
      />
    </div>
  );
}

export default Projects;
