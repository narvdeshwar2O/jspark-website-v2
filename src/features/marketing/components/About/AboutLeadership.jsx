"use client";

import { motion } from "framer-motion";

const leaders = [
{
  name: "Harish Goswami",
  title: "CHIEF EXECUTIVE OFFICER & FOUNDER",
  body: "Serial entrepreneur, two exits, 15+ years building and selling technology companies since 2009. Founded Toprankers, a Stanford Seed Programme company, USD 4M raised, 6M+ active learners, and ViDU Tech, acquired by Classplus, backed by Sequoia Capital and Tiger Global. Computer Science engineer by training, product architect by instinct. Now builds the sovereign AI operating system for the institutions that cannot fail.",
  tags: ["2 exits", "6M+ users", "$4M raised", "Stanford Seed", "Sovereign AI architect"]
},
{
  name: "Ashutosh Kukreti",
  title: "CHIEF TECHNOLOGY OFFICER & FOUNDER",
  body: "18+ years of carrier-grade engineering leadership across Airtel, COLT, Telstra, Wipro, and Optus. Architected mission-critical telecom and network infrastructure across India, Europe, and Australia, and data platforms processing billions of network events a day. Brings zero-failure engineering discipline to every JSPARK product, from the air-gapped foundation to the command console.",
  tags: ["18+ years carrier-grade", "5 telecom giants", "3 continents", "Big data at national scale"]
}];


export function AboutLeadership() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-[#000000] border-t border-zinc-900 py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-16">
          <p className="text-[#FF5722] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            LEADERSHIP
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Two Exits. Three Continents.<br className="hidden md:block" /> Zero Downtime.
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {leaders.map((l) =>
          <motion.div
            key={l.name}
            variants={item}
            className="group relative border border-zinc-800 hover:border-[#FF5722]/30 bg-[#050505] p-10 overflow-hidden transition-colors duration-300 flex flex-col">

              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[500px] transition-all duration-1000 ease-out"></div>

              <h3 className="text-white font-black text-2xl tracking-tight mb-2">{l.name}</h3>
              <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase mb-6">{l.title}</p>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">{l.body}</p>

              <div className="flex flex-wrap gap-2">
                {l.tags.map((tag) =>
              <span key={tag} className="border border-zinc-800 group-hover:border-zinc-700 text-zinc-400 group-hover:text-zinc-300 font-mono text-[9px] tracking-widest px-3 py-1.5 uppercase transition-colors">
                    {tag}
                  </span>
              )}
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}
