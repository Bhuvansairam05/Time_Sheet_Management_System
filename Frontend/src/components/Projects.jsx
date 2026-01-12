import { useState } from "react";

function Projects() {
  const [projects, setProjects ] = useState([]);
  const handleAddProject = () => {
    console.log('Add Project clicked');
  };

  const handleView = (projectId, projectName) => {
    console.log('View project:', projectId, projectName);
  };

  const handleEdit = (projectId, projectName) => {
    console.log('Edit project:', projectId, projectName);
  };

  const handleDelete = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      console.log('Delete project:', projectId);
    }
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
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
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
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                View
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
            {(projects.length===0)}
            {projects.map((project, index) => (
              <tr key={project.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm text-gray-800">
                  {index + 1}
                </td>

                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {project.name}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {project.managedBy}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleView(project.id, project.name)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleEdit(project.id, project.name)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Edit
                  </button>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
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
