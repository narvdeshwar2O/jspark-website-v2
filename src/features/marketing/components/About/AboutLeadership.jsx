"use client";

import { motion } from "framer-motion";

const leaders = [
{
  name: "Harish Goswami",
  title: "CHIEF EXECUTIVE OFFICER & FOUNDER",
  linkedin: "https://www.linkedin.com/in/harishgoswamicse/",
  image: "/founder/ceo.png",
  body: "Serial entrepreneur, two exits, 15+ years building and selling technology companies since 2009. Founded Toprankers, a Stanford Seed Programme company, USD 4M raised, 6M+ active learners, and ViDU Tech, acquired by Classplus, backed by Sequoia Capital and Tiger Global. Computer Science engineer by training, product architect by instinct. Now builds the sovereign AI operating system for the institutions that cannot fail.",
  tags: ["2 exits", "6M+ users", "$4M raised", "Stanford Seed", "Sovereign AI architect"]
},
{
  name: "Ashutosh Kukreti",
  title: "CHIEF TECHNOLOGY OFFICER & FOUNDER",
  linkedin: "https://www.linkedin.com/in/ashutosh-kukreti-5417b918/",
  image: "/founder/cto.png",
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border border-zinc-800 group-hover:border-[#FF5722]/50 transition-colors bg-zinc-900">
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-black text-2xl tracking-tight">{l.name}</h3>
                    <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#0077b5] transition-colors" title={`Connect with ${l.name} on LinkedIn`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.603 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-[#FF5722] font-mono text-[10px] tracking-widest uppercase">{l.title}</p>
                </div>
              </div>

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
