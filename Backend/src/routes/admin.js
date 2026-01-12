const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {addUser, removeUser, updateUser,getProjects,addProject,endProject} = require("../controllers/adminController");
const router = express.Router();
router.post("/addUser",authenticate, addUser);
router.put("/updateUser/:userId",authenticate,updateUser);
router.delete("/removeUser/:userId",authenticate,removeUser);
router.get("/getProjects",authenticate,getProjects);
router.post("/addProject",authenticate,addProject);
router.put("/endProject/:projectId",authenticate,endProject)
module.exports = router;