"use client";

import { motion } from "framer-motion";

const cases = [
{
  id: "01",
  client: "Uttar Pradesh 112",
  logo: "/assets/up112-logo.png",
  headline: "World Largest Emergency Response System",
  tag: "HOMELAND SECURITY",
  stats: [
  { value: "46%", label: "Faster response" },
  { value: "23% → 4%", label: "Misrouted calls" },
  { value: "71%", label: "Fewer complaints" },
  { value: "75%", label: "Ops overhead down" }],

  body: (
    <>
      <span className="text-white font-semibold">UP 112</span> is the <span className="text-white font-medium">world's largest emergency response system</span>: 75 districts, 24 crore citizens, thousands of Police Response Vehicles. <span className="text-[#FF5722] font-bold drop-shadow-[0_0_8px_rgba(255,87,34,0.4)]">OpsVision</span> placed response vehicles <span className="text-white font-medium">before the call came in</span> and corrected every misrouted call at intake.
    </>
  ),
},
{
  id: "02",
  client: "National Crime Records Bureau",
  logo: "/assets/ncrb-logo.png",
  headline: "World Largest Crime data for NAFIS",
  tag: "CRIME INTELLIGENCE",
  stats: [
  { value: "5 sec", label: "Report generation" },
  { value: "1.34 Cr", label: "Records on one dashboard" },
  { value: "36", label: "States & UTs, one view" },
  { value: "3,850", label: "Operators self-served" }],

  body: (<>The <span className="text-white font-medium">world's largest crime database</span>. A status report took <span className="text-zinc-500 line-through mr-1">8-10 hours</span> to generate. <span className="text-[#FF5722] font-bold drop-shadow-[0_0_8px_rgba(255,87,34,0.4)]">OpsVision</span> sits inside <span className="text-white font-semibold">NAFIS</span> as the <span className="text-white font-medium">single national dashboard</span> &mdash; every fingerprint transaction, filterable to any state, district, and date range. <span className="text-white font-semibold">Answered on demand.</span></>),
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
      <div className="max-w-[98%] mx-auto px-6 md:px-12 lg:px-16">

        <div className="mb-10">
          <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#FF5722]"></span>
            DEPLOYED WHERE FAILURE IS NOT AN OPTION
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-[1.1]">
            Two of the World&apos;s <br className="hidden md:block" />
            Largest Systems.
          </h2>
        </div>

        <motion.div
          className="flex flex-col lg:flex-row gap-3 lg:gap-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {cases.map((c) =>
          <motion.div
            key={c.id}
            variants={item}
            className="flex-1 relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col justify-between group overflow-hidden min-w-0 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-700 shadow-2xl backdrop-blur-md">

              {/* Sophisticated Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              {/* Decorative Tech Accents */}
              <div className="absolute top-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-[#FF5722]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10 border-b border-zinc-800/50 pb-4">
                  <span className="text-[#FF5722] font-mono text-xs font-bold tracking-widest">{c.id} &#47;&#47;</span>
                  <span className="text-white font-mono text-[10px] font-bold tracking-widest uppercase bg-[#FF5722] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,87,34,0.4)]">{c.tag}</span>
                </div>

                <div className="flex flex-row items-start gap-4 md:gap-6 mb-8 md:min-h-[144px]">
                  {c.logo && (
                    <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 inline-flex items-center justify-center p-3 md:p-4 rounded-xl border border-white/10 bg-white shadow-lg group-hover:shadow-[#FF5722]/20 transition-shadow duration-500">
                      <img src={c.logo} alt={`${c.client} logo`} className="h-10 md:h-12 w-auto object-contain" />
                    </div>
                  )}
                  <h3 className="mt-2 md:mt-3 text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight group-hover:text-zinc-100 transition-colors duration-300 drop-shadow-md">
                    {c.headline}
                  </h3>
                </div>
                <p className="text-zinc-200 text-sm md:text-base leading-relaxed mb-12 max-w-lg drop-shadow-sm font-light">
                  {c.body}
                </p>

                {/* Modern Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {c.stats.map((s, i) =>
                    <div key={i} className="rounded-xl bg-[#050505]/40 border border-zinc-800/60 hover:border-zinc-700 p-5 transition-colors group/stat relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FF5722]/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-2xl md:text-3xl font-black tracking-tighter text-white group-hover/stat:text-[#FF5722] transition-colors duration-300 drop-shadow-sm">{s.value}</div>
                        <div className="text-zinc-300 text-[10px] font-mono uppercase tracking-widest mt-2">{s.label}</div>
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

