"use client";

import { motion } from "framer-motion";

const pillars = [
{ num: "01", title: "Sovereignty", sub: "Air-gapped by design", body: "Zero external dependencies. Runs fully offline on your hardware with military-grade cryptographic controls and full audit integrity." },
{ num: "02", title: "Intelligence", sub: "Unmetered, unlimited", body: "Purpose-built engines for real-time mission-critical decisions and forecasting. No token limits, no external calls, no ceiling on reasoning depth." },
{ num: "03", title: "Compliance", sub: "4 certifications, 100% sovereign", body: "ISO/IEC 42001, ISO 27001, ISO 9001, and CMMI Level 3. Designed, built, and deployed in India." },
{ num: "04", title: "Scale", sub: "Proven at national level", body: "Live across 75 districts and 36 states and Union Territories. Built for nations, deployed for nations." }];


export function AboutPillars() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-[#050505] border-t border-zinc-900 py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-16">
          <p className="text-[#FF5722] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            FOUNDATION
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Four Founding Pillars</h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {pillars.map((p) =>
          <motion.div
            key={p.num}
            variants={item}
            className="group relative border border-zinc-800 hover:border-[#FF5722]/30 bg-[#000000] p-8 overflow-hidden transition-colors duration-300">
            
              {/* Expanding top accent */}
              <div className="absolute top-0 left-0 h-[1px] w-0 bg-[#FF5722] group-hover:w-full transition-all duration-500 ease-out"></div>

              <div className="flex items-start gap-6">
                <span className="text-[#FF5722] font-mono text-xs tracking-widest shrink-0 mt-1">{p.num}</span>
                <div>
                  <h3 className="text-white font-black text-xl tracking-tight mb-1">{p.title}</h3>
                  <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-4">{p.sub}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}