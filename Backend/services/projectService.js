const { Project, User, Task } = require('../models');
const AppError = require('../utils/appError');

const allowedUpdateFields = ['name', 'description', 'status', 'progress', 'dueDate', 'startDate', 'category'];

const canAccessProject = (project, user) => {
  return user.role === 'Admin' || project.ownerId === user.id;
};

const normalizeProjectUpdates = (payload) => {
  const updates = {};

  allowedUpdateFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      updates[field] = payload[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
    if (!String(updates.name || '').trim()) {
      throw new AppError('Project name is required', 400);
    }
    updates.name = updates.name.trim();
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'progress')) {
    const progress = Number(updates.progress);
    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
      throw new AppError('Progress must be a whole number between 0 and 100', 400);
    }
    updates.progress = progress;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'dueDate') && updates.dueDate === '') {
    updates.dueDate = null;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'startDate') && updates.startDate === '') {
    updates.startDate = null;
  }

  return updates;
};

class ProjectService {
  async getAllProjects({ page = 1, limit = 10, search = '', status = '', ownerId }) {
    const { Op } = require('sequelize');
    const numericPage = parseInt(page, 10);
    const numericLimit = parseInt(limit, 10);
    const offset = (numericPage - 1) * numericLimit;
    const where = { ownerId };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status) where.status = status;

    const { count, rows } = await Project.findAndCountAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
      limit: numericLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      projects: rows,
      pagination: {
        total: count,
        page: numericPage,
        pages: Math.ceil(count / numericLimit),
        limit: numericLimit
      }
    };
  }

  async getProjectById(id, requestingUser) {
    const project = await Project.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Task, as: 'tasks', attributes: ['id', 'title', 'status', 'priority', 'dueDate'] }
      ]
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (!canAccessProject(project, requestingUser)) {
      throw new AppError('Unauthorized to view this project', 403);
    }

    return project;
  }

  async createProject({ name, description, status, dueDate, startDate, category, ownerId }) {
    if (!String(name || '').trim()) {
      throw new AppError('Project name is required', 400);
    }

    return Project.create({
      name: name.trim(),
      description: description || '',
      dueDate: dueDate || null,
      startDate: startDate || null,
      category: category || 'General',
      status: status || 'Planning',
      progress: 0,
      ownerId
    });
  }

  async updateProject(id, payload, requestingUser) {
    const project = await Project.findByPk(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (!canAccessProject(project, requestingUser)) {
      throw new AppError('Unauthorized to update this project', 403);
    }

    const updates = normalizeProjectUpdates(payload);
    await project.update(updates);
    return project;
  }

  async deleteProject(id, requestingUser) {
    const project = await Project.findByPk(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (!canAccessProject(project, requestingUser)) {
      throw new AppError('Unauthorized to delete this project', 403);
    }

    await project.destroy();
  }
}

module.exports = new ProjectService();
