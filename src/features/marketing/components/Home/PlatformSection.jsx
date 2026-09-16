"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const supportingProducts = [
  {
    id: "hydra",
    name: "OpsUnity Hydra",
    tag: "AI Hydrology Model",
    description: "Forecasts rainfall, floods, flash floods, and rainfall-induced landslides at basin level, hours before impact. Mapped over 3 million rivers and streams.",
    buttonText: "Explore Hydra"
  },
  {
    id: "opsvision",
    name: "OpsVision",
    tag: "Sovereign Operational Intelligence",
    description: "One living model of your entire operation, every asset, event, signal, and record fused into a single intelligence picture. Placed response vehicles before the call.",
    buttonText: "Explore OpsVision"
  },
  {
    id: "opsmind",
    name: "OpsMind",
    tag: "Sovereign Document Intelligence",
    description: "Reads engineering drawings, schematics, and archives at the level of a domain engineer. Queried like a conversation. Every answer traced to its source.",
    buttonText: "Explore OpsMind"
  }
];

export function PlatformSection() {

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
          className="flex flex-col gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {/* Foundation Product: OpsUnity AI */}
          <motion.div
            variants={item}
            className="relative p-10 md:p-16 border border-[#FF5722]/30 bg-gradient-to-br from-[#FF5722]/10 to-transparent overflow-hidden group rounded-2xl">

            <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#FF5722]/20 rounded-full blur-[100px] pointer-events-none"></div>
            <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF5722]"></span>
              FOUNDATION AI model
            </p>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">OpsUnity AI</h3>
            <p className="text-zinc-300 text-sm md:text-xl leading-relaxed max-w-3xl mb-12">
              The sovereign foundation. Agent swarms, quant engines, mathematical models, and language models with no token limits and no external calls. Every JSPARK product runs on it.
            </p>
            <a href="#opsunity-ai" className="relative inline-flex items-center justify-center px-8 py-4 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-white transition-colors duration-300 rounded-lg border border-[#FF5722]/50">
              <span className="relative z-10 text-[11px] font-bold tracking-[0.15em] uppercase whitespace-nowrap">Explore OpsUnity AI</span>
            </a>
          </motion.div>

          {/* Supporting Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportingProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                className="relative p-10 border border-zinc-800 bg-[#050505] hover:bg-[#0A0A0A] transition-colors group flex flex-col rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[400px] transition-all duration-1000 ease-out z-0"></div>
                <p className="text-zinc-400 text-[9px] font-bold tracking-[0.3em] uppercase mb-4 relative z-10">SUPPORTING PRODUCT</p>
                <h3 className="text-3xl font-black tracking-tighter text-white mb-2 relative z-10">{product.name}</h3>
                <p className="text-[#FF5722] font-mono text-[9px] tracking-widest uppercase mb-6 relative z-10">{product.tag}</p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-12 relative z-10 flex-grow">
                  {product.description}
                </p>
                <a href={`#${product.id}`} className="relative inline-flex self-start items-center justify-center px-6 py-3 bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors duration-300 rounded border border-zinc-700 z-10">
                  <span className="relative z-10 text-[10px] font-bold tracking-[0.15em] uppercase">{product.buttonText}</span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
