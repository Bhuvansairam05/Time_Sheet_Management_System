// import { useEffect, useState } from "react";
// import Loader from "./Loader.jsx";
// import toast from "react-hot-toast";
// function ManagerDashboard({ user }) {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("week");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [expandedRows, setExpandedRows] = useState({});
//   const [expandAll, setExpandAll] = useState(false);
//   const [detailsData, setDetailsData] = useState({});
//   const [showProjectSection, setShowProjectSection] = useState(true);
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [projectEmployees, setProjectEmployees] = useState([]);
//   const [projectFilter, setProjectFilter] = useState("week");
//   const [projectFromDate, setProjectFromDate] = useState("");
//   const [projectToDate, setProjectToDate] = useState("");
//   const [projectExpandedRows, setProjectExpandedRows] = useState({});
//   const [projectDetailsData, setProjectDetailsData] = useState({});
//   const [projectExpandAll, setProjectExpandAll] = useState(false);
//   const [expandedProjects, setExpandedProjects] = useState({});
//   const [projectExpandedProjects, setProjectExpandedProjects] = useState({});
//   const [employeeProjectExpandAll, setEmployeeProjectExpandAll] = useState({});


//   const formatTime = (ms = 0) => {
//     const mins = Math.floor(ms / 60000);
//     const h = Math.floor(mins / 60);
//     const m = mins % 60;
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}`;
//   };
//   const handleProjectSectionExpandAll = (empId, totalProjects) => {
//     const newState = !employeeProjectExpandAll[empId];

//     setEmployeeProjectExpandAll(prev => ({
//       ...prev,
//       [empId]: newState
//     }));

//     const expandedMap = {};
//     for (let i = 0; i < totalProjects; i++) {
//       expandedMap[i] = newState;
//     }

//     setProjectExpandedProjects(prev => ({
//       ...prev,
//       [empId]: expandedMap
//     }));
//   };

//   const handleEmployeeProjectExpandAll = (userId, totalProjects) => {
//     const newState = !employeeProjectExpandAll[userId];

//     // Toggle button state
//     setEmployeeProjectExpandAll(prev => ({
//       ...prev,
//       [userId]: newState
//     }));

//     // Expand/collapse all project rows for that employee
//     const expandedMap = {};
//     for (let i = 0; i < totalProjects; i++) {
//       expandedMap[i] = newState;
//     }

//     setExpandedProjects(prev => ({
//       ...prev,
//       [userId]: expandedMap
//     }));
//   };

//   const toggleProject = (empId, index) => {
//     setExpandedProjects(prev => ({
//       ...prev,
//       [empId]: {
//         ...prev[empId],
//         [index]: !prev[empId]?.[index]
//       }
//     }));
//   };

//   const toggleProjectInsideProjectSection = (empId, index) => {
//     setProjectExpandedProjects(prev => ({
//       ...prev,
//       [empId]: {
//         ...prev[empId],
//         [index]: !prev[empId]?.[index]
//       }
//     }));
//   };


//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           "http://localhost:5000/api/timesheet/manager/projects",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const result = await res.json();
//         if (res.ok) setProjects(result.data);

//       } catch {
//         toast.error("Failed to load projects");
//       }
//     };
//     fetchProjects();
//   }, []);

//   const openProjectDetails = async () => {
//     setShowProjectSection(true);
//     await fetchProjects();
//   };
//   const toggleProjectRow = async (employeeId) => {
//     await fetchProjectEmployeeDetails(employeeId);

//     setProjectExpandedRows(prev => ({
//       ...prev,
//       [employeeId]: !prev[employeeId]
//     }));
//   };
//   const handleProjectExpandAll = async () => {
//     const newState = !projectExpandAll;
//     setProjectExpandAll(newState);

//     const map = {};

//     for (const emp of projectEmployees) {
//       map[emp._id] = newState;
//       await fetchProjectEmployeeDetails(emp._id);
//     }

//     setProjectExpandedRows(map);
//   };

//   const fetchProjectEmployees = async () => {
//     if (!selectedProject) return;

//     try {
//       const token = localStorage.getItem("token");

//       let url = `http://localhost:5000/api/timesheet/manager/project/${selectedProject}?filter=${projectFilter}`;

