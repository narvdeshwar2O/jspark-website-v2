"use client";

import { motion } from "framer-motion";

const cases = [
{
  id: "01",
  client: "Uttar Pradesh 112",
  headline: "Emergency Response That Predicts, Not Reacts",
  tag: "HOMELAND SECURITY",
  stats: [
  { value: "46%", label: "Faster response" },
  { value: "23% → 4%", label: "Misrouted calls" },
  { value: "71%", label: "Fewer complaints" },
  { value: "75%", label: "Ops overhead down" }],

  body: "UP 112 is the world's largest emergency response system: 75 districts, 24 crore citizens, thousands of Police Response Vehicles. OpsVision placed response vehicles before the call came in and corrected every misrouted call at intake.",
  link: "#up-112"
},
{
  id: "02",
  client: "National Crime Records Bureau",
  headline: "From 10 Hours to 5 Seconds",
  tag: "CRIME INTELLIGENCE",
  stats: [
  { value: "5 sec", label: "Report generation" },
  { value: "1.34 Cr", label: "Records on one dashboard" },
  { value: "36", label: "States & UTs, one view" },
  { value: "3,850", label: "Operators self-served" }],

  body: "The world's largest crime database. A status report took 8–10 hours to generate. OpsVision sits inside NAFIS as the single national dashboard — every fingerprint transaction, filterable to any state, district, and date range. Answered on demand.",
  link: "#ncrb"
}];


export function DeployedSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-[#050505] py-32 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-20">
          <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            DEPLOYED WHERE FAILURE IS NOT AN OPTION
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase">
            Two of the World&apos;s <br className="hidden md:block" />
            Largest Systems.
          </h2>
        </div>

        <motion.div
          className="flex flex-col lg:flex-row gap-[1px] bg-zinc-800/30"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {cases.map((c) =>
          <motion.div
            key={c.id}
            variants={item}
            className="flex-1 relative bg-[#050505] p-10 md:p-14 flex flex-col justify-between group overflow-hidden min-w-0 border border-zinc-800/50 hover:border-[#FF5722]/20 transition-colors duration-500">
            
              {/* Scanline */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[600px] transition-all duration-[1.2s] ease-out z-0"></div>

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[#FF5722] font-mono text-xs tracking-widest">{c.id} &#47;&#47;</span>
                  <span className="text-zinc-600 font-mono text-[9px] tracking-widest uppercase">{c.tag}</span>
                </div>

                <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-3">{c.client}</p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-6 leading-tight group-hover:text-[#FF5722] transition-colors duration-300">
                  {c.headline}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-lg">
                  {c.body}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {c.stats.map((s, i) =>
                <div key={i} className="border border-zinc-800 group-hover:border-zinc-700 p-4 transition-colors">
                      <div className="text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-[#FF5722] transition-colors duration-300">{s.value}</div>
                      <div className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest mt-1">{s.label}</div>
                    </div>
                )}
                </div>
              </div>

              <a href={c.link} className="relative inline-flex self-start items-center justify-center px-6 py-3 bg-zinc-900/50 hover:bg-[#FF5722]/10 text-zinc-300 hover:text-white transition-all duration-300 z-10 group/link">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-600/60 group-hover/link:bg-[#FF5722]/60 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-600/60 group-hover/link:bg-[#FF5722]/60 transition-colors"></div>
                <div className="absolute top-0 left-0 w-[1px] h-2 bg-zinc-600/60 group-hover/link:bg-[#FF5722]/60 transition-colors"></div>
                <div className="absolute top-0 right-0 w-[1px] h-2 bg-zinc-600/60 group-hover/link:bg-[#FF5722]/60 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-zinc-600/60 group-hover/link:bg-[#FF5722]/60 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-zinc-600/60 group-hover/link:bg-[#FF5722]/60 transition-colors"></div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Read the Case Study</span>
              </a>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}