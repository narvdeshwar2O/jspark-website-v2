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
    <section id={data.id} className="relative w-full bg-[#050505] even:bg-[#000000] border-t border-zinc-900 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          className={`flex flex-col ${data.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24`}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {/* Main Info */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.h2 variants={item} className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6 leading-tight">
              {data.title}
            </motion.h2>
            
            <motion.div variants={item} className="mb-8">
              <span className="inline-block bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] text-[10px] font-mono tracking-widest uppercase px-3 py-1.5">
                Powered by: {data.products}
              </span>
            </motion.div>

            <motion.p variants={item} className="text-zinc-400 text-base md:text-lg leading-relaxed mb-12">
              {data.body}
            </motion.p>
            
            {(data.proof || data.configurations) &&
            <motion.div variants={item} className="p-6 border border-zinc-800 bg-[#000000]">
                {data.proof &&
              <>
                    <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase mb-2">Deployed Proof</p>
                    <p className="text-white font-mono text-xs leading-relaxed">{data.proof}</p>
                  </>
              }
                {data.configurations &&
              <>
                    <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase mb-2 mt-4">Configurations</p>
                    <p className="text-white font-mono text-xs leading-relaxed">{data.configurations}</p>
                  </>
              }
              </motion.div>
            }
          </div>

          {/* Details list (if available) */}
          {data.whatYouGet && data.whatYouGet.length > 0 &&
          <div className="flex-1 flex flex-col justify-center">
              <motion.div variants={item}>
                <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full"></span> What You Get
                </h3>
                <ul className="space-y-4">
                  {data.whatYouGet.map((pt, i) =>
                <li key={i} className="text-zinc-400 text-sm leading-relaxed pl-4 border-l border-zinc-800">{pt}</li>
                )}
                </ul>
              </motion.div>
            </div>
          }
        </motion.div>
      </div>
    </section>);

}