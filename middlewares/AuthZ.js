const authorize = (roles) => (req, res, next) => {
    console.log("req.user", req.user);
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};
export default authorize;
