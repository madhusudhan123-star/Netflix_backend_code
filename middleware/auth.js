const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyTokenExpiration(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token has expired
        return res.status(401).json({ status: "error", message: 'Token has expired' });
      } else if (err.name === 'JsonWebTokenError') {
        // Invalid token
        return res.status(403).json({ status: "error", message: 'Invalid token' });
      } else {
        // Other errors
        return res.status(403).json({ status: "error", message: err.message });
      }
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyTokenExpiration;