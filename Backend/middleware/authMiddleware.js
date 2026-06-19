const AppError = require('../utils/appError');
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

// Middleware to protect routes and verify JWT
const protect = async (req, res, next) => {
  try {
    let token;
    
    // 1. Get token from authorization headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return next(err); // Centralized error handler will intercept JWT errors
    }

    // 3. Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access based on roles

module.exports = protect;
