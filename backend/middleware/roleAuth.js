/*const roleAuth = (allowedRoles) => {
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
*/
const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    // Check if the user object exists and has a valid role
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: No user role found" });
    }

    const userRole = req.user.role;

    // Check if the user's role is allowed
    if (allowedRoles.includes(userRole)) {
      next(); // Proceed to the next middleware
    } else {
      res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
  };
};

module.exports = roleAuth;
