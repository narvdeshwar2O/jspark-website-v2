export function VerticalMarquee() {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 border-l border-[#FF5722]/40 hidden sm:flex flex-col overflow-hidden group z-20 hover:cursor-crosshair bg-[#050505]/50 backdrop-blur-sm">
      <div className="flex flex-col animate-marquee-vertical group-hover:[animation-play-state:paused] text-[#FF5722] transition-colors duration-300 text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase h-[200%]" style={{ writingMode: 'vertical-rl' }}>
        {[1, 2].map((setIdx) =>
        <div key={setIdx} className="flex-1 flex gap-16 py-8 items-center justify-around">
            {["OPSUNITY AI", "OPSVISION", "OPSUNITY HYDRA", "OPSMIND"].map((product, idx, arr) =>
          <div key={product} className="flex gap-16 items-center">
                <span>{product}</span>
                {idx < arr.length - 1 &&
            <span className="w-1 h-1 bg-[#FF5722] rounded-full"></span>
            }
              </div>
          )}
          </div>
        )}
      </div>
    </div>);

}