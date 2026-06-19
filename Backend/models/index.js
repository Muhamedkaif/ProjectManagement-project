const { sequelize } = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');


// --- 1. User & Project Associations ---
// A User can be the owner/manager of many projects
User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// --- 2. Project & Task Associations ---
// A Project contains many Tasks
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// --- 5. Task & User (Many-to-Many Assignees) ---
// Define explicit Join Table for Task Assignees
const TaskAssignee = sequelize.define('TaskAssignee', {}, { tableName: 'TaskAssignees', timestamps: true });
Task.belongsToMany(User, { through: TaskAssignee, as: 'assignees', foreignKey: 'taskId', otherKey: 'userId' });
User.belongsToMany(Task, { through: TaskAssignee, as: 'assignedTasks', foreignKey: 'userId', otherKey: 'taskId' });


module.exports = {
  sequelize,
  User,
  Project,
  Task,
};
