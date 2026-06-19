const taskService = require('../services/taskService');

class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const { projectId = '', status = '' } = req.query;
      const tasks = await taskService.getAllTasks({
        projectId,
        status,
        userId: req.user.id
      });

      res.status(200).json({
        status: 'success',
        message: 'Tasks retrieved successfully',
        data: { tasks }
      });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body, req.user);

      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id, req.user);

      res.status(200).json({
        status: 'success',
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body, req.user);

      res.status(200).json({
        status: 'success',
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.params.id, req.user);

      res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
