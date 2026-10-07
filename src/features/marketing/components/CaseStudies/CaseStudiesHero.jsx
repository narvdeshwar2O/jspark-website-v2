"use client";

import { motion } from "framer-motion";

export function CaseStudiesHero() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-screen w-full bg-[#000000] flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-24 overflow-hidden border-b border-zinc-900">
      {/* Tactical Radar Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,34,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,34,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>
      
      {/* HUD Reticles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-zinc-800/30 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#FF5722]/10 rounded-full pointer-events-none"></div>

      <motion.div className="max-w-6xl relative z-10 w-full" variants={container} initial="hidden" animate="show">
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-4">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-[#FF5722] animate-pulse"></span>
            <span className="w-2 h-2 bg-zinc-700"></span>
            <span className="w-2 h-2 bg-zinc-700"></span>
          </div>
          <motion.p variants={item} className="text-[#FF5722] text-[10px] font-mono tracking-[0.4em] uppercase">
            DEPLOYMENT LOGS // CLASSIFIED
          </motion.p>
        </div>

        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
          Tested Under<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Live Fire.</span>
        </motion.h1>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12">
          <motion.p variants={item} className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed max-w-xl border-l-2 border-[#FF5722] pl-6">
            Measured results from air-gapped deployments across India, the Gulf, and Europe. No theoretical limits. Only live operational metrics.
          </motion.p>
          <motion.div variants={item} className="text-right">
            <p className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase mb-1">SYSTEM STATUS</p>
            <p className="text-[#FF5722] text-sm font-mono tracking-widest uppercase">ALL NODES ACTIVE</p>
          </motion.div>
        </div>
      </motion.div>
    </section>);

}