export function RoleBackdrop({ theme, swapping }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Layer 1: Dark Gradient Base & Glows (Now covering top AND bottom) */}
      <div style={{
        position: "fixed", inset: 0,
        background: `radial-gradient(circle at 12% 8%, ${theme.glowA}, transparent 35%), radial-gradient(circle at 86% 12%, ${theme.glowB}, transparent 30%), radial-gradient(circle at 80% 65%, ${theme.glowB}, transparent 40%), radial-gradient(circle at 20% 85%, ${theme.glowA}, transparent 40%)`,
        opacity: swapping ? 1 : 0.85, transition: "opacity .45s ease, filter .45s ease",
        filter: swapping ? "saturate(1.08) contrast(1.03)" : "saturate(1)",
      }} />
      
      {/* Layer 2: Subtle Grid Texture */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        opacity: 0.6,
        maskImage: "linear-gradient(to bottom, black 10%, transparent 80%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 80%)"
      }} />

      {/* Layer 3: Faint Floating Particles (Static visual depth via radial bursts) */}
      <div style={{
        position: "fixed", inset: 0,
        background: `radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15) 1px, transparent 0), radial-gradient(1.5px 1.5px at 70% 40%, rgba(255,255,255,0.2) 1px, transparent 0), radial-gradient(2px 2px at 40% 60%, rgba(255,255,255,0.1) 1px, transparent 0), radial-gradient(1px 1px at 80% 80%, rgba(255,255,255,0.15) 1px, transparent 0)`,
        opacity: 0.8, filter: "blur(0.5px)"
      }} />

      {/* Layer 4: Background Typography */}
      <div style={{
        position: "absolute", top: "clamp(80px, 15vh, 120px)", left: "4%",
        transform: swapping ? "scale(1.03)" : "scale(1)",
        transformOrigin: "left top",
        fontFamily: "'Sora', 'Outfit', 'Segoe UI', sans-serif", fontWeight: 700, fontSize: "clamp(40px,10vw,160px)", letterSpacing: "clamp(-1px, -0.2vw, -3px)",
        opacity: 0.012, textTransform: "uppercase", whiteSpace: "nowrap", userSelect: "none",
        transition: "transform .55s ease",
      }}>{theme.watermarkLabel}</div>
      
      {/* Bottom fade */}
      <div style={{
        position: "absolute", inset: "auto 0 0", height: 200,
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
