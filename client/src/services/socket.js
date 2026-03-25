import { io } from "socket.io-client";

const BASE_URL = "https://shareit-io.onrender.com" || "http://localhost:5000";

/** Singleton socket instance used across the entire app */
const socket = io(BASE_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
