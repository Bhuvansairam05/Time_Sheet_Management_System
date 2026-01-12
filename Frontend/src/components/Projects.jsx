import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token"); // or adminToken

    const res = await fetch("http://localhost:5000/api/admin/getProjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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


  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    console.log("Add Project clicked");
    // after successful add project API call
    fetchProjects();
  };

  const handleEdit = (projectId) => {
    console.log("Edit project:", projectId);
  };

  const handleDelete = async (projectId, projectName) => {
    console.log("Deleted successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>

        <button
          onClick={handleAddProject}
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
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                S.No
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Project Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Managed By
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Time Spent
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Edit
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Delete
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading projects...
                </td>
              </tr>
            )}

            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No projects found
                </td>
              </tr>
            )}

            {!loading &&
              projects.map((project, index) => (
                <tr
                  key={project.project_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {project.project_name}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {project.manager_name}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    0 hrs
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(project.project_id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
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
                      className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Projects;
