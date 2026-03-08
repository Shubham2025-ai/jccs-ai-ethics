import { useState, useEffect } from 'react'
import { Upload, BarChart2, RefreshCw, Zap, CheckCircle, XCircle, Trophy } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'https://jccs-ai-ethics.onrender.com'

const RISK_COLOR = {
  'Critical Risk': '#E94560',
  'High Risk':     '#E17055',
  'Medium Risk':   '#FDCB6E',
  'Low Risk':      '#00B894',
}

const DIM_COLOR = (score) => {
  if (score >= 70) return '#00B894'
  if (score >= 50) return '#FDCB6E'
  if (score >= 30) return '#E17055'
  return '#E94560'
}

/* ── Autorun pipeline trigger ─────────────────────────────────────────────── */
const DEMO_DATASETS = [
  { name: 'adult_income.csv',        label: 'Adult Income',      url: 'https://raw.githubusercontent.com/Shubham2025-ai/jccs-ai-ethics/main/datasets/adult_income.csv' },
  { name: 'german_credit.csv',       label: 'German Credit',     url: 'https://raw.githubusercontent.com/Shubham2025-ai/jccs-ai-ethics/main/datasets/german_credit.csv' },
  { name: 'compas_recidivism.csv',   label: 'COMPAS',            url: 'https://raw.githubusercontent.com/Shubham2025-ai/jccs-ai-ethics/main/datasets/compas_recidivism.csv' },
  { name: 'healthcare_diagnosis.csv',label: 'Healthcare',        url: 'https://raw.githubusercontent.com/Shubham2025-ai/jccs-ai-ethics/main/datasets/healthcare_diagnosis.csv' },
]

