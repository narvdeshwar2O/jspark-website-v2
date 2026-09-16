"use client";

import { motion } from "framer-motion";

export function AboutCTA() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-[#000000] border-t border-zinc-900 py-32 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          <motion.p variants={item} className="text-[#FF5722] text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-3 font-mono">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            GET IN TOUCH
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          </motion.p>

          <motion.h2 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-12 leading-tight">
            Built for the Operations a Nation<br className="hidden md:block" /> Cannot Afford to Lose
          </motion.h2>

          <motion.div variants={item}>
            <a href="/contact" className="relative inline-flex items-center justify-center px-10 py-5 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-white transition-colors duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
              <div className="absolute top-0 left-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <div className="absolute top-0 right-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
              <span className="relative z-10 text-[12px] font-bold tracking-[0.2em] uppercase font-mono">Talk to the Founders</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}