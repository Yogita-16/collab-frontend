import api from "./api";

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get("/projects");
    return response.data;
  },

  createProject: async (name, description, color) => {
    const response = await api.post("/projects", {
      name,
      description,
      color,
    });
    return response.data;
  },

  getProjectById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  updateProject: async (projectId, updates) => {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  getProjectTasks: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  getProjectStats: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/stats`);
    return response.data;
  },

  addMember: async (projectId, email, role = "member") => {
    const response = await api.post(`/projects/${projectId}/members`, {
      email,
      role,
    });
    return response.data;
  },

  removeMember: async (projectId, memberId) => {
    const response = await api.delete(
      `/projects/${projectId}/members/${memberId}`,
    );
    return response.data;
  },
};
