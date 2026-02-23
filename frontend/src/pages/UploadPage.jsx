import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, Loader, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadAudit, getAudit } from '../utils/api'

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
    setProgress(0)
    setStatusMsg('Uploading file...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('run_name', runName)
    formData.append('model_type', modelType)

    try {
      const res = await uploadAudit(formData, setProgress)
      const auditId = res.data.audit_id
      toast.success('Audit started!')
      setStatusMsg('Running bias analysis...')

      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const { data } = await getAudit(auditId)
          if (data.audit.status === 'completed') {
            clearInterval(poll)
            toast.success('Analysis complete!')
            navigate(`/results/${auditId}`)
          } else if (data.audit.status === 'failed') {
            clearInterval(poll)
            toast.error('Analysis failed. Check your CSV format.')
            setLoading(false)
          } else {
            const msgs = ['Running fairness dimensions...', 'Computing SHAP values...', 'Generating AI explanations...', 'Checking compliance...', 'Almost done...']
            setStatusMsg(msgs[Math.min(Math.floor(attempts / 4), msgs.length - 1)])
          }
        } catch {}
        if (attempts > 90) { clearInterval(poll); setLoading(false) }
      }, 2000)

    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">New Bias Audit</h1>
        <p className="text-gray-400">Upload your AI model's predictions CSV. We'll analyze bias across 6 fairness dimensions.</p>
      </div>

      {/* CSV Format Guide */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(108,99,255,0.08)', borderColor: 'rgba(108,99,255,0.25)' }}>
        <h3 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: '#6C63FF' }} /> Required CSV Format
        </h3>
        <div className="font-mono text-xs rounded-xl p-3 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#00B894' }}>actual, predicted, gender, age, income, credit_score</div>
          <div className="text-gray-400">1, 1, Male, 34, 50000, 720</div>
          <div className="text-gray-400">0, 1, Female, 28, 45000, 680</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <span className="text-gray-300">actual/label</span> = ground truth &nbsp;·&nbsp;
          <span className="text-gray-300">predicted/pred</span> = model output &nbsp;·&nbsp;
          <span className="text-gray-300">gender/age/race</span> = sensitive attributes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div {...getRootProps()} className={`rounded-2xl p-12 text-center cursor-pointer transition-all border-2 border-dashed ${
          isDragActive ? 'border-[#6C63FF] bg-[#6C63FF]/10' :
          file ? 'border-green-500/50 bg-green-500/5' :
          'border-white/10 hover:border-[#6C63FF]/40 hover:bg-[#6C63FF]/5'
        }`}>
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-white font-bold">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(108,99,255,0.15)' }}>
                <Upload className="w-8 h-8" style={{ color: '#6C63FF' }} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Drop your CSV here</p>
                <p className="text-gray-500 text-sm">or click to browse · Max 50MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Run Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Audit Name</label>
          <input type="text" value={runName} onChange={e => setRunName(e.target.value)}
            placeholder="e.g. Hiring Model v2 — Feb 2026"
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = '#6C63FF'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {/* Model Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Model Type</label>
          <select value={modelType} onChange={e => setModelType(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-white outline-none"
            style={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="classification">Classification — Hiring, Loan Approval, Recidivism</option>
            <option value="regression">Regression — Salary Prediction, Risk Scoring</option>
            <option value="ranking">Ranking — Search Results, Recommendations</option>
          </select>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading || !file}
          className="w-full py-4 rounded-2xl font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2 text-lg"
          style={{ background: loading ? '#6C63FF88' : 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: loading ? 'none' : '0 0 30px rgba(108,99,255,0.3)' }}>
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {statusMsg}
            </>
          ) : (
            <><FileText className="w-5 h-5" /> Run Bias Audit</>
          )}
        </button>
      </form>
    </div>
  )
}
