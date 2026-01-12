const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {addUser, removeUser, updateUser,getUsers} = require("../controllers/adminController");
const router = express.Router();
router.post("/addUser",authenticate, addUser);
router.put("/updateUser/:userId",authenticate,updateUser);
router.delete("/removeUser/:userId",authenticate,removeUser);
module.exports = router;