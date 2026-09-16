"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: "/about", label: "ABOUT" },
    { href: "/products", label: "PRODUCTS" },
    { href: "/industries", label: "INDUSTRIES" },
    { href: "/case-studies", label: "CASE STUDIES" }
  ];

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] z-50 transition-all duration-500 flex flex-col font-mono ${
      !isFooterVisible ?
      "translate-y-0 opacity-100" :
      "-translate-y-[150%] opacity-0 pointer-events-none"}`
      }>

      {/* Main Command Bar */}
      <div className="w-full bg-[#050505]/95 backdrop-blur-md border border-zinc-800 py-3 px-4 md:px-6 flex items-center justify-between shadow-2xl relative z-20">

        {/* Left: Brand & Status */}
        <div className="flex items-center gap-6">
          <Link to="/" className="font-sans font-black tracking-tighter text-lg md:text-xl uppercase text-white flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FF5722] animate-pulse"></div>
            JSPARK AI
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 transition-all duration-300 border ${
                isActive ?
                "text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/30 shadow-[0_0_15px_rgba(255,87,34,0.1)]" :
                "text-zinc-200 border-transparent hover:text-white hover:bg-zinc-800 hover:border-zinc-700"}`
                }>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA & Hamburger */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Contact CTA */}
          <Link
            to="/contact"
            className="hidden md:flex relative group items-center justify-center px-8 py-2.5 bg-[#FF5722]/10 text-white hover:bg-[#FF5722]/20 transition-colors duration-300">
            {/* Horizontal Borders */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
            {/* Vertical Corner Brackets */}
            <div className="absolute top-0 left-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <div className="absolute top-0 right-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 left-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 right-0 w-[1px] h-1.5 bg-[#FF5722]/60"></div>
            <span className="relative z-10 text-[10px] font-bold tracking-[0.15em] uppercase">
              CONTACT
            </span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 relative z-30 focus:outline-none"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white block origin-center transition-transform"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white block transition-opacity"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white block origin-center transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden relative z-10 w-full overflow-hidden bg-[#050505]/95 backdrop-blur-md border-x border-b border-zinc-800 shadow-2xl"
          >
            <nav className="flex flex-col pt-2 pb-6 px-4 gap-2">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    key={link.href}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-4 border-b ${
                        isActive ? "text-[#FF5722] border-[#FF5722]/30 bg-white/5" : "text-zinc-200 border-zinc-800"
                      } text-xs font-bold tracking-[0.2em] uppercase transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-[#FF5722]' : 'bg-transparent'}`}></span>
                        {link.label}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Contact CTA */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * navLinks.length }}
                className="mt-6 px-4"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative group flex items-center justify-center w-full py-4 bg-[#FF5722]/10 text-white transition-colors duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
                  <div className="absolute top-0 left-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
                  <div className="absolute top-0 right-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
                  <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
                  <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#FF5722]/60"></div>
                  <span className="relative z-10 text-[10px] font-bold tracking-[0.15em] uppercase text-[#FF5722]">
                    CONTACT COMMAND
                  </span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
