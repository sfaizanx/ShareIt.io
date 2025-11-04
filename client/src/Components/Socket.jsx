import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../Constant/constant";

const socket = io(BASE_URL);

const SocketFileShare = () => {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const fileInputRef = useRef(null);

  // Listen for users and incoming files
  useEffect(() => {
    socket.on("online-users", (users) => setOnlineUsers(users));

    socket.on("receive-file", (data) => {
      const blob = new Blob([data.file], { type: data.type });
      setReceivedFiles((prev) => [
        ...prev,
        { blob, name: data.name, from: data.from },
      ]);
    });

    return () => {
      socket.off("online-users");
      socket.off("receive-file");
    };
  }, []);

  const joinChat = () => {
    if (!username.trim()) return;
    socket.emit("user-joined", username);
    setIsJoined(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedUser) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("send-file", {
          to: selectedUser,
          name: file.name,
          type: file.type,
          file: reader.result,
        });
      };
      reader.readAsArrayBuffer(file);
    });

    setSelectedUser(null);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fileInputRef.current.click();
  };

  return (
    <div className="p-6 border rounded-xl text-center max-w-lg mx-auto mt-10">
      {!isJoined ? (
        <div>
          <h2 className="text-xl font-semibold mb-3">👋 Enter your name</h2>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />
          <button
            onClick={joinChat}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Join
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">⚡ Direct File Share</h2>

          {/* Online users list */}
          <div className="mb-4 p-3 bg-gray-100 rounded-lg text-left">
            <h3 className="font-semibold mb-1">
              🟢 Online Users ({onlineUsers.length})
            </h3>
            <ul className="list-disc ml-5">
              {onlineUsers
                .filter((u) => u !== username) // don’t show self
                .map((u, i) => (
                  <li
                    key={i}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleUserClick(u)}
                  >
                    {u}
                  </li>
                ))}
            </ul>
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          {receivedFiles.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-semibold mb-2">📥 Received Files:</h3>
              {receivedFiles.map((f, i) => (
                <div key={i} className="mb-2">
                  <span className="block text-gray-700 text-sm">
                    From: {f.from}
                  </span>
                  <a
                    href={URL.createObjectURL(f.blob)}
                    download={f.name}
                    className="text-green-600 underline"
                  >
                    {f.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SocketFileShare;
