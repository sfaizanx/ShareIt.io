import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, FileUp } from "lucide-react";

export default function UploadWidget({ targetUser, onSendFiles, sendingFiles = [] }) {
  const onDrop = useCallback((files) => {
    if (!targetUser || !files.length) return;
    onSendFiles(targetUser, files);
  }, [targetUser, onSendFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: !targetUser, noKeyboard: !targetUser });

  return (
    <div>
      <motion.div {...getRootProps()}
        animate={{ borderColor: isDragActive ? "var(--color-accent)" : "var(--color-border-strong)", background: isDragActive ? "var(--color-accent-glow)" : "var(--color-surface-secondary)" }}
        whileHover={targetUser ? { borderColor: "var(--color-accent-light)" } : {}}
        style={{ border: "2px dashed", borderColor: "var(--color-border-strong)", borderRadius: "var(--radius-xl)", padding: "40px 24px", textAlign: "center", cursor: targetUser ? "pointer" : "default", position: "relative", overflow: "hidden" }}
      >
        <input {...getInputProps()} />
        <motion.div animate={{ y: isDragActive ? -8 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
          <div style={{ width: 56, height: 56, borderRadius: "var(--radius-lg)", background: isDragActive ? "linear-gradient(135deg, var(--color-accent), #8b5cf6)" : "var(--color-accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Upload size={24} color={isDragActive ? "#fff" : "var(--color-accent)"} />
          </div>
          {!targetUser ? (
            <>
              <p style={{ fontSize: "var(--font-size-base)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>Select a user first</p>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)" }}>Choose someone from the users list to send files</p>
            </>
          ) : isDragActive ? (
            <p style={{ fontSize: "var(--font-size-base)", fontWeight: 600, color: "var(--color-accent)" }}>Drop files here to send to {targetUser}</p>
          ) : (
            <>
              <p style={{ fontSize: "var(--font-size-base)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>Drop files or click to send to <span style={{ color: "var(--color-accent)" }}>{targetUser}</span></p>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)" }}>Drag & drop files here, or click to browse</p>
            </>
          )}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {sendingFiles.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {sendingFiles.map((file) => (
              <motion.div key={file.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: "12px 16px", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12 }}>
                {file.progress === 100 ? <CheckCircle size={18} color="var(--color-success)" /> : <FileUp size={18} color="var(--color-accent)" />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 500, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{file.name}</span>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>{file.progress}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--color-surface-secondary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${file.progress}%` }}
                      style={{ height: "100%", background: file.progress === 100 ? "var(--color-success)" : "linear-gradient(90deg, var(--color-accent), #8b5cf6)", borderRadius: "var(--radius-full)" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
