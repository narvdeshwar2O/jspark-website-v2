import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { detailedProducts } from '../features/marketing/data/products';
import { OperationalPipelineVisualizer } from '../features/marketing/components/Products/OperationalPipelineVisualizer';
import { useEffect } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const product = detailedProducts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-[#000000] min-h-screen w-full relative selection:bg-[#FF5722] selection:text-white pb-32 font-sans overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[1000px] h-[1000px] bg-[#FF5722]/5 rounded-full blur-[150px] opacity-50"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32">

        {/* Navigation & Breadcrumb */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-16">
          <Link to="/products" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-[#FF5722] font-mono text-xs tracking-widest uppercase transition-colors">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Products
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="flex flex-col items-center text-center mb-24 relative">
          <motion.p variants={fadeUp} className="text-[#FF5722] font-mono text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-4 justify-center">
            <span className="w-8 h-px bg-[#FF5722]"></span>
            {product.eyebrow}
            <span className="w-8 h-px bg-[#FF5722]"></span>
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-white mb-8 leading-[0.95]">
            {product.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-zinc-400 text-lg md:text-2xl leading-relaxed max-w-4xl mx-auto font-light">
            {product.body}
          </motion.p>
        </motion.div>


        {/* Stats Section */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {product.stats.map((stat, i) => (
            <motion.div variants={fadeUp} key={i} className="flex flex-col items-center justify-center text-center p-8 bg-[#0B0C10] border border-zinc-900 rounded-2xl hover:border-[#FF5722]/40 hover:bg-[#0F1115] transition-all duration-300">
              <div className={`text-4xl md:text-5xl font-black tracking-tighter mb-3 ${stat.color === 'orange' ? 'text-[#FF5722]' : 'text-white'}`}>
                {stat.value}
              </div>
              <div className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bento Grid: Core Capabilities (What it Does) */}
        <div className="mb-32">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-4">Core Capabilities</h3>
              <p className="text-zinc-400">Advanced features powering {product.name}</p>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className={`grid gap-6 ${product.whatItDoes.length === 5 || product.whatItDoes.length === 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
          >
            {product.whatItDoes.map((feature, i) => {
              const total = product.whatItDoes.length;
              let spanClass = "col-span-1";
              if (total === 5 && i === 0) spanClass = "md:col-span-2";
              if (total === 6 && (i === 0 || i === 3)) spanClass = "md:col-span-2 lg:col-span-2";

              return (
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  key={i}
                  className={`p-8 bg-[#0B0C10] border border-zinc-900 rounded-2xl flex flex-col justify-between hover:border-[#FF5722]/30 transition-colors relative overflow-hidden group ${spanClass}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/0 to-transparent group-hover:from-[#FF5722]/10 transition-colors duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#FF5722] mb-6 font-mono text-sm border border-zinc-800 group-hover:border-[#FF5722]/50 group-hover:shadow-[0_0_15px_rgba(255,87,34,0.3)] transition-all">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF5722] transition-colors">{feature.title}</h4>
                      {feature.desc && <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="flex flex-col gap-24 mb-32">
          {/* Target Sectors Bento Grid */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-10">Target Sectors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.builtFor.map((sector, i) => {
                const total = product.builtFor.length;
                let spanClass = "col-span-1";
                if (total === 4 && (i === 0 || i === 3)) spanClass = "md:col-span-2 lg:col-span-2";
                if (total === 3 && i === 2) spanClass = "md:col-span-2 lg:col-span-3";
                if (total === 5 && i === 0) spanClass = "md:col-span-2 lg:col-span-2";

                return (
                  <motion.div 
                    variants={fadeUp} 
                    key={i} 
                    whileHover={{ y: -4, scale: 1.01 }}
                    className={`p-8 bg-[#0B0C10] border border-zinc-900 rounded-2xl hover:border-[#FF5722]/30 hover:shadow-[0_0_20px_rgba(255,87,34,0.1)] transition-all flex flex-col relative overflow-hidden group ${spanClass}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/0 to-transparent group-hover:from-[#FF5722]/5 transition-colors duration-500"></div>
                    <div className="w-2 h-2 bg-[#FF5722] rounded-full mb-4 shrink-0 shadow-[0_0_10px_#FF5722]"></div>
                    <div className="relative z-10">
                      <h4 className="text-white font-bold text-xl mb-3 group-hover:text-[#FF5722] transition-colors">{sector.title}</h4>
                      {sector.desc && <p className="text-zinc-500 text-sm leading-relaxed">{sector.desc}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Operational Flow (How it Works) with Animated Interactive Command Deck */}
          {product.howItWorks && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-zinc-900 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-[#FF5722] uppercase tracking-[0.25em]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping" />
                    Operational Architecture
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                    Operational Flow
                  </h3>
                </div>
                <p className="text-zinc-500 font-mono text-xs max-w-sm">
                  Autonomous loop from sovereign edge ingestion to sub-second action dispatch.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Left Column: Premium Interactive Stepper Cards (5 Columns) */}
                <div className="lg:col-span-5 relative flex flex-col justify-between space-y-4">
                  {/* Subtle continuous glowing track */}
                  <div className="absolute left-[23px] top-[28px] bottom-[28px] w-[2px] bg-gradient-to-b from-[#FF5722] via-[#FF5722]/40 to-[#FF5722]/10 pointer-events-none" />

                  {product.howItWorks.map((step, i) => (
                    <motion.div
                      variants={fadeUp}
                      key={i}
                      whileHover={{ x: 4 }}
                      className="relative flex items-start gap-5 p-4 md:p-5 rounded-2xl bg-[#090B0E]/90 border border-zinc-900/90 hover:border-[#FF5722]/40 hover:bg-[#0E1117] transition-all duration-300 group shadow-lg backdrop-blur-sm"
                    >
                      {/* Step Circle Badge */}
                      <div className="relative z-10 w-9 h-9 rounded-full bg-[#050608] border-2 border-[#FF5722] flex items-center justify-center font-mono text-xs text-[#FF5722] font-black shrink-0 shadow-[0_0_15px_rgba(255,87,34,0.3)] group-hover:scale-110 group-hover:bg-[#FF5722] group-hover:text-black group-hover:shadow-[0_0_25px_rgba(255,87,34,0.6)] transition-all">
                        {i + 1}
                      </div>

                      <div className="pt-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-base md:text-lg font-bold text-white tracking-tight group-hover:text-[#FF5722] transition-colors truncate">
                            {step.title}
                          </h4>
                          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-[#FF5722]/70 shrink-0">
                            PHASE 0{i + 1}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Right Column: Visualizer Command Console (7 Columns) */}
                <motion.div
                  variants={fadeUp}
                  className="lg:col-span-7 flex flex-col h-full"
                >
                  <OperationalPipelineVisualizer
                    productId={product.id}
                    productName={product.name}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="w-full bg-gradient-to-br from-[#FF5722]/20 to-[#050505] border border-[#FF5722]/30 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6 relative z-10">Deploy {product.name}</h2>
          <p className="text-zinc-300 max-w-2xl mx-auto mb-10 relative z-10 text-lg">
            Integrate sovereign, air-gapped intelligence into your operational workflow today.
          </p>
          <a href="/apply" className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-mono text-[11px] tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(255,87,34,0.4)] hover:shadow-[0_0_30px_rgba(255,87,34,0.6)] rounded">
            Apply
          </a>
        </motion.div>
      </div>
    </div>
  );
}
