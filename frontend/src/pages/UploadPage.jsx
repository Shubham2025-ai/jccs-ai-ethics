import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, Loader, Info, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadAudit, getAudit } from '../utils/api'

const STEPS = [
  { label: 'Uploading file', icon: '📤', detail: 'Sending CSV to server...' },
  { label: 'Detecting columns', icon: '🔍', detail: 'Auto-detecting label, prediction & sensitive attributes...' },
  { label: 'Running fairness analysis', icon: '⚖️', detail: 'Running 6 dimensions in parallel with Fairlearn + AIF360...' },
  { label: 'Computing SHAP values', icon: '🧠', detail: 'TreeExplainer building global feature attribution...' },
  { label: 'Running LIME analysis', icon: '🔬', detail: 'Perturbation-based local explanations for individual decisions...' },
  { label: 'Generating AI summary', icon: '✍️', detail: 'Groq + Llama 3 writing plain-English findings...' },
  { label: 'Mapping compliance', icon: '📋', detail: 'Mapping results to EU AI Act, DPDP, ISO 42001...' },
  { label: 'Anchoring blockchain', icon: '⛓️', detail: 'SHA-256 hash being committed to immutable audit trail...' },
  { label: 'Finalising report', icon: '✅', detail: 'Almost done — building your compliance certificate...' },
]

function LoadingScreen({ statusMsg, progress }) {
  const stepIndex = Math.min(Math.floor((progress / 100) * STEPS.length), STEPS.length - 1)
  const currentStep = STEPS[stepIndex]

  return (
    <div className="max-w-lg mx-auto py-16 text-center space-y-8">
      {/* Animated ring */}
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="64" cy="64" r="54" fill="none" strokeWidth="8"
            stroke="url(#grad)" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#E94560" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl">{currentStep.icon}</span>
          <span className="text-white font-black text-lg">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">{currentStep.label}</h2>
        <p className="text-gray-400 text-sm">{currentStep.detail}</p>
      </div>

      {/* Step progress dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap px-4">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i < stepIndex ? 'bg-green-400 scale-100' :
              i === stepIndex ? 'scale-125' : 'bg-white/10'
            }`}
              style={i === stepIndex ? { background: '#6C63FF', boxShadow: '0 0 8px #6C63FF' } : {}}
            />
          </div>
        ))}
      </div>

      {/* Step list */}
      <div className="glass rounded-2xl p-4 text-left space-y-2">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 text-sm transition-all ${
            i < stepIndex ? 'opacity-40' : i === stepIndex ? 'opacity-100' : 'opacity-20'
          }`}>
            <span className="text-base">{i < stepIndex ? '✅' : i === stepIndex ? <Loader className="w-4 h-4 animate-spin inline" style={{ color: '#6C63FF' }} /> : '○'}</span>
            <span className={i === stepIndex ? 'text-white font-semibold' : 'text-gray-400'}>{s.label}</span>
          </div>
        ))}
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

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) {
      setFile(accepted[0])
      if (!runName) setRunName(accepted[0].name.replace('.csv', ''))
    }
  }, [runName])

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

      // Status messages shown at different progress stages
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
        // Smooth exponential easing — never freezes, always moving
        const newProgress = Math.min(92, 20 + 72 * (1 - Math.exp(-attempts / 18)))
        setProgress(newProgress)

        // Update status message based on current progress
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
        // Timeout after 3 minutes (90 attempts × 2s)
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
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">New Bias Audit</h1>
        <p className="text-gray-400 text-sm">Upload your AI model's predictions CSV. We'll analyze bias across 6 fairness dimensions in under 60 seconds.</p>
      </div>

      {/* Format Guide */}
      <div className="rounded-2xl p-5 border" style={{ background: 'rgba(108,99,255,0.06)', borderColor: 'rgba(108,99,255,0.22)' }}>
        <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: '#6C63FF' }} /> Expected CSV Format
        </h3>
        <div className="font-mono text-xs rounded-xl p-4 overflow-x-auto mb-3" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ color: '#a78bfa' }}># Column headers (any domain works)</div>
          <div style={{ color: '#00B894' }}>actual, predicted, gender, age, race, income</div>
          <div className="text-gray-500">1, 1, Male, 34, White, 55000</div>
          <div className="text-gray-500">0, 1, Female, 28, Black, 42000</div>
          <div className="text-gray-500">1, 0, Male, 45, Hispanic, 61000</div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { key: 'actual / label', val: 'Ground truth outcome', color: '#00B894' },
            { key: 'predicted / pred', val: 'Model output / score', color: '#6C63FF' },
            { key: 'gender / age / race', val: 'Sensitive attributes', color: '#FDCB6E' },
          ].map(({ key, val, color }) => (
            <div key={key} className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="font-mono font-bold mb-0.5" style={{ color }}>{key}</div>
              <div className="text-gray-500">{val}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div {...getRootProps()} className={`rounded-2xl p-12 text-center cursor-pointer transition-all border-2 border-dashed ${
          isDragActive ? 'border-[#6C63FF] bg-[#6C63FF]/10' :
          file ? 'border-green-500/40 bg-green-500/5' :
          'border-white/8 hover:border-[#6C63FF]/35 hover:bg-[#6C63FF]/4'
        }`}>
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <div>
                <p className="text-white font-bold text-lg">{file.name}</p>
                <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors">
                <X className="w-3 h-3" /> Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: isDragActive ? 'rgba(108,99,255,0.25)' : 'rgba(108,99,255,0.12)' }}>
                <Upload className="w-8 h-8" style={{ color: '#6C63FF' }} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">{isDragActive ? 'Drop it!' : 'Drop your CSV here'}</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse · Max 50MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Run Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Audit Name</label>
          <input type="text" value={runName} onChange={e => setRunName(e.target.value)}
            placeholder="e.g. Hiring Model v2 — COMPAS Analysis"
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = '#6C63FF'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {/* Model Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Model Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'classification', label: 'Classification', desc: 'Hiring, Loans, Recidivism', icon: '🎯' },
              { value: 'regression', label: 'Regression', desc: 'Salary, Risk Scoring', icon: '📈' },
              { value: 'ranking', label: 'Ranking', desc: 'Search, Recommendations', icon: '🏆' },
            ].map(({ value, label, desc, icon }) => (
              <button key={value} type="button" onClick={() => setModelType(value)}
                className={`rounded-xl p-3 text-left transition-all border ${
                  modelType === value
                    ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-white'
                    : 'border-white/8 bg-white/3 text-gray-400 hover:border-white/20'
                }`}>
                <div className="text-lg mb-1">{icon}</div>
                <div className="font-bold text-sm">{label}</div>
                <div className="text-xs opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={!file || !runName.trim()}
          className="w-full py-4 rounded-2xl font-black text-white text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: (!file || !runName.trim()) ? 'none' : '0 0 30px rgba(108,99,255,0.35)' }}>
          <FileText className="w-5 h-5" /> Run Bias Audit
        </button>
      </form>
    </div>
  )
}