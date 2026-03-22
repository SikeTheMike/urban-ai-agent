"use client";

import { useState, useRef, useEffect } from "react";

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
function getZipCoords(zip:string):[number,number]|null{return ZIP_COORDS[zip]||null;}

export default function Chat() {
  const [question,setQuestion]=useState("");
  const [messages,setMessages]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);
  const [phase,setPhase]=useState<"boot"|"disclaimer"|"exit"|"app">("boot");
  const [bootLine,setBootLine]=useState(0);
  const [disclaimerIn,setDisclaimerIn]=useState(false);
  const [disclaimerExit,setDisclaimerExit]=useState(false);
  const [acceptPulse,setAcceptPulse]=useState(false);
  const [glitchActive,setGlitchActive]=useState(false);
  const [radarActive,setRadarActive]=useState(false);
  const [ambientRisk,setAmbientRisk]=useState<"neutral"|"critical"|"elevated"|"nominal">("neutral");
  const [mapResults,setMapResults]=useState<any[]>([]);
  const [mapVisible,setMapVisible]=useState(false);
  const [queryCount,setQueryCount]=useState(0);
  const [typedPlaceholder,setTypedPlaceholder]=useState("");
  const [isMobile,setIsMobile]=useState(false);
  const [forceDesktop,setForceDesktop]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const feedRef=useRef<HTMLDivElement>(null);
  const blobCanvasRef=useRef<HTMLCanvasElement>(null);
  const mapRef=useRef<HTMLDivElement>(null);
  const leafletMap=useRef<any>(null);
  const markersLayer=useRef<any>(null);
  const [toastPhase,setToastPhase]=useState<"hidden"|"crack"|"open"|"closing">("hidden");
  const hasToasted=useRef(false);
  const placeholderIdx=useRef(0);
  const charIdx=useRef(0);
  const animFrameRef=useRef<number>(0);

  const BOOT_LINES=[
    {t:"▸ AURA URBAN RISK ANALYTICS v0.1-beta",c:"acc"},
    {t:"▸ Establishing satellite uplink...",c:"dim"},
    {t:"▸ Connecting to Databricks cluster...",c:"dim"},
    {t:"▸ Loading 847,214 indexed records...",c:"dim"},
    {t:"▸ Calibrating GPT-4o risk models...",c:"dim"},
    {t:"▸ SELECT-only guardrails enforced ✓",c:"ok"},
    {t:"▸ Encryption layer active ✓",c:"ok"},
    {t:"▸ System ready. Welcome.",c:"acc"},
  ];

  const PLACEHOLDERS=[
    "Which grocery stores are in dangerous ZIP codes?",
    "Show me the safest neighborhoods in Phoenix...",
    "Where should I avoid opening a new store?",
    "Compare crime rates between ZIP 85031 and 85034...",
  ];

  const WARNINGS=[
    {icon:"⚠",text:"Queries may misfire or return unexpected results"},
    {icon:"⏱",text:"First query may be slow — cluster spinning up"},
    {icon:"🔬",text:"Experimental AI — not for policy or law enforcement"},
    {icon:"🔄",text:"Data is indexed, not a live feed"},
    {icon:"💥",text:"Expect bugs. We're fixing them in real time."},
  ];

  const EXAMPLES=[
    "Which grocery stores are in the most dangerous ZIP codes?",
    "Show the top 5 highest risk locations in Phoenix",
    "Which areas have the lowest crime for safe transit?",
    "Find stores with high population but low crime scores",
    "Compare crime density across different ZIP codes",
    "Which corridors need immediate safety infrastructure?",
  ];

  // Mobile detect
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);
  },[]);
  const mobile=isMobile&&!forceDesktop;

  // 3D drifting blob background — exactly like Sansara
  useEffect(()=>{
    if(phase!=="app")return;
    const canvas=blobCanvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    let W=window.innerWidth,H=window.innerHeight;
    canvas.width=W;canvas.height=H;
    const resize=()=>{W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H;};
    window.addEventListener("resize",resize);

    // Blob state — slow drifting volumes like Sansara
    type Blob={x:number;y:number;tx:number;ty:number;r:number;speed:number;hue:number;alpha:number;phase:number};
    const blobs:Blob[]=[
      {x:W*0.15,y:H*0.3,tx:W*0.25,ty:H*0.4,r:W*0.5,speed:0.0008,hue:270,alpha:0.18,phase:0},
      {x:W*0.7,y:H*0.2,tx:W*0.6,ty:H*0.35,r:W*0.45,speed:0.0006,hue:255,alpha:0.14,phase:1},
      {x:W*0.5,y:H*0.7,tx:W*0.4,ty:H*0.6,r:W*0.4,speed:0.001,hue:280,alpha:0.1,phase:2},
      {x:W*0.85,y:H*0.75,tx:W*0.75,ty:H*0.65,r:W*0.35,speed:0.0007,hue:240,alpha:0.08,phase:0.5},
    ];

    // Tiny particles
    const N=120;
    const particles=Array.from({length:N},()=>({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-0.5)*0.15,vy:(Math.random()-0.5)*0.1,
      r:Math.random()*1.2+0.2,
      alpha:Math.random()*0.4+0.05,
      pulse:Math.random()*Math.PI*2,
      ps:0.007+Math.random()*0.008,
    }));

    let t=0;
    const draw=()=>{
      t+=0.005;
      ctx.clearRect(0,0,W,H);

      // Deep dark background — Sansara slate-blue-dark
      const bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,"#080b14");
      bg.addColorStop(0.5,"#0a0e1c");
      bg.addColorStop(1,"#060912");
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

      // Render blobs with slow drift and morph
      blobs.forEach((b,i)=>{
        // Slowly interpolate toward target, then pick new target
        const speed=b.speed;
        b.x+=(b.tx-b.x)*speed;
        b.y+=(b.ty-b.y)*speed;
        if(Math.abs(b.tx-b.x)<2&&Math.abs(b.ty-b.y)<2){
          b.tx=W*(0.1+Math.random()*0.8);
          b.ty=H*(0.1+Math.random()*0.8);
        }

        // Pulsing radius
        const pr=b.r*(0.85+0.15*Math.sin(t*0.3+b.phase));

        // Radial gradient — soft purple/violet bloom
        const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,pr);
        const h=b.hue+(Math.sin(t*0.2+i)*15);
        g.addColorStop(0,`hsla(${h},65%,45%,${b.alpha})`);
        g.addColorStop(0.4,`hsla(${h},55%,35%,${b.alpha*0.5})`);
        g.addColorStop(1,"transparent");
        ctx.fillStyle=g;
        ctx.fillRect(0,0,W,H);
      });

      // Subtle vignette
      const vig=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.7);
      vig.addColorStop(0,"transparent");
      vig.addColorStop(1,"rgba(0,0,0,0.55)");
      ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);

      // Particles
      for(const p of particles){
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;
        if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        p.pulse+=p.ps;
        const a=p.alpha*(0.5+0.5*Math.sin(p.pulse));
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(180,160,255,${a})`;ctx.fill();
      }

      // Particle connections
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<90){
            ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle=`rgba(139,92,246,${0.07*(1-d/90)})`;ctx.lineWidth=0.5;ctx.stroke();
          }
        }
      }

      animFrameRef.current=requestAnimationFrame(draw);
    };
    animFrameRef.current=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(animFrameRef.current);window.removeEventListener("resize",resize);};
  },[phase]);

  // Typing placeholder
  useEffect(()=>{
    if(phase!=="app")return;
    const iv=setInterval(()=>{
      const target=PLACEHOLDERS[placeholderIdx.current];
      if(charIdx.current<=target.length){setTypedPlaceholder(target.slice(0,charIdx.current));charIdx.current++;}
      else{setTimeout(()=>{charIdx.current=0;placeholderIdx.current=(placeholderIdx.current+1)%PLACEHOLDERS.length;},2400);}
    },52);
    return()=>clearInterval(iv);
  },[phase]);

  // Glitch
  useEffect(()=>{
    if(phase!=="app")return;
    const iv=setInterval(()=>{setGlitchActive(true);setTimeout(()=>setGlitchActive(false),200);},8000);
    return()=>clearInterval(iv);
  },[phase]);

  // Boot
  useEffect(()=>{
    let i=0;const t=setInterval(()=>{
      i++;setBootLine(i);
      if(i>=BOOT_LINES.length){clearInterval(t);setTimeout(()=>{setPhase("disclaimer");setTimeout(()=>setDisclaimerIn(true),80);},700);}
    },200);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(phase==="disclaimer"&&disclaimerIn){const t=setTimeout(()=>setAcceptPulse(true),1800);return()=>clearTimeout(t);}
  },[phase,disclaimerIn]);

  // IO scroll reveal
  useEffect(()=>{
    if(phase!=="app")return;
    const run=()=>{
      const els=document.querySelectorAll("[data-reveal]:not(.revealed)");
      const obs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            const el=e.target as HTMLElement;
            setTimeout(()=>el.classList.add("revealed"),parseInt(el.dataset.delay||"0"));
            obs.unobserve(el);
          }
        });
      },{threshold:0.1,rootMargin:"0px 0px -40px 0px"});
      els.forEach(el=>obs.observe(el));return obs;
    };
    const obs=run();const t=setTimeout(()=>{obs.disconnect();run();},300);
    return()=>{obs.disconnect();clearTimeout(t);};
  },[phase,messages]);

  useEffect(()=>{feedRef.current?.scrollTo({top:feedRef.current.scrollHeight,behavior:"smooth"});},[messages]);

  // Leaflet
  useEffect(()=>{
    if(phase!=="app"||!mapVisible||!mapRef.current||leafletMap.current)return;
    const init=async()=>{
      if(!document.getElementById("leaflet-css")){const l=document.createElement("link");l.id="leaflet-css";l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);}
      if(!(window as any).L){await new Promise<void>(res=>{const s=document.createElement("script");s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=()=>res();document.head.appendChild(s);});}
      const L=(window as any).L;if(!mapRef.current||leafletMap.current)return;
      const map=L.map(mapRef.current,{center:[33.4484,-112.0740],zoom:10,zoomControl:true,attributionControl:false});
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(map);
      markersLayer.current=L.layerGroup().addTo(map);leafletMap.current=map;
      if(mapResults.length>0)updateMapMarkers(map,L,mapResults);
    };init();
  },[phase,mapVisible]);

  useEffect(()=>{
    if(!leafletMap.current||!(window as any).L)return;
    updateMapMarkers(leafletMap.current,(window as any).L,mapResults);
  },[mapResults]);

  function updateMapMarkers(map:any,L:any,results:any[]){
    if(!markersLayer.current)return;markersLayer.current.clearLayers();const pts:any[]=[];
    results.forEach(item=>{
      const zip=String(item.zip_code||"").trim();const coords=getZipCoords(zip);if(!coords)return;
      const r=riskOf(item.priority_score);
      const icon=L.divIcon({className:"",html:`<div style="position:relative;width:32px;height:32px;"><div style="position:absolute;inset:0;border-radius:50%;background:${r.c}22;border:1.5px solid ${r.c};animation:ping 1.5s ease-out infinite;"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:${r.c};box-shadow:0 0 10px ${r.c};"></div></div>`,iconSize:[32,32],iconAnchor:[16,16]});
      const marker=L.marker(coords,{icon});
      marker.bindPopup(`<div style="background:#0d0b1e;border:1px solid ${r.c}44;border-radius:12px;padding:12px 14px;font-family:'JetBrains Mono',monospace;color:#fff;min-width:180px;"><div style="font-size:8px;letter-spacing:2px;color:${r.c};margin-bottom:6px;">● ${r.l}</div><div style="font-weight:700;font-size:13px;margin-bottom:2px;">${item.store_name||`ZIP ${zip}`}</div><div style="font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:10px;">ZIP ${zip}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"><div><div style="font-size:8px;color:rgba(255,255,255,0.3);margin-bottom:2px;">CRIMES</div><div style="color:#a78bfa;font-weight:700;">${(item.total_crimes??0).toLocaleString()}</div></div><div><div style="font-size:8px;color:rgba(255,255,255,0.3);margin-bottom:2px;">RISK</div><div style="color:${r.c};font-weight:700;">${item.priority_score??'N/A'}</div></div></div></div>`,{className:"aura-popup"});
      markersLayer.current.addLayer(marker);pts.push(coords);
    });
    if(pts.length>0){try{map.fitBounds(L.latLngBounds(pts),{padding:[40,40],maxZoom:13});}catch(e){}}
  }

  function handleAccept(){setDisclaimerExit(true);setTimeout(()=>{setPhase("exit");setTimeout(()=>setPhase("app"),900);},650);}

  const riskOf=(s:number)=>
    s>=50?{c:"#f87171",bg:"rgba(248,113,113,0.07)",l:"CRITICAL"}
    :s>=20?{c:"#a78bfa",bg:"rgba(167,139,250,0.07)",l:"ELEVATED"}
    :{c:"#34d399",bg:"rgba(52,211,153,0.07)",l:"NOMINAL"};

  async function fire(){
    if(!question.trim()||loading)return;const q=question.trim();
    if(!hasToasted.current){hasToasted.current=true;setToastPhase("crack");setTimeout(()=>setToastPhase("open"),600);setTimeout(()=>setToastPhase("closing"),9500);setTimeout(()=>setToastPhase("hidden"),11200);}
    setRadarActive(true);setTimeout(()=>setRadarActive(false),3000);
    setQueryCount(c=>c+1);setMessages(p=>[...p,{role:"user",content:q}]);setLoading(true);setQuestion("");
    try{
      const res=await fetch("/api/query",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
      const data=await res.json();
      setMessages(p=>[...p,{role:"assistant",results:data.results,answer:data.answer}]);
      if(data.results?.length>0){
        const avg=data.results.reduce((a:number,r:any)=>a+(r.priority_score||0),0)/data.results.length;
        setAmbientRisk(avg>=50?"critical":avg>=20?"elevated":"nominal");
        const wc=data.results.filter((r:any)=>getZipCoords(String(r.zip_code||"").trim()));
        if(wc.length>0){setMapResults(data.results);setMapVisible(true);setTimeout(()=>document.getElementById("aura-map")?.scrollIntoView({behavior:"smooth",block:"center"}),700);}
      }
    }catch(e){console.error(e);}finally{setLoading(false);}
  }

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --bg:#080b14; --bg1:#0a0e1c; --bg2:#0d1226; --bg3:#111830; --bg4:#161e38;
      --p:#8b5cf6; --p2:#a78bfa; --p3:#c4b5fd; --p4:#ede9fe;
      --glow:rgba(139,92,246,0.45); --glow2:rgba(139,92,246,0.2); --glow3:rgba(139,92,246,0.08);
      --acc:#8b5cf6;
      --crit:#f87171; --elev:#a78bfa; --nom:#34d399;
      --w:#ffffff; --w80:rgba(255,255,255,0.8); --w60:rgba(255,255,255,0.6);
      --w40:rgba(255,255,255,0.4); --w20:rgba(255,255,255,0.2);
      --w08:rgba(255,255,255,0.08); --w04:rgba(255,255,255,0.04);
      --b:rgba(255,255,255,0.07); --b2:rgba(255,255,255,0.12);
      --purple-border:rgba(139,92,246,0.2);
      --mono:'JetBrains Mono',monospace; --sans:'Inter',sans-serif;
      --spring:cubic-bezier(0.16,1,0.3,1);
      --ease:cubic-bezier(0.4,0,0.2,1);
    }
    html,body,#__next,[data-nextjs-scroll-focus-boundary]{background:var(--bg)!important;color-scheme:dark!important;scroll-behavior:smooth;}
    body{overflow-x:hidden;font-family:var(--sans);color:var(--w);-webkit-font-smoothing:antialiased;}
    *,*::before,*::after{color-scheme:dark!important;}
    @media(prefers-color-scheme:light){html{background:var(--bg)!important;color:#fff!important;}}
    ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.4);border-radius:2px;}
    input,button,select,textarea{color-scheme:dark;background-color:transparent;}a{color:inherit;text-decoration:none;}

    /* ── SCROLL REVEAL ── */
    [data-reveal]{opacity:0;transform:translateY(48px);filter:blur(6px);transition:opacity 0.85s var(--spring),transform 0.85s var(--spring),filter 0.7s ease;}
    [data-reveal="fade"]{transform:translateY(20px);filter:blur(3px);}
    [data-reveal="scale"]{transform:scale(0.88) translateY(20px);}
    [data-reveal="left"]{transform:translateX(-40px) translateY(8px);}
    [data-reveal="right"]{transform:translateX(40px) translateY(8px);}
    [data-reveal].revealed{opacity:1!important;transform:none!important;filter:blur(0)!important;}
    [data-reveal-stagger]>*{opacity:0;transform:translateY(32px);filter:blur(4px);transition:opacity 0.7s var(--spring),transform 0.7s var(--spring),filter 0.6s ease;}
    [data-reveal-stagger].revealed>*:nth-child(1){transition-delay:0ms;}[data-reveal-stagger].revealed>*:nth-child(2){transition-delay:90ms;}
    [data-reveal-stagger].revealed>*:nth-child(3){transition-delay:180ms;}[data-reveal-stagger].revealed>*:nth-child(4){transition-delay:270ms;}
    [data-reveal-stagger].revealed>*:nth-child(5){transition-delay:360ms;}[data-reveal-stagger].revealed>*:nth-child(6){transition-delay:450ms;}
    [data-reveal-stagger].revealed>*{opacity:1;transform:none;filter:blur(0);}

    /* ── BOOT ── */
    @keyframes bIn{from{opacity:0}to{opacity:1}}
    @keyframes bOut{0%{opacity:1;transform:scale(1);filter:blur(0)}100%{opacity:0;transform:scale(1.06) translateY(-20px);filter:blur(16px)}}
    .boot-in{animation:bIn 0.4s ease forwards;}.boot-out{animation:bOut 0.9s var(--ease) forwards;}
    @keyframes lineIn{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
    .bl{animation:lineIn 0.22s var(--spring) forwards;}

    /* ── DISCLAIMER ── */
    @keyframes discIn{0%{opacity:0;transform:translateY(50px) scale(0.92);filter:blur(14px)}65%{opacity:1;transform:translateY(-3px) scale(1.005);filter:blur(0)}100%{opacity:1;transform:none}}
    @keyframes discOut{0%{opacity:1;transform:none}100%{opacity:0;transform:scale(1.1) translateY(-30px);filter:blur(16px)}}
    .disc-in{animation:discIn 0.8s var(--spring) forwards;}.disc-out{animation:discOut 0.7s var(--ease) forwards;}
    @keyframes warnIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
    .wi{animation:warnIn 0.45s var(--spring) both;}
    @keyframes scanPurple{0%{top:-1px;opacity:0}5%{opacity:1}95%{opacity:0.5}100%{top:100%;opacity:0}}
    .scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.9),transparent);animation:scanPurple 3s linear infinite;pointer-events:none;z-index:10;}
    @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.3),0 0 20px rgba(139,92,246,0.1)}50%{box-shadow:0 0 0 8px rgba(139,92,246,0),0 0 40px rgba(139,92,246,0.25)}}
    .btn-pulse{animation:pulseBorder 2s ease-in-out infinite;}
    @keyframes cautionPurple{from{background-position:0 0}to{background-position:56px 0}}
    .caution{background:repeating-linear-gradient(-45deg,rgba(139,92,246,0.08) 0,rgba(139,92,246,0.08) 12px,rgba(139,92,246,0.02) 12px,rgba(139,92,246,0.02) 24px);animation:cautionPurple 1s linear infinite;background-size:56px 56px;}

    /* ── APP ENTRY ── */
    @keyframes appIn{0%{opacity:0;filter:blur(10px);transform:translateY(30px)}65%{opacity:1;filter:blur(0);transform:translateY(-3px)}100%{opacity:1;transform:none}}
    .app-in{animation:appIn 1.2s var(--spring) forwards;}

    /* ── HERO STAGGER ── */
    @keyframes heroUp{from{opacity:0;transform:translateY(40px);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
    .h1{animation:heroUp 1s var(--spring) 0.1s both}.h2{animation:heroUp 1s var(--spring) 0.22s both}
    .h3{animation:heroUp 1s var(--spring) 0.36s both}.h4{animation:heroUp 1s var(--spring) 0.52s both}
    .h5{animation:heroUp 1s var(--spring) 0.68s both}.h6{animation:heroUp 1s var(--spring) 0.84s both}

    /* ── GLITCH ── */
    @keyframes gA{0%,100%{clip-path:none;transform:none}20%{clip-path:inset(8% 0 84% 0);transform:translate(-4px,0)}40%{clip-path:inset(44% 0 38% 0);transform:translate(4px,0)}65%{clip-path:inset(76% 0 8% 0);transform:translate(-3px,0)}80%{clip-path:none}}
    @keyframes gB{0%,100%{clip-path:none;opacity:0}20%{clip-path:inset(56% 0 12% 0);transform:translate(5px,0);opacity:0.7}40%{clip-path:inset(16% 0 64% 0);transform:translate(-5px,0);opacity:0.5}65%{opacity:0}}
    .glitch{position:relative;display:inline;}
    .glitch::before,.glitch::after{content:attr(data-text);position:absolute;inset:0;font-weight:inherit;font-size:inherit;letter-spacing:inherit;pointer-events:none;}
    .glitch::before{color:#f87171;mix-blend-mode:screen;}.glitch::after{color:#34d399;mix-blend-mode:screen;}
    .glitch-on::before{animation:gA 0.22s steps(2) forwards;}.glitch-on::after{animation:gB 0.22s steps(2) forwards;}

    /* ── RADAR ── */
    @keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes radarPing{0%{transform:scale(0.15);opacity:1}100%{transform:scale(1);opacity:0}}
    @keyframes radarShow{from{opacity:0;transform:translate(-50%,-50%) scale(0.7);filter:blur(8px)}to{opacity:1;transform:translate(-50%,-50%) scale(1);filter:blur(0)}}
    .radar-show{animation:radarShow 0.5s var(--spring) forwards;}
    .rp1{animation:radarPing 2.2s ease-out infinite}.rp2{animation:radarPing 2.2s ease-out 0.55s infinite}.rp3{animation:radarPing 2.2s ease-out 1.1s infinite}
    @keyframes rdot{0%,100%{transform:scale(1);box-shadow:0 0 16px var(--p),0 0 40px var(--glow2)}50%{transform:scale(1.3);box-shadow:0 0 24px var(--p),0 0 60px var(--glow)}}
    .rdot{animation:rdot 0.9s ease-in-out infinite;}

    /* ── TICKER ── */
    @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .tick{display:flex;animation:tick 32s linear infinite;white-space:nowrap;}.tick:hover{animation-play-state:paused;}

    /* ── CARD EXPLODE ── */
    @keyframes ex0{from{opacity:0;transform:translate(-100px,-70px) scale(0.55) rotate(-14deg);filter:blur(5px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex1{from{opacity:0;transform:translate(-20px,-110px) scale(0.55) rotate(6deg);filter:blur(5px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex2{from{opacity:0;transform:translate(90px,-70px) scale(0.55) rotate(14deg);filter:blur(5px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex3{from{opacity:0;transform:translate(-90px,60px) scale(0.6) rotate(-8deg);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex4{from{opacity:0;transform:translate(90px,60px) scale(0.6) rotate(8deg);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex5{from{opacity:0;transform:translate(-110px,0) scale(0.65) rotate(-5deg);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex6{from{opacity:0;transform:translate(110px,0) scale(0.65) rotate(5deg);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes ex7{from{opacity:0;transform:translate(0,110px) scale(0.6) rotate(-4deg);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
    .ex0{animation:ex0 0.75s var(--spring) both}.ex1{animation:ex1 0.75s var(--spring) 0.06s both}
    .ex2{animation:ex2 0.75s var(--spring) 0.12s both}.ex3{animation:ex3 0.75s var(--spring) 0.18s both}
    .ex4{animation:ex4 0.75s var(--spring) 0.24s both}.ex5{animation:ex5 0.75s var(--spring) 0.3s both}
    .ex6{animation:ex6 0.75s var(--spring) 0.36s both}.ex7{animation:ex7 0.75s var(--spring) 0.42s both}

    /* ── MAP ── */
    @keyframes mapIn{from{opacity:0;transform:translateY(50px) scale(0.97);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
    .map-in{animation:mapIn 0.9s var(--spring) forwards;}
    .leaflet-container{background:var(--bg)!important;}
    .leaflet-popup-content-wrapper{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;}
    .leaflet-popup-tip{display:none!important;}.leaflet-popup-content{margin:0!important;}
    .leaflet-control-zoom{border:1px solid rgba(139,92,246,0.3)!important;background:rgba(8,11,20,0.9)!important;}
    .leaflet-control-zoom a{color:rgba(139,92,246,0.8)!important;background:transparent!important;border-bottom:1px solid rgba(139,92,246,0.2)!important;}
    .leaflet-control-zoom a:hover{color:#fff!important;background:rgba(139,92,246,0.15)!important;}
    @keyframes ping{0%{transform:scale(1);opacity:0.9}100%{transform:scale(3);opacity:0}}

    /* ── MESSAGES ── */
    @keyframes ml{from{opacity:0;transform:translateX(-16px) translateY(6px)}to{opacity:1;transform:none}}
    @keyframes mr{from{opacity:0;transform:translateX(16px) translateY(6px)}to{opacity:1;transform:none}}
    .ml{animation:ml 0.3s var(--spring) both}.mr{animation:mr 0.3s var(--spring) both}
    @keyframes reportIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .report-in{animation:reportIn 0.5s var(--spring) 0.1s both}

    /* ── LOADERS ── */
    @keyframes fb{from{width:0%;opacity:0}5%{opacity:1}}.fb{animation:fb 1s var(--spring) forwards;}
    @keyframes dot{0%,80%,100%{opacity:0.1;transform:scale(0.4) translateY(0)}40%{opacity:1;transform:scale(1) translateY(-5px)}}
    .d1{animation:dot 1.2s ease-in-out infinite 0s}.d2{animation:dot 1.2s ease-in-out infinite 0.2s}.d3{animation:dot 1.2s ease-in-out infinite 0.4s}
    @keyframes bk{0%,100%{opacity:1}50%{opacity:0}}.bk{animation:bk 1.1s step-end infinite;}
    @keyframes sw{0%{transform:translateX(-140px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateX(100vw);opacity:0}}
    .sw{position:absolute;top:0;bottom:0;width:140px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.1),transparent);animation:sw 2s ease-in-out infinite;pointer-events:none;}

    /* ── TOAST ── */
    @keyframes tApp{0%{opacity:0;transform:translateY(28px) scale(0.78);filter:blur(8px)}60%{opacity:1;transform:translateY(-6px) scale(1.05);filter:blur(0)}100%{opacity:1;transform:none}}
    @keyframes tCrack{0%{transform:scale(1) rotate(0)}20%{transform:scale(1.22) rotate(-6deg)}45%{transform:scale(1.14) rotate(5deg)}70%{transform:scale(1.06) rotate(-2deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes tUnroll{0%{opacity:0;max-height:0;transform:translateY(-14px)}40%{opacity:0.7}100%{opacity:1;max-height:200px;transform:translateY(0)}}
    @keyframes tRollup{0%{opacity:1;max-height:200px}100%{opacity:0;max-height:0;transform:translateY(-16px) scale(0.93);filter:blur(4px)}}
    @keyframes tExit{0%{opacity:1;transform:none}100%{opacity:0;transform:translateY(22px) scale(0.84);filter:blur(8px)}}
    @keyframes iPop{0%{transform:scale(0.3) rotate(-30deg);opacity:0}55%{transform:scale(1.25) rotate(7deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
    @keyframes crack{0%{width:0;opacity:0}25%{opacity:1}100%{width:100%;opacity:0}}
    @keyframes shim{0%{background-position:-200% center}100%{background-position:200% center}}
    .t-appear{animation:tApp 0.8s var(--spring) forwards}.t-exit{animation:tExit 1.8s var(--ease) forwards}
    .i-pop{animation:iPop 0.75s var(--spring) 0.1s both}.i-crack{animation:tCrack 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards}
    .t-unroll{animation:tUnroll 0.75s var(--spring) 0.5s both;overflow:hidden}.t-rollup{animation:tRollup 1s var(--ease) forwards;overflow:hidden}

    /* ── INTERACTIVE ── */
    .nav-link{position:relative;font-size:14px;font-weight:500;color:var(--w60);transition:color 0.2s;cursor:pointer;letter-spacing:0.3px;}
    .nav-link::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1px;background:var(--p2);transform:scaleX(0);transform-origin:left;transition:transform 0.25s var(--spring);}
    .nav-link:hover{color:var(--w);}.nav-link:hover::after{transform:scaleX(1);}

    /* Sansara-style purple CTA */
    .btn-acc{font-size:13px;font-weight:600;padding:10px 24px;border-radius:100px;cursor:pointer;background:var(--p);color:#fff;border:none;transition:all 0.22s var(--spring);position:relative;overflow:hidden;letter-spacing:0.3px;}
    .btn-acc::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);opacity:0;transition:opacity 0.2s;}
    .btn-acc:hover{background:var(--p2);transform:translateY(-2px);box-shadow:0 8px 32px var(--glow);}
    .btn-acc:hover::after{opacity:1;}.btn-acc:active{transform:translateY(0);}
    .btn-acc:disabled{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.25);cursor:not-allowed;transform:none;box-shadow:none;}

    .btn-ghost{font-size:13px;font-weight:500;padding:9px 22px;border-radius:100px;cursor:pointer;background:transparent;color:var(--w80);border:1px solid rgba(255,255,255,0.2);transition:all 0.22s var(--spring);}
    .btn-ghost:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.4);transform:translateY(-2px);}

    /* Sansara-style glassmorphism cards */
    .scard{background:rgba(13,11,30,0.7);border:1px solid rgba(139,92,246,0.18);border-radius:16px;backdrop-filter:blur(12px);transition:all 0.3s var(--spring);position:relative;overflow:hidden;}
    .scard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent);opacity:0.6;}
    .scard:hover{border-color:rgba(139,92,246,0.4);transform:translateY(-5px);box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 40px rgba(139,92,246,0.06);}

    /* Sansara-style purple left bar */
    .bar-left{position:relative;}
    .bar-left::before{content:'';position:absolute;left:0;top:10%;bottom:10%;width:2px;background:linear-gradient(180deg,transparent,var(--p2),transparent);border-radius:1px;}

    .ex-row{transition:all 0.2s var(--spring);cursor:pointer;border-radius:10px;}
    .ex-row:hover{background:rgba(139,92,246,0.08)!important;border-color:rgba(139,92,246,0.3)!important;transform:translateX(5px);box-shadow:inset 3px 0 0 var(--p2);}

    .rcard{transition:transform 0.25s var(--spring),box-shadow 0.25s ease;will-change:transform;}
    .rcard:hover{transform:translateY(-7px) scale(1.01);}

    .inp:focus{outline:none;border-color:rgba(139,92,246,0.5)!important;box-shadow:0 0 0 3px rgba(139,92,246,0.12);}
    .inp::placeholder{color:rgba(255,255,255,0.2);}

    @keyframes betaBorder{0%,100%{border-color:rgba(139,92,246,0.12)}50%{border-color:rgba(139,92,246,0.4)}}
    .betab{animation:betaBorder 3s ease-in-out infinite;}
    @keyframes badgeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    .bfloat{animation:badgeFloat 4s ease-in-out infinite;}
    @keyframes countUp{from{opacity:0;transform:translateY(10px) scale(0.8)}to{opacity:1;transform:none}}
    .count-up{animation:countUp 0.45s var(--spring) both;}

    /* ── MOBILE ── */
    @keyframes menuSlide{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
    .mobile-menu{animation:menuSlide 0.35s var(--spring) forwards;}
    .view-toggle{position:fixed;bottom:24px;left:24px;z-index:500;width:44px;height:44px;border-radius:12px;background:rgba(13,11,30,0.9);border:1px solid rgba(139,92,246,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(12px);transition:all 0.2s var(--spring);}
    .view-toggle:hover{border-color:rgba(139,92,246,0.7);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.6),0 0 16px rgba(139,92,246,0.15);}
    @keyframes vFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
    .vfloat{animation:vFloat 3s ease-in-out infinite;}
    @media(max-width:767px){.nav-desktop{display:none!important;}.nav-right-desktop{display:none!important;}.ticker-wrap{display:none!important;}.nav-top{top:0!important;}}
    @media(min-width:768px){.nav-mobile{display:none!important;}}

    /* ── PURPLE DOT BULLET ── */
    .pdot{width:6px;height:6px;border-radius:50%;background:var(--p2);box-shadow:0 0 8px var(--p);flex-shrink:0;margin-top:7px;}

    /* ── SECTION LABEL ── */
    .slabel{font-family:var(--mono);font-size:10px;color:var(--p2);letter-spacing:4px;text-transform:uppercase;margin-bottom:12px;}

    /* ── PURPLE ACCENT TEXT ── */
    .pacc{color:var(--p2);}

    /* ── DIVIDER ── */
    .pdivider{height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.2),transparent);margin:0 auto;max-width:800px;}
  `;

  return (
    <>
      <style>{css}</style>

      {/* ══ BOOT ══ */}
      {phase==="boot"&&(
        <div className="boot-in" style={{position:"fixed",inset:0,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:500,background:"radial-gradient(ellipse,rgba(139,92,246,0.12) 0%,transparent 65%)",pointerEvents:"none"}}/>
          <div style={{width:"min(580px,92vw)",background:"rgba(10,9,24,0.98)",border:"1px solid rgba(139,92,246,0.25)",borderRadius:16,overflow:"hidden",boxShadow:"0 0 100px rgba(139,92,246,0.1),0 60px 120px rgba(0,0,0,0.95)"}}>
            <div style={{padding:"12px 20px",background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(139,92,246,0.12)",display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",gap:7}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c,opacity:0.85}}/>)}</div>
              <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--w40)",letterSpacing:1}}>aura — system init</span>
              <span style={{marginLeft:"auto",fontFamily:"var(--mono)",fontSize:9,color:"var(--p2)",letterSpacing:2}}>v0.1-beta</span>
            </div>
            <div style={{padding:"24px 26px",minHeight:240}}>
              {BOOT_LINES.slice(0,bootLine).map((line,i)=>(
                <div key={i} className="bl" style={{fontFamily:"var(--mono)",fontSize:12,lineHeight:2,color:line.c==="ok"?"#34d399":line.c==="acc"?"var(--p3)":"var(--w40)",display:"flex",alignItems:"center",gap:8}}>
                  {line.t}{i===bootLine-1&&<span className="bk" style={{color:"var(--p2)"}}>█</span>}
                </div>
              ))}
            </div>
            <div style={{padding:"0 26px 22px"}}>
              <div style={{height:2,background:"rgba(255,255,255,0.04)",borderRadius:1,overflow:"hidden"}}>
                <div style={{height:"100%",width:(bootLine/BOOT_LINES.length*100)+"%",background:"linear-gradient(90deg,rgba(139,92,246,0.5),var(--p),var(--p2))",borderRadius:1,transition:"width 0.22s ease",boxShadow:"0 0 10px var(--glow)"}}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DISCLAIMER ══ */}
      {phase==="disclaimer"&&(
        <div style={{position:"fixed",inset:0,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,overflow:"hidden",padding:"20px"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,rgba(139,92,246,0.08) 0%,transparent 60%)",pointerEvents:"none"}}/>
          <div className={disclaimerExit?"disc-out":disclaimerIn?"disc-in":""} style={{width:"min(620px,96vw)",maxHeight:"92vh",overflowY:"auto",background:"rgba(10,9,24,0.99)",borderRadius:20,boxShadow:"0 0 120px rgba(139,92,246,0.1),0 80px 160px rgba(0,0,0,0.98)",position:"relative",border:"1px solid rgba(139,92,246,0.2)"}}>
            <div className="scan"/>
            <div className="caution" style={{padding:"10px 24px",borderBottom:"1px solid rgba(139,92,246,0.15)",display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",gap:7}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,opacity:0.85}}/>)}</div>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(139,92,246,0.85)",letterSpacing:3,textTransform:"uppercase"}}>Beta Access — Read Before Continuing</span>
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"var(--p2)",boxShadow:"0 0 6px var(--p)"}}/>
                <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--p2)",letterSpacing:2}}>BETA v0.1</span>
              </div>
            </div>
            <div style={{padding:"32px 36px 30px"}}>
              <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:24}}>
                <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 0 20px rgba(139,92,246,0.1)"}}>⚠</div>
                <div>
                  <div className="slabel" style={{marginBottom:5}}>Beta Access Program</div>
                  <div style={{fontWeight:700,fontSize:24,color:"var(--w)",lineHeight:1.1}}>Before You Enter AURA</div>
                </div>
              </div>
              <p style={{fontSize:14,lineHeight:1.8,color:"var(--w60)",marginBottom:22,paddingBottom:22,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                AURA is an experimental AI-powered urban risk platform. Provided as-is for research and exploration only.
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
                {WARNINGS.map((w,i)=>(
                  <div key={i} className="wi" style={{animationDelay:`${i*80+300}ms`}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10}}>
                      <span style={{fontSize:14,flexShrink:0}}>{w.icon}</span>
                      <span style={{fontSize:13,color:"var(--w60)",lineHeight:1.5}}>{w.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:"12px 16px",background:"rgba(139,92,246,0.04)",border:"1px solid rgba(139,92,246,0.1)",borderRadius:10,marginBottom:22}}>
                <p style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,0.28)",lineHeight:1.9,letterSpacing:0.3}}>NOT FOR: law enforcement · policy decisions · operational planning · public safety determinations.</p>
              </div>
              <button onClick={handleAccept} className={`btn-acc${acceptPulse?" btn-pulse":""}`} style={{width:"100%",padding:"16px",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10,borderRadius:14}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                I understand — enter AURA Beta
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {phase==="exit"&&(
        <div className="boot-out" style={{position:"fixed",inset:0,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9997}}>
          <div style={{fontFamily:"var(--mono)",fontSize:13,color:"var(--p2)",letterSpacing:5,textTransform:"uppercase"}}>Loading AURA<span className="bk">_</span></div>
        </div>
      )}

      {/* ══════════ MAIN APP ══════════ */}
      {phase==="app"&&(
        <div className="app-in" style={{minHeight:"100vh",position:"relative",background:"var(--bg)"}}>

          {/* 3D BLOB CANVAS */}
          <canvas ref={blobCanvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>

          {/* AMBIENT RISK */}
          <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",transition:"background 3s ease",background:
            ambientRisk==="critical"?"radial-gradient(ellipse at 50% 20%,rgba(248,113,113,0.07) 0%,transparent 55%)":
            ambientRisk==="elevated"?"radial-gradient(ellipse at 50% 20%,rgba(167,139,250,0.06) 0%,transparent 55%)":
            ambientRisk==="nominal"?"radial-gradient(ellipse at 50% 20%,rgba(52,211,153,0.05) 0%,transparent 55%)"
            :"transparent"
          }}/>

          {/* RADAR */}
          {radarActive&&(
            <div className="radar-show" style={{position:"fixed",top:"50%",left:"50%",zIndex:200,pointerEvents:"none",width:480,height:480}}>
              <div style={{position:"absolute",inset:-80,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 65%)"}}/>
              <div className="rp1" style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(139,92,246,0.7)",boxShadow:"0 0 12px rgba(139,92,246,0.3)"}}/>
              <div className="rp2" style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(139,92,246,0.5)"}}/>
              <div className="rp3" style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.3)"}}/>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.1)"}}/>
              <div style={{position:"absolute",top:"50%",left:"6%",right:"6%",height:1,background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.2),rgba(139,92,246,0.45),rgba(139,92,246,0.2),transparent)",transform:"translateY(-50%)"}}/>
              <div style={{position:"absolute",left:"50%",top:"6%",bottom:"6%",width:1,background:"linear-gradient(180deg,transparent,rgba(139,92,246,0.2),rgba(139,92,246,0.45),rgba(139,92,246,0.2),transparent)",transform:"translateX(-50%)"}}/>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden"}}>
                <div style={{position:"absolute",top:"50%",left:"50%",width:"50%",height:3,transformOrigin:"0 50%",background:"linear-gradient(90deg,rgba(139,92,246,0.04),rgba(139,92,246,0.95))",animation:"radarSpin 1.4s linear infinite",transform:"translateY(-50%)",boxShadow:"0 0 8px rgba(139,92,246,0.5)"}}/>
              </div>
              <div className="rdot" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:12,height:12,borderRadius:"50%",background:"var(--p2)"}}/>
              <div style={{position:"absolute",bottom:-38,left:"50%",transform:"translateX(-50%)",fontFamily:"var(--mono)",fontSize:10,fontWeight:600,color:"rgba(139,92,246,0.8)",letterSpacing:4,whiteSpace:"nowrap",textTransform:"uppercase"}}>Scanning Risk Vectors</div>
            </div>
          )}

          {/* TICKER */}
          <div className="ticker-wrap" style={{position:"fixed",top:0,left:0,right:0,zIndex:101,height:26,background:"rgba(8,11,20,0.96)",borderBottom:"1px solid rgba(139,92,246,0.1)",overflow:"hidden",display:"flex",alignItems:"center"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:"linear-gradient(90deg,rgba(8,11,20,1),transparent)",zIndex:2,display:"flex",alignItems:"center",paddingLeft:10,gap:6}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"var(--p2)",boxShadow:"0 0 5px var(--p)"}}/>
              <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--p2)",letterSpacing:3,textTransform:"uppercase",whiteSpace:"nowrap"}}>Live</span>
            </div>
            <div className="tick" style={{paddingLeft:90}}>
              {[...Array(2)].map((_,rep)=>(
                <span key={rep} style={{display:"flex"}}>
                  {["Databricks Connected · 847,214 Records","GPT-4o-mini · Temp 0 · Deterministic","SELECT-Only · Zero Write Risk","Phoenix AZ Metro · Crime + Population","Ask Anything · Get Instant Results"].map((t,i)=>(
                    <span key={i} style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--w40)",letterSpacing:2,paddingRight:60,whiteSpace:"nowrap",textTransform:"uppercase"}}>
                      <span style={{color:"var(--p2)",marginRight:8}}>◆</span>{t}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div style={{position:"absolute",right:0,top:0,bottom:0,width:60,background:"linear-gradient(270deg,rgba(8,11,20,1),transparent)",zIndex:2}}/>
          </div>

          {/* NAV */}
          <nav className="nav-top" style={{position:"fixed",top:mobile?0:26,left:0,right:0,zIndex:100,background:"rgba(8,11,20,0.7)",backdropFilter:"blur(24px) saturate(180%)",borderBottom:"1px solid rgba(139,92,246,0.1)",height:60,display:"flex",alignItems:"center",padding:mobile?"0 20px":"0 48px",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:10,background:"rgba(139,92,246,0.15)",border:"1px solid rgba(139,92,246,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"var(--p2)",boxShadow:"0 0 16px rgba(139,92,246,0.2)"}}>A</div>
              <span style={{fontWeight:700,fontSize:18,letterSpacing:-0.3,color:"var(--w)"}}>AURA</span>
              <span style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,padding:"2px 8px",borderRadius:100,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.3)",color:"var(--p2)"}}>BETA</span>
            </div>
            <div className="nav-desktop" style={{display:"flex",gap:36,position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
              {[["How It Works","#guide"],["Terminal","#terminal"],["System","#system"],["Beta","#beta"]].map(([l,h])=>(
                <a key={l} href={h} className="nav-link">{l}</a>
              ))}
            </div>
            <div className="nav-right-desktop" style={{display:"flex",gap:14,alignItems:"center"}}>
              {queryCount>0&&<div className="count-up" style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--p2)",padding:"3px 10px",borderRadius:100,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)",letterSpacing:1}}>{queryCount} QUER{queryCount===1?"Y":"IES"}</div>}
              {ambientRisk!=="neutral"&&(
                <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:100,background:ambientRisk==="critical"?"rgba(248,113,113,0.1)":ambientRisk==="elevated"?"rgba(167,139,250,0.1)":"rgba(52,211,153,0.1)",border:`1px solid ${ambientRisk==="critical"?"rgba(248,113,113,0.3)":ambientRisk==="elevated"?"rgba(167,139,250,0.3)":"rgba(52,211,153,0.3)"}`}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:ambientRisk==="critical"?"#f87171":ambientRisk==="elevated"?"#a78bfa":"#34d399"}}/>
                  <span style={{fontFamily:"var(--mono)",fontSize:9,color:ambientRisk==="critical"?"#f87171":ambientRisk==="elevated"?"#a78bfa":"#34d399",letterSpacing:1,textTransform:"uppercase"}}>{ambientRisk}</span>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 7px #34d399"}}/>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"#34d399",letterSpacing:2,textTransform:"uppercase"}}>Live</span>
              </div>
              <a href="#terminal"><button className="btn-acc">Get Started</button></a>
            </div>
            <div className="nav-mobile" style={{display:"flex",alignItems:"center",gap:10}}>
              {queryCount>0&&<div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--p2)",padding:"3px 8px",borderRadius:100,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)"}}>{queryCount}Q</div>}
              <button onClick={()=>setMenuOpen(o=>!o)} style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",padding:0}}>
                <span style={{display:"block",width:18,height:1.5,background:menuOpen?"var(--p2)":"rgba(255,255,255,0.8)",borderRadius:1,transform:menuOpen?"rotate(45deg) translate(3px,3px)":"none",transition:"all 0.25s var(--spring)"}}/>
                <span style={{display:"block",width:18,height:1.5,background:menuOpen?"transparent":"rgba(255,255,255,0.8)",borderRadius:1,opacity:menuOpen?0:1,transition:"all 0.25s"}}/>
                <span style={{display:"block",width:18,height:1.5,background:menuOpen?"var(--p2)":"rgba(255,255,255,0.8)",borderRadius:1,transform:menuOpen?"rotate(-45deg) translate(3px,-3px)":"none",transition:"all 0.25s var(--spring)"}}/>
              </button>
            </div>
          </nav>

          {mobile&&menuOpen&&(
            <div className="mobile-menu" style={{position:"fixed",top:60,left:0,right:0,zIndex:99,background:"rgba(8,11,20,0.98)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(139,92,246,0.15)",padding:"16px 20px 20px"}}>
              {[["How It Works","#guide"],["Terminal","#terminal"],["System","#system"],["Beta","#beta"]].map(([l,h])=>(
                <a key={l} href={h} onClick={()=>setMenuOpen(false)} style={{display:"block",padding:"14px 0",fontSize:18,fontWeight:600,color:"var(--w80)",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"color 0.15s"}}
                  onMouseEnter={e=>(e.currentTarget.style.color="var(--p2)")}onMouseLeave={e=>(e.currentTarget.style.color="var(--w80)")}>{l}</a>
              ))}
              <div style={{marginTop:16}}><a href="#terminal" onClick={()=>setMenuOpen(false)}><button className="btn-acc" style={{width:"100%",padding:"14px",fontSize:14}}>Try It Now →</button></a></div>
            </div>
          )}

          {/* ══ HERO ══ */}
          <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:mobile?"100px 24px 80px":"130px 48px 100px",position:"relative",zIndex:2}}>
            <div className="h1 bfloat" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 16px",borderRadius:100,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)",fontFamily:"var(--mono)",fontSize:10,color:"var(--p2)",letterSpacing:3,marginBottom:32,textTransform:"uppercase"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"var(--p2)",boxShadow:"0 0 6px var(--p)"}}/>
              Urban Risk Intelligence · Phoenix Metro · 847K+ Records
            </div>

            <h1 className="h2" style={{fontWeight:800,fontSize:mobile?"clamp(38px,10vw,52px)":"clamp(52px,7vw,80px)",lineHeight:1.05,letterSpacing:-2,color:"var(--w)",maxWidth:700,marginBottom:8}}>
              Find Out If Your City
            </h1>
            <h1 className={`h2 glitch glitch-${glitchActive?"on":""}`} data-text="Is Safe." style={{fontWeight:800,fontSize:mobile?"clamp(38px,10vw,52px)":"clamp(52px,7vw,80px)",lineHeight:1.05,letterSpacing:-2,marginBottom:28}}>
              <span style={{color:"var(--p2)",textShadow:"0 0 40px rgba(139,92,246,0.5)"}}>Is Safe.</span>
            </h1>

            <p className="h3" style={{fontSize:mobile?15:17,lineHeight:1.8,color:"var(--w60)",maxWidth:520,marginBottom:44}}>
              Just type what you want to know — like{" "}
              <em style={{color:"var(--w80)",fontStyle:"normal",borderBottom:"1px solid rgba(139,92,246,0.3)"}}>
                "Which grocery stores near me are in dangerous areas?"
              </em>{" "}
              — and AURA pulls real crime data to answer instantly.
            </p>

            <div className="h4" style={{display:"flex",gap:14,justifyContent:"center",alignItems:"center",marginBottom:80,flexWrap:"wrap"}}>
              <a href="#terminal"><button className="btn-acc" style={{fontSize:15,padding:"13px 36px",display:"inline-flex",alignItems:"center",gap:10}}>
                Try It Now<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button></a>
              <a href="#guide"><button className="btn-ghost" style={{fontSize:15,padding:"12px 28px"}}>See How It Works</button></a>
            </div>

            <div className="h5" data-reveal-stagger data-reveal="fade" style={{display:"flex",gap:mobile?28:56,justifyContent:"center",flexWrap:"wrap",paddingTop:36,borderTop:"1px solid rgba(139,92,246,0.12)"}}>
              {[["847K+","Crime Records"],["Instant","Results"],["Free","To Explore"]].map(([n,l],i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontWeight:800,fontSize:mobile?"clamp(28px,7vw,40px)":"clamp(32px,4vw,48px)",color:"var(--p2)",lineHeight:1,letterSpacing:-1,marginBottom:4,textShadow:"0 0 30px rgba(139,92,246,0.4)"}}>{n}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--w40)",textTransform:"uppercase",letterSpacing:2}}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          <div data-reveal="scale" className="pdivider" style={{position:"relative",zIndex:2,margin:"0 auto"}}/>

          {/* ══ HOW IT WORKS ══ */}
          <section id="guide" style={{padding:mobile?"80px 24px":"130px 48px",maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <div data-reveal style={{textAlign:"center",marginBottom:70}}>
              <div className="slabel">How It Works</div>
              <h2 style={{fontWeight:700,fontSize:mobile?"clamp(28px,7vw,40px)":"clamp(32px,4vw,52px)",lineHeight:1.1,letterSpacing:-1,color:"var(--w)",marginBottom:16}}>
                Same question. <span className="pacc">Instant intelligence.</span>
              </h2>
              <p style={{fontSize:16,color:"var(--w60)",maxWidth:460,margin:"0 auto",lineHeight:1.7}}>No technical knowledge needed. Just describe what you want to know.</p>
            </div>

            <div data-reveal-stagger data-reveal style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16,marginBottom:60}}>
              {[
                {icon:"💬",t:"Ask About Any Neighborhood",d:"Type something like 'Is it safe to open a business in ZIP 85031?' — AURA understands plain English and pulls the right data instantly."},
                {icon:"📊",t:"Get Instant Risk Cards",d:"Results show up as clean cards — CRITICAL, ELEVATED, or NOMINAL — with real crime numbers, population, and a 0–100 risk score."},
                {icon:"🗺️",t:"See It on a Live Map",d:"Every result gets pinned on a dark satellite map. Red pins for danger zones, green for safe areas. Click any pin for full details."},
                {icon:"⚡",t:"847K+ Real Records",d:"Over 847,000 indexed records covering crime totals, population density, and safety scores across every ZIP code in Phoenix metro."},
              ].map((s,i)=>(
                <div key={i} className="scard bar-left" style={{padding:"28px 28px 28px 36px"}}>
                  <div style={{fontSize:26,marginBottom:14}}>{s.icon}</div>
                  <div className="slabel" style={{marginBottom:8}}>0{i+1}</div>
                  <div style={{fontWeight:600,fontSize:18,color:"var(--w)",marginBottom:10,lineHeight:1.2,letterSpacing:-0.3}}>{s.t}</div>
                  <div style={{fontSize:14,lineHeight:1.78,color:"var(--w60)"}}>{s.d}</div>
                </div>
              ))}
            </div>

            <div data-reveal style={{marginBottom:14}}>
              <div className="slabel" style={{textAlign:"center"}}>Example Queries — Click To Use</div>
            </div>
            <div data-reveal-stagger data-reveal style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:8}}>
              {EXAMPLES.map((ex,i)=>(
                <div key={i} className="ex-row" style={{padding:"13px 16px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:12}}
                  onClick={()=>{setQuestion(ex);document.getElementById("terminal")?.scrollIntoView({behavior:"smooth"});}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                    <div className="pdot" style={{marginTop:0,flexShrink:0}}/>
                    <span style={{fontSize:13,color:"var(--w60)",lineHeight:1.45}}>{ex}</span>
                  </div>
                  <span style={{color:"var(--p2)",fontSize:14,flexShrink:0}}>→</span>
                </div>
              ))}
            </div>
          </section>

          <div data-reveal="scale" className="pdivider" style={{position:"relative",zIndex:2,margin:"0 auto"}}/>

          {/* ══ TERMINAL ══ */}
          <section id="terminal" style={{padding:mobile?"80px 24px":"130px 48px",maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <div data-reveal style={{textAlign:"center",marginBottom:48}}>
              <div className="slabel">Intelligence Terminal</div>
              <h2 style={{fontWeight:700,fontSize:mobile?"clamp(28px,7vw,40px)":"clamp(32px,4vw,52px)",lineHeight:1.1,letterSpacing:-1,color:"var(--w)"}}>
                Query the City.
              </h2>
            </div>

            <div data-reveal data-delay="100" className="scard" style={{display:"flex",flexDirection:"column",height:mobile?"75vh":"68vh",position:"relative",overflow:"hidden"}}>
              {loading&&<div className="sw"/>}
              <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(139,92,246,0.1)",background:"rgba(255,255,255,0.015)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{display:"flex",gap:6}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
                  <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--w40)"}}>aura — risk_query</span>
                </div>
                <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,color:loading?"var(--p2)":"#34d399",textTransform:"uppercase"}}>
                  {loading?<>Processing<span className="bk">_</span></>:<>Ready<span className="bk">_</span></>}
                </span>
              </div>

              <div ref={feedRef} style={{flex:1,overflowY:"auto",padding:"24px",display:"flex",flexDirection:"column",gap:20}}>
                {messages.length===0&&(
                  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,opacity:0.2}}>
                    <div className="pdot" style={{width:10,height:10,marginTop:0}}/>
                    <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:3,color:"var(--w60)",textAlign:"center",textTransform:"uppercase"}}>Type a query or click an example above</div>
                  </div>
                )}
                {messages.map((msg,i)=>{
                  if(msg.role==="user")return(
                    <div key={i} className="mr" style={{display:"flex",justifyContent:"flex-end"}}>
                      <div style={{maxWidth:"65%",padding:"12px 18px",background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.3)",borderRadius:"16px 16px 4px 16px",fontFamily:"var(--mono)",fontSize:13,color:"rgba(255,255,255,0.9)",lineHeight:1.65,boxShadow:"0 4px 20px rgba(139,92,246,0.1)"}}>
                        <div style={{fontSize:8,letterSpacing:4,color:"rgba(167,139,250,0.6)",marginBottom:7,textTransform:"uppercase"}}>Query</div>
                        {msg.content}
                      </div>
                    </div>
                  );
                  return(
                    <div key={i} className="ml" style={{display:"flex",flexDirection:"column",gap:14}}>
                      {msg.answer&&(
                        <div className="report-in" style={{padding:"16px 20px",background:"rgba(10,9,24,0.95)",border:"1px solid rgba(255,255,255,0.07)",borderLeft:"2px solid var(--p2)",borderRadius:"4px 16px 16px 16px",fontFamily:"var(--mono)",fontSize:13,lineHeight:1.9,color:"rgba(255,255,255,0.75)"}}>
                          <div style={{fontSize:8,letterSpacing:4,color:"rgba(167,139,250,0.5)",marginBottom:10,display:"flex",alignItems:"center",gap:6,textTransform:"uppercase"}}>
                            <div className="pdot" style={{width:4,height:4,marginTop:0}}/>Analyst Report
                          </div>
                          {msg.answer}
                        </div>
                      )}
                      {msg.results?.length>0&&(
                        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6}}>
                          {msg.results.map((store:any,j:number)=>{
                            const r=riskOf(store.priority_score);
                            return(
                              <div key={j} className={`ex${Math.min(j,7)} rcard scard`} style={{minWidth:210,flexShrink:0,background:r.bg,border:`1px solid ${r.c}30`,padding:"16px",boxShadow:`0 0 0 1px ${r.c}10,0 8px 28px rgba(0,0,0,0.4)`}}>
                                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${r.c}66,transparent)`}}/>
                                <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,color:r.c,marginBottom:10,display:"flex",alignItems:"center",gap:6,textTransform:"uppercase"}}>
                                  <div style={{width:6,height:6,borderRadius:"50%",background:r.c,boxShadow:`0 0 8px ${r.c}`}}/>{r.l}
                                </div>
                                <div style={{fontWeight:600,fontSize:14,color:"rgba(255,255,255,0.95)",marginBottom:3,lineHeight:1.2}}>{store.store_name||`ZIP ${store.zip_code}`}</div>
                                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:14}}>{store.city?.trim()||"UNKNOWN"} · {store.zip_code}</div>
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                                  <div><div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.25)",marginBottom:4,textTransform:"uppercase"}}>Crimes</div><div style={{fontWeight:800,fontSize:22,color:"#f87171",letterSpacing:-0.5}}>{(store.total_crimes||0).toLocaleString()}</div></div>
                                  <div><div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.25)",marginBottom:4,textTransform:"uppercase"}}>Pop.</div><div style={{fontWeight:800,fontSize:22,color:"#60a5fa",letterSpacing:-0.5}}>{(store.population||0).toLocaleString()}</div></div>
                                </div>
                                <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.22)",display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center",textTransform:"uppercase"}}>
                                  <span>Risk Index</span><span style={{color:r.c,fontWeight:800,fontSize:15,letterSpacing:-0.5}}>{store.priority_score}</span>
                                </div>
                                <div style={{height:2,background:"rgba(255,255,255,0.05)",borderRadius:1,overflow:"hidden"}}>
                                  <div className="fb" style={{height:"100%",width:Math.min(100,store.priority_score)+"%",background:`linear-gradient(90deg,${r.c}55,${r.c})`,borderRadius:1,boxShadow:`0 0 6px ${r.c}`}}/>
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
                  <div className="ml" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0"}}>
                    <div style={{display:"flex",gap:5}}>{[1,2,3].map(n=><div key={n} className={`d${n}`} style={{width:8,height:8,borderRadius:"50%",background:"var(--p2)",boxShadow:"0 0 8px var(--p)"}}/>)}</div>
                    <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:3,color:"rgba(139,92,246,0.5)",textTransform:"uppercase"}}>Processing Query</span>
                  </div>
                )}
              </div>

              <div style={{borderTop:"1px solid rgba(139,92,246,0.08)",background:"rgba(8,9,22,0.7)",padding:"12px 16px",display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
                <input className="inp" style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 16px",color:"var(--w)",fontFamily:"var(--mono)",fontSize:13,caretColor:"var(--p2)",transition:"border-color 0.2s,box-shadow 0.2s"}}
                  placeholder={typedPlaceholder+"█"} value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fire()}/>
                <button onClick={fire} disabled={loading||!question.trim()} className="btn-acc" style={{padding:"10px 22px",borderRadius:12,fontSize:13,fontWeight:600,flexShrink:0}}>
                  {loading?"...":"Execute"}
                </button>
              </div>
            </div>

            {mapVisible&&(
              <div id="aura-map" className="map-in scard" style={{marginTop:16,borderRadius:16,overflow:"hidden",border:"1px solid rgba(139,92,246,0.2)",boxShadow:"0 0 60px rgba(139,92,246,0.06),0 40px 80px rgba(0,0,0,0.7)"}}>
                <div style={{padding:"11px 18px",background:"rgba(8,9,22,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(139,92,246,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div className="pdot" style={{marginTop:0}}/>
                    <span style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:600,color:"var(--w60)",letterSpacing:3,textTransform:"uppercase"}}>Risk Intelligence Map</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--w40)",padding:"2px 8px",borderRadius:100,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>{mapResults.length} locations</span>
                  </div>
                  <div style={{display:"flex",gap:12}}>
                    {[["#f87171","Critical"],["#a78bfa","Elevated"],["#34d399","Nominal"]].map(([c,l])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:c,boxShadow:`0 0 5px ${c}`}}/>
                        <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--w40)",letterSpacing:1,textTransform:"uppercase"}}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div ref={mapRef} style={{height:mobile?300:420,width:"100%",background:"var(--bg)"}}/>
              </div>
            )}
          </section>

          <div data-reveal="scale" className="pdivider" style={{position:"relative",zIndex:2,margin:"0 auto"}}/>

          {/* ══ SYSTEM ══ */}
          <section id="system" style={{padding:mobile?"80px 24px":"130px 48px",maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <div data-reveal style={{textAlign:"center",marginBottom:60}}>
              <div className="slabel">System</div>
              <h2 style={{fontWeight:700,fontSize:mobile?"clamp(28px,7vw,40px)":"clamp(32px,4vw,52px)",lineHeight:1.1,letterSpacing:-1,color:"var(--w)"}}>
                Built on real infrastructure.
              </h2>
            </div>
            <div data-reveal-stagger data-reveal style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:16}}>
              {[
                {icon:"🤖",t:"AI Engine",c:"var(--p2)",d:"GPT-4o-mini at Temperature 0. Deterministic answers. SELECT-only enforcement — zero risk of modifying any data."},
                {icon:"⚡",t:"Databricks",c:"#60a5fa",d:"Direct cluster integration. 847,214 records across ZIP codes, stores, crime totals, and population data."},
                {icon:"📊",t:"Risk Index",c:"#34d399",d:"Crime and population normalized to 0–100 in real time. Every card is automatically classified and scored."},
              ].map((card,i)=>(
                <div key={i} className="scard bar-left" style={{padding:"28px 26px 28px 34px"}}>
                  <div style={{fontSize:28,marginBottom:14}}>{card.icon}</div>
                  <div style={{fontWeight:600,fontSize:18,color:card.c,marginBottom:10,letterSpacing:-0.3}}>{card.t}</div>
                  <div style={{fontSize:14,lineHeight:1.75,color:"var(--w60)"}}>{card.d}</div>
                </div>
              ))}
            </div>
          </section>

          <div data-reveal="scale" className="pdivider" style={{position:"relative",zIndex:2,margin:"0 auto"}}/>

          {/* ══ BETA ══ */}
          <section id="beta" style={{padding:mobile?"80px 24px":"130px 48px",maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <div data-reveal className="scard betab" style={{padding:mobile?"32px 24px":"48px 48px"}}>
              <div style={{position:"absolute",top:20,right:24,fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,padding:"4px 12px",borderRadius:100,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)",color:"var(--p2)",textTransform:"uppercase"}}>⚠ Beta v0.1</div>
              <div className="slabel">Beta Program</div>
              <h2 style={{fontWeight:700,fontSize:mobile?"clamp(26px,6vw,38px)":"clamp(28px,3.5vw,46px)",letterSpacing:-1,lineHeight:1.05,marginBottom:14,color:"var(--w)"}}>
                Rough Edges. <span className="pacc">Real Data.</span>
              </h2>
              <p style={{fontSize:16,color:"var(--w60)",marginBottom:36,maxWidth:480}}>AURA is experimental. Powerful but not perfect.</p>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?"28px":"48px"}}>
                <div>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"rgba(248,113,113,0.5)",marginBottom:16,textTransform:"uppercase"}}>Known Limitations</div>
                  {["Queries may occasionally fail","Some questions get misinterpreted","Cluster may time out — just retry","Indexed data, not a live feed","Not for operational decisions"].map((x,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#f87171",boxShadow:"0 0 6px rgba(248,113,113,0.5)",flexShrink:0,marginTop:7}}/>
                      <span style={{fontSize:14,color:"var(--w60)",lineHeight:1.65}}>{x}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"rgba(52,211,153,0.5)",marginBottom:16,textTransform:"uppercase"}}>Best Practices</div>
                  {["One clear question at a time","Include city names for accuracy","Use extremes — highest, lowest, most","Rephrase and retry if needed","Research and exploration only"].map((x,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 6px rgba(52,211,153,0.5)",flexShrink:0,marginTop:7}}/>
                      <span style={{fontSize:14,color:"var(--w60)",lineHeight:1.65}}>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div data-reveal="scale" className="pdivider" style={{position:"relative",zIndex:2,margin:"0 auto"}}/>

          {/* ══ ABOUT ══ */}
          <section style={{padding:mobile?"60px 24px 80px":"100px 48px",maxWidth:1000,margin:"0 auto",position:"relative",zIndex:2}}>
            <div data-reveal style={{textAlign:"center",marginBottom:48}}>
              <div className="slabel">About the Creator</div>
              <h2 style={{fontWeight:700,fontSize:mobile?"clamp(26px,6vw,36px)":"clamp(28px,3.5vw,44px)",letterSpacing:-1,lineHeight:1.05,marginBottom:24,color:"var(--w)"}}>
                Built by <span className="pacc">Zain Shah</span>
              </h2>
            </div>

            <div data-reveal data-delay="100" className="scard" style={{padding:mobile?"28px 24px":"40px 48px",textAlign:"center",maxWidth:720,margin:"0 auto 32px"}}>
              {/* Avatar */}
              <div style={{width:72,height:72,borderRadius:20,background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,color:"var(--p2)",boxShadow:"0 0 28px rgba(139,92,246,0.15)",margin:"0 auto 20px"}}>Z</div>

              <div style={{fontWeight:700,fontSize:20,color:"var(--w)",marginBottom:6,letterSpacing:-0.3}}>Zain Shah</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--p2)",letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>CS @ Arizona State University · Class of 2028</div>

              <p style={{fontSize:15,lineHeight:1.85,color:"var(--w60)",maxWidth:560,margin:"0 auto 24px"}}>
                Sophomore CS student at ASU passionate about AI, data engineering, and building tools that make complex data accessible to everyone. AURA started as a class project and grew into a full-stack AI platform connecting GPT-4o to real Databricks crime data. Currently looking for SWE internships for Summer 2026.
              </p>

              {/* Tags */}
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
                {["Python","Next.js","TypeScript","Databricks","OpenAI API","React"].map(tag=>(
                  <span key={tag} style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--p3)",padding:"4px 12px",borderRadius:100,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.18)",letterSpacing:1}}>{tag}</span>
                ))}
              </div>

              {/* What AURA means */}
              <div style={{padding:"14px 20px",borderRadius:12,background:"rgba(139,92,246,0.04)",border:"1px solid rgba(139,92,246,0.1)",marginBottom:28,display:"inline-block"}}>
                <div className="slabel" style={{marginBottom:6,textAlign:"center"}}>What AURA Means</div>
                <div style={{fontWeight:600,fontSize:15,color:"var(--w)",letterSpacing:1}}>
                  {[["A","utomated "],["U","rban "],["R","isk "],["A","nalytics"]].map(([g,rest],i)=>(
                    <span key={i}><span style={{color:"var(--p2)",textShadow:"0 0 12px rgba(139,92,246,0.4)"}}>{g}</span>{rest}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="https://github.com/SikeTheMike" target="_blank" rel="noopener noreferrer">
                  <button className="btn-ghost" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </button>
                </a>
                <a href="https://linkedin.com/in/zain-sahir-s-4b1a9a227" target="_blank" rel="noopener noreferrer">
                  <button className="btn-acc" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px"}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </button>
                </a>
                <a href="mailto:shahzain.zeza@gmail.com">
                  <button className="btn-ghost" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Email
                  </button>
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <div style={{borderTop:"1px solid rgba(139,92,246,0.08)",padding:mobile?"16px 24px":"20px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2,flexDirection:mobile?"column":"row",gap:mobile?"10px":0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:22,height:22,borderRadius:6,background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"var(--p2)"}}>A</div>
              <span style={{fontWeight:700,fontSize:14}}>AURA</span>
            </div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--w40)",letterSpacing:1,textTransform:"uppercase",textAlign:mobile?"center":"left"}}>Automated Urban Risk Analytics · v0.1 Beta · Databricks + OpenAI</div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"rgba(255,255,255,0.1)",letterSpacing:1}}>© 2026 Zain Shah</div>
          </div>

          {/* VIEW TOGGLE */}
          <button className="view-toggle vfloat" onClick={()=>setForceDesktop(f=>!f)}>
            {mobile?(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--p2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            ):(
              <svg width="16" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--p2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            )}
          </button>
        </div>
      )}

      {/* TOAST */}
      {toastPhase!=="hidden"&&(
        <div className={toastPhase==="closing"?"t-exit":"t-appear"} style={{position:"fixed",bottom:28,right:28,zIndex:9998,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:0,pointerEvents:"none"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",marginBottom:6}}>
            <div className={toastPhase==="crack"?"i-crack":"i-pop"} style={{width:42,height:42,borderRadius:12,background:"var(--p)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px var(--glow),0 8px 24px rgba(0,0,0,0.5)",position:"relative",overflow:"hidden"}}>
              {toastPhase==="crack"&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",backgroundSize:"200% 100%",animation:"shim 0.4s ease forwards"}}/>}
              {toastPhase==="crack"&&<div style={{position:"absolute",top:"50%",left:0,height:1,background:"rgba(255,255,255,0.6)",animation:"crack 0.35s ease forwards"}}/>}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>
          {(toastPhase==="open"||toastPhase==="closing")&&(
            <div className={toastPhase==="closing"?"t-rollup":"t-unroll"} style={{width:290,background:"rgba(10,9,24,0.98)",border:"1px solid rgba(139,92,246,0.25)",borderRadius:"14px 4px 14px 14px",padding:"14px 16px",boxShadow:"0 0 40px rgba(139,92,246,0.12),0 20px 60px rgba(0,0,0,0.8)",backdropFilter:"blur(20px)"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                <div className="pdot" style={{marginTop:0}}/>
                <span style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"var(--p2)",textTransform:"uppercase"}}>Heads Up · Beta</span>
              </div>
              <p style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.7)",marginBottom:10}}>
                First couple of queries might be slow — AURA is spinning up its cluster. Hang tight 🚀
              </p>
              <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.15)",display:"flex",justifyContent:"space-between",textTransform:"uppercase"}}>
                <span>Automated Urban Risk Analytics</span><span>v0.1</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
