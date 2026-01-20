import AddUserModal from "./AddUserModal.jsx";
import { useState, useEffect } from "react";
import Loader from "./Loader.jsx";
import toast from "react-hot-toast";
import EditUserModal from "./EditUserModal.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";

function Employees() {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [users, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // ⏱ filters
    const [filter, setFilter] = useState("week");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // 🔽 expand logic
    const [expandedRows, setExpandedRows] = useState({});
    const [expandAll, setExpandAll] = useState(false);
    const [detailsData, setDetailsData] = useState({});

    /* ===============================
       UTILITY → ms to HH:MM
    ================================ */
    const formatTime = (ms = 0) => {
        const mins = Math.floor(ms / 60000);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
    };

    /* ===============================
       FETCH EMPLOYEES + TIME
    ================================ */
    const fetchEmployeesWithTime = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            let timeUrl = `http://localhost:5000/api/timesheet/summary?filter=${filter}`;
            if (filter === "custom" && fromDate && toDate) {
                timeUrl += `&from=${fromDate}&to=${toDate}`;
            }

            const [usersRes, timeRes] = await Promise.all([
                fetch("http://localhost:5000/api/auth/getEmployees", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(timeUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const usersData = await usersRes.json();
            const timeData = await timeRes.json();

            const timeMap = {};
            timeData?.data?.forEach((t) => {
                timeMap[t._id] = t.totalTime;
            });

            const merged = usersData.data.map((u) => ({
                ...u,
                timeWorked: timeMap[u._id] || 0,
            }));

            setEmployees(merged);
            setManagers(merged.filter((u) => u.is_manager));
        } catch {
            toast.error("Error loading employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesWithTime();
    }, [filter, fromDate, toDate, showAddUserModal]);

    /* ===============================
       ADD / UPDATE / DELETE
    ================================ */
    const handleAddUser = async (userData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/admin/addUser",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(userData),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success("User added");
                setShowAddUserModal(false);
                fetchEmployeesWithTime();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Server not found");
        } finally {
            setLoading(false);
        }
    };

    const updateHandler = async (userId, updatedData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/admin/updateUser/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (response.ok) {
                toast.success("User updated");
                setShowEditModal(false);
                fetchEmployeesWithTime();
            }
        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/admin/removeUser/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.ok) {
                toast.success("User deleted");
                setEmployees((prev) => prev.filter((u) => u._id !== id));
            }
        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };
    const fetchUserDetails = async (userId) => {
        if (detailsData[userId]) return;

        try {
            const token = localStorage.getItem("token");

            let url = `http://localhost:5000/api/timesheet/employee/${userId}?filter=${filter}`;
            if (filter === "custom" && fromDate && toDate) {
                url += `&from=${fromDate}&to=${toDate}`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setDetailsData((prev) => ({ ...prev, [userId]: data.data }));
        } catch {
            toast.error("Failed to load project details");
        }
    };

    const toggleRow = async (userId) => {
        await fetchUserDetails(userId);
        setExpandedRows((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const handleExpandAll = async () => {
        const newState = !expandAll;
        setExpandAll(newState);

        const map = {};
        for (const u of users) {
            map[u._id] = newState;
            await fetchUserDetails(u._id);
        }
        setExpandedRows(map);
    };

    return (
        <>
            {loading && <Loader />}

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Employees</h2>

                    <div className="flex gap-3">
                        <button
                            onClick={handleExpandAll}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Details
                        </button>

                        <button
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                            onClick={() => setShowAddUserModal(true)}
                        >
                            + Add User
                        </button>
                    </div>
                </div>

                <table className="min-w-full border rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Is Manager</th>

                            {/* ⏱ FILTER INSIDE COLUMN */}
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
                                                onChange={(e) =>
                                                    setFromDate(e.target.value)
                                                }
                                                className="border rounded px-1 text-xs"
                                            />
                                            <input
                                                type="date"
                                                value={toDate}
                                                onChange={(e) =>
                                                    setToDate(e.target.value)
                                                }
                                                className="border rounded px-1 text-xs"
                                            />
                                        </div>
                                    )}
                                </div>
                            </th>

                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u, i) => (
                            <>
                                <tr
                                    key={u._id}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => toggleRow(u._id)}
                                >
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {u.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.is_manager ? "Yes" : "No"}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {formatTime(u.timeWorked)}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex justify-center gap-4">
                                            <FaEdit
                                                className="text-green-600 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedUser(u);
                                                    setShowEditModal(true);
                                                }}
                                            />
                                            <FaTrash
                                                className="text-red-600 cursor-pointer"
                                                onClick={() =>
                                                    deleteHandler(u._id)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>

                                {expandedRows[u._id] && (
                                    <tr className="bg-gray-50">
                                        <td colSpan="5" className="px-8 py-4">
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
                                                    {detailsData[u._id]?.map((p, index) => (
                                                        <tr key={index}>
                                                            <td className="text-left">
                                                                {p.projectName}
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
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

                <EditUserModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    user={selectedUser}
                    managers={managers}
                    onUpdate={(data) =>
                        updateHandler(selectedUser._id, data)
                    }
                />

                <AddUserModal
                    isOpen={showAddUserModal}
                    onClose={() => setShowAddUserModal(false)}
                    onSubmit={handleAddUser}
                    managers={managers}
                />
            </div>
        </>
    );
}

export default Employees;
