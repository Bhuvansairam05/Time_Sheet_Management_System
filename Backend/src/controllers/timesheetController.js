const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Timesheet = require("../models/Timesheet");
const getDateRange = (filter, from, to) => {
  let start, end;
  const now = new Date();

  switch (filter) {
    case "day":
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      break;

    case "week":
      start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end = new Date();
      break;

    case "month":
      start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end = new Date();
      break;

    case "custom":
      start = new Date(from);
      start.setHours(0, 0, 0, 0);
      end = new Date(to);
      end.setHours(23, 59, 59, 999);
      break;

    default:
      start = new Date(0);
      end = now;
  }

  return { start, end };
};
/* ===============================
   1️⃣ USERS + TOTAL TIME
================================ */
const getUsersTimeSummary = async (req, res) => {
  try {
    const { filter, from, to } = req.query;
    const { start, end } = getDateRange(filter, from, to);

    const users = await User.find({}, { password: 0 });

    const timeData = await Timesheet.aggregate([
      {
        $match: {
          start_time: { $lt: end },
          end_time: { $gt: start }
        }
      },
      {
        $project: {
          employee_id: 1,
          duration: { $subtract: ["$end_time", "$start_time"] }
        }
      },
      {
        $group: {
          _id: "$employee_id",
          totalTime: { $sum: "$duration" }
        }
      }
    ]);

    const timeMap = {};
    timeData.forEach(t => {
      timeMap[t._id.toString()] = t.totalTime;
    });

    const result = users.map(u => ({
      _id: u._id,
      name: u.name,
      is_manager: u.is_manager,
      totalTime: timeMap[u._id.toString()] || 0
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
/* ===============================
   2️⃣ EMPLOYEE → PROJECT DETAILSAXZ
================================ */
const getEmployeeProjectDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { filter, from, to } = req.query;
    const { start, end } = getDateRange(filter, from, to);

    const data = await Timesheet.aggregate([
      {
        $match: {
          employee_id: new mongoose.Types.ObjectId(employeeId),
          start_time: { $lt: end },
          end_time: { $gt: start }
        }
      },
      {
        $project: {
          project_id: 1,
          duration: { $subtract: ["$end_time", "$start_time"] }
        }
      },
      {
        $group: {
          _id: "$project_id",
          totalTime: { $sum: "$duration" }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$project" },
      {
        $project: {
          _id: 0,
          projectName: "$project.project_name",
          totalTime: 1
        }
      }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
/* ===============================
   3️⃣ DETAILS VIEW (ALL USERS)
================================ */
const getAllUsersDetailedView = async (req, res) => {
  try {
    const { filter, from, to } = req.query;
    const { start, end } = getDateRange(filter, from, to);

    const data = await Timesheet.aggregate([
      {
        $match: {
          start_time: { $lt: end },
          end_time: { $gt: start }
        }
      },
      {
        $project: {
          employee_id: 1,
          project_id: 1,
          duration: { $subtract: ["$end_time", "$start_time"] }
        }
      },
      {
        $group: {
          _id: {
            employee: "$employee_id",
            project: "$project_id"
          },
          totalTime: { $sum: "$duration" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.employee",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id.project",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$employee" },
      { $unwind: "$project" }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getAdminDashboardData = async (req, res) => {
  try {
    /** ---------------- STATS ---------------- */

    // Total projects
    const totalProjects = await Project.countDocuments();

    // Active users (assuming status = "active")
    const activeUsers = await User.countDocuments({ role: "employee" });

    // Start & end of current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);

    // Hours this week
    const weeklyHoursAgg = await Timesheet.aggregate([
      {
        $match: {
          start_time: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        $project: {
          hours: {
            $divide: [
              { $subtract: ["$end_time", "$start_time"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" }
        }
      }
    ]);

    const hoursThisWeek = Math.round(weeklyHoursAgg[0]?.totalHours || 0);

    /** ---------------- TIME PER PROJECT ---------------- */

    const projectTimeData = await Timesheet.aggregate([
      {
        $project: {
          project_id: 1,
          hours: {
            $divide: [
              { $subtract: ["$end_time", "$start_time"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: "$project_id",
          totalHours: { $sum: "$hours" }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$project" },
      {
        $project: {
          _id: 0,
          name: "$project.project_name",
          hours: { $round: ["$totalHours", 0] }
        }
      }
    ]);

    /** ---------------- WEEKLY TREND ---------------- */

    const weeklyTrendData = await Timesheet.aggregate([
      {
        $project: {
          day: { $dayOfWeek: "$start_time" },
          hours: {
            $divide: [
              { $subtract: ["$end_time", "$start_time"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: "$day",
          hours: { $sum: "$hours" }
        }
      },
      {
        $project: {
          _id: 0,
          dayIndex: "$_id",
          hours: { $round: ["$hours", 0] }
        }
      },
      { $sort: { dayIndex: 1 } }
    ]);

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const formattedWeeklyTrend = weeklyTrendData.map(d => ({
      day: dayMap[d.dayIndex - 1],
      hours: d.hours
    }));

    /** ---------------- RESPONSE ---------------- */

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        activeUsers,
        hoursThisWeek
      },
      projectTimeData,
      weeklyTrendData: formattedWeeklyTrend
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data"
    });
  }
}
const addTimeSheet = async (req, res) => {
  try {
    const {
      project_id,
      manager_id,
      employee_id,
      start_time,
      end_time,
      description
    } = req.body;

    /* ---------------- VALIDATIONS ---------------- */

    if (!project_id || !employee_id || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be greater than start time"
      });
    }

    /* ---------------- CREATE TIMESHEET ---------------- */

    const newTimesheet = new Timesheet({
      project_id,
      manager_id,
      employee_id,
      start_time: start,
      end_time: end,
      description
    });

    await newTimesheet.save();

    /* ---------------- SUCCESS RESPONSE ---------------- */

    res.status(201).json({
      success: true,
      message: "Timesheet added successfully",
      data: newTimesheet
    });

  } catch (error) {
    console.error("Add Timesheet Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add timesheet"
    });
  }
}
const getManagerEmployeesTimeSummary = async (req, res) => {
  try {
    const managerId = req.user.userId;
    const { filter, from, to } = req.query;
    const { start, end } = getDateRange(filter, from, to);
    // 1️⃣ Get employees reporting to this manager
    const employees = await User.find(
      { reporting_to: managerId }
    );
    if (!employees.length) {
      return res.json({ success: true, data: [] });
    }
    const employeeIds = employees.map(e => e._id);
    // 2️⃣ Aggregate timesheets
    const timeData = await Timesheet.aggregate([
      {
        $match: {
          employee_id: { $in: employeeIds },
          start_time: { $lt: end },
          end_time: { $gt: start }
        }
      },
      {
        $project: {
          employee_id: 1,
          duration: { $subtract: ["$end_time", "$start_time"] }
        }
      },
      {
        $group: {
          _id: "$employee_id",
          totalTime: { $sum: "$duration" }
        }
      }
    ]);
    // 3️⃣ Merge employees + time
    const timeMap = {};
    timeData.forEach(t => {
      timeMap[t._id.toString()] = t.totalTime;
    });
    const result = employees.map(e => ({
      _id: e._id,
      name: e.name,
      timeWorked: timeMap[e._id.toString()] || 0
    }));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Manager summary error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch manager summary"
    });
  }
};
const getManagerEmployeeProjectDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { filter, from, to } = req.query;
    const { start, end } = getDateRange(filter, from, to);
    // 1️⃣ Security check (employee belongs to manager)
    const employee = await User.findOne({
      _id: employeeId
    });
    if (!employee) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }
    const data = await Timesheet.aggregate([
      {
        $match: {
          employee_id: employee._id,
          start_time: { $lt: end },
          end_time: { $gt: start }
        }
      },
      {
        $project: {
          project_id: 1,
          duration: { $subtract: ["$end_time", "$start_time"] }
        }
      },
      {
        $group: {
          _id: "$project_id",
          totalTime: { $sum: "$duration" }
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$project" },
      {
        $project: {
          _id: 0,
          projectName: "$project.project_name",
          totalTime: 1
        }
      }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getEmployeeTimesheet = async (req, res) => {
  try {
    const employeeId = new mongoose.Types.ObjectId(req.params.employeeId);

    const timesheets = await Timesheet.aggregate([
      // 1️⃣ Match employee (ObjectId match)
      {
        $match: {
          employee_id: employeeId
        }
      },

      // 2️⃣ Join project
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project"
        }
      },

      // 3️⃣ Convert array → object
      { $unwind: "$project" },

      // 4️⃣ Calculate duration
      {
        $addFields: {
          duration: {
            $round: [
              {
                $divide: [
                  { $subtract: ["$end_time", "$start_time"] },
                  1000 * 60 * 60
                ]
              },
              2
            ]
          }
        }
      },

      // 5️⃣ Final output
      {
        $project: {
          _id: 1,
          projectName: "$project.project_name", // ✅ FIXED
          description: 1,
          duration: 1,
          start_time: 1
        }
      },

      // 6️⃣ Sort
      {
        $sort: { start_time: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: timesheets.length,
      data: timesheets
    });

  } catch (error) {
    console.error("Get Employee Timesheet Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch timesheets"
    });
  }
};
const getProjectsList = async (req, res) => {
  try {
    const projects = await Project.find(
      {}, // no filter
      {
        _id: 1,
        project_name: 1,
        manager_id: 1
      }
    ).lean();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error("Get Projects List Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
};
const getFilteredTimesheet = async (req, res) => {
  try {
    const { type, employeeId, from, to } = req.query;

    const empId = new mongoose.Types.ObjectId(employeeId);

    let fromDate, toDate;
    const today = new Date();

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    if (type === "today") {
      fromDate = startOfToday;
      toDate = endOfToday;
    }

    else if (type === "week") {
      const day = today.getDay();
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);

      fromDate = new Date(today.getFullYear(), today.getMonth(), diffToMonday);
      toDate = endOfToday;
    }

    else if (type === "month") {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = endOfToday;
    }

    else if (type === "custom") {
      fromDate = new Date(from);
      toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
    }

    // ✅ SAME AGGREGATION + DATE FILTER
    const timesheets = await Timesheet.aggregate([
      {
        $match: {
          employee_id: empId,
          createdAt: { $gte: fromDate, $lte: toDate } // 🔥 important
        }
      },

      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project"
        }
      },

      { $unwind: "$project" },

      {
        $addFields: {
          duration: {
            $round: [
              {
                $divide: [
                  { $subtract: ["$end_time", "$start_time"] },
                  1000 * 60 * 60
                ]
              },
              2
            ]
          }
        }
      },

      {
        $project: {
          _id: 1,
          projectName: "$project.project_name",
          description: 1,
          duration: 1,
          start_time: 1
        }
      },

      { $sort: { start_time: -1 } }
    ]);

    // ✅ Summary
    const totalHours = timesheets.reduce((sum, t) => sum + t.duration, 0);

    res.status(200).json({
      success: true,
      data: {
        tasks: timesheets,
        summary: {
          totalHours: totalHours.toFixed(2),
          totalTasks: timesheets.length
        }
      }
    });

  } catch (error) {
    console.error("Filtered Timesheet Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered timesheets"
    });
  }
};


module.exports = {
  getUsersTimeSummary,
  getEmployeeProjectDetails,
  getAllUsersDetailedView,
  getAdminDashboardData,
  addTimeSheet,
  getManagerEmployeesTimeSummary,
  getManagerEmployeeProjectDetails,
  getEmployeeTimesheet,
  getProjectsList,
  getFilteredTimesheet
};