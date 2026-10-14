import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const container = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden font-mono select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none -z-10" />

      {/* Clean Minimalist Center Layout (No Heavy Borders/Boxes) */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-xl w-full flex flex-col items-center text-center"
      >
        {/* Brand Mark with glowing pulse */}
        <motion.div variants={item} className="mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <img
              src="/assets/logo.webp"
              alt="JSPARK AI"
              className="h-10 sm:h-12 w-auto object-contain mx-auto"
            />
          </Link>
        </motion.div>

        {/* Minimal Category Pill */}
        <motion.div variants={item} className="mb-4">
          <span className="text-[#FF5722] text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse" />
            ERROR 404 · ACCESS DENIED
          </span>
        </motion.div>

        {/* Massive Minimalist 404 Header */}
        <motion.h1
          variants={item}
          className="text-8xl sm:text-9xl font-black text-white tracking-tighter font-sans leading-none my-2"
        >
          404
        </motion.h1>

        {/* Headline */}
        <motion.h2
          variants={item}
          className="text-lg sm:text-xl text-zinc-200 font-sans font-semibold tracking-tight uppercase mb-4"
        >
          Coordinate Not Found
        </motion.h2>

        {/* Subtext description */}
        <motion.p
          variants={item}
          className="text-zinc-400 text-sm sm:text-base font-sans max-w-md leading-relaxed mb-10 font-light"
        >
          The page or route you requested does not exist in the sovereign network topology.
        </motion.p>

        {/* Action Button */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#FF5722] hover:bg-[#ff6c3b] text-white font-mono text-xs uppercase tracking-widest font-bold transition-all rounded shadow-lg shadow-[#FF5722]/25 hover:shadow-[0_0_30px_rgba(255,87,34,0.5)]"
          >
            <span>← RETURN HOME</span>
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
          >
            <span>VIEW PRODUCTS</span>
          </Link>
        </motion.div>

        {/* Minimal Footer Tag */}
        <motion.div variants={item} className="mt-16 text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
          JSPARK AI · SOVEREIGN OPERATING SYSTEM
        </motion.div>
      </motion.div>
    </div>
  )
}