//       if (projectFilter === "custom" && projectFromDate && projectToDate) {
//         url += `&from=${projectFromDate}&to=${projectToDate}`;
//       }

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const result = await res.json();
//       if (res.ok) setProjectEmployees(result.data);

//     } catch {
//       toast.error("Failed");
//     }
//   };

//   useEffect(() => {
//     fetchProjectEmployees();
//   }, [selectedProject, projectFilter, projectFromDate, projectToDate]);
//   const fetchProjectEmployeeDetails = async (employeeId) => {
//     try {
//       const token = localStorage.getItem("token");

//       let url = `http://localhost:5000/api/timesheet/employee/${employeeId}?filter=${projectFilter}`;

//       if (projectFilter === "custom" && projectFromDate && projectToDate) {
//         url += `&from=${projectFromDate}&to=${projectToDate}`;
//       }

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const result = await res.json();
//       if (!res.ok) return;

//       setProjectDetailsData(prev => ({
//         ...prev,
//         [employeeId]: result.data
//       }));

//     } catch {
//       toast.error("Failed to load");
//     }
//   };


//   const fetchTeamWithTime = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       let url = `http://localhost:5000/api/timesheet/manager/summary?filter=${filter}`;
//       if (filter === "custom" && fromDate && toDate) {
//         url += `&from=${fromDate}&to=${toDate}`;
//       }
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await res.json();
//       if (!res.ok) {
//         toast.error(result.message || "Failed to load team");
//         return;
//       }
//       setEmployees(result.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       toast.error("Failed to load team");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (user?.id) {
//       fetchTeamWithTime();
//     }
//   }, [filter, toDate, user]);
//   useEffect(() => {
//     setDetailsData({});
//     setExpandedRows({});
//     setExpandAll(false);
//     const refetchExpandedDetails = async () => {
//       for (const empId of Object.keys(expandedRows)) {
//         if (expandedRows[empId]) {
//           await fetchEmployeeDetails(empId);
//         }
//       }
//     };

//     if (Object.keys(expandedRows).length > 0) {
//       refetchExpandedDetails();
//     }
//   }, [filter, fromDate, toDate]);
//   const fetchEmployeeDetails = async (employeeId) => {
//     if (detailsData[employeeId]?.filter === filter) return;
//     try {
//       const token = localStorage.getItem("token");
//       let url = `http://localhost:5000/api/timesheet/employee/${employeeId}?filter=${filter}`;
//       if (filter === "custom" && fromDate && toDate) {
//         url += `&from=${fromDate}&to=${toDate}`;
//       }
//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await res.json();
//       if (!res.ok) {
//         toast.error(result.message || "Failed to load project details");
//         return;
//       }
//       setDetailsData((prev) => ({
//         ...prev,
//         [employeeId]: result.data,
//       }));
//     } catch {
//       toast.error("Failed to load project details");
//     }
//   };
//   const toggleRow = async (employeeId) => {
//     await fetchEmployeeDetails(employeeId);
//     setExpandedRows((prev) => ({
//       ...prev,
//       [employeeId]: !prev[employeeId],
//     }));
//   };

//   const handleExpandAll = async () => {
//     const newState = !expandAll;
//     setExpandAll(newState);

//     const map = {};
//     for (const emp of employees) {
//       map[emp._id] = newState;
//       await fetchEmployeeDetails(emp._id);
//     }

//     setExpandedRows(map);
//   };

//   return (
//     <>
//       {loading && <Loader />}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             {user?.name} here is your team
//           </h2>
//           <button
//             onClick={handleExpandAll}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             {expandAll ? "Collapse All" : "Expand All"}
//           </button>

