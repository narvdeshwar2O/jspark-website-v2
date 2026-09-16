"use client";

import { motion } from "framer-motion";

export function IndustriesHero() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-screen w-full bg-[#000000] flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden border-b border-zinc-900 pt-24">
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF5722]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div
        className="max-w-5xl relative z-10 flex flex-col items-center text-center mx-auto"
        variants={container}
        initial="hidden"
        animate="show">
        
        <motion.p variants={item} className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3 font-mono">
          <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          INDUSTRIES
          <span className="w-8 h-[1px] bg-[#FF5722]"></span>
        </motion.p>

        <motion.h1 variants={item} className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-tight">
          Built for the Operations a Nation Cannot Afford to Lose
        </motion.h1>

        <motion.p variants={item} className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
          One sovereign platform, proven across policing, crime records, disaster management, power, cities, and fleets.
        </motion.p>
      </motion.div>
    </section>);

}