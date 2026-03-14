import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, Info, X, Zap, Shield, Brain } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadAudit, getAudit } from '../utils/api'

const STEPS = [
  { label: 'Uploading file',          icon: '📤', detail: 'Sending CSV to server...' },
  { label: 'Detecting columns',       icon: '🔍', detail: 'Auto-detecting label, prediction & sensitive attributes...' },
  { label: 'Running fairness analysis',icon: '⚖️', detail: 'Running 6 dimensions in parallel with Fairlearn + AIF360...' },
  { label: 'Computing SHAP values',   icon: '🧠', detail: 'TreeExplainer building global feature attribution...' },
  { label: 'Running LIME analysis',   icon: '🔬', detail: 'Perturbation-based local explanations for individual decisions...' },
  { label: 'Generating AI summary',   icon: '✍️', detail: 'Groq + Llama 3 writing plain-English findings...' },
  { label: 'Mapping compliance',      icon: '📋', detail: 'Mapping results to EU AI Act, DPDP, ISO 42001...' },
  { label: 'Anchoring blockchain',    icon: '⛓️', detail: 'SHA-256 hash being committed to immutable audit trail...' },
  { label: 'Finalising report',       icon: '✅', detail: 'Almost done — building your compliance certificate...' },
]

function LoadingScreen({ statusMsg, progress }) {
  const stepIndex = Math.min(Math.floor((progress / 100) * STEPS.length), STEPS.length - 1)
  const currentStep = STEPS[stepIndex]
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 80)
    return () => clearInterval(t)
  }, [])

  const bars = 20
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(108,99,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-[80px]"
        style={{ background: 'radial-gradient(circle, #6C63FF, #E94560)' }} />

      <div className="relative z-10 text-center space-y-8 max-w-lg w-full px-4">
        {/* Terminal-style header */}
        <div className="rounded-xl p-3 border border-[#6C63FF]/30 text-left font-mono text-xs"
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-500 ml-2">jccs-audit-engine v1.0</span>
          </div>
          <div className="text-green-400">$ {currentStep.icon} {currentStep.label}...</div>
          <div className="text-gray-500 text-[10px] mt-0.5">{currentStep.detail}</div>
          <div className="text-[#6C63FF] mt-1">
            {'█'.repeat(Math.floor(progress / 5))}
            <span className="animate-pulse">▋</span>
            {'░'.repeat(20 - Math.floor(progress / 5))} {Math.round(progress)}%
          </div>
        </div>

        {/* Score ring */}
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
            <circle cx="80" cy="80" r="68" fill="none" strokeWidth="10"
              stroke="url(#loadGrad)" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.6s ease', filter: 'drop-shadow(0 0 8px #6C63FF)' }}
            />
            <defs>
              <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#E94560" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl">{currentStep.icon}</span>
            <span className="text-white font-black text-xl">{Math.round(progress)}%</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white mb-1">{currentStep.label}</h2>
          <p className="text-gray-400 text-sm">{statusMsg}</p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap px-4">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-1 transition-all duration-500`}>
              <div className={`rounded-full transition-all duration-500 ${
                i < stepIndex ? 'w-2 h-2 bg-green-400' :
                i === stepIndex ? 'w-3 h-3 bg-[#6C63FF] shadow-[0_0_8px_#6C63FF]' :
                'w-1.5 h-1.5 bg-white/10'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [runName, setRunName] = useState('')
  const [modelType, setModelType] = useState('classification')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [hovered, setHovered] = useState(null)

  const onDrop = useCallback(accepted => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/csv': ['.csv'] }, maxFiles: 1
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please upload a CSV file')
    if (!runName.trim()) return toast.error('Please enter a run name')

    setLoading(true)
    setProgress(5)
    setStatusMsg('Uploading...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('run_name', runName)
    formData.append('model_type', modelType)

    try {
      const res = await uploadAudit(formData, (p) => setProgress(Math.max(5, p * 0.2)))
      const auditId = res.data.audit_id
      toast.success('Audit started!')
      setProgress(20)

      let attempts = 0
      const statusMessages = [
        { at: 20, msg: 'Parsing CSV and detecting columns...' },
        { at: 30, msg: 'Detecting sensitive attributes...' },
        { at: 40, msg: 'Running demographic parity analysis...' },
        { at: 50, msg: 'Computing equal opportunity & calibration...' },
        { at: 58, msg: 'Running counterfactual fairness tests...' },
        { at: 65, msg: 'Running SHAP feature importance...' },
        { at: 72, msg: 'Running LIME local explanations...' },
        { at: 78, msg: 'Mapping regulatory compliance...' },
        { at: 83, msg: 'Generating AI ethics summary...' },
        { at: 88, msg: 'Anchoring to blockchain...' },
        { at: 91, msg: 'Finalizing audit report...' },
      ]

      const poll = setInterval(async () => {
        attempts++
        const newProgress = Math.min(92, 20 + 72 * (1 - Math.exp(-attempts / 18)))
        setProgress(newProgress)
        const currentMsg = statusMessages.filter(s => newProgress >= s.at).pop()
        if (currentMsg) setStatusMsg(currentMsg.msg)

        try {
          const { data } = await getAudit(auditId)
          if (data.audit.status === 'completed') {
            clearInterval(poll)
            setStatusMsg('Audit complete!')
            setProgress(100)
            toast.success('Analysis complete!')
            setTimeout(() => navigate(`/results/${auditId}`), 500)
          } else if (data.audit.status === 'failed') {
            clearInterval(poll)
            toast.error('Analysis failed. Check your CSV format.')
            setLoading(false)
          }
        } catch {}
        if (attempts > 90) {
          clearInterval(poll)
          toast.error('Audit timed out. Please try again.')
          setLoading(false)
        }
      }, 2000)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen statusMsg={statusMsg} progress={progress} />

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 relative">

      {/* Background glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #6C63FF 0%, #E94560 60%, transparent 80%)' }} />

      {/* Header */}
      <div className="mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black mb-3"
          style={{ background: 'rgba(108,99,255,0.12)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.25)' }}>
          <Zap className="w-3 h-3" /> BIAS DETECTION ENGINE
        </div>
        <h1 className="text-5xl font-black text-white mb-3 leading-tight">
          New Bias<br />
          <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundImage: 'linear-gradient(135deg, #6C63FF, #E94560)' }}>Audit</span>
        </h1>
        <p className="text-gray-400">Upload your AI model's predictions CSV. We'll analyze bias across <span className="text-white font-bold">6 fairness dimensions</span> in under <span className="text-[#6C63FF] font-bold">60 seconds</span>.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Shield className="w-4 h-4" />, label: '6 Dimensions', sub: 'Fairness checks', color: '#6C63FF' },
          { icon: <Brain className="w-4 h-4" />, label: 'SHAP + LIME', sub: 'Explainability', color: '#E94560' },
          { icon: <Zap className="w-4 h-4" />, label: '< 60 Seconds', sub: 'Full audit', color: '#00B894' },
        ].map(({ icon, label, sub, color }) => (
          <div key={label} className="rounded-xl p-3 border border-white/5 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: color + '18', color }}>
              {icon}
            </div>
            <div>
              <div className="text-white text-xs font-black">{label}</div>
              <div className="text-gray-600 text-[10px]">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Format Guide */}
      <div className="rounded-2xl p-5 mb-5 border relative overflow-hidden"
        style={{ background: 'rgba(108,99,255,0.04)', borderColor: 'rgba(108,99,255,0.18)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-[40px]"
          style={{ background: '#6C63FF' }} />
        <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-[#6C63FF]" /> Expected CSV Format
        </h3>
        <div className="rounded-xl p-4 overflow-x-auto mb-4 font-mono text-xs border border-white/5"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-gray-600 ml-1 text-[10px]">dataset.csv</span>
          </div>
          <div style={{ color: '#a78bfa' }}># Column headers (any domain works)</div>
          <div style={{ color: '#00B894' }}>actual, predicted, gender, age, race, income</div>
          <div className="text-gray-500">1, 1, Male, 34, White, 55000</div>
          <div className="text-gray-500">0, 1, Female, 28, Black, 42000</div>
          <div className="text-gray-500">1, 0, Male, 45, Hispanic, 61000</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { key: 'actual / label', val: 'Ground truth outcome', color: '#00B894' },
            { key: 'predicted / pred', val: 'Model output / score', color: '#6C63FF' },
            { key: 'gender / age / race', val: 'Sensitive attributes', color: '#FDCB6E' },
          ].map(({ key, val, color }) => (
            <div key={key} className="rounded-lg p-2.5 text-center border border-white/5"
              style={{ background: color + '08' }}>
              <div className="font-mono font-bold mb-0.5 text-[11px]" style={{ color }}>{key}</div>
              <div className="text-gray-500 text-[10px]">{val}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Dropzone */}
        <div {...getRootProps()} className="relative cursor-pointer group"
          style={{ borderRadius: '20px' }}>
          <div className={`rounded-[20px] p-10 text-center transition-all duration-300 border-2 border-dashed ${
            isDragActive ? 'border-[#6C63FF] scale-[1.01]' :
            file ? 'border-green-500/50' :
            'border-white/8 group-hover:border-[#6C63FF]/40'
          }`}
            style={{
              background: isDragActive ? 'rgba(108,99,255,0.08)' :
                file ? 'rgba(0,184,148,0.04)' : 'rgba(255,255,255,0.02)',
            }}>
            <input {...getInputProps()} />

            {/* Animated corner accents */}
            {!file && (
              <>
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#6C63FF]/40 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#6C63FF]/40 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#6C63FF]/40 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#6C63FF]/40 rounded-br-lg" />
              </>
            )}

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(0,184,148,0.15)' }}>
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-black text-lg">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{(file.size / 1024).toFixed(1)} KB · Ready to audit</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10">
                  <X className="w-3 h-3" /> Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: isDragActive ? 'rgba(108,99,255,0.25)' : 'rgba(108,99,255,0.1)',
                           boxShadow: isDragActive ? '0 0 30px rgba(108,99,255,0.3)' : 'none' }}>
                  <Upload className="w-8 h-8 text-[#6C63FF]" />
                </div>
                <div>
                  <p className="text-white font-black text-xl">
                    {isDragActive ? '⚡ Drop it!' : 'Drop your CSV here'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">or click to browse · Max 50MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Run Name */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Audit Name <span className="text-[#6C63FF]">*</span>
          </label>
          <input type="text" value={runName} onChange={e => setRunName(e.target.value)}
            placeholder="e.g. Hiring Model v2 — COMPAS Analysis"
            className="w-full rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all text-sm"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                     fontFamily: 'inherit' }}
            onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Model Type */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3">Model Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'classification', label: 'Classification', desc: 'Hiring, Loans, Recidivism', icon: '🎯', color: '#6C63FF' },
              { value: 'regression',     label: 'Regression',     desc: 'Salary, Risk Scoring',    icon: '📈', color: '#E94560' },
              { value: 'ranking',        label: 'Ranking',        desc: 'Search, Recommendations', icon: '🏆', color: '#FDCB6E' },
            ].map(({ value, label, desc, icon, color }) => (
              <button key={value} type="button" onClick={() => setModelType(value)}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(null)}
                className="rounded-xl p-4 text-left transition-all duration-200 relative overflow-hidden"
                style={{
                  border: `1px solid ${modelType === value ? color + '60' : 'rgba(255,255,255,0.06)'}`,
                  background: modelType === value ? color + '10' : 'rgba(255,255,255,0.02)',
                  transform: hovered === value ? 'translateY(-2px)' : 'none',
                  boxShadow: modelType === value ? `0 0 20px ${color}20` : 'none',
                }}>
                {modelType === value && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: color }} />
                )}
                <div className="text-xl mb-2">{icon}</div>
                <div className="font-black text-sm text-white">{label}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={!file || !runName.trim()}
          className="w-full py-4 rounded-2xl font-black text-white text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group"
          style={{
            background: (!file || !runName.trim()) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6C63FF, #E94560)',
            boxShadow: (!file || !runName.trim()) ? 'none' : '0 0 40px rgba(108,99,255,0.4), 0 4px 15px rgba(233,69,96,0.2)',
          }}>
          {file && runName.trim() && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #E94560)' }} />
          )}
          <FileText className="w-5 h-5 relative z-10" />
          <span className="relative z-10">
            {file && runName.trim() ? '⚡ Run Bias Audit' : 'Run Bias Audit'}
          </span>
        </button>

        {/* Fine print */}
        {file && runName.trim() && (
          <p className="text-center text-xs text-gray-600">
            Analysis takes 30–60 seconds · Results include SHAP, LIME, compliance report & blockchain certificate
          </p>
        )}
      </form>
    </div>
  )
}