function AutorunCard({ onComplete }) {
  const [state, setState] = useState('idle') // idle | fetching | running | done | error
  const [progress, setProgress] = useState([])
  const [statusMsg, setStatusMsg] = useState('')

  const triggerAutorun = async () => {
    setState('fetching')
    setProgress(DEMO_DATASETS.map(d => ({ dataset: d.label, status: 'fetching' })))
    setStatusMsg('Fetching demo datasets...')

    try {
      // Step 1: Fetch all 4 CSVs from GitHub in parallel
      const blobs = await Promise.all(
        DEMO_DATASETS.map(async (d) => {
          const res = await fetch(d.url)
          if (!res.ok) throw new Error(`Failed to fetch ${d.name}`)
          const blob = await res.blob()
          return new File([blob], d.name, { type: 'text/csv' })
        })
      )

      setStatusMsg('Launching parallel audits...')
      setProgress(DEMO_DATASETS.map(d => ({ dataset: d.label, status: 'processing' })))

      // Step 2: Send all to /api/audit/batch
      const formData = new FormData()
      blobs.forEach(f => formData.append('files', f))
      const res = await fetch(`${API}/api/audit/batch`, { method: 'POST', body: formData })
      const data = await res.json()

      setState('running')
      setTimeout(() => pollUntilDone(data.audit_ids), 3000)
    } catch (e) {
      console.error(e)
      setState('error')
      setStatusMsg('Error: ' + e.message)
    }
  }

  const pollUntilDone = (ids) => {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 120) { clearInterval(interval); setState('error'); return }
      try {
        const results = await Promise.all(
          ids.map(id => fetch(`${API}/audit/${id}`).then(r => r.json()))
        )
        setProgress(results.map(r => ({
          dataset: r.audit?.run_name,
          status: r.audit?.status,
          score: r.audit?.overall_score,
          risk: r.audit?.risk_level,
        })))
        const allDone = results.every(r => r.audit?.status === 'completed' || r.audit?.status === 'failed')
        if (allDone) {
          clearInterval(interval)
          setState('done')
          onComplete(ids)
        }
      } catch (e) { /* keep polling */ }
    }, 3000)
  }

  return (
    <div className="glass rounded-3xl p-6 border border-[#6C63FF]/20 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black text-white text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Automated Testing Pipeline
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Runs all 4 demo datasets simultaneously — no upload needed
          </p>
          {statusMsg && <p className="text-purple-400 text-xs mt-1 font-bold">{statusMsg}</p>}
        </div>
        <button
          onClick={triggerAutorun}
          disabled={state === 'fetching' || state === 'running'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-white text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}
        >
          {state === 'fetching'
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Fetching...</>
            : state === 'running'
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Running...</>
            : <><Zap className="w-4 h-4" /> Run Pipeline</>
          }
        </button>
      </div>

      {/* Progress */}
      {progress.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {progress.map((p, i) => (
            <div key={i} className="rounded-xl p-3 border border-white/5"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-xs text-gray-400 mb-1 truncate">{p.dataset || p.run_name}</div>
              {p.status === 'completed' ? (
                <>
                  <div className="text-2xl font-black" style={{ color: DIM_COLOR(p.score || 0) }}>
                    {Math.round(p.score || 0)}
                  </div>
                  <div className="text-xs text-gray-500">{p.risk}</div>
                </>
              ) : p.status === 'failed' ? (
                <div className="text-xs text-red-400">Failed</div>
              ) : (
                <div className="flex items-center gap-1.5 mt-1">
                  <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />
                  <span className="text-xs text-gray-500">Processing...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Multi-file upload ─────────────────────────────────────────────────────── */
function BatchUploadCard({ onComplete }) {
  const [files, setFiles] = useState([])
  const [state, setState] = useState('idle')
  const [batchId, setBatchId] = useState(null)
  const [results, setResults] = useState([])

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.name.endsWith('.csv'))
    setFiles(selected)
  }

  const submitBatch = async () => {
    if (files.length < 2) return
    setState('uploading')
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    try {
      const res = await fetch(`${API}/api/audit/batch`, { method: 'POST', body: formData })
      const data = await res.json()
      setBatchId(data.batch_id)
      setState('running')
      pollBatch(data.batch_id, data.audit_ids)
    } catch (e) { setState('error') }
  }

  const pollBatch = (bid, ids) => {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 120) { clearInterval(interval); setState('error'); return }
      try {
        const res = await fetch(`${API}/api/audit/batch/${bid}`)
        const data = await res.json()
        setResults(data.audits)
        if (data.status === 'completed') {
          clearInterval(interval)
          setState('done')
          onComplete(ids)
        }
      } catch (e) {}
    }, 3000)
  }

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 mb-6">
      <h3 className="font-black text-white text-lg flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-blue-400" /> Upload Multiple Models
      </h3>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <label className="flex-1 border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-[#6C63FF]/40 transition-colors text-center">
          <input type="file" multiple accept=".csv" onChange={handleFiles} className="hidden" />
          <div className="text-gray-400 text-sm">
            {files.length > 0
              ? <span className="text-white font-bold">{files.length} files selected: {files.map(f => f.name).join(', ')}</span>
              : 'Click to select 2–10 CSV files'}
          </div>
        </label>
        <button
          onClick={submitBatch}
          disabled={files.length < 2 || state === 'running' || state === 'uploading'}
          className="px-5 py-3 rounded-xl font-black text-white text-sm transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #6C63FF)' }}
        >
          {state === 'uploading' ? 'Uploading...'
           : state === 'running' ? 'Running...'
           : `Run ${files.length} Audits`}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {r.status === 'completed'
                ? <CheckCircle className="w-3 h-3 text-green-400" />
                : <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />}
              <span className="text-gray-300">{r.run_name}</span>
              {r.overall_score != null && (
                <span style={{ color: DIM_COLOR(r.overall_score) }}>{Math.round(r.overall_score)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Comparison table ─────────────────────────────────────────────────────── */
function ComparisonTable({ auditIds }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auditIds.length) return
    fetch(`${API}/api/audit/compare?ids=${auditIds.join(',')}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [auditIds])

  if (loading) return (
    <div className="glass rounded-3xl p-8 border border-white/10 text-center">
      <RefreshCw className="w-6 h-6 text-purple-400 animate-spin mx-auto mb-2" />
      <p className="text-gray-400 text-sm">Loading comparison...</p>
    </div>
  )

  if (!data?.audits?.length) return null

  const audits = data.audits
  const dims = audits[0]?.dimensions?.map(d => d.name) || []
  const checks = audits[0]?.compliance?.map(c => `${c.standard} ${c.requirement}`) || []

  return (
    <div className="space-y-6">

      {/* Winner banner */}
      <div className="glass rounded-2xl px-6 py-4 border border-yellow-500/20 flex items-center gap-3"
        style={{ background: 'rgba(253,203,110,0.05)' }}>
        <Trophy className="w-6 h-6 text-yellow-400" />
        <div>
          <div className="text-xs text-yellow-400 font-black uppercase tracking-widest">Fairest Model</div>
          <div className="text-white font-black text-lg">{data.winner}</div>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {audits.map((a, i) => (
          <div key={i} className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            {i === 0 && (
              <div className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: '#FDCB6E22', color: '#FDCB6E' }}>
                🏆 BEST
              </div>
            )}
            <div className="text-xs text-gray-500 mb-1 truncate">{a.run_name}</div>
            <div className="text-4xl font-black mb-1" style={{ color: RISK_COLOR[a.risk_level] || '#6C63FF' }}>
              {Math.round(a.overall_score || 0)}
            </div>
            <div className="text-xs font-bold" style={{ color: RISK_COLOR[a.risk_level] || '#6C63FF' }}>
              {a.risk_level}
            </div>
          </div>
        ))}
      </div>

      {/* Dimension comparison bars */}
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h3 className="font-black text-white mb-5 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-purple-400" /> Fairness Dimensions
        </h3>
        <div className="space-y-4">
          {dims.map((dim, di) => (
            <div key={di}>
              <div className="text-xs text-gray-400 mb-2 font-bold">{dim}</div>
              <div className="space-y-1.5">
                {audits.map((a, ai) => {
                  const d = a.dimensions[di]
                  const score = d?.score || 0
                  return (
                    <div key={ai} className="flex items-center gap-3">
                      <div className="text-xs text-gray-500 w-28 truncate">{a.run_name}</div>
                      <div className="flex-1 h-2 rounded-full bg-white/5">
                        <div className="h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${score}%`, background: DIM_COLOR(score) }} />
                      </div>
                      <div className="text-xs font-bold w-8 text-right" style={{ color: DIM_COLOR(score) }}>
                        {Math.round(score)}
                      </div>
                      {d?.passed
                        ? <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        : <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance matrix */}
      <div className="glass rounded-3xl p-6 border border-white/10 overflow-x-auto">
        <h3 className="font-black text-white mb-5">Compliance Matrix</h3>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-gray-500 pb-3 pr-4">Requirement</th>
              {audits.map((a, i) => (
                <th key={i} className="text-center text-gray-400 pb-3 px-2 font-bold">{a.run_name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {audits[0]?.compliance?.map((c, ci) => (
              <tr key={ci} className="border-t border-white/5">
                <td className="py-2 pr-4 text-gray-400">{c.standard} {c.requirement}</td>
                {audits.map((a, ai) => {
                  const check = a.compliance[ci]
                  return (
                    <td key={ai} className="py-2 px-2 text-center">
                      {check?.passed
                        ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                        : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function ComparePage() {
  const [compareIds, setCompareIds] = useState([])

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-2">Bonus Feature</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Multi-Model Comparison
          </h1>
          <p className="text-gray-400 text-sm">
            Test multiple AI models simultaneously and compare their fairness scores side-by-side.
          </p>
        </div>

        {/* Auto pipeline */}
        <AutorunCard onComplete={(ids) => setCompareIds(ids)} />

        {/* Manual batch upload */}
        <BatchUploadCard onComplete={(ids) => setCompareIds(ids)} />

        {/* Comparison results */}
        {compareIds.length > 0 && <ComparisonTable auditIds={compareIds} />}

        {/* Empty state */}
        {compareIds.length === 0 && (
          <div className="glass rounded-3xl p-12 border border-white/5 text-center">
            <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Run the automated pipeline or upload multiple CSVs to see the comparison table.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}