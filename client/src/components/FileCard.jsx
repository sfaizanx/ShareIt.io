import { motion } from "framer-motion";
import { Download, FileText, Image, Music, Video, Archive, File, Code, X } from "lucide-react";
import { getFileCategory, getFileExtension, getInitials, stringToColor } from "../utils/fileUtils";

const icons = { image: Image, video: Video, audio: Music, pdf: FileText, archive: Archive, document: FileText, spreadsheet: FileText, presentation: FileText, code: Code, file: File };
const colors = { image: "#ec4899", video: "#f43f5e", audio: "#f59e0b", pdf: "#ef4444", archive: "#6366f1", document: "#3b82f6", spreadsheet: "#10b981", presentation: "#f97316", code: "#8b5cf6", file: "#6b7280" };

export default function FileCard({ file, onClear, index = 0 }) {
  const cat = getFileCategory(file.type);
  const ext = getFileExtension(file.name);
  const Icon = icons[cat] || File;
  const clr = colors[cat] || "#6b7280";
  const isImg = cat === "image";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
      style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden", position: "relative" }}
    >
      {onClear && (
        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
          onClick={() => onClear(file.id)}
          style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "var(--radius-full)", background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, color: "var(--color-text-tertiary)" }}>
          <X size={14} />
        </motion.button>
      )}
      <div style={{ height: 120, background: `linear-gradient(135deg, ${clr}10, ${clr}05)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isImg && file.url ? (
          <img src={file.url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ textAlign: "center" }}>
            <Icon size={36} color={clr} strokeWidth={1.5} />
            {ext && <div style={{ marginTop: 6, fontSize: "var(--font-size-xs)", fontWeight: 600, color: clr, textTransform: "uppercase", letterSpacing: "0.05em" }}>.{ext}</div>}
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }} title={file.name}>{file.name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: "var(--radius-full)", background: stringToColor(file.from), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 8, fontWeight: 700 }}>{getInitials(file.from)}</div>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>{file.from}</span>
          </div>
          <motion.a whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            href={file.url} download={file.name}
            style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: "linear-gradient(135deg, var(--color-accent), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", boxShadow: "0 2px 8px var(--color-accent-glow)" }}>
            <Download size={14} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
