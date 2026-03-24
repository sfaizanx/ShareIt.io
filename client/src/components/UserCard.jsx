import { motion } from "framer-motion";
import { FileUp, MessageSquare } from "lucide-react";
import { getInitials, stringToColor } from "../utils/fileUtils";

export default function UserCard({ user, onSendFile, onSendText, index = 0 }) {
  const color = stringToColor(user);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }} transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-md)" }}
      style={{
        background: "var(--color-surface)", borderRadius: "var(--radius-lg)",
        padding: 16, border: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "var(--radius-full)",
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "var(--font-size-sm)", fontWeight: 700,
          }}>{getInitials(user)}</div>
          <div style={{
            position: "absolute", bottom: 0, right: 0, width: 12, height: 12,
            borderRadius: "50%", background: "var(--color-success)",
            border: "2.5px solid var(--color-surface)",
            boxShadow: "0 0 6px rgba(52,211,153,0.4)",
          }} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)", color: "var(--color-text-primary)" }}>{user}</div>
          <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-success)", fontWeight: 500 }}>Online</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => onSendText(user)} title="Send Message"
          style={{
            width: 36, height: 36, borderRadius: "var(--radius-full)", border: "none",
            background: "var(--color-accent-glow)", color: "var(--color-accent)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
          <MessageSquare size={16} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => onSendFile(user)} title="Send File"
          style={{
            width: 36, height: 36, borderRadius: "var(--radius-full)", border: "none",
            background: "linear-gradient(135deg, var(--color-accent), #8b5cf6)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px var(--color-accent-glow)",
          }}>
          <FileUp size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
