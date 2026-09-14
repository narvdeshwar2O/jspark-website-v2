"use client";

import { motion } from "framer-motion";

export function ClosingCTA() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-[#050505] py-32 border-t border-zinc-900 overflow-hidden">
      {/* Orange glow orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          <motion.p variants={item} className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            READY TO DEPLOY
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          </motion.p>

          <motion.h2 variants={item} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8 leading-tight">
            Your Data. Your Walls.<br />
            <span className="text-[#FF5722]">Your Intelligence.</span>
          </motion.h2>

          <motion.p variants={item} className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mb-16">
            Bring us your hardest operation. We will show it to you understood end to end, on your environment, your data, and your threat model. Mission-ready in 72 hours. NDA-first. On-site or in our air-gapped lab.
          </motion.p>

          {/* Stat pills */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-6 mb-16 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            {["Mission-ready in 72 hours", "NDA-first", "On-site or air-gapped lab", "Zero cloud dependency"].map((pill, i) =>
            <div key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#FF5722]"></span>
                {pill}
              </div>
            )}
          </motion.div>

          <motion.div variants={item}>
            <a href="/contact" className="relative group inline-flex items-center justify-center px-12 py-5 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-white transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
              <div className="absolute top-0 left-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <div className="absolute top-0 right-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <span className="relative z-10 text-[13px] font-bold tracking-[0.2em] uppercase">Request a Demonstration</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}