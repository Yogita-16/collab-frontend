import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { taskService } from "../services/taskService";
import TaskList from "../components/TaskList";
import "../styles/Page.css";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await taskService.getTaskStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-page page-container">
      <h1>Welcome, {user?.name}! 👋</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total || 0}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completed || 0}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pending || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completionPercentage || 0}%</h3>
            <p>Completion</p>
          </div>
        </div>
      ) : null}

      <h2 style={{ marginTop: "2rem" }}>Your Tasks</h2>
      <TaskList />
    </div>
  );
}
