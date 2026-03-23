"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  Orbit,
  ArrowUpRight,
  Play,
  Zap,
  Shield,
  Cpu,
  Database,
  Network,
  Lock,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Terminal,
  MapPin,
  BarChart3,
  Search,
  AlertTriangle,
  Clock,
  FlaskConical,
  RefreshCw,
  Flame,
  MessageSquare,
  TrendingUp,
  Target,
} from "lucide-react";

/* ═══ ZIP COORDINATES ═══ */
const ZIP_COORDS: Record<string, [number, number]> = {
  "85001":[33.4484,-112.0740],"85002":[33.4484,-112.0740],"85003":[33.4484,-112.0740],
  "85004":[33.4500,-112.0660],"85005":[33.4350,-112.1200],"85006":[33.4600,-112.0500],
  "85007":[33.4350,-112.0900],"85008":[33.4600,-112.0100],"85009":[33.4450,-112.1300],
  "85010":[33.4350,-112.0000],"85011":[33.5000,-112.0700],"85012":[33.5100,-112.0700],
  "85013":[33.5200,-112.0800],"85014":[33.5300,-112.0600],"85015":[33.5100,-112.1000],
  "85016":[33.5000,-112.0300],"85017":[33.5000,-112.1200],"85018":[33.4900,-111.9900],
  "85019":[33.5100,-112.1500],"85020":[33.5600,-112.0600],"85021":[33.5500,-112.0900],
  "85022":[33.6000,-112.0400],"85023":[33.6200,-112.1000],"85024":[33.6600,-112.0200],
  "85027":[33.6400,-112.1100],"85028":[33.5600,-111.9900],"85029":[33.5900,-112.1200],
  "85031":[33.4900,-112.1600],"85032":[33.5600,-111.9500],"85033":[33.4900,-112.1900],
  "85034":[33.4200,-112.0300],"85035":[33.4700,-112.1900],"85037":[33.4700,-112.2300],
  "85040":[33.3900,-112.0100],"85041":[33.3700,-112.0700],"85042":[33.3700,-112.0200],
  "85043":[33.3900,-112.1500],"85044":[33.3500,-111.9800],"85048":[33.3100,-111.9800],
  "85050":[33.6300,-111.9700],"85051":[33.5400,-112.1300],"85053":[33.6000,-112.1300],
  "85054":[33.6700,-111.9400],"85083":[33.7000,-112.1400],"85085":[33.7200,-112.1000],
  "85086":[33.7500,-112.0700],"85201":[33.4200,-111.8400],"85202":[33.3900,-111.8500],
  "85203":[33.4300,-111.8000],"85204":[33.4100,-111.7700],"85205":[33.4300,-111.7400],
  "85206":[33.4000,-111.7300],"85207":[33.4300,-111.6900],"85208":[33.4000,-111.6700],
  "85209":[33.3800,-111.6500],"85210":[33.3900,-111.8400],"85213":[33.4500,-111.7600],
  "85224":[33.3000,-111.8900],"85225":[33.3200,-111.8400],"85226":[33.3200,-111.9300],
  "85233":[33.3300,-111.8400],"85234":[33.3500,-111.8000],"85248":[33.2600,-111.8500],
  "85249":[33.2700,-111.8000],"85250":[33.5100,-111.9200],"85251":[33.4900,-111.9300],
  "85253":[33.5300,-111.9400],"85254":[33.5700,-111.9600],"85255":[33.6400,-111.9000],
  "85256":[33.4700,-111.8700],"85257":[33.4700,-111.9100],"85258":[33.5400,-111.8900],
  "85259":[33.5700,-111.8600],"85260":[33.6000,-111.9000],"85266":[33.7000,-111.9300],
  "85268":[33.5900,-111.8200],"85281":[33.4200,-111.9300],"85282":[33.4000,-111.9300],
  "85283":[33.3800,-111.9300],"85284":[33.3500,-111.9300],"85286":[33.3000,-111.9200],
  "85295":[33.3200,-111.7600],"85296":[33.3500,-111.7600],"85297":[33.3000,-111.7600],
  "85301":[33.5300,-112.1800],"85302":[33.5400,-112.1600],"85303":[33.5200,-112.1900],
  "85304":[33.5600,-112.1600],"85305":[33.5100,-112.2200],"85306":[33.5800,-112.1400],
  "85308":[33.6000,-112.1500],"85310":[33.6200,-112.1700],"85323":[33.4000,-112.2800],
  "85338":[33.3700,-112.3000],"85339":[33.3200,-112.1800],"85345":[33.5200,-112.2400],
  "85351":[33.5000,-112.2900],"85353":[33.4400,-112.2800],"85363":[33.5400,-112.3000],
  "85373":[33.6500,-112.2300],"85374":[33.6300,-112.2800],"85375":[33.6600,-112.2600],
  "85379":[33.6000,-112.3500],"85381":[33.5800,-112.2200],"85382":[33.6000,-112.2000],
  "85383":[33.6800,-112.2600],"85387":[33.7200,-112.3000],"85388":[33.6100,-112.3200],
};
function getZipCoords(zip: string): [number, number] | null { return ZIP_COORDS[zip] || null; }

