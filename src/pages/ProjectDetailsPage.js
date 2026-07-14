import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectService } from "../services/projectService";
import { useTaskStore } from "../store/taskStore";
import socketService from "../services/socketService";
import FileUpload from "../components/FileUpload";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import "../styles/Page.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const { user } = useTaskStore();

  useEffect(() => {
    // Connect to socket
    socketService.connect();
    socketService.joinProject(id, user?._id);

    // Listen to socket events
    socketService.onTaskCreated(() => {
      console.log("Task created - refreshing");
      setRefreshKey((prev) => prev + 1);
    });

    socketService.onTaskUpdated(() => {
      console.log("Task updated - refreshing");
      setRefreshKey((prev) => prev + 1);
    });

    socketService.onTaskDeleted(() => {
      console.log("Task deleted - refreshing");
      setRefreshKey((prev) => prev + 1);
    });

    socketService.onTaskCompleted(() => {
      console.log("Task completed - refreshing");
      setRefreshKey((prev) => prev + 1);
    });

    return () => {
      socketService.leaveProject(id, user?._id);
    };
  }, [id, user?._id]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectService.getProjectById(id);
        setProject(projectData);

        const statsData = await projectService.getProjectStats(id);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    setRefreshKey(refreshKey + 1);
  };

  if (loading) {
    return <div className="page-container loading">Loading project...</div>;
  }

  if (error) {
    return <div className="page-container error-message">{error}</div>;
  }

  if (!project) {
    return (
      <div className="page-container error-message">Project not found</div>
    );
  }

  return (
    <div className="project-details-page page-container">
      <div
        className="project-header-banner"
        style={{ borderLeftColor: project.color }}
      >
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completedTasks || 0}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completionPercentage || 0}%</h3>
            <p>Completion</p>
          </div>
          <div className="stat-card">
            <h3>{project.members?.length || 0}</h3>
            <p>Members</p>
          </div>
        </div>
      )}

      <div className="project-tasks">
        <div className="section-header">
          <h2>Tasks</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskForm(!showTaskForm)}
          >
            {showTaskForm ? "✕ Cancel" : "+ Add Task"}
          </button>
        </div>
        {showTaskForm && (
          <div className="form-section">
            <TaskForm projectId={id} onSuccess={handleTaskCreated} />
          </div>
        )}

        {/* File upload section - show when a task is selected */}
        <div className="upload-section">
          <h3>Upload Files to Tasks</h3>
          <p>Select a task first, then upload files</p>
        </div>
        <TaskList key={refreshKey} projectId={id} />
      </div>
    </div>
  );
}
