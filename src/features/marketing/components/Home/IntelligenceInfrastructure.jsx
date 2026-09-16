"use client";

import { motion } from "framer-motion";

const pillars = [
{
  title: "Sovereignty",
  subtitle: "Air-gapped by design",
  text: "Runs fully offline on your hardware with military-grade cryptographic controls and full audit integrity. Your data never leaves your command."
},
{
  title: "Intelligence",
  subtitle: "Unmetered, unlimited",
  text: "Purpose-built engines for mission-critical decisions and forecasting. Reasoning at whatever depth the mission demands, with no token limits and no external calls."
},
{
  title: "Scale",
  subtitle: "Proven at national level",
  text: "Live in the world's largest emergency response system, the world's largest crime records database, and state-level disaster management."
}];


export function IntelligenceInfrastructure() {
  const fadeUpContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-[#050505] py-32 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-24">
        
        <motion.div
          className="max-w-4xl mb-24"
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          <motion.h2 variants={fadeUpItem} className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            Intelligence Is the New Infrastructure
          </motion.h2>
          <motion.p variants={fadeUpItem} className="text-zinc-400 text-base md:text-lg leading-relaxed md:leading-loose">
            JSPARK AI builds it sovereign. An AI operating system that runs entirely within your walls, comprehends your operation end to end, and turns data you already own into decisions made in time. No cloud. No meter. No outside dependency. Just your mission, understood.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {pillars.map((pillar, idx) =>
          <motion.div
            key={idx}
            variants={fadeUpItem}
            className="group relative p-8 md:p-10 border border-zinc-800 bg-[#000000] hover:bg-[#0A0A0A] transition-colors overflow-hidden">
            
              {/* Scanline Effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[400px] transition-all duration-1000 ease-out z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></div>
                  <h4 className="text-white font-black text-xl tracking-tight">{pillar.title}</h4>
                </div>
                
                <p className="text-[#FF5722] font-mono text-xs uppercase tracking-widest font-bold mb-4">
                  {pillar.subtitle}
                </p>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}