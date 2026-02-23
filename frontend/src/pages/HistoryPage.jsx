import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAudits, deleteAudit } from '../utils/api'
import { Trash2, Eye, Loader, Clock, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const RISK_COLORS = { low: '#00B894', medium: '#FDCB6E', high: '#E17055', critical: '#E94560' }
const SCORE_COLOR = (s) => !s ? '#6b7280' : s >= 80 ? '#00B894' : s >= 60 ? '#FDCB6E' : s >= 40 ? '#E17055' : '#E94560'

export default function HistoryPage() {
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)

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
    try {
      await deleteAudit(id)
      toast.success('Audit deleted')
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <Loader className="w-8 h-8 animate-spin" style={{ color: '#6C63FF' }} />
    </div>
  )

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit History</h1>
          <p className="text-gray-400 text-sm">{audits.length} total audits</p>
        </div>
        <Link to="/upload"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: '#6C63FF' }}>
          + New Audit
        </Link>
      </div>

      {audits.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No audits yet</p>
          <p className="text-gray-400 text-sm mb-4">Upload your first CSV to get started</p>
          <Link to="/upload"
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#6C63FF' }}>
            Start First Audit
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map(a => (
            <div key={a.id} className="glass rounded-xl p-5 flex items-center gap-4 hover:border-[#6C63FF]/30 transition-all border border-white/5">
              {/* Score Badge */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
                style={{ background: SCORE_COLOR(a.overall_score) + '22', color: SCORE_COLOR(a.overall_score) }}>
                {a.overall_score ? Math.round(a.overall_score) : '—'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{a.run_name}</h3>
                  {a.risk_level && (
                    <span className="text-xs px-2 py-0.5 rounded-full uppercase font-bold flex-shrink-0"
                      style={{ background: RISK_COLORS[a.risk_level] + '22', color: RISK_COLORS[a.risk_level] }}>
                      {a.risk_level}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{a.file_name}</span>
                  <span>·</span>
                  <span>{a.row_count?.toLocaleString()} rows</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className={`text-xs px-2 py-1 rounded-lg capitalize flex-shrink-0 ${
                a.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                a.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                a.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
              }`}>{a.status}</div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {a.status === 'completed' && (
                  <Link to={`/results/${a.id}`}
                    className="p-2 rounded-lg bg-[#6C63FF]/20 text-[#6C63FF] hover:bg-[#6C63FF]/30 transition-all">
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                <button onClick={() => handleDelete(a.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
