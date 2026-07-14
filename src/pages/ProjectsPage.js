import React, { useEffect, useState } from "react";
import { projectService } from "../services/projectService";
import ProjectList from "../components/ProjectList";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import "../styles/Page.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    fetchProjects();
  }, [refreshKey]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleProjectCreated = () => {
    setShowForm(false);
    setRefreshKey(refreshKey + 1);
  };
  const handleProjectDeleted = () => {
    setRefreshKey(refreshKey + 1);
  };

  if (loading) {
    return <div className="page-container loading">Loading projects...</div>;
  }
  return (
    <div className="projects-page page-container">
      <div className="page-header">
        <h1>Projects</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Cancel" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <ProjectForm onSuccess={handleProjectCreated} />
        </div>
      )}
      {projects.length === 0 ? (
        <div className="empty-state">No projects yet. Create one!</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleProjectDeleted}
            />
          ))}
        </div>
      )}
      <ProjectList key={refreshKey} />
    </div>
  );
}
