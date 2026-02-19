const User = require("../models/User");
const Project = require("../models/Project");
const Timesheet = require("../models/Timesheet");
const bcrypt = require("bcryptjs");
const addUser = async (req, res) => {
  try {
    const { name, email, password, role, reporting_to } = req.body;

    const status = "not_in_project";

    const finalReportingTo = reporting_to || null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
      reporting_to: finalReportingTo
    });
    return res.status(201).json({
      success: true,
      message: "User added successfully"
    });
  }
  catch (Exception) {
    return res.status(500).json({ message: "500 server not found" });
  }
};
// const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { name, email, password, role, status, is_manager } = req.body;
//     let reporting_to = null;
//     if (is_manager) {
//       reporting_to = "695e5993d4b364c1748b68cb";
//     }
//     else {
//       reporting_to = req.body.reporting_to;
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }
//     // Update fields only if provided
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (role) user.role = role;
//     if (status) user.status = status;
//     if (typeof is_manager === "boolean") user.is_manager = is_manager;
//     if (reporting_to) user.reporting_to = reporting_to;

//     // If password is updated, hash it again
//     if (password) {
//       user.password = await bcrypt.hash(password, 10);
//     }

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully"
//     });
//   }
//   catch (Exception) {
//     return res.status(500).json({ message: "500 server not found" });
//   }
// };
const transferRespons = async (req, res) => {
  try {
    const { oldManagerId, newManagerId } = req.body;

    // basic validation
    if (!oldManagerId || !newManagerId) {
      return res.status(400).json({
        success: false,
        message: "Old and new manager required",
      });
    }

    if (oldManagerId === newManagerId) {
      return res.status(400).json({
        success: false,
        message: "Both managers cannot be same",
      });
    }

    // check managers exist
    const oldManager = await User.findById(oldManagerId);
    const newManager = await User.findById(newManagerId);

    if (!oldManager || !newManager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    /* ======================================
       1️⃣ TRANSFER PROJECTS
    ====================================== */
    await Project.updateMany(
      { manager_id: oldManagerId },
      { $set: { manager_id: newManagerId } }
    );

    /* ======================================
       2️⃣ TRANSFER EMPLOYEES
    ====================================== */
    await User.updateMany(
      { reporting_to: oldManagerId },
      { $set: { reporting_to: newManagerId } }
    );
    await Timesheet.updateMany(
      { manager_id: oldManagerId },   // find old manager records
      { $set: { manager_id: newManagerId } }  // assign new manager
    );
    /* ======================================
       3️⃣ TRANSFER TIMESHEETS
    ====================================== */
 
    return res.status(200).json({
      success: true,
      message: "Responsibilities transferred successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { transferRespons };
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, role, status, reporting_to } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Update normal fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    // 🎯 VALIDATION
    if (role === "employee" && !reporting_to) {
      return res.status(400).json({
        success: false,
        message: "Reporting manager is required for employees",
      });
    }

    // optional for others
    user.reporting_to = reporting_to || null;

    // password
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User removed successfully"
    });
  }
  catch (Exception) {
    return res.status(500).json({ message: "500 server not found" });
  }
};
const addProject = async (req, res) => {
  try {
    const { project_name, manager_id } = req.body;

    if (!project_name || !manager_id) {
      return res.status(400).json({
        message: "Project name and manager are required",
      });
    }

    // 🔍 Check if manager exists in User collection
    const manager = await User.findById(manager_id);

    if (!manager) {
      return res.status(404).json({
        message: "Manager does not exist",
      });
    }

    // (optional but recommended)
    if (!manager.role === "manager") {
      return res.status(400).json({
        message: "Selected user is not a manager",
      });
    }
    manager.status = "in_project";
    await manager.save();
    const project = await Project.create({
      project_name,
      manager_id,
      status: "inProgress",
      start_date: new Date(),
      end_date: null,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("manager_id", "name"); // only fetch manager name

    const formattedProjects = projects.map((project) => ({
      project_id: project._id,
      project_name: project.project_name,
      manager_id: project.manager_id?._id || null,
      manager_name: project.manager_id?.name || null,
    }));

    return res.status(200).json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const endProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.status === "Completed") {
      return res.status(400).json({
        message: "Project is already completed",
      });
    }

    project.status = "Completed";
    project.end_date = new Date();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project ended successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const deleteProject = async (req, res) => { }
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { project_name, manager_id } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update project name if provided
    if (project_name) {
      project.project_name = project_name;
    }

    // If manager is changing
    if (manager_id && manager_id !== project.manager_id.toString()) {

      const newManager = await User.findById(manager_id);
      if (!newManager) {
        return res.status(404).json({
          success: false,
          message: "New manager not found",
        });
      }

      const oldManagerId = project.manager_id;

      /* ===========================
         1️⃣ Update Project Manager
      =========================== */
      project.manager_id = manager_id;

      /* ===========================
         2️⃣ Update Timesheets
      =========================== */
      await Timesheet.updateMany(
        { project_id: projectId },
        { $set: { manager_id: manager_id } }
      );

      /* ===========================
         3️⃣ Update Old Manager Status
      =========================== */
      const oldManagerProjects = await Project.countDocuments({
        manager_id: oldManagerId,
      });

      if (oldManagerProjects <= 1) {
        await User.findByIdAndUpdate(oldManagerId, {
          status: "not_in_project",
        });
      }

      /* ===========================
         4️⃣ Update New Manager Status
      =========================== */
      await User.findByIdAndUpdate(manager_id, {
        status: "in_project",
      });
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
 }
module.exports = { addUser, transferRespons, updateUser, removeUser, getProjects, addProject, deleteProject, updateProject, endProject };