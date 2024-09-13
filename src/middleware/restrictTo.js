const restrictTo = (roles) => (req, res, next) => {
  const { role_id } = req.user;
  // console.log("role:", role_id);
  if (!roles.includes(role_id)) {
    return res.status(403).json({
      status: false,
      message: "You are not allowed to perform this action",
      data: {},
    });
  }
  return next();
};

module.exports = restrictTo;
