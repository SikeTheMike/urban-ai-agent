"use client";

import { useState, useRef, useEffect } from "react";

// Phoenix area ZIP centroid coordinates
const ZIP_COORDS: Record<string, [number, number]> = {
  "85001": [33.4484, -112.0740], "85002": [33.4484, -112.0740],
  "85003": [33.4484, -112.0740], "85004": [33.4500, -112.0660],
  "85005": [33.4350, -112.1200], "85006": [33.4600, -112.0500],
  "85007": [33.4350, -112.0900], "85008": [33.4600, -112.0100],
  "85009": [33.4450, -112.1300], "85010": [33.4350, -112.0000],
  "85011": [33.5000, -112.0700], "85012": [33.5100, -112.0700],
  "85013": [33.5200, -112.0800], "85014": [33.5300, -112.0600],
  "85015": [33.5100, -112.1000], "85016": [33.5000, -112.0300],
  "85017": [33.5000, -112.1200], "85018": [33.4900, -111.9900],
  "85019": [33.5100, -112.1500], "85020": [33.5600, -112.0600],
  "85021": [33.5500, -112.0900], "85022": [33.6000, -112.0400],
  "85023": [33.6200, -112.1000], "85024": [33.6600, -112.0200],
  "85025": [33.5000, -112.0700], "85026": [33.4484, -112.0740],
  "85027": [33.6400, -112.1100], "85028": [33.5600, -111.9900],
  "85029": [33.5900, -112.1200], "85030": [33.4484, -112.0740],
  "85031": [33.4900, -112.1600], "85032": [33.5600, -111.9500],
  "85033": [33.4900, -112.1900], "85034": [33.4200, -112.0300],
  "85035": [33.4700, -112.1900], "85036": [33.4100, -112.0600],
  "85037": [33.4700, -112.2300], "85038": [33.4484, -112.0740],
  "85039": [33.4484, -112.0740], "85040": [33.3900, -112.0100],
  "85041": [33.3700, -112.0700], "85042": [33.3700, -112.0200],
  "85043": [33.3900, -112.1500], "85044": [33.3500, -111.9800],
  "85045": [33.3300, -111.9700], "85048": [33.3100, -111.9800],
  "85050": [33.6300, -111.9700], "85051": [33.5400, -112.1300],
  "85053": [33.6000, -112.1300], "85054": [33.6700, -111.9400],
  "85083": [33.7000, -112.1400], "85085": [33.7200, -112.1000],
  "85086": [33.7500, -112.0700], "85201": [33.4200, -111.8400],
  "85202": [33.3900, -111.8500], "85203": [33.4300, -111.8000],
  "85204": [33.4100, -111.7700], "85205": [33.4300, -111.7400],
  "85206": [33.4000, -111.7300], "85207": [33.4300, -111.6900],
  "85208": [33.4000, -111.6700], "85209": [33.3800, -111.6500],
  "85210": [33.3900, -111.8400], "85212": [33.3500, -111.6200],
  "85213": [33.4500, -111.7600], "85215": [33.4700, -111.7300],
  "85224": [33.3000, -111.8900], "85225": [33.3200, -111.8400],
  "85226": [33.3200, -111.9300], "85233": [33.3300, -111.8400],
  "85234": [33.3500, -111.8000], "85248": [33.2600, -111.8500],
  "85249": [33.2700, -111.8000], "85250": [33.5100, -111.9200],
  "85251": [33.4900, -111.9300], "85252": [33.4800, -111.9200],
  "85253": [33.5300, -111.9400], "85254": [33.5700, -111.9600],
  "85255": [33.6400, -111.9000], "85256": [33.4700, -111.8700],
  "85257": [33.4700, -111.9100], "85258": [33.5400, -111.8900],
  "85259": [33.5700, -111.8600], "85260": [33.6000, -111.9000],
  "85262": [33.6700, -111.8500], "85263": [33.7200, -111.6500],
  "85266": [33.7000, -111.9300], "85268": [33.5900, -111.8200],
  "85281": [33.4200, -111.9300], "85282": [33.4000, -111.9300],
  "85283": [33.3800, -111.9300], "85284": [33.3500, -111.9300],
  "85285": [33.3800, -111.9300], "85286": [33.3000, -111.9200],
  "85295": [33.3200, -111.7600], "85296": [33.3500, -111.7600],
  "85297": [33.3000, -111.7600], "85298": [33.2700, -111.7600],
  "85301": [33.5300, -112.1800], "85302": [33.5400, -112.1600],
  "85303": [33.5200, -112.1900], "85304": [33.5600, -112.1600],
  "85305": [33.5100, -112.2200], "85306": [33.5800, -112.1400],
  "85307": [33.5000, -112.2600], "85308": [33.6000, -112.1500],
  "85309": [33.4900, -112.2800], "85310": [33.6200, -112.1700],
  "85323": [33.4000, -112.2800], "85326": [33.3400, -112.3800],
  "85338": [33.3700, -112.3000], "85339": [33.3200, -112.1800],
  "85340": [33.5000, -112.3500], "85345": [33.5200, -112.2400],
  "85351": [33.5000, -112.2900], "85353": [33.4400, -112.2800],
  "85354": [33.4200, -112.5000], "85355": [33.5200, -112.4200],
  "85363": [33.5400, -112.3000], "85373": [33.6500, -112.2300],
  "85374": [33.6300, -112.2800], "85375": [33.6600, -112.2600],
  "85376": [33.6400, -112.3000], "85379": [33.6000, -112.3500],
  "85381": [33.5800, -112.2200], "85382": [33.6000, -112.2000],
  "85383": [33.6800, -112.2600], "85385": [33.6200, -112.2200],
  "85387": [33.7200, -112.3000], "85388": [33.6100, -112.3200],
  "85390": [33.6100, -112.5000],
};

