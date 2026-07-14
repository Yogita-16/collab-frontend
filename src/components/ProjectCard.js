import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";
import "../styles/ProjectCard.css";

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await projectService.deleteProject(project._id);
      setShowDeleteConfirm(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="project-card"
        style={{ borderLeftColor: project.color || "#3498db" }}
      >
        <div className="project-header">
          <h3 onClick={() => navigate(`/projects/${project._id}`)}>
            {project.name}
          </h3>
          <button
            className="btn-delete"
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete project"
          >
            🗑
          </button>
        </div>

        <p className="project-description">
          {project.description || "No description"}
        </p>

        <div className="project-stats">
          <span>👥 {project.members?.length || 0} members</span>
          <span>📋 {project.taskCount || 0} tasks</span>
        </div>

        <div className="project-footer">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/projects/${project._id}`)}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Project?</h3>
            <p>Are you sure you want to delete "{project.name}"?</p>
            <p className="warning">
              All tasks in this project will be deleted too!
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
