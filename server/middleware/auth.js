const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

// Utility function to verify JWT token
const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const authenticateJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const user = await verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized: Invalid token' : 'Forbidden: Token no longer valid';
      res.status(403).json({ error: message });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
};

module.exports = {
  authenticateJwt
};