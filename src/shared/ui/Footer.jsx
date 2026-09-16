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
    <footer id="site-footer" className="relative w-full min-h-screen bg-[#000000] border-t border-zinc-900 font-sans flex flex-col overflow-hidden">

      {/* Top content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-20 pb-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
            <span className="text-white font-black text-xl tracking-tighter uppercase">JSPARK AI</span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
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
        </div>
      </div>

      {/* Certifications strip */}
      <div className="border-t border-zinc-900 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-wrap gap-6 items-center">
          <span className="text-zinc-700 text-[9px] font-mono tracking-[0.3em] uppercase">Certified</span>
          {certifications.map((cert) =>
          <div key={cert} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#FF5722]/60"></span>
              <span className="text-zinc-500 text-[10px] font-mono tracking-widest">{cert}</span>
            </div>
          )}
        </div>
      </div>

      {/* Massive brand name — fills width */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden select-none">
        <p
          className="font-black uppercase leading-none text-zinc-900 hover:text-white transition-colors duration-700 w-full px-2 whitespace-nowrap cursor-default"
          style={{ fontSize: "clamp(4rem, 18vw, 22rem)" }}>

          JSPARK AI
        </p>
      </div>

      {/* Legal bottom bar — sits above the letters */}
      <div className="border-t border-zinc-900/60 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-zinc-700 text-[10px] font-mono tracking-widest">
            © {new Date().getFullYear()} JSPARK AI Private Limited · CIN U62099UP2024PTC214091
          </p>
          <p className="text-zinc-700 text-[10px] font-mono tracking-widest">India · GCC · Europe</p>
        </div>
      </div>

    </footer>);

}
