const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup with CORS
const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000", // for local testing
      "https://your-frontend-app.onrender.com", // replace with your actual Render URL
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// ✅ Serve React build files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ✅ Fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, name, avatar }) => {
    socket.join(roomId);
    io.to(roomId).emit("userStatus", { name, status: "active", avatar });
  });

  socket.on("sendMessage", ({ roomId, message, name, avatar }) => {
    io.to(roomId).emit("receiveMessage", { message, name, avatar });

    // 🔔 Optional: server-side notification logic (if needed)
  });

  socket.on("sendMedia", ({ roomId, mediaType, mediaData, name, avatar }) => {
    io.to(roomId).emit("receiveMedia", { mediaType, mediaData, name, avatar });
  });

  socket.on("typing", ({ roomId, name }) => {
    socket.to(roomId).emit("typing", name);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    io.emit("userStatus", { name: "Someone", status: "inactive" });
  });
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
