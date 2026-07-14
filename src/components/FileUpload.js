import React, { useState } from "react";
import api from "../services/api";
import "../styles/FileUpload.css";

export default function FileUpload({ taskId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
      setSuccess("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", file.name, "to task:", taskId);

      const response = await api.post(`/uploads/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response.data);
      setSuccess("File uploaded successfully");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
      if (onUploadSuccess) {
        console.log("Calling onUploadSuccess with task:", response.data.task);
        onUploadSuccess(response.data.task);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleUpload} className="upload-form">
        <div className="file-input-group">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `📄 ${file.name}` : "Choose file..."}
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="btn btn-primary"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <p className="file-info">Max file size: 5MB</p>
    </div>
  );
}
