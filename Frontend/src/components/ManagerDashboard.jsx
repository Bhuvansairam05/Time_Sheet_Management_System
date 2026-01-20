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
  const formatTime = (ms = 0) => {
    const mins = Math.floor(ms / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
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
  /* ===============================
     FETCH EMPLOYEE → PROJECT DETAILS
  ================================ */
  const fetchEmployeeDetails = async (employeeId) => {
    if (detailsData[employeeId]) return;
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
            Details
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
      </div>
    </>
  );
}
export default ManagerDashboard;