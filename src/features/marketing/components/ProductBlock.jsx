"use client";

import { motion } from "framer-motion";














export function ProductBlock({ product }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id={product.id} className="relative w-full bg-[#050505] even:bg-[#000000] border-t border-zinc-900 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          className={`flex flex-col ${product.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24`}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {/* Left / Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.p variants={item} className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
              <span className="w-8 h-[1px] bg-[#FF5722]"></span>
              {product.eyebrow}
            </motion.p>
            <motion.h2 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-8 leading-tight">
              {product.headline}
            </motion.h2>
            <motion.p variants={item} className="text-zinc-400 text-base md:text-lg leading-relaxed mb-12">
              {product.body}
            </motion.p>
            
            {product.numbers &&
            <motion.div variants={item} className="mb-12 p-6 border border-zinc-800 bg-[#000000]">
                <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase mb-3">Scale & Impact</p>
                <p className="text-white font-mono text-xs md:text-sm leading-relaxed">{product.numbers}</p>
              </motion.div>
            }
          </div>

          {/* Right / Details Content */}
          <div className="flex-1 flex flex-col gap-12">
            <motion.div variants={item}>
              <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full"></span> What It Does
              </h3>
              <ul className="space-y-4">
                {product.whatItDoes.map((pt, i) =>
                <li key={i} className="text-zinc-400 text-sm leading-relaxed pl-4 border-l border-zinc-800">{pt}</li>
                )}
              </ul>
            </motion.div>

            <motion.div variants={item}>
              <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#FF5722] rounded-full"></span> Built For
              </h3>
              <ul className="space-y-4">
                {product.builtFor.map((pt, i) =>
                <li key={i} className="text-zinc-400 text-sm leading-relaxed pl-4 border-l border-zinc-800">{pt}</li>
                )}
              </ul>
            </motion.div>

            {(product.configurations || product.deployedAt) &&
            <motion.div variants={item} className="flex flex-col gap-4 mt-4 pt-8 border-t border-zinc-900">
                {product.configurations &&
              <p className="text-zinc-500 font-mono text-xs leading-relaxed">
                    <strong className="text-[#FF5722] uppercase tracking-widest">Configurations:</strong> {product.configurations}
                  </p>
              }
                {product.deployedAt &&
              <p className="text-zinc-500 font-mono text-xs leading-relaxed">
                    <strong className="text-[#FF5722] uppercase tracking-widest">Deployed At:</strong> {product.deployedAt}
                  </p>
              }
              </motion.div>
            }
          </div>
        </motion.div>
      </div>
    </section>);

}