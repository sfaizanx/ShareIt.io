import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Modal from "./Modal";

export default function TextMessageModal({ isOpen, onClose, targetUser, onSend }) {
  const [text, setText] = useState("");
  const handleSend = () => { if (!text.trim()) return; onSend(targetUser, text); setText(""); onClose(); };
  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Message ${targetUser}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Type your message..." autoFocus rows={3}
          style={{ width: "100%", padding: "14px 16px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface-secondary)", color: "var(--color-text-primary)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family)", resize: "vertical", outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border-strong)")} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-family)" }}>Cancel</motion.button>
          <motion.button whileHover={{ scale: 1.02, boxShadow: "0 4px 16px var(--color-accent-glow)" }} whileTap={{ scale: 0.98 }} onClick={handleSend} disabled={!text.trim()}
            style={{ padding: "10px 24px", borderRadius: "var(--radius-md)", border: "none", background: text.trim() ? "linear-gradient(135deg, var(--color-accent), #8b5cf6)" : "var(--color-surface-secondary)", color: text.trim() ? "#fff" : "var(--color-text-tertiary)", fontSize: "var(--font-size-sm)", fontWeight: 600, cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-family)" }}>
            <Send size={14} /> Send
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
