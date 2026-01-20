const isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }
  next();
};

module.exports = isManager;