"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading]   = useState(false);
  const [phase, setPhase]       = useState<"boot"|"exit"|"app">("boot");
  const [bootLine, setBootLine] = useState(0);
  const [scrollY, setScrollY]   = useState(0);
  const feedRef  = useRef<HTMLDivElement>(null);
  const appRef   = useRef<HTMLDivElement>(null);

  const BOOT_LINES = [
    { t: "▸ AURA URBAN RISK ANALYTICS v0.1-beta",    c: "lc" },
    { t: "▸ Establishing satellite uplink...",         c: "dim" },
    { t: "▸ Connecting to Databricks cluster...",      c: "dim" },
    { t: "▸ Loading 847,214 indexed records...",       c: "dim" },
    { t: "▸ Calibrating GPT-4o risk models...",        c: "dim" },
    { t: "▸ SELECT-only guardrails enforced ✓",        c: "ok" },
    { t: "▸ Encryption layer active ✓",                c: "ok" },
    { t: "▸ System ready. Welcome.",                   c: "lc" },
  ];

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setBootLine(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(() => setPhase("exit"), 700);
        setTimeout(() => setPhase("app"), 1500);
      }
    }, 210);
    return () => clearInterval(t);
  }, []);

  // Scroll tracker for scroll-reveal animations
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function fire() {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setMessages(p => [...p, { role: "user", content: q }]);
    setLoading(true);
    setQuestion("");
    try {
      const res  = await fetch("/api/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", results: data.results, answer: data.answer }]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const riskOf = (s: number) =>
    s >= 50 ? { c: "#ff453a", bg: "rgba(255,69,58,0.07)",  l: "CRITICAL" }
    : s >= 20 ? { c: "#ff9f0a", bg: "rgba(255,159,10,0.07)", l: "ELEVATED" }
    :           { c: "#30d158", bg: "rgba(48,209,88,0.07)",  l: "NOMINAL"  };

  // Scroll reveal helper — returns opacity/transform based on scroll position
  const reveal = (triggerY: number, range = 120) => {
    const p = Math.min(1, Math.max(0, (scrollY - triggerY) / range));
    return { opacity: p, transform: `translateY(${(1 - p) * 30}px)` };
  };

  const EXAMPLES = [
    "Which grocery stores are in the most dangerous ZIP codes?",
    "Show the top 5 highest risk locations in Phoenix",
    "Which areas have the lowest crime for safe transit?",
    "Find stores with high population but low crime scores",
    "Compare crime density across different ZIP codes",
    "Which corridors need immediate safety infrastructure?",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:     #06070f;
          --bg2:    #09091a;
          --bg3:    #0d1020;
          --bg4:    #111428;
          --bg5:    #0a0c1e;
          --p:      #7c3aed;
          --p2:     #8b5cf6;
          --p3:     #a78bfa;
          --p4:     #c4b5fd;
          --ind:    #4f46e5;
          --glow:   rgba(124,58,237,0.45);
          --glow2:  rgba(124,58,237,0.18);
          --glow3:  rgba(99,102,241,0.12);
          --w:      #ffffff;
          --w80:    rgba(255,255,255,0.8);
          --w55:    rgba(255,255,255,0.55);
          --w30:    rgba(255,255,255,0.3);
          --w10:    rgba(255,255,255,0.1);
          --w05:    rgba(255,255,255,0.05);
          --b:      rgba(255,255,255,0.08);
          --b2:     rgba(255,255,255,0.13);
          --mono:   'JetBrains Mono', monospace;
          --sans:   'Inter', sans-serif;
        }

        html, body, #__next, [data-nextjs-scroll-focus-boundary] {
          background: var(--bg) !important;
          color-scheme: dark !important;
          scroll-behavior: smooth;
        }
        body { overflow-x: hidden; font-family: var(--sans); color: var(--w); background: var(--bg) !important; }
        /* Nuclear override — kill ANY light theme injected by Next.js/Tailwind/globals */
        *, *::before, *::after { color-scheme: dark !important; }
        @media (prefers-color-scheme: light) {
          html { background: var(--bg) !important; color: var(--w) !important; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.35); border-radius: 4px; }

        /* ── BOOT ── */
        @keyframes bIn  { from{opacity:0;} to{opacity:1;} }
        @keyframes bOut { 0%{opacity:1;transform:scale(1);filter:blur(0);} 100%{opacity:0;transform:scale(1.04);filter:blur(10px);} }
        .boot-in  { animation: bIn  0.35s ease forwards; }
        .boot-out { animation: bOut 0.75s cubic-bezier(0.4,0,1,1) forwards; }

        @keyframes lineIn { from{opacity:0;transform:translateX(-8px);} to{opacity:1;transform:none;} }
        .bl { animation: lineIn 0.18s ease forwards; }

        /* ── APP ── */
        @keyframes appIn { from{opacity:0;filter:blur(6px);transform:translateY(20px);} to{opacity:1;filter:blur(0);transform:none;} }
        .app-in { animation: appIn 1s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ── HERO STAGGER ── */
        @keyframes heroUp { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:none;} }
        .h1 { animation: heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .h2 { animation: heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .h3 { animation: heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
        .h4 { animation: heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .h5 { animation: heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.66s both; }

        /* ── ORB ── */
        @keyframes orbFloat { 0%,100%{transform:translateY(0) rotate(0deg);} 40%{transform:translateY(-18px) rotate(1deg);} 75%{transform:translateY(-8px) rotate(-0.5deg);} }
        .orb { animation: orbFloat 7s ease-in-out infinite; will-change: transform; }

        @keyframes rA { from{transform:rotateZ(0deg) rotateX(68deg);} to{transform:rotateZ(360deg) rotateX(68deg);} }
        @keyframes rB { from{transform:rotateZ(0deg) rotateY(70deg);} to{transform:rotateZ(-360deg) rotateY(70deg);} }
        @keyframes rC { from{transform:rotateZ(0deg) rotateX(50deg) rotateY(25deg);} to{transform:rotateZ(360deg) rotateX(50deg) rotateY(25deg);} }
        .rA { animation: rA 9s linear infinite; will-change: transform; }
        .rB { animation: rB 12s linear infinite; will-change: transform; }
        .rC { animation: rC 16s linear infinite; will-change: transform; }

        @keyframes glowBreath { 0%,100%{opacity:0.65;} 50%{opacity:1;} }
        .glow-breath { animation: glowBreath 4s ease-in-out infinite; }

        /* ── MSG ── */
        @keyframes ml { from{opacity:0;transform:translateX(-8px);} to{opacity:1;transform:none;} }
        @keytml mr { from{opacity:0;transform:translateX(8px);} to{opacity:1;transform:none;} }
        @keyframes mr { from{opacity:0;transform:translateX(8px);} to{opacity:1;transform:none;} }
        .ml{animation:ml 0.25s ease both;} .mr{animation:mr 0.25s ease both;}

        /* ── CARD IN ── */
        @keyframes ci { from{opacity:0;transform:translateY(10px) scale(0.97);} to{opacity:1;transform:none;} }
        .ci { animation: ci 0.35s cubic-bezier(0.16,1,0.3,1) both; }

        /* ── BAR FILL ── */
        @keyframes fb { from{width:0%;} }
        .fb { animation: fb 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ── DOTS ── */
        @keyframes dot { 0%,80%,100%{opacity:0.15;transform:scale(0.55);} 40%{opacity:1;transform:scale(1);} }
        .d1{animation:dot 1.1s ease infinite 0s;} .d2{animation:dot 1.1s ease infinite 0.18s;} .d3{animation:dot 1.1s ease infinite 0.36s;}

        /* ── BLINK ── */
        @keyframes bk { 0%,100%{opacity:1;} 50%{opacity:0;} }
        .bk { animation: bk 1s step-end infinite; }

        /* ── SWEEP ── */
        @keyframes sw { 0%{transform:translateX(-100%);} 100%{transform:translateX(100vw);} }
        .sw { position:absolute;top:0;bottom:0;width:80px;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.1),transparent);animation:sw 1.6s ease-in-out infinite;pointer-events:none;will-change:transform; }

        /* ── STAR TWINKLE ── */
        @keyframes twinkle { 0%,100%{opacity:0.15;} 50%{opacity:0.8;} }

        /* ── GRID ── */
        .grid-overlay {
          background-image:
            linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        /* ── HOVER ── */
        .nav-a { transition: color 0.15s; }
        .nav-a:hover { color: var(--w) !important; }

        .pill { transition: all 0.2s ease; cursor: pointer; }
        .pill:hover { filter: brightness(1.18); transform: translateY(-2px); }
        .pill:active { transform: translateY(0); }

        .ghost { transition: all 0.2s ease; cursor: pointer; }
        .ghost:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.4) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }

        .ex-row { transition: all 0.18s ease; cursor: pointer; }
        .ex-row:hover { background: rgba(124,58,237,0.1) !important; border-color: rgba(124,58,237,0.4) !important; transform: translateX(4px); }

        .feat { transition: all 0.22s ease; }
        .feat:hover { border-color: rgba(124,58,237,0.3) !important; transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.08) !important; }

        .rcard { transition: transform 0.2s ease; will-change: transform; }
        .rcard:hover { transform: translateY(-4px); }

        .fbtn { transition: all 0.18s ease; cursor: pointer; }
        .fbtn:hover:not(:disabled) { filter: brightness(1.2); transform: translateY(-1px); box-shadow: 0 0 30px var(--glow) !important; }

        .inp:focus { outline: none; border-color: rgba(124,58,237,0.5) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .inp::placeholder { color: var(--w30); }

        @keyframes betaBorder { 0%,100%{border-color:rgba(255,69,58,0.15);} 50%{border-color:rgba(255,69,58,0.45);} }
        .betab { animation: betaBorder 2.5s ease infinite; }

        @keyframes badgeFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
        .bfloat { animation: badgeFloat 3.5s ease-in-out infinite; }

        /* Force dark on everything including inputs, selects */
        input, button, select, textarea { color-scheme: dark; background-color: transparent; }
        a { color: inherit; }

        /* Nav button explicit white text */
        .nav-pill-btn { color: #ffffff !important; }

        /* gradient text */
        .grad { background: linear-gradient(135deg, var(--p2), var(--p3), var(--p4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* ══════════════════════════════════
          BOOT SCREEN
      ══════════════════════════════════ */}
      {(phase === "boot" || phase === "exit") && (
        <div className={phase === "exit" ? "boot-out" : "boot-in"} style={{
          position: "fixed", inset: 0,
          background: "var(--bg)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, overflow: "hidden",
        }}>
          {/* Ambient glow behind terminal */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }}/>

          <div style={{
            width: "min(580px,90vw)",
            background: "rgba(10,12,24,0.97)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 0 80px rgba(124,58,237,0.12), 0 40px 100px rgba(0,0,0,0.85)",
          }}>
            {/* Window chrome */}
            <div style={{ padding: "13px 20px", background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(124,58,237,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 7 }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c,opacity:0.85}}/>)}
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--w30)", letterSpacing: 1 }}>aura — system init</span>
              <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#30d158", boxShadow: "0 0 6px #30d158" }}/>
            </div>

            {/* Boot lines */}
            <div style={{ padding: "22px 24px", minHeight: 230 }}>
              {BOOT_LINES.slice(0, bootLine).map((line, i) => (
                <div key={i} className="bl" style={{
                  fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.9, letterSpacing: 0.3,
                  color: line.c === "ok" ? "#30d158" : line.c === "lc" ? "var(--p3)" : "var(--w55)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {line.t}
                  {i === bootLine - 1 && <span className="bk" style={{ color: "var(--p2)" }}>█</span>}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ padding: "0 24px 20px" }}>
              <div style={{ height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(bootLine / BOOT_LINES.length) * 100}%`,
                  background: "linear-gradient(90deg, var(--ind), var(--p), var(--p3))",
                  borderRadius: 2, transition: "width 0.2s ease",
                  boxShadow: "0 0 8px var(--glow)",
                }}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          MAIN APP
      ══════════════════════════════════ */}
      {phase === "app" && (
        <div ref={appRef} className="app-in" style={{ minHeight: "100vh", position: "relative" }}>

          {/* ── FIXED BACKGROUNDS ── */}
          <div className="grid-overlay" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}/>
          {/* Deep navy nebula blobs */}
          <div style={{ position: "fixed", top: "-15%", left: "50%", transform: "translateX(-50%)", width: 1100, height: 700, background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }}/>
          <div style={{ position: "fixed", bottom: "-5%", right: "-8%", width: 700, height: 700, background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }}/>
          <div style={{ position: "fixed", top: "40%", left: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }}/>
          {/* Stars */}
          {[[8,15],[22,68],[36,24],[54,85],[70,38],[84,14],[93,60],[14,46],[62,8],[44,74],[78,52],[30,90]].map(([x,y],i)=>(
            <div key={i} style={{ position:"fixed", left:`${x}%`, top:`${y}%`, width:i%4===0?2:1, height:i%4===0?2:1, borderRadius:"50%", background:"rgba(255,255,255,0.55)", animation:`twinkle ${2.5+i*0.35}s ease-in-out ${i*0.28}s infinite`, pointerEvents:"none", zIndex:0 }}/>
          ))}

          {/* ── NAV ── */}
          <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: "rgba(6,7,15,0.8)", backdropFilter: "blur(24px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            height: 62, display: "flex", alignItems: "center",
            padding: "0 44px", justifyContent: "space-between",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "linear-gradient(135deg, var(--p), var(--p3))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 800,
                boxShadow: "0 0 16px var(--glow2), 0 2px 8px rgba(0,0,0,0.4)",
              }}>A</div>
              <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3, color: "var(--w)" }}>AURA</span>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: 32, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              {[["How It Works","#guide"],["Terminal","#terminal"],["System","#system"],["Beta","#beta"]].map(([l,h])=>(
                <a key={l} href={h} className="nav-a" style={{ fontSize: 14, fontWeight: 500, color: "var(--w55)", textDecoration: "none" }}>{l}</a>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#30d158", boxShadow: "0 0 8px #30d158" }}/>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#30d158", letterSpacing: 2 }}>LIVE</span>
              </div>
              <a href="#terminal" style={{ textDecoration: "none" }}>
                <div className="pill" style={{
                  padding: "9px 24px", borderRadius: 100,
                  background: "linear-gradient(135deg, var(--ind), var(--p), var(--p2))",
                  color: "#ffffff", fontSize: 14, fontWeight: 700,
                  boxShadow: "0 0 22px var(--glow2), 0 4px 16px rgba(0,0,0,0.4)",
                }}>Get Started</div>
              </a>
            </div>
          </nav>

          {/* ══════ HERO ══════ */}
          <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 40px 60px", position: "relative", zIndex: 2, overflow: "hidden" }}>

            {/* 3D ORB */}
            <div className="orb" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 560, height: 560, zIndex: 0 }}>
              {/* Outer nebula glow */}
              <div className="glow-breath" style={{ position: "absolute", inset: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)" }}/>
              {/* Main sphere */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "radial-gradient(circle at 38% 32%, rgba(167,139,250,0.45) 0%, rgba(124,58,237,0.3) 30%, rgba(79,70,229,0.2) 55%, rgba(49,46,129,0.1) 75%, transparent 90%)",
                boxShadow: "0 0 80px rgba(99,102,241,0.35), 0 0 160px rgba(124,58,237,0.15), inset 0 0 80px rgba(99,102,241,0.12)",
              }}/>
              {/* Specular */}
              <div style={{ position: "absolute", top: "22%", left: "28%", width: "20%", height: "20%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(196,132,252,0.25) 50%, transparent 100%)", filter: "blur(10px)" }}/>
              {/* Rings */}
              <div className="rA" style={{ position: "absolute", inset: "6%", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "50%", boxShadow: "0 0 14px rgba(124,58,237,0.15)" }}/>
              <div className="rB" style={{ position: "absolute", inset: "16%", border: "1px solid rgba(167,139,250,0.18)", borderRadius: "50%" }}/>
              <div className="rC" style={{ position: "absolute", inset: "28%", border: "1.5px solid rgba(139,92,246,0.28)", borderRadius: "50%", boxShadow: "0 0 18px rgba(124,58,237,0.22)" }}/>
              {/* Equator shine */}
              <div style={{ position: "absolute", top: "47%", inset: "8%", height: "6%", background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.18),rgba(167,139,250,0.28),rgba(139,92,246,0.18),transparent)", filter: "blur(5px)" }}/>
              {/* Bottom shadow */}
              <div style={{ position: "absolute", bottom: -30, left: "20%", right: "20%", height: 40, background: "radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)", filter: "blur(12px)" }}/>
            </div>

            {/* Hero text — above orb */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="h1 bfloat" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 18px", borderRadius: 100,
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                fontSize: 13, color: "var(--w55)", marginBottom: 36, backdropFilter: "blur(8px)",
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--p3)", boxShadow: "0 0 8px var(--p2)" }}/>
                Urban risk intelligence · plain English · 847K+ records
              </div>

              <h1 className="h2" style={{ fontWeight: 900, fontSize: "clamp(44px,7.5vw,92px)", lineHeight: 1.03, letterSpacing: -3, color: "var(--w)", marginBottom: 8 }}>
                The Smartest Way To
              </h1>
              <h1 className="h2" style={{ fontWeight: 900, fontSize: "clamp(44px,7.5vw,92px)", lineHeight: 1.03, letterSpacing: -3, marginBottom: 30 }}>
                Query{" "}
                <span className="grad" style={{ filter: "drop-shadow(0 0 24px rgba(139,92,246,0.5))" }}>Urban Risk.</span>
              </h1>

              <p className="h3" style={{ fontSize: 18, lineHeight: 1.75, color: "var(--w55)", maxWidth: 480, margin: "0 auto 44px" }}>
                Ask anything in plain English. AURA converts it into precision Databricks queries — returning live crime, population, and safety intelligence instantly.
              </p>

              <div className="h4" style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 80, alignItems: "center" }}>
                <a href="#terminal" style={{ textDecoration: "none" }}>
                  <div className="pill" style={{
                    padding: "16px 42px", borderRadius: 100,
                    background: "linear-gradient(135deg, var(--ind), var(--p), var(--p2))",
                    color: "#fff", fontSize: 16, fontWeight: 700,
                    boxShadow: "0 0 40px var(--glow), 0 0 80px rgba(124,58,237,0.2), 0 8px 32px rgba(0,0,0,0.5)",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    letterSpacing: -0.2,
                  }}>
                    Get Started
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </a>
                <a href="#guide" style={{ textDecoration: "none" }}>
                  <div className="ghost" style={{
                    padding: "15px 36px", borderRadius: 100,
                    background: "rgba(255,255,255,0.07)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    color: "#fff", fontSize: 16, fontWeight: 600,
                    letterSpacing: -0.2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}>
                    Learn More
                  </div>
                </a>
              </div>

              {/* Hero preview card */}
              <div className="h5" style={{
                width: "100%", maxWidth: 820, margin: "0 auto",
                background: "rgba(9,9,26,0.88)", backdropFilter: "blur(24px)",
                border: "1px solid rgba(99,102,241,0.18)", borderRadius: 20,
                boxShadow: "0 0 0 1px rgba(124,58,237,0.06), 0 40px 100px rgba(0,0,0,0.75), 0 0 60px rgba(99,102,241,0.08)",
              }}>
                {/* Chrome */}
                <div style={{ padding: "13px 18px", borderBottom: "1px solid var(--b)", background: "rgba(255,255,255,0.02)", borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
                  </div>
                  {["Terminal","How It Works","System"].map((t,i)=>(
                    <div key={t} style={{ padding:"5px 14px", borderRadius:8, background:i===0?"var(--bg4)":"transparent", border:`1px solid ${i===0?"var(--b2)":"transparent"}`, fontFamily:"var(--mono)", fontSize:11, color:i===0?"var(--w)":"var(--w30)" }}>{t}</div>
                  ))}
                  <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#30d158", boxShadow:"0 0 5px #30d158" }}/>
                    <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"#30d158", letterSpacing:1 }}>LIVE</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <div style={{ padding:"10px 16px", borderRadius:"14px 14px 4px 14px", background:"rgba(124,58,237,0.13)", border:"1px solid rgba(124,58,237,0.22)", fontFamily:"var(--mono)", fontSize:13, color:"var(--w)", maxWidth:"70%", lineHeight:1.55, textAlign:"left" }}>
                      <div style={{ fontSize:8, letterSpacing:3, color:"var(--p3)", marginBottom:5, opacity:0.7 }}>QUERY</div>
                      Which grocery stores are in the most dangerous ZIP codes?
                    </div>
                  </div>
                  <div style={{ padding:"10px 16px", borderRadius:"4px 14px 14px 14px", background:"var(--bg4)", border:"1px solid var(--b)", borderLeft:"2px solid var(--p2)", fontFamily:"var(--mono)", fontSize:12, color:"var(--w55)", lineHeight:1.8, maxWidth:"76%", textAlign:"left" }}>
                    <div style={{ fontSize:8, letterSpacing:3, color:"rgba(167,139,250,0.5)", marginBottom:6 }}>ANALYST REPORT</div>
                    Found 5 stores in high-risk zones. ZIP 85031 leads with a risk index of 87 — 2,340 total crimes against a population of 28,450...
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {[{n:"Walmart",z:"85031",s:87,c:"#ff453a"},{n:"Food City",z:"85019",s:64,c:"#ff9f0a"},{n:"Fry's Food",z:"85009",s:51,c:"#ff9f0a"}].map(s=>(
                      <div key={s.z} style={{ flex:1, padding:"12px 14px", background:`${s.c}0d`, border:`1px solid ${s.c}22`, borderRadius:12, textAlign:"left" }}>
                        <div style={{ fontFamily:"var(--mono)", fontSize:8, color:s.c, letterSpacing:1, marginBottom:5 }}>● {s.s>=50?"CRITICAL":"ELEVATED"}</div>
                        <div style={{ fontSize:11, fontWeight:600, color:"var(--w)", marginBottom:2 }}>{s.n}</div>
                        <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--w30)" }}>ZIP {s.z}</div>
                        <div style={{ marginTop:8, height:2, background:"rgba(255,255,255,0.05)", borderRadius:1 }}>
                          <div style={{ height:"100%", width:`${s.s}%`, background:s.c, borderRadius:1 }}/>
                        </div>
                        <div style={{ marginTop:3, fontFamily:"var(--mono)", fontSize:11, color:s.c, textAlign:"right", fontWeight:700 }}>{s.s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════ HOW IT WORKS ══════ */}
          <section id="guide" style={{ padding: "130px 44px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
            {/* Scroll-reveal */}
            <div style={{ ...reveal(300, 150), transition: "opacity 0.5s ease, transform 0.5s ease", textAlign: "center", marginBottom: 64 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 16px", borderRadius:100, background:"rgba(124,58,237,0.09)", border:"1px solid rgba(124,58,237,0.22)", fontFamily:"var(--mono)", fontSize:10, color:"var(--p3)", letterSpacing:2, marginBottom:18 }}>◈ HOW IT WORKS</div>
              <h2 style={{ fontWeight:800, fontSize:"clamp(34px,4.5vw,60px)", letterSpacing:-2, lineHeight:1.06, marginBottom:14 }}>
                All Of Your Intelligence<br/>
                <span className="grad">In One Place</span>
              </h2>
              <p style={{ fontSize:16, color:"var(--w55)", maxWidth:400, margin:"0 auto" }}>
                A social intelligence environment for urban safety analysts and developers.
              </p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:60 }}>
              {[
                { icon:"💬", n:"01", t:"Remain In Flow\nWhile Querying",      d:"No SQL needed. Ask like a colleague — 'Which areas are most dangerous?' AURA understands, translates, and returns data without breaking your flow.", c:"rgba(99,102,241,0.1)" },
                { icon:"🚀", n:"02", t:"Roll Out Results To\nYour Entire Team", d:"Results arrive as clean shareable risk cards. CRITICAL, ELEVATED, NOMINAL. Share intelligence instantly across your whole organization.", c:"rgba(124,58,237,0.07)" },
                { icon:"🤖", n:"03", t:"Become A\nLeader In AI",                d:"GPT-4o-mini converts your question to deterministic Databricks SQL — SELECT-only locked, zero modification risk, 100% safe in production.", c:"rgba(79,70,229,0.09)" },
                { icon:"⚡", n:"04", t:"Accelerate\nDevelopment",               d:"847K+ indexed records. Real-time risk scoring. Population and crime data normalized to a 0–100 index. Results in seconds, not hours.", c:"rgba(139,92,246,0.08)" },
              ].map((s, i) => (
                <div key={s.n} className="feat" style={{
                  ...reveal(500 + i * 60, 140),
                  transition: `opacity 0.55s ease ${i*0.08}s, transform 0.55s ease ${i*0.08}s`,
                  padding: "38px 34px",
                  background: s.c,
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: i===0?"22px 8px 8px 8px":i===1?"8px 22px 8px 8px":i===2?"8px 8px 8px 22px":"8px 8px 22px 8px",
                  position: "relative", overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ position:"absolute", top:-8, right:20, fontFamily:"var(--mono)", fontSize:80, color:"rgba(255,255,255,0.025)", fontWeight:800, lineHeight:1, userSelect:"none" }}>{s.n}</div>
                  <div style={{ fontSize:32, marginBottom:18 }}>{s.icon}</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--p3)", letterSpacing:3, marginBottom:10, opacity:0.65 }}>STEP {s.n}</div>
                  <div style={{ fontWeight:700, fontSize:21, color:"var(--w)", marginBottom:12, letterSpacing:-0.5, whiteSpace:"pre-line", lineHeight:1.2 }}>{s.t}</div>
                  <div style={{ fontSize:14, lineHeight:1.78, color:"var(--w55)" }}>{s.d}</div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.3),transparent)" }}/>
                </div>
              ))}
            </div>

            {/* Example queries */}
            <div style={{ ...reveal(900, 140), transition:"opacity 0.5s ease,transform 0.5s ease" }}>
              <div style={{ textAlign:"center", marginBottom:22 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 16px", borderRadius:100, background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)", fontFamily:"var(--mono)", fontSize:10, color:"var(--w30)", letterSpacing:2 }}>EXAMPLE QUERIES — CLICK TO USE</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {EXAMPLES.map((ex,i)=>(
                  <div key={i} className="ex-row" style={{ padding:"15px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--b)", borderRadius:12, display:"flex", alignItems:"center", gap:14 }}
                    onClick={()=>{ setQuestion(ex); document.getElementById("terminal")?.scrollIntoView({ behavior:"smooth" }); }}>
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:"rgba(124,58,237,0.14)", border:"1px solid rgba(124,58,237,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--mono)", fontSize:10, color:"var(--p3)" }}>{String(i+1).padStart(2,"0")}</div>
                    <span style={{ fontSize:13, color:"var(--w55)", lineHeight:1.45, flex:1 }}>{ex}</span>
                    <span style={{ color:"var(--w30)", fontSize:14 }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════ TERMINAL ══════ */}
          <section id="terminal" style={{ padding:"0 44px 130px", maxWidth:1100, margin:"0 auto", position:"relative", zIndex:2 }}>
            <div style={{ ...reveal(1200, 140), transition:"opacity 0.5s ease,transform 0.5s ease", textAlign:"center", marginBottom:48 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 16px", borderRadius:100, background:"rgba(124,58,237,0.09)", border:"1px solid rgba(124,58,237,0.22)", fontFamily:"var(--mono)", fontSize:10, color:"var(--p3)", letterSpacing:2, marginBottom:18 }}>⬡ INTELLIGENCE TERMINAL</div>
              <h2 style={{ fontWeight:800, fontSize:"clamp(34px,4.5vw,60px)", letterSpacing:-2, lineHeight:1.06 }}>Query the City.</h2>
            </div>

            <div style={{
              ...reveal(1250, 160), transition:"opacity 0.55s ease,transform 0.55s ease",
              background:"rgba(9,9,26,0.92)", backdropFilter:"blur(24px)",
              border:"1px solid rgba(99,102,241,0.16)", borderRadius:20,
              display:"flex", flexDirection:"column", height:"70vh",
              boxShadow:"0 0 0 1px rgba(124,58,237,0.06), 0 40px 100px rgba(0,0,0,0.75), 0 0 60px rgba(99,102,241,0.07)",
              position:"relative", overflow:"hidden",
            }}>
              {loading && <div className="sw"/>}
              {/* Chrome */}
              <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--b)", background:"rgba(255,255,255,0.02)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ display:"flex", gap:6 }}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
                  <span style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--w30)" }}>aura — risk_query</span>
                </div>
                <span style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:2, color:loading?"#ff9f0a":"#30d158" }}>
                  {loading?<>PROCESSING<span className="bk">_</span></>:<>READY<span className="bk">_</span></>}
                </span>
              </div>

              {/* Feed */}
              <div ref={feedRef} style={{ flex:1, overflowY:"auto", padding:"28px", display:"flex", flexDirection:"column", gap:20 }}>
                {messages.length===0 && (
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, opacity:0.25 }}>
                    <div style={{ width:56, height:56, borderRadius:16, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🔍</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:11, letterSpacing:3, color:"var(--w55)", textAlign:"center" }}>TYPE A QUERY OR CLICK AN EXAMPLE ABOVE</div>
                  </div>
                )}
                {messages.map((msg,i)=>{
                  if(msg.role==="user") return (
                    <div key={i} className="mr" style={{ display:"flex", justifyContent:"flex-end" }}>
                      <div style={{ maxWidth:"64%", padding:"12px 18px", background:"rgba(124,58,237,0.13)", border:"1px solid rgba(124,58,237,0.22)", borderRadius:"16px 16px 4px 16px", fontFamily:"var(--mono)", fontSize:13, color:"var(--w)", lineHeight:1.6 }}>
                        <div style={{ fontSize:8, letterSpacing:3, color:"var(--p3)", marginBottom:6, opacity:0.7 }}>QUERY</div>
                        {msg.content}
                      </div>
                    </div>
                  );
                  return (
                    <div key={i} className="ml" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                      {msg.answer && (
                        <div style={{ padding:"13px 18px", background:"var(--bg4)", border:"1px solid var(--b)", borderLeft:"2px solid var(--p2)", borderRadius:"4px 16px 16px 16px", fontFamily:"var(--mono)", fontSize:13, lineHeight:1.85, color:"var(--w55)" }}>
                          <div style={{ fontSize:8, letterSpacing:3, color:"rgba(167,139,250,0.5)", marginBottom:8 }}>ANALYST REPORT</div>
                          {msg.answer}
                        </div>
                      )}
                      {msg.results?.length>0 && (
                        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6 }}>
                          {msg.results.map((store:any,j:number)=>{
                            const r=riskOf(store.priority_score);
                            return (
                              <div key={j} className="ci rcard" style={{ animationDelay:`${j*65}ms`, minWidth:212, flexShrink:0, background:r.bg, border:`1px solid ${r.c}22`, borderRadius:14, padding:"16px", position:"relative", overflow:"hidden" }}>
                                <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:2, color:r.c, marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                                  <div style={{ width:5, height:5, borderRadius:"50%", background:r.c, boxShadow:`0 0 6px ${r.c}` }}/>{r.l}
                                </div>
                                <div style={{ fontWeight:600, fontSize:14, color:"var(--w)", marginBottom:2, lineHeight:1.2 }}>{store.store_name||`ZIP ${store.zip_code}`}</div>
                                <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--w30)", letterSpacing:1, marginBottom:14 }}>{store.city?.trim()||"UNKNOWN"} · {store.zip_code}</div>
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                                  <div><div style={{ fontFamily:"var(--mono)", fontSize:8, letterSpacing:2, color:"var(--w30)", marginBottom:3 }}>CRIMES</div><div style={{ fontWeight:700, fontSize:20, color:"#ff453a" }}>{(store.total_crimes||0).toLocaleString()}</div></div>
                                  <div><div style={{ fontFamily:"var(--mono)", fontSize:8, letterSpacing:2, color:"var(--w30)", marginBottom:3 }}>POP.</div><div style={{ fontWeight:700, fontSize:20, color:"#60a5fa" }}>{(store.population||0).toLocaleString()}</div></div>
                                </div>
                                <div style={{ fontFamily:"var(--mono)", fontSize:8, letterSpacing:2, color:"var(--w30)", display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                                  <span>RISK INDEX</span><span style={{ color:r.c, fontWeight:700, fontSize:13 }}>{store.priority_score}</span>
                                </div>
                                <div style={{ height:3, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" }}>
                                  <div className="fb" style={{ height:"100%", width:`${Math.min(100,store.priority_score)}%`, background:`linear-gradient(90deg,${r.c}88,${r.c})`, borderRadius:2 }}/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {[1,2,3].map(n=><div key={n} className={`d${n}`} style={{width:7,height:7,borderRadius:"50%",background:"var(--p2)"}}/>)}
                    <span style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:2, color:"var(--w30)", marginLeft:4 }}>Scanning risk vectors...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ borderTop:"1px solid var(--b)", background:"rgba(9,9,26,0.6)", padding:"13px 18px", display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                <input className="inp" style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid var(--b2)", borderRadius:12, padding:"10px 16px", color:"var(--w)", fontFamily:"var(--mono)", fontSize:13, caretColor:"var(--p2)", transition:"border-color 0.2s,box-shadow 0.2s" }} placeholder="Ask anything about urban safety data..." value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fire()}/>
                <button className="fbtn" onClick={fire} disabled={loading||!question.trim()} style={{ padding:"10px 24px", borderRadius:12, background:question.trim()&&!loading?"linear-gradient(135deg,var(--ind),var(--p),var(--p2))":"rgba(255,255,255,0.04)", border:"none", color:question.trim()&&!loading?"var(--w)":"var(--w30)", fontFamily:"var(--sans)", fontSize:13, fontWeight:700, flexShrink:0, boxShadow:question.trim()&&!loading?"0 0 20px var(--glow2)":"none", transition:"all 0.18s ease" }}>
                  {loading?"...":"Execute"}
                </button>
              </div>
            </div>
          </section>

          {/* ══════ SYSTEM ══════ */}
          <section id="system" style={{ padding:"0 44px 130px", maxWidth:1100, margin:"0 auto", position:"relative", zIndex:2 }}>
            <div style={{ ...reveal(1900, 140), transition:"opacity 0.5s ease,transform 0.5s ease", textAlign:"center", marginBottom:52 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 16px", borderRadius:100, background:"rgba(124,58,237,0.09)", border:"1px solid rgba(124,58,237,0.22)", fontFamily:"var(--mono)", fontSize:10, color:"var(--p3)", letterSpacing:2, marginBottom:18 }}>⬢ SYSTEM</div>
              <h2 style={{ fontWeight:800, fontSize:"clamp(34px,4.5vw,60px)", letterSpacing:-2, lineHeight:1.06 }}>Built on Real Infrastructure</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                { icon:"🤖", t:"AI Engine",  c:"var(--p3)", d:"GPT-4o-mini at Temperature 0. Deterministic SQL. SELECT-only enforcement. Zero modification risk in production.", delay:0 },
                { icon:"⚡", t:"Databricks", c:"#60a5fa",   d:"Direct cluster integration. 847,214 records across ZIP codes, stores, crime totals, and population.", delay:80 },
                { icon:"📊", t:"Risk Index", c:"#ff453a",   d:"Crime and population normalized to 0–100 in real time. Powers every card classification automatically.", delay:160 },
              ].map(card=>(
                <div key={card.t} className="feat" style={{
                  ...reveal(2000 + card.delay, 130),
                  transition:`opacity 0.5s ease ${card.delay}ms,transform 0.5s ease ${card.delay}ms`,
                  padding:"34px 28px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--b)", borderRadius:20,
                  position:"relative", overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ fontSize:36, marginBottom:18 }}>{card.icon}</div>
                  <div style={{ fontWeight:700, fontSize:18, color:card.c, marginBottom:10, letterSpacing:-0.3 }}>{card.t}</div>
                  <div style={{ fontSize:14, lineHeight:1.78, color:"var(--w55)" }}>{card.d}</div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,${card.c}22,transparent)` }}/>
                </div>
              ))}
            </div>
          </section>

          {/* ══════ BETA ══════ */}
          <section id="beta" style={{ padding:"0 44px 140px", maxWidth:1100, margin:"0 auto", position:"relative", zIndex:2 }}>
            <div style={{
              ...reveal(2400, 150), transition:"opacity 0.55s ease,transform 0.55s ease",
              border:"1px solid rgba(255,69,58,0.15)", borderRadius:20, padding:"46px 50px",
              background:"rgba(255,69,58,0.025)", position:"relative",
              boxShadow:"0 0 60px rgba(255,69,58,0.04)",
              animation:"betaBorder 2.5s ease infinite",
            }}
              className="betab"
            >
              <div style={{ position:"absolute", top:20, right:24, display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:100, background:"rgba(255,69,58,0.1)", border:"1px solid rgba(255,69,58,0.25)", fontFamily:"var(--mono)", fontSize:10, color:"#ff453a", letterSpacing:2 }}>⚠ BETA v0.1</div>
              <h2 style={{ fontWeight:800, fontSize:"clamp(28px,3.5vw,46px)", letterSpacing:-1.5, lineHeight:1.08, marginBottom:10 }}>Rough Edges. Real Data.</h2>
              <p style={{ fontSize:16, color:"var(--w55)", marginBottom:38, maxWidth:500 }}>AURA is experimental. Powerful but not perfect. Here's what to know before you dive in.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:44 }}>
                <div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:3, color:"rgba(255,69,58,0.55)", marginBottom:20 }}>KNOWN LIMITATIONS</div>
                  {["Queries may occasionally fail or misfire","Some questions get misinterpreted","Cluster may time out — just retry","Indexed data only, not a live feed","Not for operational or policy decisions"].map((x,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, marginBottom:12, alignItems:"flex-start" }}>
                      <div style={{ width:20, height:20, borderRadius:7, background:"rgba(255,69,58,0.1)", border:"1px solid rgba(255,69,58,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#ff453a", flexShrink:0, marginTop:1 }}>✗</div>
                      <span style={{ fontSize:14, color:"var(--w55)", lineHeight:1.65 }}>{x}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:3, color:"rgba(48,209,88,0.55)", marginBottom:20 }}>BEST PRACTICES</div>
                  {["One clear question at a time","Include city names for accuracy","Use extremes — highest, lowest, most","Rephrase and retry if nothing returns","Research and exploration only"].map((x,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, marginBottom:12, alignItems:"flex-start" }}>
                      <div style={{ width:20, height:20, borderRadius:7, background:"rgba(48,209,88,0.1)", border:"1px solid rgba(48,209,88,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#30d158", flexShrink:0, marginTop:1 }}>✓</div>
                      <span style={{ fontSize:14, color:"var(--w55)", lineHeight:1.65 }}>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop:34, paddingTop:26, borderTop:"1px solid var(--b)", fontFamily:"var(--mono)", fontSize:11, color:"var(--w30)", lineHeight:2 }}>
                AURA is experimental. Provided as-is for demo purposes. Not for law enforcement, policy, or operational use. If it breaks — we know. We're fixing it.
              </div>
            </div>
          </section>

          {/* BUILT BY */}
          <section style={{ padding:"0 44px 80px", maxWidth:1100, margin:"0 auto", position:"relative", zIndex:2 }}>
            <div style={{
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:20, padding:"40px 48px",
              background:"rgba(255,255,255,0.02)",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              gap:32,
            }}>
              {/* Left — identity */}
              <div style={{ display:"flex", alignItems:"center", gap:20, flexShrink:0 }}>
                <div style={{
                  width:60, height:60, borderRadius:18,
                  background:"linear-gradient(135deg, var(--ind), var(--p), var(--p3))",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24, fontWeight:900,
                  boxShadow:"0 0 24px var(--glow2), 0 8px 24px rgba(0,0,0,0.4)",
                  flexShrink:0,
                }}>Z</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:20, letterSpacing:-0.5, color:"var(--w)", marginBottom:4 }}>Zain Shah</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--p3)", letterSpacing:1 }}>CS @ ASU · Open to SWE Internships 2026</div>
                </div>
              </div>

              {/* Center — what AURA stands for */}
              <div style={{ textAlign:"center", flex:1 }}>
                <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:4, color:"var(--w30)", marginBottom:10 }}>WHAT AURA MEANS</div>
                <div style={{ fontWeight:700, fontSize:16, color:"var(--w)", letterSpacing:-0.3 }}>
                  <span style={{ background:"linear-gradient(135deg,var(--p2),var(--p3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>A</span>utomated{" "}
                  <span style={{ background:"linear-gradient(135deg,var(--p2),var(--p3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>U</span>rban{" "}
                  <span style={{ background:"linear-gradient(135deg,var(--p2),var(--p3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>R</span>isk{" "}
                  <span style={{ background:"linear-gradient(135deg,var(--p2),var(--p3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>A</span>nalytics
                </div>
              </div>

              {/* Right — links */}
              <div style={{ display:"flex", gap:10, flexShrink:0 }}>
                <a href="https://github.com/SikeTheMike" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <div style={{
                    padding:"10px 20px", borderRadius:100,
                    background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.12)",
                    color:"var(--w80)", fontSize:13, fontWeight:600,
                    display:"flex", alignItems:"center", gap:8,
                    transition:"all 0.18s ease", cursor:"pointer",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </div>
                </a>
                <a href="https://linkedin.com/in/zain-sahir-s-4b1a9a227" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <div style={{
                    padding:"10px 20px", borderRadius:100,
                    background:"linear-gradient(135deg, var(--ind), var(--p))",
                    color:"#fff", fontSize:13, fontWeight:600,
                    display:"flex", alignItems:"center", gap:8,
                    boxShadow:"0 0 16px var(--glow2)",
                    transition:"all 0.18s ease", cursor:"pointer",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.filter="brightness(1.15)";e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.filter="none";e.currentTarget.style.transform="none";}}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div style={{ borderTop:"1px solid var(--b)", padding:"24px 44px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:"linear-gradient(135deg,var(--ind),var(--p2))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, boxShadow:"0 0 12px var(--glow2)" }}>A</div>
              <span style={{ fontWeight:800, fontSize:15, letterSpacing:-0.2 }}>AURA</span>
            </div>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--w30)", letterSpacing:1 }}>AUTOMATED URBAN RISK ANALYTICS · v0.1 BETA · DATABRICKS + OPENAI</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"rgba(255,255,255,0.08)", letterSpacing:1 }}>© 2026 ZAIN SHAH</div>
          </div>
        </div>
      )}
    </>
  );
}