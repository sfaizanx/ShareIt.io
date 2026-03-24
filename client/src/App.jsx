import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import { useSocket } from "./hooks/useSocket";
import { useFileTransfer } from "./hooks/useFileTransfer";
import { useTextMessage } from "./hooks/useTextMessage";
import { useRoom } from "./hooks/useRoom";
import { useTheme } from "./hooks/useTheme";

import JoinScreen from "./pages/JoinScreen";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { username, isJoined, joinChat, otherUsers } = useSocket();
  const { receivedFiles, sendingFiles, sendFiles, clearFile } = useFileTransfer(username);
  const { receivedTexts, sendText, clearText } = useTextMessage();
  const {
    roomId, setRoomId, activeRoom, roomUsers, messages,
    generatedRoomId, joinRoom, leaveRoom, sendMessage,
  } = useRoom();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-family)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          },
        }}
      />
      <AnimatePresence mode="wait">
        {!isJoined ? (
          <JoinScreen key="join" onJoin={joinChat} />
        ) : (
          <Dashboard
            key="dashboard"
            username={username}
            isDark={isDark}
            toggleTheme={toggleTheme}
            otherUsers={otherUsers}
            receivedFiles={receivedFiles}
            sendingFiles={sendingFiles}
            sendFiles={sendFiles}
            clearFile={clearFile}
            sendText={sendText}
            receivedTexts={receivedTexts}
            roomId={roomId}
            setRoomId={setRoomId}
            activeRoom={activeRoom}
            roomUsers={roomUsers}
            messages={messages}
            generatedRoomId={generatedRoomId}
            joinRoom={joinRoom}
            leaveRoom={leaveRoom}
            sendMessage={sendMessage}
          />
        )}
      </AnimatePresence>
    </>
  );
}