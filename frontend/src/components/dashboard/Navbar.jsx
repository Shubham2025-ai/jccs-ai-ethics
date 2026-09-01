import { Link, useLocation } from 'react-router-dom'
import { Shield, Upload, Clock, Home, GitCompare, FlaskConical, Activity } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const nav = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/upload', label: 'New Audit', icon: Upload },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/regression', label: 'Regression', icon: FlaskConical },
  ]

  return (
    <nav
      className="sticky top-0 z-50 border-b border-fortress-border bg-fortress-base/90 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        {/* Brand Logo & Sovereign Tag */}
        <Link to="/" className="flex items-center gap-3 group select-none" aria-label="JCCS Home">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 bg-gradient-to-br from-saffron to-saffron-deep shadow-saffron-glow">
            <Shield className="w-4 h-4 text-fortress-base fill-fortress-base" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-ink-white font-heading font-black text-base tracking-tight">JCCS</span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-saffron/10 text-saffron border border-saffron/30">
                BHARAT
              </span>
            </div>
            <span className="text-[10px] font-mono text-ink-dim hidden sm:block">
              IndiaAI LLM Safety & Red-Teaming
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2" role="list">
          {nav.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                role="listitem"
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-heading font-bold transition-all ${
                  isActive
                    ? 'text-saffron'
                    : 'text-ink-gray hover:text-ink-white hover:bg-fortress-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-saffron to-saffron-deep rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-fortress-surface border border-fortress-border text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-safety-teal animate-pulse" />
          <span className="text-ink-white font-semibold">Systems Operational</span>
        </div>
      </div>
    </nav>
  )
}