//         </div>
//         <table className="min-w-full border rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-3">S.No</th>
//               <th className="px-4 py-3">Employee Name</th>
//               {/* ⏱ FILTER */}
//               <th className="px-4 py-3 text-center">
//                 <div className="flex flex-col items-center gap-1">
//                   <span>Time Worked</span>
//                   <select
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value)}
//                     className="border rounded px-2 py-1 text-sm"
//                   >
//                     <option value="day">Today</option>
//                     <option value="week">Week</option>
//                     <option value="month">Month</option>
//                     <option value="custom">Custom</option>
//                   </select>
//                   {filter === "custom" && (
//                     <div className="flex gap-1">
//                       <input
//                         type="date"
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                         className="border rounded px-1 text-xs"
//                       />
//                       <input
//                         type="date"
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                         className="border rounded px-1 text-xs"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.map((emp, i) => (
//               <>
//                 <tr
//                   key={emp._id}
//                   className="border-t hover:bg-gray-50 cursor-pointer"
//                   onClick={() => toggleRow(emp._id)}
//                 >
//                   <td className="px-4 py-3">{i + 1}</td>
//                   <td className="px-4 py-3 font-medium">
//                     {emp.name}
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     {formatTime(emp.timeWorked)}
//                   </td>
//                 </tr>
//                 {expandedRows[emp._id] && (
//                   <tr className="bg-gray-50">
//                     <td colSpan="3" className="px-8 py-4">
//                       <table className="w-full border">
//                         <thead className="bg-gray-200">
//                           <tr>
//                             <th className="px-3 py-2 text-left">
//                               Project
//                             </th>
//                             <th className="px-3 py-2 text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <span>Time</span>

//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleEmployeeProjectExpandAll(
//                                       emp._id,
//                                       detailsData[emp._id]?.length || 0
//                                     );
//                                   }}
//                                   className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
//                                 >
//                                   {employeeProjectExpandAll[emp._id] ? "Collapse All" : "Expand All"}
//                                 </button>
//                               </div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {detailsData[emp._id]?.map((p, idx) => (
//                             <>
//                               {/* Project Row */}
//                               <tr
//                                 key={idx}
//                                 className="cursor-pointer hover:bg-gray-100"
//                                 onClick={() => toggleProject(emp._id, idx)}
//                               >
//                                 <td className="px-3 py-2 font-medium text-gray-800">
//                                   {expandedProjects[emp._id]?.[idx] ? "▼ " : "▶ "}
//                                   {p.projectName}
//                                 </td>
//                                 <td className="px-3 py-2 text-right font-semibold text-gray-700">
//                                   {p.totalTime}
//                                 </td>
//                               </tr>

//                               {/* Tasks Section */}
//                               {expandedProjects[emp._id]?.[idx] && (
//                                 <tr>
//                                   <td colSpan="2" className="px-6 py-4 bg-gray-50">
//                                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

//                                       {/* <table className="w-full text-sm">
//                                         <thead>
//                                           <tr className="border-b text-gray-600 text-xs uppercase tracking-wide">
//                                             <th className="text-left py-2 px-3">Task</th>

//                                             {p.tasks[0]?.date && (
//                                               <th className="text-left py-2 px-3">Date</th>
//                                             )}

//                                             <th className="text-right py-2 px-3">Time</th>
//                                           </tr>
//                                         </thead>

//                                         <tbody>
//                                           {p.tasks.map((task, i) => (
//                                             <tr
//                                               key={i}
//                                               className="border-b last:border-none hover:bg-gray-50 transition"
//                                             >
//                                               <td className="py-3 px-3 font-medium text-gray-800">
//                                                 {task.description}
//                                               </td>

//                                               {task.date && (
//                                                 <td className="py-3 px-3 text-gray-600">
//                                                   {new Date(task.date).toLocaleDateString()}
//                                                 </td>
//                                               )}

//                                               <td className="py-3 px-3 text-right font-semibold text-gray-700">
//                                                 {task.time}
//                                               </td>
//                                             </tr>
//                                           ))}
//                                         </tbody>
//                                       </table> */}
//                                       <table className="w-full table-fixed text-sm">
//                                         <thead>
//                                           <tr className="border-b text-gray-600 text-xs uppercase tracking-wide">
//                                             <th className="w-1/2 text-left py-3 px-4">Task</th>

//                                             {p.tasks?.[0]?.date && (
//                                               <th className="w-1/4 text-left py-3 px-4">Date</th>
//                                             )}

//                                             <th className="px-3 py-2 text-right">
//                                               Time
//                                             </th>

//                                           </tr>
//                                         </thead>

//                                         <tbody>
//                                           {p.tasks?.map((task, i) => (
//                                             <tr
//                                               key={i}
//                                               className="border-b last:border-none hover:bg-gray-50 transition"
//                                             >
//                                               <td className="py-3 px-4 text-left font-medium text-gray-800">
//                                                 {task.description}
//                                               </td>

//                                               {task.date && (
//                                                 <td className="py-3 px-4 text-left text-gray-600">
//                                                   {new Date(task.date).toLocaleDateString()}
//                                                 </td>
//                                               )}

//                                               <td className="py-3 px-4 text-right font-semibold text-gray-700">
//                                                 {task.time}
//                                               </td>
//                                             </tr>
//                                           ))}
//                                         </tbody>
//                                       </table>

//                                     </div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </>
//                           ))}


//                           {detailsData[emp._id]?.length === 0 && (
//                             <tr>
//                               <td
//                                 colSpan="2"
//                                 className="text-center py-2 text-gray-500"
//                               >
//                                 No project data
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </>
//             ))}
//             {employees.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="3"
//                   className="text-center py-6 text-gray-500"
//                 >
//                   No employees reporting to you
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {showProjectSection && (
//           <div className="mt-10 bg-white rounded-lg shadow-md p-6">

//             <h3 className="text-xl font-bold mb-4">
//               Project Wise Employee Work
//             </h3>
//             <button
//               onClick={handleProjectExpandAll}
//               className="bg-blue-600 text-white px-4 py-2 rounded ml-3"
//             >
//               {projectExpandAll ? "Collapse All" : "Expand All"}
//             </button>

//             <select
//               value={selectedProject}
//               onChange={(e) => setSelectedProject(e.target.value)}
//               className="border px-3 py-2 rounded mb-4"
//             >
//               <option value="">Select Project</option>
//               {projects.map(p => (
//                 <option key={p._id} value={p._id}>
//                   {p.project_name}
//                 </option>
//               ))}
//             </select>
//             <table className="min-w-full border rounded-lg">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3">S.No</th>
//                   <th className="px-4 py-3">Employee Name</th>
//                   <th className="px-4 py-3 text-center">
//                     <div className="flex flex-col items-center gap-1">
//                       <span className="">Time Worked</span>
//                       <select
//                         value={projectFilter}
//                         onChange={(e) => setProjectFilter(e.target.value)}
//                         className="border rounded px-2 py-1 text-sm"
//                       >
//                         <option value="day">Today</option>
//                         <option value="week">Week</option>
//                         <option value="month">Month</option>
//                         <option value="custom">Custom</option>
//                       </select>

//                       {projectFilter === "custom" && (
//                         <div className="flex gap-1">
//                           <input
//                             type="date"
//                             value={projectFromDate}
//                             onChange={(e) => setProjectFromDate(e.target.value)}
//                             className="border rounded px-1 text-xs"
//                           />
//                           <input
//                             type="date"
//                             value={projectToDate}
//                             onChange={(e) => setProjectToDate(e.target.value)}
//                             className="border rounded px-1 text-xs"
//                           />
//                         </div>
//                       )}


//                     </div>
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {projectEmployees.map((emp, i) => (
//                   <>
//                     <tr
//                       key={emp._id}
//                       className="border-t hover:bg-gray-50 cursor-pointer"
//                       onClick={() => toggleProjectRow(emp._id)}
//                     >
//                       <td className="px-4 py-2">{i + 1}</td>
//                       <td className="px-4 py-2">{emp.name}</td>
//                       <td className="px-4 py-2 text-center">
//                         {formatTime(emp.totalTime)}
//                       </td>
//                     </tr>
//                     {projectExpandedRows[emp._id] && (
//                       <tr className="bg-gray-50">
//                         <td colSpan="3" className="px-8 py-4">
//                           <table className="w-full border">
//                             <thead className="bg-gray-200">
//                               <tr>
//                                 <th className="px-3 py-2 text-left">Project</th>
//                                 <th className="px-3 py-2 text-right"><div className="flex items-center justify-end gap-2">
//                                   <span>Time</span>

//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleProjectSectionExpandAll(
//                                         emp._id,
//                                         projectDetailsData[emp._id]?.length || 0
//                                       );
//                                     }}
//                                     className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
//                                   >
//                                     {employeeProjectExpandAll[emp._id] ? "Collapse All" : "Expand All"}
//                                   </button>
//                                 </div></th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {projectDetailsData[emp._id]?.map((p, idx) => (
//                                 <>
//                                   {/* Project Row */}
//                                   <tr
//                                     key={idx}
//                                     className="cursor-pointer hover:bg-gray-100"
//                                     onClick={() =>
//                                       toggleProjectInsideProjectSection(emp._id, idx)
//                                     }
//                                   >
//                                     <td className="px-3 py-2 font-medium text-gray-800">
//                                       {projectExpandedProjects[emp._id]?.[idx] ? "▼ " : "▶ "}
//                                       {p.projectName}
//                                     </td>
//                                     <td className="px-3 py-2 text-right font-semibold text-gray-700">
//                                       {p.totalTime}
//                                     </td>
//                                   </tr>

//                                   {/* Tasks Section */}
//                                   {projectExpandedProjects[emp._id]?.[idx] && (
//                                     <tr>
//                                       <td colSpan="2" className="px-6 py-4 bg-gray-50">
//                                         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

//                                           {/* <table className="w-full text-sm">
//                                             <thead>
//                                               <tr className="border-b text-gray-600 text-xs uppercase tracking-wide">
//                                                 <th className="text-left py-2 px-3">Task</th>

//                                                 {p.tasks[0]?.date && (
//                                                   <th className="text-left py-2 px-3">Date</th>
//                                                 )}

//                                                 <th className="text-right py-2 px-3">Time</th>
//                                               </tr>
//                                             </thead>

//                                             <tbody>
//                                               {p.tasks.map((task, i) => (
//                                                 <tr
//                                                   key={i}
//                                                   className="border-b last:border-none hover:bg-gray-50 transition"
//                                                 >
//                                                   <td className="py-3 px-3 font-medium text-gray-800">
//                                                     {task.description}
//                                                   </td>

//                                                   {task.date && (
//                                                     <td className="py-3 px-3 text-gray-600">
//                                                       {new Date(task.date).toLocaleDateString()}
//                                                     </td>
//                                                   )}

//                                                   <td className="py-3 px-3 text-right font-semibold text-gray-700">
//                                                     {task.time}
//                                                   </td>
//                                                 </tr>
//                                               ))}
//                                             </tbody>
//                                           </table> */}
//                                           <table className="w-full table-fixed text-sm">
//                                             <thead>
//                                               <tr className="border-b text-gray-600 text-xs uppercase tracking-wide">
//                                                 <th className="w-1/2 text-left py-3 px-4">Task</th>

//                                                 {p.tasks?.[0]?.date && (
//                                                   <th className="w-1/4 text-left py-3 px-4">Date</th>
//                                                 )}

//                                                 <th className="px-3 py-2 text-right">
//                                                   Time
//                                                 </th>

//                                               </tr>
//                                             </thead>

//                                             <tbody>
//                                               {p.tasks?.map((task, i) => (
//                                                 <tr
//                                                   key={i}
//                                                   className="border-b last:border-none hover:bg-gray-50 transition"
//                                                 >
//                                                   <td className="py-3 px-4 text-left font-medium text-gray-800">
//                                                     {task.description}
//                                                   </td>

//                                                   {task.date && (
//                                                     <td className="py-3 px-4 text-left text-gray-600">
//                                                       {new Date(task.date).toLocaleDateString()}
//                                                     </td>
//                                                   )}

//                                                   <td className="py-3 px-4 text-right font-semibold text-gray-700">
//                                                     {task.time}
//                                                   </td>
//                                                 </tr>
//                                               ))}
//                                             </tbody>
//                                           </table>

//                                         </div>
//                                       </td>
//                                     </tr>
//                                   )}
//                                 </>
//                               ))}


//                             </tbody>
//                           </table>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 ))}
//               </tbody>

//             </table>

//           </div>
//         )}


//       </div>
//     </>
//   );
// }
// export default ManagerDashboard;

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
  const [expandedProjects, setExpandedProjects] = useState({});
  const [projectExpandedProjects, setProjectExpandedProjects] = useState({});
  const [employeeProjectExpandAll, setEmployeeProjectExpandAll] = useState({});

  const formatTime = (ms = 0) => {
    const mins = Math.floor(ms / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const handleProjectSectionExpandAll = (empId, totalProjects) => {
    const newState = !employeeProjectExpandAll[empId];
    setEmployeeProjectExpandAll(prev => ({ ...prev, [empId]: newState }));
    const expandedMap = {};
    for (let i = 0; i < totalProjects; i++) expandedMap[i] = newState;
    setProjectExpandedProjects(prev => ({ ...prev, [empId]: expandedMap }));
  };

  const handleEmployeeProjectExpandAll = (userId, totalProjects) => {
    const newState = !employeeProjectExpandAll[userId];
    setEmployeeProjectExpandAll(prev => ({ ...prev, [userId]: newState }));
    const expandedMap = {};
    for (let i = 0; i < totalProjects; i++) expandedMap[i] = newState;
    setExpandedProjects(prev => ({ ...prev, [userId]: expandedMap }));
  };

  const toggleProject = (empId, index) => {
    setExpandedProjects(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [index]: !prev[empId]?.[index] }
    }));
  };

  const toggleProjectInsideProjectSection = (empId, index) => {
    setProjectExpandedProjects(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [index]: !prev[empId]?.[index] }
    }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/timesheet/manager/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    setProjectExpandedRows(prev => ({ ...prev, [employeeId]: !prev[employeeId] }));
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
      if (projectFilter === "custom" && projectFromDate && projectToDate)
        url += `&from=${projectFromDate}&to=${projectToDate}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (res.ok) setProjectEmployees(result.data);
    } catch {
      toast.error("Failed");
    }
  };

  useEffect(() => { fetchProjectEmployees(); }, [selectedProject, projectFilter, projectFromDate, projectToDate]);

  const fetchProjectEmployeeDetails = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/timesheet/employee/${employeeId}?filter=${projectFilter}`;
      if (projectFilter === "custom" && projectFromDate && projectToDate)
        url += `&from=${projectFromDate}&to=${projectToDate}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (!res.ok) return;
      setProjectDetailsData(prev => ({ ...prev, [employeeId]: result.data }));
    } catch {
      toast.error("Failed to load");
    }
  };

  const fetchTeamWithTime = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/timesheet/manager/summary?filter=${filter}`;
      if (filter === "custom" && fromDate && toDate) url += `&from=${fromDate}&to=${toDate}`;
      const res = await fetch(url, { method: "GET", headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (!res.ok) { toast.error(result.message || "Failed to load team"); return; }
      setEmployees(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) fetchTeamWithTime(); }, [filter, toDate, user]);

  useEffect(() => {
    setDetailsData({});
    setExpandedRows({});
    setExpandAll(false);
    const refetchExpandedDetails = async () => {
      for (const empId of Object.keys(expandedRows)) {
        if (expandedRows[empId]) await fetchEmployeeDetails(empId);
      }
    };
    if (Object.keys(expandedRows).length > 0) refetchExpandedDetails();
  }, [filter, fromDate, toDate]);

  const fetchEmployeeDetails = async (employeeId) => {
    if (detailsData[employeeId]?.filter === filter) return;
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/timesheet/employee/${employeeId}?filter=${filter}`;
      if (filter === "custom" && fromDate && toDate) url += `&from=${fromDate}&to=${toDate}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (!res.ok) { toast.error(result.message || "Failed to load project details"); return; }
      setDetailsData(prev => ({ ...prev, [employeeId]: result.data }));
    } catch {
      toast.error("Failed to load project details");
    }
  };

  const toggleRow = async (employeeId) => {
    await fetchEmployeeDetails(employeeId);
    setExpandedRows(prev => ({ ...prev, [employeeId]: !prev[employeeId] }));
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

  // ─── shared style tokens ───────────────────────────────────────────
  const cardCls = "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden";
  const btnPrimary = "inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150";
  const btnGhost = "inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors duration-150";
  const selectCls = "border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
  const inputCls = "border border-slate-200 bg-white rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const thCls = "px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500";
  const tdCls = "px-5 py-3.5 text-sm text-slate-700";

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-slate-50 p-6 space-y-8">

        {/* ── TEAM SECTION ─────────────────────────────────────────── */}
        <div className={cardCls}>
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-700 to-blue-600">
            <div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-0.5">Team Overview</p>
              <h2 className="text-xl font-bold text-white">
                {user?.name ? `${user.name}'s Team` : "Your Team"}
              </h2>
            </div>
            <button onClick={handleExpandAll} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 transition-colors duration-150">
              {expandAll ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>Collapse All</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>Expand All</>
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className={`${thCls} text-left w-12`}>#</th>
                  <th className={`${thCls} text-left`}>Employee</th>
                  <th className={`${thCls} text-center`}>
                    <div className="flex flex-col items-center gap-2">
                      <span>Time Worked</span>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={selectCls}>
                          <option value="day">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="custom">Custom</option>
                        </select>
                        {filter === "custom" && (
                          <div className="flex gap-1.5">
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputCls} />
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputCls} />
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp, i) => (
                  <>
                    <tr
                      key={emp._id}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors duration-100 group"
                      onClick={() => toggleRow(emp._id)}
                    >
                      <td className={`${tdCls} text-slate-400 font-medium`}>{i + 1}</td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {emp.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{emp.name}</span>
                        </div>
                      </td>
                      <td className={`${tdCls} text-center`}>
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm border border-blue-100">
                            {formatTime(emp.timeWorked)}
                          </span>
                          <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                            {expandedRows[emp._id] ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded employee row */}
                    {expandedRows[emp._id] && (
                      <tr className="bg-slate-50/80">
                        <td colSpan="3" className="px-10 py-5">
                          <div className={`${cardCls} border-blue-100`}>
                            {/* inner table header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Projects</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEmployeeProjectExpandAll(emp._id, detailsData[emp._id]?.length || 0); }}
                                className={btnGhost}
                              >
                                {employeeProjectExpandAll[emp._id] ? "Collapse All" : "Expand All"}
                              </button>
                            </div>
                            <table className="w-full">
                              <thead className="bg-white border-b border-slate-100">
                                <tr>
                                  <th className={`${thCls} text-left`}>Project</th>
                                  <th className={`${thCls} text-right`}>Time</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {detailsData[emp._id]?.map((p, idx) => (
                                  <>
                                    <tr
                                      key={idx}
                                      className="cursor-pointer hover:bg-blue-50/60 transition-colors group/proj"
                                      onClick={() => toggleProject(emp._id, idx)}
                                    >
                                      <td className="px-4 py-3 font-semibold text-slate-700 text-sm flex items-center gap-2">
                                        <span className={`text-blue-600 transition-transform duration-150 ${expandedProjects[emp._id]?.[idx] ? "rotate-90" : ""}`}>
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                                        {p.projectName}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <span className="font-mono font-semibold text-slate-700 text-sm">{p.totalTime}</span>
                                      </td>
                                    </tr>

                                    {expandedProjects[emp._id]?.[idx] && (
                                      <tr>
                                        <td colSpan="2" className="px-4 pb-3 pt-1 bg-slate-50">
                                          <div className="ml-6 rounded-xl border border-slate-200 overflow-hidden bg-white">
                                            <table className="w-full table-fixed text-sm">
                                              <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                  <th className="w-1/2 text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Task</th>
                                                  {p.tasks?.[0]?.date && <th className="w-1/4 text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>}
                                                  <th className="text-right py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Time</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-50">
                                                {p.tasks?.map((task, ti) => (
                                                  <tr key={ti} className="hover:bg-blue-50/40 transition-colors">
                                                    <td className="py-2.5 px-4 font-medium text-slate-800">{task.description}</td>
                                                    {task.date && <td className="py-2.5 px-4 text-slate-500">{new Date(task.date).toLocaleDateString()}</td>}
                                                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-700">{task.time}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                ))}
                                {detailsData[emp._id]?.length === 0 && (
                                  <tr>
                                    <td colSpan="2" className="text-center py-6 text-slate-400 text-sm">No project data for this period</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-sm">No employees reporting to you</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PROJECT SECTION ────────────────────────────────────────── */}
        {showProjectSection && (
          <div className={cardCls}>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-800 to-blue-700">
              <div>
                <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-0.5">Project Analytics</p>
                <h3 className="text-xl font-bold text-white">Project-wise Employee Work</h3>
              </div>
              <button onClick={handleProjectExpandAll} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 transition-colors duration-150">
                {projectExpandAll ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>Collapse All</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>Expand All</>
                )}
              </button>
            </div>

            {/* Filters row */}
            <div className="px-6 py-4 flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</label>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className={selectCls}>
                <option value="">Select a project…</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.project_name}</option>
                ))}
              </select>

              <div className="h-5 w-px bg-slate-200 mx-1" />

              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Period</label>
              <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className={selectCls}>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom</option>
              </select>
              {projectFilter === "custom" && (
                <div className="flex gap-2">
                  <input type="date" value={projectFromDate} onChange={(e) => setProjectFromDate(e.target.value)} className={inputCls} />
                  <input type="date" value={projectToDate} onChange={(e) => setProjectToDate(e.target.value)} className={inputCls} />
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className={`${thCls} text-left w-12`}>#</th>
                    <th className={`${thCls} text-left`}>Employee</th>
                    <th className={`${thCls} text-center`}>Time Worked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectEmployees.map((emp, i) => (
                    <>
                      <tr
                        key={emp._id}
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                        onClick={() => toggleProjectRow(emp._id)}
                      >
                        <td className={`${tdCls} text-slate-400 font-medium`}>{i + 1}</td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {emp.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{emp.name}</span>
                          </div>
                        </td>
                        <td className={`${tdCls} text-center`}>
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm border border-blue-100">
                              {formatTime(emp.totalTime)}
                            </span>
                            <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                              {projectExpandedRows[emp._id] ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {projectExpandedRows[emp._id] && (
                        <tr className="bg-slate-50/80">
                          <td colSpan="3" className="px-10 py-5">
                            <div className={`${cardCls} border-blue-100`}>
                              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Projects</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleProjectSectionExpandAll(emp._id, projectDetailsData[emp._id]?.length || 0); }}
                                  className={btnGhost}
                                >
                                  {employeeProjectExpandAll[emp._id] ? "Collapse All" : "Expand All"}
                                </button>
                              </div>
                              <table className="w-full">
                                <thead className="bg-white border-b border-slate-100">
                                  <tr>
                                    <th className={`${thCls} text-left`}>Project</th>
                                    <th className={`${thCls} text-right`}>Time</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                  {projectDetailsData[emp._id]?.map((p, idx) => (
                                    <>
                                      <tr
                                        key={idx}
                                        className="cursor-pointer hover:bg-blue-50/60 transition-colors"
                                        onClick={() => toggleProjectInsideProjectSection(emp._id, idx)}
                                      >
                                        <td className="px-4 py-3 font-semibold text-slate-700 text-sm flex items-center gap-2">
                                          <span className={`text-blue-600 transition-transform duration-150 ${projectExpandedProjects[emp._id]?.[idx] ? "rotate-90" : ""}`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                          </span>
                                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                                          {p.projectName}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                          <span className="font-mono font-semibold text-slate-700 text-sm">{p.totalTime}</span>
                                        </td>
                                      </tr>

                                      {projectExpandedProjects[emp._id]?.[idx] && (
                                        <tr>
                                          <td colSpan="2" className="px-4 pb-3 pt-1 bg-slate-50">
                                            <div className="ml-6 rounded-xl border border-slate-200 overflow-hidden bg-white">
                                              <table className="w-full table-fixed text-sm">
                                                <thead>
                                                  <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="w-1/2 text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Task</th>
                                                    {p.tasks?.[0]?.date && <th className="w-1/4 text-left py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>}
                                                    <th className="text-right py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Time</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                  {p.tasks?.map((task, ti) => (
                                                    <tr key={ti} className="hover:bg-blue-50/40 transition-colors">
                                                      <td className="py-2.5 px-4 font-medium text-slate-800">{task.description}</td>
                                                      {task.date && <td className="py-2.5 px-4 text-slate-500">{new Date(task.date).toLocaleDateString()}</td>}
                                                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-700">{task.time}</td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  {projectEmployees.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-12 text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          <span className="text-sm">{selectedProject ? "No employees found for this project" : "Select a project to view employees"}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManagerDashboard;