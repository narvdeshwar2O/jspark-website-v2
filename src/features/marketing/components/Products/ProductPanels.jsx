"use client";

import { motion } from "framer-motion";

const products = [
  {
    id: "opsunity-hydra",
    eyebrow: "INDIA'S FIRST AI HYDROLOGY MODEL",
    headline: "The State Sees the Flood Before the River Does",
    body: "Hydra forecasts rainfall, floods, flash floods, and rainfall-induced landslides at basin level, hours before impact.",
    numbers: ["3M+ rivers mapped", "6 hours+ advance warning", "4 hazards, one model", "IMD verified"],
    imageFirst: false
  },
  {
    id: "opsvision",
    eyebrow: "SOVEREIGN OPERATIONAL INTELLIGENCE",
    headline: "The Unit Is Already There When the Call Comes In",
    body: "One living model of your entire operation, every asset, event, signal, and record fused into a single intelligence picture.",
    numbers: ["24 Cr citizens protected", "1.34 Cr offender records", "23% to 4% misrouted calls", "46% faster response"],
    imageFirst: true
  },
  {
    id: "opsmind",
    eyebrow: "SOVEREIGN DOCUMENT INTELLIGENCE",
    headline: "Reads What Machines Cannot",
    body: "It understands engineering drawings too complex for OCR, schematics only a veteran engineer could parse, and archives nobody alive remembers.",
    numbers: ["90% Faster processing", "Conversational Query", "Contextual Awareness", "100% Source Traced"],
    imageFirst: false
  },
  {
    id: "opsunity-ai",
    eyebrow: "THE SOVEREIGN AI FOUNDATION LAYER",
    headline: "The Sovereign AI Operating System",
    body: "The AI operating system that powers every JSPARK product.",
    numbers: ["Zero external calls", "Unlimited queries", "72 Hours to mission-ready", "Hardware Agnostic"],
    imageFirst: true
  }
];

export function ProductPanels() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="products" className="relative w-full bg-[#000000] py-24 border-t border-zinc-900 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5722]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col gap-24 relative z-10">
        {products.map((product) =>
        <motion.div
          key={product.id}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="group relative"
        >
          {/* Card Container */}
          <div className={`flex flex-col ${product.imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-0 items-stretch bg-[#050505] border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-700 transition-colors duration-500 shadow-2xl`}>

            {/* Copy Side */}
            <motion.div variants={item} className="flex-1 flex flex-col justify-center p-10 lg:p-14 relative z-10 bg-gradient-to-br from-[#0B0C10] to-[#050505]">
              <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#FF5722]"></span>
                {product.eyebrow}
              </p>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 leading-[1.05] text-white">
                {product.name || product.headline}
              </h3>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 font-light max-w-xl">
                {product.shortBody || product.body}
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12 border-t border-zinc-900 pt-8">
                {product.numbers.map((num, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] mt-1.5 shrink-0"></span>
                    <span className="text-xs md:text-sm font-medium text-zinc-300">{num}</span>
                  </div>
                ))}
              </div>

              <a href={`/products/${product.id}`} className="inline-flex self-start items-center justify-center px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF5722] hover:border-[#FF5722] transition-all rounded shadow-lg group-hover:shadow-[0_0_20px_rgba(255,87,34,0.3)] hover:!shadow-[0_0_30px_rgba(255,87,34,0.6)]">
                Deep Dive: {product.id.split('-').pop()} →
              </a>
            </motion.div>

            {/* Visual Side */}
            <motion.div variants={item} className="flex-1 w-full relative min-h-[400px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-zinc-900 bg-[#000000] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 group-hover:opacity-30 transition-opacity duration-700"></div>

              {/* Data rings animation */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-zinc-800/50 group-hover:border-[#FF5722]/30 transition-colors duration-700"></div>
                <div className="absolute inset-4 rounded-full border border-zinc-800/50 border-t-[#FF5722]/50 animate-[spin_12s_linear_infinite]"></div>
                <div className="absolute inset-8 rounded-full border border-zinc-800/50 border-b-[#FF5722]/50 animate-[spin_8s_linear_infinite_reverse]"></div>

                <div className="w-24 h-[1px] bg-[#FF5722]/50 relative z-10 group-hover:w-32 transition-all duration-700">
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5722] animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_10px_#FF5722]"></div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 text-right">
                <p className="font-mono text-[9px] text-zinc-500 tracking-[0.3em] uppercase mb-1">Status</p>
                <p className="font-mono text-[10px] text-[#FF5722] tracking-[0.2em] uppercase">Active Simulation</p>
              </div>

              {/* Scanline overlay */}
              <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-transparent via-[#FF5722]/10 to-transparent -translate-y-full group-hover:animate-[scan_3s_ease-in-out_infinite]"></div>
            </motion.div>
          </div>
        </motion.div>
        )}
      </div>
    </section>
  );
}
