import { C, display, body, mono } from "../../utils/constants";

export function GradText({ children, from, to, as = "span", style }) {
  const Tag = as;
  return (
    <Tag style={{
      backgroundImage: `linear-gradient(95deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style,
    }}>{children}</Tag>
  );
}

export function Blob({ top, left, size, c1, c2, delay = 0 }) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size, pointerEvents: "none",
      background: `radial-gradient(circle at 30% 30%, ${c1}55, ${c2}22 55%, transparent 72%)`,
      filter: "blur(40px)", borderRadius: "50%",
      animation: `drift 14s ease-in-out ${delay}s infinite`, zIndex: 0,
    }} />
  );
}

export function Chip({ children, grad }) {
  return (
    <span style={{
      fontFamily: body, fontSize: 12.5, fontWeight: 600, color: C.hi,
      padding: "7px 14px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6,
      background: "var(--glass-surface)", border: "1px solid var(--glass-line)",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: `linear-gradient(95deg, ${grad[0]}, ${grad[1]})` }} />
      {children}
    </span>
  );
}

export function GlassCard({ children, style, hover = true, className = "" }) {
  return (
    <div className={`${hover ? "lift" : ""} ${className}`.trim()} style={{
      background: "var(--glass-surface)", border: "1px solid var(--glass-line)",
      borderRadius: 20, backdropFilter: "blur(14px)", padding: 24, ...style,
    }}>{children}</div>
  );
}
