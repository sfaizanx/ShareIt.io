export function SkeletonCard() {
  return (
    <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
      <div className="animate-shimmer" style={{ height: 120 }} />
      <div style={{ padding: 16 }}>
        <div className="animate-shimmer" style={{ height: 14, borderRadius: "var(--radius-sm)", marginBottom: 10, width: "70%" }} />
        <div className="animate-shimmer" style={{ height: 10, borderRadius: "var(--radius-sm)", width: "50%" }} />
      </div>
    </div>
  );
}

export function SkeletonUser() {
  return (
    <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 16, border: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12 }}>
      <div className="animate-shimmer" style={{ width: 42, height: 42, borderRadius: "var(--radius-full)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="animate-shimmer" style={{ height: 14, borderRadius: "var(--radius-sm)", marginBottom: 6, width: "60%" }} />
        <div className="animate-shimmer" style={{ height: 10, borderRadius: "var(--radius-sm)", width: "30%" }} />
      </div>
    </div>
  );
}
