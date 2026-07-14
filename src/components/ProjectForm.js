import React, { useState } from "react";
import { projectService } from "../services/projectService";
import "../styles/Form.css";

export default function ProjectForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3498db");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await projectService.createProject(name, description, color);
      setName("");
      setDescription("");
      setColor("#3498db");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form project-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Project name"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Color</label>
        <div className="color-picker">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span className="color-display" style={{ backgroundColor: color }} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
