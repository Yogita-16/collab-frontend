import io from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:3000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinProject(projectId, userId) {
    if (this.socket) {
      this.socket.emit("joinProject", projectId, userId);
    }
  }

  leaveProject(projectId, userId) {
    if (this.socket) {
      this.socket.emit("leaveProject", projectId, userId);
    }
  }

  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on("taskCreated", callback);
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on("taskUpdated", callback);
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on("taskDeleted", callback);
    }
  }

  onTaskCompleted(callback) {
    if (this.socket) {
      this.socket.on("taskCompleted", callback);
    }
  }

  onCommentAdded(callback) {
    if (this.socket) {
      this.socket.on("commentAdded", callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on("userJoined", callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on("userLeft", callback);
    }
  }

  emitTaskCreated(data) {
    if (this.socket) {
      this.socket.emit("taskCreated", data);
    }
  }

  emitTaskUpdated(data) {
    if (this.socket) {
      this.socket.emit("taskUpdated", data);
    }
  }

  emitTaskDeleted(data) {
    if (this.socket) {
      this.socket.emit("taskDeleted", data);
    }
  }

  emitTaskCompleted(data) {
    if (this.socket) {
      this.socket.emit("taskCompleted", data);
    }
  }

  emitCommentAdded(data) {
    if (this.socket) {
      this.socket.emit("commentAdded", data);
    }
  }
}

export default new SocketService();
