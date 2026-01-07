const User = require("../models/User");
const bcrypt = require("bcryptjs");


const addUser = async (req, res) => {
  const { name, email, password, role, status, is_manager } = req.body;

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
    is_manager
  });

  res.status(201).json({
    success: true,
    message: "User added successfully"
  });
};
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, role, status, is_manager } = req.body;

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

  // If password is updated, hash it again
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully"
  });
};
const removeUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "User removed successfully"
  });
};

module.exports = { addUser, updateUser, removeUser };
