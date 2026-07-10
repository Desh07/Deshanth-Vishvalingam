import { useState, useEffect, useRef, startTransition, useCallback } from "react";
import {
  Mail, MapPin, ArrowUpRight, Sparkles, TestTube2, ClipboardCheck,
  Code2, Bug, Workflow, Database, GitBranch, Smartphone, Layers, Boxes,
  Quote, Wand2, Rocket, Menu, X, ChevronLeft, ChevronRight,
  Utensils, ShoppingBag, Scissors, Building2, CheckCircle2, Clock, Zap, Star,
  ImagePlus, Download, ExternalLink, Loader2, MessageSquare, HelpCircle, ArrowUp
} from "lucide-react";

const C = {
  bg: "#0B0915", bg2: "#100C1F",
  hi: "#F6F4FF", mid: "#B7AFD6", low: "#6E6790",
  line: "rgba(255,255,255,0.08)", glass: "rgba(255,255,255,0.045)",
  qa1: "#34E6C4", qa2: "#7C5CFF",
  fl1: "#FF7A59", fl2: "#FFC857",
};

const display = "'Sora', 'Outfit', 'Segoe UI', sans-serif";
const body = "'Inter', 'Segoe UI', sans-serif";
const mono = "'JetBrains Mono', monospace";

/* ── hooks ─────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* ── primitives ─────────────────────────────────────────────── */
function GradText({ children, from, to, as = "span", style }) {
  const Tag = as;
  return (
    <Tag style={{
      backgroundImage: `linear-gradient(95deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style,
    }}>{children}</Tag>
  );
}

function Blob({ top, left, size, c1, c2, delay = 0 }) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size, pointerEvents: "none",
      background: `radial-gradient(circle at 30% 30%, ${c1}55, ${c2}22 55%, transparent 72%)`,
      filter: "blur(40px)", borderRadius: "50%",
      animation: `drift 14s ease-in-out ${delay}s infinite`, zIndex: 0,
    }} />
  );
}

function Chip({ children, grad }) {
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

function GlassCard({ children, style, hover = true, className = "" }) {
  return (
    <div className={`${hover ? "lift" : ""} ${className}`.trim()} style={{
      background: "var(--glass-surface)", border: "1px solid var(--glass-line)",
      borderRadius: 20, backdropFilter: "blur(14px)", padding: 24, ...style,
    }}>{children}</div>
  );
}

/* ── ambient layers ─────────────────────────────────────────── */
function RoleBackdrop({ theme, swapping }) {
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
        fontFamily: display, fontWeight: 800, fontSize: "clamp(58px,11vw,150px)", letterSpacing: -5,
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

function PageSwipe({ theme }) {
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

/* ── reusable cards ─────────────────────────────────────────── */
function ProjectCard({ icon, title, tags, desc, grad, status, githubUrl }) {
  return (
    <GlassCard style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%",
        background: `radial-gradient(circle, ${grad[0]}30, transparent 70%)`, pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
          background: `linear-gradient(135deg, ${grad[0]}30, ${grad[1]}18)`, border: `1px solid ${grad[0]}40`, color: grad[0],
        }}>{icon}</div>
        {status && (
          <span style={{
            fontFamily: body, fontSize: 11, fontWeight: 700, color: grad[1],
            background: `${grad[1]}18`, border: `1px solid ${grad[1]}40`, borderRadius: 999, padding: "4px 10px",
          }}>{status}</span>
        )}
      </div>
      <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, color: C.hi, margin: 0 }}>{title}</h3>
      <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.65, margin: 0, flex: 1 }}>{desc}</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {tags.map((t, i) => (
          <span key={i} style={{ fontFamily: mono, fontSize: 10.5, color: C.mid, background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 8px" }}>{t}</span>
        ))}
      </div>
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontFamily: body, fontSize: 13, fontWeight: 600, color: grad[0],
            background: `${grad[0]}12`, border: `1px solid ${grad[0]}30`,
            borderRadius: 10, padding: "8px 14px", transition: "background .2s ease, border-color .2s ease",
            textDecoration: "none", alignSelf: "flex-start",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${grad[0]}22`; e.currentTarget.style.borderColor = `${grad[0]}55`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${grad[0]}12`; e.currentTarget.style.borderColor = `${grad[0]}30`; }}
        >
          <GitBranch size={14} />
          View on GitHub
          <ExternalLink size={12} />
        </a>
      )}
    </GlassCard>
  );
}

function SkillPanel({ icon, title, grad, items }) {
  return (
    <GlassCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${grad[0]}30, ${grad[1]}18)`, color: grad[0] }}>{icon}</div>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 15.5, color: C.hi }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {items.map((it, i) => (
          <span key={i} style={{ fontFamily: body, fontSize: 12.5, color: C.mid, padding: "6px 11px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>{it}</span>
        ))}
      </div>
    </GlassCard>
  );
}

function MagButton({ children, href, primary, grad, onClick, small, download }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <a href={href} download={download} onClick={onClick} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setT({ x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{
        display: "inline-flex", alignItems: "center", gap: small ? 6 : 9, fontFamily: body, fontWeight: 700,
        fontSize: small ? 13 : 14.5, padding: small ? "9px 16px" : "13px 24px",
        borderRadius: 999, transition: "transform .15s ease", whiteSpace: "nowrap",
        transform: `translate(${t.x}px, ${t.y}px)`,
        background: primary ? `linear-gradient(95deg, ${grad[0]}, ${grad[1]})` : "transparent",
        color: primary ? "#0B0915" : C.hi,
        border: primary ? "none" : "1px solid var(--glass-line)",
        flexShrink: 0,
        cursor: "pointer",
      }}>{children}</a>
  );
}



/* ── ClientCarousel (Projects section — "who I build for") ──── */
/* Drop your own photos in later: just replace each `imageSrc` below
   with a real file path (e.g. "/images/restaurant.jpg"). Until then,
   a clearly-labelled placeholder is shown in its place so it's obvious
   exactly where - and at what path - each image belongs. */
const CLIENT_CARDS = [
  {
    icon: <Utensils size={26} />, label: "FOR RESTAURANTS & CAFES",
    headline: "Your Menu Deserves to Be Online",
    body: "Let customers find you, browse your menu and book a table - before they even step in.",
    tag: "Menus · Reservations · Location",
    accent: "#FF7A59", accent2: "#FFC857",
    imageSrc: "/restaurants.png",
    fallbackBg: "linear-gradient(135deg, #1a0a05 0%, #2d1408 50%, #1a0f02 100%)",
    glow: "rgba(255,122,89,0.35)",
  },
  {
    icon: <ShoppingBag size={26} />, label: "FOR SHOPS & BOUTIQUES",
    headline: "Sell More Than Just In-Store",
    body: "Showcase your products, take orders and grow your customer base - with a store that never closes.",
    tag: "Product pages · Order forms · Built for you",
    accent: "#C084FC", accent2: "#F0ABFC",
    imageSrc: "/boutiques.png",
    fallbackBg: "linear-gradient(135deg, #0d0515 0%, #1a0828 50%, #0d0515 100%)",
    glow: "rgba(192,132,252,0.35)",
  },
  {
    icon: <Scissors size={26} />, label: "FOR SALONS & FREELANCERS",
    headline: "Let Clients Book You While You Work",
    body: "A professional booking page that shows your services, your work and availability - 24/7.",
    tag: "Service pages · Booking forms · Your brand",
    accent: "#F472B6", accent2: "#FB7185",
    imageSrc: "/saloon.png",
    fallbackBg: "linear-gradient(135deg, #150510 0%, #280818 50%, #150510 100%)",
    glow: "rgba(244,114,182,0.35)",
  },
  {
    icon: <Building2 size={26} />, label: "FOR LOCAL BUSINESSES",
    headline: "Starting Something New?",
    body: "Whether it's a new venture or an existing one, we build you a website that brings customers through your door.",
    tag: "Fast delivery · Affordable pricing · Built around you",
    accent: "#38BDF8", accent2: "#818CF8",
    imageSrc: "/local_businesses.png",
    fallbackBg: "linear-gradient(135deg, #020d18 0%, #051428 50%, #020d18 100%)",
    glow: "rgba(56,189,248,0.35)",
  },
];

function ClientCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(null);
  const [imgFailed, setImgFailed] = useState({});
  const AUTOPLAY_MS = 3000;

  const go = useCallback((next, d = "left") => {
    setDir(d);
    setTimeout(() => { setActive(next); setDir(null); }, 260);
  }, []);

  const prev = () => go((active - 1 + CLIENT_CARDS.length) % CLIENT_CARDS.length, "right");
  const next = useCallback(() => go((active + 1) % CLIENT_CARDS.length, "left"), [active, go]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, next]);

  const card = CLIENT_CARDS[active];
  const showImage = Boolean(card.imageSrc) && !imgFailed[active];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ marginBottom: 52 }}>
      <div style={{ marginBottom: 22 }}>
        <span style={{ fontFamily: mono, fontSize: 12, color: C.fl1, letterSpacing: 1 }}>WHO I BUILD FOR</span>
        <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", margin: "8px 0 4px", color: C.hi }}>
          Every Business Deserves a <GradText from={C.fl1} to={C.fl2}>Great Website</GradText>
        </h2>
        <p style={{ color: C.mid, fontSize: 14, margin: 0 }}>Slide through to see what I can build for your kind of business.</p>
      </div>

      {/* Main slide */}
      <div style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        border: `1px solid ${card.accent}28`,
        background: card.fallbackBg,
        boxShadow: `0 0 60px -20px ${card.glow}, 0 2px 0 inset rgba(255,255,255,0.06)`,
        height: 320,
        opacity: dir ? 0 : 1,
        transform: dir === "left" ? "translateX(-18px)" : dir === "right" ? "translateX(18px)" : "translateX(0)",
        transition: dir ? "opacity .26s ease, transform .26s ease" : "opacity .26s ease, transform .26s ease, box-shadow .5s ease, border-color .5s ease",
      }}>
        {/* Photo background — real image if it loads, otherwise a clear placeholder */}
        {showImage ? (
          <img
            src={card.imageSrc}
            alt=""
            aria-hidden="true"
            onError={() => setImgFailed((prev) => ({ ...prev, [active]: true }))}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center right",
              filter: "saturate(1.08) contrast(1.04) brightness(0.82)",
              transition: "opacity .5s ease",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
            background: `linear-gradient(135deg, ${card.accent}14, transparent 60%)`,
          }}>
            <div style={{
              position: "absolute", inset: 14, borderRadius: 16,
              border: `1.5px dashed ${card.accent}55`, pointerEvents: "none",
            }} />
            <div style={{
              width: 52, height: 52, borderRadius: 14, display: "grid", placeItems: "center",
              background: `${card.accent}16`, border: `1px solid ${card.accent}40`, color: card.accent,
            }}>
              <ImagePlus size={22} />
            </div>
            <span style={{ fontFamily: body, fontWeight: 600, fontSize: 13, color: C.mid }}>Image placeholder</span>
            <span style={{ fontFamily: mono, fontSize: 11, color: card.accent, background: `${card.accent}14`, border: `1px solid ${card.accent}30`, borderRadius: 999, padding: "4px 10px" }}>
              add file at {card.imageSrc}
            </span>
          </div>
        )}
        {/* Left-side dark gradient so text stays readable */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.12) 75%, transparent 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", width: 220, height: 220, opacity: 0.055, display: "flex", alignItems: "center", justifyContent: "center", color: card.accent, pointerEvents: "none" }}>
          <div style={{ transform: "scale(6)" }}>{card.icon}</div>
        </div>

        <div style={{
          position: "relative", zIndex: 2,
          padding: "24px 32px",
          maxWidth: 620,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          textAlign: "left",
          gap: 12,
          boxSizing: "border-box",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${card.accent}18`, border: `1px solid ${card.accent}40`, borderRadius: 999, padding: "6px 14px 6px 8px", alignSelf: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${card.accent}40, ${card.accent2}20)`, color: card.accent, flexShrink: 0 }}>{card.icon}</div>
            <span style={{ fontFamily: mono, fontSize: 10.5, color: card.accent, fontWeight: 700, letterSpacing: 1 }}>{card.label}</span>
          </div>
          <h3 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(18px,2.8vw,28px)", color: C.hi, margin: 0, lineHeight: 1.2 }}>{card.headline}</h3>
          <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.65, margin: 0, maxWidth: 460 }}>{card.body}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${card.accent}10`, border: `1px solid ${card.accent}25`, borderRadius: 10, padding: "7px 12px", alignSelf: "flex-start" }}>
            <Zap size={12} style={{ color: card.accent }} />
            <span style={{ fontFamily: body, fontSize: 12.5, color: card.accent, fontWeight: 600 }}>{card.tag}</span>
          </div>
        </div>

        {/* progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.06)" }}>
          <div key={`${active}-${paused}`} style={{
            height: "100%", background: `linear-gradient(90deg, ${card.accent}, ${card.accent2})`,
            borderRadius: 2,
            animation: paused ? "none" : `carouselProgress ${AUTOPLAY_MS}ms linear forwards`,
            width: paused ? "30%" : undefined,
          }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {CLIENT_CARDS.map((c, i) => (
            <button key={i} onClick={() => go(i, i > active ? "left" : "right")} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === active ? 28 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
              background: i === active ? `linear-gradient(90deg, ${card.accent}, ${card.accent2})` : "rgba(255,255,255,0.15)",
              transition: "width .35s ease, background .35s ease",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ fn: prev, Icon: ChevronLeft, label: "Previous" }, { fn: next, Icon: ChevronRight, label: "Next" }].map(({ fn, Icon, label }) => (
            <button key={label} onClick={fn} aria-label={label} style={{
              width: 40, height: 40, borderRadius: "50%", border: `1px solid ${card.accent}35`,
              background: `${card.accent}10`, color: card.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              transition: "background .2s ease",
            }}><Icon size={18} /></button>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ── FreelanceStats ─────────────────────────────────────────── */
function FreelanceStats() {
  return (
    <div className="statsGrid" style={{ marginBottom: 52 }}>
      {[
        { n: "7–14", label: "Days average delivery" },
        { n: "5+", label: "Projects shipped" },
        { n: "100%", label: "Mobile responsive" },
        { n: "1:1", label: "Direct communication" },
      ].map((s, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: C.fl1 }}>{s.n}</div>
          <div style={{ fontFamily: body, fontSize: 12.5, color: C.mid, marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── WhatYouGet ─────────────────────────────────────────────── */
function WhatYouGet() {
  const perks = [
    { icon: <Smartphone size={18} />, title: "Mobile-First Design", desc: "Looks perfect on every screen - phones, tablets, desktops." },
    { icon: <Zap size={18} />, title: "Fast Delivery", desc: "Most sites delivered in 7-14 days. No endless back-and-forth." },
    { icon: <CheckCircle2 size={18} />, title: "Real Customisation", desc: "Built around your brand. Not a template dressed up." },
    { icon: <Clock size={18} />, title: "Always Reachable", desc: "Direct access to me - no middlemen, no delays." },
    { icon: <Star size={18} />, title: "Affordable Pricing", desc: "Professional results without the agency price tag." },
    { icon: <Code2 size={18} />, title: "QA-Tested Code", desc: "Every site is tested before handoff. Bugs caught before launch." },
  ];
  return (
    <div style={{ marginBottom: 52 }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontFamily: mono, fontSize: 12, color: C.fl1, letterSpacing: 1 }}>WHAT YOU GET</span>
        <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", margin: "8px 0 0", color: C.hi }}>
          Why Clients <GradText from={C.fl1} to={C.fl2}>Choose Me</GradText>
        </h2>
      </div>
      <div className="grid3">
        {perks.map((p, i) => (
          <GlassCard key={i} style={{ display: "flex", flexDirection: "column", gap: 10, padding: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${C.fl1}25, ${C.fl2}15)`, border: `1px solid ${C.fl1}30`, color: C.fl1 }}>{p.icon}</div>
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 15, color: C.hi }}>{p.title}</span>
            <span style={{ fontFamily: body, fontSize: 13.5, color: C.mid, lineHeight: 1.65 }}>{p.desc}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ── MockupForm ────────────────────────────────────────────── */
