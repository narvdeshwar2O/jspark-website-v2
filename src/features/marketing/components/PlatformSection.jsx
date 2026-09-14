"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function PlatformSection() {
  const [opsMindHovered, setOpsMindHovered] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-[#000000] py-32 border-t border-zinc-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6 uppercase">
            One Platform. <br className="hidden md:block" />
            <span className="text-[#FF5722]">Every Mission.</span>
          </h2>
        </div>

        <motion.div
          className="flex flex-col lg:flex-row gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {/* OpsUnity AI — shrinks when OpsMind is hovered */}
          <motion.div
            variants={item}
            animate={{ flex: opsMindHovered ? 1 : 2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-10 md:p-16 border border-[#FF5722]/30 bg-gradient-to-br from-[#FF5722]/10 to-transparent overflow-hidden group min-w-0">
            
            <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#FF5722]/20 rounded-full blur-[100px] pointer-events-none"></div>
            <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF5722]"></span>
              FOUNDATION BANNER
            </p>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6">OpsUnity AI</h3>
            <p className="text-zinc-300 text-sm md:text-lg leading-relaxed max-w-2xl mb-12">
              The sovereign foundation. Agent swarms, quant engines, mathematical models, and language models with no token limits and no external calls. Every JSPARK product runs on it.
            </p>
            <a href="#opsunity-ai" className="relative inline-flex items-center justify-center px-8 py-4 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-white transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF5722]/60"></div>
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
              <div className="absolute top-0 right-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
              <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
              <span className="relative z-10 text-[11px] font-bold tracking-[0.15em] uppercase whitespace-nowrap">Explore OpsUnity AI</span>
            </a>
          </motion.div>

          {/* OpsMind — expands to flex-2 on hover */}
          <motion.div
            variants={item}
            animate={{ flex: opsMindHovered ? 2 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setOpsMindHovered(true)}
            onMouseLeave={() => setOpsMindHovered(false)}
            className="relative p-10 border border-zinc-800 bg-[#050505] hover:bg-[#0A0A0A] transition-colors group flex flex-col min-w-0 cursor-pointer">
            
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[400px] transition-all duration-1000 ease-out z-0"></div>
            <p className="text-zinc-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 relative z-10">SUPPORTING PRODUCT</p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2 relative z-10">OpsMind</h3>
            <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-6 relative z-10">Sovereign Document Intelligence</p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-auto relative z-10">
              Reads engineering drawings, schematics, and archives at the level of a domain engineer. Queried like a conversation. Every answer traced to its source.
            </p>
            <a href="#opsmind" className="mt-12 relative inline-flex self-start items-center justify-center px-6 py-3 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors duration-300 z-10">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-600/60"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-600/60"></div>
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-zinc-600/60"></div>
              <div className="absolute top-0 right-0 w-[1px] h-2 bg-zinc-600/60"></div>
              <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-zinc-600/60"></div>
              <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-zinc-600/60"></div>
              <span className="relative z-10 text-[10px] font-bold tracking-[0.15em] uppercase">Explore OpsMind</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}