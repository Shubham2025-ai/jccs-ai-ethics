import { Link, useLocation } from 'react-router-dom'
import { Shield, Upload, Clock, Home, GitCompare, FlaskConical } from 'lucide-react'

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
    <nav className="sticky top-0 z-50 border-b border-white/5" aria-label="Main navigation"
      style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 font-black text-lg group" aria-label="JCCS Home">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #E94560)' }}>
            <Shield className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-white">JCCS</span>
          <span className="text-xs text-gray-500 hidden sm:block font-normal">Jedi Code Compliance System</span>
        </Link>
        <div className="flex items-center gap-1" role="list">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              role="listitem"
              aria-label={label}
              aria-current={pathname === to ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === to
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={pathname === to ? { background: 'rgba(108,99,255,0.2)', color: '#a78bfa' } : {}}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}