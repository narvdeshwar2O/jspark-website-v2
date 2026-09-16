"use client";

import { motion } from "framer-motion";


export function ProductsHero() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const anchorLinks = [
  { label: "OpsUnity AI", href: "#opsunity-ai" },
  { label: "OpsVision", href: "#opsvision" },
  { label: "OpsUnity Hydra", href: "#opsunity-hydra" },
  { label: "OpsMind", href: "#opsmind" }];


  return (
    <section className="relative min-h-screen w-full bg-[#000000] flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden border-b border-zinc-900 pt-24">
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF5722]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div
        className="max-w-5xl relative z-10 flex flex-col items-center text-center mx-auto"
        variants={container}
        initial="hidden"
        animate="show">

        <motion.p variants={item} className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3 font-mono">
          <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          SOVEREIGN PRODUCTS
          <span className="w-8 h-[1px] bg-[#FF5722]"></span>
        </motion.p>

        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-white mb-8 leading-tight">
          One Platform.<br />Every Mission.
        </motion.h1>

        <motion.p variants={item} className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-16">
          Three products on one sovereign foundation. Each runs air-gapped, unmetered, and inside your walls.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
          {anchorLinks.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="text-zinc-400 hover:text-white border border-zinc-800 hover:border-[#FF5722]/50 bg-[#050505] hover:bg-[#0A0A0A] px-6 py-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300">

              {link.label}
            </a>
          )}
        </motion.div>
      </motion.div>
    </section>);

}
