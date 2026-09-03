// ENHANCEMENT: Sovereign JCCS Navbar with scroll-aware backdrop, sliding active tab & pulse indicator
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Upload, Clock, Home, GitCompare, FlaskConical, Menu, X } from 'lucide-react'
import { healthCheck } from '../../utils/api'

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isBackendHealthy, setIsBackendHealthy] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  // ENHANCEMENT: Scroll detection for dynamic backdrop blur & opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ENHANCEMENT: Active background health monitoring
  useEffect(() => {
    let isMounted = true
    const checkStatus = async () => {
      try {
        await healthCheck()
        if (isMounted) setIsBackendHealthy(true)
      } catch {
        if (isMounted) setIsBackendHealthy(false)
      }
    }
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const nav = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/upload', label: 'New Audit', icon: Upload },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/regression', label: 'Regression', icon: FlaskConical },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-fortress-border ${
        isScrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'bg-[#0a0a0f]/60 backdrop-blur-md'
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        {/* ENHANCEMENT: Sovereign Logo & BHARAT Pill */}
        <Link to="/" className="flex items-center gap-3 group select-none" aria-label="JCCS Home">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-[#ff9933] to-[#e67e00] shadow-saffron-glow">
            <Shield className="w-4 h-4 text-[#0a0a0f] fill-[#0a0a0f]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-ink-white font-heading font-black text-base tracking-tight">JCCS</span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-saffron/10 text-saffron border border-saffron/30">
                BHARAT
              </span>
            </div>
            <span className="text-[10px] font-mono text-ink-dim hidden sm:block">
              IndiaAI LLM Safety & Red-Teaming
            </span>
          </div>
        </Link>

        {/* ENHANCEMENT: Desktop Navigation Links with Framer Motion Sliding 2px Saffron Indicator */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2" role="list">
          {nav.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                role="listitem"
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-heading font-bold transition-all min-h-[44px] ${
                  isActive
                    ? 'text-saffron'
                    : 'text-ink-gray hover:text-ink-white hover:bg-fortress-surface/60 rounded-lg'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-tab"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#ff9933] via-[#ff7733] to-[#e67e00] rounded-full shadow-[0_0_12px_rgba(255,153,51,0.5)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* ENHANCEMENT: Right Status Indicator & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[11px] font-mono transition-all ${
              isBackendHealthy
                ? 'bg-fortress-surface/90 border-fortress-border text-ink-white shadow-inner'
                : 'bg-safety-crimson/10 border-safety-crimson/30 text-safety-crimson'
            }`}
          >
            {/* ENHANCEMENT: Pulse Ring on Green Status Dot */}
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendHealthy ? 'bg-safety-teal' : 'bg-safety-crimson'
                }`}
              />
              {isBackendHealthy && (
                <span className="absolute -inset-1 rounded-full bg-safety-teal/30 animate-ping" />
              )}
            </div>
            <span className="font-semibold">
              {isBackendHealthy ? 'Systems Operational' : 'Engine Offline'}
            </span>
          </div>

          {/* ENHANCEMENT: Mobile Hamburger Button with 44px touch target */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-fortress-surface border border-fortress-border text-ink-white hover:border-saffron transition-all"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-saffron" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ENHANCEMENT: Mobile Collapsible Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-fortress-border bg-fortress-surface/98 backdrop-blur-xl px-4 py-3 space-y-1 shadow-fortress-card"
          >
            {nav.map(({ to, label, icon: Icon }) => {
              const isActive = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-bold min-h-[44px] transition-all ${
                    isActive
                      ? 'bg-saffron/10 text-saffron border border-saffron/30'
                      : 'text-ink-gray hover:text-ink-white hover:bg-fortress-base'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
