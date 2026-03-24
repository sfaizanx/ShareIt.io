import { useEffect, useState, useCallback, useMemo } from "react";
import socket from "../services/socket";

/**
 * useRoom — manages room joining, leaving, messaging, and member tracking.
 */
export function useRoom() {
  const [roomId, setRoomId] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Generate a random 5-char room code
  const generatedRoomId = useMemo(
    () => Math.random().toString(36).substring(2, 7).toUpperCase(),
    []
  );

  // Join a room
  const joinRoom = useCallback(
    (id) => {
      const target = (id || roomId).trim();
      if (!target) return;
      socket.emit("join-room", { roomId: target });
      setActiveRoom(target);
      setMessages([]);
    },
    [roomId]
  );

  // Leave a room
  const leaveRoom = useCallback(() => {
    if (!activeRoom) return;
    socket.emit("leave-room", { roomId: activeRoom });
    setActiveRoom(null);
    setRoomUsers([]);
    setMessages([]);
  }, [activeRoom]);

  // Send a message in the room
  const sendMessage = useCallback(
    (text) => {
      if (!activeRoom || !text.trim()) return;
      socket.emit("send-message", { roomId: activeRoom, message: text });
    },
    [activeRoom]
  );

  // Listen for room events
  useEffect(() => {
    const handleRoomJoined = ({ roomId: rid, users }) => {
      if (rid === activeRoom) {
        setRoomUsers(users);
      }
    };

    const handleRoomMessage = ({ text, from }) => {
      setMessages((prev) => [
        ...prev,
        { text, from, timestamp: new Date() },
      ]);
    };

    socket.on("room-joined-alert", handleRoomJoined);
    socket.on("receive-message", handleRoomMessage);

    return () => {
      socket.off("room-joined-alert", handleRoomJoined);
      socket.off("receive-message", handleRoomMessage);
    };
  }, [activeRoom]);

  return {
    roomId,
    setRoomId,
    activeRoom,
    roomUsers,
    messages,
    generatedRoomId,
    joinRoom,
    leaveRoom,
    sendMessage,
  };
}
