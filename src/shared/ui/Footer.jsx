const navLinks = [
{ label: "Home", href: "/" },
{ label: "About", href: "/about" },
{ label: "Products", href: "/products" },
{ label: "Industries", href: "/industries" },
{ label: "Case Studies", href: "/case-studies" },
{ label: "Contact", href: "/contact" }];


const certifications = [
"ISO/IEC 42001:2023",
"ISO 27001:2022",
"ISO 9001:2015",
"CMMI Level 3",
"DPIIT DIPP194871"];


import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer id="site-footer" className="relative w-full min-h-[100dvh] md:h-[100dvh] bg-[#000000] border-t border-zinc-900 font-sans flex flex-col overflow-hidden">

      {/* Top content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-20 pb-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
            <span className="text-white font-black text-xl tracking-tighter uppercase">JSPARK AI</span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            The Sovereign AI Operating System for missions that cannot fail. Built in India. Deployed at national scale.
          </p>
          <Link to="/contact" className="relative inline-flex self-start items-center justify-center px-6 py-3 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-white transition-colors duration-300">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF5722]/60"></div>
            <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
            <div className="absolute top-0 right-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
            <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#FF5722]/60"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Request a Demonstration</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <p className="text-zinc-600 text-[9px] font-mono tracking-[0.3em] uppercase mb-2">Navigation</p>
          {navLinks.map((link) =>
          <Link key={link.href} to={link.href} className="text-zinc-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
              <span className="w-0 h-[1px] bg-[#FF5722] group-hover:w-4 transition-all duration-300"></span>
              {link.label}
            </Link>
          )}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <p className="text-zinc-600 text-[9px] font-mono tracking-[0.3em] uppercase mb-2">Contact</p>
          <Link to="mailto:sales@jspark.in" className="text-zinc-400 hover:text-white text-sm transition-colors font-mono">sales@jspark.in</Link>
          <Link to="https://jspark.ai" className="text-zinc-400 hover:text-white text-sm transition-colors font-mono">jspark.ai</Link>
          <p className="text-zinc-600 text-xs leading-relaxed pt-2">
            A1, F-102, Sector 59<br />
            Noida, Uttar Pradesh 201301<br />
            India
          </p>

          <div className="mt-4">
            <p className="text-zinc-600 text-[9px] font-mono tracking-[0.3em] uppercase mb-4">Socials</p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/jsparkai/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#0077b5] transition-colors" title="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.603 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://x.com/jsparkai/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="X (Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.youtube.com/@JSPARKAI/videos" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#ff0000] transition-colors" title="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.facebook.com/JSparkAI/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#1877f2] transition-colors" title="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/jspark.ai/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#E1306C] transition-colors" title="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications strip */}
      <div className="border-t border-zinc-900 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-wrap gap-6 items-center">
          <span className="text-zinc-400 text-[9px] font-mono tracking-[0.3em] uppercase">Certified</span>
          {certifications.map((cert) =>
          <div key={cert} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#FF5722]/60"></span>
              <span className="text-zinc-400 text-[10px] font-mono tracking-widest">{cert}</span>
            </div>
          )}
        </div>
      </div>

      {/* Massive brand name - fills width securely without cropping */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden select-none pb-4 sm:pb-8">
        <p
          className="font-black uppercase leading-none hover:text-white transition-colors duration-700 w-full px-2 whitespace-nowrap cursor-default text-center"
          style={{ fontSize: "clamp(4rem, min(18vw, 28dvh), 22rem)" }}>
          JSPARK AI
        </p>
      </div>

      {/* Legal bottom bar — sits above the letters */}
      <div className="border-t border-zinc-900/60 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-zinc-400 text-[10px] font-mono tracking-widest">
            © {new Date().getFullYear()} JSPARK AI Private Limited · CIN U62099UP2024PTC214091
          </p>
          <p className="text-zinc-400 text-[10px] font-mono tracking-widest">India · GCC · Europe</p>
        </div>
      </div>

    </footer>);

}
