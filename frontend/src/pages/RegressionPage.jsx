import { useState } from 'react'
import { RefreshCw, Upload, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'https://jccs-ai-ethics.onrender.com'
const SCORE_COLOR = (s) => s >= 80 ? '#00B894' : s >= 60 ? '#FDCB6E' : s >= 40 ? '#E17055' : '#E94560'

export default function RegressionPage() {
  const [baselineFile, setBaselineFile] = useState(null)
  const [improvedFile, setImprovedFile] = useState(null)
  const [state, setState] = useState('idle') // idle | running | done | error
  const [results, setResults] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')

  const runTest = async () => {
    if (!baselineFile || !improvedFile) return
    setState('running')
    setStatusMsg('Uploading both models...')

    try {
      const formData = new FormData()
      formData.append('baseline_file', baselineFile)
      formData.append('improved_file', improvedFile)

      const res = await fetch(`${API}/api/audit/regression-test`, { method: 'POST', body: formData })
      const data = await res.json()

      setStatusMsg('Both models auditing in parallel...')
      pollResults(data.regression_id)
    } catch (e) {
      setState('error')
      setStatusMsg('Error: ' + e.message)
    }
  }

  const pollResults = (id) => {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 120) { clearInterval(interval); setState('error'); return }
      try {
        const res = await fetch(`${API}/api/audit/regression-test/${id}`)
        const data = await res.json()
        if (data.status === 'completed') {
          clearInterval(interval)
          setResults(data)
          setState('done')
        } else {
          setStatusMsg(`${data.baseline_status === 'completed' ? '✅' : '⏳'} Baseline  |  ${data.improved_status === 'completed' ? '✅' : '⏳'} Improved`)
        }
      } catch {}
    }, 3000)
  }

  const verdictColor = results?.verdict === 'PASSED' ? '#00B894' : results?.verdict === 'FAILED' ? '#E94560' : '#FDCB6E'
  const verdictBg = results?.verdict === 'PASSED' ? 'rgba(0,184,148,0.08)' : results?.verdict === 'FAILED' ? 'rgba(233,69,96,0.08)' : 'rgba(253,203,110,0.08)'

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-2">Round 3 Feature</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Regression Testing</h1>
          <p className="text-gray-400 text-sm">Upload your baseline model and improved model — JCCS will tell you if your changes actually reduced bias or made things worse.</p>
        </div>

        {/* Upload section */}
        {state === 'idle' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Baseline */}
              <div className="glass rounded-2xl p-5 border border-red-500/20">
                <div className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">📊 Baseline Model</div>
                <p className="text-gray-500 text-xs mb-3">Your original / current model CSV</p>
                <label className="block border-2 border-dashed border-red-500/20 rounded-xl p-4 cursor-pointer hover:border-red-500/40 transition-colors text-center">
                  <input type="file" accept=".csv" onChange={e => setBaselineFile(e.target.files[0])} className="hidden" />
                  {baselineFile
                    ? <span className="text-white font-bold text-sm">✅ {baselineFile.name}</span>
                    : <span className="text-gray-500 text-sm">Click to upload baseline CSV</span>}
                </label>
              </div>

              {/* Improved */}
              <div className="glass rounded-2xl p-5 border border-green-500/20">
                <div className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">🚀 Improved Model</div>
                <p className="text-gray-500 text-xs mb-3">Your updated / debiased model CSV</p>
                <label className="block border-2 border-dashed border-green-500/20 rounded-xl p-4 cursor-pointer hover:border-green-500/40 transition-colors text-center">
                  <input type="file" accept=".csv" onChange={e => setImprovedFile(e.target.files[0])} className="hidden" />
                  {improvedFile
                    ? <span className="text-white font-bold text-sm">✅ {improvedFile.name}</span>
                    : <span className="text-gray-500 text-sm">Click to upload improved CSV</span>}
                </label>
              </div>
            </div>

            <button
              onClick={runTest}
              disabled={!baselineFile || !improvedFile}
              className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}>
              🧪 Run Regression Test — Compare Both Models
            </button>

            <div className="glass rounded-xl p-4 border border-white/5 text-xs text-gray-500 text-center">
              Both models will be audited simultaneously in parallel threads. Results appear in ~60 seconds.
            </div>
          </div>
        )}

        {/* Running state */}
        {state === 'running' && (
          <div className="glass rounded-2xl p-10 border border-[#6C63FF]/20 text-center">
            <RefreshCw className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
            <div className="font-black text-white text-lg mb-2">Running Regression Test</div>
            <div className="text-gray-400 text-sm">{statusMsg}</div>
            <div className="mt-4 text-xs text-gray-600">Both models are being audited across 9 fairness dimensions simultaneously...</div>
          </div>
        )}

        {/* Results */}
        {state === 'done' && results && (
          <div className="space-y-4">

            {/* Verdict banner */}
            <div className="rounded-2xl p-6 border text-center"
              style={{ background: verdictBg, borderColor: verdictColor + '40' }}>
              <div className="text-4xl mb-2">
                {results.verdict === 'PASSED' ? '✅' : results.verdict === 'FAILED' ? '❌' : '⚠️'}
              </div>
              <div className="text-2xl font-black mb-1" style={{ color: verdictColor }}>
                Regression Test {results.verdict}
              </div>
              <div className="text-sm text-gray-300">{results.verdict_message}</div>
            </div>

            {/* Score comparison */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 text-center border border-red-500/20">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Baseline</div>
                <div className="text-4xl font-black mb-1" style={{ color: SCORE_COLOR(results.overall.baseline_score) }}>
                  {results.overall.baseline_score}
                </div>
                <div className="text-xs font-bold uppercase" style={{ color: SCORE_COLOR(results.overall.baseline_score) }}>
                  {results.overall.baseline_risk} risk
                </div>
              </div>

              <div className="glass rounded-2xl p-5 text-center border flex flex-col items-center justify-center"
                style={{ borderColor: verdictColor + '40' }}>
                <div className="text-2xl font-black mb-1" style={{ color: verdictColor }}>
                  {results.overall.diff > 0 ? '+' : ''}{results.overall.diff}
                </div>
                <div className="text-xs text-gray-500">points change</div>
                {results.overall.diff > 0
                  ? <TrendingUp className="w-5 h-5 mt-1" style={{ color: verdictColor }} />
                  : results.overall.diff < 0
                  ? <TrendingDown className="w-5 h-5 mt-1" style={{ color: verdictColor }} />
                  : <Minus className="w-5 h-5 mt-1" style={{ color: verdictColor }} />}
              </div>

              <div className="glass rounded-2xl p-5 text-center border border-green-500/20">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Improved</div>
                <div className="text-4xl font-black mb-1" style={{ color: SCORE_COLOR(results.overall.improved_score) }}>
                  {results.overall.improved_score}
                </div>
                <div className="text-xs font-bold uppercase" style={{ color: SCORE_COLOR(results.overall.improved_score) }}>
                  {results.overall.improved_risk} risk
                </div>
              </div>
            </div>

            {/* Summary pills */}
            <div className="flex gap-3 flex-wrap justify-center">
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(0,184,148,0.15)', color: '#00B894' }}>
                ✅ {results.summary.improved_dimensions} dimensions improved
              </div>
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(107,114,128,0.15)', color: '#9ca3af' }}>
                ➡️ {results.summary.stable_dimensions} dimensions stable
              </div>
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(233,69,96,0.15)', color: '#E94560' }}>
                ❌ {results.summary.degraded_dimensions} dimensions degraded
              </div>
            </div>

            {/* Dimension diff table */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="font-black text-white mb-4">Per-Dimension Regression Results</h3>
              <div className="space-y-3">
                {results.dimension_diff.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {d.status === 'improved' ? <TrendingUp className="w-3.5 h-3.5 text-green-400" /> :
                         d.status === 'degraded' ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
                         <Minus className="w-3.5 h-3.5 text-gray-500" />}
                        <span className="text-gray-300 font-medium capitalize">{d.dimension.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{d.baseline_score}</span>
                        <span className="text-gray-600">→</span>
                        <span className="font-bold" style={{ color: SCORE_COLOR(d.improved_score) }}>{d.improved_score}</span>
                        <span className="font-black text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: d.status === 'improved' ? 'rgba(0,184,148,0.15)' : d.status === 'degraded' ? 'rgba(233,69,96,0.15)' : 'rgba(107,114,128,0.15)',
                            color: d.status === 'improved' ? '#00B894' : d.status === 'degraded' ? '#E94560' : '#9ca3af'
                          }}>
                          {d.diff > 0 ? '+' : ''}{d.diff}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-14">Baseline</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div className="h-1.5 rounded-full" style={{ width: `${d.baseline_score}%`, background: '#E94560' }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-14">Improved</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div className="h-1.5 rounded-full" style={{ width: `${d.improved_score}%`, background: '#00B894' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run again button */}
            <button onClick={() => { setState('idle'); setResults(null); setBaselineFile(null); setImprovedFile(null) }}
              className="w-full py-3 rounded-xl font-black text-white text-sm border border-white/10 hover:border-[#6C63FF]/30 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              🔄 Run Another Regression Test
            </button>
          </div>
        )}

        {state === 'error' && (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <div className="text-white font-black mb-2">Test Failed</div>
            <div className="text-gray-400 text-sm mb-4">{statusMsg}</div>
            <button onClick={() => { setState('idle'); setStatusMsg('') }}
              className="px-6 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: '#6C63FF' }}>Try Again</button>
          </div>
        )}

      </div>
    </div>
  )
}