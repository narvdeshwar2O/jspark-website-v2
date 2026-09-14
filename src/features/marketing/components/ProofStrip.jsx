"use client";

import { motion } from "framer-motion";

export function ProofStrip({ fadeUpContainer, fadeUpItem }) {
  return (
    <motion.div
      className="w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 mt-auto pr-16"
      variants={fadeUpContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}>
      
      {[
      { id: "01", text: "INDIA'S FIRST AI-ENABLED HYDROLOGY MODEL" },
      { id: "02", text: "DEPLOYED IN THE WORLD'S LARGEST EMERGENCY RESPONSE SYSTEM" },
      { id: "03", text: "DEPLOYED IN THE WORLD'S LARGEST CRIME RECORDS DATABASE" },
      { id: "04", text: "MISSION-READY IN 72 HOURS" }].
      map((card) =>
      <motion.div key={card.id} variants={fadeUpItem} className="group flex flex-col p-5 border border-zinc-800/50 bg-[#050505] hover:bg-[#FF5722]/5 hover:border-[#FF5722]/50 transition-all duration-300 cursor-crosshair h-[120px] justify-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[120px] transition-all duration-700 ease-out z-0"></div>
          <div className="text-[#FF5722] font-mono text-[11px] tracking-widest font-bold mb-3 z-10 transition-transform duration-300 group-hover:-translate-y-1">
            {card.id}
          </div>
          <p className="text-[9px] lg:text-[10px] text-zinc-300 group-hover:text-white font-bold uppercase tracking-[0.15em] leading-relaxed transition-colors duration-300 z-10">
            {card.text}
          </p>
        </motion.div>
      )}
    </motion.div>);

}