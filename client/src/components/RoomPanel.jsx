import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Copy, LogIn, LogOut, Users, Send, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function RoomPanel({ roomId, setRoomId, activeRoom, roomUsers, messages, generatedRoomId, joinRoom, leaveRoom, sendMessage, socketId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [msgText, setMsgText] = useState("");

  const copyRoomId = useCallback(() => { navigator.clipboard.writeText(generatedRoomId); toast.success("Room code copied!"); }, [generatedRoomId]);
  const handleSendMessage = () => { if (!msgText.trim()) return; sendMessage(msgText); setMsgText(""); };

  return (
    <motion.div layout style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
      <button onClick={() => setIsExpanded(!isExpanded)}
        style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-primary)", fontFamily: "var(--font-family)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--color-accent-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Hash size={18} color="var(--color-accent)" />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)" }}>{activeRoom ? `Room: ${activeRoom}` : "Rooms"}</div>
            <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>{activeRoom ? `${roomUsers.length} member${roomUsers.length !== 1 ? "s" : ""}` : "Create or join a room"}</div>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={18} color="var(--color-text-tertiary)" /> : <ChevronDown size={18} color="var(--color-text-tertiary)" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--color-border)", paddingTop: 16 }}>
              {!activeRoom ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 14px", background: "var(--color-surface-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>Your code:</span>
                    <span style={{ fontWeight: 700, fontSize: "var(--font-size-lg)", color: "var(--color-accent)", letterSpacing: "0.1em", fontFamily: "monospace" }}>{generatedRoomId}</span>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={copyRoomId}
                      style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4 }}>
                      <Copy size={16} />
                    </motion.button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" placeholder="Enter room code..." value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface-secondary)", color: "var(--color-text-primary)", fontSize: "var(--font-size-sm)", fontFamily: "monospace", letterSpacing: "0.08em", outline: "none", textTransform: "uppercase" }} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => joinRoom()}
                      style={{ padding: "10px 18px", borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, var(--color-accent), #8b5cf6)", color: "#fff", fontSize: "var(--font-size-sm)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-family)" }}>
                      <LogIn size={14} /> Join
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <Users size={12} /> Members
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {roomUsers.map((u, i) => (
                        <span key={i} style={{ padding: "4px 10px", borderRadius: "var(--radius-full)", background: "var(--color-accent-glow)", color: "var(--color-accent)", fontSize: "var(--font-size-xs)", fontWeight: 500 }}>{u}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 6, padding: "8px 0" }}>
                    {messages.length === 0 && <p style={{ textAlign: "center", fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)", padding: "16px 0" }}>No messages yet. Say hello! 👋</p>}
                    {messages.map((msg, i) => {
                      const isMe = msg.from === socketId;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "80%", padding: "8px 14px", borderRadius: isMe ? "var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)", background: isMe ? "linear-gradient(135deg, var(--color-accent), #8b5cf6)" : "var(--color-surface-secondary)", color: isMe ? "#fff" : "var(--color-text-primary)", fontSize: "var(--font-size-sm)" }}>
                          {msg.text}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" placeholder="Type a message..." value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface-secondary)", color: "var(--color-text-primary)", fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family)", outline: "none" }} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSendMessage}
                      style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, var(--color-accent), #8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Send size={16} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={leaveRoom}
                      style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", color: "var(--color-error)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <LogOut size={16} />
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
