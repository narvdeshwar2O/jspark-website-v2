import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import * as EmailValidator from "email-validator";

const CustomSelect = ({ options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-zinc-900/50 border rounded-lg px-4 py-3 text-white cursor-pointer flex justify-between items-center transition-all ${isOpen ? 'border-[#FF5722]/50 ring-1 ring-[#FF5722]/50' : 'border-zinc-800 hover:border-[#FF5722]/50'}`}
      >
        <span className={selectedOption ? 'text-white' : 'text-zinc-500'}>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-zinc-800 rounded-lg overflow-hidden z-50 shadow-2xl"
          >
            {options.map((opt, i) => (
              <div 
                key={i}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className="px-4 py-3 text-zinc-300 hover:bg-[#FF5722]/10 hover:text-[#FF5722] cursor-pointer transition-colors border-b border-zinc-800/50 last:border-0"
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Apply() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    sector: '',
    product: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "email" && emailError) setEmailError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!EmailValidator.validate(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate minor delay for UI feedback
    setTimeout(() => {
      const subject = encodeURIComponent(`Deployment Request: ${formData.org}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.org}\nSector: ${formData.sector}\nProduct Interest: ${formData.product}\n\nRequirements:\n${formData.requirements}`);
      
      window.location.href = `mailto:sales@jspark.in?subject=${subject}&body=${body}`;
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const sectorOptions = [
    { value: "defence", label: "Defence & Security" },
    { value: "homeland", label: "Homeland Security" },
    { value: "disaster", label: "Disaster Management" },
    { value: "enterprise", label: "Critical Enterprise" }
  ];

  const productOptions = [
    { value: "opsvision", label: "OPSVISION" },
    { value: "opsmind", label: "OPSMIND" },
    { value: "opsunity-hydra", label: "OPSUNITY HYDRA" },
    { value: "opsunity-ai", label: "OPSUNITY AI" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#FF5722]/5 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 uppercase">
              Request Deployment
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              JSPARK AI systems are deployed in highly secure, air-gapped environments. 
              Submit this form to request access, schedule a technical briefing, or initiate a deployment evaluation for your organization.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-[#000000]/60 backdrop-blur-xl border border-zinc-800 p-8 md:p-12 rounded-3xl shadow-2xl relative">
            
            {/* Tactical Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF5722] rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF5722] rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF5722] rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF5722] rounded-br-3xl"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/50 transition-all" placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase">Official Email</label>
                    {emailError && <span className="text-red-500 font-mono text-[9px]">{emailError}</span>}
                  </div>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className={`w-full bg-zinc-900/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all ${emailError ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-zinc-800 focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/50'}`} placeholder="john@agency.gov" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase">Organization / Agency</label>
                <input required name="org" value={formData.org} onChange={handleChange} type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/50 transition-all" placeholder="e.g. Ministry of Defence, NCRB" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative z-20">
                  <label className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase block mb-2">Sector</label>
                  <CustomSelect 
                    options={sectorOptions} 
                    placeholder="Select Sector..." 
                    value={formData.sector} 
                    onChange={(val) => setFormData(prev => ({ ...prev, sector: val }))} 
                  />
                </div>
                <div className="space-y-2 relative z-10">
                  <label className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase block mb-2">Primary Product Interest</label>
                  <CustomSelect 
                    options={productOptions} 
                    placeholder="Select Product..." 
                    value={formData.product} 
                    onChange={(val) => setFormData(prev => ({ ...prev, product: val }))} 
                  />
                </div>
              </div>

              <div className="space-y-2 relative z-0">
                <label className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase block mb-2">Deployment Requirements</label>
                <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows={4} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]/50 focus:ring-1 focus:ring-[#FF5722]/50 transition-all" placeholder="Briefly describe your operational needs..."></textarea>
              </div>

              <div className="pt-6 relative z-0">
                <button 
                  type="submit" 
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full font-mono text-[12px] tracking-[0.2em] uppercase font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3 ${
                    isSubmitted 
                      ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]'
                      : isSubmitting 
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                        : 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-[0_0_20px_rgba(255,87,34,0.3)] hover:shadow-[0_0_30px_rgba(255,87,34,0.5)]'
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      Request Received
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  ) : isSubmitting ? (
                    'Initiating...'
                  ) : (
                    <>
                      Initiate Request
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
