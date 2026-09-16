"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const stats = [
{ value: "24 Cr", label: "Citizens protected under World's largest emergency response system.", tag: "SYS.01" },
{ value: "1.34 Cr", label: "Fingerprint records contained within the National Automated Fingerprint Identification System (NAFIS).", tag: "SYS.02" },
{ value: "3M+", label: "Rivers and streams mapped by India's first AI hydrology model", tag: "SYS.03" },
{ value: "23% > 4%", label: "Misrouted emergency calls, corrected at intake", tag: "SYS.04" },
{ value: "5 sec", label: "National crime report generation, down from 10 hours", tag: "SYS.05" },

{ value: "0", label: "External calls, cloud dependencies, or token limits", tag: "SYS.06" }];


function ScrambleText({ text, isHovered }) {
  const [scrambled, setScrambled] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    if (!isHovered) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setScrambled(text.split("").map((letter, index) => {
        if (index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isHovered]);

  return <>{isHovered ? scrambled : text}</>;
}

function StatCard({ stat, itemVariants }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#050505] p-10 flex flex-col justify-center group hover:bg-[#0A0A0A] transition-colors relative overflow-hidden z-10">

      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-800 group-hover:border-[#FF5722] transition-colors duration-500"></div>

      {/* Top Tag */}
      <div className="absolute top-4 right-4 text-[8px] font-mono tracking-widest text-zinc-400 group-hover:text-[#FF5722]/50 transition-colors">
        {stat.tag}
      </div>

      {/* Data Stream Hover Effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF5722] opacity-0 group-hover:opacity-100 group-hover:translate-y-[250px] transition-all duration-[1.5s] ease-in-out z-0"></div>

      <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap font-black tracking-tighter text-white mb-6 group-hover:text-[#FF5722] group-hover:drop-shadow-[0_0_15px_rgba(255,87,34,0.3)] transition-all duration-300 relative z-10 flex">
        <ScrambleText text={stat.value} isHovered={isHovered} />
      </div>
      <p className="text-zinc-400 text-xs md:text-sm font-mono uppercase tracking-[0.15em] leading-relaxed relative z-10 group-hover:text-white transition-colors">
        {stat.label}
      </p>
    </motion.div>);

}

export function NumbersSection() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-[#000000] py-32 border-t border-zinc-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">

        <div className="mb-20 flex flex-col items-center text-center">
          <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            PROVEN AT SCALE
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          </p>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
            Numbers That Run on <span className="text-zinc-600">JSPARK AI</span>
          </h3>
        </div>

        {/* Tactical Grid with Mouse Spotlight Effect */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-[1px] bg-zinc-900/80 border border-zinc-800/50 group/grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>

          {/* Mouse Spotlight Background */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover/grid:opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,87,34,0.1), transparent 40%)`
            }} />

          {/* Global Connecting Lines Overlay (Hidden on Mobile) */}
          <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block mix-blend-screen">
            {/* Horizontal Line separating rows */}
            <div className="absolute top-1/2 left-[-5%] right-[-5%] h-[1px] bg-gradient-to-r from-transparent via-[#FF5722]/30 to-transparent"></div>
            {/* Vertical Lines separating columns */}
            <div className="absolute top-[-5%] bottom-[-5%] left-[33.33%] w-[1px] bg-gradient-to-b from-transparent via-[#FF5722]/30 to-transparent"></div>
            <div className="absolute top-[-5%] bottom-[-5%] left-[66.66%] w-[1px] bg-gradient-to-b from-transparent via-[#FF5722]/30 to-transparent"></div>

            {/* Intersection Glowing Nodes */}
            <div className="absolute top-1/2 left-[33.33%] w-2 h-2 -ml-1 -mt-1 bg-[#FF5722] rounded-full shadow-[0_0_10px_#FF5722]"></div>
            <div className="absolute top-1/2 left-[66.66%] w-2 h-2 -ml-1 -mt-1 bg-[#FF5722] rounded-full shadow-[0_0_10px_#FF5722]"></div>

            {/* Crosshairs at intersections */}
            <div className="absolute top-1/2 left-[33.33%] w-6 h-6 -ml-3 -mt-3">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#FF5722]/50"></div>
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#FF5722]/50"></div>
            </div>
            <div className="absolute top-1/2 left-[66.66%] w-6 h-6 -ml-3 -mt-3">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#FF5722]/50"></div>
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#FF5722]/50"></div>
            </div>
          </div>

          {stats.map((stat, i) =>
          <StatCard key={i} stat={stat} itemVariants={item} />
          )}
        </motion.div>

      </div>
    </section>);

}
