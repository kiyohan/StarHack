const jwt = require('jsonwebtoken');
require('dotenv').config();

// This function will be used to protect routes
module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Add the user payload to the request object
    next(); // Move on to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};