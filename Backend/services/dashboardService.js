const { Project, Task } = require("../models");

class DashboardService {
  async getDashboardStats(userId) {
    const totalProjects = await Project.count({
      where: { ownerId: userId }
    });

    const completedProjects = await Project.count({
      where: {
        ownerId: userId,
        status: "Completed"
      }
    });

    const pendingProjects = totalProjects - completedProjects;

    const totalTasks = await Task.count();

    const completedTasks = await Task.count({
      where: {
        status: "Completed"
      }
    });

    const pendingTasks = await Task.count({
      where: {
        status: "Pending"
      }
    });

    const projectCompletionPercentage =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    const taskCompletionPercentage =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    return {
      totalProjects,
      completedProjects,
      pendingProjects,

      totalTasks,
      completedTasks,
      pendingTasks,

      projectCompletionPercentage,
      taskCompletionPercentage
    };
  }
}

module.exports = new DashboardService();