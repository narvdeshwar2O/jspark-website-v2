"use client";

import { motion } from "framer-motion";

export function CaseStudyMajor({ data }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id={data.id} className="relative w-full bg-[#050505] even:bg-[#000000] border-t border-zinc-900 py-12 lg:py-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-stretch">

          {/* Left Column: Sticky HUD */}
          <div className="w-full lg:w-5/12 lg:border-r border-zinc-900 lg:pr-16 py-12 lg:py-24 lg:sticky top-0 lg:h-screen flex flex-col justify-center">
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <span className="text-zinc-300 font-mono text-[10px] tracking-[0.2em] uppercase">
                  CASE STUDY // {data.num}
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full animate-ping absolute"></span>
                  <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full relative"></span>
                  <span className="text-[#FF5722] font-mono text-[9px] tracking-widest uppercase">PRODUCTION</span>
                </div>
              </div>

              {data.domain && (
                <p className="text-[#FF5722] font-mono text-[10px] tracking-[0.25em] uppercase mb-2">
                  {data.domain}
                </p>
              )}

              <motion.h2 variants={item} className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white mb-3 uppercase">
                {data.client}
              </motion.h2>

              <motion.p variants={item} className="text-zinc-400 font-mono text-xs tracking-wider uppercase mb-8">
                Platform: <span className="text-white font-medium">{data.product}</span>
              </motion.p>

              {/* Verified Metrics Card */}
              <motion.div variants={item} className="bg-[#000000] border border-zinc-800 p-6 relative group overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-px bg-[#FF5722]/50 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                  <p className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Core Impact</p>
                  {data.highlightMetric && (
                    <span className="text-[#FF5722] font-mono text-[10px] font-bold tracking-wider">{data.highlightMetric}</span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {data.kpis?.map((k, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 text-xs border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                      <span className="text-zinc-400 font-mono text-[11px] truncate">{k.kpi}</span>
                      <span className="text-[#FF5722] font-mono font-bold shrink-0">{k.improvement}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {data.modules && (
                <motion.div variants={item} className="mt-6 flex flex-wrap gap-1.5">
                  {data.modules.split(", ").map((mod, i) => (
                    <span key={i} className="border border-zinc-800 text-zinc-400 font-mono text-[9px] tracking-wider px-2.5 py-1 uppercase bg-white/[0.02] rounded">
                      {mod}
                    </span>
                  ))}
                </motion.div>
              )}

            </motion.div>
          </div>

          {/* Right Column: Detailed Narrative & Evidence */}
          <div className="w-full lg:w-7/12 lg:pl-16 py-12 lg:py-24 flex flex-col gap-12">
            <motion.h3 variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl md:text-4xl font-black tracking-tighter text-white leading-tight">
              {data.headline}
            </motion.h3>

            {data.summary && (
              <motion.p variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
                {data.summary}
              </motion.p>
            )}

            {/* Problem Section */}
            {data.problems?.length > 0 && (
              <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l-2 border-red-500/60 pl-6 bg-red-500/[0.02] py-4 pr-4 rounded-r-lg">
                <p className="text-red-400 font-mono text-[10px] tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                  [ PROBLEM :: BEFORE JSPARK AI ]
                </p>
                <ul className="space-y-2.5">
                  {data.problems.map((prob, i) => (
                    <li key={i} className="text-zinc-300 text-sm leading-relaxed flex items-start gap-3">
                      <span className="text-red-400/70 font-mono text-xs mt-0.5">✕</span>
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* What Was Deployed: Architecture Layers */}
            {data.deployedLayers?.length > 0 && (
              <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l-2 border-[#FF5722] pl-6 bg-[#FF5722]/[0.03] py-5 pr-4 rounded-r-lg">
                <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full"></span>
                  [ ARCHITECTURE :: WHAT JSPARK AI DEPLOYED ]
                </p>
                <div className="space-y-4">
                  {data.deployedLayers.map((layer, i) => (
                    <div key={i} className="bg-black/40 border border-zinc-800/80 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <span className="text-white font-mono text-xs font-bold uppercase text-[#FF5722]">{layer.layer}</span>
                        <span className="text-zinc-400 font-mono text-[10px] tracking-wider uppercase bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">{layer.function}</span>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">{layer.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Outcome KPI Table */}
            {data.kpis?.length > 0 && (
              <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l-2 border-emerald-500/70 pl-6 bg-emerald-500/[0.02] py-5 pr-4 rounded-r-lg">
                <p className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  [ OUTCOME :: VERIFIED KPI RESULTS ]
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                        <th className="pb-3 pr-4 font-semibold">KPI Dimension</th>
                        <th className="pb-3 px-3 font-semibold text-zinc-500">Before</th>
                        <th className="pb-3 px-3 font-semibold text-zinc-300">After (JSPARK)</th>
                        <th className="pb-3 pl-3 font-semibold text-[#FF5722]">Improvement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {data.kpis.map((k, i) => (
                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-2.5 pr-4 text-zinc-300 font-medium">{k.kpi}</td>
                          <td className="py-2.5 px-3 text-zinc-500 line-through decoration-zinc-700">{k.before}</td>
                          <td className="py-2.5 px-3 text-white font-bold">{k.after}</td>
                          <td className="py-2.5 pl-3 text-emerald-400 font-bold">{k.improvement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Key Takeaway Statement */}
            {data.keyTakeaway && (
              <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="p-5 bg-gradient-to-r from-zinc-900/60 to-black border border-zinc-800 rounded-xl">
                <p className="text-white text-sm md:text-base leading-relaxed font-light italic">
                  &ldquo;{data.keyTakeaway}&rdquo;
                </p>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
