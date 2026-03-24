import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search users..." }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <motion.div
      animate={{ borderColor: isFocused ? "var(--color-accent)" : "var(--color-border)", boxShadow: isFocused ? "0 0 0 3px var(--color-accent-glow)" : "none" }}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <Search size={16} color="var(--color-text-tertiary)" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={placeholder}
        style={{ flex: 1, border: "none", background: "transparent", color: "var(--color-text-primary)", fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family)", outline: "none" }} />
      {value && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.8 }}
          onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 0, display: "flex" }}>
          <X size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}
