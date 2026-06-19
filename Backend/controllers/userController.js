const userService = require("../services/userService");

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(
        req.user.id
      );

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(
        req.user.id,
        req.body
      );

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      await userService.deleteAccount(
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();