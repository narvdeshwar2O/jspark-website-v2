import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { detailedProducts } from '../features/marketing/data/products';
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
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
            {product.eyebrow}
            <span className="w-8 h-[1px] bg-[#FF5722]"></span>
          </motion.p>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter text-white mb-8 leading-[0.95]">
            {product.name}
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg md:text-2xl leading-relaxed max-w-4xl mx-auto font-light">
            {product.body}
          </motion.p>
        </motion.div>

        {/* Massive Visual / Radar Feed */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="w-full aspect-video md:aspect-[21/9] bg-[#050505] border border-zinc-800 rounded-3xl relative overflow-hidden mb-24 shadow-2xl group">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-transparent via-[#FF5722]/20 to-transparent -translate-y-full group-hover:animate-[scan_4s_ease-in-out_infinite]"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-[0.5px] border-[#FF5722]/30 flex items-center justify-center relative">
              <div className="w-24 h-24 rounded-full border-[0.5px] border-[#FF5722]/20 animate-[spin_10s_linear_infinite] border-t-[#FF5722]"></div>
              <div className="absolute w-2 h-2 bg-[#FF5722] rounded-full animate-ping"></div>
              <div className="absolute w-2 h-2 bg-[#FF5722] rounded-full"></div>
            </div>
            <p className="mt-6 font-mono text-[10px] text-zinc-500 tracking-[0.3em] uppercase">Tactical Feed Active</p>
          </div>
          
          {/* Tactical corners */}
          <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-zinc-600"></div>
          <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-zinc-600"></div>
          <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-zinc-600"></div>
          <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-zinc-600"></div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          {/* Target Sectors */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-10">Target Sectors</h3>
            <div className="flex flex-col gap-4">
              {product.builtFor.map((sector, i) => (
                <motion.div variants={fadeUp} key={i} className="p-6 bg-[#050505] border border-zinc-900 rounded-xl hover:border-zinc-700 transition-colors flex items-start gap-4">
                  <div className="w-2 h-2 bg-[#FF5722] rounded-full mt-2 shrink-0"></div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">{sector.title}</h4>
                    {sector.desc && <p className="text-zinc-500 text-sm leading-relaxed">{sector.desc}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Operational Flow (How it Works) */}
          {product.howItWorks && (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-10">Operational Flow</h3>
              <div className="relative border-l border-zinc-800 ml-4 pl-10 flex flex-col gap-12">
                {product.howItWorks.map((step, i) => (
                  <motion.div variants={fadeUp} key={i} className="relative">
                    <div className="absolute -left-[57px] top-0 w-8 h-8 bg-[#000000] border-2 border-[#FF5722] rounded-full flex items-center justify-center font-mono text-[10px] text-[#FF5722] font-bold shadow-[0_0_15px_rgba(255,87,34,0.3)]">
                      {i + 1}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 leading-tight">{step.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
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
          <button className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-mono text-[11px] tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(255,87,34,0.4)] hover:shadow-[0_0_30px_rgba(255,87,34,0.6)] rounded">
            Request Capability Brief
          </button>
        </motion.div>
      </div>
    </div>
  );
}