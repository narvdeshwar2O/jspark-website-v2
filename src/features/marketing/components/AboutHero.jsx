"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export function AboutHero() {
  return (
    <section className="relative min-h-screen w-full bg-[#000000] flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden border-b border-zinc-900">
      {/* Glow orb */}
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-[#FF5722]/8 rounded-full blur-[150px] pointer-events-none"></div>

      {/* HUD corner brackets */}
      <div className="absolute top-8 left-8 w-5 h-5 border-t border-l border-zinc-800"></div>
      <div className="absolute top-8 right-8 w-5 h-5 border-t border-r border-zinc-800"></div>
      <div className="absolute bottom-8 left-8 w-5 h-5 border-b border-l border-zinc-800"></div>
      <div className="absolute bottom-8 right-8 w-5 h-5 border-b border-r border-zinc-800"></div>

      <motion.div
        className="max-w-5xl relative z-10"
        variants={container}
        initial="hidden"
        animate="show">

        <motion.p variants={item} className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3 font-mono">
          <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          WHO WE ARE
        </motion.p>

        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-white mb-8 leading-[1.0]">
          Sovereign AI for<br />Critical Infrastructure
        </motion.h1>

        <motion.p variants={item} className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
          JSPARK AI is India&apos;s sovereign deep-tech company building the AI operating system for the institutions that cannot afford a single failure.
        </motion.p>
      </motion.div>

      {/* Bottom status bar */}
      <div className="absolute bottom-8 left-6 md:left-12 lg:left-24 text-zinc-400 text-[9px] font-mono tracking-widest uppercase">
        EST. DEC 2024 &middot; NOIDA, INDIA
      </div>
      <div className="absolute bottom-8 right-6 md:right-12 lg:right-24 text-zinc-400 text-[9px] font-mono tracking-widest uppercase">
        INDIA &middot; GCC &middot; EUROPE
      </div>
    </section>);

}
