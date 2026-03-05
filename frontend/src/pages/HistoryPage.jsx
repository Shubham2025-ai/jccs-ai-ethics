import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAudits, deleteAudit } from '../utils/api'
import { Trash2, Eye, Loader, Clock, FileText, Plus, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const SCORE_COLOR = (s) => !s ? '#6b7280' : s >= 80 ? '#00B894' : s >= 60 ? '#FDCB6E' : s >= 40 ? '#E17055' : '#E94560'
const RISK_LABEL = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk', critical: 'Critical' }
const RISK_BG = { low: 'rgba(0,184,148,0.12)', medium: 'rgba(253,203,110,0.12)', high: 'rgba(225,112,85,0.12)', critical: 'rgba(233,69,96,0.12)' }

function ScoreBadge({ score }) {
  const color = SCORE_COLOR(score)
  const r = 22, c = 2 * Math.PI * r
  const offset = score ? c - (score / 100) * c : c
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
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
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    try {
      const res = await listAudits()
      setAudits(res.data.audits || [])
    } catch {
      toast.error('Could not load audit history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this audit?')) return
    setDeleting(id)
    try {
      await deleteAudit(id)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <Loader className="w-8 h-8 animate-spin" style={{ color: '#6C63FF' }} />
    </div>
  )

  const completed = audits.filter(a => a.status === 'completed')
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, a) => s + (a.overall_score || 0), 0) / completed.length)
    : null
  const critical = completed.filter(a => a.risk_level === 'critical').length
  const highRisk = completed.filter(a => a.risk_level === 'high').length

  return (
    <div className="space-y-6 py-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Audit History</h1>
          <p className="text-gray-500 text-sm mt-0.5">{audits.length} total · {completed.length} completed</p>
        </div>
        <Link to="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 20px rgba(108,99,255,0.3)' }}>
          <Plus className="w-4 h-4" /> New Audit
        </Link>
      </div>

      {/* Summary */}
      {completed.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Avg Ethics Score', value: avgScore, color: SCORE_COLOR(avgScore), icon: '📊' },
            { label: 'Completed Audits', value: completed.length, color: '#6C63FF', icon: '✅' },
            { label: 'Critical Risk', value: critical, color: critical > 0 ? '#E94560' : '#00B894', icon: '🚨' },
            { label: 'High Risk', value: highRisk, color: highRisk > 0 ? '#E17055' : '#00B894', icon: '⚠️' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="glass rounded-xl p-4 border border-white/5 text-center">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {audits.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white font-bold text-lg mb-2">No audits yet</p>
          <p className="text-gray-400 text-sm mb-6">Upload your first CSV to start detecting bias</p>
          <Link to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: '#6C63FF' }}>
            <Plus className="w-4 h-4" /> Start First Audit
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {audits.map(a => {
            const color = SCORE_COLOR(a.overall_score)
            return (
              <div key={a.id}
                className="glass rounded-xl border border-white/5 hover:border-[#6C63FF]/20 transition-all overflow-hidden card-hover">
                <div className="flex items-center gap-4 p-4">
                  <ScoreBadge score={a.overall_score} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-white truncate">{a.run_name}</h3>
                      {a.risk_level && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                          style={{ background: RISK_BG[a.risk_level] || 'rgba(107,114,128,0.12)', color: SCORE_COLOR(a.overall_score) }}>
                          {RISK_LABEL[a.risk_level] || a.risk_level}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{a.file_name}</span>
                      <span>·</span>
                      <span>{a.row_count?.toLocaleString()} rows</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold capitalize ${
                      a.status === 'completed' ? 'bg-green-500/12 text-green-400' :
                      a.status === 'processing' ? 'bg-blue-500/12 text-blue-400' :
                      a.status === 'failed' ? 'bg-red-500/12 text-red-400' : 'bg-gray-500/12 text-gray-400'
                    }`}>{a.status}</span>

                    {a.status === 'completed' && (
                      <Link to={`/results/${a.id}`}
                        className="p-2 rounded-lg transition-all hover:scale-110"
                        style={{ background: 'rgba(108,99,255,0.15)', color: '#a78bfa' }}
                        title="View results">
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                      className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-40"
                      style={{ background: 'rgba(233,69,96,0.1)', color: '#E94560' }}
                      title="Delete audit">
                      {deleting === a.id
                        ? <Loader className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {a.overall_score && (
                  <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="h-full bar-fill" style={{ width: `${a.overall_score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}