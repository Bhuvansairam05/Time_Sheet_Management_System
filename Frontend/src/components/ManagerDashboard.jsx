import { useEffect, useState } from "react";
import Loader from "./Loader.jsx";
import toast from "react-hot-toast";
function ManagerDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("week");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [showProjectSection, setShowProjectSection] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectEmployees, setProjectEmployees] = useState([]);
  const [projectFilter, setProjectFilter] = useState("week");
  const [projectFromDate, setProjectFromDate] = useState("");
  const [projectToDate, setProjectToDate] = useState("");
  const [projectExpandedRows, setProjectExpandedRows] = useState({});
  const [projectDetailsData, setProjectDetailsData] = useState({});
  const [projectExpandAll, setProjectExpandAll] = useState(false);

  const formatTime = (ms = 0) => {
    const mins = Math.floor(ms / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/timesheet/manager/projects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json();
        if (res.ok) setProjects(result.data);

      } catch {
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  const openProjectDetails = async () => {
    setShowProjectSection(true);
    await fetchProjects();
  };
  const toggleProjectRow = async (employeeId) => {
    await fetchProjectEmployeeDetails(employeeId);

    setProjectExpandedRows(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };
  const handleProjectExpandAll = async () => {
    const newState = !projectExpandAll;
    setProjectExpandAll(newState);

    const map = {};

    for (const emp of projectEmployees) {
      map[emp._id] = newState;
      await fetchProjectEmployeeDetails(emp._id);
    }

    setProjectExpandedRows(map);
  };

  const fetchProjectEmployees = async () => {
    if (!selectedProject) return;

    try {
      const token = localStorage.getItem("token");

      let url = `http://localhost:5000/api/timesheet/manager/project/${selectedProject}?filter=${projectFilter}`;

      if (projectFilter === "custom" && projectFromDate && projectToDate) {
        url += `&from=${projectFromDate}&to=${projectToDate}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok) setProjectEmployees(result.data);

    } catch {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchProjectEmployees();
  }, [selectedProject, projectFilter, projectFromDate, projectToDate]);
  const fetchProjectEmployeeDetails = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");

      let url = `http://localhost:5000/api/timesheet/manager/employee/${employeeId}?filter=${projectFilter}`;

      if (projectFilter === "custom" && projectFromDate && projectToDate) {
        url += `&from=${projectFromDate}&to=${projectToDate}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) return;

      setProjectDetailsData(prev => ({
        ...prev,
        [employeeId]: result.data
      }));

    } catch {
      toast.error("Failed to load");
    }
  };


  const fetchTeamWithTime = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/timesheet/manager/summary?filter=${filter}`;
      if (filter === "custom" && fromDate && toDate) {
        url += `&from=${fromDate}&to=${toDate}`;
      }
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to load team");
        return;
      }
      setEmployees(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // console.log(user); This is executing 
    if (user?.id) {
      // console.log(user); This is executing
      fetchTeamWithTime();
    }
  }, [filter, toDate, user]);
  useEffect(() => {
    setDetailsData({});
    setExpandedRows({});
    setExpandAll(false);
    const refetchExpandedDetails = async () => {
      for (const empId of Object.keys(expandedRows)) {
        if (expandedRows[empId]) {
          await fetchEmployeeDetails(empId);
        }
      }
    };

    if (Object.keys(expandedRows).length > 0) {
      refetchExpandedDetails();
    }
  }, [filter, fromDate, toDate]);

  /* ===============================
     FETCH EMPLOYEE → PROJECT DETAILS
  ================================ */
  const fetchEmployeeDetails = async (employeeId) => {
    if (detailsData[employeeId]?.filter === filter) return;
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/timesheet/manager/employee/${employeeId}?filter=${filter}`;
      if (filter === "custom" && fromDate && toDate) {
        url += `&from=${fromDate}&to=${toDate}`;
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to load project details");
        return;
      }
      setDetailsData((prev) => ({
        ...prev,
        [employeeId]: result.data,
      }));
    } catch {
      toast.error("Failed to load project details");
    }
  };
  const toggleRow = async (employeeId) => {
    await fetchEmployeeDetails(employeeId);
    setExpandedRows((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const handleExpandAll = async () => {
    const newState = !expandAll;
    setExpandAll(newState);
    const map = {};
    for (const emp of employees) {
      map[emp._id] = newState;
      await fetchEmployeeDetails(emp._id);
    }
    setExpandedRows(map);
  };
  return (
    <>
      {loading && <Loader />}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {user?.name} here is your team
          </h2>
          <button
            onClick={handleExpandAll}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Expand All
          </button>
        </div>
        <table className="min-w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Employee Name</th>
              {/* ⏱ FILTER */}
              <th className="px-4 py-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>Time Worked</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="day">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="custom">Custom</option>
                  </select>
                  {filter === "custom" && (
                    <div className="flex gap-1">
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border rounded px-1 text-xs"
                      />
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border rounded px-1 text-xs"
                      />
                    </div>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <>
                <tr
                  key={emp._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(emp._id)}
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatTime(emp.timeWorked)}
                  </td>
                </tr>
                {expandedRows[emp._id] && (
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-8 py-4">
                      <table className="w-full border">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left">
                              Project
                            </th>
                            <th className="px-3 py-2 text-right">
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailsData[emp._id]?.map((p, idx) => (
                            <tr key={idx}>
                              <td className="px-3 py-2 text-left">
                                {p.projectName}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {formatTime(p.totalTime)}
                              </td>
                            </tr>
                          ))}
                          {detailsData[emp._id]?.length === 0 && (
                            <tr>
                              <td
                                colSpan="2"
                                className="text-center py-2 text-gray-500"
                              >
                                No project data
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {employees.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500"
                >
                  No employees reporting to you
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showProjectSection && (
          <div className="mt-10 bg-white rounded-lg shadow-md p-6">

            <h3 className="text-xl font-bold mb-4">
              Project Wise Employee Work
            </h3>
            <button
              onClick={handleProjectExpandAll}
              className="bg-blue-600 text-white px-4 py-2 rounded ml-3"
            >
              Expand All
            </button>

            {/* Dropdown */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="border px-3 py-2 rounded mb-4"
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.project_name}
                </option>
              ))}
            </select>

            {/* FILTER */}
            {/* <div className="mb-4">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="border px-2 py-1 ml-3"
              >
                <option value="day">Today</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="custom">Custom</option>
              </select>

              {projectFilter === "custom" && (
                <>
                  <input
                    type="date"
                    value={projectFromDate}
                    onChange={(e) => setProjectFromDate(e.target.value)}
                    className="border ml-2"
                  />
                  <input
                    type="date"
                    value={projectToDate}
                    onChange={(e) => setProjectToDate(e.target.value)}
                    className="border ml-2"
                  />
                </>
              )}


            </div> */}

            {/* TABLE */}
            <table className="min-w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Employee Name</th>
                  <th className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                       <span className="">Time Worked</span>
                      <select
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="day">Today</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="custom">Custom</option>
                      </select>

                      {projectFilter === "custom" && (
                        <div className="flex gap-1">
                          <input
                            type="date"
                            value={projectFromDate}
                            onChange={(e) => setProjectFromDate(e.target.value)}
                            className="border rounded px-1 text-xs"
                          />
                          <input
                            type="date"
                            value={projectToDate}
                            onChange={(e) => setProjectToDate(e.target.value)}
                            className="border rounded px-1 text-xs"
                          />
                        </div>
                      )}


                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {projectEmployees.map((emp, i) => (
                  <>
                    <tr
                      key={emp._id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleProjectRow(emp._id)}
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2 text-center">
                        {formatTime(emp.totalTime)}
                      </td>
                    </tr>

                    {projectExpandedRows[emp._id] && (
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="px-8 py-4">
                          <table className="w-full border">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-3 py-2 text-left">Project</th>
                                <th className="px-3 py-2 text-right">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectDetailsData[emp._id]?.map((p, idx) => (
                                <tr key={idx}>
                                  <td>{p.projectName}</td>
                                  <td className="text-right">
                                    {formatTime(p.totalTime)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>

            </table>

          </div>
        )}


      </div>
    </>
  );
}
export default ManagerDashboard;