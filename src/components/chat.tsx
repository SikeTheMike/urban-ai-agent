"use client";

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bootPhase, setBootPhase] = useState<"loading"|"hero"|"done">("loading");
  const [loadPct, setLoadPct] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Phase 1: animate loading bar from 0→100 over ~2s
    let pct = 0;
    const tick = setInterval(() => {
      pct += Math.random() * 8 + 2;
      if (pct >= 100) {
        pct = 100;
        clearInterval(tick);
        setLoadPct(100);
        // Phase 2: brief pause then show hero overlay
        setTimeout(() => {
          setBootPhase("hero");
        }, 400);
      } else {
        setLoadPct(Math.min(pct, 99));
      }
    }, 80);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function askQuestion() {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: "assistant",
        sql: data.sql,
        results: data.results,
        answer: data.answer,
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 50) return { color: "#ff3b3b", glow: "rgba(255,59,59,0.6)", label: "CRITICAL" };
    if (score >= 20) return { color: "#ffaa00", glow: "rgba(255,170,0,0.6)", label: "ELEVATED" };
    return { color: "#00e5ff", glow: "rgba(0,229,255,0.6)", label: "NOMINAL" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=Inter:wght@300;400;600;700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cyan: #00e5ff;
          --red: #ff3b3b;
          --gold: #ffaa00;
          --bg: #020408;
          --surface: #080e14;
          --border: rgba(0,229,255,0.15);
          --mono: 'Share Tech Mono', monospace;
          --display: 'Bebas Neue', sans-serif;
          --body: 'Inter', sans-serif;
        }

        html { scroll-behavior: smooth; background: var(--bg); }

        body { overflow-x: hidden; cursor: none !important; }
        * { cursor: none !important; }

        /* CUSTOM CURSOR — sleek arrow pointer */
        .cursor-pointer {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 99999;
          transform: translate(0, 0);
          width: 28px; height: 28px;
          filter: drop-shadow(0 0 4px rgba(0,229,255,0.6));
        }


        /* BOOT SCREEN — AURA logo splash */
        .boot-screen {
          position: fixed; inset: 0; background: var(--bg);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          z-index: 9999;
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .boot-screen.done { opacity: 0; pointer-events: none; transform: scale(1.03); }

        @keyframes bootLogoIn {
          0%   { opacity: 0; letter-spacing: 40px; }
          60%  { opacity: 1; letter-spacing: 20px; }
          100% { opacity: 1; letter-spacing: 20px; }
        }
        @keyframes bootSubIn {
          0%,40% { opacity: 0; transform: translateY(8px); }
          100%   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bootBarFill {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        .boot-logo {
          font-family: var(--display);
          font-size: clamp(72px, 16vw, 160px);
          color: var(--cyan);
          text-shadow: 0 0 60px rgba(0,229,255,0.5), 0 0 120px rgba(0,229,255,0.2);
          animation: bootLogoIn 1s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .boot-sub {
          font-family: var(--mono);
          font-size: clamp(10px, 1.5vw, 13px);
          letter-spacing: 6px;
          color: rgba(0,229,255,0.4);
          margin-top: 16px;
          animation: bootSubIn 1.4s ease forwards;
        }
        .boot-bar-wrap {
          margin-top: 48px;
          width: clamp(200px, 30vw, 360px);
          height: 2px;
          background: rgba(0,229,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          animation: bootSubIn 1.4s ease forwards;
        }
        .boot-bar {
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--cyan));
          box-shadow: 0 0 10px var(--cyan);
          animation: bootBarFill 1.6s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
          width: 0%;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 2px; }

        /* NOISE TEXTURE */
        .noise::after {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
        }

        /* SCANLINES */
        .scanlines::before {
          content: ''; position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
          pointer-events: none; z-index: 9990;
        }

        /* GRID */
        .hex-grid {
          background-image:
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* GLITCH */
        @keyframes glitch1 {
          0%,100% { clip-path: inset(0 0 95% 0); transform: translate(-3px, 0); }
          20% { clip-path: inset(40% 0 50% 0); transform: translate(3px, 0); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 0); }
          60% { clip-path: inset(20% 0 60% 0); transform: translate(2px, 0); }
          80% { clip-path: inset(85% 0 5% 0); transform: translate(-1px, 0); }
        }
        @keyframes glitch2 {
          0%,100% { clip-path: inset(80% 0 5% 0); transform: translate(3px, 0); color: #ff003c; }
          30% { clip-path: inset(10% 0 80% 0); transform: translate(-3px, 0); }
          60% { clip-path: inset(50% 0 30% 0); transform: translate(1px, 0); }
        }
        .glitch { position: relative; }
        .glitch::before, .glitch::after {
          content: attr(data-text); position: absolute; inset: 0;
          font: inherit; color: inherit; letter-spacing: inherit;
        }
        .glitch::before { animation: glitch1 4s infinite; color: var(--cyan); opacity: 0.7; }
        .glitch::after { animation: glitch2 4s infinite 0.1s; color: #ff003c; opacity: 0.5; }

        /* TERMINAL */
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink 1s step-end infinite; }

        /* SCAN LINE SWEEP */
        @keyframes sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .sweep-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          animation: sweep 2.5s linear infinite; opacity: 0.4; pointer-events: none;
        }

        /* CARDS */
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-reveal { animation: cardReveal 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* MESSAGE APPEAR */
        @keyframes msgIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .msg-in { animation: msgIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }

        @keyframes userMsgIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .user-msg-in { animation: userMsgIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* PULSE BORDER */
        @keyframes borderPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.4), inset 0 0 30px rgba(0,229,255,0.02); }
          50% { box-shadow: 0 0 30px rgba(0,229,255,0.15), inset 0 0 30px rgba(0,229,255,0.04); }
        }
        .border-pulse { animation: borderPulse 3s ease infinite; }

        /* LOADING DOTS */
        @keyframes loadDot {
          0%,80%,100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        .load-dot:nth-child(1) { animation: loadDot 1.2s ease infinite 0s; }
        .load-dot:nth-child(2) { animation: loadDot 1.2s ease infinite 0.2s; }
        .load-dot:nth-child(3) { animation: loadDot 1.2s ease infinite 0.4s; }

        /* HERO BIG TEXT */
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* DATA STREAM */
        @keyframes stream {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(-100%); opacity: 0; }
        }

        /* ORBIT */
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }

        @keyframes orbitReverse {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(80px) rotate(360deg); }
        }

        /* RISK METER */
        @keyframes fillBar {
          from { width: 0%; }
        }
        .fill-bar { animation: fillBar 1s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* HEX NODES */
        @keyframes hexPulse {
          0%,100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        /* INPUT GLOW */
        .input-glow:focus {
          box-shadow: 0 0 20px rgba(0,229,255,0.12), inset 0 0 20px rgba(0,229,255,0.02);
          outline: none !important;
          border-color: rgba(0,229,255,0.5) !important;
        }

        /* NAV LINK */
        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 1px;
          background: var(--cyan); transform: scaleX(0); transition: transform 0.3s ease;
          transform-origin: left;
        }
        .nav-link:hover::after { transform: scaleX(1); }

        /* SECTION TRANSITIONS */
        .section-fade { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .section-fade.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* CUSTOM CURSOR — arrow pointer SVG */}
      <svg className="cursor-pointer" style={{ left: mousePos.x, top: mousePos.y, transition: "left 0.06s ease, top 0.06s ease" }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L9 18L11.5 12L18 9.5L2 2Z" fill="#00e5ff" fillOpacity="0.95" stroke="#00e5ff" strokeWidth="0.5"/>
        <path d="M11.5 12L18 18" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* SCANLINES OVERLAY */}
      <div className="scanlines" />

      {/* ── PHASE 1: LOADING SCREEN ── */}
      {bootPhase === "loading" && (
        <div style={{
          position: "fixed", inset: 0, background: "var(--bg)",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          zIndex: 9999, gap: 0,
          transition: "opacity 0.6s ease",
        }}>
          {/* Big AURA logo */}
          <div style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(60px, 14vw, 140px)",
            color: "var(--cyan)",
            letterSpacing: 20,
            textShadow: "0 0 60px rgba(0,229,255,0.4), 0 0 120px rgba(0,229,255,0.15)",
            lineHeight: 1, marginBottom: 8,
            animation: "bootLogoIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards"
          }}>
            AURA
          </div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 6,
            color: "rgba(0,229,255,0.35)", marginBottom: 56,
            animation: "bootSubIn 1.2s ease forwards"
          }}>
            AUTOMATED URBAN RISK ANALYTICS
          </div>
          {/* Loading bar */}
          <div style={{ width: "clamp(240px,28vw,380px)", animation: "bootSubIn 1.2s ease forwards" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: 3, color: "rgba(0,229,255,0.3)", marginBottom: 10 }}>
              <span>INITIALIZING</span>
              <span style={{ color: "var(--cyan)" }}>{Math.round(loadPct)}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(0,229,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${loadPct}%`,
                background: "linear-gradient(90deg, rgba(0,229,255,0.4), var(--cyan))",
                boxShadow: "0 0 12px var(--cyan)",
                borderRadius: 2, transition: "width 0.12s ease"
              }} />
            </div>
            <div style={{ marginTop: 16, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, color: "rgba(0,229,255,0.2)", height: 14 }}>
              {loadPct < 30 && "CONNECTING TO DATABRICKS CLUSTER..."}
              {loadPct >= 30 && loadPct < 60 && "INDEXING GROCERY_SAFETY_INDEX TABLE..."}
              {loadPct >= 60 && loadPct < 85 && "LOADING GPT-4o-mini ENGINE..."}
              {loadPct >= 85 && loadPct < 100 && "ACTIVATING FAILSAFE PROTOCOLS..."}
              {loadPct >= 100 && <span style={{ color: "#00ff88" }}>ALL SYSTEMS NOMINAL ✓</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 2: HERO OVERLAY (sits on top of main content, then fades away) ── */}
      {bootPhase === "hero" && (
        <div id="hero-overlay" style={{
          position: "fixed", inset: 0,
          background: "var(--bg)",
          zIndex: 9998,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          textAlign: "center", padding: "0 40px",
          animation: "heroOverlayIn 0.5s ease forwards",
        }}>
          <style>{`
            @keyframes heroOverlayIn { from { opacity:0; } to { opacity:1; } }
            @keyframes heroOverlayOut { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(1.02); } }
            #hero-overlay.out { animation: heroOverlayOut 0.55s ease forwards !important; }
          `}</style>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 4, color: "rgba(0,229,255,0.5)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 1, background: "rgba(0,229,255,0.3)" }} />
            CLASSIFIED // URBAN INTELLIGENCE PLATFORM
            <div style={{ width: 32, height: 1, background: "rgba(0,229,255,0.3)" }} />
          </div>
          <div style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(72px,15vw,180px)",
            color: "#fff", letterSpacing: 16, lineHeight: 0.9,
            textShadow: "0 0 80px rgba(0,229,255,0.25)",
            marginBottom: 12
          }}>AURA</div>
          <div style={{ fontFamily: "var(--display)", fontSize: "clamp(12px,2.5vw,24px)", letterSpacing: 10, color: "rgba(255,255,255,0.2)", marginBottom: 40 }}>
            AUTOMATED URBAN RISK ANALYTICS
          </div>
          <p style={{ maxWidth: 520, color: "rgba(255,255,255,0.35)", fontSize: 19, lineHeight: 1.8, fontWeight: 300, marginBottom: 48, fontFamily: "var(--body)" }}>
            Natural language to Databricks SQL. Real-time crime vectors, population density, and risk indexing across urban corridors.
          </p>
          <button
            onClick={() => {
              const overlay = document.getElementById("hero-overlay");
              if (overlay) {
                overlay.classList.add("out");
                setTimeout(() => setBootPhase("done"), 560);
              } else {
                setBootPhase("done");
              }
            }}
            style={{
              padding: "18px 56px", borderRadius: 4,
              border: "1.5px solid var(--cyan)",
              background: "rgba(0,229,255,0.06)",
              fontFamily: "var(--mono)", fontSize: 13, letterSpacing: 5,
              color: "var(--cyan)", transition: "all 0.3s ease",
              display: "inline-flex", alignItems: "center", gap: 16
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--cyan)"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,229,255,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,229,255,0.06)"; e.currentTarget.style.color = "var(--cyan)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            INITIALIZE TERMINAL
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      <div className="noise hex-grid" style={{
        minHeight: "100vh", background: "var(--bg)", color: "#e0e8f0",
        fontFamily: "var(--body)", overflowX: "hidden", position: "relative",
        opacity: bootPhase === "done" ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: bootPhase === "done" ? "auto" : "none"
      }}>

        {/* AMBIENT ORBS */}
        <div style={{
          position: "fixed", top: "10%", left: "-10%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0
        }} />
        <div style={{
          position: "fixed", bottom: "5%", right: "-15%", width: 800, height: 800,
          background: "radial-gradient(circle, rgba(255,59,59,0.04) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0
        }} />

        {/* ═══════════════════════════════ NAV ═══════════════════════════════ */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(2,4,8,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "2px solid var(--border)", padding: "0 40px",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo */}
            <div style={{
              fontFamily: "var(--display)", fontSize: 28, letterSpacing: 6,
              color: "var(--cyan)", textShadow: "0 0 20px rgba(0,229,255,0.5)"
            }}>AURA</div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, color: "rgba(0,229,255,0.4)",
              borderLeft: "1px solid var(--border)", paddingLeft: 16, lineHeight: 1.5
            }}>
              <div>AUTOMATED URBAN</div>
              <div>RISK ANALYTICS</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["HOME", "TERMINAL", "SYSTEM"].map((item, i) => (
              <a key={item} href={["#hero","#agent","#about"][i]}
                className="nav-link"
                style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: 3, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {item}
              </a>
            ))}
            {/* Status badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 4,
              border: "2px solid rgba(0,229,255,0.2)",
              background: "rgba(0,229,255,0.05)"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#00ff88", letterSpacing: 2 }}>LIVE</span>
            </div>
          </div>
        </nav>

        {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
        <section id="hero" style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", textAlign: "center",
          padding: "100px 40px 60px", position: "relative", zIndex: 10
        }}>
          {/* Orbital rings */}
          <div style={{
            position: "absolute", width: 500, height: 500,
            border: "1px solid rgba(0,229,255,0.08)", borderRadius: "50%",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)"
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--cyan)", boxShadow: "0 0 12px var(--cyan)",
              animation: "orbit 8s linear infinite",
              transformOrigin: "0 0"
            }} />
          </div>
          <div style={{
            position: "absolute", width: 340, height: 340,
            border: "1px solid rgba(255,59,59,0.06)", borderRadius: "50%",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)"
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--red)", boxShadow: "0 0 8px var(--red)",
              animation: "orbitReverse 5s linear infinite",
              transformOrigin: "0 0"
            }} />
          </div>

          {/* Tag */}
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 4,
            color: "rgba(0,229,255,0.6)", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{ width: 40, height: 1, background: "var(--cyan)", opacity: 0.4 }} />
            CLASSIFIED // URBAN INTELLIGENCE PLATFORM
            <div style={{ width: 40, height: 1, background: "var(--cyan)", opacity: 0.4 }} />
          </div>

          {/* Main heading */}
          <h1 className="glitch" data-text="AURA" style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(80px, 18vw, 220px)",
            letterSpacing: 20, lineHeight: 0.9,
            color: "#fff",
            textShadow: "0 0 80px rgba(0,229,255,0.3)",
            marginBottom: 8, userSelect: "none"
          }}>
            AURA
          </h1>

          <div style={{
            fontFamily: "var(--display)", fontSize: "clamp(14px, 3vw, 32px)",
            letterSpacing: 12, color: "rgba(255,255,255,0.25)", marginBottom: 40
          }}>
            AUTOMATED URBAN RISK ANALYTICS
          </div>

          <p style={{
            maxWidth: 560, color: "rgba(255,255,255,0.4)", fontSize: 19,
            lineHeight: 1.8, fontWeight: 300, marginBottom: 56,
            fontFamily: "var(--body)"
          }}>
            Natural language to Databricks SQL. Real-time crime vectors, population density, and risk indexing across urban corridors — all from a single query.
          </p>

          {/* CTA */}
          <a href="#agent" style={{ textDecoration: "none" }}>
            <div style={{
              position: "relative", overflow: "hidden",
              padding: "16px 48px", borderRadius: 4,
              border: "1px solid var(--cyan)",
              background: "rgba(0,229,255,0.05)",
              fontFamily: "var(--mono)", fontSize: 12, letterSpacing: 4,
              color: "var(--cyan)", transition: "all 0.3s ease",
              display: "inline-flex", alignItems: "center", gap: 16
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--cyan)";
                (e.currentTarget as HTMLDivElement).style.color = "#000";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 40px rgba(0,229,255,0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(0,229,255,0.05)";
                (e.currentTarget as HTMLDivElement).style.color = "var(--cyan)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              INITIALIZE TERMINAL
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Stats row */}
          <div style={{
            position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 60, fontFamily: "var(--mono)"
          }}>
            {[
              { val: "847K", label: "RECORDS INDEXED" },
              { val: "18ms", label: "AVG LATENCY" },
              { val: "99.9%", label: "UPTIME" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontFamily: "var(--display)", color: "var(--cyan)", letterSpacing: 4 }}>{s.val}</div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ TERMINAL ═══════════════════════════════ */}
        <section id="agent" style={{
          minHeight: "100vh", padding: "80px 24px",
          display: "flex", flexDirection: "column", alignItems: "center",
          position: "relative", zIndex: 10
        }}>

          {/* Section label */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 4, color: "rgba(0,229,255,0.4)", marginBottom: 12 }}>
              // INTELLIGENCE TERMINAL
            </div>
            <div style={{ fontFamily: "var(--display)", fontSize: "clamp(36px,6vw,72px)", letterSpacing: 8, color: "#fff" }}>
              QUERY <span style={{ color: "var(--cyan)" }}>ENGINE</span>
            </div>
          </div>

          {/* TERMINAL WINDOW */}
          <div className="border-pulse" style={{
            width: "100%", maxWidth: 1080, height: "78vh",
            background: "var(--surface)",
            border: "2px solid rgba(0,229,255,0.2)",
            borderRadius: 8, overflow: "hidden",
            display: "flex", flexDirection: "column",
            position: "relative", boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 1px rgba(0,229,255,0.3)"
          }}>

            {/* Sweep line when loading */}
            {loading && <div className="sweep-line" />}

            {/* Terminal header */}
            <div style={{
              background: "rgba(0,0,0,0.6)", borderBottom: "1px solid rgba(0,229,255,0.1)",
              padding: "12px 20px", display: "flex", alignItems: "center",
              justifyContent: "space-between", flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.9 }} />
                  ))}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
                  aura@urban-ai:~$ risk_query
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--mono)", fontSize: 10 }}>
                <span style={{ color: "rgba(0,229,255,0.4)", letterSpacing: 2 }}>
                  {loading ? (
                    <span style={{ color: "var(--gold)" }}>PROCESSING<span className="cursor-blink">_</span></span>
                  ) : (
                    <span style={{ color: "#00ff88" }}>READY<span className="cursor-blink">_</span></span>
                  )}
                </span>
              </div>
            </div>

            {/* Messages area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Empty state */}
              {messages.length === 0 && (
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  justifyContent: "center", alignItems: "center", gap: 20, opacity: 0.5
                }}>
                  <div style={{
                    width: 80, height: 80, border: "1px solid rgba(0,229,255,0.3)",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative"
                  }}>
                    <div style={{ fontSize: 32 }}>🛡️</div>
                    <div style={{
                      position: "absolute", inset: -8,
                      border: "1px solid rgba(0,229,255,0.15)", borderRadius: "50%"
                    }} />
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 14, letterSpacing: 3, color: "rgba(0,229,255,0.5)", textAlign: "center" }}>
                    AWAITING QUERY INPUT<br />
                    <span style={{ opacity: 0.4, fontSize: 10, letterSpacing: 1, fontFamily: "var(--body)", fontWeight: 300, lineHeight: 2 }}>
                      Ask about crime vectors, risk indices, or safety corridors
                    </span>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                if (msg.role === "user") {
                  return (
                    <div key={i} className="user-msg-in" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        maxWidth: "70%", padding: "12px 20px",
                        background: "rgba(0,229,255,0.08)",
                        border: "1px solid rgba(0,229,255,0.25)",
                        borderRadius: "8px 8px 2px 8px",
                        fontFamily: "var(--body)", fontSize: 20, fontWeight: 500,
                        color: "#e0e8f0", lineHeight: 1.6,
                        boxShadow: "0 0 20px rgba(0,229,255,0.05)"
                      }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 3, color: "rgba(0,229,255,0.4)", marginBottom: 6 }}>
                          QUERY INPUT
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={i} className="msg-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Answer */}
                    {msg.answer && (
                      <div style={{
                        padding: "16px 20px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderLeft: "3px solid var(--cyan)",
                        borderRadius: "0 8px 8px 0",
                        fontSize: 19, lineHeight: 1.8, color: "rgba(255,255,255,0.7)"
                      }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 3, color: "rgba(0,229,255,0.4)", marginBottom: 10 }}>
                          // ANALYST OUTPUT
                        </div>
                        {msg.answer}
                      </div>
                    )}

                    {/* Cards */}
                    {msg.results && msg.results.length > 0 && (
                      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                        {msg.results.map((store: any, j: number) => {
                          const risk = getRiskColor(store.priority_score);
                          const pct = Math.min(100, (store.priority_score / 100) * 100);
                          return (
                            <div key={j} className="card-reveal" style={{
                              animationDelay: `${j * 100}ms`,
                              minWidth: 260, flexShrink: 0,
                              background: "rgba(0,0,0,0.5)",
                              border: `1.5px solid rgba(${store.priority_score >= 50 ? "255,59,59" : store.priority_score >= 20 ? "255,170,0" : "0,229,255"},0.28)`,
                              borderRadius: 8, padding: "20px",
                              position: "relative", overflow: "hidden",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease"
                            }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${risk.glow}20`;
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                              }}
                            >
                              {/* Corner accent */}
                              <div style={{
                                position: "absolute", top: 0, right: 0,
                                width: 0, height: 0,
                                borderStyle: "solid", borderWidth: "0 32px 32px 0",
                                borderColor: `transparent ${risk.color}22 transparent transparent`
                              }} />

                              {/* Risk badge */}
                              <div style={{
                                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 3,
                                color: risk.color, marginBottom: 12,
                                display: "flex", alignItems: "center", gap: 6
                              }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: risk.color, boxShadow: `0 0 6px ${risk.color}` }} />
                                {risk.label}
                              </div>

                              {/* Store name */}
                              <div style={{
                                fontFamily: "var(--display)", fontSize: 22, letterSpacing: 2,
                                color: "#fff", marginBottom: 4, lineHeight: 1.2
                              }}>
                                {store.store_name || `ZIP ${store.zip_code}`}
                              </div>
                              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: 2, marginBottom: 20 }}>
                                {store.city?.trim() || "UNKNOWN"} // {store.zip_code}
                              </div>

                              {/* Stats */}
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                <div>
                                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>CRIMES</div>
                                  <div style={{ fontFamily: "var(--display)", fontSize: 24, color: "#ff3b3b", letterSpacing: 2 }}>{(store.total_crimes || 0).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>POPULATION</div>
                                  <div style={{ fontFamily: "var(--display)", fontSize: 24, color: "#4d9fff", letterSpacing: 2 }}>{(store.population || 0).toLocaleString()}</div>
                                </div>
                              </div>

                              {/* Risk bar */}
                              <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2 }}>
                                  <span style={{ color: "rgba(255,255,255,0.3)" }}>RISK INDEX</span>
                                  <span style={{ color: risk.color, fontSize: 18, fontFamily: "var(--display)", letterSpacing: 3 }}>{store.priority_score}</span>
                                </div>
                                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                                  <div className="fill-bar" style={{
                                    height: "100%", width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
                                    boxShadow: `0 0 8px ${risk.color}`,
                                    borderRadius: 2
                                  }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading state */}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0,1,2].map(i => (
                      <div key={i} className="load-dot" style={{
                        width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)"
                      }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 3, color: "rgba(0,229,255,0.5)" }}>
                    SCANNING RISK VECTORS
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={{
              borderTop: "1px solid rgba(0,229,255,0.1)",
              background: "rgba(0,0,0,0.5)", padding: "16px 20px",
              flexShrink: 0, display: "flex", gap: 12, alignItems: "center"
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--cyan)", flexShrink: 0 }}>›</div>
              <input
                ref={inputRef}
                className="input-glow"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#e0e8f0", fontFamily: "var(--mono)", fontSize: 19, letterSpacing: 1,
                  caretColor: "var(--cyan)", transition: "box-shadow 0.2s"
                }}
                placeholder="enter query: crime vectors, risk indices, safety corridors..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askQuestion()}
              />
              <button
                onClick={askQuestion}
                disabled={loading || !question.trim()}
                style={{
                  padding: "10px 24px", borderRadius: 4,
                  border: "1px solid rgba(0,229,255,0.4)",
                  background: question.trim() && !loading ? "rgba(0,229,255,0.1)" : "transparent",
                  color: question.trim() && !loading ? "var(--cyan)" : "rgba(255,255,255,0.2)",
                  fontFamily: "var(--mono)", fontSize: 13, letterSpacing: 3,
                  transition: "all 0.2s ease", flexShrink: 0,
                  boxShadow: question.trim() && !loading ? "0 0 20px rgba(0,229,255,0.1)" : "none"
                }}
                onMouseEnter={e => { if (!loading && question.trim()) (e.currentTarget.style.background = "var(--cyan)"), (e.currentTarget.style.color = "#000"); }}
                onMouseLeave={e => { (e.currentTarget.style.background = question.trim() && !loading ? "rgba(0,229,255,0.1)" : "transparent"), (e.currentTarget.style.color = question.trim() && !loading ? "var(--cyan)" : "rgba(255,255,255,0.2)"); }}
              >
                EXECUTE
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ SYSTEM ═══════════════════════════════ */}
        <section id="about" style={{
          minHeight: "100vh", padding: "100px 40px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", zIndex: 10
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 4, color: "rgba(0,229,255,0.4)", marginBottom: 16 }}>
            // SYSTEM ARCHITECTURE
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: "clamp(36px,6vw,72px)", letterSpacing: 8, color: "#fff", marginBottom: 80, textAlign: "center" }}>
            INTELLIGENCE <span style={{ color: "var(--cyan)" }}>STACK</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2, maxWidth: 960, width: "100%" }}>
            {[
              { icon: "🤖", num: "01", title: "NATURAL AI", color: "var(--cyan)", desc: "GPT-4o-mini at Temperature 0 converts plain English to precision Databricks SQL with hardcoded demo failsafes for guaranteed stability." },
              { icon: "🌩️", num: "02", title: "LAKEHOUSE", color: "var(--gold)", desc: "Direct Databricks cluster integration over the @databricks/sql connector. Queries execute against 847K+ indexed urban records in real time." },
              { icon: "📊", num: "03", title: "RISK INDEX", color: "var(--red)", desc: "Raw crime and population data is normalized to a 0–100 Risk Index. Higher score = more vulnerable. Lower = safer corridors for planning." },
            ].map((card, i) => (
              <div key={i} style={{
                padding: "40px 32px",
                background: "var(--surface)",
                border: "1px solid rgba(255,255,255,0.05)",
                position: "relative", overflow: "hidden",
                transition: "border-color 0.3s"
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${card.color}44`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
              >
                <div style={{ fontFamily: "var(--display)", fontSize: 80, color: card.color, opacity: 0.06, position: "absolute", top: -10, right: 16, lineHeight: 1, letterSpacing: 0 }}>
                  {card.num}
                </div>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{card.icon}</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 22, letterSpacing: 4, color: "#fff", marginBottom: 16 }}>{card.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>{card.desc}</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${card.color}44, transparent)` }} />
              </div>
            ))}
          </div>

          {/* Bottom signature */}
          <div style={{
            marginTop: 100, textAlign: "center",
            fontFamily: "var(--mono)", fontSize: 10,
            color: "rgba(255,255,255,0.1)", letterSpacing: 3, lineHeight: 2.5
          }}>
            <div style={{ fontFamily: "var(--display)", fontSize: 32, letterSpacing: 12, color: "rgba(0,229,255,0.1)", marginBottom: 12 }}>AURA</div>
            AUTOMATED URBAN RISK ANALYTICS // V1.04<br />
            POWERED BY DATABRICKS + OPENAI // NEXT.JS 16
          </div>
        </section>
      </div>
    </>
  );
}   