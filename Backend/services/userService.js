const { User, Project, Task } = require("../models");
const AppError = require("../utils/appError");

class UserService {
  async getProfile(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    await user.update({
      name: data.name,
      email: data.email,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async deleteAccount(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    await Task.destroy({
      where: {
        ownerId: userId,
      },
    });

    await Project.destroy({
      where: {
        ownerId: userId,
      },
    });

    await user.destroy();

    return true;
  }
}

module.exports = new UserService();