// server.js
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


  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete usernames[username];
    delete users[socket.id];
    io.emit("online-users", Object.values(users));
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("✅ Server running on port 5000"));
