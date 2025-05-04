const socketIo = require("socket.io");

let io; // Declare io variable globally

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", // Adjust this in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Function to get io instance
const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initializeSocket first.");
  }
  return io;
};

module.exports = { initializeSocket, getIo };
