const { Task, Project } = require('../models');
const AppError = require('../utils/appError');

const allowedFields = ['projectId', 'title', 'description', 'status', 'priority', 'dueDate'];
const statuses = ['To Do', 'In Progress', 'In Review', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];

const buildTaskInclude = () => [
  {
    model: Project,
    as: 'project',
    attributes: ['id', 'name', 'ownerId']
  },
];

class TaskService {
  async assertProjectAccess(projectId, userId) {
    const project = await Project.findOne({
      where: { id: projectId, ownerId: userId }
    });

    if (!project) {
      throw new AppError('Project not found or you do not have access to it', 404);
    }

    return project;
  }

  async findOwnedTask(taskId, userId) {
    const task = await Task.findByPk(taskId, { include: buildTaskInclude() });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (task.project.ownerId !== userId) {
      throw new AppError('Unauthorized to access this task', 403);
    }

    return task;
  }

  normalizeUpdates(payload, isCreate = false) {
    const updates = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        updates[field] = payload[field];
      }
    });

    if (isCreate || Object.prototype.hasOwnProperty.call(updates, 'title')) {
      if (!String(updates.title || '').trim()) {
        throw new AppError('Task title is required', 400);
      }
      updates.title = updates.title.trim();
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'projectId')) {
      const projectId = Number(updates.projectId);
      if (!Number.isInteger(projectId)) {
        throw new AppError('A valid project is required', 400);
      }
      updates.projectId = projectId;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'status') && !statuses.includes(updates.status)) {
      throw new AppError('Invalid task status', 400);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'priority') && !priorities.includes(updates.priority)) {
      throw new AppError('Invalid task priority', 400);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'dueDate') && updates.dueDate === '') {
      updates.dueDate = null;
    }

    return updates;
  }

  async getAllTasks({ projectId = '', status = '', userId }) {
    const taskWhere = {};

    if (projectId) taskWhere.projectId = projectId;
    if (status) taskWhere.status = status;

    return Task.findAll({
      where: taskWhere,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'ownerId'],
          where: { ownerId: userId }
        },
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async createTask(payload, requestingUser) {
    const updates = this.normalizeUpdates(payload, true);
    await this.assertProjectAccess(updates.projectId, requestingUser.id);

    const task = await Task.create({
      projectId: updates.projectId,
      title: updates.title,
      description: updates.description || '',
      status: updates.status || 'To Do',
      priority: updates.priority || 'Medium',
      dueDate: updates.dueDate || null
    });
    return this.findOwnedTask(task.id, requestingUser.id);
  }

  async getTaskById(id, requestingUser) {
    return this.findOwnedTask(id, requestingUser.id);
  }

  async updateTask(id, payload, requestingUser) {
    const task = await this.findOwnedTask(id, requestingUser.id);
    const updates = this.normalizeUpdates(payload);

    if (Object.prototype.hasOwnProperty.call(updates, 'projectId')) {
      await this.assertProjectAccess(updates.projectId, requestingUser.id);
    }

    await task.update(updates);
    return this.findOwnedTask(task.id, requestingUser.id);
  }

  async deleteTask(id, requestingUser) {
    const task = await this.findOwnedTask(id, requestingUser.id);
    await task.destroy();
  }
}

module.exports = new TaskService();
