function Employee(){
    return(<></>);
}
export default Employee

// import AddUserModal from "./AddUserModal.jsx";
// import { useState, useEffect } from "react";
// import Loader from "./Loader.jsx";
// import toast from "react-hot-toast";
// import EditUserModal from "./EditUserModal.jsx";
// import { FaEdit, FaTrash } from "react-icons/fa";

// function Employees() {
//     const [showAddUserModal, setShowAddUserModal] = useState(false);
//     const [users, setEmployees] = useState([]);
//     const [managers, setManagers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);

//     // ⏱ Time filter
//     const [filter, setFilter] = useState("week");

//     /* ===============================
//        UTILITY → ms to HH:MM
//     ================================ */
//     const formatTime = (ms = 0) => {
//         const totalMinutes = Math.floor(ms / 60000);
//         const hours = Math.floor(totalMinutes / 60);
//         const minutes = totalMinutes % 60;
//         return `${hours.toString().padStart(2, "0")}:${minutes
//             .toString()
//             .padStart(2, "0")}`;
//     };

//     /* ===============================
//        FETCH EMPLOYEES + TIME
//     ================================ */
//     const fetchEmployeesWithTime = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("token");

//             // 1️⃣ Fetch users
//             const usersRes = await fetch(
//                 "http://localhost:5000/api/auth/getEmployees",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const usersData = await usersRes.json();
//             if (!usersRes.ok) throw new Error("Failed to fetch users");

//             // 2️⃣ Fetch time summary
//             const timeRes = await fetch(
//                 `http://localhost:5000/api/timesheet/summary?filter=${filter}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const timeData = await timeRes.json();

//             // Map employeeId → time
//             const timeMap = {};
//             timeData?.data?.forEach((t) => {
//                 timeMap[t._id] = t.totalTime;
//             });

//             // Merge users + time
//             const merged = usersData.data.map((u) => ({
//                 ...u,
//                 timeWorked: timeMap[u._id] || 0,
//             }));

//             setEmployees(merged);
//             setManagers(merged.filter((u) => u.is_manager));
//         } catch (err) {
//             toast.error("Error loading employees");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeesWithTime();
//     }, [filter, showAddUserModal]);

//     /* ===============================
//        ADD / UPDATE / DELETE
//     ================================ */
//     const handleAddUser = async (userData) => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("token");

//             const response = await fetch(
//                 "http://localhost:5000/api/admin/addUser",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(userData),
//                 }
//             );

//             const result = await response.json();

//             if (response.ok) {
//                 setShowAddUserModal(false);
//                 toast.success("User added");
                // fetchEmployeesWithTime();
//             } else {
//                 toast.error(result.message);
//             }
//         } catch {
//             toast.error("Server not found");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateHandler = async (userId, updatedData) => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("token");

//             const response = await fetch(
//                 `http://localhost:5000/api/admin/updateUser/${userId}`,
//                 {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(updatedData),
//                 }
//             );

//             if (response.ok) {
//                 toast.success("User updated");
//                 setShowEditModal(false);
//                 fetchEmployeesWithTime();
//             }
//         } catch {
//             toast.error("Server error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteHandler = async (id) => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("token");

//             const response = await fetch(
//                 `http://localhost:5000/api/admin/removeUser/${id}`,
//                 {
//                     method: "DELETE",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (response.ok) {
//                 toast.success("User deleted");
//                 setEmployees((prev) => prev.filter((u) => u._id !== id));
//             }
//         } catch {
//             toast.error("Server error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             {loading && <Loader />}

//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold">Employees</h2>

//                     <div className="flex gap-3">
//                         {/* ⏱ FILTER */}
//                         <select
//                             value={filter}
//                             onChange={(e) => setFilter(e.target.value)}
//                             className="border rounded px-3 py-2"
//                         >
//                             <option value="day">Today</option>
//                             <option value="week">This Week</option>
//                             <option value="month">This Month</option>
//                         </select>

//                         <button
//                             className="bg-orange-600 text-white px-4 py-2 rounded-lg"
//                             onClick={() => setShowAddUserModal(true)}
//                         >
//                             + Add User
//                         </button>
//                     </div>
//                 </div>

//                 <table className="min-w-full border rounded-lg">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-4 py-3">S.No</th>
//                             <th className="px-4 py-3">Name</th>
//                             <th className="px-4 py-3">Is Manager</th>
//                             <th className="px-4 py-3 text-center">
//                                 Time Worked
//                             </th>
//                             <th className="px-4 py-3 text-center">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {users.length > 0 ? (
//                             users.map((u, i) => (
//                                 <tr key={u._id} className="border-t">
//                                     <td className="px-4 py-3">{i + 1}</td>
//                                     <td className="px-4 py-3 font-medium">
//                                         {u.name}
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         {u.is_manager ? "Yes" : "No"}
//                                     </td>
//                                     <td className="px-4 py-3 text-center">
//                                         {formatTime(u.timeWorked)}
//                                     </td>
//                                     <td className="px-4 py-3 text-center">
//                                         <div className="flex justify-center gap-4">
//                                             <FaEdit
//                                                 className="text-green-600 cursor-pointer"
//                                                 onClick={() => {
//                                                     setSelectedUser(u);
//                                                     setShowEditModal(true);
//                                                 }}
//                                             />
//                                             <FaTrash
//                                                 className="text-red-600 cursor-pointer"
//                                                 onClick={() =>
//                                                     deleteHandler(u._id)
//                                                 }
//                                             />
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan="5"
//                                     className="text-center py-6"
//                                 >
//                                     No users found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>

//                 <EditUserModal
//                     isOpen={showEditModal}
//                     onClose={() => setShowEditModal(false)}
//                     user={selectedUser}
//                     managers={managers}
//                     onUpdate={(data) =>
//                         updateHandler(selectedUser._id, data)
//                     }
//                 />

//                 <AddUserModal
//                     isOpen={showAddUserModal}
//                     onClose={() => setShowAddUserModal(false)}
//                     onSubmit={handleAddUser}
//                     managers={managers}
//                 />
//             </div>
//         </>
//     );
// }

// export default Employees;
