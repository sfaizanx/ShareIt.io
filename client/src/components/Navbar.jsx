import { motion } from "framer-motion";
import { Moon, Sun, Share2 } from "lucide-react";
import { getInitials, stringToColor } from "../utils/fileUtils";

export default function Navbar({ username, isDark, toggleTheme }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px", borderRadius: 0,
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
        }}>
          <Share2 size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{
          fontSize: "var(--font-size-xl)", fontWeight: 700,
          background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em",
        }}>ShareIt</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={toggleTheme} aria-label="Toggle theme"
          style={{
            width: 40, height: 40, borderRadius: "var(--radius-full)",
            border: "1px solid var(--color-border)", background: "var(--color-surface)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--color-text-secondary)",
          }}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        {username && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              width: 38, height: 38, borderRadius: "var(--radius-full)",
              background: stringToColor(username),
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "var(--font-size-sm)", fontWeight: 700,
              boxShadow: `0 2px 8px ${stringToColor(username)}40`,
            }}>
            {getInitials(username)}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