function MockupForm({ isOpen, onClose }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", bizName: "", category: "", describe: "", existingUrl: "", style: "Modern", refs: "" });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (nameRef.current) {
        // Small delay to allow animation to start before focus
        setTimeout(() => nameRef.current.focus(), 300);
      }
    } else {
      // Reset when closed
      setStatus("idle");
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.bizName.trim()) e.bizName = "Required";
    if (!form.describe.trim()) e.describe = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    await new Promise(r => setTimeout(r, 1200));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div ref={formRef} style={{ padding: 40, background: "rgba(255,255,255,0.03)", borderRadius: 20, border: `1px solid ${C.line}`, textAlign: "center", marginTop: 24, marginBottom: 24 }}>
        <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "rgba(52,230,196,0.1)", color: "#34E6C4", marginBottom: 16 }}>
          <CheckCircle2 size={36} />
        </div>
        <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 24, color: C.hi, margin: "0 0 12px" }}>✅ Mockup Request Received</h3>
        <p style={{ fontFamily: body, color: C.mid, fontSize: 15, margin: "0 auto 16px", maxWidth: 400, lineHeight: 1.6 }}>
          Thank you! I'll review your business and contact you using the email you provided.
        </p>
        <p style={{ fontFamily: mono, fontSize: 12, color: C.low, margin: "0 0 28px" }}>Expected response time: 24-48 hours.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", bizName: "", category: "", describe: "", existingUrl: "", style: "Modern", refs: "" }); }} style={{ fontFamily: body, fontWeight: 600, fontSize: 14, padding: "10px 18px", borderRadius: 999, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.05)", color: C.hi, cursor: "pointer", transition: "background .2s ease" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
            Request Another Concept
          </button>
          <button onClick={onClose} style={{ fontFamily: body, fontWeight: 600, fontSize: 14, padding: "10px 18px", borderRadius: 999, border: "none", background: "transparent", color: C.low, cursor: "pointer", transition: "color .2s ease" }} onMouseEnter={e => e.currentTarget.style.color = C.hi} onMouseLeave={e => e.currentTarget.style.color = C.low}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} style={{ marginTop: 24, marginBottom: 24, padding: "32px 36px", background: "rgba(255,255,255,0.02)", borderRadius: 20, border: `1px solid ${C.line}` }}>
      <div style={{ marginBottom: 26, textAlign: "center" }}>
        <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 22, color: C.hi, margin: "0 0 8px" }}>Claim Free Mockup</h3>
        <p style={{ fontFamily: body, color: C.mid, fontSize: 14.5, margin: "0 auto 16px", maxWidth: 400 }}>I'll design a free homepage concept tailored to your business.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
          {["One custom homepage concept", "Designed specifically for your business", "No payment required", "No obligation to hire me"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: body, fontSize: 13, color: C.mid }}>
              <CheckCircle2 size={15} style={{ color: C.fl1 }} /> {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="formRow">
          <div className="formField">
            <label className="formLabel">Full Name *</label>
            <input ref={nameRef} className="formInput" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(e => ({ ...e, name: null })); }} placeholder="Jane Doe" disabled={status === "sending"} />
            {errors.name && <span style={{ color: "#FF6B6B", fontSize: 12, fontFamily: body, marginTop: 4 }}>{errors.name}</span>}
          </div>
          <div className="formField">
            <label className="formLabel">Email Address *</label>
            <input className="formInput" type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e => ({ ...e, email: null })); }} placeholder="jane@example.com" disabled={status === "sending"} />
            {errors.email && <span style={{ color: "#FF6B6B", fontSize: 12, fontFamily: body, marginTop: 4 }}>{errors.email}</span>}
          </div>
        </div>

        <div className="formRow">
          <div className="formField">
            <label className="formLabel">Business Name *</label>
            <input className="formInput" value={form.bizName} onChange={e => { setForm(f => ({ ...f, bizName: e.target.value })); setErrors(e => ({ ...e, bizName: null })); }} placeholder="Jane's Cafe" disabled={status === "sending"} />
            {errors.bizName && <span style={{ color: "#FF6B6B", fontSize: 12, fontFamily: body, marginTop: 4 }}>{errors.bizName}</span>}
          </div>
          <div className="formField">
            <label className="formLabel">Business Category</label>
            <select className="formSelect" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} disabled={status === "sending"}>
              <option value="" style={{ background: "#1A1525", color: "#F6F4FF" }}>Select a category</option>
              {["Restaurant", "Cafe", "Clothing Store", "Salon / Beauty", "Real Estate", "Fitness / Gym", "Technology", "Education", "Other"].map(c => <option key={c} value={c} style={{ background: "#1A1525", color: "#F6F4FF" }}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="formField">
          <label className="formLabel">Describe Your Business *</label>
          <textarea className="formTextarea" rows={3} value={form.describe} onChange={e => { setForm(f => ({ ...f, describe: e.target.value })); setErrors(e => ({ ...e, describe: null })); }} placeholder="What do you do? Who are your customers?" disabled={status === "sending"} />
          {errors.describe && <span style={{ color: "#FF6B6B", fontSize: 12, fontFamily: body, marginTop: 4 }}>{errors.describe}</span>}
        </div>

        <div className="formField">
          <label className="formLabel">Existing Website URL (optional)</label>
          <input className="formInput" value={form.existingUrl} onChange={e => setForm(f => ({ ...f, existingUrl: e.target.value }))} placeholder="https://..." disabled={status === "sending"} />
        </div>

        <div className="formField">
          <label className="formLabel">Preferred Design Style</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Modern", "Minimal", "Luxury", "Dark", "Creative"].map(s => (
              <button key={s} type="button" onClick={() => setForm(f => ({ ...f, style: s }))} style={{
                fontFamily: body, fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                background: form.style === s ? `${C.fl1}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${form.style === s ? C.fl1 : C.line}`,
                color: form.style === s ? C.fl1 : C.mid,
                transition: "all .2s ease"
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="formField">
          <label className="formLabel">Reference Website Links (optional)</label>
          <textarea className="formTextarea" rows={2} value={form.refs} onChange={e => setForm(f => ({ ...f, refs: e.target.value }))} placeholder="Links to websites you like the look of..." disabled={status === "sending"} />
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={handleSubmit} disabled={status === "sending"} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px", borderRadius: 999, border: "none",
            background: `linear-gradient(95deg, ${C.fl1}, ${C.fl2})`, color: "#0B0915", fontFamily: body, fontWeight: 700, fontSize: 14.5,
            cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.7 : 1, transition: "opacity .2s ease, transform .2s ease"
          }} onMouseEnter={e => e.currentTarget.style.transform = status === "sending" ? "none" : "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            {status === "sending" ? <Loader2 className="spin" size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Rocket size={16} />}
            Submit Mockup Request
          </button>
          <button onClick={onClose} type="button" style={{
            fontFamily: body, fontWeight: 600, fontSize: 14.5, padding: "12px 20px", borderRadius: 999, border: "none",
            background: "transparent", color: C.mid, cursor: "pointer", transition: "color .2s ease"
          }} onMouseEnter={e => e.currentTarget.style.color = C.hi} onMouseLeave={e => e.currentTarget.style.color = C.mid}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── FreelanceCTA banner ────────────────────────────────────── */
function FreelanceCTA({ goTo }) {
  const [isMockupOpen, setIsMockupOpen] = useState(false);

  return (
    <div style={{ marginBottom: 52 }}>
      <div style={{
        borderRadius: 20, overflow: "hidden", position: "relative",
        background: "linear-gradient(135deg, rgba(255,122,89,0.12), rgba(255,200,87,0.08))",
        border: "1px solid rgba(255,122,89,0.22)", padding: "32px 36px",
        display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 32, flexWrap: "wrap",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,87,0.18), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ flex: "1 1 400px" }}>
          <p style={{ fontFamily: mono, fontSize: 11, color: C.fl1, letterSpacing: 1, margin: "0 0 8px" }}>FREE OFFER</p>
          <h3 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(18px,2.5vw,24px)", margin: "0 0 8px", color: C.hi }}>
            Get a Free Homepage Mockup in 48 Hours
          </h3>
          <p style={{ fontFamily: body, fontSize: 14, color: C.mid, margin: 0, lineHeight: 1.6 }}>
            Tell me your business name and what you do - I'll design a free homepage mockup with no commitment and no payment. Just a real preview of what your site could look like.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <MagButton onClick={() => setIsMockupOpen(v => !v)} primary grad={[C.fl1, C.fl2]}>
            Claim Free Mockup
          </MagButton>
        </div>
      </div>

      <div className={`mockup-wrapper ${isMockupOpen ? "open" : ""}`}>
        <div className="mockup-inner">
          <MockupForm isOpen={isMockupOpen} onClose={() => setIsMockupOpen(false)} />
        </div>
      </div>
    </div>
  );
}

/* ── ToggleChips ─────────────────────────────────────────────── */
function ToggleChips({ options, selected, onChange, accent }) {
  const toggle = (val) =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => {
        const on = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)} style={{
            fontFamily: body, fontSize: 12.5, fontWeight: 600, padding: "7px 14px",
            borderRadius: 999, cursor: "pointer",
            border: `1px solid ${on ? accent : "rgba(255,255,255,0.12)"}`,
            background: on ? `${accent}20` : "rgba(255,255,255,0.04)",
            color: on ? accent : C.mid,
            transition: "all .18s ease",
          }}>
            {on ? "✓ " : ""}{opt}
          </button>
        );
      })}
    </div>
  );
}

