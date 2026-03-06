import { Link, useLocation } from 'react-router-dom'
import { Shield, Upload, Clock, Home } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const nav = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/upload', label: 'New Audit', icon: Upload },
    { to: '/history', label: 'History', icon: Clock },
  ]
  return (
    <nav className="sticky top-0 z-50"
      style={{ background: 'rgba(5,5,15,0.75)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #E94560)', boxShadow: '0 0 20px rgba(108,99,255,0.4)' }}>
            <Shield className="w-4 h-4 text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-xl animate-ping opacity-20"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #E94560)' }} />
          </div>
          <div>
            <div className="font-display font-black text-white text-base leading-none tracking-wide">JCCS</div>
            <div className="text-[10px] text-gray-500 hidden sm:block leading-none mt-0.5 tracking-widest uppercase">Jedi Code Compliance</div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}
                style={active ? { background: 'rgba(108,99,255,0.15)', color: '#a78bfa' } : {}}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:block">{label}</span>
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6C63FF, #E94560)' }} />
                )}
              </Link>
            )
          })}

          {/* Live badge */}
          <div className="ml-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.2)', color: '#00B894' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Live
          </div>
        </div>
      </div>
    </nav>
  )
}