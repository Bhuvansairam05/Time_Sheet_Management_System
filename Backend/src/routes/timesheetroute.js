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
    getManagerEmployeeProjectDetails,
    getEmployeeTimesheet,
    getProjectsList,
    getFilteredTimesheet
} = require("../controllers/timesheetController");
const router = express.Router();
router.get("/dashboard", authMiddleware, getAdminDashboardData);
router.get("/summary", authMiddleware, getUsersTimeSummary);
router.get("/employee/:employeeId", authMiddleware, getEmployeeProjectDetails);
router.get("/details", authMiddleware, getAllUsersDetailedView);
router.post("/addTimesheet", addTimeSheet);
router.get("/manager/summary", authMiddleware,  getManagerEmployeesTimeSummary);
router.get("/manager/employee/:employeeId",  getManagerEmployeeProjectDetails);
router.get("/employeeTimesheet/:employeeId",getEmployeeTimesheet);
router.get("/projectsList",getProjectsList);
router.get("/filteredTimesheet", getFilteredTimesheet);
module.exports = router;