/* ── WebDevWizard (4-step project discovery wizard) ─────────── */
function WebDevWizard() {
  const STEPS = 4;
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState("fwd");
  const [animKey, setAK] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", brand: "",
    projectType: "",
    features: [],
    budget: "", timeline: "", description: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | sending | success | error

  const pct = Math.round((step / STEPS) * 100);

  const PROJECT_TYPES = [
    { v: "business", emoji: "🌐", label: "Business Website", desc: "For companies & services" },
    { v: "ecommerce", emoji: "🛒", label: "E-commerce", desc: "Online store & payments" },
    { v: "portfolio", emoji: "💼", label: "Portfolio", desc: "Personal brand showcase" },
    { v: "webapp", emoji: "🚀", label: "Web Application", desc: "Custom interactive platform" },
    { v: "landing", emoji: "📄", label: "Landing Page", desc: "Marketing or product page" },
  ];
  const FEATURES = ["Authentication System", "Payment Integration", "Admin Dashboard", "Database Integration", "API Integration", "Responsive Design", "SEO Optimization"];
  const BUDGETS = [{ v: "under100", l: "Under $100" }, { v: "100-300", l: "$100 – $300" }, { v: "300-600", l: "$300 – $600" }, { v: "discuss", l: "To be discussed" }];
  const TIMELINES = [{ v: "lt1m", l: "< 1 Month" }, { v: "1-3m", l: "1–3 Months" }, { v: "gt3m", l: "3+ Months" }, { v: "nd", l: "Not decided" }];

  const LABELS = [
    null,
    { title: "Let's get to know each other", sub: "Let's start with the basics" },
    { title: "Tell me about your idea", sub: "What kind of digital product do you need?" },
    { title: "What should your website include?", sub: "Select everything your project should include" },
    { title: "Project scope & expectations", sub: "Budget, timeline & anything else you want me to know" },
  ];

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = "Full name is required.";
      if (!form.email.trim()) e.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    }
    if (step === 2 && !form.projectType) e.projectType = "Please pick a project type.";
    if (step === 4 && !form.description.trim()) e.description = "Project description is required.";
    return e;
  };

  const nav = (newStep, d) => {
    const errs = validate();
    if (d === "fwd" && Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setDir(d);
    setAK(k => k + 1);
    setStep(newStep);

    setTimeout(() => {
      const el = document.getElementById("web-wizard-form");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    try {
      const payload = {
        service_id: 'service_iubln6c',
        template_id: 'template_8w9mhuh',
        user_id: 'vKomMY0Ucy8yxdOAP',
        template_params: {
          name: form.name,
          email: form.email,
          brand: form.brand || "N/A",
          projectType: PROJECT_TYPES.find(p => p.v === form.projectType)?.label || form.projectType,
          features: form.features.length ? form.features.join(", ") : "None",
          budget: BUDGETS.find(b => b.v === form.budget)?.l || form.budget,
          timeline: TIMELINES.find(t => t.v === form.timeline)?.l || form.timeline,
          description: form.description,
          time: new Date().toLocaleString()
        }
      };
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("EmailJS Error");
      setStatus("success");
    } catch { setStatus("error"); }
  };

  const hc = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };
  const ErrMsg = ({ field }) => errors[field]
    ? <span style={{ display: "block", fontFamily: body, fontSize: 12, color: "#FF6B6B", marginTop: 4 }}>{errors[field]}</span>
    : null;

  /* ── Selectable card helper ── */
  const SelCard = ({ val, field, emoji, label, desc, big }) => {
    const on = form[field] === val;
    const cl = big ? `selCard${on ? " on" : ""}` : `selCardSm${on ? " on" : ""}`;
    return (
      <div className={cl} onClick={() => hc(field, val)} style={{
        border: `1.5px solid ${on ? C.fl1 : "rgba(255,255,255,0.09)"}`,
        background: on ? `${C.fl1}12` : "rgba(255,255,255,0.03)",
        boxShadow: on ? `0 6px 22px -10px ${C.fl1}55` : "none",
      }}>
        {big && <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>}
        {!big && emoji && <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>}
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: big ? 14 : 13.5, color: on ? C.fl1 : C.hi }}>{label}</div>
        {big && desc && <div style={{ fontFamily: body, fontSize: 12, color: C.low, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>}
      </div>
    );
  };

  /* ── Success screen ── */
  if (status === "success") {
    const refId = `WEB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return (
      <div style={{ textAlign: "center", padding: "40px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.fl1}18`, border: `2px solid ${C.fl1}44`, display: "grid", placeItems: "center" }}>
          <CheckCircle2 size={40} style={{ color: C.fl1 }} />
        </div>
        <div>
          <h3 style={{ fontFamily: display, fontWeight: 800, fontSize: 24, margin: "0 0 8px", color: C.hi }}>Request Successfully Submitted</h3>
          <p style={{ fontFamily: mono, fontSize: 13, color: C.fl1, margin: "0 0 12px", letterSpacing: 0.5 }}>Reference ID: {refId}</p>
          <p style={{ fontFamily: body, fontSize: 15, color: C.mid, margin: 0, maxWidth: 400 }}>Thank you, <strong style={{ color: C.hi }}>{form.name}</strong>! Your consultation request has been received.</p>
        </div>

        <div style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, textAlign: "left" }}>
          <h4 style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: C.hi, margin: "0 0 16px" }}>What happens now?</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "I will review your requirements",
              "I will contact you for clarification if needed",
              "We will discuss the next steps"
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: C.fl1 }} />
                <span style={{ fontFamily: body, fontSize: 14, color: C.mid }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>

          <button onClick={() => { setStatus(null); setStep(1); setForm({ name: "", email: "", brand: "", projectType: "", features: [], budget: "", timeline: "", description: "" }); window.localStorage.removeItem("web-form"); window.localStorage.removeItem("web-step"); }}
            style={{ fontFamily: body, fontWeight: 600, fontSize: 13, color: C.mid, background: "transparent", border: "none", cursor: "pointer" }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const ErrorBanner = () => status === "error" ? (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
      <X size={16} style={{ color: "#FF6B6B", flexShrink: 0 }} />
      <span style={{ fontFamily: body, fontSize: 13.5, color: C.hi }}>Something went wrong. Email me at <a href="mailto:hello.deshanth@gmail.com" style={{ color: C.fl1 }}>hello.deshanth@gmail.com</a></span>
    </div>
  ) : null;

  /* ── Nav buttons ── */
  const NavRow = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      {step > 1
        ? <button type="button" onClick={() => nav(step - 1, "bwd")} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: body, fontWeight: 600, fontSize: 14, color: C.mid, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "10px 20px", cursor: "pointer", transition: "all .2s ease" }}
          onMouseEnter={e => e.currentTarget.style.color = C.hi} onMouseLeave={e => e.currentTarget.style.color = C.mid}>
          <ChevronRight size={15} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
        : <span />}
      {step < STEPS
        ? <button type="button" onClick={() => nav(step + 1, "fwd")} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: body, fontWeight: 700, fontSize: 14, color: "#0B0915", background: `linear-gradient(95deg,${C.fl1},${C.fl2})`, border: "none", borderRadius: 999, padding: "11px 26px", cursor: "pointer", transition: "all .2s ease", boxShadow: `0 6px 20px -10px ${C.fl1}66` }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          Next <ChevronRight size={15} />
        </button>
        : <button type="button" onClick={handleSubmit} disabled={status === "sending"}
          style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: body, fontWeight: 700, fontSize: 14, color: "#0B0915", background: `linear-gradient(95deg,${C.fl1},${C.fl2})`, border: "none", borderRadius: 999, padding: "11px 26px", cursor: "pointer", opacity: status === "sending" ? 0.7 : 1, boxShadow: `0 6px 20px -10px ${C.fl1}66` }}>
          {status === "sending" ? <><span style={{ animation: "spinSlow 1s linear infinite", display: "inline-block" }}>⟳</span> Sending…</> : <><Rocket size={15} /> Request Website Consultation</>}
        </button>}
    </div>
  );

  return (
    <div id="web-wizard-form">
      <ProgressTracker step={step} total={STEPS} color={C.fl1} />
      {/* Step heading */}
      <div style={{ marginBottom: 22 }}>
        <h3 style={{ fontFamily: display, fontWeight: 800, fontSize: 20, margin: "0 0 4px", color: C.hi }}>{LABELS[step]?.title}</h3>
        <p style={{ fontFamily: body, fontSize: 13.5, color: C.mid, margin: 0 }}>{LABELS[step]?.sub}</p>
      </div>
      {/* Step content with slide animation */}
      <div key={animKey} className={dir === "fwd" ? "wizFwd" : "wizBwd"}>
        {/* ── STEP 1: Client Info ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="formRow">
              <div className="formField">
                <label className="formLabel">Full Name <span style={{ color: C.fl1 }}>*</span></label>
                <input className="formInput" type="text" placeholder="John Smith"
                  value={form.name} onChange={e => hc("name", e.target.value)}
                  style={errors.name ? { borderColor: "rgba(255,107,107,0.6)" } : {}} />
                <ErrMsg field="name" />
              </div>
              <div className="formField">
                <label className="formLabel">Email Address <span style={{ color: C.fl1 }}>*</span></label>
                <input className="formInput" type="email" placeholder="john@example.com"
                  value={form.email} onChange={e => hc("email", e.target.value)}
                  style={errors.email ? { borderColor: "rgba(255,107,107,0.6)" } : {}} />
                <ErrMsg field="email" />
              </div>
            </div>
            <div className="formField">
              <label className="formLabel">Company / Brand Name <span style={{ fontWeight: 400, color: C.low }}>(optional)</span></label>
              <input className="formInput" type="text" placeholder="Your brand or company"
                value={form.brand} onChange={e => hc("brand", e.target.value)} />
            </div>
          </div>
        )}
        {/* ── STEP 2: Project Type ── */}
        {step === 2 && (
          <div>
            <div className="wizGrid5">
              {PROJECT_TYPES.map(t => <SelCard key={t.v} val={t.v} field="projectType" emoji={t.emoji} label={t.label} desc={t.desc} big />)}
            </div>
            <ErrMsg field="projectType" />
          </div>
        )}
        {/* ── STEP 3: Features ── */}
        {step === 3 && (
          <div>
            <ToggleChips options={FEATURES} selected={form.features}
              onChange={v => hc("features", v)} accent={C.fl1} />
            <p style={{ fontFamily: body, fontSize: 12, color: C.low, marginTop: 12 }}>You can skip this and describe in the final step.</p>
          </div>
        )}
        {/* ── STEP 4: Budget + Timeline + Description ── */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ComplexityIndicator form={form} color={C.fl1} mode="web" />
            <div>
              <label className="formLabel" style={{ display: "block", marginBottom: 10 }}>Project Budget <span style={{ fontWeight: 400, color: C.low, fontSize: 12.5, textTransform: "none", letterSpacing: 0 }}>(Excludes domain & hosting)</span></label>
              <div className="wizGrid2">
                {BUDGETS.map(b => <SelCard key={b.v} val={b.v} field="budget" label={b.l} />)}
              </div>
            </div>
            <div>
              <label className="formLabel" style={{ display: "block", marginBottom: 10 }}>Expected Timeline</label>
              <div className="wizGrid2">
                {TIMELINES.map(t => <SelCard key={t.v} val={t.v} field="timeline" label={t.l} />)}
              </div>
            </div>
            <div className="formField">
              <label className="formLabel">Project Description <span style={{ color: C.fl1 }}>*</span></label>
              <textarea className="formTextarea" style={{ minHeight: 110, ...(errors.description ? { borderColor: "rgba(255,107,107,0.6)" } : {}) }}
                placeholder="Describe your vision, goals, target audience, any inspiration or references..."
                value={form.description} onChange={e => hc("description", e.target.value)} />
              <ErrMsg field="description" />
            </div>
            <ErrorBanner />
            <TrustBadge color={C.fl1} />
          </div>
        )}
      </div>
      <NavRow />
    </div>
  );
}

