export function RoleBackdrop({ theme, swapping }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 12% 8%, ${theme.glowA}, transparent 28%), radial-gradient(circle at 86% 12%, ${theme.glowB}, transparent 26%), linear-gradient(180deg, ${theme.surfaceTop}, transparent 44%)`,
        opacity: swapping ? 1 : 0.92, transition: "opacity .45s ease, filter .45s ease",
        filter: swapping ? "saturate(1.08) contrast(1.03)" : "saturate(1)",
      }} />
      <div style={{
        position: "absolute", top: 128, left: "50%",
        transform: `translateX(-50%) ${swapping ? "scale(1.03)" : "scale(1)"}`,
        fontFamily: "'Sora', 'Outfit', 'Segoe UI', sans-serif", fontWeight: 800, fontSize: "clamp(58px,11vw,150px)", letterSpacing: -5,
        opacity: 0.06, textTransform: "uppercase", whiteSpace: "nowrap", userSelect: "none",
        transition: "transform .55s ease",
      }}>{theme.watermarkLabel}</div>
      <div style={{
        position: "absolute", inset: "auto 0 0", height: 180,
        background: `linear-gradient(180deg, transparent, ${theme.footerGlow})`, opacity: 0.55,
      }} />
    </div>
  );
}

export function PageSwipe({ theme }) {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: "-12vh -24vw",
        transform: "translateX(-120%) skewX(-16deg)",
        background: `linear-gradient(90deg, transparent 0%, ${theme.overlayA} 14%, ${theme.overlayB} 50%, ${theme.overlayA} 86%, transparent 100%)`,
        filter: "blur(1px) saturate(1.35)", opacity: 0,
        animation: "pageSwipe 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
        boxShadow: `0 0 180px ${theme.overlayB}`,
      }} />
      <div style={{
        position: "absolute", inset: "-18vh -24vw",
        transform: "translateX(-135%) skewX(-16deg)",
        background: `linear-gradient(90deg, transparent 0%, ${theme.glowA} 22%, ${theme.glowB} 50%, ${theme.glowA} 78%, transparent 100%)`,
        mixBlendMode: "screen", opacity: 0, filter: "blur(28px)",
        animation: "pageSwipeGlow 1400ms cubic-bezier(0.22,1,0.36,1) forwards",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${theme.overlayB} 0%, transparent 54%)`,
        opacity: 0, animation: "pageSwipeFlash 1400ms ease-out forwards",
      }} />
    </div>
  );
}
