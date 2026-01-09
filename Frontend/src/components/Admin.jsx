import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LogoutConfirmModal from './LogoutConfirmModal.jsx';
import logo from '../assets/Logo_remove.png';
import { useLocation } from "react-router-dom";
import AddUserModal from "./AddUserModal";

function Admin() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const { state } = useLocation();

    const user = state?.user;
    const users = state?.users;
    // Sample data for project time tracking
    const projectTimeData = [
        { name: 'E-Commerce Website', hours: 245, color: '#FF6B00' },
        { name: 'Mobile App Development', hours: 189, color: '#FF8C3A' },
        { name: 'CRM System', hours: 156, color: '#FFB366' },
        { name: 'Marketing Campaign', hours: 98, color: '#FFC999' },
        { name: 'Database Migration', hours: 134, color: '#FFDAB3' }
    ];

    // Data for weekly trend
    const weeklyTrendData = [
        { day: 'Mon', hours: 45 },
        { day: 'Tue', hours: 52 },
        { day: 'Wed', hours: 48 },
        { day: 'Thu', hours: 61 },
        { day: 'Fri', hours: 55 },
        { day: 'Sat', hours: 28 },
        { day: 'Sun', hours: 15 }
    ];

    // Summary statistics
    const stats = [
        { title: 'Total Projects', value: '24', icon: '📊', color: 'bg-orange-100', textColor: 'text-orange-600' },
        { title: 'Active Users', value: '156', icon: '👥', color: 'bg-blue-100', textColor: 'text-blue-600' },
        { title: 'Hours This Week', value: '304', icon: '⏰', color: 'bg-green-100', textColor: 'text-green-600' },
        { title: 'Pending Approvals', value: '12', icon: '📋', color: 'bg-yellow-100', textColor: 'text-yellow-600' }
    ];

    const COLORS = ['#FF6B00', '#FF8C3A', '#FFB366', '#FFC999', '#FFDAB3'];

    const handleLogout = () => {
        setShowLogoutModal(true);
    };
    const confirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setShowLogoutModal(false);
        navigate("/");
    }
   const handleAddUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/admin/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        status: userData.status,
        is_manager: userData.is_manager,
        reporting_to: userData.reporting_to || null,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("User added successfully:", result);

      // OPTIONAL (later you can refetch users)
      // setUsers((prev) => [...prev, result.user]);

      setShowAddUserModal(false);
    } else {
      console.error("Failed to add user:", result.message);
      alert(result.message || "Failed to add user");
    }
  } catch (error) {
    console.error("Error adding user:", error);
    alert("Something went wrong while adding user");
  }
};



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt="TimeTrack Pro Logo"
                                className="h-7 w-auto object-contain"
                            />
                            <h1 className="text-2xl font-bold text-orange-600">
                                TimeTrack Pro
                            </h1>
                            <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                                Admin
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'dashboard'
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'users'
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                                    }`}
                            >
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'projects'
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                                    }`}
                            >
                                Projects
                            </button>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-200">
                    <div className="flex justify-around py-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-3 py-2 text-sm font-medium ${activeTab === 'dashboard' ? 'text-orange-600' : 'text-gray-700'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-3 py-2 text-sm font-medium ${activeTab === 'users' ? 'text-orange-600' : 'text-gray-700'
                                }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-3 py-2 text-sm font-medium ${activeTab === 'projects' ? 'text-orange-600' : 'text-gray-700'
                                }`}
                        >
                            Projects
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} p-4 rounded-full`}>
                                            <span className="text-3xl">{stat.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Bar Chart - Project Time Tracking */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Time Spent per Project (Hours)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={projectTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="hours" fill="#FF6B00" name="Hours" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie Chart - Project Distribution */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Time Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={projectTimeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="hours"
                                        >
                                            {projectTimeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Weekly Trend Line Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Time Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={weeklyTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="hours" stroke="#FF6B00" strokeWidth={2} name="Hours" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">E-Commerce Website</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.5</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mobile App Development</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.0</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CRM System</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mike Johnson</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.5</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Users</h2>

                            <button
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                                onClick={() => setShowAddUserModal(true)}
                            >
                                + Add User
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">S.No</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Is Manager</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">View Sheet</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {users && users.length > 0 ? (
                                        users.map((u, index) => {
                                            const status = "not_in_project"; // temporary

                                            return (
                                                <tr key={u._id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 text-sm text-left align-top">{index + 1}</td>

                                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 text-left align-top">
                                                        {u.name}
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-left align-top">
                                                        {u.is_manager ? (
                                                            <span className="text-green-600 font-semibold">Yes</span>
                                                        ) : (
                                                            <span className="text-gray-600">No</span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-left align-top">
                                                        {status === "in_project" ? (
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                                                In Project
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                                Not In Project
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 ">
                                                        <button
                                                            className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                                            onClick={() => navigate(`/admin/user/${u._id}`)}
                                                        >
                                                            View Sheet
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6 text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects Management</h2>
                        <p className="text-gray-600">Projects management section will be implemented here.</p>
                    </div>
                )}
            </main>
            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
             <AddUserModal
  isOpen={showAddUserModal}
  onClose={() => setShowAddUserModal(false)}
  onSubmit={handleAddUser}
/>
        </div>
       
    );
    

}
export default Admin;