import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listAudits, deleteAudit } from '../utils/api'
import { Trash2, Eye, Loader, Clock, Shield, Plus, AlertTriangle, Layers, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const SCORE_COLOR = (s) => !s ? '#6b7280' : s >= 80 ? '#00B894' : s >= 65 ? '#FDCB6E' : s >= 50 ? '#E17055' : '#E94560'
const RISK_LABEL = { low: 'Low Risk', medium: 'Medium Risk', moderate: 'Medium Risk', high: 'High Risk', critical: 'Critical Risk' }
const RISK_BG = { low: 'rgba(0,184,148,0.12)', medium: 'rgba(253,203,110,0.12)', moderate: 'rgba(253,203,110,0.12)', high: 'rgba(225,112,85,0.12)', critical: 'rgba(233,69,96,0.12)' }

function ScoreBadge({ score }) {
  const color = SCORE_COLOR(score)
  const r = 22, c = 2 * Math.PI * r
  const offset = score ? c - (score / 100) * c : c
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-black leading-none" style={{ color }}>{score ? Math.round(score) : '—'}</span>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  // FIX: History state definitions
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  // FIX: Load history from /api/audits on mount with defensive fallbacks
  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await listAudits()
      const data = res.data || {}
      const auditList = data.audits || (Array.isArray(data) ? data : [])
      
      // FIX: Frontend console logging
      console.log(`[Frontend] History loaded: ${auditList.length} audits`)
      setAudits(auditList)
    } catch (err) {
      console.error("[Frontend] History fetch failed:", err)
      // FIX: Error state handling
      setError("Failed to load audit history from server.")
      toast.error('Could not load audit history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this safety audit record?')) return
    setDeleting(id)
    try {
      await deleteAudit(id)
      toast.success('Audit deleted')
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  // FIX: Render state: loading
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
      <Loader className="w-10 h-10 animate-spin text-[#6C63FF]" />
      <p className="text-gray-400 text-sm font-medium animate-pulse">Loading audit history...</p>
    </div>
  )

  // FIX: Render state: error
  if (error) return (
    <div className="glass rounded-3xl p-12 text-center border border-red-500/30 max-w-xl mx-auto my-12 space-y-4">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
      <h3 className="text-white font-bold text-lg">Error Loading History</h3>
      <p className="text-red-300 text-xs">{error}</p>
      <button
        onClick={load}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Try Again
      </button>
    </div>
  )

  const completed = audits.filter(a => a.status === 'completed')
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, a) => s + (a.overall_score || 0), 0) / completed.length)
    : null
  const passing = completed.filter(a => (a.overall_score || 0) >= 70).length
  const critical = completed.filter(a => (a.overall_score || 0) < 50).length

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">Evaluation History</h1>
          <p className="text-gray-400 text-xs mt-0.5">{audits.length} safety evaluations · {completed.length} completed</p>
        </div>
        <Link to="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(108,99,255,0.3)]"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #00B894)' }}>
          <Plus className="w-4 h-4" /> New Safety Audit
        </Link>
      </div>

      {/* Summary stats */}
      {completed.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Avg Safety Score', value: avgScore ? `${avgScore}/100` : '—', color: SCORE_COLOR(avgScore), icon: '📊' },
            { label: 'Evaluated Models', value: completed.length, color: '#6C63FF', icon: '🤖' },
            { label: 'Deployment Ready (>=70)', value: passing, color: '#00B894', icon: '🟢' },
            { label: 'Critical Risk (<50)', value: critical, color: critical > 0 ? '#E94560' : '#00B894', icon: '🔴' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="glass rounded-2xl p-4 border border-white/5 text-center">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
              <div className="text-[11px] text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* FIX: Render state: audits.length === 0 (Empty State) */}
      {audits.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/5 space-y-4">
          <div className="text-5xl mb-2">🛡️</div>
          <p className="text-white font-bold text-lg">No audits found. Run your first evaluation!</p>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Launch your first automated IndiaAI red-teaming evaluation to audit an Indic LLM.
          </p>
          <Link to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-[0_0_20px_rgba(108,99,255,0.3)]"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #00B894)' }}>
            <Plus className="w-4 h-4" /> Start Evaluation
          </Link>
        </div>
      ) : (
        // FIX: Render state: audits.length > 0 (List of cards)
        <div className="space-y-3">
          {audits.map(a => {
            const color = SCORE_COLOR(a.overall_score)
            const isDeployable = (a.overall_score || 0) >= 70
            const modelTitle = a.model_name || a.target_model_name || a.run_name || "Indic LLM Target"
            const providerTitle = a.provider || a.target_model_provider || "Sarvam AI"
            const riskKey = (a.risk_level || 'medium').toLowerCase()

            return (
              <div
                key={a.id}
                onClick={() => navigate(`/results/${a.id}`)}
                className="glass rounded-2xl border border-white/5 hover:border-[#6C63FF]/50 transition-all overflow-hidden cursor-pointer group hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-4 p-4">
                  <ScoreBadge score={a.overall_score} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-white text-sm truncate group-hover:text-[#a78bfa] transition-colors">
                        {a.run_name || modelTitle}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#6C63FF]/15 text-[#a78bfa] border border-[#6C63FF]/30">
                        {modelTitle}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                        {providerTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{ background: RISK_BG[riskKey] || 'rgba(107,114,128,0.12)', color: SCORE_COLOR(a.overall_score) }}>
                        {RISK_LABEL[riskKey] || a.risk_level}
                      </span>
                      {a.status === 'completed' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                          isDeployable ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {isDeployable ? 'DEPLOYABLE' : 'ACTION REQUIRED'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-gray-400" />{a.total_probes || a.row_count || 44} Indic Probes</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" />{a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className={`text-[11px] px-2.5 py-1 rounded-xl font-bold uppercase ${
                      a.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      a.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>{a.status}</span>
                    <Link
                      to={`/results/${a.id}`}
                      className="p-2 rounded-xl transition-all hover:scale-105 bg-[#6C63FF]/20 text-[#a78bfa] border border-[#6C63FF]/30 hover:bg-[#6C63FF]/40"
                      title="View Evaluation Results"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, a.id)}
                      disabled={deleting === a.id}
                      className="p-2 rounded-xl transition-all hover:scale-105 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/25 disabled:opacity-40"
                      title="Delete Record"
                    >
                      {deleting === a.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
