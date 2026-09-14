"use client";

import { motion } from "framer-motion";
import { Background3D } from "./Background3D";









export function HeroLoader({ opacity, scale, blur, bootContainer, bootItem }) {
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black">
      <motion.div style={{ opacity }} className="absolute inset-0 w-full h-full">
        <Background3D />
      </motion.div>

      <motion.div
        style={{ scale, opacity, filter: blur }}
        className="relative w-full h-full flex flex-col items-center justify-center origin-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none">
          
          <div className="absolute top-8 left-8 w-6 h-6 border-t-[1px] border-l-[1px] border-zinc-600"></div>
          <div className="absolute top-8 right-8 w-6 h-6 border-t-[1px] border-r-[1px] border-zinc-600"></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-[1px] border-l-[1px] border-zinc-600"></div>
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-[1px] border-r-[1px] border-zinc-600"></div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-zinc-600"></div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 h-2 w-[1px] bg-zinc-600 translate-y-[1px]"></div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-zinc-600"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-2 w-[1px] bg-zinc-600 -translate-y-[7px]"></div>

          <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-zinc-600"></div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-zinc-600 translate-x-[1px]"></div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-zinc-600"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-zinc-600 -translate-x-[7px]"></div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center w-full max-w-5xl px-4 relative z-10"
          variants={bootContainer}
          initial="hidden"
          animate="show">
          
          <motion.div variants={bootItem} className="absolute top-8 left-4 md:left-12 w-[3px] h-[3px] bg-white opacity-50"></motion.div>
          <motion.div variants={bootItem} className="absolute top-8 right-4 md:right-12 w-[3px] h-[3px] bg-white opacity-50"></motion.div>

          <motion.h1
            variants={bootItem}
            className="text-6xl md:text-[8rem] font-black tracking-tighter mb-8 uppercase text-center w-full">
            
            JSPARK AI
          </motion.h1>

          <motion.p
            variants={bootItem}
            className="text-center text-zinc-300 max-w-lg mb-20 text-sm md:text-base leading-relaxed tracking-[0.02em]">
            
            The Sovereign AI Operating System<br />
            for Missions That Can&apos;t Fail.
          </motion.p>

          <motion.div
            variants={bootItem}
            className="flex flex-row flex-wrap items-center justify-center gap-4 md:gap-8 w-full max-w-4xl text-[10px] md:text-[11px] font-mono text-zinc-500 tracking-widest mt-16 px-4">
            
            <div className="hidden md:block w-[3px] h-[3px] bg-zinc-500"></div>
            <span>OPSUNITY AI</span>
            <span className="opacity-50">||</span>
            <span>OPSVISION</span>
            <span className="opacity-50">||</span>
            <span>OPSUNITY HYDRA</span>
            <span className="opacity-50">||</span>
            <span>OPSMIND</span>
            <div className="hidden md:block w-[3px] h-[3px] bg-zinc-500"></div>
          </motion.div>

          <motion.div variants={bootItem} className="absolute bottom-12 left-4 md:left-12 w-[3px] h-[3px] bg-white opacity-50"></motion.div>
          <motion.div variants={bootItem} className="absolute bottom-12 right-4 md:right-12 w-[3px] h-[3px] bg-white opacity-50"></motion.div>

          <motion.div
            variants={bootItem}
            className="absolute -bottom-24 md:-bottom-32 flex flex-row items-center gap-3 text-[10px] md:text-[11px] tracking-[0.25em] font-mono text-zinc-400">
            
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            SCROLL TO ENTER
          </motion.div>
        </motion.div>
      </motion.div>
    </div>);

}