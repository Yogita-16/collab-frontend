import React, { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import "../styles/Form.css";

export default function TaskForm({ projectId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { createTask } = useTaskStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTask(title, projectId, priority, description);
      setTitle("");
      setDescription("");
      setPriority("medium");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form task-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
