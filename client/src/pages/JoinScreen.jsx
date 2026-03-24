import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Share2, Zap, Shield, Globe } from "lucide-react";

/**
 * JoinScreen — full-screen premium onboarding with animated background.
 */
export default function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {/* Animated background blobs */}
      <div className="blob animate-float" style={{ width: 400, height: 400, top: "-10%", left: "-10%", background: "linear-gradient(135deg, #6366f1, #a855f7)" }} />
      <div className="blob animate-float" style={{ width: 300, height: 300, bottom: "-5%", right: "-5%", background: "linear-gradient(135deg, #ec4899, #f43f5e)", animationDelay: "-3s" }} />
      <div className="blob animate-float" style={{ width: 200, height: 200, top: "60%", left: "60%", background: "linear-gradient(135deg, #06b6d4, #14b8a6)", animationDelay: "-5s" }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass"
        style={{
          borderRadius: "var(--radius-2xl)",
          padding: "48px 40px",
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: 64, height: 64, borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
          }}
        >
          <Share2 size={28} color="#fff" strokeWidth={2} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{
            fontSize: "var(--font-size-3xl)", fontWeight: 800,
            background: "linear-gradient(135deg, var(--color-accent), #a855f7, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 8, letterSpacing: "-0.03em",
          }}
        >
          ShareIt
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-secondary)", marginBottom: 32, lineHeight: 1.6 }}
        >
          Instantly share files & messages with anyone nearby. No sign-up required.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}
        >
          {[
            { icon: Zap, label: "Instant" },
            { icon: Shield, label: "Secure" },
            { icon: Globe, label: "No limits" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "var(--radius-md)",
                background: "var(--color-accent-glow)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} color="var(--color-accent)" />
              </div>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Join form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            style={{
              padding: "14px 18px", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface-secondary)", color: "var(--color-text-primary)",
              fontSize: "var(--font-size-base)", fontFamily: "var(--font-family)",
              outline: "none", textAlign: "center", fontWeight: 500,
              transition: "var(--transition-fast)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-strong)")}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px var(--color-accent-glow)" }}
            whileTap={{ scale: 0.98 }}
            disabled={!name.trim()}
            style={{
              padding: "14px 24px", borderRadius: "var(--radius-lg)", border: "none",
              background: name.trim()
                ? "linear-gradient(135deg, var(--color-accent), #8b5cf6)"
                : "var(--color-surface-secondary)",
              color: name.trim() ? "#fff" : "var(--color-text-tertiary)",
              fontSize: "var(--font-size-base)", fontWeight: 600, cursor: name.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "var(--font-family)", transition: "var(--transition-fast)",
              boxShadow: name.trim() ? "0 4px 16px var(--color-accent-glow)" : "none",
            }}
          >
            Get Started <ArrowRight size={18} />
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
