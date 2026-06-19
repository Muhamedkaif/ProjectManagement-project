import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import projectService from '../services/projectService';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    startDate: '',
    dueDate: '',
    status: 'Planning'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await projectService.createProject(formData);
      // Navigate back to projects page
      navigate('/projects', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-sub py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-main">Create New Project</h1>
            <p className="text-text-muted mt-1">Set up a new project and start collaborating</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-border p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Mobile App Redesign"
                className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <p className="text-xs text-text-muted mt-1">Give your project a clear, descriptive name</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-text-main mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this project is about..."
                rows="4"
                className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
              />
              <p className="text-xs text-text-muted mt-1">Optional: Add details about the project scope</p>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
                />
                <p className="text-xs text-text-muted mt-1">Optional: Set when work begins</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-bg-sub focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
                />
                <p className="text-xs text-text-muted mt-1">Optional: Set a target completion date</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="flex-1 px-6 py-3 border border-border text-text-main rounded-lg font-medium hover:bg-bg-sub transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
