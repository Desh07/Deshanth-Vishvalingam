import { useState, useEffect } from "react";
import {
  Mail, MapPin, ArrowUpRight, Sparkles, TestTube2,
  Code2, Bug, Workflow, Database, GitBranch, Smartphone, Layers, Boxes,
  Quote, Wand2, Rocket, Menu, X
} from "lucide-react";

/* ---------------------------------------------------------------
   DESIGN: "SIGNAL" — a living, glowing dark studio page.
   Deep indigo-black canvas, two living gradient signatures
   (QA = mint→violet, Freelance = coral→amber), glassmorphic cards,
   floating blobs, magnetic buttons, scroll reveals.

   bg        #0B0915   panel(glass) rgba(255,255,255,.04)
   text-hi   #F6F4FF    text-mid #B7AFD6   text-low #6E6790
   QA grad   #34E6C4 -> #7C5CFF
   FL grad   #FF7A59 -> #FFC857
----------------------------------------------------------------*/
const C = {
  bg: "#0B0915",
  bg2: "#100C1F",
  hi: "#F6F4FF",
  mid: "#B7AFD6",
  low: "#6E6790",
  line: "rgba(255,255,255,0.08)",
  glass: "rgba(255,255,255,0.045)",
  qa1: "#34E6C4",
  qa2: "#7C5CFF",
  fl1: "#FF7A59",
  fl2: "#FFC857",
};

const display = "'Sora', 'Outfit', 'Segoe UI', sans-serif";
const body = "'Inter', 'Segoe UI', sans-serif";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.14 }
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

