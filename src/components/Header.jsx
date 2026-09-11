import { useEffect, useRef, useState } from 'react'
import { hydraProgress } from '../animations/hydraProgress'
import { BEATS } from '../data/hydraTimings'
import { gsap } from '../animations/scrollSetup'
import './Header.css'

export default function Header() {
  const headerRef = useRef(null)
  const isHiddenRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Ensure xPercent remains centered at -50%
    gsap.set(header, { xPercent: -50, left: '50%', yPercent: 0, opacity: 1 })

    const apply = (p) => {
      // Header remains firmly stuck throughout the Hero scene.
      // Once the globe transition arrives (p >= BEATS.heroFadeEnd), it animates away.
      const shouldHide = p >= (BEATS.heroFadeEnd || 0.08)

      if (shouldHide !== isHiddenRef.current) {
        isHiddenRef.current = shouldHide
        if (shouldHide) {
          setMenuOpen(false)
          gsap.to(header, {
            yPercent: -160,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            pointerEvents: 'none',
            overwrite: 'auto',
          })
        } else {
          gsap.to(header, {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            pointerEvents: 'auto',
            overwrite: 'auto',
          })
        }
      }
    }

    apply(hydraProgress.value)
    return hydraProgress.subscribe(apply)
  }, [])

  // Close on Escape or click outside
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target) && !e.target.closest('.header__menu-btn')) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [menuOpen])

  return (
    <>
      <header className="header" ref={headerRef}>
        <div className="header__logo">
          <img src="/assets/logo.png" alt="JSPARK.AI" className="header__logo-img" />
        </div>
        
        <div className="header__nav">
          <a href="#contact" className="header__link">
            <span className="header__link-square"></span>
            CONTACT
          </a>

          <button 
            className={`header__menu-btn${menuOpen ? ' is-active' : ''}`} 
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="header__menu-line"></span>
            <span className="header__menu-line"></span>
            <span className="header__menu-line"></span>
          </button>
        </div>
      </header>

      {/* Animated Dropdown / Flyout Card */}
      <div 
        className={`header__menu-overlay${menuOpen ? ' is-visible' : ''}`} 
        aria-hidden={!menuOpen}
      >
        <div className="header__menu-backdrop" onClick={() => setMenuOpen(false)} />
        <div className="header__menu-card" ref={cardRef}>
          <div className="header__menu-grid">
            {/* Left Column: Navigation Items */}
            <nav className="header__menu-nav">
              <ul className="header__menu-list">
                <li className="header__menu-item">
                  <a href="#products" onClick={() => setMenuOpen(false)}>
                    <span className="header__menu-bullet">■</span> OUR PRODUCTS
                  </a>
                </li>
                <li className="header__menu-item">
                  <a href="#talk-with-us" onClick={() => setMenuOpen(false)}>
                    <span className="header__menu-bullet">■</span> TALK WITH US
                  </a>
                </li>
                <li className="header__menu-item">
                  <a href="#address" onClick={() => setMenuOpen(false)}>
                    <span className="header__menu-bullet">■</span> COMPANY ADDRESS
                  </a>
                </li>
              </ul>
            </nav>

            {/* Right Column: Mission CTA & Contact Details */}
            <div className="header__menu-details">
              <div className="header__menu-cta-block">
                <h3 className="header__menu-heading">
                  AT JSPARK, WE ARE SHAPING THE FUTURE OF FRONTIER INTELLIGENCE.
                </h3>
                <a href="#contact" className="header__menu-cta-btn" onClick={() => setMenuOpen(false)}>
                  <span className="header__cta-box">■</span> TALK WITH US
                </a>
              </div>

              <div className="header__menu-subgrid">
                <div className="header__menu-subcol">
                  <span className="header__menu-sublabel">Connect</span>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="header__menu-sublink">LINKEDIN</a>
                  <a href="mailto:contact@jspark.ai" className="header__menu-sublink">EMAIL</a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="header__menu-sublink">X (FORMERLY TWITTER)</a>
                </div>

                <div className="header__menu-subcol">
                  <span className="header__menu-sublabel">Company Address & Contact</span>
                  <span className="header__menu-subval">CONTACT@JSPARK.AI</span>
                  <span className="header__menu-subval">+91 9560952022</span>
                  <span className="header__menu-subval">NOIDA, UTTAR PRADESH, INDIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
