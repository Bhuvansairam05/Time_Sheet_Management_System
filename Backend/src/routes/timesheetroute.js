const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isManager = require("../middleware/isManager");
const {
    getUsersTimeSummary,
    getEmployeeProjectDetails,
    getAllUsersDetailedView,
    getAdminDashboardData,
    addTimeSheet,
    getManagerEmployeesTimeSummary,
    getManagerEmployeeProjectDetails
} = require("../controllers/timesheetController");
const router = express.Router();
router.get("/dashboard", authMiddleware, getAdminDashboardData);
router.get("/summary", authMiddleware, getUsersTimeSummary);
router.get("/employee/:employeeId", authMiddleware, getEmployeeProjectDetails);
router.get("/details", authMiddleware, getAllUsersDetailedView);
router.post("/addTimesheet", authMiddleware, addTimeSheet);
router.get("/manager/summary", (req, res, next) => {
    console.log("🔥 Route hit: /manager/time-summary");
    next();
}, authMiddleware, isManager, getManagerEmployeesTimeSummary);
router.get("/manager/employee/:employeeId", authMiddleware, isManager, getManagerEmployeeProjectDetails);
module.exports = router;