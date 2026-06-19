const projectService = require('../services/projectService');

class ProjectController {
  async getAllProjects(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;
      const data = await projectService.getAllProjects({
        page,
        limit,
        search,
        status,
        ownerId: req.user.id
      });

      res.status(200).json({
        status: 'success',
        message: 'Projects retrieved successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getProject(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.id, req.user);

      res.status(200).json({
        status: 'success',
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject({
        ...req.body,
        ownerId: req.user.id
      });

      res.status(201).json({
        status: 'success',
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body, req.user);

      res.status(200).json({
        status: 'success',
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.params.id, req.user);

      res.status(200).json({
        status: 'success',
        message: 'Project deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
