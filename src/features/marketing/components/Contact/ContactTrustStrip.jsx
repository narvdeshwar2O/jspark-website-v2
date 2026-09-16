"use client";

const certs = [
"ISO/IEC 42001:2023",
"ISO 27001:2022",
"ISO 9001:2015",
"CMMI Level 3",
"DPIIT Recognised",
"IEC Registered"];


export function ContactTrustStrip() {
  return (
    <div className="w-full bg-[#000000] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8 flex flex-wrap justify-center gap-4 md:gap-8 items-center">
        {certs.map((cert, i) =>
        <div key={i} className="flex items-center gap-4 md:gap-8">
            <span className="text-zinc-400 font-mono text-[10px] tracking-widest uppercase">
              {cert}
            </span>
            {i !== certs.length - 1 &&
          <span className="w-1 h-1 bg-[#FF5722] rounded-full"></span>
          }
          </div>
        )}
      </div>
    </div>);

}
