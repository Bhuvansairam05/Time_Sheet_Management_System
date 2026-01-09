import AddUserModal from "./AddUserModal.jsx";
import { useState, useEffect } from "react";
import Loader from './Loader.jsx';
import toast from "react-hot-toast";
function Employees() {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [users, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleAddUser = async (userData) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/admin/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
            const result = await response.json();
            if (response.ok) {
                setShowAddUserModal(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server not found");
        }
        finally {
            setLoading(false);
        }
    };
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
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Employees</h2>

                    <button
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                        onClick={() => setShowAddUserModal(true)}
                    >
                        + Add User
                    </button>
                </div>

                {/* Employees Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">S.No</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Is Manager</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">View Sheet</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Edit</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Delete</th>
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

                                            

                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                                    onClick={() => navigate(`/admin/user/${u._id}`)}
                                                >
                                                    View Sheet
                                                </button>
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                                                    onClick={() => editHandler(u)}
                                                >
                                                    Edit
                                                </button>
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                                    onClick={() => deleteHandler(u._id)}
                                                >
                                                    Delete
                                                </button>
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

                <AddUserModal
                    isOpen={showAddUserModal}
                    onClose={() => setShowAddUserModal(false)}
                    onSubmit={handleAddUser}
                />
            </div>
        </>
    );
}
export default Employees;