function GradText({ children, from, to, as = "span", style }) {
  const Tag = as;
  return (
    <Tag style={{
      backgroundImage: `linear-gradient(95deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      ...style,
    }}>{children}</Tag>
  );
}

function Blob({ top, left, size, c1, c2, delay = 0 }) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size, pointerEvents: "none",
      background: `radial-gradient(circle at 30% 30%, ${c1}55, ${c2}22 55%, transparent 72%)`,
      filter: "blur(40px)", borderRadius: "50%", animation: `drift 14s ease-in-out ${delay}s infinite`,
      zIndex: 0,
    }} />
  );
}

function Chip({ children, grad }) {
  return (
    <span style={{
      fontFamily: body, fontSize: 12.5, fontWeight: 600, color: C.hi,
      padding: "7px 14px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6,
      background: C.glass, border: `1px solid ${C.line}`, position: "relative",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: `linear-gradient(95deg, ${grad[0]}, ${grad[1]})` }} />
      {children}
    </span>
  );
}

function GlassCard({ children, style, hover = true, className = "" }) {
  return (
    <div className={`${hover ? "lift" : ""} ${className}`.trim()} style={{
      background: C.glass, border: `1px solid ${C.line}`, borderRadius: 20,
      backdropFilter: "blur(14px)", padding: 24, ...style,
    }}>{children}</div>
  );
}

function ProjectCard({ icon, title, tags, desc, grad, status }) {
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
          <span key={i} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: C.mid,
            background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 8px",
          }}>{t}</span>
        ))}
      </div>
    </GlassCard>
  );
}

function SkillPanel({ icon, title, grad, items }) {
  return (
    <GlassCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
          background: `linear-gradient(135deg, ${grad[0]}30, ${grad[1]}18)`, color: grad[0],
        }}>{icon}</div>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 15.5, color: C.hi }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {items.map((it, i) => (
          <span key={i} style={{
            fontFamily: body, fontSize: 12.5, color: C.mid, padding: "6px 11px", borderRadius: 999,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)",
          }}>{it}</span>
        ))}
      </div>
    </GlassCard>
  );
}

function MagButton({ children, href, primary, grad, onClick, small }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <a
      href={href} onClick={onClick} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
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
        border: primary ? "none" : `1px solid ${C.line}`,
        flexShrink: 0,
      }}>{children}</a>
  );
}

export default function Portfolio() {
  const [mode, setMode] = useState("qa"); // qa | freelance
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();
  const scrolled = useScrolled();
  const grad = mode === "qa" ? [C.qa1, C.qa2] : [C.fl1, C.fl2];

  const navLinks = [
    { id: "about", label: "About" },
    { id: "work", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const goTo = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      background: `linear-gradient(180deg, ${C.bg}, ${C.bg2})`, minHeight: "100vh", color: C.hi,
      fontFamily: body, position: "relative", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        ::selection { background: ${C.qa1}55; }
        body { margin: 0; }
        @keyframes drift { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(20px,-26px) scale(1.06);} }
        @keyframes floaty { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes spinSlow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .lift { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .lift:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.18); box-shadow: 0 20px 40px -20px rgba(124,92,255,0.35); }
        .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .grid3 { display:grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media (max-width: 880px) { .grid3 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .grid2, .grid3 { grid-template-columns: 1fr; } }
        @media (max-width: 700px) { .aboutGrid { grid-template-columns: 1fr !important; text-align: center; } .aboutGrid > div:first-child { margin: 0 auto; } .aboutGrid div[style*="display: flex"] { justify-content: center; } .aboutGrid .switchWrap { margin: 0 auto; } }
        button:focus-visible, a:focus-visible { outline: 2px solid ${C.qa1}; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .reveal, .lift, [style*="drift"], [style*="floaty"] { animation: none !important; transition: none !important; } }
        .switchWrap { display:flex; background: rgba(255,255,255,0.05); border:1px solid ${C.line}; border-radius: 999px; padding: 4px; gap: 4px; }
        .switchBtn { font-family:'Inter',sans-serif; font-weight:700; font-size:13px; padding:9px 18px; border-radius:999px; border:none; cursor:pointer; display:flex; align-items:center; gap:7px; background:transparent; color:${C.mid}; transition: background .25s ease, color .25s ease; }
        .navToggleBtn { padding: 7px 9px !important; }
        .navLink { transition: color .2s ease, background .2s ease; }
        .navLink:hover { color: ${C.hi}; background: rgba(255,255,255,0.06); }
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 90px; }
        @media (max-width: 760px) {
          .navLinksDesktop { display: none !important; }
          .navSpacerMobile { display: block !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 761px) {
          .navSpacerMobile { display: none !important; }
          .mobileMenu { display: none !important; }
        }
      `}</style>

      {/* ambient blobs */}
      <Blob top="-120px" left="-100px" size={420} c1={C.qa1} c2={C.qa2} />
      <Blob top="200px" left="70%" size={360} c1={C.fl1} c2={C.fl2} delay={3} />
      <Blob top="900px" left="-60px" size={300} c1={C.qa2} c2={C.fl1} delay={6} />

      {/* NAV */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "center",
        padding: scrolled ? "12px 16px" : "20px 16px",
        transition: "padding .35s ease",
      }}>
        <div style={{
          width: "100%", maxWidth: scrolled ? 760 : 1140,
          display: "flex", alignItems: "center", gap: 8,
          background: scrolled ? "rgba(16,12,31,0.72)" : "rgba(16,12,31,0.35)",
          border: `1px solid ${scrolled ? C.line : "rgba(255,255,255,0.05)"}`,
          borderRadius: 999,
          padding: scrolled ? "8px 10px 8px 18px" : "12px 14px 12px 22px",
          backdropFilter: "blur(18px)",
          boxShadow: scrolled ? "0 12px 30px -16px rgba(0,0,0,0.6)" : "none",
          transition: "all .35s ease",
        }}>
          <a href="#top" onClick={goTo("top")} style={{ fontFamily: display, fontWeight: 800, fontSize: scrolled ? 16 : 18, transition: "font-size .35s ease", flexShrink: 0 }}>
            DV<GradText from={C.qa1} to={C.qa2}>.</GradText>
          </a>

          {/* desktop links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 10, flex: 1 }} className="navLinksDesktop">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={goTo(l.id)} style={{
                fontFamily: body, fontWeight: 600, fontSize: 13.5, color: C.mid,
                padding: "8px 13px", borderRadius: 999, whiteSpace: "nowrap",
              }} className="navLink">{l.label}</a>
            ))}
          </nav>

          <div style={{ flex: 1 }} className="navSpacerMobile" />

          {/* compact toggle — appears in header once scrolled */}
          <div
            className="switchWrap navToggle"
            style={{
              display: "inline-flex",
              opacity: scrolled ? 1 : 0,
              transform: scrolled ? "scale(1)" : "scale(0.85)",
              maxWidth: scrolled ? 200 : 0,
              overflow: "hidden",
              pointerEvents: scrolled ? "auto" : "none",
              transition: "opacity .3s ease, transform .3s ease, max-width .35s ease",
              flexShrink: 0,
              padding: scrolled ? 3 : 0,
              marginRight: scrolled ? 4 : 0,
            }}
          >
            <button className="switchBtn navToggleBtn" title="QA Engineer" aria-label="QA Engineer" onClick={() => setMode("qa")} style={mode === "qa" ? { color: "#0B0915", background: `linear-gradient(95deg, ${C.qa1}, ${C.qa2})` } : {}}>
              <TestTube2 size={13} />
            </button>
            <button className="switchBtn navToggleBtn" title="Freelance Dev" aria-label="Freelance Dev" onClick={() => setMode("freelance")} style={mode === "freelance" ? { color: "#0B0915", background: `linear-gradient(95deg, ${C.fl1}, ${C.fl2})` } : {}}>
              <Code2 size={13} />
            </button>
          </div>

          <MagButton href="#contact" onClick={goTo("contact")} primary grad={[C.qa1, C.qa2]} small>
            <Mail size={14} /> Hire me
          </MagButton>

          {/* mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none", width: 38, height: 38, borderRadius: 999, border: `1px solid ${C.line}`,
              background: "rgba(255,255,255,0.04)", color: C.hi, alignItems: "center", justifyContent: "center",
              flexShrink: 0, cursor: "pointer",
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* mobile dropdown */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 16, right: 16,
            background: "rgba(16,12,31,0.95)", border: `1px solid ${C.line}`, borderRadius: 18,
            backdropFilter: "blur(18px)", padding: 10, display: "flex", flexDirection: "column", gap: 2,
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.7)",
          }} className="mobileMenu">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={goTo(l.id)} style={{
                fontFamily: body, fontWeight: 600, fontSize: 15, color: C.hi,
                padding: "12px 14px", borderRadius: 12,
              }}>{l.label}</a>
            ))}
          </div>
        )}
      </header>

      {/* spacer so hero isn't hidden under fixed nav */}
      <div id="top" style={{ height: 86 }} />


      {/* HERO */}
      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "78px 24px 50px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <Chip grad={[C.qa1, C.qa2]}>Interning @ SoftwarePlus Pvt Ltd · Sri Lanka</Chip>
          <h1 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(40px,6.4vw,70px)", lineHeight: 1.04, letterSpacing: -1.5, margin: "22px 0 18px" }}>
            Hi, I'm Deshanth —<br />
            <GradText from={C.qa1} to={C.qa2}>I find what breaks</GradText>{" "}
            before your users do.
          </h1>
          <p style={{ color: C.mid, fontSize: 18, lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 560 }}>
            Final-year Network &amp; Mobile Computing student specialising in Software Quality
            Assurance — manual, automated, and a little obsessive about good test design. I also
            build websites on the side, freelance, just for fun and extra income.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <MagButton href="#work" primary grad={[C.qa1, C.qa2]}><Rocket size={16} /> See my work</MagButton>
            <MagButton href="#contact" grad={[C.qa1, C.qa2]}><Mail size={16} /> Say hello</MagButton>
          </div>
        </div>

        {/* floating stat row */}
        <div className="grid3" style={{ marginTop: 64 }}>
          {[
            { n: "2+", l: "Automation frameworks shipped", icon: <TestTube2 size={18} /> },
            { n: "Ongoing", l: "QA internship @ SoftwarePlus", icon: <Sparkles size={18} /> },
            { n: "5+", l: "Personal & freelance projects", icon: <Wand2 size={18} /> },
          ].map((s, i) => (
            <GlassCard key={i} style={{ textAlign: "center", animation: `floaty 5s ease-in-out ${i * 0.5}s infinite` }}>
              <div style={{ color: C.qa1, marginBottom: 8, display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26 }}>{s.n}</div>
              <div style={{ color: C.mid, fontSize: 13 }}>{s.l}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "30px 24px 70px", position: "relative", zIndex: 1 }}>
        <GlassCard className="aboutGrid" style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 32, padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 170, height: 170, borderRadius: "32% 68% 65% 35% / 45% 35% 65% 55%",
              padding: 4, background: `linear-gradient(135deg, ${C.qa1}, ${C.qa2}, ${C.fl1})`,
              animation: "spinSlow 18s linear infinite",
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "32% 68% 65% 35% / 45% 35% 65% 55%", overflow: "hidden", background: C.bg2 }}>
                {/* Replace src with your own photo */}
                <img src="/profile.jpeg" alt="Deshanth Vishvalingam" style={{ width: "100%", height: "100%", objectFit: "cover", animation: "spinSlow 18s linear infinite reverse" }} />
              </div>
            </div>
            <Chip grad={[C.qa1, C.qa2]}>Open to opportunities</Chip>
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.qa1, letterSpacing: 1 }}>ABOUT ME</span>
            <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: 28, margin: "8px 0 14px" }}>
              Quality isn't a phase, it's a habit.
            </h2>
            <p style={{ color: C.mid, fontSize: 15.5, lineHeight: 1.8, margin: "0 0 14px" }}>
              I'm a final-year undergraduate specializing in Software Quality Assurance, focused on breaking systems to make them better. I work across manual and automated testing, with an emphasis on test design, defect tracking, and ensuring software behaves as expected under real-world conditions.
            </p>
            <p style={{ color: C.mid, fontSize: 15.5, lineHeight: 1.8, margin: "0 0 18px" }}>
              Currently, I’m a QA Intern at <span style={{ color: C.hi, fontWeight: 600 }}>SoftwarePlus Pvt Ltd</span>,
              contributing to testing web application modules in Agile sprint cycles. I also freelance as a web developer, which strengthens my understanding of application architecture and improves the way I approach testing.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Chip grad={[C.qa1, C.qa2]}><MapPin size={12} /> Matale, Sri Lanka</Chip>
              <Chip grad={[C.qa1, C.qa2]}><Workflow size={12} /> Agile / Scrum</Chip>
              <Chip grad={[C.fl1, C.fl2]}><Code2 size={12} /> Freelance web dev</Chip>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* MODE TOGGLE */}
      <section className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 50px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: C.low, fontSize: 13, fontFamily: body, marginBottom: 14, letterSpacing: 0.3 }}>
            Switch between QA and Freelance to see matching skills, experience &amp; projects
          </p>
          <div className="switchWrap" style={{ display: "inline-flex" }}>
            <button className="switchBtn" onClick={() => setMode("qa")} style={mode === "qa" ? { color: "#0B0915", background: `linear-gradient(95deg, ${C.qa1}, ${C.qa2})` } : {}}>
              <TestTube2 size={15} /> QA Engineer
            </button>
            <button className="switchBtn" onClick={() => setMode("freelance")} style={mode === "freelance" ? { color: "#0B0915", background: `linear-gradient(95deg, ${C.fl1}, ${C.fl2})` } : {}}>
              <Code2 size={15} /> Freelance Dev
            </button>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="work" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 26 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: grad[0], letterSpacing: 1 }}>
            {mode === "qa" ? "QA TOOLKIT" : "DEV TOOLKIT"}
          </span>
          <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(24px,3.2vw,34px)", margin: "8px 0 0" }}>
            {mode === "qa" ? <>What I use to <GradText from={grad[0]} to={grad[1]}>break things on purpose</GradText></> : <>What I use to <GradText from={grad[0]} to={grad[1]}>build things people enjoy</GradText></>}
          </h2>
        </div>

        {mode === "qa" ? (
          <div className="grid3">
            <SkillPanel icon={<Bug size={17} />} title="Manual Testing" grad={[C.qa1, C.qa2]} items={["Test case design", "Exploratory testing", "Defect tracking", "Regression testing", "SDLC & STLC", "Agile / Scrum", "Jira"]} />
            <SkillPanel icon={<TestTube2 size={17} />} title="Automation" grad={[C.qa1, C.qa2]} items={["Selenium WebDriver", "TestNG", "Page Object Model", "Maven", "ExtentReports"]} />
            <SkillPanel icon={<Workflow size={17} />} title="API Testing" grad={[C.qa1, C.qa2]} items={["Postman", "Newman CLI", "REST methods", "JSON validation", "API chaining"]} />
            <SkillPanel icon={<GitBranch size={17} />} title="CI/CD & Tools" grad={[C.qa1, C.qa2]} items={["Git & GitHub", "GitHub Actions", "Jenkins (learning)", "Linux basics"]} />
            <SkillPanel icon={<Database size={17} />} title="Database" grad={[C.qa1, C.qa2]} items={["MySQL", "Firebase Realtime DB"]} />
            <GlassCard style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
              <Quote size={18} style={{ color: C.qa1 }} />
              <p style={{ color: C.mid, fontSize: 13.5, fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
                "A bug found in testing costs minutes. A bug found in production costs trust."
              </p>
            </GlassCard>
          </div>
        ) : (
          <div className="grid3">
            <SkillPanel icon={<Code2 size={17} />} title="Core Web" grad={[C.fl1, C.fl2]} items={["HTML & CSS", "JavaScript", "PHP"]} />
            <SkillPanel icon={<Smartphone size={17} />} title="Mobile" grad={[C.fl1, C.fl2]} items={["React Native"]} />
            <SkillPanel icon={<Layers size={17} />} title="Desktop & Infra" grad={[C.fl1, C.fl2]} items={["Java", "Docker"]} />
          </div>
        )}
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 60px", position: "relative", zIndex: 1 }}>
        {mode === "qa" ? (
          <GlassCard style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap", padding: 30 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: "grid", placeItems: "center",
              background: `linear-gradient(135deg, ${C.qa1}30, ${C.qa2}18)`, color: C.qa1,
            }}><Boxes size={24} /></div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0 }}>QA Intern — SoftwarePlus Pvt Ltd</h3>
                <span style={{ fontFamily: body, fontWeight: 700, fontSize: 11, color: C.qa1, background: `${C.qa1}18`, border: `1px solid ${C.qa1}40`, borderRadius: 999, padding: "3px 10px" }}>ONGOING</span>
              </div>
              <p style={{ color: C.mid, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>
                I take part in manual and automated testing across web application modules — executing
                test cases, identifying and reporting defects, and supporting regression testing within
                Agile sprint cycles. I also contribute to test documentation and work closely with
                developers to keep software quality and stability on track.
              </p>
            </div>
          </GlassCard>
        ) : (
          <GlassCard style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap", padding: 30 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: "grid", placeItems: "center",
              background: `linear-gradient(135deg, ${C.fl1}30, ${C.fl2}18)`, color: C.fl1,
            }}><Code2 size={24} /></div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: 19, margin: 0 }}>Freelance Web Developer — Self-employed</h3>
                <span style={{ fontFamily: body, fontWeight: 700, fontSize: 11, color: C.fl1, background: `${C.fl1}18`, border: `1px solid ${C.fl1}40`, borderRadius: 999, padding: "3px 10px" }}>ONGOING</span>
              </div>
              <p style={{ color: C.mid, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>
                Alongside my QA work, I take on freelance web development projects — building small
                business sites, e-commerce pages, and tools using HTML, CSS, JavaScript, and PHP. It
                keeps me close to how real systems are built, which sharpens how I test them.
              </p>
            </div>
          </GlassCard>
        )}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 70px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 26 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: grad[0], letterSpacing: 1 }}>FEATURED PROJECTS</span>
          <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(24px,3.2vw,34px)", margin: "8px 0 0" }}>
            {mode === "qa" ? "Frameworks I've built to catch bugs early" : "Things I've shipped on the dev side"}
          </h2>
        </div>

        {mode === "qa" ? (
          <div className="grid3">
            <ProjectCard icon={<TestTube2 size={20} />} title="Selenium UI Automation Framework" status="PASSING" grad={[C.qa1, C.qa2]}
              tags={["Selenium", "TestNG", "POM", "ExtentReports", "GitHub Actions"]}
              desc="A reusable framework built with Selenium WebDriver and TestNG, structured with the Page Object Model. Automates core e-commerce flows — login, cart, checkout — with execution reports and a GitHub Actions CI pipeline." />
            <ProjectCard icon={<Workflow size={20} />} title="API Test Automation Framework" status="PASSING" grad={[C.qa1, C.qa2]}
              tags={["Postman", "Newman", "REST", "CI/CD"]}
              desc="Postman collections validating REST endpoints, with automated CRUD operations, response assertions, environment variables, and API chaining — wired into GitHub Actions via Newman CLI." />
            <ProjectCard icon={<Bug size={20} />} title="Manual Testing — Demo Web App" status="PASSING" grad={[C.qa1, C.qa2]}
              tags={["Test Design", "Exploratory", "Bug Reports"]}
              desc="Designed and executed test cases for a demo web application, ran exploratory testing passes, and documented defects with clear, reproducible reports." />
          </div>
        ) : (
          <div className="grid2">
            <ProjectCard icon={<Smartphone size={20} />} title="Smart Glove — Assistive Communication" status="RESEARCH" grad={[C.fl1, C.fl2]}
              tags={["React Native", "Gesture Recognition"]}
              desc="My final-year research project: a prototype assistive system that captures hand gestures and converts them into readable output inside a mobile app." />
            <ProjectCard icon={<Code2 size={20} />} title="E-commerce Shoe Store" status="SHIPPED" grad={[C.fl1, C.fl2]}
              tags={["HTML/CSS", "JavaScript", "PHP"]}
              desc="A full-stack e-commerce website with product listings and cart functionality, built from scratch." />
            <ProjectCard icon={<Database size={20} />} title="Supermarket Management System" status="SHIPPED" grad={[C.fl1, C.fl2]}
              tags={["Java", "CRUD", "Desktop"]}
              desc="A Java-based CRUD desktop application for managing supermarket inventory." />
            <ProjectCard icon={<Boxes size={20} />} title="Expense Tracker App" status="SHIPPED" grad={[C.fl1, C.fl2]}
              tags={["JavaScript", "Docker"]}
              desc="A simple expense tracking application, containerized with Docker for easy deployment." />
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section id="contact" className="reveal" style={{ maxWidth: 1140, margin: "0 auto", padding: "10px 24px 90px", position: "relative", zIndex: 1 }}>
        <GlassCard style={{
          textAlign: "center", padding: "54px 32px", position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, rgba(52,230,196,0.08), rgba(124,92,255,0.08))`,
        }}>
          <div style={{
            position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%, ${C.qa2}22, transparent 60%)`, pointerEvents: "none",
          }} />
          <Sparkles size={26} style={{ color: C.qa1, marginBottom: 14 }} />
          <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", margin: "0 0 12px" }}>
            Let's make something <GradText from={C.qa1} to={C.qa2}>solid</GradText> together.
          </h2>
          <p style={{ color: C.mid, fontSize: 16, maxWidth: 480, margin: "0 auto 30px" }}>
            Open to QA roles, internship opportunities, and freelance web projects.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <MagButton href="mailto:desh0sevn@gmail.com" primary grad={[C.qa1, C.qa2]}><Mail size={16} /> desh0sevn@gmail.com</MagButton>
            <MagButton href="https://github.com/Desh07" grad={[C.qa1, C.qa2]}><GitBranch size={16} /> GitHub <ArrowUpRight size={13} /></MagButton>
            <MagButton href="#" grad={[C.qa1, C.qa2]}><Code2 size={16} /> LinkedIn <ArrowUpRight size={13} /></MagButton>
          </div>
          <div style={{ marginTop: 24, color: C.low, fontSize: 13, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
            <MapPin size={13} /> Matale, Sri Lanka
          </div>
        </GlassCard>
      </section>

      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "22px 24px", textAlign: "center", color: C.low, fontSize: 12.5, position: "relative", zIndex: 1 }}>
        © {new Date().getFullYear()} Deshanth Vishvalingam — designed with curiosity, tested with care.
      </footer>
    </div>
  );
}
