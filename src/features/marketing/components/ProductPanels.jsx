"use client";

import { motion } from "framer-motion";

const products = [
{
  id: "hydra",
  eyebrow: "INDIA'S FIRST AI HYDROLOGY MODEL",
  headline: "The State Sees the Flood Before the River Does",
  body: "Hydra forecasts rainfall, floods, flash floods, and rainfall-induced landslides at basin level, hours before impact. It has mapped over 3 million rivers and streams to trace where every drop of rain lands and where it flows. Forecast outcomes verified by the India Meteorological Department. Fully air-gapped, built for the state that must act before the water arrives.",
  numbers: ["3M+ rivers mapped", "6 hours+ advance warning", "4 hazards, one model", "IMD verified"],
  buttonText: "EXPLORE HYDRA",
  imageFirst: false
},
{
  id: "opsvision",
  eyebrow: "SOVEREIGN OPERATIONAL INTELLIGENCE",
  headline: "The Unit Is Already There When the Call Comes In",
  body: "One living model of your entire operation, every asset, event, signal, and record fused into a single intelligence picture. Deployed in the world's largest emergency response system and the world's largest crime records database. Response vehicles placed before the call. Repeat offenders identified at the moment of the match. Domain-agnostic: the same engine runs outage prediction for a power utility.",
  numbers: ["24 Cr citizens protected", "1.34 Cr offender records", "23% to 4% misrouted calls", "46% faster response"],
  buttonText: "EXPLORE OPSVISION",
  imageFirst: true
}];


export function ProductPanels() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="products" className="relative w-full bg-[#050505] py-24 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col gap-32">
        {products.map((product) =>
        <motion.div
          key={product.id}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className={`flex flex-col ${product.imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}>

            {/* Copy Side */}
            <motion.div variants={item} className="flex-1 flex flex-col justify-center relative z-10">
              <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#FF5722]"></span>
                {product.eyebrow}
              </p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.1] text-white">
                {product.headline}
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                {product.body}
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 text-[10px] md:text-[11px] font-mono tracking-widest uppercase text-zinc-300">
                {product.numbers.map((num, i) =>
              <div key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
                    {num}
                  </div>
              )}
              </div>

              <div>
                <a href={`#${product.id}`} style={{ padding: '1rem 2rem', backgroundColor: 'rgba(39, 39, 42, 0.8)' }} className="relative group inline-flex items-center justify-center hover:bg-[#FF5722]/20 text-white transition-colors duration-300">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-zinc-600/60 group-hover:bg-[#FF5722]/60 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-600/60 group-hover:bg-[#FF5722]/60 transition-colors"></div>
                  <div className="absolute top-0 left-0 w-[1px] h-2 bg-zinc-600/60 group-hover:bg-[#FF5722]/60 transition-colors"></div>
                  <div className="absolute top-0 right-0 w-[1px] h-2 bg-zinc-600/60 group-hover:bg-[#FF5722]/60 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-zinc-600/60 group-hover:bg-[#FF5722]/60 transition-colors"></div>
                  <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-zinc-600/60 group-hover:bg-[#FF5722]/60 transition-colors"></div>
                  <span className="relative z-10 text-[11px] font-bold tracking-[0.15em] uppercase">{product.buttonText}</span>
                </a>
              </div>
            </motion.div>

            {/* Image Placeholder Side */}
            <motion.div variants={item} className="flex-1 w-full relative aspect-video lg:aspect-square max-h-[500px] border border-zinc-800 bg-[#0B0C10] overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

              {/* Corner tactical brackets for the image */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#FF5722]/50"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#FF5722]/50"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#FF5722]/50"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#FF5722]/50"></div>

              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div className="w-16 h-[1px] bg-[#FF5722]/50 relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5722] animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5722]"></div>
                </div>
                <p className="font-mono text-[10px] text-zinc-400 tracking-[0.2em] uppercase">Visual Feed Standby</p>
              </div>

              {/* Scanline overlay */}
              <div className="absolute top-0 left-0 w-full h-[10%] bg-gradient-to-b from-transparent via-[#FF5722]/10 to-transparent -translate-y-full group-hover:animate-[scan_3s_ease-in-out_infinite]"></div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>);

}
