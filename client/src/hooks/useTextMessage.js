import { useEffect, useState, useCallback } from "react";
import socket from "../services/socket";
import { toast } from "sonner";

/**
 * useTextMessage — handles sending and receiving text messages between users.
 */
export function useTextMessage() {
  const [receivedTexts, setReceivedTexts] = useState([]);

  const sendText = useCallback((targetUser, text) => {
    if (!targetUser || !text.trim()) return;
    socket.emit("send-text", { to: targetUser, text });
    toast.success(`Message sent to ${targetUser}`);
  }, []);

  useEffect(() => {
    const handleReceiveText = (data) => {
      const msg = {
        id: Date.now(),
        text: data.text,
        from: data.from,
        receivedAt: new Date(),
      };
      setReceivedTexts((prev) => [msg, ...prev]);
      toast(`💬 Message from ${data.from}`, { description: data.text });
    };

    socket.on("receive-text", handleReceiveText);
    return () => socket.off("receive-text", handleReceiveText);
  }, []);

  const clearText = useCallback((id) => {
    setReceivedTexts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { receivedTexts, sendText, clearText };
}
