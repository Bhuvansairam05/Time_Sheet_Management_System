const User = require("../models/User");
const bcrypt = require("bcryptjs");
const addUser = async (req, res) => {
  try{
  const { name, email, password, role, is_manager} = req.body;
  const status = "not_in_project";
  let reporting_to = null;
  if(is_manager){
    reporting_to = "695e5993d4b364c1748b68cb";
  }
  else{
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
catch(Exception){
  return res.status(500).json({message:"500 server not found"});
}
};
const updateUser = async (req, res) => {
  try{
  const { userId } = req.params;
  const { name, email, password, role, status, is_manager} = req.body;
  let reporting_to = null;
  if(is_manager){
    reporting_to = "695e5993d4b364c1748b68cb";
  }
  else{
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
  if(reporting_to) user.reporting_to = reporting_to;

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
catch(Exception){
  return res.status(500).json({message:"500 server not found"});
}
};
const removeUser = async (req, res) => {
  try{
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
catch(Exception){
  return res.status(500).json({message:"500 server not found"});
}
};
module.exports = { addUser, updateUser, removeUser };