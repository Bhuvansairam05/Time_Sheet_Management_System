const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {loginUser, getUser} = require("../controllers/authController.js");
const router = express.Router();
router.post("/login",loginUser);
router.get("/getUser/:userId", authenticate, getUser);
module.exports = router;