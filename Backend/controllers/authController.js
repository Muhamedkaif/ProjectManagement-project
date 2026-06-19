const authService = require('../services/authService');

class AuthController {
  register = async (req, res, next) => {
    try {
      const { name, email, password} = req.body;
      const data = await authService.registerUser({ name, email, password});
      
      res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await authService.loginUser({ email, password });
      
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      // req.user is already loaded by the 'protect' middleware
      res.status(200).json({
        status: 'success',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      // For standard stateless JWT, logging out is typically handled client-side 
      // by deleting the token. We'll return a success message here.
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully (please delete token on client side)'
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
