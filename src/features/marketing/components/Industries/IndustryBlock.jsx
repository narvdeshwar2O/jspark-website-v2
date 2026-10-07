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
    <motion.div
      id={data.id}
      className="flex flex-col w-full h-full p-8 md:p-10 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-zinc-700 transition-colors duration-500"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Decorative subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* Main Info */}
      <div className="flex flex-col gap-8 flex-grow relative z-10">
        <motion.div variants={item}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6 leading-tight drop-shadow-lg">
            {data.title}
          </h2>

          <div className="mb-6">
            <span className="inline-block bg-[#FF5722]/10 border border-[#FF5722]/50 text-[#FF5722] text-[10px] md:text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-sm font-bold shadow-[0_0_15px_rgba(255,87,34,0.1)]">
              Powered by: {data.products}
            </span>
          </div>

          <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light drop-shadow-sm">
            {data.body}
          </p>
        </motion.div>

        {/* Details list */}
        {data.whatYouGet && data.whatYouGet.length > 0 &&
        <motion.div variants={item} className="mb-2">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full shadow-[0_0_8px_#FF5722]"></span> Core Capabilities
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {data.whatYouGet.map((pt, i) =>
              <li key={i} className="text-zinc-200 text-sm md:text-base leading-relaxed pl-3 border-l-2 border-[#FF5722]/50">{pt}</li>
            )}
          </ul>
        </motion.div>
        }

        {/* Bottom Proof & Configs */}
        {(data.proof || data.configurations) &&
        <motion.div variants={item} className="mt-auto p-6 border border-white/5 bg-white/5 rounded-xl backdrop-blur-sm shadow-inner flex flex-col gap-4">
            {data.proof &&
            <div>
              <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1.5 font-bold">Deployed Proof</p>
              <p className="text-zinc-100 font-mono text-xs md:text-sm leading-relaxed">{data.proof}</p>
            </div>
            }
            {data.configurations &&
            <div>
              <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1.5 font-bold">Configurations</p>
              <p className="text-zinc-100 font-mono text-xs md:text-sm leading-relaxed">{data.configurations}</p>
            </div>
            }
          </motion.div>
        }
      </div>
    </motion.div>
  );
}
