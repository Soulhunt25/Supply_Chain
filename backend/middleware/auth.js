/*const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // Ensure req.user is properly set
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
*/
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  //const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
  //if (!token) return res.status(403).json({ message: "Access Denied" });

  //jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //if (err) return res.status(403).json({ message: "Invalid Token" });
  //  req.user = user;
  //  next();
  //});
  next();
};

module.exports = { authenticateToken };