/* ── QAWizard (4-step testing discovery wizard) ──────────────── */
function QAWizard() {
  const STEPS = 4;
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState("fwd");
  const [animKey, setAK] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", company: "",
    appType: "",
    testing: [],
    testingStage: "", timeline: "", description: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const pct = Math.round((step / STEPS) * 100);

  const APP_TYPES = [
    { v: "web", emoji: "🌐", label: "Web Application", desc: "Browser-based apps" },
    { v: "mobile", emoji: "📱", label: "Mobile Application", desc: "iOS / Android apps" },
    { v: "desktop", emoji: "🖥", label: "Desktop Application", desc: "Windows/macOS/Linux" },
    { v: "api", emoji: "🔌", label: "API / Backend", desc: "REST, GraphQL, services" },
  ];
  const TESTING_OPTS = ["Manual Testing", "Functional Testing", "Regression Testing", "API Testing", "Database Testing", "Automation Testing", "Performance Testing"];
  const TEST_STAGES = [{ v: "none", l: "No Testing Process" }, { v: "manual", l: "Need Manual Testing" }, { v: "auto", l: "Need Automation Setup" }, { v: "improve", l: "Improving Existing" }];
  const TIMELINES = [{ v: "urgent", l: "Urgent" }, { v: "1m", l: "Within 1 Month" }, { v: "1-3m", l: "1–3 Months" }, { v: "flex", l: "Flexible" }];

  const LABELS = [
    null,
    { title: "Let's get to know each other", sub: "Let's start with the basics" },
    { title: "Tell me about your application", sub: "What type of software do you need tested?" },
    { title: "How can I help you test?", sub: "Select all the testing types you need" },
    { title: "Testing scope & expectations", sub: "Stage, timeline & anything else you want me to know" },
  ];

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = "Full name is required.";
      if (!form.email.trim()) e.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    }
    if (step === 2 && !form.appType) e.appType = "Please select an application type.";
    if (step === 4 && !form.description.trim()) e.description = "Testing requirements description is required.";
    return e;
  };

  const nav = (newStep, d) => {
    const errs = validate();
    if (d === "fwd" && Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setDir(d);
    setAK(k => k + 1);
    setStep(newStep);

    setTimeout(() => {
      const el = document.getElementById("qa-wizard-form");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    try {
      const payload = {
        service_id: 'service_lcmhd9d',
        template_id: 'template_ptjpovk',
        user_id: 'vKomMY0Ucy8yxdOAP',
        template_params: {
          name: form.name,
          email: form.email,
          company: form.company || "N/A",
          appType: APP_TYPES.find(a => a.v === form.appType)?.label || form.appType,
          testing: form.testing.length ? form.testing.join(", ") : "None",
          testingStage: TEST_STAGES.find(s => s.v === form.testingStage)?.l || form.testingStage,
          timeline: TIMELINES.find(t => t.v === form.timeline)?.l || form.timeline,
          description: form.description,
          time: new Date().toLocaleString()
        }
      };
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("EmailJS Error");
      setStatus("success");
    } catch { setStatus("error"); }
  };

  const hc = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };
  const ErrMsg = ({ field }) => errors[field]
    ? <span style={{ display: "block", fontFamily: body, fontSize: 12, color: "#FF6B6B", marginTop: 4 }}>{errors[field]}</span>
    : null;

  const SelCard = ({ val, field, emoji, label, desc, big }) => {
    const on = form[field] === val;
    const cl = big ? `selCard${on ? " on" : ""}` : `selCardSm${on ? " on" : ""}`;
    return (
      <div className={cl} onClick={() => hc(field, val)} style={{
        border: `1.5px solid ${on ? C.qa1 : "rgba(255,255,255,0.09)"}`,
        background: on ? `${C.qa1}12` : "rgba(255,255,255,0.03)",
        boxShadow: on ? `0 6px 22px -10px ${C.qa1}55` : "none",
      }}>
        {big && <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>}
        {!big && emoji && <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>}
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: big ? 14 : 13.5, color: on ? C.qa1 : C.hi }}>{label}</div>
        {big && desc && <div style={{ fontFamily: body, fontSize: 12, color: C.low, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>}
      </div>
    );
  };

  /* ── Success screen ── */
  if (status === "success") {
    const refId = `QA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return (
      <div style={{ textAlign: "center", padding: "40px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.qa1}18`, border: `2px solid ${C.qa1}44`, display: "grid", placeItems: "center" }}>
          <CheckCircle2 size={40} style={{ color: C.qa1 }} />
        </div>
        <div>
          <h3 style={{ fontFamily: display, fontWeight: 800, fontSize: 24, margin: "0 0 8px", color: C.hi }}>Request Successfully Submitted</h3>
          <p style={{ fontFamily: mono, fontSize: 13, color: C.qa1, margin: "0 0 12px", letterSpacing: 0.5 }}>Reference ID: {refId}</p>
          <p style={{ fontFamily: body, fontSize: 15, color: C.mid, margin: 0, maxWidth: 400 }}>Thank you, <strong style={{ color: C.hi }}>{form.name}</strong>! Your QA consultation request has been received.</p>
        </div>

        <div style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, textAlign: "left" }}>
          <h4 style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: C.hi, margin: "0 0 16px" }}>What happens now?</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "I will review your requirements",
              "I will contact you for clarification if needed",
              "We will discuss the next steps"
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: C.qa1 }} />
                <span style={{ fontFamily: body, fontSize: 14, color: C.mid }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>

          <button onClick={() => { setStatus(null); setStep(1); setForm({ name: "", email: "", company: "", appType: "", testing: [], testingStage: "", timeline: "", description: "" }); window.localStorage.removeItem("qa-form"); window.localStorage.removeItem("qa-step"); }}
            style={{ fontFamily: body, fontWeight: 600, fontSize: 13, color: C.mid, background: "transparent", border: "none", cursor: "pointer" }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const ErrorBanner = () => status === "error" ? (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
      <X size={16} style={{ color: "#FF6B6B", flexShrink: 0 }} />
      <span style={{ fontFamily: body, fontSize: 13.5, color: C.hi }}>Something went wrong. Email me at <a href="mailto:hello.deshanth@gmail.com" style={{ color: C.qa1 }}>hello.deshanth@gmail.com</a></span>
    </div>
  ) : null;

  const NavRow = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      {step > 1
        ? <button type="button" onClick={() => nav(step - 1, "bwd")} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: body, fontWeight: 600, fontSize: 14, color: C.mid, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "10px 20px", cursor: "pointer", transition: "all .2s ease" }}
          onMouseEnter={e => e.currentTarget.style.color = C.hi} onMouseLeave={e => e.currentTarget.style.color = C.mid}>
          <ChevronRight size={15} style={{ transform: "rotate(180deg)" }} /> Back
        </button>
        : <span />}
      {step < STEPS
        ? <button type="button" onClick={() => nav(step + 1, "fwd")} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: body, fontWeight: 700, fontSize: 14, color: "#0B0915", background: `linear-gradient(95deg,${C.qa1},${C.qa2})`, border: "none", borderRadius: 999, padding: "11px 26px", cursor: "pointer", transition: "all .2s ease", boxShadow: `0 6px 20px -10px ${C.qa1}66` }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          Next <ChevronRight size={15} />
        </button>
        : <button type="button" onClick={handleSubmit} disabled={status === "sending"}
          style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: body, fontWeight: 700, fontSize: 14, color: "#0B0915", background: `linear-gradient(95deg,${C.qa1},${C.qa2})`, border: "none", borderRadius: 999, padding: "11px 26px", cursor: "pointer", opacity: status === "sending" ? 0.7 : 1, boxShadow: `0 6px 20px -10px ${C.qa1}66` }}>
          {status === "sending" ? <><span style={{ animation: "spinSlow 1s linear infinite", display: "inline-block" }}>⟳</span> Sending…</> : <><TestTube2 size={15} /> Request QA Consultation</>}
        </button>}
    </div>
  );

  return (
    <div id="qa-wizard-form">
      <ProgressTracker step={step} total={STEPS} color={C.qa1} />
      <div style={{ marginBottom: 22 }}>
        <h3 style={{ fontFamily: display, fontWeight: 800, fontSize: 20, margin: "0 0 4px", color: C.hi }}>{LABELS[step]?.title}</h3>
        <p style={{ fontFamily: body, fontSize: 13.5, color: C.mid, margin: 0 }}>{LABELS[step]?.sub}</p>
      </div>
      <div key={animKey} className={dir === "fwd" ? "wizFwd" : "wizBwd"}>
        {/* ── STEP 1: Client Info ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="formRow">
              <div className="formField">
                <label className="formLabel">Full Name <span style={{ color: C.qa1 }}>*</span></label>
                <input className="formInput" type="text" placeholder="John Smith"
                  value={form.name} onChange={e => hc("name", e.target.value)}
                  style={errors.name ? { borderColor: "rgba(255,107,107,0.6)" } : {}} />
                <ErrMsg field="name" />
              </div>
              <div className="formField">
                <label className="formLabel">Email Address <span style={{ color: C.qa1 }}>*</span></label>
                <input className="formInput" type="email" placeholder="john@example.com"
                  value={form.email} onChange={e => hc("email", e.target.value)}
                  style={errors.email ? { borderColor: "rgba(255,107,107,0.6)" } : {}} />
                <ErrMsg field="email" />
              </div>
            </div>
            <div className="formField">
              <label className="formLabel">Company / Product Name <span style={{ fontWeight: 400, color: C.low }}>(optional)</span></label>
              <input className="formInput" type="text" placeholder="Your company or product"
                value={form.company} onChange={e => hc("company", e.target.value)} />
            </div>
          </div>
        )}
        {/* ── STEP 2: App Type ── */}
        {step === 2 && (
          <div>
            <div className="wizGrid4">
              {APP_TYPES.map(t => <SelCard key={t.v} val={t.v} field="appType" emoji={t.emoji} label={t.label} desc={t.desc} big />)}
            </div>
            <ErrMsg field="appType" />
          </div>
        )}
        {/* ── STEP 3: Testing Types ── */}
        {step === 3 && (
          <div>
            <ToggleChips options={TESTING_OPTS} selected={form.testing}
              onChange={v => hc("testing", v)} accent={C.qa1} />
            <p style={{ fontFamily: body, fontSize: 12, color: C.low, marginTop: 12 }}>Select all that apply. You can clarify in the description.</p>
          </div>
        )}
        {/* ── STEP 4: Stage + Timeline + Description ── */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ComplexityIndicator form={form} color={C.qa1} mode="qa" />
            <div>
              <label className="formLabel" style={{ display: "block", marginBottom: 10 }}>Current Testing Stage</label>
              <div className="wizGrid2">
                {TEST_STAGES.map(s => <SelCard key={s.v} val={s.v} field="testingStage" label={s.l} />)}
              </div>
            </div>
            <div>
              <label className="formLabel" style={{ display: "block", marginBottom: 10 }}>Project Timeline</label>
              <div className="wizGrid2">
                {TIMELINES.map(t => <SelCard key={t.v} val={t.v} field="timeline" label={t.l} />)}
              </div>
            </div>
            <div className="formField">
              <label className="formLabel">Testing Requirements <span style={{ color: C.qa1 }}>*</span></label>
              <textarea className="formTextarea" style={{ minHeight: 110, ...(errors.description ? { borderColor: "rgba(255,107,107,0.6)" } : {}) }}
                placeholder="Describe your application, known issues, what areas need coverage, any specific requirements..."
                value={form.description} onChange={e => hc("description", e.target.value)} />
              <ErrMsg field="description" />
            </div>
            <ErrorBanner />
            <TrustBadge color={C.qa1} />
          </div>
        )}
      </div>
      <NavRow />
    </div>
  );
}

/* ── AvailabilityBadge (Feature 11) ── */
function AvailabilityBadge() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 999, padding: "8px 14px", margin: "0 auto 20px"
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%", background: "#4ADE80",
        boxShadow: "0 0 10px #4ADE80", animation: "pulseGlow 2s infinite"
      }} />
      <span style={{ fontFamily: body, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
        Available for New Projects
      </span>
    </div>
  );
}

/* ── ScrollToTop ── */
function ScrollToTop({ mode }) {
  const show = useScrolled(600);
  const grad = mode === "qa" ? [C.qa1, C.qa2] : [C.fl1, C.fl2];

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 100,
      transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
      opacity: show ? 1 : 0,
      pointerEvents: show ? "auto" : "none",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    }}>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
        width: 52, height: 52, borderRadius: "50%",
        background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
        border: "none", color: "#0B0915", cursor: "pointer",
        display: "grid", placeItems: "center",
        boxShadow: `0 8px 24px -6px ${grad[0]}`, transition: "transform .2s ease"
      }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} aria-label="Scroll to top">
        <ArrowUp size={22} />
      </button>
    </div>
  );
}

