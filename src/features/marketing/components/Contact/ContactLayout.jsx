"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import * as EmailValidator from "email-validator";

export function ContactLayout() {
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    email: "",
    phone: "",
    operation: "Homeland Security",
    message: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Restrict phone field to valid telephone characters
    if (name === "phone") {
      const sanitized = value.replace(/[^\d+()\s-]/g, "");
      setFormData(prev => ({ ...prev, [name]: sanitized }));
      if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!EmailValidator.validate(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Optional phone validation: basic length check
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length > 0 && phoneDigits.length < 5) {
      newErrors.phone = "Phone number is too short.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const subject = encodeURIComponent(`Demonstration Request: ${formData.operation} - ${formData.org}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nOrganisation: ${formData.org}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nOperation: ${formData.operation}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:sales@jspark.in?subject=${subject}&body=${body}`;
  };

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

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Organisation</label>
                    <input required name="org" value={formData.org} onChange={handleChange} type="text" className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Official Email</label>
                      {errors.email && <span className="text-red-500 font-mono text-[9px]">{errors.email}</span>}
                    </div>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className={`bg-[#050505] border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-[#FF5722]'} text-white px-4 py-3 outline-none transition-colors font-mono text-sm`} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Phone</label>
                      {errors.phone && <span className="text-red-500 font-mono text-[9px]">{errors.phone}</span>}
                    </div>
                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className={`bg-[#050505] border ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-[#FF5722]'} text-white px-4 py-3 outline-none transition-colors font-mono text-sm`} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Which operation do you want to see understood?</label>
                  <select name="operation" value={formData.operation} onChange={handleChange} className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm appearance-none">
                    <option>Homeland Security</option>
                    <option>Disaster Management</option>
                    <option>Critical Infrastructure and Energy</option>
                    <option>Defence</option>
                    <option>Smart City</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">Message</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="bg-[#050505] border border-zinc-800 focus:border-[#FF5722] text-white px-4 py-3 outline-none transition-colors font-mono text-sm resize-none"></textarea>
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
                <div className="text-zinc-400 text-xs mt-2 leading-relaxed">
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
