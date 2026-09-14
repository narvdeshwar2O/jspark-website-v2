"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] z-50 transition-all duration-500 flex flex-col font-mono ${
      !isFooterVisible ?
      "translate-y-0 opacity-100" :
      "-translate-y-[150%] opacity-0 pointer-events-none"}`
      }>

      {/* Main Command Bar */}
      <div className="w-full bg-[#050505]/95 backdrop-blur-md border border-zinc-800 py-3 px-4 md:px-6 flex items-center justify-between shadow-2xl">

        {/* Left: Brand & Status */}
        <div className="flex items-center gap-6">
          <Link to="/" className="font-sans font-black tracking-tighter text-lg md:text-xl uppercase text-white flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FF5722] animate-pulse"></div>
            JSPARK AI
          </Link>
        </div>

        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
          {[
          { href: "/about", label: "ABOUT" },
          { href: "/products", label: "PRODUCTS" },
          { href: "/industries", label: "INDUSTRIES" },
          { href: "/case-studies", label: "CASE STUDIES" }].
          map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 transition-colors border ${
                isActive ?
                "text-white bg-zinc-900 border-zinc-800" :
                "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900 hover:border-zinc-800"}`
                }>

                {link.label}
              </Link>);

          })}
        </nav>

        {/* Right: CTA */}
        <div className="flex items-center gap-6">
          <Link
            to="/contact"
            className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-white transition-colors">

            CONTACT
          </Link>
          <Link
            to="/contact"
            className="relative group flex items-center justify-center px-5 py-2.5 bg-[#FF5722]/10 text-white hover:bg-[#FF5722]/20 transition-colors duration-300">

            {/* Horizontal Borders */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>

            {/* Vertical Corner Brackets */}
            <div className="absolute top-0 left-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <div className="absolute top-0 right-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 left-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 right-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>

            <span className="relative z-10 text-[10px] font-bold tracking-[0.15em] uppercase">
              SCHEDULE A DEMONSTRATION
            </span>
          </Link>
        </div>
      </div>
    </header>);

}
