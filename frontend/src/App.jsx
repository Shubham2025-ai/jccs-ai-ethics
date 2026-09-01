import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Navbar from './components/dashboard/Navbar'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import ComparePage from './pages/ComparePage'
import RegressionPage from './pages/RegressionPage'
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
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold shadow-fortress-card"
      style={{
        background: '#13131f',
        border: `1px solid ${status === 'offline' ? '#c0392b' : '#ff9933'}`,
        color: status === 'offline' ? '#c0392b' : '#ff9933',
        boxShadow: status === 'offline' ? '0 0 20px rgba(192,57,43,0.2)' : '0 0 20px rgba(255,153,51,0.2)'
      }}
    >
      {status === 'waking' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-saffron animate-pulse inline-block" />
          Waking up sovereign engine... (~30s)
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-safety-crimson inline-block" />
          Backend offline — check Render service
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-fortress-base text-ink-white selection:bg-saffron/20 selection:text-saffron">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#13131f',
            color: '#f0f0f5',
            border: '1px solid #1e1e2e',
            borderLeft: '4px solid #ff9933',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '12px'
          },
          error: {
            style: {
              background: '#13131f',
              color: '#f0f0f5',
              border: '1px solid #1e1e2e',
              borderLeft: '4px solid #c0392b',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px'
            }
          }
        }}
      />
      <Navbar />
      <BackendStatus />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/upload"      element={<UploadPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/history"     element={<HistoryPage />} />
          <Route path="/compare"     element={<ComparePage />} />
          <Route path="/regression"  element={<RegressionPage />} />
        </Routes>
      </main>
    </div>
  )
}