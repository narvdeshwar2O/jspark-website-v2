"use client";

import { motion } from "framer-motion";











export function CaseStudyMinorsGrid({ data }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-[#000000] border-t border-zinc-900 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-zinc-800 pb-8">
          <div>
            <p className="text-[#FF5722] text-[10px] font-mono tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF5722]"></span>
              ADDITIONAL DEPLOYMENTS
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">
              Global Operations Log
            </h2>
          </div>
          <div className="text-zinc-600 font-mono text-[10px] tracking-[0.2em] uppercase text-right hidden md:block">
            <p>QUERY_MATCH: {data.length} RECORDS</p>
            <p>STATUS: VERIFIED</p>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {data.map((study) =>
          <motion.div key={study.id} variants={item} className="group relative bg-[#050505] border border-zinc-800 hover:border-[#FF5722]/40 p-8 flex flex-col transition-colors duration-500 overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-700 group-hover:border-[#FF5722] transition-colors"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-700 group-hover:border-[#FF5722] transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-700 group-hover:border-[#FF5722] transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-700 group-hover:border-[#FF5722] transition-colors"></div>

              {/* Hover scanline */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722]/30 -translate-y-[100px] group-hover:translate-y-[500px] transition-transform duration-1000 ease-in-out"></div>

              <div className="mb-6 flex-1">
                <p className="text-zinc-400 font-mono text-[9px] tracking-[0.2em] uppercase mb-2">TARGET // {study.num}</p>
                <h3 className="text-white font-black text-xl leading-tight mb-2 uppercase">{study.client}</h3>
                <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-4">{study.product}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{study.body}</p>
              </div>

              <div className="pt-6 border-t border-zinc-800/50 mt-auto">
                <p className="text-zinc-600 font-mono text-[9px] tracking-widest uppercase mb-3">IMPACT METRICS</p>
                <div className="flex flex-col gap-2">
                  {study.numbers.split(" · ").map((stat, i) =>
                <div key={i} className="flex items-start gap-2">
                      <span className="text-[#FF5722] font-mono text-xs">└─</span>
                      <span className="text-zinc-300 font-mono text-[10px] uppercase leading-tight">{stat}</span>
                    </div>
                )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}
