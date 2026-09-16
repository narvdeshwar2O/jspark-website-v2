"use client";

import { motion } from "framer-motion";

export function ContactLayout() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const steps = [
  "A founder replies within 1 working day.",
  "We sign an NDA and agree the scope of the demonstration.",
  "You bring your data, your environment, and your threat model. We bring the operating system.",
  "Within 72 hours you see your operation understood end to end."];


  return (
    <section className="relative w-full bg-[#050505] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-16" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>

          {/* Left Col: Form */}
          <div className="lg:col-span-7">
            <motion.div variants={item} className="bg-[#000000] border border-zinc-800 p-8 md:p-12 relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF5722]"></div>
              <h2 className="text-3xl font-black text-white mb-8">Request a Demonstration</h2>

              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Name</label>
                    <input type="text" className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Organisation</label>
                    <input type="text" className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Official Email</label>
                    <input type="email" className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Phone</label>
                    <input type="tel" className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Which operation do you want to see understood?</label>
                  <select className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm appearance-none">
                    <option>Homeland Security</option>
                    <option>Disaster Management</option>
                    <option>Critical Infrastructure and Energy</option>
                    <option>Defence</option>
                    <option>Smart City</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Message</label>
                  <textarea rows={4} className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm resize-none"></textarea>
                </div>

                <button type="submit" className="mt-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold font-mono tracking-widest text-[11px] uppercase py-4 transition-colors">
                  Request a Demonstration
                </button>
                <p className="text-zinc-600 font-mono text-[9px] text-center tracking-widest uppercase mt-2">
                  We respond within 1 working day. Every conversation begins under NDA.
                </p>
              </form>
            </motion.div>
          </div>

          {/* Right Col: Info & Steps */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <motion.div variants={item}>
              <h3 className="text-white font-black text-xl mb-6">Contact Us</h3>
              <div className="flex flex-col gap-4 font-mono text-sm">
                <a href="mailto:sales@jspark.in" className="text-zinc-400 hover:text-[#FF5722] transition-colors">sales@jspark.in</a>
                <a href="https://jspark.ai" className="text-zinc-400 hover:text-[#FF5722] transition-colors">jspark.ai</a>
                <div className="text-zinc-500 text-xs mt-2 leading-relaxed">
                  JSPARK AI Private Limited<br />
                  A1, F-102, Sector 59<br />
                  Noida, Uttar Pradesh 201301, India
                </div>
                <p className="text-[#FF5722] text-[10px] tracking-widest uppercase mt-2">India &middot; GCC &middot; Europe</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-[#000000] border border-zinc-800 p-8">
              <h3 className="text-white font-black text-lg mb-6">What Happens After You Write to Us</h3>
              <div className="flex flex-col gap-6">
                {steps.map((step, i) =>
                <div key={i} className="flex items-start gap-4">
                    <span className="text-[#FF5722] font-mono text-xs border border-[#FF5722]/30 bg-[#FF5722]/10 w-6 h-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-zinc-400 text-sm leading-relaxed pt-0.5">{step}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>);

}
