import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import EditTaskModal from "./EditTaskModal";
import FileUpload from "./FileUpload";
import api from "../services/api";
import "../styles/TaskCard.css";

export default function TaskCard({ task: initialTask, onUpdate }) {
  const [task, setTask] = useState(initialTask);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const { updateTask, deleteTask } = useTaskStore();
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);
  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      console.log("Toggling task completion:", {
        taskId: task._id,
        currentCompleted: task.completed,
        newCompleted: !task.completed,
      });

      await updateTask(task._id, {
        completed: !task.completed,
      });
      // Update local state
      setTask((prev) => ({
        ...prev,
        completed: !prev.completed,
      }));
      console.log("Task updated successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert(
        "Failed to update task: " +
          (error.response?.data?.error || error.message),
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      if (onUpdate) onUpdate();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task");
    }
  };

  const handleUploadSuccess = (updatedTask) => {
    console.log("🎉 handleUploadSuccess called");
    console.log("📦 Received data:", updatedTask);

    // Check if it's the full response or just task
    let taskData = updatedTask;

    if (updatedTask.task) {
      console.log("⚠️  Received full response, extracting task");
      taskData = updatedTask.task;
    }

    console.log("📎 Task attachments:", taskData?.attachments);

    if (!taskData) {
      console.error("❌ No task data!");
      return;
    }

    if (!taskData.attachments) {
      console.warn("⚠️  No attachments array, creating empty one");
      taskData.attachments = [];
    }

    console.log(
      `✅ Setting task with ${taskData.attachments.length} attachments`,
    );

    // Update local state
    setTask(taskData);
    setShowFileUpload(false);

    if (onUpdate) onUpdate();
  };
  const handleDeleteAttachment = async (attachmentId) => {
    if (!attachmentId) {
      console.error("No attachment ID provided!");
      alert("Error: Missing attachment ID");
      return;
    }

    if (window.confirm("Delete this attachment?")) {
      setIsDeleting(attachmentId);
      try {
        console.log("Deleting:", {
          taskId: task._id,
          attachmentId,
        });

        const response = await api.delete(
          `/uploads/${task._id}/${attachmentId}`,
        );

        console.log("Attachment deleted:", response.data);

        // Update task with new attachments
        setTask(response.data.task);

        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Failed to delete attachment:", error);
        alert(
          "Failed to delete attachment: " + error.response?.data?.error ||
            error.message,
        );
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleDownloadAttachment = async (attachmentId, fileName) => {
    try {
      if (!attachmentId) {
        console.error("No attachment ID provided!");
        alert("Error: Missing attachment ID");
        return;
      }

      console.log("Downloading:", {
        taskId: task._id,
        attachmentId,
        fileName,
      });

      const response = await api.get(
        `/uploads/${task._id}/${attachmentId}/download`,
        {
          responseType: "blob",
        },
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("File downloaded successfully");
    } catch (error) {
      console.error("Failed to download attachment:", error);
      alert("Failed to download attachment: " + error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      case "low":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      <div className={`task-card ${task.completed ? "completed" : ""}`}>
        {/* Task Header */}
        <div className="task-header">
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            className="task-checkbox"
          />
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            <button
              className="btn-icon edit"
              onClick={() => setShowEditModal(true)}
              title="Edit task"
            >
              ✎
            </button>
            <button
              className="btn-icon delete"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete task"
            >
              🗑
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Task Meta */}
        <div className="task-meta">
          <span
            className="task-priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
          <span className="task-status">{task.status || "todo"}</span>
          {task.dueDate && (
            <span className="task-duedate">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Comments Count */}
        {task.comments?.length > 0 && (
          <div className="task-comments">
            <span className="comment-count">💬 {task.comments.length}</span>
          </div>
        )}

        {/* Attachments Section */}
        {task.attachments &&
          Array.isArray(task.attachments) &&
          task.attachments.length > 0 && (
            <div className="task-attachments-section">
              <button
                className="attachments-toggle"
                onClick={() => {
                  console.log("Toggle attachments clicked");
                  console.log("Current attachments:", task.attachments);
                  setShowAttachments(!showAttachments);
                }}
              >
                📎 Attachments (
                {task.attachments.filter((a) => a && a._id).length})
              </button>

              {showAttachments && (
                <div className="attachments-list">
                  {task.attachments
                    .filter((attachment) => attachment && attachment._id)
                    .map((attachment) => {
                      const attachId = attachment._id;

                      console.log("Rendering attachment:", {
                        id: attachId,
                        name: attachment.originalName,
                        hasId: !!attachId,
                      });

                      return (
                        <div key={attachId} className="attachment-item">
                          <div className="attachment-info">
                            <span className="attachment-name">
                              📄{" "}
                              {attachment.originalName ||
                                attachment.filename ||
                                "Unknown"}
                            </span>
                            <span className="attachment-size">
                              {attachment.fileSize
                                ? formatFileSize(attachment.fileSize)
                                : "Unknown size"}
                            </span>
                          </div>
                          <div className="attachment-actions">
                            <button
                              className="btn-attachment download"
                              onClick={() => {
                                console.log("🔽 Download:", {
                                  attachId,
                                  taskId: task._id,
                                  fileName: attachment.originalName,
                                });
                                handleDownloadAttachment(
                                  attachId,
                                  attachment.originalName ||
                                    attachment.filename,
                                );
                              }}
                              title="Download"
                            >
                              ⬇️
                            </button>
                            <button
                              className="btn-attachment delete"
                              onClick={() => {
                                console.log("🗑️ Delete:", {
                                  attachId,
                                  taskId: task._id,
                                });
                                handleDeleteAttachment(attachId);
                              }}
                              disabled={isDeleting === attachId}
                              title="Delete"
                            >
                              {isDeleting === attachId ? "⏳" : "✕"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

        {/* Upload Button */}
        <div className="task-footer">
          <button
            className="btn btn-secondary btn-upload"
            onClick={() => setShowFileUpload(!showFileUpload)}
          >
            {showFileUpload ? "✕ Cancel" : "📎 Add File"}
          </button>
        </div>

        {/* File Upload Form */}
        {showFileUpload && (
          <div className="file-upload-inline">
            <FileUpload
              taskId={task._id}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Task?</h3>
            <p>Are you sure you want to delete "{task.title}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            if (onUpdate) onUpdate();
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}
