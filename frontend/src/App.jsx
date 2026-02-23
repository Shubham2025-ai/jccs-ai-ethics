import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/dashboard/Navbar'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1A1A2E', color: '#e2e8f0', border: '1px solid #6C63FF' } }} />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/upload"   element={<UploadPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/history"  element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  )
}
