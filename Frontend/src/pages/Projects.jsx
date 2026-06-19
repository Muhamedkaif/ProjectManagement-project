import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  Plus,
  Calendar,
  Loader2,
  Trash2,
  Pencil,
  X,
  Save
} from 'lucide-react';
import projectService from '../services/projectService';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'bg-success/10 text-success';
    case 'In Progress': return 'bg-primary/10 text-primary';
    case 'Planning': return 'bg-warning/10 text-warning';
    default: return 'bg-bg-accent text-text-sub';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: 'General',
    status: 'Planning',
    progress: 0,
    startDate: '',
    dueDate: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const categories = [
    'General',
    'Design',
    'Development',
    'Mobile',
    'Marketing',
    'UX Research',
    'Sales',
    'Support'
  ];

  const statuses = ['Planning', 'In Progress', 'Completed'];

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await projectService.getProjects({
        search: searchTerm,
        status: statusFilter
      });
      setProjects(response.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      setIsDeleting(projectId);
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name || '',
      description: project.description || '',
      category: project.category || 'General',
      status: project.status || 'Planning',
      progress: project.progress || 0,
      startDate: project.startDate || '',
      dueDate: project.dueDate || ''
    });
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setEditingProject(null);
    setError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value
    }));
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!editForm.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsUpdating(true);
      setError('');
      const updatedProject = await projectService.updateProject(editingProject.id, {
        ...editForm,
        name: editForm.name.trim(),
        startDate: editForm.startDate || null,
        dueDate: editForm.dueDate || null
      });

      setProjects(prev =>
        prev.map(project => project.id === updatedProject.id ? updatedProject : project)
      );
      setEditingProject(null);
    } catch (err) {
      setError(err.message || 'Failed to update project');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fade-in flex flex-col gap-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-border rounded-md px-4 py-2 w-full md:w-[400px]">
          <Search size={18} className="text-text-muted" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm" 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button className="p-2.5 bg-bg-accent text-primary border-r border-border">
              <Grid size={18} />
            </button>
            <button className="p-2.5 bg-white text-text-muted hover:text-text-main transition-colors">
              <List size={18} />
            </button>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-white text-sm font-medium hover:bg-bg-sub transition-colors cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button 
            onClick={() => navigate('/projects/create')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-all shadow-sm"
          >
            <Plus size={18} />
            <span>Project</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <p className="text-text-muted">Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 bg-bg-sub rounded-full flex items-center justify-center">
            <Plus size={32} className="text-text-muted" />
          </div>
          <div className="text-center">
            <p className="text-text-main font-semibold text-lg">No projects yet</p>
            <p className="text-text-muted text-sm mt-1">Create your first project to get started</p>
            <button 
              onClick={() => navigate('/projects/create')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-all"
            >
              Create Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-lg hover:border-border-hover transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-1 block">{project.category || 'General'}</span>
                  <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{project.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary-light rounded transition-colors"
                    title="Edit project"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={isDeleting === project.id}
                    className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Delete project"
                  >
                    {isDeleting === project.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-text-muted mb-4 line-clamp-2">{project.description}</p>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-sub">Progress</span>
                  <span className="text-sm font-bold text-text-main">{project.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-1 gap-2 text-text-sub mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    <span className="text-xs font-medium">Created: {formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    <span className="text-xs font-medium">Start: {formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    <span className="text-xs font-medium">Due: {formatDate(project.dueDate)}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white border border-border rounded-lg w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-text-main">Edit Project</h2>
                <p className="text-sm text-text-muted">Update project details and progress</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-2 text-text-muted hover:text-text-main hover:bg-bg-sub rounded transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={editForm.startDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={editForm.dueDate}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">
                    Progress: {editForm.progress}%
                  </label>
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    step="1"
                    value={editForm.progress}
                    onChange={handleEditChange}
                    className="w-full h-12 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="flex-1 px-5 py-3 border border-border text-text-main rounded-lg font-medium hover:bg-bg-sub transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-5 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
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

export default Projects;
