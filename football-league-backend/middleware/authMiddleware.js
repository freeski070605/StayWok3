const jwt = require('jsonwebtoken');


// Middleware to protect routes
function protect(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
  // console.log('Authorization Header:', req.headers.authorization);
  // console.log('Token:', token);

  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token,  process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded); // Log decoded token
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    console.log('Invalid token');
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to check for admin role
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }
  next();
}

module.exports = { protect, adminOnly };
