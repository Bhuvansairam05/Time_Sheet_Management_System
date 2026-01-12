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
    const handleAddUser = async (userData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/admin/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                setShowAddUserModal(false);
            } else {
                toast.error(result.message);
            }
        } catch (Exception) {
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

            const result = await response.json();

            if (response.ok) {
                toast.success("User updated successfully");

                // 🔥 Update UI instantly (no refetch)
                setEmployees((prev) =>
                    prev.map((u) =>
                        u._id === userId ? { ...u, ...updatedData } : u
                    )
                );

                setManagers((prev) =>
                    updatedData.is_manager
                        ? [...prev.filter((m) => m._id !== userId), { ...updatedData, _id: userId }]
                        : prev.filter((m) => m._id !== userId)
                );

                setShowEditModal(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server not reachable");
        } finally {
            setLoading(false);
        }
    };
    const deleteHandler = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/admin/removeUser/${id}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            );
            if (response.ok) {
                toast.success("Employee deleted successfully");
                setEmployees(prev => prev.filter(u => u._id !== id));
                setManagers(prev => prev.filter(u => u._id !== id));
            }
        }

        catch (Exception) {
            toast.error("500 server not found")
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/auth/getEmployees",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setEmployees(data.data);
                    setManagers(data.data.filter((u) => u.is_manager)); // ⭐ KEY
                }
            } catch (error) {
                toast.error("Error while fetching users");
            }
            finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [showAddUserModal]);
    return (
        <>
            {loading && <Loader />}

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Employees</h2>

                    <button
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                        onClick={() => setShowAddUserModal(true)}
                    >
                        + Add User
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">S.No</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Is Manager</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                                    Time Worked
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                                    Changes
                                </th>
                            </tr>
                        </thead>


                        <tbody className="divide-y divide-gray-200">
                            {users && users.length > 0 ? (
                                users.map((u, index) => {
                                    const status = "not_in_project"; // temporary

                                    return (
                                        <tr key={u._id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 text-sm">{index + 1}</td>

                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                {u.name}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                {u.is_manager ? (
                                                    <span className="text-green-600 font-semibold">Yes</span>
                                                ) : (
                                                    <span className="text-gray-600">No</span>
                                                )}
                                            </td>

                                            {/* 🕒 Time Worked */}
                                            <td className="px-4 py-3 text-center text-sm text-gray-500">
                                                --:--
                                            </td>

                                            {/* ✏️🗑️ Changes */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-5">
                                                    <button
                                                        title="Edit"
                                                        className=" text-green-600 hover:text-green-800"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        <FaEdit className="text-2xl"/>
                                                    </button>

                                                    <button
                                                        title="Delete"
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => deleteHandler(u._id)}
                                                    >
                                                        <FaTrash className="text-xl"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <EditUserModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    user={selectedUser}
                    managers={managers}
                    onUpdate={(updatedData) => {
                        updateHandler(selectedUser._id, updatedData)
                    }}
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