import { useEffect, useState, useCallback } from "react";
import socket from "../services/socket";
import { toast } from "sonner";

/**
 * useFileTransfer — handles sending and receiving files via socket.
 */
export function useFileTransfer(username) {
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [sendingFiles, setSendingFiles] = useState([]);

  // Send files to a specific user
  const sendFiles = useCallback(
    (targetUser, files) => {
      if (!targetUser || !files.length) return;

      files.forEach((file) => {
        const id = `${Date.now()}-${file.name}`;
        setSendingFiles((prev) => [
          ...prev,
          { id, name: file.name, progress: 0, to: targetUser },
        ]);

        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setSendingFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, progress } : f))
            );
          }
        };
        reader.onload = () => {
          socket.emit("send-file", {
            to: targetUser,
            name: file.name,
            type: file.type,
            file: reader.result,
          });
          setSendingFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: 100 } : f))
          );
          toast.success(`Sent "${file.name}" to ${targetUser}`);
          // Remove from sending list after animation
          setTimeout(() => {
            setSendingFiles((prev) => prev.filter((f) => f.id !== id));
          }, 2000);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    []
  );

  // Listen for incoming files
  useEffect(() => {
    const handleReceiveFile = (data) => {
      const blob = new Blob([data.file], { type: data.type });
      const url = URL.createObjectURL(blob);
      setReceivedFiles((prev) => [
        {
          id: `${Date.now()}-${data.name}`,
          blob,
          url,
          name: data.name,
          type: data.type,
          from: data.from,
          receivedAt: new Date(),
        },
        ...prev,
      ]);
      toast(`📁 File received from ${data.from}`, {
        description: data.name,
      });
    };

    socket.on("receive-file", handleReceiveFile);
    return () => socket.off("receive-file", handleReceiveFile);
  }, []);

  // Clear a specific received file
  const clearFile = useCallback((id) => {
    setReceivedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.url) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return {
    receivedFiles,
    sendingFiles,
    sendFiles,
    clearFile,
  };
}
