import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../Constant/constant";
import TextModal from "./TextModal";
import Room from "./Room";

const socket = io(BASE_URL, { transports: ["websocket"] });

const SocketFileShare = React.memo(() => {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTextBox, setIsTextBox] = useState(false);
  const [readText, setReadText] = useState(null);

  const fileInputRef = useRef(null);

  // Get initials
  const getLetters = useCallback(
    (name) => name?.slice(0, 2).toUpperCase(),
    []
  );

  // Exclude self from user list
  const filteredUsers = useMemo(
    () => onlineUsers.filter((u) => u !== username),
    [onlineUsers, username]
  );

  // Join chat
  const joinChat = useCallback(() => {
    if (!username.trim()) return;
    socket.emit("user-joined", username);
    setIsJoined(true);
  }, [username]);

  // Click user to send file
  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
    fileInputRef.current?.click();
  }, []);

  // Click user to open text modal
  const handleText = useCallback((user) => {
    setIsTextBox(true);
    setSelectedUser(user);
  }, []);

  // File select handler
  const handleFileSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
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
    },
    [selectedUser]
  );

  // Socket listeners
  useEffect(() => {
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const handleReceiveFile = (data) => {
      const blob = new Blob([data.file], { type: data.type });
      setReceivedFiles((prev) => [
        ...prev,
        { blob, name: data.name, from: data.from },
      ]);
    };

    const handleReceived = (data) => {
      setReadText(data.text);
    };

    socket.on("receive-text", handleReceived);
    socket.on("online-users", handleOnlineUsers);
    socket.on("receive-file", handleReceiveFile);

    return () => {
      socket.off("receive-text", handleReceived);
      socket.off("online-users", handleOnlineUsers);
      socket.off("receive-file", handleReceiveFile);
    };
  }, []);

  // Received file list
  const receivedFileList = useMemo(
    () =>
      receivedFiles.map((f, i) => (
        <div key={i} className="mb-2">
          <span className="block text-gray-700 text-sm">From: {f.from}</span>
          <a
            href={URL.createObjectURL(f.blob)}
            download={f.name}
            className="text-green-600 underline"
          >
            {f.name}
          </a>
        </div>
      )),
    [receivedFiles]
  );

  // Online users list
  const userList = useMemo(
    () =>
      filteredUsers.map((u, i) => (
        <li
          key={i}
          className="flex items-center justify-between cursor-pointer p-2 bg-white rounded-lg mb-2 shadow hover:bg-gray-50 transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-semibold">
              {getLetters(u)}
            </div>
            <span className="text-gray-800 font-medium">{u}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleText(u)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              Message
            </button>
            <button
              onClick={() => handleUserClick(u)}
              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
            >
              Send File
            </button>
          </div>
        </li>
      )),
    [filteredUsers, getLetters, handleText, handleUserClick]
  );

  return (
    <div className="p-6 border rounded-xl text-center max-w-lg mx-auto mt-10">
      {!isJoined ? (
        <div>
          <h2 className="text-xl font-semibold mb-3">Enter your name</h2>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
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
            <h3 className="font-semibold mb-2">
              Online Users ({filteredUsers.length})
            </h3>
            <ul>{userList}</ul>
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          {readText && (
            <div className="mt-4 text-left bg-gray-50 p-3 rounded-lg shadow">
              <p className="font-medium text-gray-700">📩 Message Received:</p>
              <p className="text-gray-800">{readText}</p>
            </div>
          )}

          {receivedFiles.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-semibold mb-2">Received Files:</h3>
              {receivedFileList}
            </div>
          )}
        </>
      )}

      <TextModal
        isOpen={isTextBox}
        onClose={() => setIsTextBox(false)}
        socket={socket}
        readText={readText}
        setReadText={setReadText}
        selectedUser={selectedUser}
      />

      <Room socket={socket} />
    </div>
  );
});

export default SocketFileShare;

