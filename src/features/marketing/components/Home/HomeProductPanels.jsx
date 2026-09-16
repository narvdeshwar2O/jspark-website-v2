import { motion } from "framer-motion";
import { detailedProducts } from "../../data/products";

export function HomeProductPanels() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="products" className="relative w-full bg-[#050505] py-24 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col gap-24">
        {detailedProducts.map((product) =>
        <motion.div
          key={product.id}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className={`flex flex-col ${product.imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>

            {/* Copy Side */}
            <motion.div variants={item} className="flex-1 flex flex-col justify-center relative z-10 lg:py-8">
              <p className="text-[#FF5722] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#FF5722]"></span>
                {product.eyebrow}
              </p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.1] text-white">
                {product.name}
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                {product.shortBody || product.body}
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 pt-6 border-t border-zinc-900 text-[10px] md:text-[11px] font-mono tracking-widest uppercase text-zinc-300">
                {product.stats.slice(0, 2).map((stat, i) =>
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
                    {stat.value} {stat.label.toLowerCase()}
                  </div>
                )}
              </div>
              
              <a href={`/products/${product.id}`} className="inline-flex self-start items-center justify-center px-6 py-3 bg-zinc-900 border border-zinc-800 text-white font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF5722]/20 hover:border-[#FF5722]/50 transition-colors">
                Deep Dive {product.id.split('-').pop()} →
              </a>
              
            </motion.div>

            {/* Image Placeholder Side */}
            <motion.div variants={item} className="flex-[1.2] w-full relative aspect-video border border-zinc-800 bg-[#0B0C10] overflow-hidden group rounded-2xl">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

              {/* Data rings animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-zinc-800/50 group-hover:border-[#FF5722]/30 transition-colors duration-700"></div>
                  <div className="absolute inset-4 rounded-full border border-zinc-800/50 border-t-[#FF5722]/50 animate-[spin_12s_linear_infinite]"></div>
                  
                  <div className="w-16 h-[1px] bg-[#FF5722]/50 relative z-10 group-hover:w-24 transition-all duration-700">
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5722] animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5722] shadow-[0_0_10px_#FF5722]"></div>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}