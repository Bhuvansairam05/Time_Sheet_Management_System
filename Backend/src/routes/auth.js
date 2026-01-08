const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {loginUser, getUser,logoutUser} = require("../controllers/authController.js");
const router = express.Router();
router.post("/login",loginUser);
router.get("/getUser/:userId", authenticate, getUser);
router.delete("/logout",logoutUser);
module.exports = router;