function getZipCoords(zip: string): [number, number] | null {
  return ZIP_COORDS[zip] || null;
}

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"boot" | "disclaimer" | "exit" | "app">("boot");
  const [bootLine, setBootLine] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [disclaimerIn, setDisclaimerIn] = useState(false);
  const [disclaimerExit, setDisclaimerExit] = useState(false);
  const [acceptPulse, setAcceptPulse] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [radarActive, setRadarActive] = useState(false);
  const [ambientRisk, setAmbientRisk] = useState<"neutral" | "critical" | "elevated" | "nominal">("neutral");
  const [mapResults, setMapResults] = useState<any[]>([]);
  const [mapVisible, setMapVisible] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  const [toastPhase, setToastPhase] = useState<"hidden" | "crack" | "open" | "closing">("hidden");
  const hasToasted = useRef(false);
  const [queryCount, setQueryCount] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const placeholderIdx = useRef(0);
  const charIdx = useRef(0);

  const BOOT_LINES = [
    { t: "▸ AURA URBAN RISK ANALYTICS v0.1-beta", c: "lc" },
    { t: "▸ Establishing satellite uplink...", c: "dim" },
    { t: "▸ Connecting to Databricks cluster...", c: "dim" },
    { t: "▸ Loading 847,214 indexed records...", c: "dim" },
    { t: "▸ Calibrating GPT-4o risk models...", c: "dim" },
    { t: "▸ SELECT-only guardrails enforced ✓", c: "ok" },
    { t: "▸ Encryption layer active ✓", c: "ok" },
    { t: "▸ System ready. Welcome.", c: "lc" },
  ];

  const PLACEHOLDERS = [
    "Which grocery stores are in the most dangerous ZIP codes?",
    "Show me the safest neighborhoods in Phoenix...",
    "Where should I avoid building a new store?",
    "Compare crime rates between ZIP 85031 and 85034...",
    "Which corridors need safety infrastructure?",
  ];

  const WARNINGS = [
    { icon: "⚠", text: "Queries may misfire or return unexpected results" },
    { icon: "⏱", text: "First query may be slow — cluster spinning up" },
    { icon: "🔬", text: "Experimental AI — not for policy or law enforcement" },
    { icon: "🔄", text: "Data is indexed, not a live feed" },
    { icon: "💥", text: "Expect bugs. We're fixing them in real time." },
  ];

  const EXAMPLES = [
    "Which grocery stores are in the most dangerous ZIP codes?",
    "Show the top 5 highest risk locations in Phoenix",
    "Which areas have the lowest crime for safe transit?",
    "Find stores with high population but low crime scores",
    "Compare crime density across different ZIP codes",
    "Which corridors need immediate safety infrastructure?",
  ];

  // Typing placeholder
  useEffect(() => {
    if (phase !== "app") return;
    const interval = setInterval(() => {
      const target = PLACEHOLDERS[placeholderIdx.current];
      if (charIdx.current <= target.length) {
        setTypedPlaceholder(target.slice(0, charIdx.current));
        charIdx.current++;
      } else {
        setTimeout(() => {
          charIdx.current = 0;
          placeholderIdx.current = (placeholderIdx.current + 1) % PLACEHOLDERS.length;
        }, 2200);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [phase]);

  // Glitch on interval
  useEffect(() => {
    if (phase !== "app") return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 180);
    }, 8000);
    return () => clearInterval(interval);
  }, [phase]);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setBootLine(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(() => {
          setPhase("disclaimer");
          setTimeout(() => setDisclaimerIn(true), 80);
        }, 700);
      }
    }, 210);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (phase === "disclaimer" && disclaimerIn) {
      const t = setTimeout(() => setAcceptPulse(true), 2000);
      return () => clearTimeout(t);
    }
  }, [phase, disclaimerIn]);

  // Scroll tracker
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Init Leaflet map
  useEffect(() => {
    if (phase !== "app" || !mapVisible || !mapRef.current || leafletMap.current) return;

    const initMap = async () => {
      // Load Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      const L = (window as any).L;
      if (!mapRef.current || leafletMap.current) return;

      const map = L.map(mapRef.current, {
        center: [33.4484, -112.0740],
        zoom: 10,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark satellite tile layer using CartoDB dark matter
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      markersLayer.current = L.layerGroup().addTo(map);
      leafletMap.current = map;

      // Add any existing results
      if (mapResults.length > 0) {
        updateMapMarkers(map, L, mapResults);
      }
    };

    initMap();
  }, [phase, mapVisible]);

  // Update markers when results change
  useEffect(() => {
    if (!leafletMap.current || !(window as any).L) return;
    updateMapMarkers(leafletMap.current, (window as any).L, mapResults);
  }, [mapResults]);

  function updateMapMarkers(map: any, L: any, results: any[]) {
    if (!markersLayer.current) return;
    markersLayer.current.clearLayers();

    const validPoints: any[] = [];

    results.forEach((item) => {
      const zip = String(item.zip_code || "").trim();
      const coords = getZipCoords(zip);
      if (!coords) return;

      const r = riskOf(item.priority_score);
      const color = r.c;
      const label = item.store_name || `ZIP ${zip}`;

      // Custom SVG marker
      const svgIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:32px;height:32px;">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background:${color}22;border:2px solid ${color};
              animation:ping 1.5s ease-out infinite;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
              width:12px;height:12px;border-radius:50%;
              background:${color};
              box-shadow:0 0 10px ${color},0 0 20px ${color}55;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(coords, { icon: svgIcon });
      const score = item.priority_score ?? "N/A";
      const crimes = (item.total_crimes ?? 0).toLocaleString();
      const pop = (item.population ?? 0).toLocaleString();

      marker.bindPopup(`
        <div style="
          background:#0d1020;border:1px solid ${color}44;
          border-radius:10px;padding:12px 14px;
          font-family:'JetBrains Mono',monospace;color:#fff;
          min-width:180px;
        ">
          <div style="font-size:8px;letter-spacing:2px;color:${color};margin-bottom:6px;">● ${r.l}</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:2px;font-family:Inter,sans-serif;">${label}</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:10px;">ZIP ${zip}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div><div style="font-size:8px;color:rgba(255,255,255,0.3);margin-bottom:2px;">CRIMES</div><div style="color:#ff453a;font-weight:700;">${crimes}</div></div>
            <div><div style="font-size:8px;color:rgba(255,255,255,0.3);margin-bottom:2px;">RISK</div><div style="color:${color};font-weight:700;">${score}</div></div>
          </div>
        </div>
      `, { className: "aura-popup" });

      markersLayer.current.addLayer(marker);
      validPoints.push(coords);
    });

    // Fit map to markers
    if (validPoints.length > 0) {
      try {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      } catch (e) {}
    }
  }

  function handleAccept() {
    setDisclaimerExit(true);
    setTimeout(() => {
      setPhase("exit");
      setTimeout(() => setPhase("app"), 900);
    }, 700);
  }

  const riskOf = (s: number) =>
    s >= 50 ? { c: "#ff453a", bg: "rgba(255,69,58,0.07)", l: "CRITICAL" }
      : s >= 20 ? { c: "#ff9f0a", bg: "rgba(255,159,10,0.07)", l: "ELEVATED" }
        : { c: "#30d158", bg: "rgba(48,209,88,0.07)", l: "NOMINAL" };

  const reveal = (triggerY: number, range = 120) => {
    const p = Math.min(1, Math.max(0, (scrollY - triggerY) / range));
    return { opacity: p, transform: `translateY(${(1 - p) * 30}px)` };
  };

  async function fire() {
    if (!question.trim() || loading) return;
    const q = question.trim();

    if (!hasToasted.current) {
      hasToasted.current = true;
      setToastPhase("crack");
      setTimeout(() => setToastPhase("open"), 600);
      setTimeout(() => setToastPhase("closing"), 9500);
      setTimeout(() => setToastPhase("hidden"), 11200);
    }

    // Trigger radar
    setRadarActive(true);
    setTimeout(() => setRadarActive(false), 3200);

    setQueryCount(c => c + 1);
    setMessages(p => [...p, { role: "user", content: q }]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", results: data.results, answer: data.answer }]);

      // Update ambient risk based on results
      if (data.results?.length > 0) {
        const avgScore = data.results.reduce((a: number, r: any) => a + (r.priority_score || 0), 0) / data.results.length;
        setAmbientRisk(avgScore >= 50 ? "critical" : avgScore >= 20 ? "elevated" : "nominal");

        // Update map
        const withCoords = data.results.filter((r: any) => getZipCoords(String(r.zip_code || "").trim()));
        if (withCoords.length > 0) {
          setMapResults(data.results);
          setMapVisible(true);
          setTimeout(() => {
            document.getElementById("aura-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 600);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const ambientColors: Record<string, string> = {
    neutral: "rgba(99,102,241,0.06)",
    critical: "rgba(255,69,58,0.08)",
    elevated: "rgba(255,159,10,0.06)",
    nominal: "rgba(48,209,88,0.05)",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:#06070f; --bg2:#09091a; --bg3:#0d1020; --bg4:#111428; --bg5:#0a0c1e;
          --p:#7c3aed; --p2:#8b5cf6; --p3:#a78bfa; --p4:#c4b5fd; --ind:#4f46e5;
          --glow:rgba(124,58,237,0.45); --glow2:rgba(124,58,237,0.18); --glow3:rgba(99,102,241,0.12);
          --warn:#ff9f0a;
          --w:#ffffff; --w80:rgba(255,255,255,0.8); --w55:rgba(255,255,255,0.55);
          --w30:rgba(255,255,255,0.3); --w10:rgba(255,255,255,0.1); --w05:rgba(255,255,255,0.05);
          --b:rgba(255,255,255,0.08); --b2:rgba(255,255,255,0.13);
          --mono:'JetBrains Mono',monospace; --sans:'Inter',sans-serif;
        }

        html,body,#__next,[data-nextjs-scroll-focus-boundary] { background:var(--bg)!important; color-scheme:dark!important; scroll-behavior:smooth; }
        body { overflow-x:hidden; font-family:var(--sans); color:var(--w); background:var(--bg)!important; }
        *,*::before,*::after { color-scheme:dark!important; }
        @media (prefers-color-scheme:light) { html { background:var(--bg)!important; color:var(--w)!important; } }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(124,58,237,0.35); border-radius:4px; }

        /* ── AMBIENT BG TRANSITION ── */
        .ambient-bg { transition: background 2s ease; }

        /* ── BOOT ── */
        @keyframes bIn  { from{opacity:0} to{opacity:1} }
        @keyframes bOut { 0%{opacity:1;transform:scale(1);filter:blur(0)} 100%{opacity:0;transform:scale(1.04);filter:blur(10px)} }
        .boot-in  { animation:bIn  0.35s ease forwards; }
        .boot-out { animation:bOut 0.75s cubic-bezier(0.4,0,1,1) forwards; }
        @keyframes lineIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
        .bl { animation:lineIn 0.18s ease forwards; }

        /* ── DISCLAIMER ── */
        @keyframes disclaimerIn  { 0%{opacity:0;transform:translateY(40px) scale(0.95);filter:blur(8px)} 100%{opacity:1;transform:none;filter:blur(0)} }
        @keyframes disclaimerOut { 0%{opacity:1;transform:scale(1);filter:blur(0)} 100%{opacity:0;transform:scale(1.06) translateY(-20px);filter:blur(12px)} }
        .disclaimer-in  { animation:disclaimerIn  0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .disclaimer-out { animation:disclaimerOut 0.65s cubic-bezier(0.4,0,1,1) forwards; }
        @keyframes warnItemIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
        .warn-item { animation:warnItemIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes scanLine { 0%{top:-2px;opacity:0.7} 100%{top:100%;opacity:0} }
        .scan { position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.6),transparent);animation:scanLine 2.5s linear infinite;pointer-events:none; }
        @keyframes btnPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,159,10,0.5),0 0 30px rgba(255,159,10,0.2)} 50%{box-shadow:0 0 0 8px rgba(255,159,10,0),0 0 50px rgba(255,159,10,0.4)} }
        .btn-pulse { animation:btnPulse 1.8s ease-in-out infinite; }
        @keyframes cautionStripes { 0%{background-position:0 0} 100%{background-position:40px 0} }
        .caution-bar {
          background:repeating-linear-gradient(-45deg,rgba(255,159,10,0.15) 0px,rgba(255,159,10,0.15) 10px,rgba(255,159,10,0.04) 10px,rgba(255,159,10,0.04) 20px);
          animation:cautionStripes 1.2s linear infinite; background-size:40px 40px;
        }

        /* ── APP ── */
        @keyframes appIn { from{opacity:0;filter:blur(6px);transform:translateY(20px)} to{opacity:1;filter:blur(0);transform:none} }
        .app-in { animation:appIn 1s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ── HERO STAGGER ── */
        @keyframes heroUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
        .h1{animation:heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both}
        .h2{animation:heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.22s both}
        .h3{animation:heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.36s both}
        .h4{animation:heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both}
        .h5{animation:heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.66s both}

        /* ── RADAR ── */
        @keyframes radarSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes radarPing  { 0%{transform:scale(0.3);opacity:0.9} 100%{transform:scale(1);opacity:0} }
        @keyframes radarFadeIn  { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes radarFadeOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(1.1)} }
        .radar-in  { animation:radarFadeIn  0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .radar-out { animation:radarFadeOut 0.6s ease forwards; }
        .radar-ping { animation:radarPing 1.4s ease-out; }
        .radar-ping-2 { animation:radarPing 1.4s ease-out 0.35s; }
        .radar-ping-3 { animation:radarPing 1.4s ease-out 0.7s; }

        /* ── GLITCH ── */
        @keyframes glitchA { 0%,100%{clip-path:none;transform:none} 20%{clip-path:inset(10% 0 85% 0);transform:translate(-3px,0)} 40%{clip-path:inset(45% 0 40% 0);transform:translate(3px,0)} 60%{clip-path:inset(80% 0 5% 0);transform:translate(-2px,0)} 80%{clip-path:none;transform:none} }
        @keyframes glitchB { 0%,100%{clip-path:none;transform:none;opacity:0} 20%{clip-path:inset(60% 0 10% 0);transform:translate(4px,0);opacity:0.7} 40%{clip-path:inset(20% 0 65% 0);transform:translate(-4px,0);opacity:0.5} 80%{opacity:0} }
        .glitch-wrap { position:relative;display:inline-block; }
        .glitch-wrap::before,.glitch-wrap::after { content:attr(data-text);position:absolute;inset:0;font-weight:inherit;font-size:inherit;letter-spacing:inherit;line-height:inherit;pointer-events:none; }
        .glitch-wrap::before { color:#ff453a;mix-blend-mode:screen; }
        .glitch-wrap::after  { color:#60a5fa;mix-blend-mode:screen; }
        .glitch-active::before { animation:glitchA 0.18s steps(1) forwards; }
        .glitch-active::after  { animation:glitchB 0.18s steps(1) forwards; }

        /* ── ORB ── */
        @keyframes orbFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-18px) rotate(1deg)} 75%{transform:translateY(-8px) rotate(-0.5deg)} }
        .orb { animation:orbFloat 7s ease-in-out infinite; will-change:transform; }
        @keyframes rA { from{transform:rotateZ(0deg) rotateX(68deg)} to{transform:rotateZ(360deg) rotateX(68deg)} }
        @keyframes rB { from{transform:rotateZ(0deg) rotateY(70deg)} to{transform:rotateZ(-360deg) rotateY(70deg)} }
        @keyframes rC { from{transform:rotateZ(0deg) rotateX(50deg) rotateY(25deg)} to{transform:rotateZ(360deg) rotateX(50deg) rotateY(25deg)} }
        .rA{animation:rA 9s linear infinite;will-change:transform}
        .rB{animation:rB 12s linear infinite;will-change:transform}
        .rC{animation:rC 16s linear infinite;will-change:transform}
        @keyframes glowBreath { 0%,100%{opacity:0.65} 50%{opacity:1} }
        .glow-breath { animation:glowBreath 4s ease-in-out infinite; }

        /* ── CARD EXPLODE IN ── */
        @keyframes cardExplode0  { from{opacity:0;transform:translate(-60px,-40px) scale(0.7) rotate(-8deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode1  { from{opacity:0;transform:translate(0px,-80px) scale(0.7) rotate(3deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode2  { from{opacity:0;transform:translate(60px,-40px) scale(0.7) rotate(8deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode3  { from{opacity:0;transform:translate(-50px,40px) scale(0.75) rotate(-5deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode4  { from{opacity:0;transform:translate(50px,40px) scale(0.75) rotate(5deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode5  { from{opacity:0;transform:translate(-80px,0px) scale(0.8) rotate(-4deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode6  { from{opacity:0;transform:translate(80px,0px) scale(0.8) rotate(4deg)} to{opacity:1;transform:none} }
        @keyframes cardExplode7  { from{opacity:0;transform:translate(0px,80px) scale(0.75) rotate(-3deg)} to{opacity:1;transform:none} }
        .ce0{animation:cardExplode0 0.65s cubic-bezier(0.16,1,0.3,1) both}
        .ce1{animation:cardExplode1 0.65s cubic-bezier(0.16,1,0.3,1) 0.05s both}
        .ce2{animation:cardExplode2 0.65s cubic-bezier(0.16,1,0.3,1) 0.1s both}
        .ce3{animation:cardExplode3 0.65s cubic-bezier(0.16,1,0.3,1) 0.15s both}
        .ce4{animation:cardExplode4 0.65s cubic-bezier(0.16,1,0.3,1) 0.2s both}
        .ce5{animation:cardExplode5 0.65s cubic-bezier(0.16,1,0.3,1) 0.25s both}
        .ce6{animation:cardExplode6 0.65s cubic-bezier(0.16,1,0.3,1) 0.3s both}
        .ce7{animation:cardExplode7 0.65s cubic-bezier(0.16,1,0.3,1) 0.35s both}

        /* ── MAP ── */
        @keyframes mapReveal { from{opacity:0;transform:translateY(30px) scale(0.98)} to{opacity:1;transform:none} }
        .map-reveal { animation:mapReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        .leaflet-container { background:#06070f!important; }
        .leaflet-popup-content-wrapper { background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important; }
        .leaflet-popup-tip { display:none!important; }
        .leaflet-popup-content { margin:0!important; }
        @keyframes ping { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.5);opacity:0} }

        /* ── MSG ── */
        @keyframes ml { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
        @keyframes mr { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:none} }
        .ml{animation:ml 0.25s ease both} .mr{animation:mr 0.25s ease both}

        /* ── BAR FILL ── */
        @keyframes fb { from{width:0%} }
        .fb { animation:fb 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ── DOTS ── */
        @keyframes dot { 0%,80%,100%{opacity:0.15;transform:scale(0.55)} 40%{opacity:1;transform:scale(1)} }
        .d1{animation:dot 1.1s ease infinite 0s} .d2{animation:dot 1.1s ease infinite 0.18s} .d3{animation:dot 1.1s ease infinite 0.36s}

        /* ── BLINK ── */
        @keyframes bk { 0%,100%{opacity:1} 50%{opacity:0} }
        .bk { animation:bk 1s step-end infinite; }

        /* ── SWEEP ── */
        @keyframes sw { 0%{transform:translateX(-100%)} 100%{transform:translateX(100vw)} }
        .sw { position:absolute;top:0;bottom:0;width:80px;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.1),transparent);animation:sw 1.6s ease-in-out infinite;pointer-events:none;will-change:transform; }

        /* ── TWINKLE ── */
        @keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:0.8} }

        /* ── TICKER ── */
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-inner { display:flex;animation:ticker 28s linear infinite;white-space:nowrap; }
        .ticker-inner:hover { animation-play-state:paused; }

        /* ── GRID ── */
        .grid-overlay {
          background-image:linear-gradient(rgba(99,102,241,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.035) 1px,transparent 1px);
          background-size:72px 72px;
        }

        /* ── COUNT UP ── */
        @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .count-up { animation:countUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        /* ── HOVER ── */
        .nav-a{transition:color 0.15s} .nav-a:hover{color:var(--w)!important}
        .pill{transition:all 0.2s ease;cursor:pointer} .pill:hover{filter:brightness(1.18);transform:translateY(-2px)} .pill:active{transform:translateY(0)}
        .ghost{transition:all 0.2s ease;cursor:pointer} .ghost:hover{background:rgba(255,255,255,0.1)!important;border-color:rgba(255,255,255,0.4)!important;transform:translateY(-2px)}
        .ex-row{transition:all 0.18s ease;cursor:pointer} .ex-row:hover{background:rgba(124,58,237,0.1)!important;border-color:rgba(124,58,237,0.4)!important;transform:translateX(4px)}
        .feat{transition:all 0.22s ease} .feat:hover{border-color:rgba(124,58,237,0.3)!important;transform:translateY(-5px)}
        .rcard{transition:transform 0.2s ease;will-change:transform} .rcard:hover{transform:translateY(-4px)}
        .fbtn{transition:all 0.18s ease;cursor:pointer} .fbtn:hover:not(:disabled){filter:brightness(1.2);transform:translateY(-1px)}
        .inp:focus{outline:none;border-color:rgba(124,58,237,0.5)!important;box-shadow:0 0 0 3px rgba(124,58,237,0.1)}
        .inp::placeholder{color:var(--w30)}

        @keyframes betaBorder { 0%,100%{border-color:rgba(255,69,58,0.15)} 50%{border-color:rgba(255,69,58,0.45)} }
        .betab { animation:betaBorder 2.5s ease infinite; }
        @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .bfloat { animation:badgeFloat 3.5s ease-in-out infinite; }

        input,button,select,textarea { color-scheme:dark;background-color:transparent; }
        a { color:inherit; }

        /* ── TOAST ── */
        @keyframes capsuleAppear { 0%{opacity:0;transform:translateY(20px) scale(0.82)} 55%{opacity:1;transform:translateY(-4px) scale(1.03)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes capsuleCrack  { 0%{transform:scale(1) rotate(0deg)} 20%{transform:scale(1.18) rotate(-5deg)} 45%{transform:scale(1.12) rotate(4deg)} 70%{transform:scale(1.06) rotate(-2deg)} 100%{transform:scale(1) rotate(0deg)} }
        @keyframes msgUnroll  { 0%{opacity:0;max-height:0;transform:translateY(-10px)} 40%{opacity:0.6} 100%{opacity:1;max-height:160px;transform:translateY(0)} }
        @keyframes msgRollUp  { 0%{opacity:1;max-height:160px;transform:translateY(0) scale(1);filter:blur(0px)} 100%{opacity:0;max-height:0;transform:translateY(-12px) scale(0.95);filter:blur(3px)} }
        @keyframes toastExit  { 0%{opacity:1;transform:translateY(0) scale(1)} 50%{opacity:0.5;transform:translateY(6px) scale(0.96)} 100%{opacity:0;transform:translateY(16px) scale(0.88);filter:blur(6px)} }
        @keyframes iconPop    { 0%{transform:scale(0.4) rotate(-25deg);opacity:0} 55%{transform:scale(1.22) rotate(6deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes crackLine  { 0%{width:0;opacity:0} 30%{opacity:1} 100%{width:100%;opacity:0} }
        @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .toast-appear { animation:capsuleAppear 0.75s cubic-bezier(0.16,1,0.3,1) forwards; }
        .toast-exit   { animation:toastExit 1.6s cubic-bezier(0.4,0,0.6,1) forwards; }
        .icon-pop     { animation:iconPop 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .icon-crack   { animation:capsuleCrack 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .msg-unroll   { animation:msgUnroll 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both;overflow:hidden; }
        .msg-rollup   { animation:msgRollUp 0.9s cubic-bezier(0.4,0,0.6,1) forwards;overflow:hidden; }

        .grad { background:linear-gradient(135deg,var(--p2),var(--p3),var(--p4));-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
      `}</style>

      {/* ══ BOOT ══ */}
      {phase === "boot" && (
        <div className="boot-in" style={{ position:"fixed",inset:0,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:400,background:"radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%)",pointerEvents:"none" }}/>
          <div style={{ width:"min(580px,90vw)",background:"rgba(10,12,24,0.97)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:18,overflow:"hidden",boxShadow:"0 0 80px rgba(124,58,237,0.12),0 40px 100px rgba(0,0,0,0.85)" }}>
            <div style={{ padding:"13px 20px",background:"rgba(255,255,255,0.025)",borderBottom:"1px solid rgba(124,58,237,0.12)",display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ display:"flex",gap:7 }}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c,opacity:0.85}}/>)}</div>
              <span style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--w30)",letterSpacing:1 }}>aura — system init</span>
              <div style={{ marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#30d158",boxShadow:"0 0 6px #30d158" }}/>
            </div>
            <div style={{ padding:"22px 24px",minHeight:230 }}>
              {BOOT_LINES.slice(0,bootLine).map((line,i)=>(
                <div key={i} className="bl" style={{ fontFamily:"var(--mono)",fontSize:12,lineHeight:1.9,letterSpacing:0.3,color:line.c==="ok"?"#30d158":line.c==="lc"?"var(--p3)":"var(--w55)",display:"flex",alignItems:"center",gap:8 }}>
                  {line.t}{i===bootLine-1&&<span className="bk" style={{color:"var(--p2)"}}>█</span>}
                </div>
              ))}
            </div>
            <div style={{ padding:"0 24px 20px" }}>
              <div style={{ height:2,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${(bootLine/BOOT_LINES.length)*100}%`,background:"linear-gradient(90deg,var(--ind),var(--p),var(--p3))",borderRadius:2,transition:"width 0.2s ease",boxShadow:"0 0 8px var(--glow)" }}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DISCLAIMER ══ */}
      {phase === "disclaimer" && (
        <div style={{ position:"fixed",inset:0,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,overflow:"hidden",padding:"20px" }}>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(255,69,58,0.04) 0%,transparent 65%)",pointerEvents:"none" }}/>
          <div className="grid-overlay" style={{ position:"absolute",inset:0,pointerEvents:"none" }}/>
          <div className={disclaimerExit?"disclaimer-out":disclaimerIn?"disclaimer-in":""} style={{ width:"min(640px,95vw)",background:"rgba(8,9,22,0.98)",borderRadius:20,overflow:"hidden",boxShadow:"0 0 100px rgba(255,69,58,0.08),0 60px 120px rgba(0,0,0,0.9)",position:"relative" }}>
            <div className="scan"/>
            <div className="caution-bar" style={{ padding:"10px 24px",borderBottom:"1px solid rgba(255,159,10,0.25)",display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ display:"flex",gap:7 }}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,opacity:0.85}}/>)}</div>
              <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,159,10,0.8)",letterSpacing:2 }}>⚠ BETA ACCESS — READ BEFORE CONTINUING</span>
              <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:5 }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:"#ff9f0a",boxShadow:"0 0 6px #ff9f0a" }}/>
                <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"#ff9f0a",letterSpacing:2 }}>BETA v0.1</span>
              </div>
            </div>
            <div style={{ padding:"32px 32px 28px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:18,marginBottom:24 }}>
                <div style={{ width:56,height:56,borderRadius:16,flexShrink:0,background:"rgba(255,159,10,0.08)",border:"1.5px solid rgba(255,159,10,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 0 24px rgba(255,159,10,0.12)" }}>⚠</div>
                <div>
                  <div style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:4,color:"rgba(255,159,10,0.6)",marginBottom:5 }}>BETA ACCESS PROGRAM</div>
                  <div style={{ fontWeight:800,fontSize:22,letterSpacing:-0.5,color:"var(--w)",lineHeight:1.1 }}>Before You Enter AURA</div>
                </div>
              </div>
              <p style={{ fontSize:14,lineHeight:1.8,color:"var(--w55)",marginBottom:24,paddingBottom:24,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                AURA is an experimental AI-powered urban risk intelligence platform under active development, provided as-is for research and exploration only. By continuing, you acknowledge the following:
              </p>
              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:28 }}>
                {WARNINGS.map((w,i)=>(
                  <div key={i} className="warn-item" style={{ animationDelay:`${i*90+300}ms` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10 }}>
                      <span style={{ fontSize:14,flexShrink:0 }}>{w.icon}</span>
                      <span style={{ fontSize:13,color:"var(--w55)",lineHeight:1.5 }}>{w.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 16px",background:"rgba(255,69,58,0.04)",border:"1px solid rgba(255,69,58,0.12)",borderRadius:10,marginBottom:28 }}>
                <p style={{ fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,0.3)",lineHeight:1.9,letterSpacing:0.2 }}>NOT FOR USE IN: law enforcement · policy decisions · operational planning · public safety determinations. Data is indexed and may be incomplete or outdated.</p>
              </div>
              <button onClick={handleAccept} className={acceptPulse?"btn-pulse":""} style={{ width:"100%",padding:"16px 24px",borderRadius:14,background:"linear-gradient(135deg,rgba(255,159,10,0.15),rgba(255,159,10,0.08))",border:"1.5px solid rgba(255,159,10,0.4)",color:"#ff9f0a",fontSize:15,fontWeight:700,fontFamily:"var(--sans)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,letterSpacing:-0.2,transition:"all 0.2s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,159,10,0.2)";e.currentTarget.style.borderColor="rgba(255,159,10,0.7)";e.currentTarget.style.transform="translateY(-1px)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(255,159,10,0.15),rgba(255,159,10,0.08))";e.currentTarget.style.borderColor="rgba(255,159,10,0.4)";e.currentTarget.style.transform="none"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                I understand — enter AURA Beta
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <div style={{ textAlign:"center",marginTop:14,fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:1 }}>AUTOMATED URBAN RISK ANALYTICS · v0.1 · EXPERIMENTAL</div>
            </div>
          </div>
        </div>
      )}

      {/* ══ EXIT ══ */}
      {phase === "exit" && (
        <div className="boot-out" style={{ position:"fixed",inset:0,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9997 }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:13,color:"var(--p3)",letterSpacing:3 }}>LOADING AURA<span className="bk">_</span></div>
        </div>
      )}

      {/* ══════════════════════════ MAIN APP ══════════════════════════ */}
      {phase === "app" && (
        <div ref={appRef} className="app-in ambient-bg" style={{ minHeight:"100vh",position:"relative",background:ambientColors[ambientRisk] }}>

          {/* AMBIENT OVERLAY — shifts with risk */}
          <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",transition:"background 2.5s ease",background:
            ambientRisk==="critical" ? "radial-gradient(ellipse at 50% 30%,rgba(255,69,58,0.07) 0%,transparent 60%)" :
            ambientRisk==="elevated" ? "radial-gradient(ellipse at 50% 30%,rgba(255,159,10,0.06) 0%,transparent 60%)" :
            ambientRisk==="nominal"  ? "radial-gradient(ellipse at 50% 30%,rgba(48,209,88,0.05) 0%,transparent 60%)" :
            "radial-gradient(ellipse at 50% 30%,rgba(99,102,241,0.07) 0%,transparent 60%)"
          }}/>

          {/* FIXED BACKGROUNDS */}
          <div className="grid-overlay" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>
          <div style={{ position:"fixed",top:"-15%",left:"50%",transform:"translateX(-50%)",width:1100,height:700,background:"radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,rgba(124,58,237,0.06) 40%,transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
          <div style={{ position:"fixed",bottom:"-5%",right:"-8%",width:700,height:700,background:"radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 65%)",pointerEvents:"none",zIndex:0 }}/>
          {[[8,15],[22,68],[36,24],[54,85],[70,38],[84,14],[93,60],[14,46],[62,8],[44,74],[78,52],[30,90]].map(([x,y],i)=>(
            <div key={i} style={{ position:"fixed",left:`${x}%`,top:`${y}%`,width:i%4===0?2:1,height:i%4===0?2:1,borderRadius:"50%",background:"rgba(255,255,255,0.55)",animation:`twinkle ${2.5+i*0.35}s ease-in-out ${i*0.28}s infinite`,pointerEvents:"none",zIndex:0 }}/>
          ))}

          {/* ── RADAR OVERLAY ── */}
          {radarActive && (
            <div className="radar-in" style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:200,pointerEvents:"none",width:440,height:440 }}>
              {/* Ping rings */}
              <div className="radar-ping"  style={{ position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(48,209,88,0.6)" }}/>
              <div className="radar-ping-2" style={{ position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(48,209,88,0.4)" }}/>
              <div className="radar-ping-3" style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(48,209,88,0.25)" }}/>
              {/* Crosshair lines */}
              <div style={{ position:"absolute",top:"50%",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(48,209,88,0.3),rgba(48,209,88,0.6),rgba(48,209,88,0.3),transparent)",transform:"translateY(-50%)" }}/>
              <div style={{ position:"absolute",left:"50%",top:0,bottom:0,width:1,background:"linear-gradient(180deg,transparent,rgba(48,209,88,0.3),rgba(48,209,88,0.6),rgba(48,209,88,0.3),transparent)",transform:"translateX(-50%)" }}/>
              {/* Spinning sweep */}
              <div style={{ position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:"50%",left:"50%",width:"50%",height:2,transformOrigin:"0 50%",background:"linear-gradient(90deg,transparent,rgba(48,209,88,0.8))",animation:"radarSpin 1.6s linear infinite",transform:"translateY(-50%)" }}/>
              </div>
              {/* Center dot */}
              <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:10,height:10,borderRadius:"50%",background:"#30d158",boxShadow:"0 0 20px #30d158,0 0 40px rgba(48,209,88,0.5)" }}/>
              {/* Label */}
              <div style={{ position:"absolute",bottom:-28,left:"50%",transform:"translateX(-50%)",fontFamily:"var(--mono)",fontSize:10,color:"rgba(48,209,88,0.7)",letterSpacing:3,whiteSpace:"nowrap" }}>SCANNING RISK VECTORS</div>
            </div>
          )}

          {/* ── LIVE TICKER ── */}
          <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:101,height:28,background:"rgba(4,6,16,0.95)",borderBottom:"1px solid rgba(124,58,237,0.15)",overflow:"hidden",display:"flex",alignItems:"center" }}>
            <div style={{ position:"absolute",left:0,top:0,bottom:0,width:90,background:"linear-gradient(90deg,rgba(4,6,16,1),transparent)",zIndex:2,display:"flex",alignItems:"center",paddingLeft:12,gap:6 }}>
              <div style={{ width:5,height:5,borderRadius:"50%",background:"#30d158",boxShadow:"0 0 5px #30d158" }}/>
              <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"#30d158",letterSpacing:2,whiteSpace:"nowrap" }}>LIVE</span>
            </div>
            <div className="ticker-inner" style={{ paddingLeft:100 }}>
              {[...Array(2)].map((_,rep)=>(
                <span key={rep} style={{ display:"flex",gap:0 }}>
                  {["DATABRICKS CONNECTED · 847,214 RECORDS INDEXED","RISK MODEL ACTIVE · GPT-4o-mini @ TEMP 0","SELECT-ONLY ENFORCED · ZERO WRITE RISK","CRIME + POPULATION DATA · PHOENIX AZ METRO","QUERY ANYTHING IN PLAIN ENGLISH · NO SQL NEEDED","ZIP-LEVEL ANALYTICS · REAL TIME SCORING"].map((t,i)=>(
                    <span key={i} style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--w30)",letterSpacing:2,paddingRight:60,whiteSpace:"nowrap" }}>
                      <span style={{ color:"var(--p3)",marginRight:8 }}>◈</span>{t}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div style={{ position:"absolute",right:0,top:0,bottom:0,width:60,background:"linear-gradient(270deg,rgba(4,6,16,1),transparent)",zIndex:2 }}/>
          </div>

          {/* ── NAV ── */}
          <nav style={{ position:"fixed",top:28,left:0,right:0,zIndex:100,background:"rgba(6,7,15,0.8)",backdropFilter:"blur(24px) saturate(180%)",borderBottom:"1px solid rgba(255,255,255,0.06)",height:62,display:"flex",alignItems:"center",padding:"0 44px",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,var(--p),var(--p3))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,boxShadow:"0 0 16px var(--glow2),0 2px 8px rgba(0,0,0,0.4)" }}>A</div>
              <span style={{ fontWeight:800,fontSize:17,letterSpacing:-0.3,color:"var(--w)" }}>AURA</span>
              <span style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,padding:"2px 8px",borderRadius:100,background:"rgba(255,159,10,0.1)",border:"1px solid rgba(255,159,10,0.3)",color:"#ff9f0a" }}>BETA</span>
            </div>
            <div style={{ display:"flex",gap:32,position:"absolute",left:"50%",transform:"translateX(-50%)" }}>
              {[["How It Works","#guide"],["Terminal","#terminal"],["System","#system"],["Beta","#beta"]].map(([l,h])=>(
                <a key={l} href={h} className="nav-a" style={{ fontSize:14,fontWeight:500,color:"var(--w55)",textDecoration:"none" }}>{l}</a>
              ))}
            </div>
            <div style={{ display:"flex",gap:12,alignItems:"center" }}>
              {queryCount>0&&<div className="count-up" style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:100,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)" }}><span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--p3)",letterSpacing:1 }}>{queryCount} QUER{queryCount===1?"Y":"IES"}</span></div>}
              {/* Ambient risk indicator */}
              {ambientRisk!=="neutral"&&(
                <div style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:100,background:ambientRisk==="critical"?"rgba(255,69,58,0.1)":ambientRisk==="elevated"?"rgba(255,159,10,0.1)":"rgba(48,209,88,0.1)",border:`1px solid ${ambientRisk==="critical"?"rgba(255,69,58,0.3)":ambientRisk==="elevated"?"rgba(255,159,10,0.3)":"rgba(48,209,88,0.3)"}` }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:ambientRisk==="critical"?"#ff453a":ambientRisk==="elevated"?"#ff9f0a":"#30d158",boxShadow:`0 0 6px ${ambientRisk==="critical"?"#ff453a":ambientRisk==="elevated"?"#ff9f0a":"#30d158"}` }}/>
                  <span style={{ fontFamily:"var(--mono)",fontSize:9,color:ambientRisk==="critical"?"#ff453a":ambientRisk==="elevated"?"#ff9f0a":"#30d158",letterSpacing:1 }}>{ambientRisk.toUpperCase()}</span>
                </div>
              )}
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#30d158",boxShadow:"0 0 8px #30d158" }}/>
                <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"#30d158",letterSpacing:2 }}>LIVE</span>
              </div>
              <a href="#terminal" style={{ textDecoration:"none" }}>
                <div className="pill" style={{ padding:"9px 24px",borderRadius:100,background:"linear-gradient(135deg,var(--ind),var(--p),var(--p2))",color:"#ffffff",fontSize:14,fontWeight:700,boxShadow:"0 0 22px var(--glow2),0 4px 16px rgba(0,0,0,0.4)" }}>Get Started</div>
              </a>
            </div>
          </nav>

          {/* ══ HERO ══ */}
          <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"120px 40px 60px",position:"relative",zIndex:2,overflow:"hidden" }}>
            <div className="orb" style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:560,height:560,zIndex:0 }}>
              <div className="glow-breath" style={{ position:"absolute",inset:-100,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.18) 0%,rgba(124,58,237,0.1) 40%,transparent 70%)" }}/>
              <div style={{ position:"absolute",inset:0,borderRadius:"50%",background:"radial-gradient(circle at 38% 32%,rgba(167,139,250,0.45) 0%,rgba(124,58,237,0.3) 30%,rgba(79,70,229,0.2) 55%,rgba(49,46,129,0.1) 75%,transparent 90%)",boxShadow:"0 0 80px rgba(99,102,241,0.35),0 0 160px rgba(124,58,237,0.15),inset 0 0 80px rgba(99,102,241,0.12)" }}/>
              <div style={{ position:"absolute",top:"22%",left:"28%",width:"20%",height:"20%",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,0.5) 0%,rgba(196,132,252,0.25) 50%,transparent 100%)",filter:"blur(10px)" }}/>
              <div className="rA" style={{ position:"absolute",inset:"6%",border:"1px solid rgba(139,92,246,0.2)",borderRadius:"50%",boxShadow:"0 0 14px rgba(124,58,237,0.15)" }}/>
              <div className="rB" style={{ position:"absolute",inset:"16%",border:"1px solid rgba(167,139,250,0.18)",borderRadius:"50%" }}/>
              <div className="rC" style={{ position:"absolute",inset:"28%",border:"1.5px solid rgba(139,92,246,0.28)",borderRadius:"50%",boxShadow:"0 0 18px rgba(124,58,237,0.22)" }}/>
            </div>

            <div style={{ position:"relative",zIndex:2 }}>
              <div className="h1 bfloat" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 18px",borderRadius:100,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",fontSize:13,color:"var(--w55)",marginBottom:36,backdropFilter:"blur(8px)" }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:"var(--p3)",boxShadow:"0 0 8px var(--p2)" }}/>
                Urban risk intelligence · plain English · 847K+ records
              </div>
              <h1 className="h2" style={{ fontWeight:900,fontSize:"clamp(44px,7.5vw,92px)",lineHeight:1.03,letterSpacing:-3,color:"var(--w)",marginBottom:8 }}>The Smartest Way To</h1>
              <h1 className={`h2 glitch-wrap ${glitchActive?"glitch-active":""}`} data-text="Query Urban Risk." style={{ fontWeight:900,fontSize:"clamp(44px,7.5vw,92px)",lineHeight:1.03,letterSpacing:-3,marginBottom:30 }}>
                Query <span className="grad" style={{ filter:"drop-shadow(0 0 24px rgba(139,92,246,0.5))" }}>Urban Risk.</span>
              </h1>
              <p className="h3" style={{ fontSize:18,lineHeight:1.75,color:"var(--w55)",maxWidth:480,margin:"0 auto 44px" }}>Ask anything in plain English. AURA converts it into precision Databricks queries — returning live crime, population, and safety intelligence instantly.</p>
              <div className="h4" style={{ display:"flex",gap:14,justifyContent:"center",marginBottom:80,alignItems:"center" }}>
                <a href="#terminal" style={{ textDecoration:"none" }}>
                  <div className="pill" style={{ padding:"16px 42px",borderRadius:100,background:"linear-gradient(135deg,var(--ind),var(--p),var(--p2))",color:"#fff",fontSize:16,fontWeight:700,boxShadow:"0 0 40px var(--glow),0 0 80px rgba(124,58,237,0.2),0 8px 32px rgba(0,0,0,0.5)",display:"inline-flex",alignItems:"center",gap:10,letterSpacing:-0.2 }}>
                    Get Started<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </a>
                <a href="#guide" style={{ textDecoration:"none" }}>
                  <div className="ghost" style={{ padding:"15px 36px",borderRadius:100,background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.25)",color:"#fff",fontSize:16,fontWeight:600,letterSpacing:-0.2,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",backdropFilter:"blur(10px)" }}>Learn More</div>
                </a>
              </div>
              {/* Hero preview card */}
              <div className="h5" style={{ width:"100%",maxWidth:820,margin:"0 auto",background:"rgba(9,9,26,0.88)",backdropFilter:"blur(24px)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:20,boxShadow:"0 0 0 1px rgba(124,58,237,0.06),0 40px 100px rgba(0,0,0,0.75)" }}>
                <div style={{ padding:"13px 18px",borderBottom:"1px solid var(--b)",background:"rgba(255,255,255,0.02)",borderRadius:"20px 20px 0 0",display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ display:"flex",gap:6 }}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
                  {["Terminal","How It Works","System"].map((t,i)=>(
                    <div key={t} style={{ padding:"5px 14px",borderRadius:8,background:i===0?"var(--bg4)":"transparent",border:`1px solid ${i===0?"var(--b2)":"transparent"}`,fontFamily:"var(--mono)",fontSize:11,color:i===0?"var(--w)":"var(--w30)" }}>{t}</div>
                  ))}
                  <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:5 }}>
                    <div style={{ width:5,height:5,borderRadius:"50%",background:"#30d158",boxShadow:"0 0 5px #30d158" }}/>
                    <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"#30d158",letterSpacing:1 }}>LIVE</span>
                  </div>
                </div>
                <div style={{ padding:"22px 20px",display:"flex",flexDirection:"column",gap:14 }}>
                  <div style={{ display:"flex",justifyContent:"flex-end" }}>
                    <div style={{ padding:"10px 16px",borderRadius:"14px 14px 4px 14px",background:"rgba(124,58,237,0.13)",border:"1px solid rgba(124,58,237,0.22)",fontFamily:"var(--mono)",fontSize:13,color:"var(--w)",maxWidth:"70%",lineHeight:1.55,textAlign:"left" }}>
                      <div style={{ fontSize:8,letterSpacing:3,color:"var(--p3)",marginBottom:5,opacity:0.7 }}>QUERY</div>
                      Which grocery stores are in the most dangerous ZIP codes?
                    </div>
                  </div>
                  <div style={{ padding:"10px 16px",borderRadius:"4px 14px 14px 14px",background:"var(--bg4)",border:"1px solid var(--b)",borderLeft:"2px solid var(--p2)",fontFamily:"var(--mono)",fontSize:12,color:"var(--w55)",lineHeight:1.8,maxWidth:"76%",textAlign:"left" }}>
                    <div style={{ fontSize:8,letterSpacing:3,color:"rgba(167,139,250,0.5)",marginBottom:6 }}>ANALYST REPORT</div>
                    Found 5 stores in high-risk zones. ZIP 85031 leads with a risk index of 87...
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    {[{n:"Walmart",z:"85031",s:87,c:"#ff453a"},{n:"Food City",z:"85019",s:64,c:"#ff9f0a"},{n:"Fry's Food",z:"85009",s:51,c:"#ff9f0a"}].map(s=>(
                      <div key={s.z} style={{ flex:1,padding:"12px 14px",background:`${s.c}0d`,border:`1px solid ${s.c}22`,borderRadius:12,textAlign:"left" }}>
                        <div style={{ fontFamily:"var(--mono)",fontSize:8,color:s.c,letterSpacing:1,marginBottom:5 }}>● {s.s>=50?"CRITICAL":"ELEVATED"}</div>
                        <div style={{ fontSize:11,fontWeight:600,color:"var(--w)",marginBottom:2 }}>{s.n}</div>
                        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--w30)" }}>ZIP {s.z}</div>
                        <div style={{ marginTop:8,height:2,background:"rgba(255,255,255,0.05)",borderRadius:1 }}><div style={{ height:"100%",width:`${s.s}%`,background:s.c,borderRadius:1 }}/></div>
                        <div style={{ marginTop:3,fontFamily:"var(--mono)",fontSize:11,color:s.c,textAlign:"right",fontWeight:700 }}>{s.s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ HOW IT WORKS ══ */}
          <section id="guide" style={{ padding:"130px 44px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}>
            <div style={{ ...reveal(300,150),transition:"opacity 0.5s ease,transform 0.5s ease",textAlign:"center",marginBottom:64 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 16px",borderRadius:100,background:"rgba(124,58,237,0.09)",border:"1px solid rgba(124,58,237,0.22)",fontFamily:"var(--mono)",fontSize:10,color:"var(--p3)",letterSpacing:2,marginBottom:18 }}>◈ HOW IT WORKS</div>
              <h2 style={{ fontWeight:800,fontSize:"clamp(34px,4.5vw,60px)",letterSpacing:-2,lineHeight:1.06,marginBottom:14 }}>All Of Your Intelligence<br/><span className="grad">In One Place</span></h2>
              <p style={{ fontSize:16,color:"var(--w55)",maxWidth:400,margin:"0 auto" }}>A social intelligence environment for urban safety analysts and developers.</p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:60 }}>
              {[
                {icon:"💬",n:"01",t:"Remain In Flow\nWhile Querying",d:"No SQL needed. Ask like a colleague — AURA understands, translates, and returns data without breaking your flow.",c:"rgba(99,102,241,0.1)"},
                {icon:"🚀",n:"02",t:"Roll Out Results To\nYour Entire Team",d:"Results arrive as clean shareable risk cards. CRITICAL, ELEVATED, NOMINAL. Share intelligence instantly.",c:"rgba(124,58,237,0.07)"},
                {icon:"🤖",n:"03",t:"Become A\nLeader In AI",d:"GPT-4o-mini converts your question to deterministic Databricks SQL — SELECT-only locked, zero modification risk.",c:"rgba(79,70,229,0.09)"},
                {icon:"⚡",n:"04",t:"Accelerate\nDevelopment",d:"847K+ indexed records. Real-time risk scoring. Population and crime data normalized to a 0–100 index.",c:"rgba(139,92,246,0.08)"},
              ].map((s,i)=>(
                <div key={s.n} className="feat" style={{ ...reveal(500+i*60,140),transition:`opacity 0.55s ease ${i*0.08}s,transform 0.55s ease ${i*0.08}s`,padding:"38px 34px",background:s.c,border:"1px solid rgba(255,255,255,0.07)",borderRadius:i===0?"22px 8px 8px 8px":i===1?"8px 22px 8px 8px":i===2?"8px 8px 8px 22px":"8px 8px 22px 8px",position:"relative",overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.3)" }}>
                  <div style={{ position:"absolute",top:-8,right:20,fontFamily:"var(--mono)",fontSize:80,color:"rgba(255,255,255,0.025)",fontWeight:800,lineHeight:1,userSelect:"none" }}>{s.n}</div>
                  <div style={{ fontSize:32,marginBottom:18 }}>{s.icon}</div>
                  <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--p3)",letterSpacing:3,marginBottom:10,opacity:0.65 }}>STEP {s.n}</div>
                  <div style={{ fontWeight:700,fontSize:21,color:"var(--w)",marginBottom:12,letterSpacing:-0.5,whiteSpace:"pre-line",lineHeight:1.2 }}>{s.t}</div>
                  <div style={{ fontSize:14,lineHeight:1.78,color:"var(--w55)" }}>{s.d}</div>
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.3),transparent)" }}/>
                </div>
              ))}
            </div>
            <div style={{ ...reveal(900,140),transition:"opacity 0.5s ease,transform 0.5s ease" }}>
              <div style={{ textAlign:"center",marginBottom:22 }}>
                <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 16px",borderRadius:100,background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",fontFamily:"var(--mono)",fontSize:10,color:"var(--w30)",letterSpacing:2 }}>EXAMPLE QUERIES — CLICK TO USE</div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                {EXAMPLES.map((ex,i)=>(
                  <div key={i} className="ex-row" style={{ padding:"15px 20px",background:"rgba(255,255,255,0.02)",border:"1px solid var(--b)",borderRadius:12,display:"flex",alignItems:"center",gap:14 }}
                    onClick={()=>{setQuestion(ex);document.getElementById("terminal")?.scrollIntoView({behavior:"smooth"})}}>
                    <div style={{ width:28,height:28,borderRadius:8,flexShrink:0,background:"rgba(124,58,237,0.14)",border:"1px solid rgba(124,58,237,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:10,color:"var(--p3)" }}>{String(i+1).padStart(2,"0")}</div>
                    <span style={{ fontSize:13,color:"var(--w55)",lineHeight:1.45,flex:1 }}>{ex}</span>
                    <span style={{ color:"var(--w30)",fontSize:14 }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ TERMINAL ══ */}
          <section id="terminal" style={{ padding:"0 44px 130px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}>
            <div style={{ ...reveal(1200,140),transition:"opacity 0.5s ease,transform 0.5s ease",textAlign:"center",marginBottom:48 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 16px",borderRadius:100,background:"rgba(124,58,237,0.09)",border:"1px solid rgba(124,58,237,0.22)",fontFamily:"var(--mono)",fontSize:10,color:"var(--p3)",letterSpacing:2,marginBottom:18 }}>⬡ INTELLIGENCE TERMINAL</div>
              <h2 style={{ fontWeight:800,fontSize:"clamp(34px,4.5vw,60px)",letterSpacing:-2,lineHeight:1.06 }}>Query the City.</h2>
            </div>

            {/* Terminal window */}
            <div style={{ ...reveal(1250,160),transition:"opacity 0.55s ease,transform 0.55s ease",background:"rgba(9,9,26,0.92)",backdropFilter:"blur(24px)",border:"1px solid rgba(99,102,241,0.16)",borderRadius:20,display:"flex",flexDirection:"column",height:"70vh",boxShadow:"0 0 0 1px rgba(124,58,237,0.06),0 40px 100px rgba(0,0,0,0.75)",position:"relative",overflow:"hidden" }}>
              {loading&&<div className="sw"/>}
              <div style={{ padding:"12px 18px",borderBottom:"1px solid var(--b)",background:"rgba(255,255,255,0.02)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ display:"flex",gap:6 }}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
                  <span style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--w30)" }}>aura — risk_query</span>
                </div>
                <span style={{ fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,color:loading?"#ff9f0a":"#30d158" }}>
                  {loading?<>PROCESSING<span className="bk">_</span></>:<>READY<span className="bk">_</span></>}
                </span>
              </div>

              <div ref={feedRef} style={{ flex:1,overflowY:"auto",padding:"28px",display:"flex",flexDirection:"column",gap:20 }}>
                {messages.length===0&&(
                  <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,opacity:0.25 }}>
                    <div style={{ width:56,height:56,borderRadius:16,background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>🔍</div>
                    <div style={{ fontFamily:"var(--mono)",fontSize:11,letterSpacing:3,color:"var(--w55)",textAlign:"center" }}>TYPE A QUERY OR CLICK AN EXAMPLE ABOVE</div>
                  </div>
                )}
                {messages.map((msg,i)=>{
                  if(msg.role==="user") return (
                    <div key={i} className="mr" style={{ display:"flex",justifyContent:"flex-end" }}>
                      <div style={{ maxWidth:"64%",padding:"12px 18px",background:"rgba(124,58,237,0.13)",border:"1px solid rgba(124,58,237,0.22)",borderRadius:"16px 16px 4px 16px",fontFamily:"var(--mono)",fontSize:13,color:"var(--w)",lineHeight:1.6 }}>
                        <div style={{ fontSize:8,letterSpacing:3,color:"var(--p3)",marginBottom:6,opacity:0.7 }}>QUERY</div>
                        {msg.content}
                      </div>
                    </div>
                  );
                  return (
                    <div key={i} className="ml" style={{ display:"flex",flexDirection:"column",gap:14 }}>
                      {msg.answer&&(
                        <div style={{ padding:"13px 18px",background:"var(--bg4)",border:"1px solid var(--b)",borderLeft:"2px solid var(--p2)",borderRadius:"4px 16px 16px 16px",fontFamily:"var(--mono)",fontSize:13,lineHeight:1.85,color:"var(--w55)" }}>
                          <div style={{ fontSize:8,letterSpacing:3,color:"rgba(167,139,250,0.5)",marginBottom:8 }}>ANALYST REPORT</div>
                          {msg.answer}
                        </div>
                      )}
                      {msg.results?.length>0&&(
                        <div style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:6 }}>
                          {msg.results.map((store:any,j:number)=>{
                            const r=riskOf(store.priority_score);
                            const explodeClass=`ce${Math.min(j,7)}`;
                            return (
                              <div key={j} className={`${explodeClass} rcard`} style={{ minWidth:212,flexShrink:0,background:r.bg,border:`1px solid ${r.c}22`,borderRadius:14,padding:"16px",position:"relative",overflow:"hidden" }}>
                                <div style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,color:r.c,marginBottom:8,display:"flex",alignItems:"center",gap:5 }}>
                                  <div style={{ width:5,height:5,borderRadius:"50%",background:r.c,boxShadow:`0 0 6px ${r.c}` }}/>{r.l}
                                </div>
                                <div style={{ fontWeight:600,fontSize:14,color:"var(--w)",marginBottom:2,lineHeight:1.2 }}>{store.store_name||`ZIP ${store.zip_code}`}</div>
                                <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--w30)",letterSpacing:1,marginBottom:14 }}>{store.city?.trim()||"UNKNOWN"} · {store.zip_code}</div>
                                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
                                  <div><div style={{ fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"var(--w30)",marginBottom:3 }}>CRIMES</div><div style={{ fontWeight:700,fontSize:20,color:"#ff453a" }}>{(store.total_crimes||0).toLocaleString()}</div></div>
                                  <div><div style={{ fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"var(--w30)",marginBottom:3 }}>POP.</div><div style={{ fontWeight:700,fontSize:20,color:"#60a5fa" }}>{(store.population||0).toLocaleString()}</div></div>
                                </div>
                                <div style={{ fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"var(--w30)",display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                                  <span>RISK INDEX</span><span style={{ color:r.c,fontWeight:700,fontSize:13 }}>{store.priority_score}</span>
                                </div>
                                <div style={{ height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden" }}>
                                  <div className="fb" style={{ height:"100%",width:`${Math.min(100,store.priority_score)}%`,background:`linear-gradient(90deg,${r.c}88,${r.c})`,borderRadius:2 }}/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {loading&&(
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    {[1,2,3].map(n=><div key={n} className={`d${n}`} style={{width:7,height:7,borderRadius:"50%",background:"var(--p2)"}}/>)}
                    <span style={{ fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,color:"var(--w30)",marginLeft:4 }}>Scanning risk vectors...</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop:"1px solid var(--b)",background:"rgba(9,9,26,0.6)",padding:"13px 18px",display:"flex",gap:10,alignItems:"center",flexShrink:0 }}>
                <input className="inp" style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid var(--b2)",borderRadius:12,padding:"10px 16px",color:"var(--w)",fontFamily:"var(--mono)",fontSize:13,caretColor:"var(--p2)",transition:"border-color 0.2s,box-shadow 0.2s" }} placeholder={typedPlaceholder+"█"} value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fire()}/>
                <button className="fbtn" onClick={fire} disabled={loading||!question.trim()} style={{ padding:"10px 24px",borderRadius:12,background:question.trim()&&!loading?"linear-gradient(135deg,var(--ind),var(--p),var(--p2))":"rgba(255,255,255,0.04)",border:"none",color:question.trim()&&!loading?"var(--w)":"var(--w30)",fontFamily:"var(--sans)",fontSize:13,fontWeight:700,flexShrink:0,boxShadow:question.trim()&&!loading?"0 0 20px var(--glow2)":"none",transition:"all 0.18s ease" }}>
                  {loading?"...":"Execute"}
                </button>
              </div>
            </div>

            {/* ══ LIVE MAP ══ */}
            {mapVisible && (
              <div id="aura-map" className="map-reveal" style={{ marginTop:24,borderRadius:20,overflow:"hidden",border:"1px solid rgba(99,102,241,0.2)",boxShadow:"0 0 60px rgba(99,102,241,0.1),0 40px 80px rgba(0,0,0,0.6)",position:"relative" }}>
                {/* Map header */}
                <div style={{ padding:"12px 18px",background:"rgba(6,7,15,0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:8,height:8,borderRadius:"50%",background:"var(--p3)",boxShadow:"0 0 8px var(--p2)" }}/>
                    <span style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--w55)",letterSpacing:2 }}>RISK INTELLIGENCE MAP</span>
                    <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--w30)",padding:"2px 8px",borderRadius:100,background:"rgba(255,255,255,0.04)",border:"1px solid var(--b)" }}>{mapResults.length} LOCATIONS</span>
                  </div>
                  {/* Legend */}
                  <div style={{ display:"flex",gap:12 }}>
                    {[["#ff453a","CRITICAL"],["#ff9f0a","ELEVATED"],["#30d158","NOMINAL"]].map(([c,l])=>(
                      <div key={l} style={{ display:"flex",alignItems:"center",gap:5 }}>
                        <div style={{ width:6,height:6,borderRadius:"50%",background:c,boxShadow:`0 0 6px ${c}` }}/>
                        <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--w30)",letterSpacing:1 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Leaflet map container */}
                <div ref={mapRef} style={{ height:420,width:"100%",background:"#06070f" }}/>
              </div>
            )}
          </section>

          {/* ══ SYSTEM ══ */}
          <section id="system" style={{ padding:"0 44px 130px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}>
            <div style={{ ...reveal(1900,140),transition:"opacity 0.5s ease,transform 0.5s ease",textAlign:"center",marginBottom:52 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 16px",borderRadius:100,background:"rgba(124,58,237,0.09)",border:"1px solid rgba(124,58,237,0.22)",fontFamily:"var(--mono)",fontSize:10,color:"var(--p3)",letterSpacing:2,marginBottom:18 }}>⬢ SYSTEM</div>
              <h2 style={{ fontWeight:800,fontSize:"clamp(34px,4.5vw,60px)",letterSpacing:-2,lineHeight:1.06 }}>Built on Real Infrastructure</h2>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
              {[
                {icon:"🤖",t:"AI Engine",c:"var(--p3)",d:"GPT-4o-mini at Temperature 0. Deterministic SQL. SELECT-only enforcement. Zero modification risk in production.",delay:0},
                {icon:"⚡",t:"Databricks",c:"#60a5fa",d:"Direct cluster integration. 847,214 records across ZIP codes, stores, crime totals, and population.",delay:80},
                {icon:"📊",t:"Risk Index",c:"#ff453a",d:"Crime and population normalized to 0–100 in real time. Powers every card classification automatically.",delay:160},
              ].map(card=>(
                <div key={card.t} className="feat" style={{ ...reveal(2000+card.delay,130),transition:`opacity 0.5s ease ${card.delay}ms,transform 0.5s ease ${card.delay}ms`,padding:"34px 28px",background:"rgba(255,255,255,0.02)",border:"1px solid var(--b)",borderRadius:20,position:"relative",overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.3)" }}>
                  <div style={{ fontSize:36,marginBottom:18 }}>{card.icon}</div>
                  <div style={{ fontWeight:700,fontSize:18,color:card.c,marginBottom:10,letterSpacing:-0.3 }}>{card.t}</div>
                  <div style={{ fontSize:14,lineHeight:1.78,color:"var(--w55)" }}>{card.d}</div>
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${card.c}22,transparent)` }}/>
                </div>
              ))}
            </div>
          </section>

          {/* ══ BETA ══ */}
          <section id="beta" style={{ padding:"0 44px 140px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}>
            <div style={{ ...reveal(2400,150),transition:"opacity 0.55s ease,transform 0.55s ease",border:"1px solid rgba(255,69,58,0.15)",borderRadius:20,padding:"46px 50px",background:"rgba(255,69,58,0.025)",position:"relative",boxShadow:"0 0 60px rgba(255,69,58,0.04)" }} className="betab">
              <div style={{ position:"absolute",top:20,right:24,display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.25)",fontFamily:"var(--mono)",fontSize:10,color:"#ff453a",letterSpacing:2 }}>⚠ BETA v0.1</div>
              <h2 style={{ fontWeight:800,fontSize:"clamp(28px,3.5vw,46px)",letterSpacing:-1.5,lineHeight:1.08,marginBottom:10 }}>Rough Edges. Real Data.</h2>
              <p style={{ fontSize:16,color:"var(--w55)",marginBottom:38,maxWidth:500 }}>AURA is experimental. Powerful but not perfect. Here's what to know before you dive in.</p>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:44 }}>
                <div>
                  <div style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"rgba(255,69,58,0.55)",marginBottom:20 }}>KNOWN LIMITATIONS</div>
                  {["Queries may occasionally fail or misfire","Some questions get misinterpreted","Cluster may time out — just retry","Indexed data only, not a live feed","Not for operational or policy decisions"].map((x,i)=>(
                    <div key={i} style={{ display:"flex",gap:12,marginBottom:12,alignItems:"flex-start" }}>
                      <div style={{ width:20,height:20,borderRadius:7,background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#ff453a",flexShrink:0,marginTop:1 }}>✗</div>
                      <span style={{ fontSize:14,color:"var(--w55)",lineHeight:1.65 }}>{x}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"rgba(48,209,88,0.55)",marginBottom:20 }}>BEST PRACTICES</div>
                  {["One clear question at a time","Include city names for accuracy","Use extremes — highest, lowest, most","Rephrase and retry if nothing returns","Research and exploration only"].map((x,i)=>(
                    <div key={i} style={{ display:"flex",gap:12,marginBottom:12,alignItems:"flex-start" }}>
                      <div style={{ width:20,height:20,borderRadius:7,background:"rgba(48,209,88,0.1)",border:"1px solid rgba(48,209,88,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#30d158",flexShrink:0,marginTop:1 }}>✓</div>
                      <span style={{ fontSize:14,color:"var(--w55)",lineHeight:1.65 }}>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop:34,paddingTop:26,borderTop:"1px solid var(--b)",fontFamily:"var(--mono)",fontSize:11,color:"var(--w30)",lineHeight:2 }}>
                AURA is experimental. Provided as-is for demo purposes. Not for law enforcement, policy, or operational use.
              </div>
            </div>
          </section>

          {/* ══ BUILT BY ══ */}
          <section style={{ padding:"0 44px 80px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}>
            <div style={{ border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"40px 48px",background:"rgba(255,255,255,0.02)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:32 }}>
              <div style={{ display:"flex",alignItems:"center",gap:20,flexShrink:0 }}>
                <div style={{ width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,var(--ind),var(--p),var(--p3))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,boxShadow:"0 0 24px var(--glow2),0 8px 24px rgba(0,0,0,0.4)",flexShrink:0 }}>Z</div>
                <div>
                  <div style={{ fontWeight:800,fontSize:20,letterSpacing:-0.5,color:"var(--w)",marginBottom:4 }}>Zain Shah</div>
                  <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--p3)",letterSpacing:1 }}>CS @ ASU · Open to SWE Internships 2026</div>
                </div>
              </div>
              <div style={{ textAlign:"center",flex:1 }}>
                <div style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:4,color:"var(--w30)",marginBottom:10 }}>WHAT AURA MEANS</div>
                <div style={{ fontWeight:700,fontSize:16,color:"var(--w)",letterSpacing:-0.3 }}>
                  {[["A","utomated"],["U","rban"],["R","isk"],["A","nalytics"]].map(([g,rest],i)=>(
                    <span key={i}><span style={{ background:"linear-gradient(135deg,var(--p2),var(--p3))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{g}</span>{rest}{i<3?" ":""}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex",gap:10,flexShrink:0 }}>
                <a href="https://github.com/SikeTheMike" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <div style={{ padding:"10px 20px",borderRadius:100,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"var(--w80)",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8,transition:"all 0.18s ease",cursor:"pointer" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </div>
                </a>
                <a href="https://linkedin.com/in/zain-sahir-s-4b1a9a227" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <div style={{ padding:"10px 20px",borderRadius:100,background:"linear-gradient(135deg,var(--ind),var(--p))",color:"#fff",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8,boxShadow:"0 0 16px var(--glow2)",transition:"all 0.18s ease",cursor:"pointer" }}
                    onMouseEnter={e=>{e.currentTarget.style.filter="brightness(1.15)";e.currentTarget.style.transform="translateY(-1px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.filter="none";e.currentTarget.style.transform="none"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div style={{ borderTop:"1px solid var(--b)",padding:"24px 44px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2 }}>
            <div style={{ display:"flex",alignItems:"center",gap:9 }}>
              <div style={{ width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,var(--ind),var(--p2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,boxShadow:"0 0 12px var(--glow2)" }}>A</div>
              <span style={{ fontWeight:800,fontSize:15,letterSpacing:-0.2 }}>AURA</span>
            </div>
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--w30)",letterSpacing:1 }}>AUTOMATED URBAN RISK ANALYTICS · v0.1 BETA · DATABRICKS + OPENAI</div>
            <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,0.08)",letterSpacing:1 }}>© 2026 ZAIN SHAH</div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toastPhase!=="hidden"&&(
        <div className={toastPhase==="closing"?"toast-exit":"toast-appear"} style={{ position:"fixed",bottom:32,right:32,zIndex:9998,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:0,pointerEvents:"none" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"flex-end",marginBottom:6 }}>
            <div className={toastPhase==="crack"?"icon-crack":"icon-pop"} style={{ width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,var(--ind),var(--p),var(--p3))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px var(--glow),0 8px 24px rgba(0,0,0,0.5)",position:"relative",overflow:"hidden" }}>
              {toastPhase==="crack"&&<div style={{ position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%)",backgroundSize:"200% 100%",animation:"shimmer 0.4s ease forwards" }}/>}
              {toastPhase==="crack"&&<div style={{ position:"absolute",top:"50%",left:0,height:1,background:"rgba(255,255,255,0.8)",animation:"crackLine 0.35s ease forwards" }}/>}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>
          {(toastPhase==="open"||toastPhase==="closing")&&(
            <div className={toastPhase==="closing"?"msg-rollup":"msg-unroll"} style={{ width:300,background:"rgba(10,12,28,0.97)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:"16px 4px 16px 16px",padding:"16px 18px",boxShadow:"0 0 40px rgba(124,58,237,0.15),0 20px 60px rgba(0,0,0,0.6)",backdropFilter:"blur(20px)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#ff9f0a",boxShadow:"0 0 6px #ff9f0a",flexShrink:0 }}/>
                <span style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"#ff9f0a" }}>HEADS UP · BETA</span>
              </div>
              <p style={{ fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.75)",marginBottom:12 }}>First couple of queries might be a little slow — AURA is still spinning up its cluster. Hang tight, it gets faster! 🚀</p>
              <div style={{ fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,color:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <span>AUTOMATED URBAN RISK ANALYTICS</span><span>v0.1</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}