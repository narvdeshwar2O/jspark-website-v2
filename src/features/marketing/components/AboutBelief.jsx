"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export function AboutBelief() {
  return (
    <>
      {/* What We Believe */}
      <section className="relative w-full bg-[#050505] border-t border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            <motion.div variants={fadeUp}>
              <p className="text-[#FF5722] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
                <span className="w-8 h-[1px] bg-[#FF5722]"></span>
                BELIEF
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">What We Believe</h2>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <p className="text-zinc-400 text-base leading-relaxed">
                Intelligence is the new infrastructure. A nation that rents its intelligence from a foreign cloud does not own its decisions. JSPARK AI exists so that the defence establishment, the home department, the disaster authority, and the power utility can run the most capable AI in the world without a single byte leaving their command.
              </p>
              <p className="text-zinc-400 text-base leading-relaxed">
                Every system we build runs air-gapped, on your hardware, under your control. No internet. No foreign cloud. No per-query meter. No external dependency of any kind. Your data, your models, your sovereignty, permanently.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Have Built */}
      <section className="relative w-full bg-[#000000] border-t border-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            <motion.p variants={fadeUp} className="text-[#FF5722] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
              <span className="w-8 h-[1px] bg-[#FF5722]"></span>
              TRACK RECORD
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-10">What We Have Built</motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.p variants={fadeUp} className="text-zinc-400 text-base leading-relaxed">
                Founded in Noida, Uttar Pradesh, and incorporated in December 2024, JSPARK AI went from a first line of code to live inside the world&apos;s largest emergency response system and the world&apos;s largest crime records database. In the same period we built India&apos;s first AI-enabled hydrology model and had its forecast outcomes verified by the India Meteorological Department.
              </motion.p>
              <motion.p variants={fadeUp} className="text-zinc-400 text-base leading-relaxed">
                Today JSPARK AI products run across India, the Gulf, and Europe, in police command centres, national databases, state disaster authorities, smart cities, utilities, and vehicle fleets.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-12">
              {["INDIA", "GCC", "EUROPE"].map((loc) =>
              <span key={loc} className="border border-zinc-800 text-zinc-400 font-mono text-[10px] tracking-widest px-4 py-2 uppercase">{loc}</span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>);

}
