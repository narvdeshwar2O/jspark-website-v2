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
    <section id={data.id} className="relative w-full bg-[#050505] even:bg-[#000000] border-t border-zinc-900 py-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        <div className="flex flex-col lg:flex-row items-stretch">

          {/* Left Column: Sticky HUD */}
          <div className="w-full lg:w-5/12 lg:border-r border-zinc-900 lg:pr-16 py-24 lg:sticky top-0 lg:h-screen flex flex-col justify-center">
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
                <span className="text-zinc-600 font-mono text-[10px] tracking-[0.2em] uppercase">TARGET // {data.num}</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full animate-ping absolute"></span>
                  <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full relative"></span>
                  <span className="text-[#FF5722] font-mono text-[9px] tracking-widest uppercase">LIVE</span>
                </div>
              </div>

              <motion.h2 variants={item} className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 uppercase">
                {data.client}
              </motion.h2>
              <motion.p variants={item} className="text-[#FF5722] font-mono text-xs tracking-widest uppercase mb-12">
                Engine: {data.product}
              </motion.p>

              <motion.div variants={item} className="bg-[#000000] border border-zinc-800 p-6 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722]/50 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <p className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase mb-4 border-b border-zinc-900 pb-2">Verified Metrics</p>
                <div className="flex flex-col gap-4">
                  {data.numbers.split(" · ").map((stat, i) =>
                  <div key={i} className="flex items-start gap-3">
                      <span className="text-[#FF5722] font-mono mt-0.5">❯</span>
                      <span className="text-white font-mono text-sm leading-tight">{stat}</span>
                    </div>
                  )}
                </div>
              </motion.div>

            </motion.div>
          </div>

          {/* Right Column: Scrolling Narrative */}
          <div className="w-full lg:w-7/12 lg:pl-16 py-24 flex flex-col gap-16">
            <motion.h3 variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight">
              {data.headline}
            </motion.h3>

            {/* Terminal Block: Before */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l border-zinc-800 pl-6">
              <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase mb-3">[ SYSTEM_STATE :: BEFORE ]</p>
              <p className="text-zinc-400 text-base leading-relaxed">{data.before}</p>
            </motion.div>

            {/* Terminal Block: Action */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l-2 border-[#FF5722] pl-6 bg-[#FF5722]/5 py-4 pr-4">
              <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-3">[ EXECUTION :: WHAT {data.product.toUpperCase()} DID ]</p>
              <p className="text-white text-base leading-relaxed">{data.action}</p>
            </motion.div>

            {/* Terminal Block: After */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l border-zinc-800 pl-6">
              <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase mb-3">[ SYSTEM_STATE :: OPTIMISED ]</p>
              <ul className="space-y-3 mb-6">
                {data.afterList.map((pt, i) =>
                <li key={i} className="text-zinc-300 text-sm leading-relaxed flex items-start gap-3 font-mono">
                    <span className="text-zinc-600 mt-0.5">└─</span>
                    {pt}
                  </li>
                )}
              </ul>
              {data.conclusion &&
              <p className="text-white font-bold text-sm tracking-wide uppercase mt-8">{data.conclusion}</p>
              }
            </motion.div>

            {data.modules &&
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }} className="pt-8 border-t border-zinc-900">
                <p className="text-zinc-600 font-mono text-[9px] tracking-widest uppercase mb-4">ACTIVE MODULES</p>
                <div className="flex flex-wrap gap-2">
                  {data.modules.split(" · ").map((mod, i) =>
                <span key={i} className="border border-zinc-800 text-zinc-400 font-mono text-[9px] tracking-widest px-3 py-1.5 uppercase bg-[#000000]">
                      {mod}
                    </span>
                )}
                </div>
              </motion.div>
            }

          </div>
        </div>
      </div>
    </section>);

}
