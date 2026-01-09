const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try{ 
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      role: "employee",
      is_manager: false,
    });
  }

  const jwtToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    token: jwtToken,
    user,
  });
}
catch(Exception){
  return res.status(500).json("500 Server not found");
}
};

const loginUser = async (req, res) => {
  try{ 
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No existing user"
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  if(user.role=="admin"){
    const users = await User.find({role:"employee"});
    return res.status(200).json({
      success:true,
      message:"Login successful",
      token,
      user
    })
  }
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_manager: user.is_manager
    }
  });
  }
  catch(Exception){
    return res.status(500).json("500 server not found");
  }
};
const getUser = async (req, res) => {
  try{ 
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    success: true,
    response: user
  });
}
catch(Exception){
  return res.status(500).json({message:"500 server not found"});
}
};

const logoutUser = async (req, res) => {
  try{ 
  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
}
catch(Exception){
  return res.status(500).json({message:"500 server not found"});
}
}
const getEmployees = async (req,res)=>{
  try{
  const employees = await User.find({role:"employee"}).select("-password").lean();
  if(!employees){
    return res.status(404).json({message:"No employees in organisation"});
  }
  return res.status(200).json({
    success:true,
    data:employees
  });
}
catch(Exception){
  return res.status(500).json({message:"500 server not found"});
}
}
module.exports = { loginUser, getUser, logoutUser,googleLogin,getEmployees};