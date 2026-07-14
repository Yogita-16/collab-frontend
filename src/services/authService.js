import api from "./api";

export const authService = {
  register: async (name, email, password, confirmPassword) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (updates) => {
    const response = await api.put("/auth/profile", updates);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};
