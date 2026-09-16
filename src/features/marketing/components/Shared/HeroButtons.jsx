import { Link } from 'react-router-dom';










export function HeroButtons({ buttons = [] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {buttons.map((btn) =>
      <Link
        key={btn.to}
        to={btn.to}
        className="relative group flex items-center justify-center px-8 py-4 transition-colors duration-300 w-full sm:w-auto">
        
          <div className="absolute top-0 left-0 right-0 h-[1px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px]"></div>

          <div className="absolute top-0 left-0 w-[1px] h-2"></div>
          <div className="absolute top-0 right-0 w-[1px] h-2"></div>
          <div className="absolute bottom-0 left-0 w-[1px] h-2"></div>
          <div className="absolute bottom-0 right-0 w-[1px] h-2"></div>

          <span className="relative z-10 text-[11px] font-bold tracking-[0.15em] uppercase">
            {btn.text}
          </span>
        </Link>
      )}
    </div>);

}