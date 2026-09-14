"use client";

import { motion } from "framer-motion";











export function CaseStudyMinor({ data }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id={data.id} className="relative w-full bg-[#050505] even:bg-[#000000] border-t border-zinc-900 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {/* Left Col: Info */}
          <div className="flex flex-col justify-center">
            <motion.p variants={item} className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
              Case Study {data.num} <span className="w-8 h-[1px] bg-[#FF5722]"></span> {data.client}
            </motion.p>
            <motion.h2 variants={item} className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-6 leading-tight">
              {data.headline}
            </motion.h2>
            <motion.div variants={item} className="mb-6">
              <span className="inline-block bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] text-[10px] font-mono tracking-widest uppercase px-3 py-1.5">
                Product: {data.product}
              </span>
            </motion.div>
            <motion.p variants={item} className="text-zinc-400 text-base leading-relaxed">
              {data.body}
            </motion.p>
          </div>

          {/* Right Col: Numbers */}
          <div className="flex lg:justify-end">
            <motion.div variants={item} className="bg-[#0A0A0A] border border-zinc-800 p-8 w-full lg:w-4/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[200px] transition-all duration-700 ease-out"></div>
              
              <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-4">Measured Impact</p>
              <div className="space-y-4">
                {data.numbers.split(" · ").map((stat, i) =>
                <div key={i} className="flex items-start gap-3">
                    <span className="text-zinc-700 font-black text-lg leading-none mt-1">/</span>
                    <span className="text-white font-mono text-sm leading-relaxed">{stat}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>);

}