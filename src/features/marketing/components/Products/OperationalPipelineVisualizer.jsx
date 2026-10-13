"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Cpu, 
  Activity, 
  Zap, 
  Radio, 
  ShieldAlert, 
  FileText, 
  Network, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const PIPELINES = {
  "opsunity-hydra": {
    badge: "HYDROMETRIC RADAR PIPELINE",
    nodes: [
      { id: "sat", name: "Satellite & Radar AWS", icon: Radio, metric: "3M+ Streams", status: "INGESTING" },
      { id: "dem", name: "Topography & DEM Grid", icon: Layers, metric: "Point Elevation", status: "CORRELATING" },
      { id: "ai", name: "Hydra AI Prediction Engine", icon: Cpu, metric: "Basin Risk Model", status: "COMPUTING" },
      { id: "alert", name: "DM & SDMA Early Warning", icon: ShieldAlert, metric: "< 6h Lead Time", status: "DISPATCHED" },
    ],
    liveLogs: [
      "14:05:02 · Alaknanda basin satellite precipitation stream acquired",
      "14:12:18 · 3M streams topological runoff model verified",
      "14:20:45 · Catchment discharge threshold: 2,140 m³/s forecast",
      "14:31:10 · Chamoli DM & SDMA Uttarakhand early warning dispatched",
      "14:35:00 · Automatic broadcast triggers sirens & NDRF Battalion 15"
    ],
    stats: [
      { label: "Basin Streams", val: "3,000,000+" },
      { label: "Advance Warning", val: "6 Hours+" },
      { label: "Precision", val: "Point-Level" }
    ]
  },
  "opsvision": {
    badge: "ONTOLOGY INTELLIGENCE MESH",
    nodes: [
      { id: "tele", name: "Dial 112 / CAD / IoT", icon: Database, metric: "150K Daily Events", status: "STREAMING" },
      { id: "fuse", name: "Entity Ontology Graph", icon: Network, metric: "Cross-District Link", status: "SYNCHRONIZED" },
      { id: "pred", name: "Pattern Reasoning Engine", icon: Cpu, metric: "Offender Dossier", status: "ANALYZING" },
      { id: "act", name: "Unit Telemetry & Dispatch", icon: Zap, metric: "46% Faster Response", status: "ACTIVE" },
    ],
    liveLogs: [
      "15:02:11 · Dial 112 emergency call event ingested at state intake",
      "15:02:12 · Caller distress vector mapped to geo-cadastral node",
      "15:02:14 · NAFIS fingerprint match correlates cross-state history",
      "15:02:17 · Closest PRV unit (UP-32-112) allocated & optimal route pushed",
      "15:02:19 · Command centre situational picture refreshed (75/75 dist)"
    ],
    stats: [
      { label: "Citizens Protected", val: "240M+" },
      { label: "Dispatch Response", val: "7:55 min" },
      { label: "Misrouted Calls", val: "4% (-83%)" }
    ]
  },
  "opsmind": {
    badge: "SOVEREIGN BLUEPRINT REASONING",
    nodes: [
      { id: "scan", name: "Engineering Drawings & Manuals", icon: FileText, metric: "Multi-Modal Scan", status: "PARSING" },
      { id: "vec", name: "Spatial Symbol Vectorizer", icon: Layers, metric: "P&IDs / Schematics", status: "EXTRACTING" },
      { id: "rag", name: "Domain Engineering LLM", icon: Cpu, metric: "Air-Gapped Sovereign", status: "INFERRING" },
      { id: "cite", name: "Source-Traced Engineering Query", icon: CheckCircle2, metric: "100% Page Cited", status: "VERIFIED" },
    ],
    liveLogs: [
      "10:14:00 · Ingested 1,400 multi-layer CAD blueprints & P&ID scans",
      "10:14:04 · Extracted component tolerances, symbols & revision history",
      "10:14:06 · Engineering query parsed: 'Verify turbine valve pressure limit'",
      "10:14:07 · Verified against standard: 450 bar threshold flagged on pg. 84",
      "10:14:08 · Output verified with exact drawing coordinates & sheet revision"
    ],
    stats: [
      { label: "Processing Speed", val: "90% Faster" },
      { label: "Hallucination Rate", val: "0.0% (Cited)" },
      { label: "Air-Gapped Mode", val: "100% On-Prem" }
    ]
  },
  "opsunity-ai": {
    badge: "AGENT SWARM ORCHESTRATION",
    nodes: [
      { id: "bare", name: "Bare-Metal Nodes", icon: Database, metric: "Zero Cloud Calls", status: "ONLINE" },
      { id: "swrm", name: "Autonomous Specialist Swarm", icon: Network, metric: "Self-Verifying Tasks", status: "EXECUTING" },
      { id: "mem", name: "Operational State Memory", icon: Cpu, metric: "Infinite Depth", status: "FUSED" },
      { id: "exec", name: "Real-Time Action Triggers", icon: Zap, metric: "Mission Critical", status: "LATENCY < 5ms" },
    ],
    liveLogs: [
      "09:30:00 · Bare-metal air-gapped node cluster verified healthy",
      "09:30:02 · Agent Swarm allocated to multi-agency surveillance stream",
      "09:30:04 · Cross-sensor correlation detected grid load spike (+18%)",
      "09:30:06 · Autonomous corrective dispatch command submitted to field SCADA",
      "09:30:07 · Closed-loop operational verification complete: zero data leakage"
    ],
    stats: [
      { label: "Token Limits", val: "None / Unmetered" },
      { label: "External Calls", val: "0 (Zero Cloud)" },
      { label: "Deployment Time", val: "72 Hours" }
    ]
  }
};

