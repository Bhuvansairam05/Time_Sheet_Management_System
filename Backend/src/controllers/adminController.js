const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");
const addUser = async (req, res) => {
  try {
    const { name, email, password, role, is_manager } = req.body;
    const status = "not_in_project";
    let reporting_to = null;
    if (is_manager) {
      reporting_to = "695e5993d4b364c1748b68cb";
    }
    else {
      reporting_to = req.body.reporting_to;
    }
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
      is_manager,
      reporting_to
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
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, role, status, is_manager } = req.body;
    let reporting_to = null;
    if (is_manager) {
      reporting_to = "695e5993d4b364c1748b68cb";
    }
    else {
      reporting_to = req.body.reporting_to;
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    if (typeof is_manager === "boolean") user.is_manager = is_manager;
    if (reporting_to) user.reporting_to = reporting_to;

    // If password is updated, hash it again
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully"
    });
  }
  catch (Exception) {
    return res.status(500).json({ message: "500 server not found" });
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
    if (!manager.is_manager) {
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
const getProjects = async(req,res)=>{
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
const updateProject = async (req, res) => { }
module.exports = { addUser, updateUser, removeUser, getProjects, addProject, deleteProject, updateProject, endProject };