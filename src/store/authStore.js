import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  register: async (name, email, password, confirmPassword) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(
        name,
        email,
        password,
        confirmPassword,
      );
      set({ user: data.user, loading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Registration failed";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(email, password);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