export function OperationalPipelineVisualizer({ productId, productName }) {
  const pipeline = PIPELINES[productId] || PIPELINES["opsvision"];
  const [activeStep, setActiveStep] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  // Cycle active node every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipeline.nodes.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [pipeline.nodes.length]);

  // Cycle live log stream every 2.2 seconds
  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % pipeline.liveLogs.length);
    }, 2200);
    return () => clearInterval(logTimer);
  }, [pipeline.liveLogs.length]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#06080C] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col justify-between backdrop-blur-xl">
      {/* Top HUD Bar */}
      <div className="px-6 py-4 bg-zinc-950/95 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5722] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5722]"></span>
          </span>
          <span className="text-[11px] font-mono text-zinc-200 tracking-[0.2em] uppercase font-bold">
            {pipeline.badge}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[#FF5722] uppercase tracking-wider bg-[#FF5722]/15 border border-[#FF5722]/40 px-2.5 py-1 rounded font-bold shadow-[0_0_10px_rgba(255,87,34,0.2)]">
            AIR-GAPPED
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded font-bold">
            SYS_ONLINE
          </span>
        </div>
      </div>

      {/* Main Interactive Flow Canvas */}
      <div className="p-6 relative bg-gradient-to-b from-[#080A0F] via-[#050608] to-[#080A0F] overflow-hidden flex-1 flex flex-col justify-between">
        {/* Subtle Background Circuit Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Nodes Grid / Flow */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {pipeline.nodes.map((node, idx) => {
            const Icon = node.icon;
            const isActive = activeStep === idx;

            return (
              <motion.div
                key={node.id}
                animate={{
                  borderColor: isActive ? "rgba(255, 87, 34, 0.8)" : "rgba(39, 39, 42, 0.7)",
                  backgroundColor: isActive ? "rgba(255, 87, 34, 0.12)" : "rgba(12, 14, 20, 0.75)",
                  scale: isActive ? 1.02 : 1,
                }}
                transition={{ duration: 0.35 }}
                className={`p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between min-h-[96px] transition-all cursor-default ${
                  isActive ? "shadow-[0_0_25px_rgba(255,87,34,0.25)]" : ""
                }`}
              >
                {/* Active scan glow & pulse */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF5722]/25 rounded-full blur-2xl pointer-events-none"
                  />
                )}

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive ? "bg-[#FF5722] text-black shadow-[0_0_15px_rgba(255,87,34,0.6)]" : "bg-zinc-800/80 text-zinc-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                      STEP 0{idx + 1}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isActive 
                      ? "bg-[#FF5722] text-black shadow-[0_0_12px_rgba(255,87,34,0.5)]" 
                      : "bg-zinc-900/90 text-zinc-500 border border-zinc-800"
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="relative z-10 pt-1">
                  <h5 className="text-white text-sm font-bold tracking-tight truncate">{node.name}</h5>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#FF5722]"></span>
                    {node.metric}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-zinc-800/80 mb-5 relative z-10">
          {pipeline.stats.map((s, i) => (
            <div key={i} className="bg-black/70 border border-zinc-800/90 p-3 rounded-xl text-center shadow-inner group hover:border-[#FF5722]/40 transition-colors">
              <div className="text-[#FF5722] font-mono text-base md:text-lg font-black tracking-tight">{s.val}</div>
              <div className="text-zinc-400 font-mono text-[9px] uppercase tracking-widest mt-0.5 truncate">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Real-time Streaming Terminal Console */}
        <div className="bg-[#020305] border border-zinc-850 rounded-xl p-4 relative z-10 font-mono text-[11px] shadow-2xl">
          <div className="flex items-center justify-between mb-2.5 border-b border-white/[0.08] pb-2 text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Activity className="w-3.5 h-3.5 text-[#FF5722] animate-pulse" />
              LIVE TELEMETRY FEED
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 0 EXTERNAL LEAKS
            </span>
          </div>

          <div className="h-12 overflow-hidden relative flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={logIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="text-zinc-300 leading-snug flex items-center gap-2.5"
              >
                <ArrowRight className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                <span className="text-zinc-400 truncate">
                  <span className="text-[#FF5722] font-bold">
                    {pipeline.liveLogs[logIndex].split(" · ")[0]}
                  </span>
                  {" · "}
                  <span className="text-zinc-200">
                    {pipeline.liveLogs[logIndex].split(" · ")[1]}
                  </span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="px-6 py-3.5 bg-zinc-950/95 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
          REAL-TIME SIMULATION
        </span>
        <span className="text-[#FF5722] font-bold text-[10px] uppercase tracking-widest">
          {productName}
        </span>
      </div>
    </div>
  );
}
