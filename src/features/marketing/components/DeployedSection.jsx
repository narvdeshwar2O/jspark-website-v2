"use client";

import { motion } from "framer-motion";

const cases = [
{
  id: "01",
  client: "Uttar Pradesh 112",
  logo: "/assets/up112-logo.png",
  headline: "Emergency Response That Predicts, Not Reacts",
  tag: "HOMELAND SECURITY",
  stats: [
  { value: "46%", label: "Faster response" },
  { value: "23% → 4%", label: "Misrouted calls" },
  { value: "71%", label: "Fewer complaints" },
  { value: "75%", label: "Ops overhead down" }],

  body: "UP 112 is the world's largest emergency response system: 75 districts, 24 crore citizens, thousands of Police Response Vehicles. OpsVision placed response vehicles before the call came in and corrected every misrouted call at intake.",
},
{
  id: "02",
  client: "National Crime Records Bureau",
  logo: "/assets/ncrb-logo.png",
  headline: "From 10 Hours to 5 Seconds",
  tag: "CRIME INTELLIGENCE",
  stats: [
  { value: "5 sec", label: "Report generation" },
  { value: "1.34 Cr", label: "Records on one dashboard" },
  { value: "36", label: "States & UTs, one view" },
  { value: "3,850", label: "Operators self-served" }],

  body: "The world's largest crime database. A status report took 8–10 hours to generate. OpsVision sits inside NAFIS as the single national dashboard — every fingerprint transaction, filterable to any state, district, and date range. Answered on demand.",
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
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {cases.map((c) =>
          <motion.div
            key={c.id}
            variants={item}
            className="flex-1 relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-2xl md:rounded-3xl p-10 md:p-14 flex flex-col justify-between group overflow-hidden min-w-0 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-700 shadow-2xl backdrop-blur-md">

              {/* Sophisticated Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              {/* Decorative Tech Accents */}
              <div className="absolute top-0 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-[#FF5722]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10 border-b border-zinc-800/50 pb-4">
                  <span className="text-[#FF5722] font-mono text-xs tracking-widest">{c.id} &#47;&#47;</span>
                  <span className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50">{c.tag}</span>
                </div>

                {c.logo && (
                  <div className="mb-8 inline-flex items-center justify-center p-3 md:p-4 rounded-xl border border-white/10 bg-white shadow-lg group-hover:shadow-[#FF5722]/20 transition-shadow duration-500">
                    <img src={c.logo} alt={`${c.client} logo`} className="h-12 md:h-16 w-auto object-contain" />
                  </div>
                )}
                
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-6 leading-tight group-hover:text-zinc-200 transition-colors duration-300">
                  {c.headline}
                </h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-12 max-w-lg">
                  {c.body}
                </p>

                {/* Modern Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {c.stats.map((s, i) =>
                    <div key={i} className="rounded-xl bg-[#050505]/40 border border-zinc-800/60 hover:border-zinc-700 p-5 transition-colors group/stat relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FF5722]/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-2xl md:text-3xl font-black tracking-tighter text-white group-hover/stat:text-[#FF5722] transition-colors duration-300">{s.value}</div>
                        <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">{s.label}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}
