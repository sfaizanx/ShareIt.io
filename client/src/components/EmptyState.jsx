import { motion } from "framer-motion";
import { Inbox, Users, FileX } from "lucide-react";

const presets = {
  noUsers: { icon: Users, title: "No one's here yet", description: "Share the link with others so they can join and share files with you." },
  noFiles: { icon: Inbox, title: "No files received", description: "Files sent to you will appear here. Start sharing!" },
  noResults: { icon: FileX, title: "No results found", description: "Try a different search term." },
};

export default function EmptyState({ type = "noFiles", title, description }) {
  const p = presets[type] || presets.noFiles;
  const Icon = p.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 72, height: 72, borderRadius: "var(--radius-xl)", background: "var(--color-accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Icon size={32} color="var(--color-accent)" strokeWidth={1.5} />
      </motion.div>
      <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 6 }}>{title || p.title}</h3>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)", maxWidth: 280, lineHeight: 1.5 }}>{description || p.description}</p>
    </motion.div>
  );
}
