import { useEffect, useRef, useState } from 'react';

export function LazyVideo({
  src,
  mobileSrc,
  poster,
  className = '',
  containerClassName = '',
  objectFit = 'contain', // 'contain' prevents cropping text/diagrams on mobile
  ...props
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ObserverClass = typeof window !== 'undefined' ? window.IntersectionObserver : null;
    if (!ObserverClass) return;
    const observer = new ObserverClass(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          } else {
            videoRef.current.pause();
          }
        }
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeSrc = isMobile && mobileSrc ? mobileSrc : src;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-black/90 ${containerClassName}`}
    >
      {/* Ambient background glow to make contain mode seamless without harsh black bars */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125 pointer-events-none transition-opacity duration-700"
        style={{ backgroundImage: poster ? `url(${poster})` : undefined }}
      />

      <video
        ref={videoRef}
        src={isInView ? activeSrc : undefined}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="none"
        className={`relative z-10 w-full h-full ${
          objectFit === 'contain' ? 'object-contain' : 'object-contain md:object-cover'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
