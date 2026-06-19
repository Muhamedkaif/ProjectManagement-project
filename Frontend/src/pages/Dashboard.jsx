import React, { useEffect, useState } from "react";
import api from "../services/api";
import { getDashboardStats } from "../services/dashboardService";
import {
  FolderKanban,
  CheckCircle,
  ListTodo,
  Clock,
  Briefcase,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    pendingProjects: 0,

    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,

    projectCompletionPercentage: 0,
    taskCompletionPercentage: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      console.log(response);
console.log(response.data);
      setStats(response);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: <FolderKanban size={24} />,
      color: "text-blue-600",
    },
    {
      title: "Completed Projects",
      value: stats.completedProjects,
      icon: <Briefcase size={24} />,
      color: "text-green-600",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: <ListTodo size={24} />,
      color: "text-purple-600",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: <CheckCircle size={24} />,
      color: "text-emerald-600",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: <Clock size={24} />,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-lg font-medium">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={card.color}>{card.icon}</div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              {card.value}
            </h2>

            <p className="mt-2 text-sm text-gray-500 font-medium">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              Project Completion
            </h3>

            <span className="text-3xl font-bold text-green-600">
              {stats.projectCompletionPercentage}%
            </span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-700"
              style={{
                width: `${stats.projectCompletionPercentage}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.completedProjects}
              </p>
              <p className="text-sm text-gray-500">
                Completed Projects
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-orange-500">
                {stats.pendingProjects}
              </p>
              <p className="text-sm text-gray-500">
                Pending Projects
              </p>
            </div>
          </div>
        </div>

        {/* Task Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              Task Completion
            </h3>

            <span className="text-3xl font-bold text-blue-600">
              {stats.taskCompletionPercentage}%
            </span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${stats.taskCompletionPercentage}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.completedTasks}
              </p>
              <p className="text-sm text-gray-500">
                Completed Tasks
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-orange-500">
                {stats.pendingTasks}
              </p>
              <p className="text-sm text-gray-500">
                Pending Tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;