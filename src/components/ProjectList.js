import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../services/projectService";
import "../styles/ProjectList.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="empty-state">No projects yet. Create one!</div>;
  }

  return (
    <div className="project-list">
      {projects.map((project) => (
        <Link
          to={`/project/${project._id}`}
          key={project._id}
          className="project-card"
          style={{ borderLeftColor: project.color || "#3498db" }}
        >
          <div className="project-header">
            <h3>{project.name}</h3>
            <span
              className="project-color"
              style={{ backgroundColor: project.color || "#3498db" }}
            />
          </div>
          <p className="project-description">{project.description}</p>
          <div className="project-meta">
            <span className="member-count">
              👥 {project.members?.length || 0}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
