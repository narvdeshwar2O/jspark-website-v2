"use client";

import { motion } from "framer-motion";












export function IndustryBlock({ data }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id={data.id} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-32 border-t border-zinc-900">

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

      <div className="mx-auto px-6 md:px-12 lg:px-24 w-full relative z-10 flex">
        {/* Content Panel */}
        <motion.div
          className="w-full lg:w-[95%] mx-auto p-10 md:p-16 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Main Info */}
          <div className="flex flex-col gap-10">
            <motion.div variants={item}>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight drop-shadow-lg">
                {data.title}
              </h2>

              <div className="mb-6">
                <span className="inline-block bg-[#FF5722]/20 border border-[#FF5722] text-[#FF5722] text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-sm font-bold shadow-[0_0_15px_rgba(255,87,34,0.15)]">
                  Powered by: {data.products}
                </span>
              </div>

              <p className="text-zinc-200 text-lg md:text-xl leading-relaxed font-light drop-shadow-sm">
                {data.body}
              </p>
            </motion.div>

            {/* Details list (if available) */}
            {data.whatYouGet && data.whatYouGet.length > 0 &&
            <motion.div variants={item} className="mb-2">
              <h3 className="text-white font-bold text-xl mb-5 flex items-center gap-3">
                <span className="w-2 h-2 bg-[#FF5722] rounded-full shadow-[0_0_10px_#FF5722]"></span> Core Capabilities
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {data.whatYouGet.map((pt, i) =>
                  <li key={i} className="text-zinc-100 text-base leading-relaxed pl-4 border-l-2 border-[#FF5722]/60">{pt}</li>
                )}
              </ul>
            </motion.div>
            }

            {(data.proof || data.configurations) &&
            <motion.div variants={item} className="p-8 border border-white/10 bg-white/5 rounded-2xl mt-2 backdrop-blur-sm shadow-inner">
                {data.proof &&
                <div className="mb-6 last:mb-0">
                  <p className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2 font-semibold">Deployed Proof</p>
                  <p className="text-white font-mono text-sm leading-relaxed">{data.proof}</p>
                </div>
                }
                {data.configurations &&
                <div className="last:mb-0">
                  <p className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase mb-2 font-semibold mt-4">Configurations</p>
                  <p className="text-white font-mono text-sm leading-relaxed">{data.configurations}</p>
                </div>
                }
              </motion.div>
            }
          </div>
        </motion.div>
      </div>
    </section>
  );

}
