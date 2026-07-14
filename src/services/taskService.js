import api from "./api";

export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await api.get("/tasks");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("getAllTasks error:", error);
      throw error;
    }
  },

  createTask: async (
    title,
    projectId,
    priority = "medium",
    description = "",
  ) => {
    try {
      const response = await api.post("/tasks", {
        title,
        projectId,
        priority,
        description,
      });
      return response.data;
    } catch (error) {
      console.error("createTask error:", error);
      throw error;
    }
  },

  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("getTaskById error:", error);
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      // Make sure we only send allowed fields
      const allowedFields = [
        "title",
        "description",
        "priority",
        "status",
        "completed",
        "dueDate",
      ];
      const filteredUpdates = {};

      allowedFields.forEach((field) => {
        if (updates.hasOwnProperty(field)) {
          filteredUpdates[field] = updates[field];
        }
      });

      console.log("Updating task with:", filteredUpdates);

      const response = await api.put(`/tasks/${taskId}`, filteredUpdates);
      return response.data;
    } catch (error) {
      console.error("updateTask error:", error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("deleteTask error:", error);
      throw error;
    }
  },

  getCompletedTasks: async () => {
    try {
      const response = await api.get('/tasks/filter/completed');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('getCompletedTasks error:', error);
      throw error;
    }
  },

  getPendingTasks: async () => {
    try {
      const response = await api.get("/tasks/filter/pending");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("getPendingTasks error:", error);
      throw error;
    }
  },

  searchTasks: async (query) => {
    try {
      const response = await api.get('/tasks/search', { params: { q: query } });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('searchTasks error:', error);
      throw error;
    }
  },

  getTaskStats: async () => {
    try {
      const response = await api.get("/tasks/stats");
      return response.data;
    } catch (error) {
      console.error("getTaskStats error:", error);
      throw error;
    }
  },

  getTasksPaginated: async (page = 1, limit = 10) => {
    try {
      const response = await api.get("/tasks/paginated", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("getTasksPaginated error:", error);
      throw error;
    }
  },

  addComment: async (taskId, text) => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { text });
      return response.data;
    } catch (error) {
      console.error("addComment error:", error);
      throw error;
    }
  },

  addSubtask: async (taskId, title) => {
    try {
      const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
      return response.data;
    } catch (error) {
      console.error('addSubtask error:', error);
      throw error;
    }
  },

  assignTask: async (taskId, assignToUserId) => {
    try {
      const response = await api.post(`/tasks/${taskId}/assign`, {
        assignToUserId,
      });
      return response.data;
    } catch (error) {
      console.error('assignTask error:', error);
      throw error;
    }
  },
};
