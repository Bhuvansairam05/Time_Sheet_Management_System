import AddUserModal from "./AddUserModal.jsx";
import { useState, useEffect } from "react";
import Loader from "./Loader.jsx";
import toast from "react-hot-toast";
import EditUserModal from "./EditUserModal.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import TransferManagerModal from "./TransferManagerModal.jsx";
function Employees() {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [users, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [managerToTransfer, setManagerToTransfer] = useState(null);
    const [managerProjects, setManagerProjects] = useState([]);
    const [pendingAction, setPendingAction] = useState(null);
    const [pendingUpdateData, setPendingUpdateData] = useState(null);
    const [filter, setFilter] = useState("week");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [expandedRows, setExpandedRows] = useState({});
    const [expandAll, setExpandAll] = useState(false);
    const [detailsData, setDetailsData] = useState({});
    const [expandedProjects, setExpandedProjects] = useState({});
    const [employeeProjectExpandAll, setEmployeeProjectExpandAll] = useState({});

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
    const toggleProject = (userId, projectIndex) => {
        setExpandedProjects((prev) => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [projectIndex]: !prev[userId]?.[projectIndex],
            },
        }));
    };
    const handleEmployeeProjectExpandAll = (userId, totalProjects) => {
        const newState = !employeeProjectExpandAll[userId];

        // toggle button text state
        setEmployeeProjectExpandAll(prev => ({
            ...prev,
            [userId]: newState
        }));

        const expandedMap = {};
        for (let i = 0; i < totalProjects; i++) {
            expandedMap[i] = newState;
        }

        setExpandedProjects(prev => ({
            ...prev,
            [userId]: expandedMap
        }));
    };

    const fetchEmployeesWithTime = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            let timeUrl = `https://repressedly-hyperopic-rosario.ngrok-free.dev/api/timesheet/summary?filter=${filter}`;
            if (filter === "custom" && fromDate && toDate) {
                timeUrl += `&from=${fromDate}&to=${toDate}`;
            }

            const [usersRes, timeRes] = await Promise.all([
                fetch("https://repressedly-hyperopic-rosario.ngrok-free.dev/api/auth/getEmployees", {
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
            setManagers(merged.filter((u) => u.role === "manager"));
        } catch {
            toast.error("Error loading employees");
        } finally {
            setLoading(false);
        }
    };
    const actualDelete = async (id, name) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p>
                    Delete <b>{name}</b> ?
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                setLoading(true);
                                const token = localStorage.getItem("token");

                                await fetch(
                                    `https://repressedly-hyperopic-rosario.ngrok-free.dev/api/admin/removeUser/${id}`,
                                    {
                                        method: "DELETE",
                                        headers: { Authorization: `Bearer ${token}` },
                                    }
                                );

                                toast.success("User deleted");
                                fetchEmployeesWithTime();
                            } catch {
                                toast.error("Server error");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    useEffect(() => {
        fetchEmployeesWithTime();
    }, [filter, fromDate, toDate, showAddUserModal]);
    useEffect(() => {
        setDetailsData({});
        setExpandedRows({});
        setExpandAll(false);
        const refetchExpandedUsers = async () => {
            for (const userId of Object.keys(expandedRows)) {
                if (expandedRows[userId]) {
                    await fetchUserDetails(userId);
                }
            }
        };

        if (Object.keys(expandedRows).length > 0) {
            refetchExpandedUsers();
        }
    }, [filter, fromDate, toDate]);
    const fetchManagerProjects = async (managerId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://repressedly-hyperopic-rosario.ngrok-free.dev/api/projects/byManager/${managerId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            setManagerProjects(data.data || []);
        } catch {
            toast.error("Failed to load projects");
        }
    };
    const handleAddUser = async (userData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://repressedly-hyperopic-rosario.ngrok-free.dev/api/admin/addUser",
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
        const oldUser = users.find((u) => u._id === userId);

        if (oldUser.role === "manager" && updatedData.role !== "manager") {
            setManagerToTransfer(oldUser);
            setPendingAction("roleChange");
            setPendingUpdateData(updatedData);
            setShowTransferModal(true);
            return;
        }

        normalUpdate(userId, updatedData);
    };
    const normalUpdate = async (userId, updatedData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://repressedly-hyperopic-rosario.ngrok-free.dev/api/admin/updateUser/${userId}`,
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

    const handleTransferConfirm = async (newManagerId) => {
        try {
            const token = localStorage.getItem("token");

            await fetch(`https://repressedly-hyperopic-rosario.ngrok-free.dev/api/admin/transferResponsibilities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldManagerId: managerToTransfer._id,
                    newManagerId,
                }),
            });

            toast.success("Responsibilities transferred");

            setShowTransferModal(false);

            // 🎯 CONTINUE ORIGINAL ACTION
            if (pendingAction === "delete") {
                actualDelete(managerToTransfer._id, managerToTransfer.name);
            }

            if (pendingAction === "roleChange") {
                normalUpdate(managerToTransfer._id, pendingUpdateData);
            }

            // reset
            setPendingAction(null);
            setPendingUpdateData(null);

        } catch {
            toast.error("Transfer failed");
        }
    };
    const deleteHandler = (user) => {
        if (user.role === "manager") {
            setManagerToTransfer(user);
            setPendingAction("delete");
            setShowTransferModal(true);
            return;
        }

        actualDelete(user._id, user.name);
    };

    const fetchUserDetails = async (userId) => {

        try {
            const token = localStorage.getItem("token");

            let url = `https://repressedly-hyperopic-rosario.ngrok-free.dev/api/timesheet/employee/${userId}?filter=${filter}`;
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
                            {expandAll ? "Collapse All" : "Expand All"}
                        </button>


                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            onClick={() => setShowAddUserModal(true)}
                        >
                            + Add User
                        </button>
                    </div>
                </div>

                <table className="min-w-full border rounded-lg">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Is Manager</th>
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
                                    className="border-t hover:bg-blue-50 cursor-pointer"
                                    onClick={() => toggleRow(u._id)}
                                >
                                    <td className="px-4 py-3 text-center">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium text-center">
                                        {u.name}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {u.role === "manager" ? "Yes" : "No"}
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
                                                onClick={() => deleteHandler(u)}


                                            />
                                        </div>
                                    </td>
                                </tr>

                                {expandedRows[u._id] && (
                                    <tr className="bg-blue-50">
                                        <td colSpan="5" className="px-8 py-4">
                                            <table className="w-full border">
                                                <thead className="bg-blue-200">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left">Project</th>
                                                        <th className="px-3 py-2 text-right"><div className="flex items-center justify-end gap-2">
                                                            <span>Time</span>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEmployeeProjectExpandAll(
                                                                        u._id,
                                                                        detailsData[u._id]?.length || 0
                                                                    );
                                                                }}
                                                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                                                            >
                                                                {employeeProjectExpandAll[u._id] ? "Collapse All" : "Expand All"}
                                                            </button>
                                                        </div></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {detailsData[u._id]?.map((p, index) => (
                                                        <>
                                                            {/* Project Row */}
                                                            <tr
                                                                key={index}
                                                                className="cursor-pointer hover:bg-blue-100"
                                                                onClick={() => toggleProject(u._id, index)}
                                                            >
                                                                <td className="px-3 py-2 font-medium text-gray-800 text-left">
                                                                    {expandedProjects[u._id]?.[index] ? "▼ " : "▶ "}
                                                                    {p.projectName}
                                                                </td>
                                                                <td className="px-3 py-2 text-right font-semibold text-gray-700">
                                                                    {p.totalTime}
                                                                </td>
                                                            </tr>

                                                            {/* Tasks Row */}
                                                            {expandedProjects[u._id]?.[index] && (
                                                                <tr>
                                                                    <td colSpan="2" className="px-6 py-4 bg-blue-50">
                                                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

                                                                            {/* <table className="w-full table-fixed text-sm">
                                                                                <thead>
                                                                                    <tr className="border-b text-gray-600 text-xs uppercase tracking-wide">
                                                                                        <th className="w-1/2 text-left py-3 px-4">
                                                                                            Task
                                                                                        </th>

                                                                                        {p.tasks?.[0]?.date && (
                                                                                            <th className="w-1/4 text-left py-3 px-4">
                                                                                                Date
                                                                                            </th>
                                                                                        )}

                                                                                        <th className="px-3 py-2 text-right">
                                                                                            Time
                                                                                        </th>

                                                                                    </tr>
                                                                                </thead>

                                                                                <tbody>
                                                                                    {p.tasks?.map((task, tIndex) => (
                                                                                        <tr
                                                                                            key={tIndex}
                                                                                            className="border-b last:border-none hover:bg-blue-50 transition"
                                                                                        >
                                                                                            <td className="py-3 px-4 font-medium text-gray-800">
                                                                                                {task.description}
                                                                                            </td>

                                                                                            {task.date && (
                                                                                                <td className="py-3 px-4 text-gray-600">
                                                                                                    {new Date(task.date).toLocaleDateString()}
                                                                                                </td>
                                                                                            )}

                                                                                            <td className="py-3 px-4 text-right font-semibold text-gray-700">
                                                                                                {task.time}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table> */}
                                                                            <table className="w-full table-fixed text-sm">
                                                                                <thead>
                                                                                    <tr className="border-b text-gray-600 text-xs uppercase tracking-wide">
                                                                                        <th className="w-1/2 text-left py-3 px-6">Task</th>

                                                                                        <th className="w-1/4 text-left py-3 px-6">
                                                                                            Date
                                                                                        </th>

                                                                                        <th className="w-1/4 text-right py-3 px-6">
                                                                                            Time
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>

                                                                                <tbody>
                                                                                    {p.tasks?.map((task, i) => (
                                                                                        <tr
                                                                                            key={i}
                                                                                            className="border-b last:border-none hover:bg-blue-50 transition"
                                                                                        >
                                                                                            <td className="w-1/2 py-3 px-6 text-left font-medium text-gray-800">
                                                                                                {task.description}
                                                                                            </td>

                                                                                            <td className="w-1/4 py-3 px-6 text-left text-gray-600">
                                                                                                {task.date
                                                                                                    ? new Date(task.date).toLocaleDateString()
                                                                                                    : "-"}
                                                                                            </td>

                                                                                            <td className="w-1/4 py-3 px-6 text-right font-semibold text-gray-700">
                                                                                                {task.time}
                                                                                            </td>
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
                <TransferManagerModal
                    isOpen={showTransferModal}
                    onClose={() => setShowTransferModal(false)}
                    manager={managerToTransfer}
                    managers={managers}
                    projects={managerProjects}
                    onConfirm={handleTransferConfirm}
                />

            </div>
        </>
    );
}

export default Employees;