/* ── Testimonials (Feature 10) ── */
function Testimonials({ mode }) {
  const grad = mode === "qa" ? [C.qa1, C.qa2] : [C.fl1, C.fl2];

  const qaReviews = [
    { name: "Sarah M.", role: "Product Manager", text: "Deshanth found edge cases in our application that our entire team missed. The detailed bug reports saved us hours of debugging before launch." },
    { name: "David L.", role: "Lead Developer", text: "Excellent QA process. The automated test scripts he provided were clean, well-documented, and seamlessly integrated with our CI/CD pipeline." },
    { name: "Emily R.", role: "Startup Founder", text: "A lifesaver! Tested our mobile app on multiple platforms and provided a very comprehensive usability report. Highly recommended." }
  ];

  const webReviews = [
    { name: "Marcus T.", role: "Small Business Owner", text: "The website redesign completely transformed our online presence. Communication was excellent and the final product is stunning and fast." },
    { name: "Jessica W.", role: "Agency Director", text: "Deshanth is a reliable freelance partner. He writes clean React code and always meets deadlines. The attention to detail is outstanding." },
    { name: "Alex K.", role: "E-commerce Founder", text: "Built our custom dashboard from scratch. Very proactive in suggesting UX improvements that we hadn't even thought of. Great work." }
  ];

  const reviews = mode === "qa" ? qaReviews : webReviews;

  return (
    <section className="reveal" style={{ maxWidth: 1140, margin: "0 auto 80px", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 26, margin: "0 0 12px", color: C.hi }}>What Clients Say</h3>
        <p style={{ fontFamily: body, color: C.mid, fontSize: 15 }}>Feedback from recent collaborations and projects.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {reviews.map((r, i) => (
          <GlassCard key={i} style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 4, color: grad[0] }}>
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <p style={{ fontFamily: body, fontSize: 14.5, color: C.hi, lineHeight: 1.6, flex: 1 }}>"{r.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${grad[0]}22`, border: `1px solid ${grad[0]}55`, display: "grid", placeItems: "center", color: grad[0], fontFamily: display, fontWeight: 700 }}>
                {r.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: display, fontWeight: 600, fontSize: 14, color: C.hi }}>{r.name}</div>
                <div style={{ fontFamily: body, fontSize: 12.5, color: C.low }}>{r.role}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ── FAQSection (Feature 9) ── */
function FAQSection({ mode }) {
  const grad = mode === "qa" ? [C.qa1, C.qa2] : [C.fl1, C.fl2];
  const [openIdx, setOpenIdx] = useState(0);

  const qaFaqs = [
    { q: "How do you report bugs and issues?", a: "I provide detailed bug reports including steps to reproduce, expected vs actual results, environment details, and visual evidence (screenshots/recordings). I can integrate directly with Jira, Trello, or Linear." },
    { q: "Do you write automated tests?", a: "Yes. I can create automated test suites using frameworks like Selenium, Cypress, or Playwright depending on your tech stack and requirements." },
    { q: "Can you work with my existing development team?", a: "Absolutely. I act as an integrated QA extension of your team, participating in sprint plannings and communicating closely with developers to resolve issues fast." },
    { q: "Do you test on real mobile devices?", a: "Yes, I test on a combination of real physical devices (iOS and Android) and cloud-based emulators to ensure maximum device and OS coverage." }
  ];

  const webFaqs = [
    { q: "How long does a website project usually take?", a: "A standard landing page takes 1-2 weeks. Medium complexity sites take 3-5 weeks. I will provide a precise timeline in the initial proposal based on your specific requirements." },
    { q: "Do you redesign existing websites?", a: "Yes! If you already have a website but it feels outdated or isn't converting well, I can revamp the design and migrate it to a modern tech stack." },
    { q: "Do you provide website maintenance?", a: "I offer 30 days of free support after launch. Ongoing maintenance retainers are available if you need continuous updates, backups, and monitoring." },
    { q: "Will I own the source code?", a: "100%. Once the project is complete and fully paid, all source code and assets are transferred to you with full ownership rights." }
  ];

  const faqs = mode === "qa" ? qaFaqs : webFaqs;

  return (
    <section className="reveal" style={{ maxWidth: 800, margin: "0 auto 90px", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 26, margin: "0 0 12px", color: C.hi }}>Frequently Asked Questions</h3>
        <p style={{ fontFamily: body, color: C.mid, fontSize: 15 }}>Common questions about my {mode === "qa" ? "testing" : "development"} process.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${openIdx === i ? `${grad[0]}55` : "rgba(255,255,255,0.08)"}`,
            borderRadius: 16, overflow: "hidden", transition: "border-color .3s ease"
          }}>
            <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{
              width: "100%", textAlign: "left", padding: "20px 24px", background: "transparent", border: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
              fontFamily: body, fontWeight: 600, fontSize: 15, color: openIdx === i ? C.hi : C.mid
            }}>
              {faq.q}
              <div style={{ transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .3s ease", color: openIdx === i ? grad[0] : C.low }}>
                <ChevronLeft size={18} style={{ transform: "rotate(-90deg)" }} />
              </div>
            </button>
            <div style={{
              display: "grid", gridTemplateRows: openIdx === i ? "1fr" : "0fr",
              transition: "grid-template-rows .3s cubic-bezier(0.22, 1, 0.36, 1)", opacity: openIdx === i ? 1 : 0
            }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ padding: "0 24px 24px", fontFamily: body, fontSize: 14.5, color: C.low, lineHeight: 1.65 }}>
                  {faq.a}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── ProcessTimeline (Feature 1) ── */
function ProcessTimeline({ mode }) {
  const grad = mode === "qa" ? [C.qa1, C.qa2] : [C.fl1, C.fl2];

  const qaSteps = [
    { num: "01", title: "Submit Your Request", desc: "Share your application details and testing requirements." },
    { num: "02", title: "Requirement Review", desc: "I will carefully review your request and test parameters." },
    { num: "03", title: "Test Strategy", desc: "We discuss the best approach, environments, and timelines." },
    { num: "04", title: "Receive Proposal", desc: "You receive a clear QA plan and estimated timeline." },
    { num: "05", title: "Testing Begins", desc: "Once approved, manual or automated testing starts." }
  ];

  const webSteps = [
    { num: "01", title: "Submit Your Request", desc: "Share your project details and requirements." },
    { num: "02", title: "Requirement Review", desc: "I will carefully review your request and understand your goals." },
    { num: "03", title: "Discussion & Planning", desc: "We discuss the best approach, features, and expectations." },
    { num: "04", title: "Receive Proposal", desc: "You receive a clear project plan and estimated timeline." },
    { num: "05", title: "Development Begins", desc: "Once approved, the coding and design process starts." }
  ];

  const steps = mode === "qa" ? qaSteps : webSteps;

  return (
    <div className="reveal" style={{ marginTop: 60 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 22, margin: "0 0 8px", color: C.hi }}>What Happens Next?</h3>
        <p style={{ fontFamily: body, color: C.mid, fontSize: 14.5 }}>A clear, transparent process from start to finish.</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            flex: "1 1 160px", maxWidth: 220, position: "relative",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "24px 20px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: `${grad[0]}15`,
              color: grad[0], fontFamily: mono, fontSize: 12, fontWeight: 700,
              display: "grid", placeItems: "center", marginBottom: 16, border: `1px solid ${grad[0]}40`
            }}>{s.num}</div>
            <h4 style={{ fontFamily: display, fontSize: 14.5, fontWeight: 700, color: C.hi, margin: "0 0 8px" }}>{s.title}</h4>
            <p style={{ fontFamily: body, fontSize: 13, color: C.low, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── usePersistedState hook (Feature 6) ── */
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) { return defaultValue; }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

/* ── ProgressTracker (Feature 5) ── */
function ProgressTracker({ step, total, color }) {
  const pct = Math.round(((step - 1) / total) * 100);
  return (
    <div style={{ marginBottom: 32, position: "sticky", top: 20, zIndex: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 14.5, color: C.hi }}>Project Consultation</span>
        <span style={{ fontFamily: mono, fontWeight: 600, fontSize: 12, color: color }}>{pct}% Completed</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "100%", borderRadius: 999,
            background: i < step ? (i === step - 1 ? `linear-gradient(90deg, ${color}66, ${color})` : color) : "rgba(255,255,255,0.03)",
            transition: "all .4s ease"
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── TrustBadge (Feature 2) ── */
function TrustBadge({ color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 18px", marginTop: 24, marginBottom: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {["Usually replies within 24 hours", "Free initial consultation", "No obligation discussion", "Your information remains private"].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${color}15`, color: color, display: "grid", placeItems: "center" }}><CheckCircle2 size={10} /></div>
            <span style={{ fontFamily: body, fontSize: 12.5, color: C.mid }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ComplexityIndicator (Feature 4) ── */
function ComplexityIndicator({ form, color, mode }) {
  let score = 0;
  if (mode === "web") {
    if (form.features) score += form.features.length;
    if (form.projectType === "webapp" || form.projectType === "ecommerce") score += 3;
  } else {
    if (form.testing) score += form.testing.length;
    if (form.appType === "web" || form.appType === "mobile") score += 2;
  }

  let complexity = "Low"; let weeks = "1 - 2"; let bars = 2;
  if (score > 6) { complexity = "High"; weeks = "6+"; bars = 8; }
  else if (score > 3) { complexity = "Medium"; weeks = "3 - 5"; bars = 5; }

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 11, color: C.low, letterSpacing: 0.5, marginBottom: 4 }}>ESTIMATED COMPLEXITY</div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 18, color: C.hi }}>{complexity} Complexity</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: C.low, letterSpacing: 0.5, marginBottom: 4 }}>TIMELINE</div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 18, color: color }}>{weeks} Weeks</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, height: 8 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 999, background: i < bars ? color : "rgba(255,255,255,0.06)", transition: "background .3s" }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [mode, setMode] = useState("qa");
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleSwapping, setRoleSwapping] = useState(false);
  const [swipeKey, setSwipeKey] = useState(0);
  const firstRender = useRef(true);
  useReveal();
  const scrolled = useScrolled();
  const grad = mode === "qa" ? [C.qa1, C.qa2] : [C.fl1, C.fl2];
  const contactId = mode === "qa" ? "contact-qa" : "contact-web";

  const theme = mode === "qa" ? {
    badge: "QA MODE", watermarkLabel: "QA ENGINEER",
    pageBg1: "#06131B", pageBg2: "#0C1222",
    glowA: "rgba(52,230,196,0.20)", glowB: "rgba(124,92,255,0.18)",
    surfaceTop: "rgba(52,230,196,0.12)", footerGlow: "rgba(124,92,255,0.08)",
    focus: C.qa1, shadow: "rgba(52,230,196,0.34)", navGlow: "rgba(52,230,196,0.16)",
    overlayTop: "rgba(52,230,196,0.14)", overlayA: "rgba(52,230,196,0.22)", overlayB: "rgba(124,92,255,0.16)",
    glassSurface: "rgba(8,23,31,0.62)", glassLine: "rgba(52,230,196,0.18)",
    headerBg: "rgba(8,17,28,0.82)",
  } : {
    badge: "FREELANCE MODE", watermarkLabel: "FREELANCE DEV",
    pageBg1: "#1A0F0B", pageBg2: "#24130D",
    glowA: "rgba(255,122,89,0.20)", glowB: "rgba(255,200,87,0.18)",
    surfaceTop: "rgba(255,122,89,0.12)", footerGlow: "rgba(255,200,87,0.08)",
    focus: C.fl1, shadow: "rgba(255,122,89,0.34)", navGlow: "rgba(255,122,89,0.16)",
    overlayTop: "rgba(255,122,89,0.14)", overlayA: "rgba(255,122,89,0.22)", overlayB: "rgba(255,200,87,0.16)",
    glassSurface: "rgba(36,18,12,0.66)", glassLine: "rgba(255,122,89,0.18)",
    headerBg: "rgba(26,14,10,0.84)",
  };



  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const [flipState, setFlipState] = useState("idle");

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
  }, [mode]);

  const setRole = (next, onFlipped) => {
    if (mode === next || flipState === "out") {
      if (onFlipped) onFlipped();
      return;
    }

    const viewportCenterY = window.scrollY + (window.innerHeight / 2);
    document.documentElement.style.setProperty('--flip-origin-y', `${viewportCenterY}px`);

    setFlipState("out");
    setRoleSwapping(true);

    setTimeout(() => {
      startTransition(() => setMode(next));

      // Instantly snap to top while invisible (CSS will handle the visual swoosh)
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      void document.documentElement.offsetHeight;

      document.documentElement.style.setProperty('--flip-origin-y', `${window.innerHeight / 2}px`);

      setFlipState("in");
      if (onFlipped) setTimeout(onFlipped, 50);

      setTimeout(() => {
        setFlipState("idle");
        setRoleSwapping(false);
        document.documentElement.style.scrollBehavior = "";
      }, 500);
    }, 400);
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "work", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: contactId, label: "Contact" },
  ];

  const goTo = (id) => (e) => {
    e?.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      background: `radial-gradient(circle at 14% 0%, ${theme.overlayA}, transparent 30%), radial-gradient(circle at 88% 6%, ${theme.overlayB}, transparent 26%), linear-gradient(180deg, ${theme.pageBg1}, ${theme.pageBg2})`,
      backgroundAttachment: "fixed",
      minHeight: "100vh", color: C.hi, fontFamily: body, position: "relative", overflowX: "hidden",
      ["--glass-surface"]: theme.glassSurface, ["--glass-line"]: theme.glassLine,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        ::selection { background: ${mode === "qa" ? C.qa1 : C.fl1}55; }
        body { margin: 0; }
        @keyframes drift    { 0%,100%{transform:translate(0,0) scale(1);}   50%{transform:translate(20px,-26px) scale(1.06);} }
        @keyframes floaty   { 0%,100%{transform:translateY(0);}             50%{transform:translateY(-10px);} }
        @keyframes spinSlow { from{transform:rotate(0deg);}                  to{transform:rotate(360deg);} }
        @keyframes carouselProgress { from{width:0%;}  to{width:100%;} }
        @keyframes pageSwipe {
          0%   { transform:translateX(-120%) skewX(-16deg); opacity:0; }
          12%  { opacity:1; }
          55%  { opacity:1; }
          100% { transform:translateX(120%)  skewX(-16deg); opacity:0; }
        }
        @keyframes pageSwipeGlow {
          0%   { transform:translateX(-135%) skewX(-16deg) scale(.96); opacity:0; }
          10%  { opacity:.95; }
          70%  { opacity:.7; }
          100% { transform:translateX(125%)  skewX(-16deg) scale(1.04); opacity:0; }
        }
        .flip-wrapper { transform-style: preserve-3d; perspective: 1600px; transform-origin: center var(--flip-origin-y, 50vh); }
        .flip-out { animation: flipOut .4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
        .flip-in { animation: flipIn .5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes flipOut {
          0% { transform: rotateY(0deg); opacity: 1; filter: blur(0px); }
          100% { transform: rotateY(90deg) scale(0.95); opacity: 0; filter: blur(4px); }
        }
        @keyframes flipIn {
          0% { transform: rotateY(-90deg) scale(0.95); opacity: 0; filter: blur(4px); }
          100% { transform: rotateY(0deg); opacity: 1; filter: blur(0px); }
        }
        .reveal { opacity:0; transform:translateY(26px); transition:opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity:1; transform:translateY(0); }
        .lift { transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .lift:hover { transform:translateY(-6px); border-color:rgba(255,255,255,0.18); box-shadow:0 20px 40px -20px ${theme.shadow}; }
        .grid2 { display:grid; grid-template-columns:1fr 1fr;        gap:18px; }
        .grid3 { display:grid; grid-template-columns:repeat(3,1fr);  gap:18px; }
        .statsGrid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        @media(max-width:880px){ .grid3{grid-template-columns:1fr 1fr;} .statsGrid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:640px){ .grid2,.grid3{grid-template-columns:1fr;} .statsGrid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:700px){ .aboutGrid{grid-template-columns:1fr!important;text-align:center;} .aboutGrid>div:first-child{margin:0 auto;} .aboutGrid .switchWrap{margin:0 auto;} }
        button:focus-visible,a:focus-visible { outline:2px solid ${theme.focus}; outline-offset:3px; }
        @media(prefers-reduced-motion:reduce){ .reveal,.lift,[style*="drift"],[style*="floaty"]{animation:none!important;transition:none!important;} }
        .switchWrap  { display:flex; background:var(--glass-surface); border:1px solid var(--glass-line); border-radius:999px; padding:4px; gap:4px; }
        .switchBtn   { font-family:'Inter',sans-serif; font-weight:700; font-size:13px; padding:9px 18px; border-radius:999px; border:none; cursor:pointer; display:flex; align-items:center; gap:7px; background:transparent; color:${C.mid}; transition:background .25s ease,color .25s ease,transform .25s ease,box-shadow .25s ease; }
        .switchBtn[aria-pressed="true"] { transform:translateY(-1px); box-shadow:0 12px 26px -18px ${theme.shadow}; }
        .navToggleBtn { padding:7px 9px!important; }
        .navLink { transition:color .2s ease, background .2s ease; }
        .navLink:hover { color:${C.hi}; background:rgba(255,255,255,0.06); }
        .qaBoard { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; align-items:start; }
        .qaStack { display:grid; gap:18px; }
        html { scroll-behavior:smooth; }
        section[id] { scroll-margin-top:90px; }
        @media(max-width:760px){
          .qaBoard{grid-template-columns:1fr;}
          .navLinksDesktop{display:none!important;}
          .navSpacerMobile{display:block!important;}
          .hamburger{display:flex!important;}
        }
        @media(min-width:761px){
          .navSpacerMobile{display:none!important;}
          .mobileMenu{display:none!important;}
        }
        .contactGrid { display:grid; grid-template-columns:1fr 1.45fr; gap:28px; align-items:start; }
        @media(max-width:860px){ .contactGrid{grid-template-columns:1fr;} }
        .formField { display:flex; flex-direction:column; gap:7px; }
        .formLabel { font-family:'Inter',sans-serif; font-size:13px; font-weight:600; color:#B7AFD6; letter-spacing:0.3px; }
        .formInput, .formSelect, .formTextarea {
          font-family:'Inter',sans-serif; font-size:14px; color:#F6F4FF;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; padding:12px 16px; outline:none; width:100%; box-sizing:border-box;
          transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
          -webkit-appearance:none; appearance:none;
        }
        .formInput::placeholder, .formTextarea::placeholder { color:#6E6790; }
        .formInput:focus, .formSelect:focus, .formTextarea:focus {
          border-color:rgba(52,230,196,0.5); background:rgba(52,230,196,0.04);
          box-shadow:0 0 0 3px rgba(52,230,196,0.1);
        }
        .formSelect option { background:#100C1F; color:#F6F4FF; }
        .formTextarea { resize:vertical; min-height:120px; line-height:1.65; }
        .submitBtn {
          display:inline-flex; align-items:center; justify-content:center; gap:9px;
          font-family:'Inter',sans-serif; font-weight:700; font-size:15px;
          padding:14px 28px; border-radius:999px; border:none; cursor:pointer;
          transition:transform .15s ease, box-shadow .15s ease, opacity .2s ease;
          width:100%;
        }
        .submitBtn:hover:not(:disabled) { transform:translateY(-2px); }
        .submitBtn:disabled { opacity:0.6; cursor:not-allowed; }
        .formRow { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:560px){ .formRow{grid-template-columns:1fr;} }
        @keyframes wizFwd { 0%{opacity:0;transform:translateX(32px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes wizBwd { 0%{opacity:0;transform:translateX(-32px)} 100%{opacity:1;transform:translateX(0)} }
        .wizFwd { animation:wizFwd .32s cubic-bezier(0.22,1,0.36,1) both; }
        .wizBwd { animation:wizBwd .32s cubic-bezier(0.22,1,0.36,1) both; }
        .selCard {
          cursor:pointer; border:1.5px solid rgba(255,255,255,0.09); border-radius:16px;
          padding:18px 16px; background:rgba(255,255,255,0.03);
          transition:all .2s ease; text-align:center; user-select:none;
        }
        .selCard:hover { border-color:rgba(255,255,255,0.22); background:rgba(255,255,255,0.06); transform:translateY(-3px); }
        .selCard.on { transform:translateY(-3px); }
        .selCardSm {
          cursor:pointer; border:1.5px solid rgba(255,255,255,0.09); border-radius:14px;
          padding:14px 16px; background:rgba(255,255,255,0.03);
          transition:all .2s ease; user-select:none; text-align:center;
        }
        .selCardSm:hover { border-color:rgba(255,255,255,0.22); background:rgba(255,255,255,0.06); transform:translateY(-2px); }
        .selCardSm.on { transform:translateY(-2px); }
        .wizGrid5 { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
        .wizGrid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .wizGrid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:700px){ .wizGrid5{grid-template-columns:repeat(2,1fr);} .wizGrid4{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:440px){ .wizGrid5{grid-template-columns:1fr 1fr;} }
      `}</style>

      {/* ── ambient layers ── */}
      <RoleBackdrop theme={theme} swapping={roleSwapping} />
      <Blob top="-120px" left="-100px" size={420} c1={C.qa1} c2={C.qa2} />
      <Blob top="200px" left="70%" size={360} c1={mode === "qa" ? C.qa2 : C.fl1} c2={mode === "qa" ? C.qa1 : C.fl2} delay={3} />
      <Blob top="900px" left="-60px" size={300} c1={mode === "qa" ? C.qa2 : C.fl1} c2={mode === "qa" ? C.fl1 : C.fl2} delay={6} />

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "center",
        padding: scrolled ? "12px 16px" : "20px 16px",
        transition: "padding .35s ease",
      }}>
        <div style={{
          width: "100%", maxWidth: scrolled ? 760 : 1140,
          display: "flex", alignItems: "center", gap: 10,
          background: scrolled ? theme.headerBg : "rgba(10,10,16,0.30)",
          border: `1px solid ${scrolled ? theme.glassLine : "rgba(255,255,255,0.05)"}`,
          borderRadius: 999, padding: scrolled ? "8px 10px 8px 18px" : "12px 14px 12px 22px",
          backdropFilter: "blur(18px)",
          boxShadow: scrolled ? `0 12px 30px -16px ${theme.navGlow}` : "none",
          transition: "all .35s ease",
        }}>
          <a href="#top" onClick={goTo("top")} style={{ fontFamily: display, fontWeight: 800, fontSize: scrolled ? 16 : 18, transition: "font-size .35s ease", flexShrink: 0, textDecoration: "none" }}>
            <GradText from={grad[0]} to={grad[1]} style={{ transition: "all 0.4s ease" }}>DV.</GradText>
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 10, flex: 1 }} className="navLinksDesktop">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={goTo(l.id)} className="navLink" style={{ fontFamily: body, fontWeight: 600, fontSize: 13.5, color: C.mid, padding: "8px 13px", borderRadius: 999, whiteSpace: "nowrap" }}>{l.label}</a>
            ))}
          </nav>

          <div style={{ flex: 1 }} className="navSpacerMobile" />
          <div style={{ flex: 0.5 }} />

          {/* compact QA / Freelance toggle — visible always, prominent when scrolled */}
          <div className="switchWrap" style={{ display: "inline-flex", flexShrink: 0, padding: 3, marginRight: 8, opacity: scrolled ? 1 : 0.65, transition: "opacity .35s ease" }}>
            <button className="switchBtn navToggleBtn" title="QA Engineer" aria-label="QA Engineer" aria-pressed={mode === "qa"} onClick={() => setRole("qa")} style={mode === "qa" ? { color: "#0B0915", background: `linear-gradient(95deg,${C.qa1},${C.qa2})` } : {}}>
              <TestTube2 size={13} />
            </button>
            <button className="switchBtn navToggleBtn" title="Freelance Dev" aria-label="Freelance Dev" aria-pressed={mode === "freelance"} onClick={() => setRole("freelance")} style={mode === "freelance" ? { color: "#0B0915", background: `linear-gradient(95deg,${C.fl1},${C.fl2})` } : {}}>
              <Code2 size={13} />
            </button>
          </div>

          <MagButton href={`#${contactId}`} onClick={goTo(contactId)} primary grad={grad} small>
            <Mail size={14} /> Hire me
          </MagButton>

          <button onClick={() => setMenuOpen((v) => !v)} className="hamburger" aria-label={menuOpen ? "Close menu" : "Open menu"} style={{ display: "none", width: 38, height: 38, borderRadius: 999, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.04)", color: C.hi, alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobileMenu" style={{ position: "absolute", top: "calc(100% + 8px)", left: 16, right: 16, background: "rgba(16,12,31,0.95)", border: `1px solid ${C.line}`, borderRadius: 18, backdropFilter: "blur(18px)", padding: 10, display: "flex", flexDirection: "column", gap: 2, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.7)" }}>
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={goTo(l.id)} style={{ fontFamily: body, fontWeight: 600, fontSize: 15, color: C.hi, padding: "12px 14px", borderRadius: 12 }}>{l.label}</a>
            ))}
          </div>
        )}
      </header>

      <div id="top" style={{ height: 86 }} />

      <main className={`flip-wrapper ${flipState === "out" ? "flip-out" : flipState === "in" ? "flip-in" : ""}`}>
        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "78px 24px 50px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
            <div style={{ marginBottom: 16 }}>
              <Chip grad={grad}>{theme.badge} {mode === "qa" ? "· Interning @ SoftwarePlus Pvt Ltd " : ""}· Sri Lanka</Chip>
            </div>
            <h1 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(40px,6.4vw,70px)", lineHeight: 1.04, letterSpacing: -1.5, margin: "0 0 18px" }}>
              Hi, I'm Deshanth <br />
              <GradText from={grad[0]} to={grad[1]}>{mode === "qa" ? "Aspiring Software Quality Assurance Engineer." : "Freelance Web Developer."}</GradText>
            </h1>
            <p style={{ color: C.mid, fontSize: 18, lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 560 }}>
              {mode === "qa"
                ? "Final-year Network & Mobile Computing undergraduate passionate about Software Quality Assurance. I specialize in manual testing, test automation, and API testing while building web applications as a freelance developer."
                : "Freelance web developer who builds responsive interfaces, API-driven features, and full-stack systems while keeping a QA mindset throughout the product lifecycle."}
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <MagButton href="#projects" onClick={goTo("projects")} primary grad={grad}><Rocket size={16} /> See my work</MagButton>
              <MagButton href={`#${contactId}`} onClick={goTo(contactId)} grad={grad}><Mail size={16} /> Say hello</MagButton>
              {mode === "qa" && (
                <MagButton href="/Vishvalingam Deshanth.pdf" download grad={grad}>
                  <Download size={16} /> Download CV
                </MagButton>
              )}
            </div>
          </div>
          <div className="grid3" style={{ marginTop: 64 }}>
            {(mode === "qa" ? [
              { n: "40%", l: "Faster regression cycles", icon: <Clock size={18} /> },
              { n: "0", l: "Critical bugs leaked", icon: <CheckCircle2 size={18} /> },
              { n: "5+", l: "Projects fully verified", icon: <TestTube2 size={18} /> },
            ] : [
              { n: "100%", l: "Client Satisfaction", icon: <Star size={18} /> },
              { n: "3x", l: "Faster page loads", icon: <Zap size={18} /> },
              { n: "High", l: "Conversion focused", icon: <Rocket size={18} /> },
            ]).map((s, i) => (
              <GlassCard key={i} style={{ textAlign: "center", animation: `floaty 5s ease-in-out ${i * 0.5}s infinite` }}>
                <div style={{ color: grad[0], marginBottom: 8, display: "flex", justifyContent: "center" }}>{s.icon}</div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26 }}>{s.n}</div>
                <div style={{ color: C.mid, fontSize: 13 }}>{s.l}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ══ ABOUT ═════════════════════════════════════════════════ */}
        <section id="about" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "30px 24px 70px", position: "relative", zIndex: 1 }}>
          <GlassCard className="aboutGrid" style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 32, padding: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ width: 170, height: 170, borderRadius: "32% 68% 65% 35% / 45% 35% 65% 55%", padding: 4, background: `linear-gradient(135deg,${C.qa1},${C.qa2},${C.fl1})`, animation: "spinSlow 18s linear infinite" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "32% 68% 65% 35% / 45% 35% 65% 55%", overflow: "hidden", background: C.bg2 }}>
                  <img src="/profile.jpeg" alt="Deshanth Vishvalingam" style={{ width: "100%", height: "100%", objectFit: "cover", animation: "spinSlow 18s linear infinite reverse" }} />
                </div>
              </div>
              <Chip grad={grad}>Open to opportunities</Chip>
            </div>
            <div>
              <span style={{ fontFamily: mono, fontSize: 12, color: grad[0], letterSpacing: 1 }}>ABOUT ME</span>
              <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: 28, margin: "8px 0 14px" }}>Committed to building reliable software.</h2>
              {mode === "qa" ? (
                <>
                  <p style={{ color: C.mid, fontSize: 15.5, lineHeight: 1.8, margin: "0 0 14px" }}>
                    I'm a final-year undergraduate specializing in Software Quality Assurance. I enjoy diving into systems, finding edge cases, and ensuring that software works exactly as intended before it reaches users. I have a solid understanding of test design, defect tracking, and both manual and automated testing processes.
                  </p>
                  <p style={{ color: C.mid, fontSize: 15.5, lineHeight: 1.8, margin: "0 0 18px" }}>
                    Currently working as a QA Intern at <span style={{ color: C.hi, fontWeight: 600 }}>SoftwarePlus Pvt Ltd</span>, I help test web application modules within Agile sprint cycles. Since I also do freelance web development, I have a good grasp of how applications are built under the hood, which helps me write better, more targeted tests.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: C.mid, fontSize: 15.5, lineHeight: 1.8, margin: "0 0 14px" }}>
                    I'm a freelance web developer who enjoys building clean, functional, and responsive websites for small businesses and independent creators. Whether it's a simple landing page or a custom web app, I focus on writing maintainable code and creating a smooth experience for the end-user.
                  </p>
                  <p style={{ color: C.mid, fontSize: 15.5, lineHeight: 1.8, margin: "0 0 18px" }}>
                    My background in Software Quality Assurance means I test my work thoroughly as I build it. I try to anticipate edge cases and fix bugs early, so the websites I deliver are stable and reliable from day one.
                  </p>
                </>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <Chip grad={grad}><MapPin size={12} /> Sri Lanka</Chip>
                <Chip grad={grad}><Workflow size={12} /> {mode === "qa" ? "Software QA Engineer" : "Freelance Web Developer"}</Chip>
                <Chip grad={mode === "qa" ? [C.fl1, C.fl2] : [C.qa1, C.qa2]}><Code2 size={12} /> {mode === "qa" ? "Freelance Web Developer" : "Software QA Engineer"}</Chip>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ══ MODE TOGGLE ═══════════════════════════════════════════ */}
        <section className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 50px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: C.hi, opacity: 0.85, fontSize: 14, fontFamily: body, marginBottom: 18, letterSpacing: 0.3 }}>
              Switch between QA and Freelance to see matching skills, experience &amp; projects
            </p>
            <div className="switchWrap" style={{ display: "inline-flex" }}>
              <button className="switchBtn" onClick={() => setRole("qa")} aria-pressed={mode === "qa"} style={mode === "qa" ? { color: "#0B0915", background: `linear-gradient(95deg,${C.qa1},${C.qa2})` } : {}}>
                <TestTube2 size={15} /> QA Engineer
              </button>
              <button className="switchBtn" onClick={() => setRole("freelance")} aria-pressed={mode === "freelance"} style={mode === "freelance" ? { color: "#0B0915", background: `linear-gradient(95deg,${C.fl1},${C.fl2})` } : {}}>
                <Code2 size={15} /> Freelance Dev
              </button>
            </div>
          </div>
        </section>

        {/* ══ SKILLS ════════════════════════════════════════════════ */}
        <section id="work" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 60px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 26 }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: grad[0], letterSpacing: 1 }}>{mode === "qa" ? "QA TOOLKIT" : "DEV TOOLKIT"}</span>
            <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(24px,3.2vw,34px)", margin: "8px 0 0" }}>
              {mode === "qa" ? <>Testing <GradText from={grad[0]} to={grad[1]}>Technologies</GradText></> : <>Development <GradText from={grad[0]} to={grad[1]}>Technologies</GradText></>}
            </h2>
          </div>

          {mode === "qa" ? (
            <div className="qaBoard">
              <div className="qaStack">
                <GlassCard style={{ display: "flex", flexDirection: "column", gap: 14, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: `linear-gradient(135deg,${C.qa1}28,${C.qa2}18)`, border: `1px solid ${C.qa1}24`, color: C.qa1, flexShrink: 0 }}><Bug size={16} /></div>
                    <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0, color: C.hi }}>Manual Testing</h3>
                  </div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {[
                      { label: "TEST DESIGN & EXECUTION", color: C.qa1, bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.07)", items: ["Test case design", "Test scenarios", "Test execution", "Test documentation"] },
                      { label: "TESTING TYPES", color: C.qa2, bg: `${C.qa2}12`, border: `${C.qa2}22`, items: ["Functional testing", "Exploratory testing", "Regression testing", "UI testing", "Smoke testing"] },
                      { label: "QA PROCESS & DEFECT MANAGEMENT", color: C.qa1, bg: `${C.qa1}12`, border: `${C.qa1}22`, items: ["Bug reporting", "Defect tracking", "Defect lifecycle", "Severity / Priority classification"] },
                      { label: "METHODOLOGY / ENVIRONMENT", color: C.qa2, bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.07)", items: ["SDLC & STLC", "Agile / Scrum", "Jira"] },
                    ].map((g, gi) => (
                      <div key={gi} style={{ display: "grid", gap: 7 }}>
                        <span style={{ fontFamily: mono, fontSize: 10.5, color: g.color, letterSpacing: 0.9 }}>{g.label}</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                          {g.items.map((item) => (
                            <span key={item} style={{ fontFamily: body, fontSize: 12.25, color: C.hi, padding: "6px 10px", borderRadius: 999, background: g.bg, border: `1px solid ${g.border}` }}>{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <SkillPanel icon={<Database size={17} />} title="Database Testing" grad={[C.qa1, C.qa2]} items={["MySQL", "Basic SQL Queries", "Firebase Realtime DB"]} />
              </div>
              <div className="qaStack">
                <SkillPanel icon={<TestTube2 size={17} />} title="Automation Testing" grad={[C.qa1, C.qa2]} items={["Selenium WebDriver", "TestNG", "Page Object Model", "Maven", "ExtentReports (HTML reporting)", "Assertions"]} />
                <SkillPanel icon={<Workflow size={17} />} title="API Testing" grad={[C.qa1, C.qa2]} items={["Postman", "Newman CLI", "REST APIs", "JSON validation", "API chaining", "Status code validation", "Response assertion"]} />
                <SkillPanel icon={<GitBranch size={17} />} title="CI/CD & Tools" grad={[C.qa1, C.qa2]} items={["Git & GitHub", "GitHub Actions", "Jenkins (learning)", "Linux basics"]} />
                <GlassCard style={{ display: "flex", alignItems: "center", gap: 14, padding: 18 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: `${C.qa1}14`, border: `1px solid ${C.qa1}24`, color: C.qa1, flexShrink: 0 }}><Quote size={18} /></div>
                  <p style={{ color: C.mid, fontSize: 13.5, fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>"A bug found in testing costs minutes. A bug found in production costs trust."</p>
                </GlassCard>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              <div className="grid2">
                <SkillPanel icon={<Code2 size={17} />} title="Frontend Development" grad={[C.fl1, C.fl2]} items={["HTML & CSS", "JavaScript", "React", "Responsive UI Design", "DOM Manipulation"]} />
                <SkillPanel icon={<Code2 size={17} />} title="Backend Development" grad={[C.fl1, C.fl2]} items={["PHP (CRUD systems)", "Firebase (Authentication + Realtime DB)", "MySQL", "REST API integration"]} />
                <SkillPanel icon={<Smartphone size={17} />} title="Mobile" grad={[C.fl1, C.fl2]} items={["React Native", "Android Studio", "Java"]} />
                <SkillPanel icon={<Layers size={17} />} title="Tools & DevOps" grad={[C.fl1, C.fl2]} items={["Git & GitHub", "Docker", "GitHub Actions", "Linux basics"]} />
              </div>
            </div>
          )}
        </section>

        {/* ══ EXPERIENCE ════════════════════════════════════════════ */}
        <section id="experience" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 60px", position: "relative", zIndex: 1 }}>
          {mode === "qa" ? (
            <>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: grad[0], letterSpacing: 1 }}>PROFESSIONAL EXPERIENCE</span>
              </div>
              <GlassCard style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap", padding: 30 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: "grid", placeItems: "center", background: `linear-gradient(135deg,${C.qa1}30,${C.qa2}18)`, color: C.qa1 }}><Boxes size={24} /></div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0 }}>QA Intern - SoftwarePlus Pvt Ltd</h3>
                    <span style={{ fontFamily: body, fontWeight: 700, fontSize: 11, color: C.qa1, background: `${C.qa1}18`, border: `1px solid ${C.qa1}40`, borderRadius: 999, padding: "3px 10px" }}>ONGOING</span>
                  </div>
                  <p style={{ color: C.mid, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>Integrating directly into Agile sprint cycles to safeguard release quality. I execute detailed manual and automated test cases across web modules, strictly document defects, and collaborate closely with engineering teams to dramatically reduce post-release bugs and optimize the software lifecycle.</p>
                </div>
              </GlassCard>
            </>
          ) : (
            <GlassCard style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap", padding: 30 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: "grid", placeItems: "center", background: `linear-gradient(135deg,${C.fl1}30,${C.fl2}18)`, color: C.fl1 }}><Code2 size={24} /></div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                  <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0 }}>Freelance Web Developer - Self-employed</h3>
                  <span style={{ fontFamily: body, fontWeight: 700, fontSize: 11, color: C.fl1, background: `${C.fl1}18`, border: `1px solid ${C.fl1}40`, borderRadius: 999, padding: "3px 10px" }}>ONGOING</span>
                </div>
                <p style={{ color: C.mid, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>Partnering with small businesses and entrepreneurs to design, build, and deploy high-performing digital solutions. Utilizing React, modern CSS, and Firebase, I deliver scalable web applications focused on elevating brand presence, increasing customer conversions, and providing a flawless user experience.</p>
              </div>
            </GlassCard>
          )}
        </section>

        {/* ══ PROJECTS ══════════════════════════════════════════════ */}
        <section id="projects" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 70px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 26 }}>
            {mode === "qa" && (
              <>
                <span style={{ fontFamily: mono, fontSize: 12, color: grad[0], letterSpacing: 1 }}>FEATURED PROJECTS</span>
                <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(24px,3.2vw,34px)", margin: "8px 0 0" }}>
                  Frameworks I've built to catch bugs early
                </h2>
              </>
            )}
          </div>

          {mode === "qa" ? (
            <div className="grid3">
              <ProjectCard icon={<TestTube2 size={20} />} title="Selenium UI Automation Framework" status="COMPLETED" grad={[C.qa1, C.qa2]} tags={["Selenium", "TestNG", "POM", "ExtentReports", "GitHub Actions"]} desc="A reusable framework built with Selenium WebDriver and TestNG, structured with the Page Object Model. Automates core e-commerce flows - login, cart, checkout - with execution reports and a GitHub Actions CI pipeline." githubUrl="https://github.com/Desh07/saucedemo-selenium-automation-framework.git" />
              <ProjectCard icon={<TestTube2 size={20} />} title="Playwright E-Commerce Automation Framework" status="COMPLETED" grad={[C.qa1, C.qa2]} tags={["Playwright", "TypeScript", "POM", "GitHub Actions"]} desc="A robust UI automation framework built with Playwright and TypeScript, structured with the Page Object Model. Validates core e-commerce workflows with dynamic test data management and a GitHub Actions CI pipeline." githubUrl="https://github.com/Desh07/playwright-ecommerce-automation" />
              <ProjectCard icon={<Workflow size={20} />} title="API Test Automation Framework" status="COMPLETED" grad={[C.qa1, C.qa2]} tags={["Postman", "Newman", "REST", "CI/CD"]} desc="Postman collections validating REST endpoints, with automated CRUD operations, response assertions, environment variables, and API chaining - wired into GitHub Actions via Newman CLI." githubUrl="https://github.com/Desh07/api-testing-postman-project.git" />
              <ProjectCard icon={<ClipboardCheck size={20} />} title="SpaceXP HRIS – Manual QA Testing" status="COMPLETED" grad={[C.qa1, C.qa2]} tags={["Manual Testing", "Test Case Design", "Bug Reporting", "Excel", "STLC"]} desc="Full-cycle manual QA for a 2-portal enterprise HRIS platform (Admin & Employee). Authored test plans, test cases, and bug reports across 167+ test cases, logging 62 defects with severity-based tracking." githubUrl="https://github.com/Desh07/HRIS-Manual-Testing-Project.git" />
              <ProjectCard icon={<Bug size={20} />} title="Manual Testing - Demo Web App" status="COMPLETED" grad={[C.qa1, C.qa2]} tags={["Test Design", "Exploratory", "Bug Reports"]} desc="Designed and executed test cases for a demo web application, ran exploratory testing passes, and documented defects with clear, reproducible reports." githubUrl="https://github.com/Desh07/Manual_Testing_SauceDemo.git" />
            </div>
          ) : (
            <>
              {/* ── Freelance attraction sections ── */}
              <ClientCarousel />
              <FreelanceStats />
              <WhatYouGet />
              <FreelanceCTA goTo={goTo} />

              {/* Past builds */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: C.fl1, letterSpacing: 1 }}>PAST BUILDS</span>
                <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 22, margin: "8px 0 0", color: C.hi }}>Projects I've Shipped</h3>
              </div>
              <div className="grid2">
                <ProjectCard icon={<Rocket size={20} />} title="High-Conversion Landing Page" status="CASE STUDY" grad={[C.fl1, C.fl2]} tags={["React", "Framer Motion", "Performance"]} desc="Redesigned and developed a modern landing page for a local service business. Implemented lazy loading and optimized assets to achieve a 98/100 Lighthouse performance score, leading to a 40% increase in lead generation." githubUrl="#" />
                <ProjectCard icon={<ShoppingBag size={20} />} title="E-commerce Shoe Store" status="SHIPPED" grad={[C.fl1, C.fl2]} tags={["HTML", "CSS", "JavaScript", "PHP"]} desc="Built a high-performance e-commerce platform designed to drive online sales. Features a dynamic product catalog, seamless shopping experience, and a robust custom backend to streamline inventory tracking and accelerate order processing." githubUrl="https://github.com/Desh07/Solemate-project" />
              </div>
            </>
          )}
        </section>

        {/* <Testimonials mode={mode} /> */}
        {/* ══ CONTACT — WEB DEV ══════════════════════════════════════ */}
        <section id="contact-web" className="reveal" style={{
          maxWidth: 1140, margin: "0 auto", padding: "10px 24px 90px",
          position: "relative", zIndex: 1,
          display: mode === "freelance" ? "block" : "none",
          textAlign: "left",
        }}>
          <div style={{ marginBottom: 36, textAlign: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: C.fl1, letterSpacing: 1 }}>WEB PROJECT INQUIRY</span>
            <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", margin: "8px 0 10px" }}>
              Start Your <GradText from={C.fl1} to={C.fl2}>Web Project</GradText>
            </h2>
            <p style={{ color: C.mid, fontSize: 15.5, margin: "0 auto", maxWidth: 520 }}>
              Tell me about your idea, and let's build a modern digital solution together.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ── Info banner ── */}
            <GlassCard hover={false} style={{
              background: "linear-gradient(135deg,rgba(255,122,89,0.08),rgba(255,200,87,0.06))",
              padding: "26px 28px", position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16,
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${C.fl1}18, transparent 70%)`, pointerEvents: "none" }} />

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", flexShrink: 0, background: `${C.fl1}18`, border: `1px solid ${C.fl1}30`, color: C.fl1 }}>
                    <Code2 size={19} />
                  </div>
                  <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0, color: C.hi }}>Ready to Build Your Website?</h3>
                </div>
                <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.75, margin: "0 0 16px", maxWidth: 480 }}>
                  From small business sites to full web applications — built fast, built right, and built around your needs.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px" }}>
                  <Clock size={13} style={{ color: C.fl1 }} />
                  <span style={{ fontFamily: body, fontSize: 13, color: C.mid }}>Typical response: <span style={{ color: C.hi, fontWeight: 600 }}>24–48 hours</span></span>
                </div>
              </div>
            </GlassCard>
            {/* ── Form ── */}
            <GlassCard hover={false} style={{ padding: 30 }}>
              <WebDevWizard />
            </GlassCard>

            <ProcessTimeline mode="freelance" />


          </div>
        </section>

        {/* ══ CONTACT — QA ═══════════════════════════════════════════ */}
        <section id="contact-qa" className="reveal" style={{
          maxWidth: 1140, margin: "0 auto", padding: "10px 24px 90px",
          position: "relative", zIndex: 1,
          display: mode === "qa" ? "block" : "none",
          textAlign: "left",
        }}>
          <div style={{ marginBottom: 36, textAlign: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: C.qa1, letterSpacing: 1 }}>QA INQUIRY</span>
            <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", margin: "8px 0 10px" }}>
              Let's Improve Your <GradText from={C.qa1} to={C.qa2}>Software Quality</GradText>
            </h2>
            <p style={{ color: C.mid, fontSize: 15.5, margin: "0 auto", maxWidth: 520 }}>
              Share your application details and testing requirements.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ── Info banner ── */}
            <GlassCard hover={false} style={{
              background: "linear-gradient(135deg,rgba(52,230,196,0.08),rgba(124,92,255,0.06))",
              padding: "26px 28px", position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16,
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${C.qa1}18, transparent 70%)`, pointerEvents: "none" }} />

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", flexShrink: 0, background: `${C.qa1}18`, border: `1px solid ${C.qa1}30`, color: C.qa1 }}>
                    <TestTube2 size={19} />
                  </div>
                  <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0, color: C.hi }}>Ready to Improve Your Software Quality?</h3>
                </div>
                <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.75, margin: "0 0 16px", maxWidth: 480 }}>
                  I'll help identify and fix defects before they reach your users — with clear test documentation and professional reporting.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px" }}>
                  <Clock size={13} style={{ color: C.qa1 }} />
                  <span style={{ fontFamily: body, fontSize: 13, color: C.mid }}>Typical response: <span style={{ color: C.hi, fontWeight: 600 }}>24–48 hours</span></span>
                </div>
              </div>
            </GlassCard>
            {/* ── Form ── */}
            <GlassCard hover={false} style={{ padding: 30 }}>
              <QAWizard />
            </GlassCard>

            <ProcessTimeline mode="qa" />


          </div>
        </section>

        <FAQSection mode={mode} />

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 24, marginTop: 10, paddingBottom: 60, position: "relative", zIndex: 1 }}>
          {[
            { icon: <Mail size={15} />, label: "hello.deshanth@gmail.com", href: "mailto:hello.deshanth@gmail.com" },
            { icon: <GitBranch size={15} />, label: "github.com/Desh07", href: "https://github.com/Desh07" },
            { icon: <ArrowUpRight size={15} />, label: "LinkedIn", href: "https://www.linkedin.com/in/vishvalingam-deshanth" },
            { icon: <MapPin size={15} />, label: "Matale, Sri Lanka", href: null },
          ].map(({ icon, label, href }) => {
            const cColor = mode === "qa" ? C.qa1 : C.fl1;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0, background: `${cColor}14`, border: `1px solid ${cColor}22`, color: cColor }}>{icon}</div>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    style={{ fontFamily: body, fontSize: 13.5, color: C.mid, fontWeight: 500, transition: "color .2s ease" }}
                    onMouseEnter={e => e.currentTarget.style.color = C.hi}
                    onMouseLeave={e => e.currentTarget.style.color = C.mid}
                  >{label}</a>
                ) : <span style={{ fontFamily: body, fontSize: 13.5, color: C.mid }}>{label}</span>}
              </div>
            );
          })}
        </div>

        <footer style={{ borderTop: `1px solid ${mode === "qa" ? "rgba(52,230,196,0.12)" : "rgba(255,122,89,0.12)"}`, padding: "22px 24px", textAlign: "center", color: C.low, fontSize: 12.5, position: "relative", zIndex: 1 }}>
          © {new Date().getFullYear()} Deshanth Vishvalingam - designed with curiosity, tested with care.
        </footer>
        <style dangerouslySetInnerHTML={{
          __html: `
        .formRow { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: left; }
        @media (max-width: 600px) { .formRow { grid-template-columns: 1fr; } }
        .formField { display: flex; flex-direction: column; gap: 8px; text-align: left !important; }
        .formLabel { font-family: var(--sans); font-size: 13.5px; font-weight: 600; color: #B7AFD6; text-align: left !important; margin: 0; }
        .formInput, .formSelect, .formTextarea { width: 100%; box-sizing: border-box; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px 16px; color: #F6F4FF; font-family: var(--sans); font-size: 14.5px; transition: border-color 0.2s ease, background 0.2s ease; text-align: left !important; }
        .formInput:focus, .formSelect:focus, .formTextarea:focus { outline: none; border-color: rgba(255, 255, 255, 0.25); background: rgba(255, 255, 255, 0.06); }
        .formTextarea { resize: vertical; }
        .wizGrid5 { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; text-align: left; }
        .wizGrid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; text-align: left; }
        .selCard, .selCardSm { cursor: pointer; border-radius: 16px; padding: 16px; text-align: left !important; transition: background 0.25s ease; }
        .selCardSm { padding: 12px 16px; }
        .selCard:hover, .selCardSm:hover { background: rgba(255, 255, 255, 0.06) !important; }
        
        .wizFwd { animation: wizSlideFwd 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .wizBwd { animation: wizSlideBwd 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes wizSlideFwd { 0% { opacity: 0; transform: translateX(30px); } 100% { opacity: 1; transform: translateX(0); } }
      ` }} />
      </main>
      <ScrollToTop mode={mode} />
    </div>
  );
}