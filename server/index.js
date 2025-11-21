import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let users = {};
let usernames = {};
let rooms = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("user-joined", (username) => {
    users[socket.id] = username;
    usernames[username] = socket.id;
    io.emit("online-users", Object.values(users));
  });

  socket.on("send-file", (data) => {
    const targetSocketId = usernames[data.to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive-file", {
        name: data.name,
        type: data.type,
        file: data.file,
        from: users[socket.id],
      });
    }
  });

  socket.on("send-text", (data) => {
    const { to, text } = data;
    const targetSocketId = usernames[to];

    if (targetSocketId)
      io.to(targetSocketId).emit("receive-text", { text, from: socket.id });
    console.log(text, targetSocketId)
  });

  socket.on("join-room", ({ roomId }) => {
    if (!rooms[roomId]) {
        rooms[roomId] = {
            users: [],
            messages: [],
            files: []
        };
    }

    rooms[roomId].users.push({
        id: socket.id,
        username: users[socket.id]
    });

    socket.join(roomId);

    io.to(roomId).emit("room-joined-alert", {
        roomId,
        users: rooms[roomId].users.map(u => u.username)
    });
  });

  socket.on("send-message", ({ roomId, message }) => {
    if (rooms[roomId]) {
      rooms[roomId].messages.push({ text: message, from: socket.id });

      io.to(roomId).emit("receive-message", {
        text: message,
        from: socket.id
      });
    }
  });

  socket.on("send-file", ({ roomId, file }) => {
    if (rooms[roomId]) {
      rooms[roomId].files.push({ file: file, from: socket.id });
      io.to(roomId).emit("receive-file", {
        file: file,
        from: socket.id
      });
    }
  });
 
  socket.on("leave-room", ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].users = rooms[roomId].users.filter((id) => id !== socket.id);
    }
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete usernames[username];
    delete users[socket.id];
    io.emit("online-users", Object.values(users));
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("✅ Server running on port 5000"));

