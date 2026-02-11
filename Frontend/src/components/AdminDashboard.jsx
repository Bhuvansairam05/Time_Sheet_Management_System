import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useEffect, useState } from "react";
import Loader from "./Loader.jsx";
import toast from "react-hot-toast";
function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [projectTimeData, setProjectTimeData] = useState([]);
  const [weeklyTrendData, setWeeklyTrendData] = useState([]);
  const COLORS = ["#FF6B00", "#FF8C3A", "#FFB366", "#FFC999", "#FFDAB3"];
  useEffect(() => {
    fetchDashboardData();
  }, []);
const normalizeWeekData = (data = []) => {
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return week.map((d) => {
    const found = data.find((item) => item.day === d);
    return {
      day: d,
      hours: found ? found.hours : 0,
    };
  });
};
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/timesheet/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      setStats([
        { title: "Total Projects", value: data.stats.totalProjects, icon: "📊" },
        { title: "Active Users", value: data.stats.activeUsers, icon: "👥" },
        { title: "Hours This Week", value: data.stats.hoursThisWeek, icon: "⏰" },
      ]);

      setProjectTimeData(data.projectTimeData || []);
      setWeeklyTrendData(normalizeWeekData(data.weeklyTrendData));

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Time Spent per Project
            </h3>
            {projectTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#FF6B00" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No project data available for this week
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Project Time Distribution
            </h3>

            {projectTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectTimeData}
                    dataKey="hours"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {projectTimeData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No data to display
              </p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">
            Weekly Time Trend
          </h3>

          {weeklyTrendData.length > 0 ? (
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
          ) : (
            <p className="text-center text-gray-500">
              No weekly data available
            </p>
          )}
        </div>
      </div>
    </>
  );
}
export default AdminDashboard;