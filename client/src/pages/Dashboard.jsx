import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp } from "lucide-react";

import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import FileCard from "../components/FileCard";
import UploadWidget from "../components/UploadWidget";
import TextMessageModal from "../components/TextMessageModal";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import RoomPanel from "../components/RoomPanel";
import socket from "../services/socket";

export default function Dashboard({
  username, isDark, toggleTheme,
  otherUsers, receivedFiles, sendingFiles, sendFiles, clearFile,
  sendText, receivedTexts,
  roomId, setRoomId, activeRoom, roomUsers, messages, generatedRoomId, joinRoom, leaveRoom, sendMessage,
}) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textModalTarget, setTextModalTarget] = useState(null);
  const fileInputRef = useRef(null);

  const filteredUsers = useMemo(
    () => otherUsers.filter((u) => u.toLowerCase().includes(search.toLowerCase())),
    [otherUsers, search]
  );

  const handleSendFile = (user) => {
    setSelectedUser(user);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length && selectedUser) sendFiles(selectedUser, files);
    e.target.value = "";
  };

  const handleSendText = (user) => {
    setTextModalTarget(user);
    setTextModalOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar username={username} isDark={isDark} toggleTheme={toggleTheme} />

      <input type="file" multiple ref={fileInputRef} onChange={handleFileInputChange} style={{ display: "none" }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "24px 20px",
        display: "grid", gridTemplateColumns: "1fr", gap: 24,
      }}>
        {/* Mobile: stacked, Desktop: 2 columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 340px) 1fr",
          gap: 24,
          alignItems: "start",
        }}
          className="dashboard-grid"
        >
          {/* ===== LEFT SIDEBAR ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-text-primary)" }}>
                People Online
              </h2>
              <span style={{
                padding: "3px 10px", borderRadius: "var(--radius-full)",
                background: "var(--color-accent-glow)", color: "var(--color-accent)",
                fontSize: "var(--font-size-xs)", fontWeight: 600,
              }}>
                {otherUsers.length}
              </span>
            </div>

            <SearchBar value={search} onChange={setSearch} />

            {/* Users list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <AnimatePresence mode="popLayout">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <UserCard key={u} user={u} index={i} onSendFile={handleSendFile} onSendText={handleSendText} />
                  ))
                ) : (
                  <EmptyState type={search ? "noResults" : "noUsers"} />
                )}
              </AnimatePresence>
            </div>

            {/* Room Panel */}
            <RoomPanel
              roomId={roomId} setRoomId={setRoomId} activeRoom={activeRoom}
              roomUsers={roomUsers} messages={messages} generatedRoomId={generatedRoomId}
              joinRoom={joinRoom} leaveRoom={leaveRoom} sendMessage={sendMessage}
              socketId={socket.id}
            />
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Upload widget */}
            <div>
              <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>
                Send Files
              </h2>
              <UploadWidget targetUser={selectedUser} onSendFiles={sendFiles} sendingFiles={sendingFiles} />
              {selectedUser && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: 8, fontSize: "var(--font-size-sm)", color: "var(--color-accent)", fontWeight: 500, textAlign: "center" }}>
                  Ready to send to <strong>{selectedUser}</strong>
                </motion.div>
              )}
            </div>

            {/* Received texts */}
            <AnimatePresence>
              {receivedTexts.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>
                    Messages
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {receivedTexts.map((msg) => (
                      <motion.div key={msg.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        style={{
                          padding: "14px 18px", borderRadius: "var(--radius-lg)",
                          background: "var(--color-surface)", border: "1px solid var(--color-border)",
                        }}>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-accent)", fontWeight: 600, marginBottom: 4 }}>
                          From: {msg.from}
                        </div>
                        <div style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-primary)" }}>
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Received files */}
            <div>
              <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>
                Received Files
              </h2>
              {receivedFiles.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 16,
                }}>
                  <AnimatePresence mode="popLayout">
                    {receivedFiles.map((f, i) => (
                      <FileCard key={f.id} file={f} index={i} onClear={clearFile} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <EmptyState type="noFiles" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Text message modal */}
      <TextMessageModal
        isOpen={textModalOpen}
        onClose={() => setTextModalOpen(false)}
        targetUser={textModalTarget}
        onSend={sendText}
      />

      {/* Responsive grid styles */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
