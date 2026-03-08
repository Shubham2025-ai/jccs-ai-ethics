import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Navbar from './components/dashboard/Navbar'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import ComparePage from './pages/ComparePage'
import { healthCheck } from './utils/api'

function BackendStatus() {
  const [status, setStatus] = useState('waking') // waking | online | offline

  useEffect(() => {
    let attempts = 0
    const ping = async () => {
      try {
        await healthCheck()
        setStatus('online')
      } catch {
        attempts++
        if (attempts >= 3) setStatus('offline')
        else setTimeout(ping, 8000) // retry every 8 seconds
      }
    }
    ping()
  }, [])

  if (status === 'online') return null // hide when ready

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg"
      style={{
        background: status === 'offline' ? 'rgba(233,69,96,0.15)' : 'rgba(108,99,255,0.15)',
        border: `1px solid ${status === 'offline' ? 'rgba(233,69,96,0.3)' : 'rgba(108,99,255,0.3)'}`,
        color: status === 'offline' ? '#E94560' : '#a78bfa',
        backdropFilter: 'blur(12px)'
      }}>
      {status === 'waking' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block" />
          Waking up backend... (first load takes ~50s)
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          Backend offline — check Render dashboard
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A2E', color: '#e2e8f0', border: '1px solid #6C63FF' } }} />
      <Navbar />
      <BackendStatus />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/upload"      element={<UploadPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/history"     element={<HistoryPage />} />
          <Route path="/compare"     element={<ComparePage />} />
        </Routes>
      </main>
    </div>
  )
}