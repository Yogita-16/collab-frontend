import { create } from "zustand";
import { taskService } from "../services/taskService";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,

  fetchAllTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskService.getAllTasks();
      set({ tasks: Array.isArray(tasks) ? tasks : [], loading: false });
      return tasks;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createTask: async (title, projectId, priority, description) => {
    try {
      const task = await taskService.createTask(
        title,
        projectId,
        priority,
        description,
      );
      set((state) => ({ tasks: [...state.tasks, task] }));
      return task;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      console.log("Store updateTask called with:", { taskId, updates });

      const task = await taskService.updateTask(taskId, updates);

      console.log("Task updated in service, updating store:", task);

      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? task : t)),
      }));

      return task;
    } catch (error) {
      console.error("Store updateTask error:", error);
      set({ error: error.message });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== taskId),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
