const mongoose = require("mongoose");
const User = require("../models/User");
const Timesheet = require("../models/Timesheet");
const getDateRange = (filter, from, to) => {
  const now = new Date();
  let start, end;

  switch (filter) {
    case "day":
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      break;

    case "week":
      start = new Date();
      start.setDate(start.getDate() - 7);
      end = new Date();
      break;

    case "month":
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      end = new Date();
      break;

    case "custom":
      start = new Date(from);
      end = new Date(to);
      break;

    default:
      start = new Date(0);
      end = new Date();
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

    const data = await Timesheet.aggregate([
      {
        $match: {
          start_time: { $gte: start },
          end_time: { $lte: end }
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
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================
   2️⃣ EMPLOYEE → PROJECT DETAILS
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
          start_time: { $gte: start },
          end_time: { $lte: end }
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
      { $unwind: "$project" }
    ]);

    res.status(200).json({ success: true, data });
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
          start_time: { $gte: start },
          end_time: { $lte: end }
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

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getUsersTimeSummary,
  getEmployeeProjectDetails,
  getAllUsersDetailedView
};
