"use client";

import { motion } from "framer-motion";

const certs = [
{ code: "ISO/IEC 42001:2023", detail: "AI Management System. Certificate UQ 25038" },
{ code: "ISO 27001:2022", detail: "Information Security Management" },
{ code: "ISO 9001:2015", detail: "Quality Management for product engineering and delivery" },
{ code: "CMMI Level 3", detail: "Process maturity across engineering, project, and support operations" },
{ code: "DPIIT Startup India", detail: "DIPP194871" },
{ code: "MSME Udyam", detail: "UDYAM-UP-28-0156697" },
{ code: "IEC Registered", detail: "AAGCJ6835P. Cleared for international engagements" },
{ code: "CIN", detail: "U62099UP2024PTC214091" }];


export function AboutCerts() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-[#050505] border-t border-zinc-900 py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">

        <div className="mb-16">
          <p className="text-[#FF5722] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3 font-mono">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            CERTIFIED
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Certifications and Recognitions</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          
          {certs.map((cert, i) =>
          <motion.div
            key={i}
            variants={item}
            className="group grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-5 border-b border-zinc-900 hover:bg-[#0A0A0A] px-4 -mx-4 transition-colors duration-200 cursor-default">
            
              <span className="text-white font-black text-sm group-hover:text-[#FF5722] transition-colors duration-300 tracking-tight">
                {cert.code}
              </span>
              <span className="text-zinc-500 text-sm font-mono group-hover:text-zinc-300 transition-colors duration-300">
                {cert.detail}
              </span>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>);

}