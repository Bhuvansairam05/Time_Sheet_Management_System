const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const app = express();

app.use(
  cors()
);
app.use(express.json());
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const timesheetRoutes = require("./routes/timesheetroute");

app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/timesheet",timesheetRoutes);
// Serve frontend build
const frontendPath = path.join(__dirname, "../../Frontend/dist");

app.use(express.static(frontendPath));

app.get("/:path(*)", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});

console.log(process.env.mongoDB_URI);
mongoose.connect(process.env.mongoDB_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(5000, () => console.log(" Server running on port https://localhost:5000"));
  })
  .catch((err) => console.error("MongoDB error:", err));