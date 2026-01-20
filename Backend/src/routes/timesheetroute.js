const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getUsersTimeSummary,
    getEmployeeProjectDetails,
    getAllUsersDetailedView
} = require("../controllers/timesheetController");
const router = express.Router();
router.get("/summary", authMiddleware, getUsersTimeSummary);
router.get("/employee/:employeeId", authMiddleware, getEmployeeProjectDetails);
router.get("/details", authMiddleware, getAllUsersDetailedView);
module.exports = router;