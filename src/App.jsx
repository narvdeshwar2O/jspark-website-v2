import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import LoadGate from './shared/ui/LoadGate'
import { Navbar } from './shared/ui/Navbar'
import { Footer } from './shared/ui/Footer'
import { PageMetaSync } from './shared/ui/PageMetaSync'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Industries = lazy(() => import('./pages/Industries'))
const CaseStudies = lazy(() => import('./pages/CaseStudies'))
const Contact = lazy(() => import('./pages/Contact'))
const Apply = lazy(() => import('./pages/Apply'))
const NotFound = lazy(() => import('./pages/NotFound'))

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/products", element: <Products /> },
  { path: "/products/:id", element: <ProductDetail /> },
  { path: "/industries", element: <Industries /> },
  { path: "/case-studies", element: <CaseStudies /> },
  { path: "/contact", element: <Contact /> },
  { path: "/apply", element: <Apply /> },
  { path: "*", element: <NotFound /> },
];

function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}

// Subtle loader for code-split route transitions
const RouteLoader = () => (
  <div className="w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center">
    <div className="w-2 h-2 bg-[#FF5722] animate-pulse"></div>
    <div className="mt-4 text-[#FF5722] font-mono text-[9px] tracking-widest uppercase animate-pulse">
      LOADING PROTOCOL
    </div>
  </div>
)

// A wrapper to animate pages in and out
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
)

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Routes location={location} key={location.pathname}>
        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <PageTransition>
                {element}
              </PageTransition>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const location = useLocation();

  // List of valid recognized routes
  const validRoutes = [
    '/',
    '/about',
    '/products',
    '/industries',
    '/case-studies',
    '/contact',
    '/apply'
  ];

  const isKnownRoute =
    validRoutes.includes(location.pathname) ||
    /^\/products\/[a-zA-Z0-9_-]+$/.test(location.pathname);

  return (
    <main className="bg-black text-white font-sans selection:bg-[#FF5722] selection:text-white">
      {isKnownRoute && <Navbar />}
      {isKnownRoute && <LoadGate />}

      <Suspense fallback={<RouteLoader />}>
        <AnimatedRoutes />
      </Suspense>

      {isKnownRoute && <Footer />}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PageMetaSync />
      <SmoothScroll>
        <AppLayout />
      </SmoothScroll>
    </BrowserRouter>
  );
}
