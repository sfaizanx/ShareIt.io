import { useEffect, useState, useCallback } from "react";
import socket from "../services/socket";

/**
 * useSocket — manages socket connection, user registration, and online users list.
 */
export function useSocket() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Join the socket with a username
  const joinChat = useCallback(
    (name) => {
      const trimmed = (name || username).trim();
      if (!trimmed) return;
      setUsername(trimmed);
      socket.emit("user-joined", trimmed);
      setIsJoined(true);
    },
    [username]
  );

  // Listen for online user updates
  useEffect(() => {
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    socket.on("online-users", handleOnlineUsers);
    return () => socket.off("online-users", handleOnlineUsers);
  }, []);

  // Filtered list (excludes self)
  const otherUsers = onlineUsers.filter((u) => u !== username);

  return {
    socket,
    username,
    setUsername,
    isJoined,
    joinChat,
    onlineUsers,
    otherUsers,
  };
}
