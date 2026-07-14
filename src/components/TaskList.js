import React, { useEffect } from "react";
import { useTaskStore } from "../store/taskStore";
import TaskCard from "./TaskCard";
import "../styles/TaskList.css";

export default function TaskList({ projectId }) {
  const { tasks, fetchAllTasks, loading } = useTaskStore();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const projectTasks = projectId
    ? tasks.filter((task) => task.projectId === projectId)
    : tasks;

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (projectTasks.length === 0) {
    return <div className="empty-state">No tasks yet. Create one!</div>;
  }

  return (
    <div className="task-list">
      {projectTasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
