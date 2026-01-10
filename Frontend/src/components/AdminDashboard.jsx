import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useState } from 'react';
import Loader from './Loader.jsx';
import toast from "react-hot-toast";
function AdminDashboard() {  
    const [loading, setLoading] = useState(false);
  const projectTimeData = [
    { name: 'E-Commerce Website', hours: 245 },
    { name: 'Mobile App Development', hours: 189 },
    { name: 'CRM System', hours: 156 },
    { name: 'Marketing Campaign', hours: 98 },
    { name: 'Database Migration', hours: 134 }
  ];
  const weeklyTrendData = [
    { day: 'Mon', hours: 45 },
    { day: 'Tue', hours: 52 },
    { day: 'Wed', hours: 48 },
    { day: 'Thu', hours: 61 },
    { day: 'Fri', hours: 55 },
    { day: 'Sat', hours: 28 },
    { day: 'Sun', hours: 15 }
  ];

  const stats = [
    { title: 'Total Projects', value: '24', icon: '📊' },
    { title: 'Active Users', value: '156', icon: '👥' },
    { title: 'Hours This Week', value: '304', icon: '⏰' },
    { title: 'Pending Approvals', value: '12', icon: '📋' }
  ];

  const COLORS = ['#FF6B00', '#FF8C3A', '#FFB366', '#FFC999', '#FFDAB3'];

  return (
    <>
    {loading && <Loader />}
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">
            Time Spent per Project
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#FF6B00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">
            Project Time Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTimeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="hours"
                label
              >
                {projectTimeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Weekly Time Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#FF6B00"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;
