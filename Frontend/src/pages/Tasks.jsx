import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Calendar,
  MessageSquare,
  Loader2,
  Pencil,
  Trash2,
  X,
  Save
} from 'lucide-react';
import projectService from '../services/projectService';
import taskService from '../services/taskService';

const columns = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'In Review', title: 'Review' },
  { id: 'Completed', title: 'Done' }
];

const priorityStyles = {
  High: 'bg-danger/10 text-danger',
  Medium: 'bg-warning/10 text-warning',
  Low: 'bg-success/10 text-success'
};

const emptyTaskForm = {
  projectId: '',
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: ''
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);

  useEffect(() => {
    fetchBoardData();
  }, [projectFilter]);

  const fetchBoardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [taskResponse, projectResponse] = await Promise.all([
        taskService.getTasks({ projectId: projectFilter }),
        projectService.getProjects({ limit: 100 })
      ]);

      setTasks(taskResponse.tasks || []);
      setProjects(projectResponse.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedTasks = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.status === column.id);
      return acc;
    }, {});
  }, [tasks]);

  const openCreateModal = (status = 'To Do') => {
    setSelectedTask(null);
    setTaskForm({
      ...emptyTaskForm,
      projectId: projectFilter || projects[0]?.id || '',
      status
    });
    setModalMode('create');
    setError('');
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setTaskForm({
      projectId: task.projectId || task.project?.id || '',
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'To Do',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || ''
    });
    setModalMode('edit');
    setError('');
  };

  const closeModal = () => {
    if (isSaving) return;
    setModalMode(null);
    setSelectedTask(null);
    setTaskForm(emptyTaskForm);
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();

    if (!taskForm.projectId) {
      setError('Choose a project before saving the task');
      return;
    }

    if (!taskForm.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      const payload = {
        ...taskForm,
        projectId: Number(taskForm.projectId),
        title: taskForm.title.trim(),
        dueDate: taskForm.dueDate || null
      };

      const savedTask =
        modalMode === 'edit'
          ? await taskService.updateTask(selectedTask.id, payload)
          : await taskService.createTask(payload);

      setTasks(prev => {
        const belongsInCurrentFilter = !projectFilter || String(savedTask.projectId) === String(projectFilter);

        if (!belongsInCurrentFilter) {
          return prev.filter(task => task.id !== savedTask.id);
        }

        if (modalMode === 'edit') {
          return prev.map(task => task.id === savedTask.id ? savedTask : task);
        }
        return [savedTask, ...prev];
      });

      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setIsDeleting(taskId);
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="fade-in h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-white text-sm font-medium hover:bg-bg-sub transition-colors cursor-pointer"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <span className="text-sm text-text-muted">{tasks.length} tasks</span>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          disabled={projects.length === 0}
          className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {error && !modalMode && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {projects.length === 0 && !isLoading && (
        <div className="bg-white border border-border rounded-lg p-8 text-center">
          <p className="font-semibold text-text-main">Create a project first</p>
          <p className="text-sm text-text-muted mt-1">Tasks need to belong to a project before they can be saved.</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-text-muted">Loading tasks...</p>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-main">{column.title}</h3>
                  <span className="text-xs font-bold bg-bg-accent text-text-muted px-2 py-0.5 rounded-full">
                    {groupedTasks[column.id]?.length || 0}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateModal(column.id)}
                  disabled={projects.length === 0}
                  className="text-text-muted hover:text-text-main disabled:opacity-40"
                  title={`Add task to ${column.title}`}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3 bg-bg-accent/40 p-2 rounded-lg border border-transparent hover:border-border transition-all">
                {groupedTasks[column.id]?.map((task) => {
                  const assignee = task.assignees?.[0];

                  return (
                    <div key={task.id} className="bg-white p-4 rounded-md border border-border shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${priorityStyles[task.priority]}`}>
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => openEditModal(task)}
                            className="p-1 text-text-muted hover:text-primary hover:bg-primary-light rounded"
                            title="Edit task"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={isDeleting === task.id}
                            className="p-1 text-text-muted hover:text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                            title="Delete task"
                          >
                            {isDeleting === task.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-text-main mb-2 leading-relaxed">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-text-muted mb-4 line-clamp-2">{task.description}</p>
                      )}

                      <div className="text-[11px] text-text-muted mb-4">
                        {task.project?.name || 'No project'}
                      </div>

                      <div className="flex items-center gap-1 text-text-muted mb-3">
                        <Calendar size={14} />
                        <span className="text-[11px] font-medium">Created: {formatDate(task.createdAt)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-text-muted">
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            <span className="text-[11px] font-medium">{task.comments?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span className="text-[11px] font-medium">{formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold">
                          {getInitials(assignee?.name)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => openCreateModal(column.id)}
                  disabled={projects.length === 0}
                  className="py-2 text-text-muted text-sm font-medium hover:text-text-main transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white border border-border rounded-lg w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-text-main">
                  {modalMode === 'edit' ? 'Edit Task' : 'Create Task'}
                </h2>
                <p className="text-sm text-text-muted">Save task details to the database</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-text-muted hover:text-text-main hover:bg-bg-sub rounded transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Project</label>
                <select
                  name="projectId"
                  value={taskForm.projectId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={taskForm.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Description</label>
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Status</label>
                  <select
                    name="status"
                    value={taskForm.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    {columns.map(column => (
                      <option key={column.id} value={column.id}>{column.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Priority</label>
                  <select
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={taskForm.dueDate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div className="flex gap-3 pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 px-5 py-3 border border-border text-text-main rounded-lg font-medium hover:bg-bg-sub transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-5 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
