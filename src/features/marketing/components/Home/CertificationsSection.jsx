"use client";

import { motion } from "framer-motion";

const certs = [
{ code: "ISO/IEC 42001:2023", label: "AI Management System" },
{ code: "ISO 27001:2022", label: "Information Security" },
{ code: "ISO 9001:2015", label: "Quality Management" },
{ code: "CMMI Level 3", label: "Process Maturity" },
{ code: "DPIIT Recognised", label: "DIPP194871" },
{ code: "IEC Registered", label: "Cleared for International Engagements" }];


export function CertificationsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-[#000000] py-32 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-24">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div>
            <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF5722]"></span>
              CERTIFIED FOR THE WORLD
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-[1.1]">
              Built in India.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm font-mono max-w-xs leading-relaxed">
            Every certification earned on sovereign infrastructure. No exceptions, no asterisks.
          </p>
        </div>

        {/* Cert Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-zinc-900/50 border border-zinc-800/50"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {certs.map((cert, i) =>
          <motion.div
            key={i}
            variants={item}
            className="group bg-[#050505] hover:bg-[#0A0A0A] transition-colors p-8 flex flex-col gap-3 relative overflow-hidden">

              {/* Top-left accent line on hover */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#FF5722] group-hover:w-full transition-all duration-500 ease-out"></div>

              <div className="flex items-center gap-3 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-[#FF5722] transition-colors duration-300 shrink-0"></span>
                <span className="text-white font-black text-sm md:text-base tracking-tight group-hover:text-[#FF5722] transition-colors duration-300">
                  {cert.code}
                </span>
              </div>
              <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest pl-[18px] group-hover:text-zinc-300 transition-colors">
                {cert.label}
              </p>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}
