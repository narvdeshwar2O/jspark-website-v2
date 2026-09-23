import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import LoadGate from './shared/ui/LoadGate'
import { Navbar } from './shared/ui/Navbar'
import { Footer } from './shared/ui/Footer'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Industries = lazy(() => import('./pages/Industries'))
const CaseStudies = lazy(() => import('./pages/CaseStudies'))
const Contact = lazy(() => import('./pages/Contact'))

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/products", element: <Products /> },
  { path: "/products/:id", element: <ProductDetail /> },
  { path: "/industries", element: <Industries /> },
  { path: "/case-studies", element: <CaseStudies /> },
  { path: "/contact", element: <Contact /> },
];

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

export default function App() {
  return (
    <BrowserRouter>
      <main className="bg-black text-white font-sans selection:bg-[#FF5722] selection:text-white">
        <Navbar />
        <LoadGate />

        <Suspense fallback={<RouteLoader />}>
          <AnimatedRoutes />
        </Suspense>

        <Footer />
      </main>
    </BrowserRouter>
  )
}
