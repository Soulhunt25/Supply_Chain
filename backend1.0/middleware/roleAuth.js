const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: No user role found" });
    }

    if (allowedRoles.includes(req.user.role)) {
      next(); // Proceed to the next middleware
    } else {
      res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
  };
};

module.exports = roleAuth;