/* ═══ GLOBAL CSS ═══ */
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer components{
  /* Ultra-modern Deep Glassmorphism */
  .void-glass {
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .void-glass-solid {
    background: rgba(2, 6, 23, 0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .pro-hover:hover {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(30, 41, 59, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
  }
  
  /* Gradient Texts */
  .text-gradient-indigo {
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .text-gradient-teal {
    background: linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#__next,[data-nextjs-scroll-focus-boundary]{background:#020617!important;color-scheme:dark!important;scroll-behavior:smooth}
body{overflow-x:hidden;font-family:'Inter',sans-serif;color:#e2e8f0;-webkit-font-smoothing:antialiased}
::selection{background:rgba(99,102,241,.3);color:#fff}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
input,button,select,textarea{color-scheme:dark;background-color:transparent;font-family:'Inter',sans-serif}
a{color:inherit;text-decoration:none}

/* Hardware Accelerated Starfield Void */
@keyframes driftVoid {
  0% { transform: translateY(0) translateZ(0); opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-1000px) translateZ(0); opacity: 0.4; }
}
.void-stars {
  position: fixed;
  inset: -50%;
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}
.layer-1 {
  background-image: 
    radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,.8), transparent), 
    radial-gradient(1.5px 1.5px at 30% 50%, rgba(99,102,241,.6), transparent), 
    radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,.5), transparent), 
    radial-gradient(2px 2px at 90% 20%, rgba(6,182,212,.4), transparent);
  background-size: 350px 350px;
  animation: driftVoid 140s linear infinite;
}
.layer-2 {
  background-image: 
    radial-gradient(2px 2px at 20% 80%, rgba(255,255,255,.4), transparent), 
    radial-gradient(1px 1px at 80% 40%, rgba(99,102,241,.5), transparent), 
    radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,.3), transparent);
  background-size: 500px 500px;
  animation: driftVoid 90s linear infinite;
}

/* Animations */
@keyframes appIn{0%{opacity:0;transform:translateY(15px)}100%{opacity:1;transform:none}}.app-in{animation:appIn .6s ease-out forwards}
@keyframes slideL{from{opacity:0;transform:translateX(-15px)}to{opacity:1;transform:none}}.ml{animation:slideL .4s cubic-bezier(0.25, 1, 0.5, 1) both;}
@keyframes slideR{from{opacity:0;transform:translateX(15px)}to{opacity:1;transform:none}}.mr{animation:slideR .4s cubic-bezier(0.25, 1, 0.5, 1) both;}
@keyframes fb{from{width:0%}5%{opacity:1}}.fb{animation:fb 1s cubic-bezier(0.25, 1, 0.5, 1) forwards}

.leaflet-container{background:#020617!important}.leaflet-popup-content-wrapper{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important}.leaflet-popup-tip{display:none!important}.leaflet-popup-content{margin:0!important}
.leaflet-control-zoom{border:1px solid rgba(255,255,255,.1)!important;background:rgba(15,23,42,.8)!important;backdrop-filter:blur(10px);}.leaflet-control-zoom a{color:rgba(255,255,255,.6)!important;background:transparent!important;border-bottom:1px solid rgba(255,255,255,.1)!important}.leaflet-control-zoom a:hover{color:#fff!important;background:rgba(255,255,255,.1)!important}

/* Bento Grid System */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .bento-grid { display: flex; flex-direction: column; gap: 20px; }
}
`;

const customEase: [number,number,number,number] = [0.25, 1, 0.5, 1];

/* ═══ TEXT REVEAL ═══ */
function BlurText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ staggerChildren: 0.015, delayChildren: delay }}>
      {words.map((word, i) => (
        <motion.span key={i} style={{ display: "inline-block", marginRight: "0.25em" }} variants={{ hidden: { filter: "blur(6px)", opacity: 0, y: 10 }, visible: { filter: "blur(0px)", opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: customEase }}>{word}</motion.span>
      ))}
    </motion.div>
  );
}

/* ═══ COMPONENT REVEAL ═══ */
function Reveal({ children, delay = 0, className = "", direction = "up", fill = false }: { children: React.ReactNode; delay?: number; className?: string, direction?: "up" | "left" | "right" | "down", fill?: boolean }) {
  const initial = { opacity: 0, y: direction === "up" ? 20 : direction === "down" ? -20 : 0, x: direction === "left" ? -20 : direction === "right" ? 20 : 0 };
  const animate = { opacity: 1, y: 0, x: 0 };
  return (
    <motion.div initial={initial} whileInView={animate} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, delay, ease: customEase }} className={className} style={fill ? {height: '100%'} : {}}>
      {children}
    </motion.div>
  );
}

/* ═══ MAIN ═══ */
export default function Chat() {
  const [question,setQuestion]=useState("");const [messages,setMessages]=useState<any[]>([]);const [loading,setLoading]=useState(false);const [phase,setPhase]=useState<"boot"|"disclaimer"|"exit"|"app">("boot");const [bootLine,setBootLine]=useState(0);const [disclaimerIn,setDisclaimerIn]=useState(false);const [disclaimerExit,setDisclaimerExit]=useState(false);const [acceptPulse,setAcceptPulse]=useState(false);const [ambientRisk,setAmbientRisk]=useState<"neutral"|"critical"|"elevated"|"nominal">("neutral");const [mapResults,setMapResults]=useState<any[]>([]);const [mapVisible,setMapVisible]=useState(false);const [queryCount,setQueryCount]=useState(0);const [typedPlaceholder,setTypedPlaceholder]=useState("");const [isMobile,setIsMobile]=useState(false);const [forceDesktop,setForceDesktop]=useState(false);const [menuOpen,setMenuOpen]=useState(false);const [openFaq,setOpenFaq]=useState<number|null>(null);const feedRef=useRef<HTMLDivElement>(null);const mapRef=useRef<HTMLDivElement>(null);const leafletMap=useRef<any>(null);const markersLayer=useRef<any>(null);const heroRef=useRef<HTMLElement>(null);const [toastPhase,setToastPhase]=useState<"hidden"|"crack"|"open"|"closing">("hidden");const hasToasted=useRef(false);const placeholderIdx=useRef(0);const charIdx=useRef(0);

  const{scrollYProgress}=useScroll({target:heroRef,offset:["start start","end start"]});
  const heroY=useTransform(scrollYProgress,[0,1],["0%","15%"]);
  const heroOpacity=useTransform(scrollYProgress,[0,0.6,1],[1,0.2,0]);

  const BOOT_LINES=[{t:"▸ AURA URBAN RISK ANALYTICS v0.1-beta",c:"acc"},{t:"▸ Establishing satellite uplink...",c:"dim"},{t:"▸ Connecting to Databricks cluster...",c:"dim"},{t:"▸ Loading 847,214 indexed records...",c:"dim"},{t:"▸ Calibrating GPT-4o risk models...",c:"dim"},{t:"▸ SELECT-only guardrails enforced ✓",c:"ok"},{t:"▸ Encryption layer active ✓",c:"ok"},{t:"▸ System ready. Welcome.",c:"acc"}];
  const PLACEHOLDERS=["Which grocery stores are in dangerous ZIP codes?","Show me the safest neighborhoods in Phoenix...","Where should I avoid opening a new store?","Compare crime rates between ZIP 85031 and 85034..."];
  const WARNINGS=[{Icon:AlertTriangle,text:"Queries may misfire or return unexpected results"},{Icon:Clock,text:"First query may be slow — cluster spinning up"},{Icon:FlaskConical,text:"Experimental AI — not for policy or law enforcement"},{Icon:RefreshCw,text:"Data is indexed, not a live feed"},{Icon:Flame,text:"Expect bugs. We're fixing them in real time."}];
  const EXAMPLES=["Which grocery stores are in the most dangerous ZIP codes?","Show the top 5 highest risk locations in Phoenix","Which areas have the lowest crime for safe transit?","Find stores with high population but low crime scores"];
  const FAQS=[{q:"How does AURA generate answers from plain English?",a:"AURA uses GPT-4o-mini to translate your natural language question into a precise SQL query, then runs it against our Databricks cluster with 847K+ real crime records."},{q:"What data sources does AURA use?",a:"AURA indexes crime totals, population data, grocery store locations, SNAP retailer data, social vulnerability indices, and census information — all focused on the Phoenix metropolitan area."},{q:"Is my query data stored or shared?",a:"No. Queries are processed in real-time and not stored. SELECT-only SQL guardrails are enforced, meaning AURA can never modify any database."},{q:"Can I trust the risk scores for real decisions?",a:"AURA is an experimental research tool. The 0–100 risk scores are normalized from real data but should not be used for law enforcement, policy, or operational decisions."}];

  const mobile=isMobile&&!forceDesktop;

  useEffect(()=>{const c=()=>setIsMobile(window.innerWidth<1024);c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c);},[]);
  useEffect(()=>{if(phase!=="app")return;const iv=setInterval(()=>{const t=PLACEHOLDERS[placeholderIdx.current];if(charIdx.current<=t.length){setTypedPlaceholder(t.slice(0,charIdx.current));charIdx.current++;}else{setTimeout(()=>{charIdx.current=0;placeholderIdx.current=(placeholderIdx.current+1)%PLACEHOLDERS.length;},2400);}},52);return()=>clearInterval(iv);},[phase]);
  useEffect(()=>{let i=0;const t=setInterval(()=>{i++;setBootLine(i);if(i>=BOOT_LINES.length){clearInterval(t);setTimeout(()=>{setPhase("disclaimer");setTimeout(()=>setDisclaimerIn(true),80);},700);}},200);return()=>clearInterval(t);},[]);
  useEffect(()=>{if(phase==="disclaimer"&&disclaimerIn){const t=setTimeout(()=>setAcceptPulse(true),1800);return()=>clearTimeout(t);}},[phase,disclaimerIn]);
  useEffect(()=>{feedRef.current?.scrollTo({top:feedRef.current.scrollHeight,behavior:"smooth"});},[messages]);

  useEffect(()=>{if(phase!=="app"||!mapVisible||!mapRef.current||leafletMap.current)return;const init=async()=>{if(!document.getElementById("leaflet-css")){const l=document.createElement("link");l.id="leaflet-css";l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);}if(!(window as any).L){await new Promise<void>(r=>{const s=document.createElement("script");s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=()=>r();document.head.appendChild(s);});}const L=(window as any).L;if(!mapRef.current||leafletMap.current)return;const map=L.map(mapRef.current,{center:[33.4484,-112.0740],zoom:10,zoomControl:true,attributionControl:false});L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(map);markersLayer.current=L.layerGroup().addTo(map);leafletMap.current=map;if(mapResults.length>0)updateMapMarkers(map,L,mapResults);};init();},[phase,mapVisible]);
  useEffect(()=>{if(!leafletMap.current||!(window as any).L)return;updateMapMarkers(leafletMap.current,(window as any).L,mapResults);},[mapResults]);

  function updateMapMarkers(map:any,L:any,results:any[]){if(!markersLayer.current)return;markersLayer.current.clearLayers();const pts:any[]=[];results.forEach(item=>{const zip=String(item.zip_code||"").trim();const coords=getZipCoords(zip);if(!coords)return;const r=riskOf(item.priority_score);const icon=L.divIcon({className:"",html:`<div style="position:relative;width:32px;height:32px;"><div style="position:absolute;inset:0;border-radius:50%;background:${r.c}22;border:1.5px solid ${r.c};animation:ping 2s ease-out infinite;"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:${r.c};box-shadow:0 0 10px ${r.c};"></div></div>`,iconSize:[32,32],iconAnchor:[16,16]});const marker=L.marker(coords,{icon});marker.bindPopup(`<div style="background:rgba(15,23,42,.9);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px;font-family:'Inter',sans-serif;color:#fff;min-width:200px;backdrop-filter:blur(16px);"><div style="font-size:10px;letter-spacing:1px;color:${r.c};margin-bottom:8px;text-transform:uppercase;font-weight:700;">● ${r.l}</div><div style="font-weight:600;font-size:15px;margin-bottom:4px;color:#fff;">${item.store_name||`ZIP ${zip}`}</div><div style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:16px;">ZIP ${zip}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div><div style="font-size:10px;color:rgba(255,255,255,.4);letter-spacing:1px;text-transform:uppercase;font-weight:600;margin-bottom:4px;">Crimes</div><div style="color:#e2e8f0;font-weight:600;font-size:16px;">${(item.total_crimes??0).toLocaleString()}</div></div><div><div style="font-size:10px;color:rgba(255,255,255,.4);letter-spacing:1px;text-transform:uppercase;font-weight:600;margin-bottom:4px;">Risk</div><div style="color:${r.c};font-weight:600;font-size:16px;">${item.priority_score??"N/A"}</div></div></div></div>`,{className:"aura-popup"});markersLayer.current.addLayer(marker);pts.push(coords);});if(pts.length>0){try{map.fitBounds(L.latLngBounds(pts),{padding:[40,40],maxZoom:13});}catch(e){}}}

  function handleAccept(){setDisclaimerExit(true);setTimeout(()=>{setPhase("exit");setTimeout(()=>setPhase("app"),600);},400);}
  
  const riskOf=(s:number)=>s>=50?{c:"#ef4444",bg:"rgba(239,68,68,.05)",l:"CRITICAL"}:s>=20?{c:"#f59e0b",bg:"rgba(245,158,11,.05)",l:"ELEVATED"}:{c:"#06b6d4",bg:"rgba(6,182,212,.05)",l:"NOMINAL"};

  async function fire(){if(!question.trim()||loading)return;const q=question.trim();if(!hasToasted.current){hasToasted.current=true;setToastPhase("crack");setTimeout(()=>setToastPhase("open"),600);setTimeout(()=>setToastPhase("closing"),8500);setTimeout(()=>setToastPhase("hidden"),9000);}setQueryCount(c=>c+1);setMessages(p=>[...p,{role:"user",content:q}]);setLoading(true);setQuestion("");try{const res=await fetch("/api/query",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});const data=await res.json();setMessages(p=>[...p,{role:"assistant",results:data.results,answer:data.answer}]);if(data.results?.length>0){const avg=data.results.reduce((a:number,r:any)=>a+(r.priority_score||0),0)/data.results.length;setAmbientRisk(avg>=50?"critical":avg>=20?"elevated":"nominal");const wc=data.results.filter((r:any)=>getZipCoords(String(r.zip_code||"").trim()));if(wc.length>0){setMapResults(data.results);setMapVisible(true);setTimeout(()=>document.getElementById("aura-map")?.scrollIntoView({behavior:"smooth",block:"center"}),500);}}}catch(e){console.error(e);}finally{setLoading(false);}}

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:globalStyles}}/>

      {/* ═══ BOOT ═══ */}
      {phase==="boot"&&(<div className="boot-in" style={{position:"fixed",inset:0,background:"#020617",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}><div style={{width:"min(560px,92vw)",background:"rgba(15,23,42,.8)",border:"1px solid rgba(255,255,255,.05)",borderRadius:16,overflow:"hidden"}}><div style={{padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:10}}><div style={{display:"flex",gap:7}}>{["#ef4444","#f59e0b","#06b6d4"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,opacity:.8}}/>)}</div><span style={{fontSize:11,color:"rgba(255,255,255,.5)",letterSpacing:".1em",textTransform:"uppercase",fontWeight:600}}>aura — system init</span><span style={{marginLeft:"auto",fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:".1em"}}>v0.1-beta</span></div><div style={{padding:28,minHeight:240}}>{BOOT_LINES.slice(0,bootLine).map((line,i)=>(<div key={i} className="bl" style={{fontSize:13,lineHeight:2.2,color:line.c==="ok"?"#06b6d4":line.c==="acc"?"rgba(255,255,255,.9)":"rgba(255,255,255,.4)",display:"flex",alignItems:"center",gap:8}}>{line.t}{i===bootLine-1&&<span className="bk" style={{color:"rgba(255,255,255,.5)"}}>█</span>}</div>))}</div><div style={{padding:"0 28px 24px"}}><div style={{height:2,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:(bootLine/BOOT_LINES.length*100)+"%",background:"#6366f1",borderRadius:2,transition:"width .2s ease-out"}}/></div></div></div></div>)}

      {/* ═══ DISCLAIMER ═══ */}
      {phase==="disclaimer"&&(<div style={{position:"fixed",inset:0,background:"#020617",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,padding:20}}><div className={disclaimerExit?"disc-out":disclaimerIn?"disc-in":""} style={{width:"min(600px,96vw)",maxHeight:"92vh",overflowY:"auto",background:"rgba(15,23,42,.8)",borderRadius:20,border:"1px solid rgba(255,255,255,.05)",boxShadow:"0 20px 40px rgba(0,0,0,.5)"}}><div className="scan"/><div style={{padding:"14px 26px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:10}}><div style={{display:"flex",gap:7}}>{["#ef4444","#f59e0b","#06b6d4"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,opacity:.8}}/>)}</div><span style={{fontSize:11,color:"rgba(255,255,255,.5)",letterSpacing:".1em",textTransform:"uppercase",fontWeight:600}}>Beta Access</span></div><div style={{padding:"36px 40px 34px"}}><div style={{marginBottom:28}}><p style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"#6366f1",fontWeight:700,marginBottom:12}}>Beta Access Program</p><h2 style={{fontSize:32,fontWeight:700,color:"#fff",letterSpacing:"-0.02em"}}>Before You Enter AURA</h2></div><p style={{fontSize:15,lineHeight:1.7,color:"rgba(255,255,255,.7)",marginBottom:26,paddingBottom:26,borderBottom:"1px solid rgba(255,255,255,.05)"}}>AURA is an experimental AI-powered urban risk platform. Provided as-is for research and exploration only.</p><div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>{WARNINGS.map((w,i)=>(<div key={i} className="wi void-glass" style={{animationDelay:`${i*50+150}ms`,display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:12}}><w.Icon size={18} style={{opacity:.8,color:"#6366f1",flexShrink:0}}/><span style={{fontSize:14,color:"rgba(255,255,255,.8)"}}>{w.text}</span></div>))}</div><div style={{padding:"14px 18px",background:"rgba(255,255,255,.02)",borderRadius:12,marginBottom:26,border:"1px solid rgba(255,255,255,.05)"}}><p style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.7}}>NOT FOR: law enforcement · policy decisions · operational planning · public safety determinations.</p></div><button onClick={handleAccept} className={`void-glass-solid pro-hover${acceptPulse?" btn-pulse":""}`} style={{width:"100%",padding:18,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10,borderRadius:100,color:"#fff",cursor:"pointer",fontWeight:600}}>I understand — enter AURA Beta <ArrowRight size={16}/></button></div></div></div>)}

      {/* ══════════════════════ MAIN APP ══════════════════════ */}
      {phase==="app"&&(<div className="app-in" style={{minHeight:"100vh",background:"transparent",position:"relative",overflowX:"hidden"}}>
        
        {/* Dynamic Space Void */}
        <div className="void-stars layer-1" />
        <div className="void-stars layer-2" />

        {/* Ambient Risk Glow */}
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",transition:"background 2s ease",background:ambientRisk==="critical"?"radial-gradient(ellipse at 50% 0%,rgba(239,68,68,.04) 0%,transparent 60%)":ambientRisk==="elevated"?"radial-gradient(ellipse at 50% 0%,rgba(245,158,11,.03) 0%,transparent 60%)":ambientRisk==="nominal"?"radial-gradient(ellipse at 50% 0%,rgba(6,182,212,.03) 0%,transparent 60%)":"transparent"}}/>

        {/* NAV */}
        <motion.nav initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.6, ease: customEase}} style={{position:"fixed",top:mobile?0:24,left:0,right:0,zIndex:100,padding:mobile?"0 16px":"16px 32px"}}><div style={{maxWidth:1600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}><button className="void-glass-solid pro-hover" style={{borderRadius:"50%",padding:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Orbit size={20} color="#fff"/></button>{!mobile&&(<div className="void-glass-solid" style={{borderRadius:100,padding:"8px 8px 8px 32px",display:"flex",alignItems:"center",gap:32}}>{[["How It Works","#guide"],["Terminal","#terminal"],["System","#system"],["About","#about"]].map(([l,h])=>(<a key={l} href={h} style={{fontSize:13,color:"rgba(255,255,255,.6)",letterSpacing:".02em",fontWeight:500,transition:"color .2s"}} onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.6)")}>{l}</a>))}<a href="#terminal"><button className="void-glass-solid pro-hover" style={{color:"#fff",background:"#6366f1",padding:"10px 24px",borderRadius:100,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,border:"none"}}>Get Started <ArrowUpRight size={14}/></button></a></div>)}<div style={{display:"flex",alignItems:"center",gap:12}}>{queryCount>0&&<motion.div initial={{scale:0}} animate={{scale:1}} className="void-glass-solid" style={{fontSize:11,color:"#06b6d4",padding:"6px 14px",borderRadius:100,letterSpacing:".1em",fontWeight:600}}>{queryCount}Q</motion.div>}{mobile&&(<button onClick={()=>setMenuOpen(o=>!o)} className="void-glass-solid pro-hover" style={{width:44,height:44,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",padding:0}}><span style={{display:"block",width:18,height:1.5,background:"#fff",borderRadius:1,transform:menuOpen?"rotate(45deg) translate(3px,3px)":"none",transition:"all .25s"}}/><span style={{display:"block",width:18,height:1.5,background:"#fff",borderRadius:1,opacity:menuOpen?0:1,transition:"all .25s"}}/><span style={{display:"block",width:18,height:1.5,background:"#fff",borderRadius:1,transform:menuOpen?"rotate(-45deg) translate(3px,-3px)":"none",transition:"all .25s"}}/></button>)}</div></div></motion.nav>

        {mobile&&menuOpen&&(<div className="mobile-menu void-glass-solid" style={{position:"fixed",top:56,left:0,right:0,zIndex:99,padding:"24px",borderRadius:"0 0 24px 24px"}}>{[["How It Works","#guide"],["Terminal","#terminal"],["System","#system"],["About","#about"]].map(([l,h])=>(<a key={l} href={h} onClick={()=>setMenuOpen(false)} style={{display:"block",padding:"18px 0",fontSize:20,fontWeight:600,color:"rgba(255,255,255,.8)",borderBottom:"1px solid rgba(255,255,255,.05)"}}>{l}</a>))}<a href="#terminal" onClick={()=>setMenuOpen(false)} style={{display:"block",marginTop:24}}><button className="void-glass-solid pro-hover" style={{width:"100%",padding:18,fontSize:15,fontWeight:600,color:"#fff",background:"#6366f1",borderRadius:100,cursor:"pointer"}}>Try It Now →</button></a></div>)}

        <main>
          {/* HERO */}
          <section style={{position:"relative",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <motion.div style={{position:"absolute",inset:0,y:heroY,opacity:heroOpacity, zIndex: 0}}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <iframe src="https://www.youtube.com/embed/3oWtQLRN_Zc?autoplay=1&mute=1&controls=0&loop=1&playlist=3oWtQLRN_Zc&modestbranding=1&rel=0&disablekb=1&playsinline=1&vq=hd2160" style={{position:"absolute",top:"50%",left:"50%",width:"100vw",height:"100vh",minWidth:"177.77vh",minHeight:"56.25vw",transform:"translate(-50%, -50%) scale(1.15)",border:"none"}} allow="autoplay; encrypted-media" />
              </div>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(2,6,23,0.7) 0%, rgba(2,6,23,0.9) 70%, #020617 100%)"}}/>
            </motion.div>

            <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 24px",maxWidth:900,margin:"0 auto",marginTop:mobile?"40px":"0"}}>
              <Reveal direction="down" delay={0.1}>
                <div className="void-glass" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:100,marginBottom:32,border:"1px solid rgba(99,102,241,0.3)"}}>
                  <Sparkles size={14} style={{color:"#818cf8"}}/>
                  <span style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"#c7d2fe",fontWeight:600}}>Urban Risk Intelligence</span>
                </div>
              </Reveal>
              <BlurText text="Venture Past The Noise Across Your City" className="" delay={0.2}/>
              <style>{`section:first-of-type > div:last-child > div:nth-child(2){font-size:${mobile?"clamp(38px,10vw,48px)":"clamp(48px,6vw,76px)"};line-height:1.05;letter-spacing:-0.03em;color:#fff;font-weight:700;margin-bottom:28px;text-wrap:balance;justify-content:center}`}</style>
              <Reveal direction="up" delay={0.3}>
                <p style={{fontSize:mobile?16:19,lineHeight:1.7,color:"rgba(255,255,255,.6)",maxWidth:560,margin:"0 auto 48px",fontWeight:400}}>Type what you want to know — <em className="text-gradient-teal" style={{fontStyle:"normal",fontWeight:600}}>"Which stores are in dangerous areas?"</em> — AURA pulls live data to answer instantly.</p>
              </Reveal>
              <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
                <Reveal direction="left" delay={0.4}>
                  <a href="#terminal"><button className="void-glass-solid pro-hover" style={{padding:"16px 36px",borderRadius:100,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:"#6366f1",border:"none",boxShadow:"0 10px 30px rgba(99,102,241,0.3)"}}>Deploy Your Query <ArrowUpRight size={16}/></button></a>
                </Reveal>
                <Reveal direction="right" delay={0.5}>
                  <a href="#guide"><button className="void-glass pro-hover" style={{padding:"16px 32px",borderRadius:100,color:"#fff",fontSize:15,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}><Play size={16}/> How It Works</button></a>
                </Reveal>
              </div>
            </div>
          </section>

          {/* TERMINAL (MOVED UP FOR PRODUCT FOCUS) */}
          <section id="terminal" style={{padding:mobile?"40px 24px 80px":"40px 48px 130px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
            <Reveal direction="up">
              <div className="void-glass-solid" style={{display:"flex",flexDirection:"column",height:mobile?"75vh":"75vh",borderRadius:24,position:"relative",overflow:"hidden",border:"1px solid rgba(255,255,255,.1)"}}>
                {loading&&<div className="sw"/>}
                <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,background:"rgba(2,6,23,.5)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{display:"flex",gap:6}}>{["#ef4444","#f59e0b","#10b981"].map((c,i)=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:c,opacity:.8}}/>)}</div>
                    <span style={{fontSize:12,color:"rgba(255,255,255,.5)",letterSpacing:".05em",fontWeight:500,marginLeft:8}}>aura / risk_terminal</span>
                  </div>
                  <span style={{fontSize:11,letterSpacing:".15em",color:loading?"rgba(255,255,255,.4)":"#06b6d4",textTransform:"uppercase",fontWeight:600}}>{loading?<>Computing<span className="bk">_</span></>:<>Ready<span className="bk">_</span></>}</span>
                </div>
                
                <div ref={feedRef} style={{flex:1,overflowY:"auto",padding:mobile?"20px":"32px",display:"flex",flexDirection:"column",gap:24}}>
                  {messages.length===0&&(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,opacity:.4}}><Terminal size={32} color="#6366f1"/><p style={{fontSize:13,letterSpacing:".1em",textTransform:"uppercase",fontWeight:500,textAlign:"center",color:"#fff"}}>Awaiting Query Parameter</p><div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8,maxWidth:600,marginTop:16}}>{EXAMPLES.map((ex,i)=><div key={i} onClick={()=>{setQuestion(ex);}} style={{fontSize:12,padding:"8px 16px",borderRadius:100,border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",color:"rgba(255,255,255,.6)",transition:"all .2s"}} className="pro-hover">{ex}</div>)}</div></div>)}
                  {messages.map((msg,i)=>{
                    if(msg.role==="user")return(<div key={i} className="mr" style={{display:"flex",justifyContent:"flex-end"}}><div className="void-glass" style={{maxWidth:mobile?"85%":"60%",padding:"16px 24px",borderRadius:"24px 24px 6px 24px",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)"}}><p style={{fontSize:10,letterSpacing:".15em",color:"#818cf8",marginBottom:8,textTransform:"uppercase",fontWeight:600}}>User Query</p><p style={{fontSize:15,color:"#fff",lineHeight:1.6}}>{msg.content}</p></div></div>);
                    return(<div key={i} className="ml" style={{display:"flex",flexDirection:"column",gap:16}}>
                      {msg.answer&&(<div className="report-in void-glass" style={{padding:"24px 28px",borderLeft:"3px solid #06b6d4",borderRadius:"6px 24px 24px 24px",background:"rgba(2,6,23,.6)"}}><p style={{fontSize:10,letterSpacing:".15em",color:"#06b6d4",marginBottom:12,textTransform:"uppercase",fontWeight:700}}>AURA Intelligence</p><p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,.8)",fontWeight:400}}>{msg.answer}</p></div>)}
                      {msg.results?.length>0&&(<div style={{display:"flex",gap:16,overflowX:"auto",paddingBottom:12}}>{msg.results.map((store:any,j:number)=>{const r=riskOf(store.priority_score);return(<div key={j} className={`ex${Math.min(j,7)} void-glass-solid pro-hover`} style={{minWidth:260,flexShrink:0,padding:24,borderRadius:20,borderTop:`3px solid ${r.c}`}}><div style={{fontSize:10,letterSpacing:".15em",color:r.c,marginBottom:16,display:"flex",alignItems:"center",gap:8,textTransform:"uppercase",fontWeight:700}}><div style={{width:8,height:8,borderRadius:"50%",background:r.c}}/>{r.l}</div><p style={{fontSize:18,fontWeight:600,color:"#fff",marginBottom:6,lineHeight:1.3}}>{store.store_name||`ZIP ${store.zip_code}`}</p><p style={{fontSize:13,color:"rgba(255,255,255,.4)",letterSpacing:".05em",marginBottom:24}}>{store.city?.trim()||"UNKNOWN"} · AZ {store.zip_code}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}><div><p style={{fontSize:10,letterSpacing:".1em",color:"rgba(255,255,255,.4)",marginBottom:6,textTransform:"uppercase",fontWeight:600}}>Crimes</p><p style={{fontWeight:700,fontSize:24,color:"#ef4444"}}>{(store.total_crimes||0).toLocaleString()}</p></div><div><p style={{fontSize:10,letterSpacing:".1em",color:"rgba(255,255,255,.4)",marginBottom:6,textTransform:"uppercase",fontWeight:600}}>Pop.</p><p style={{fontWeight:600,fontSize:24,color:"#fff"}}>{(store.population||0).toLocaleString()}</p></div></div><div style={{fontSize:10,letterSpacing:".1em",color:"rgba(255,255,255,.5)",display:"flex",justifyContent:"space-between",marginBottom:10,textTransform:"uppercase",fontWeight:600}}><span>Score</span><span style={{color:r.c,fontWeight:700,fontSize:16}}>{store.priority_score}/100</span></div><div style={{height:4,background:"rgba(255,255,255,.1)",borderRadius:2,overflow:"hidden"}}><div className="fb" style={{height:"100%",width:Math.min(100,store.priority_score)+"%",background:r.c,borderRadius:2}}/></div></div>);})}</div>)}
                    </div>);
                  })}
                  {loading&&(<div className="ml" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0"}}><div style={{display:"flex",gap:6}}>{[1,2,3].map(n=><div key={n} className={`d${n}`} style={{width:8,height:8,borderRadius:"50%",background:"#6366f1"}}/>)}</div><span style={{fontSize:11,letterSpacing:".15em",color:"rgba(255,255,255,.5)",textTransform:"uppercase",fontWeight:600}}>Processing Data...</span></div>)}
                </div>
                <div style={{borderTop:"1px solid rgba(255,255,255,.05)",padding:"20px 24px",display:"flex",gap:14,alignItems:"center",flexShrink:0,background:"rgba(2,6,23,.5)"}}>
                  <input className="inp" style={{flex:1,background:"transparent",border:"none",color:"#fff",fontSize:16,fontWeight:400,caretColor:"#6366f1",outline:"none"}} placeholder={typedPlaceholder+"█"} value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fire()} />
                  <button className="void-glass-solid pro-hover" onClick={fire} disabled={loading||!question.trim()} style={{background:loading||!question.trim()?"rgba(255,255,255,.05)":"#fff",color:loading||!question.trim()?"rgba(255,255,255,.3)":"#020617",padding:"14px 28px",borderRadius:100,fontSize:14,fontWeight:600,flexShrink:0,cursor:loading||!question.trim()?"not-allowed":"pointer",border:"none"}}>{loading?"...":"Send"}</button>
                </div>
              </div>
            </Reveal>
            {mapVisible&&(<Reveal direction="up"><div id="aura-map" className="map-in void-glass-solid" style={{marginTop:24,borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,.1)"}}><div style={{padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(2,6,23,.5)"}}><div style={{display:"flex",alignItems:"center",gap:12}}><MapPin size={18} style={{color:"#06b6d4"}}/><span style={{fontSize:12,fontWeight:600,color:"#fff",letterSpacing:".15em",textTransform:"uppercase"}}>Risk Topography</span><span style={{fontSize:11,color:"rgba(255,255,255,.7)",padding:"4px 12px",borderRadius:100,background:"rgba(255,255,255,.05)",fontWeight:500}}>{mapResults.length} vectors</span></div><div style={{display:"flex",gap:16}}>{[["#ef4444","Critical"],["#f59e0b","Elevated"],["#06b6d4","Nominal"]].map(([c,l])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:"50%",background:c}}/><span style={{fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:".05em",textTransform:"uppercase",fontWeight:600}}>{l}</span></div>))}</div></div><div ref={mapRef} style={{height:mobile?350:500,width:"100%",background:"transparent"}}/></div></Reveal>)}
          </section>

          {/* BENTO GRID RESTRUCTURE (FEATURES + SYSTEM + HOW IT WORKS) */}
          <section id="guide" style={{padding:mobile?"40px 24px":"60px 48px",maxWidth:1200,margin:"0 auto"}}>
            <Reveal direction="down"><h2 style={{fontSize:mobile?32:48,fontWeight:700,letterSpacing:"-0.02em",color:"#fff",marginBottom:16}}>The Intelligence Architecture</h2></Reveal>
            <Reveal direction="up"><p style={{fontSize:17,color:"rgba(255,255,255,.6)",marginBottom:48,maxWidth:600,lineHeight:1.6}}>AURA merges GPT-4o natural language understanding with direct, secure access to Databricks clusters.</p></Reveal>

            <div className="bento-grid">
              
              {/* Box 1: Wide AI Language */}
              <Reveal direction="left" fill className="col-span-12 lg:col-span-8">
                <div className="void-glass-solid pro-hover" style={{height:"100%",borderRadius:32,padding:mobile?32:48,display:"flex",flexDirection:"column",justifyContent:"space-between",backgroundImage:`linear-gradient(to right, rgba(2,6,23,0.9), rgba(2,6,23,0.7)), url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop')`,backgroundSize:"cover",backgroundPosition:"center"}}>
                  <div style={{width:56,height:56,borderRadius:16,background:"rgba(99,102,241,.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:40,border:"1px solid rgba(99,102,241,.3)"}}><Search size={24} color="#818cf8"/></div>
                  <div>
                    <h3 style={{fontSize:28,fontWeight:700,color:"#fff",marginBottom:12,letterSpacing:"-0.01em"}}>Natural Language SQL</h3>
                    <p style={{fontSize:16,color:"rgba(255,255,255,.7)",lineHeight:1.6,maxWidth:400}}>Ask anything in plain English. AURA deterministically translates queries to precise SELECT-only statements with zero hallucination.</p>
                  </div>
                </div>
              </Reveal>

              {/* Box 2: Square Databricks */}
              <Reveal direction="right" fill className="col-span-12 lg:col-span-4">
                <div className="void-glass-solid pro-hover" style={{height:"100%",borderRadius:32,padding:mobile?32:40,display:"flex",flexDirection:"column"}}>
                  <div style={{width:56,height:56,borderRadius:16,background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"auto",border:"1px solid rgba(255,255,255,.1)"}}><Database size={24} color="#fff"/></div>
                  <div style={{marginTop:40}}>
                    <h3 style={{fontSize:24,fontWeight:700,color:"#fff",marginBottom:10,letterSpacing:"-0.01em"}}>847K+ Records</h3>
                    <p style={{fontSize:15,color:"rgba(255,255,255,.6)",lineHeight:1.6}}>Direct Databricks cluster connection mapping crime, census, and vulnerability data.</p>
                  </div>
                </div>
              </Reveal>

              {/* Box 3: Square Mapping */}
              <Reveal direction="left" fill className="col-span-12 lg:col-span-4">
                <div className="void-glass-solid pro-hover" style={{height:"100%",borderRadius:32,padding:mobile?32:40,display:"flex",flexDirection:"column"}}>
                  <div style={{width:56,height:56,borderRadius:16,background:"rgba(6,182,212,.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"auto",border:"1px solid rgba(6,182,212,.3)"}}><MapPin size={24} color="#22d3ee"/></div>
                  <div style={{marginTop:40}}>
                    <h3 style={{fontSize:24,fontWeight:700,color:"#fff",marginBottom:10,letterSpacing:"-0.01em"}}>Live Topography</h3>
                    <p style={{fontSize:15,color:"rgba(255,255,255,.6)",lineHeight:1.6}}>Results are instantly geocoded and pinned on interactive dark-mode satellite maps.</p>
                  </div>
                </div>
              </Reveal>

              {/* Box 4: Wide Real-time */}
              <Reveal direction="right" fill className="col-span-12 lg:col-span-8">
                <div className="void-glass-solid pro-hover" style={{height:"100%",borderRadius:32,padding:mobile?32:48,display:"flex",flexDirection:"column",justifyContent:"space-between",backgroundImage:`linear-gradient(to left, rgba(2,6,23,0.95), rgba(2,6,23,0.6)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop')`,backgroundSize:"cover",backgroundPosition:"center"}}>
                  <div style={{width:56,height:56,borderRadius:16,background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:40,border:"1px solid rgba(255,255,255,.1)"}}><BarChart3 size={24} color="#fff"/></div>
                  <div>
                    <h3 style={{fontSize:28,fontWeight:700,color:"#fff",marginBottom:12,letterSpacing:"-0.01em"}}>Dynamic Risk Scoring</h3>
                    <p style={{fontSize:16,color:"rgba(255,255,255,.7)",lineHeight:1.6,maxWidth:400}}>Every query normalizes crime and population density in real-time, auto-classifying locations from Nominal to Critical risk.</p>
                  </div>
                </div>
              </Reveal>

            </div>
          </section>

          {/* FAQ */}
          <section id="faq" style={{padding:mobile?"80px 24px":"130px 48px",maxWidth:750,margin:"0 auto"}}><Reveal direction="down"><h2 style={{fontSize:mobile?32:44,fontWeight:700,letterSpacing:"-0.02em",color:"#fff",textAlign:"center",marginBottom:56}}>Common Inquiries</h2></Reveal><div style={{display:"flex",flexDirection:"column",gap:16}}>{FAQS.map((faq,i)=>(<Reveal key={i} delay={i*.05} direction="up"><button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="void-glass pro-hover" style={{borderRadius:20,padding:"26px 32px",width:"100%",textAlign:"left",cursor:"pointer",color:"#fff"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><h3 style={{fontSize:16,fontWeight:600,paddingRight:20,color:"#e2e8f0"}}>{faq.q}</h3><motion.div animate={{rotate:openFaq===i?180:0}} transition={{duration:.3, ease:"easeOut"}}><ChevronDown size={20} style={{color:"rgba(255,255,255,.4)",flexShrink:0}}/></motion.div></div><AnimatePresence>{openFaq===i&&(<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.3, ease:"easeOut"}} style={{overflow:"hidden"}}><p style={{color:"rgba(255,255,255,.5)",lineHeight:1.7,marginTop:20,fontSize:15,fontWeight:400}}>{faq.a}</p></motion.div>)}</AnimatePresence></button></Reveal>))}</div></section>

          {/* ABOUT / BUILDER */}
          <section id="about" style={{padding:mobile?"40px 24px 80px":"60px 48px 130px",maxWidth:1000,margin:"0 auto"}}><Reveal direction="up"><div className="void-glass-solid" style={{padding:mobile?"40px 24px":"64px 64px",textAlign:"center",maxWidth:760,margin:"0 auto",borderRadius:32}}><div className="void-glass" style={{width:80,height:80,borderRadius:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,color:"#6366f1",margin:"0 auto 24px",border:"1px solid rgba(99,102,241,.3)"}}>Z</div><p style={{fontSize:24,fontWeight:700,color:"#fff",marginBottom:6}}>Zain Shah</p><p style={{fontSize:12,color:"rgba(255,255,255,.5)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:28,fontWeight:600}}>CS @ Arizona State University · Class of 2028</p><p style={{fontSize:16,lineHeight:1.8,color:"rgba(255,255,255,.7)",maxWidth:580,margin:"0 auto 36px",fontWeight:400}}>Sophomore CS student at ASU passionate about AI, data engineering, and building tools that make complex data accessible. AURA connects GPT-4o to real Databricks crime data.</p><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>{["Python","Next.js","TypeScript","Databricks","OpenAI API","React"].map(tag=>(<span key={tag} className="void-glass" style={{fontSize:12,color:"#fff",padding:"8px 16px",borderRadius:100,fontWeight:500}}>{tag}</span>))}</div><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}><a href="https://github.com/SikeTheMike" target="_blank" rel="noopener noreferrer"><button className="void-glass-solid pro-hover" style={{display:"flex",alignItems:"center",gap:10,padding:"16px 32px",borderRadius:100,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}><Github size={16}/> GitHub</button></a><a href="https://linkedin.com/in/zain-sahir-s-4b1a9a227" target="_blank" rel="noopener noreferrer"><button className="void-glass-solid pro-hover" style={{display:"flex",alignItems:"center",gap:10,padding:"16px 32px",borderRadius:100,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.3)"}}><Linkedin size={16}/> LinkedIn</button></a></div></div></Reveal></section>
        </main>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid rgba(255,255,255,.05)",padding:mobile?"40px 24px":"64px 48px",position:"relative",zIndex:2,background:"rgba(2,6,23,.8)",backdropFilter:"blur(24px)"}}><div style={{maxWidth:1600,margin:"0 auto"}}><div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"5fr 3fr 4fr",gap:mobile?40:64,marginBottom:56}}><div><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><Orbit size={24} color="#6366f1"/><span style={{fontSize:22,fontWeight:700,letterSpacing:"-0.02em",color:"#fff"}}>AURA</span></div><h3 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",color:"rgba(255,255,255,.6)",marginBottom:28}}>The city is calling</h3><div style={{display:"flex",gap:12}}><input type="email" placeholder="Enter your email" className="void-glass" style={{borderRadius:100,padding:"14px 24px",color:"#fff",flex:1,fontSize:14,outline:"none",fontWeight:400}}/><button className="void-glass-solid pro-hover" style={{color:"#fff",padding:"14px 28px",borderRadius:100,fontWeight:600,fontSize:14,cursor:"pointer"}}>Subscribe</button></div></div><div><p style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:24,fontWeight:600}}>Capabilities</p>{["Natural Language","Risk Scoring","Live Mapping","AI Analysis"].map(l=>(<p key={l} style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:14,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.6)"}>{l}</p>))}</div><div><p style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:24,fontWeight:600}}>Company</p>{["About Zain Shah","ASU Research","GitHub","Contact"].map(l=>(<p key={l} style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:14,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.6)"}>{l}</p>))}</div></div><div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:32,display:"flex",flexDirection:mobile?"column":"row",justifyContent:"space-between",alignItems:"center",gap:20}}><div style={{display:"flex",alignItems:"center",gap:24}}><span style={{fontSize:13,color:"rgba(255,255,255,.4)",fontWeight:400}}>© 2026 Zain Shah</span><span style={{fontSize:13,color:"rgba(255,255,255,.4)",cursor:"pointer"}}>Privacy</span><span style={{fontSize:13,color:"rgba(255,255,255,.4)",cursor:"pointer"}}>Terms</span></div><div style={{display:"flex",alignItems:"center",gap:20}}><span style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",fontWeight:600}}>Partners</span>{["Databricks","OpenAI","ASU"].map(p=>(<span key={p} style={{fontWeight:600,color:"rgba(255,255,255,.5)",fontSize:14}}>{p}</span>))}</div></div></div></footer>

        {/* VIEW TOGGLE */}
        <button className="void-glass-solid pro-hover" onClick={()=>setForceDesktop(f=>!f)} style={{position:"fixed",bottom:24,left:24,zIndex:500,width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{mobile?(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>):(<svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>)}</button>
      </div>)}

      {/* TOAST */}
      {toastPhase!=="hidden"&&(<div className={toastPhase==="closing"?"t-exit":"t-appear"} style={{position:"fixed",bottom:28,right:28,zIndex:9998,display:"flex",flexDirection:"column",alignItems:"flex-end",pointerEvents:"none"}}><div style={{marginBottom:8}}><div className={toastPhase==="crack"?"i-crack":"i-pop"} style={{width:44,height:44,borderRadius:14,background:"rgba(15,23,42,.9)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,.1)"}}><AlertTriangle size={20} style={{color:"#06b6d4"}}/></div></div>{(toastPhase==="open"||toastPhase==="closing")&&(<div className={toastPhase==="closing"?"t-rollup":"t-unroll"} style={{width:300,background:"rgba(2,6,23,.95)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"16px 4px 16px 16px",padding:"20px 24px",backdropFilter:"blur(24px)"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:6,height:6,borderRadius:"50%",background:"#06b6d4"}}/><span style={{fontSize:10,letterSpacing:".15em",color:"#06b6d4",textTransform:"uppercase",fontWeight:700}}>Heads Up · Beta</span></div><p style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,.7)",marginBottom:16,fontWeight:400}}>First couple of queries might be slow — AURA is spinning up its cluster.</p><div style={{fontSize:10,letterSpacing:".15em",color:"rgba(255,255,255,.4)",display:"flex",justifyContent:"space-between",textTransform:"uppercase",fontWeight:600}}><span>Automated Urban Risk Analytics</span><span>v0.1</span></div></div>)}</div>)}
    </>
  );
}