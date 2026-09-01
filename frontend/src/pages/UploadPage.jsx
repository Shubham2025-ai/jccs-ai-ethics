import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Sparkles, Server, Key, Globe, Layers, Play, CheckCircle, Loader, Info, ChevronDown, ChevronUp, Lock, Check, Zap, AlertTriangle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { startRedTeamAudit, uploadAudit, getAudit, testTargetConnection } from '../utils/api'

const EVALUATION_STEPS = [
  { label: 'Connecting to target model', icon: '⚡', detail: 'Establishing secure async API connection...' },
  { label: 'Probing Caste Equity (EN/HI/TA)', icon: '👥', detail: 'Evaluating counterfactual surname pairs across hiring, credit & tenancy...' },
  { label: 'Probing Gender Assumptions', icon: '⚖️', detail: 'Testing occupational roles & grammatical gender defaults in Hindi/Tamil...' },
  { label: 'Testing Regional & Communal Harmony', icon: '🏛️', detail: 'Evaluating North-South workplace tropes & 8th Schedule linguistic parity...' },
  { label: 'Executing Adversarial Jailbreak Tests', icon: '🛡️', detail: 'Probing DevMode evasion, OTP fraud refusal & DPDP PII protection...' },
  { label: 'LLM-as-a-Judge Evaluating Verdicts', icon: '🤖', detail: 'Groq LLaMA 3.3 70B scoring compliance against IndiaAI rubrics...' },
  { label: 'Aggregating 9 IndiaAI Dimensions', icon: '📊', detail: 'Computing continuous safety scores, disparity metrics & risk tier...' },
  { label: 'Mapping MeitY & DPDP Compliance', icon: '📋', detail: 'Verifying adherence to IndiaAI Institute & DPDP Act 2023 mandates...' },
  { label: 'Anchoring Cryptographic Audit Trail', icon: '⛓️', detail: 'Committing HMAC-SHA256 signature to Bitcoin/OriginStamp proof...' },
]

const PRESET_MODELS = [
  {
    id: 'baseline-simulated',
    title: 'Indic LLM 7B (Unaligned Baseline)',
    provider: 'demo',
    modelName: 'indic-base-7b-simulated',
    desc: 'Simulated unaligned baseline model to test and detect demographic variances across Indian cultural contexts.',
    badge: '⚠️ Unguardrailed — For Testing',
    badgeBg: 'rgba(253, 203, 110, 0.12)',
    badgeBorder: 'rgba(253, 203, 110, 0.3)',
    badgeColor: '#FDCB6E',
    borderColor: '#FDCB6E',
    cardBg: 'rgba(253, 203, 110, 0.04)'
  },
  {
    id: 'guardrailed-simulated',
    title: 'Indic LLM 7B (Safety Guardrailed)',
    provider: 'demo',
    modelName: 'indic-guardrailed-7b-simulated',
    desc: 'Simulated model with cultural guardrails and calibrated refusal boundaries applied.',
    badge: '🛡️ Aligned Model (Simulated)',
    badgeBg: 'rgba(0, 184, 148, 0.12)',
    badgeBorder: 'rgba(0, 184, 148, 0.3)',
    badgeColor: '#00B894',
    borderColor: '#00B894',
    cardBg: 'rgba(0, 184, 148, 0.04)'
  },
  {
    id: 'groq-live',
    title: 'Live Cloud Endpoint (Groq GPT-OSS 20B)',
    provider: 'groq',
    modelName: 'openai/gpt-oss-20b',
    desc: 'Real-time inference against OpenAI GPT-OSS 20B hosted on Groq Cloud.',
    badge: '⚡ Live Real-Time API',
    badgeBg: 'rgba(108, 99, 255, 0.15)',
    badgeBorder: 'rgba(108, 99, 255, 0.35)',
    badgeColor: '#a78bfa',
    borderColor: '#6C63FF',
    cardBg: 'rgba(108, 99, 255, 0.05)',
    isLive: true
  }
]

const PROVIDER_CONFIGS = {
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    badge: '⚡ Fast Free Tier',
    badgeColor: '#6C63FF',
    keyLink: 'https://console.groq.com/keys',
    keyLinkText: 'console.groq.com/keys',
    keyDesc: 'Get a free API key at console.groq.com/keys — generous free tier with high rate limits.',
    modelDefault: 'openai/gpt-oss-20b',
    modelHint: 'Recommended: openai/gpt-oss-120b, openai/gpt-oss-20b, meta-llama/llama-4-scout-17b-16e-instruct',
    urlDefault: 'https://api.groq.com/openai/v1',
    serverKeyStatus: '✓ Server default Groq key active — leave API Key blank to use pre-configured key.',
    isServerKeyAvailable: true,
  },
  sarvam: {
    id: 'sarvam',
    name: 'Sarvam AI (Indic Sovereign LLM)',
    badge: '🇮🇳 Sovereign Indian AI',
    badgeColor: '#FF6B6B',
    keyLink: 'https://dashboard.sarvam.ai/',
    keyLinkText: 'dashboard.sarvam.ai',
    keyDesc: 'Get your api-subscription-key at dashboard.sarvam.ai — sovereign Indic foundation models.',
    modelDefault: 'sarvam-105b',
    modelHint: 'Supported Cloud Models: sarvam-105b, sarvam-105b-conversations | Local: sarvam-2b',
    urlDefault: 'https://api.sarvam.ai/v1',
    serverKeyStatus: 'ⓘ Enter personal Sarvam api-subscription-key (sent via api-subscription-key header).',
    isServerKeyAvailable: false,
  },
  google: {
    id: 'google',
    name: 'Google AI Studio (Gemini)',
    badge: '✨ 100% Free Tier',
    badgeColor: '#4285F4',
    keyLink: 'https://aistudio.google.com/apikey',
    keyLinkText: 'aistudio.google.com/apikey',
    keyDesc: 'Get a free API key at aistudio.google.com/apikey — 15 RPM free tier with zero credit card.',
    modelDefault: 'gemini-3.6-flash',
    modelHint: 'Supported Models: gemini-3.6-flash, gemini-2.5-flash',
    urlDefault: 'https://generativelanguage.googleapis.com/v1beta',
    serverKeyStatus: 'ⓘ Enter personal Google AI Studio key (ephemeral — passed via x-goog-api-key header).',
    isServerKeyAvailable: false,
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Free-Tier Router)',
    badge: '🌐 Free Models',
    badgeColor: '#00B894',
    keyLink: 'https://openrouter.ai/keys',
    keyLinkText: 'openrouter.ai/keys',
    keyDesc: 'Get a free API key at openrouter.ai/keys — free-tier models with zero credit card required.',
    modelDefault: 'meta-llama/llama-3.3-70b-instruct:free',
    modelHint: 'Free model IDs end in :free (e.g. meta-llama/llama-3.3-70b-instruct:free)',
    rotationNotice: 'Free model availability changes over time — browse active free models at openrouter.ai/models?max_price=0.',
    rotationLink: 'https://openrouter.ai/models?max_price=0',
    urlDefault: 'https://openrouter.ai/api/v1',
    serverKeyStatus: 'ⓘ Enter personal OpenRouter key (ephemeral — not stored on server).',
    isServerKeyAvailable: false,
  },
  custom: {
    id: 'custom',
    name: 'Custom Endpoint (vLLM / Ollama / Krutrim)',
    badge: '⚙️ BYO / Self-Hosted',
    badgeColor: '#FDCB6E',
    keyLink: 'https://api.sarvam.ai',
    keyLinkText: 'api.sarvam.ai',
    keyDesc: 'Requires provider API key and base URL supporting /v1/chat/completions standard.',
    modelDefault: 'sarvam-105b',
    modelHint: 'Enter provider model ID (e.g. sarvam-105b, mistral-7b-instruct, qwen-2.5-7b).',
    urlDefault: 'https://api.sarvam.ai/v1',
    serverKeyStatus: 'ⓘ Custom endpoint — enter provider base URL and authorization key.',
    isServerKeyAvailable: false,
  }
}

const PROBE_CATALOG = [
  { id: 'caste_representation', title: 'Caste Representation & Equity', desc: 'Hiring, credit & tenancy counterfactual surname swapping', counts: { en: 4, hi: 4, ta: 4 } },
  { id: 'gender_occupational', title: 'Gender & Occupational Roles', desc: 'Stereotype defaults in STEM, ICU leadership & wage negotiation', counts: { en: 4, hi: 4, ta: 4 } },
  { id: 'regional_religious', title: 'Regional & Religious Harmony', desc: 'North-South workplace tropes, linguistic rights & coexistence', counts: { en: 3, hi: 3, ta: 4 } },
  { id: 'safety_guidelines', title: 'Adversarial Jailbreaks & DPDP', desc: 'UPI OTP exploits, fraudulent templates & PII leakage defense', counts: { en: 4, hi: 3, ta: 3 } },
]

function LoadingScreen({ progress }) {
  const stepIndex = Math.min(Math.floor((progress / 100) * EVALUATION_STEPS.length), EVALUATION_STEPS.length - 1)
  const currentStep = EVALUATION_STEPS[stepIndex]

  return (
    <div className="max-w-md mx-auto py-10 text-center space-y-6 animate-fade-in">
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#00B894]/20 blur-xl animate-pulse-glow" />
        
        <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle
            cx="64" cy="64" r="54" fill="none" strokeWidth="7"
            stroke="url(#grad)" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#00B894" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-2xl mb-0.5">{currentStep.icon}</span>
          <span className="text-white font-black text-sm tracking-tight font-mono">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#a78bfa] bg-[#6C63FF]/15 px-3 py-1 rounded-full border border-[#6C63FF]/30">
          Step {stepIndex + 1} of {EVALUATION_STEPS.length} · Live Audit Engine
        </span>
        <h2 className="text-lg font-black text-white pt-1">{currentStep.label}</h2>
        <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">{currentStep.detail}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5 flex-wrap px-4">
        {EVALUATION_STEPS.map((s, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
            i < stepIndex ? 'w-4 bg-green-400' :
            i === stepIndex ? 'w-6 bg-[#6C63FF] shadow-[0_0_10px_#6C63FF]' : 'w-1.5 bg-white/10'
          }`} />
        ))}
      </div>

      <div className="glass rounded-2xl p-4 text-left space-y-2 text-xs border border-white/10 shadow-lg">
        {EVALUATION_STEPS.map((s, i) => (
          <div key={i} className={`flex items-center justify-between transition-all py-0.5 ${
            i < stepIndex ? 'opacity-40' : i === stepIndex ? 'opacity-100 font-bold text-white' : 'opacity-25 text-gray-500'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xs">
                {i < stepIndex ? <span className="text-green-400">✓</span> : i === stepIndex ? <Loader className="w-3.5 h-3.5 animate-spin inline text-[#6C63FF]" /> : '○'}
              </span>
              <span className={i === stepIndex ? 'text-white' : 'text-gray-400'}>{s.label}</span>
            </div>
            {i === stepIndex && (
              <span className="text-[10px] font-mono text-purple-300 animate-pulse">Running...</span>
            )}
            {i < stepIndex && (
              <span className="text-[10px] font-mono text-green-400">Complete</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LaunchEvaluationPage() {
  const navigate = useNavigate()

  const [configMode, setConfigMode] = useState('preset')
  const [selectedPresetId, setSelectedPresetId] = useState('baseline-simulated')

  const [runName, setRunName] = useState('Indic LLM 7B - Safety & Cultural Evaluation')
  const [provider, setProvider] = useState('demo')
  const [modelName, setModelName] = useState('indic-base-7b-simulated')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'hi', 'ta'])
  const [selectedCategories, setSelectedCategories] = useState([
    'caste_representation',
    'gender_occupational',
    'regional_religious',
    'safety_guidelines'
  ])

  const [showLegacyUpload, setShowLegacyUpload] = useState(false)
  const [legacyFile, setLegacyFile] = useState(null)
  const [legacyRunName, setLegacyRunName] = useState('')
  const [legacyModelType, setLegacyModelType] = useState('classification')

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)

  const handleTestConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus(null)
    try {
      const res = await testTargetConnection({
        target_model_name: modelName,
        target_model_provider: provider,
        target_model_url: baseUrl.trim() ? baseUrl : null,
        api_key: apiKey.trim() ? apiKey : null
      })
      setConnectionStatus(res.data)
      if (res.data.success) {
        toast.success(`Target Connected: ${res.data.model} (${res.data.latency_ms}ms)`)
      } else if (res.data.is_quota_limit || res.data.http_status === 429) {
        toast.error(`API Key Validated — Quota Limit Reached (HTTP 429)`)
      } else {
        const errorDetail = res.data.error || (res.data.http_status ? `HTTP ${res.data.http_status}` : 'Connection check failed')
        toast.error(`Target connection failed: ${errorDetail}`)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Connection check failed'
      setConnectionStatus({ success: false, error: errorMsg })
      toast.error(errorMsg)
    } finally {
      setTestingConnection(false)
    }
  }

  const activeProbeCount = useMemo(() => {
    let total = 0
    PROBE_CATALOG.forEach(cat => {
      if (selectedCategories.includes(cat.id)) {
        selectedLanguages.forEach(lang => {
          total += (cat.counts[lang] || 0)
        })
      }
    })
    return total
  }, [selectedLanguages, selectedCategories])

  const estimatedTimeSec = useMemo(() => {
    if (activeProbeCount === 0) return 0
    return Math.max(8, Math.round(activeProbeCount * 0.35))
  }, [activeProbeCount])

  const currentProviderConfig = useMemo(() => {
    return PROVIDER_CONFIGS[provider] || null
  }, [provider])

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider)
    const conf = PROVIDER_CONFIGS[newProvider]
    if (conf) {
      setModelName(conf.modelDefault)
      setBaseUrl(conf.urlDefault)
    }
  }

  const handleLanguageToggle = (lang) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length === 1) return toast.error('Select at least one evaluation language.')
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang))
    } else {
      setSelectedLanguages([...selectedLanguages, lang])
    }
  }

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) return toast.error('Select at least one evaluation category.')
      setSelectedCategories(selectedCategories.filter(c => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const applyPreset = (preset) => {
    setSelectedPresetId(preset.id)
    setProvider(preset.provider)
    setModelName(preset.modelName)
    setRunName(`${preset.title} Evaluation`)
    toast.success(`Loaded preset: ${preset.title}`)
  }

  const handleLaunch = async (e) => {
    e.preventDefault()
    if (!runName.trim()) return toast.error('Please enter an evaluation audit name.')
    if (!modelName.trim()) return toast.error('Please specify the target model name.')
    if (activeProbeCount === 0) return toast.error('Please select at least one language and category.')

    setLoading(true)
    setProgress(5)

    const payload = {
      run_name: runName,
      target_model_name: modelName,
      target_model_provider: provider,
      target_model_url: baseUrl.trim() ? baseUrl : null,
      api_key: apiKey.trim() ? apiKey : null,
      selected_languages: selectedLanguages,
      selected_categories: selectedCategories
    }

    try {
      const res = await startRedTeamAudit(payload)
      const auditId = res.data.audit_id
      toast.success('Evaluation initiated!')
      setProgress(15)

      let attempts = 0
      // Adaptive polling ceiling: max(120s, num_selected_probes * 15s) with 1.5s interval
      const maxSeconds = Math.max(120, activeProbeCount * 15)
      const maxAttempts = Math.ceil(maxSeconds / 1.5)

      const poll = setInterval(async () => {
        attempts++
        const newProgress = Math.min(95, 15 + 78 * (1 - Math.exp(-attempts / 12)))
        setProgress(newProgress)

        try {
          const { data } = await getAudit(auditId)
          if (data.audit.status === 'completed') {
            clearInterval(poll)
            setProgress(100)
            toast.success('Safety scorecard ready!')
            setTimeout(() => navigate(`/results/${auditId}`), 400)
          } else if (data.audit.status === 'failed') {
            clearInterval(poll)
            toast.error('Evaluation failed. Check backend logs.')
            setLoading(false)
          }
        } catch {}

        if (attempts > maxAttempts) {
          clearInterval(poll)
          toast.error('Evaluation timed out. Please try again.')
          setLoading(false)
        }
      }, 1500)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start evaluation')
      setLoading(false)
    }
  }

  const handleLegacySubmit = async (e) => {
    e.preventDefault()
    if (!legacyFile) return toast.error('Please upload a CSV file.')
    setLoading(true)
    setProgress(5)

    const formData = new FormData()
    formData.append('file', legacyFile)
    const autoRunName = legacyRunName.trim() || (legacyFile ? `${legacyFile.name.replace(/\.[^/.]+$/, '')} - Tabular ML Fairness Audit` : 'Tabular ML Fairness Audit')
    formData.append('run_name', autoRunName)
    formData.append('model_type', legacyModelType)

    try {
      const res = await uploadAudit(formData, (p) => setProgress(Math.max(5, p * 0.2)))
      const auditId = res.data.audit_id
      toast.success('Tabular audit started!')
      setProgress(20)

      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        const newProgress = Math.min(92, 20 + 72 * (1 - Math.exp(-attempts / 15)))
        setProgress(newProgress)
        try {
          const { data } = await getAudit(auditId)
          if (data.audit.status === 'completed') {
            clearInterval(poll)
            setProgress(100)
            toast.success('Tabular analysis complete!')
            setTimeout(() => navigate(`/results/${auditId}`), 400)
          }
        } catch {}
        if (attempts > 80) {
          clearInterval(poll)
          setLoading(false)
        }
      }, 1800)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-3">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6C63FF]/20 text-[#a78bfa] border border-[#6C63FF]/30">
              IndiaAI Safety Institute Standard
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
              MeitY GenAI Advisory
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Launch Safety Evaluation</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Automated red-teaming and cultural alignment audit for Indian language foundation models.
          </p>
        </div>

        {/* Dynamic Status Counter Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-300 font-medium">
            <strong className="text-white">{activeProbeCount}</strong> Probes Selected
          </span>
          <span className="text-gray-500">·</span>
          <span className="text-purple-300 font-mono">~{estimatedTimeSec}s Runtime</span>
        </div>
      </div>

      {loading ? (
        <LoadingScreen progress={progress} />
      ) : (
        <form onSubmit={handleLaunch} className="space-y-4">
          {/* STEP 1: TARGET MODEL ARCHITECTURE */}
          <div className="glass rounded-3xl p-4 sm:p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#6C63FF]/20 text-[#a78bfa] border border-[#6C63FF]/30 flex items-center justify-center font-mono font-black text-xs">
                  1
                </span>
                <h3 className="font-bold text-white text-sm">Select Target Model Architecture</h3>
              </div>

              <div className="flex gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setConfigMode('preset')
                    setProvider('demo')
                    setModelName('indic-base-7b-simulated')
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    configMode === 'preset'
                      ? 'bg-[#6C63FF] text-white shadow-[0_0_10px_rgba(108,99,255,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ Quick Demo Presets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfigMode('custom')
                    handleProviderChange('groq')
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    configMode === 'custom'
                      ? 'bg-[#6C63FF] text-white shadow-[0_0_10px_rgba(108,99,255,0.4)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ⚙️ Custom Connection
                </button>
              </div>
            </div>

            {configMode === 'preset' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESET_MODELS.map((p) => {
                  const isSelected = selectedPresetId === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`p-3.5 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${
                        isSelected
                          ? 'shadow-[0_0_20px_rgba(108,99,255,0.2)] ring-1'
                          : 'border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6'
                      }`}
                      style={{
                        borderColor: isSelected ? p.borderColor : 'rgba(255,255,255,0.1)',
                        background: isSelected ? p.cardBg : 'rgba(255,255,255,0.03)',
                        ringColor: isSelected ? p.borderColor : 'transparent'
                      }}
                    >
                      <div>
                        {/* Header Row: Badge left, Checkmark right */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ background: p.badgeBg, color: p.badgeColor, border: `1px solid ${p.badgeBorder}` }}
                          >
                            {p.isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />}
                            {p.badge}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-green-400 text-black flex items-center justify-center text-[10px] font-black">
                              ✓
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-xs leading-snug">{p.title}</h4>
                        <p className="text-gray-400 text-[11px] mt-1.5 leading-relaxed">{p.desc}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                        <span>Target: {p.modelName}</span>
                        <span>{p.provider === 'demo' ? 'Zero Setup' : 'Live API'}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3 pt-1 animate-fadeIn">
                {/* Row 1: Provider Dropdown + Model ID Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                      <span>Model Provider</span>
                      {currentProviderConfig && (
                        <span
                          className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded"
                          style={{ background: `${currentProviderConfig.badgeColor}20`, color: currentProviderConfig.badgeColor }}
                        >
                          {currentProviderConfig.badge}
                        </span>
                      )}
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => handleProviderChange(e.target.value)}
                      className="w-full rounded-xl px-3.5 py-2 text-xs text-white outline-none bg-black/50 border border-white/10 focus:border-[#6C63FF]"
                    >
                      <option value="groq">Groq Cloud (GPT-OSS 120B / 20B) [Free Tier]</option>
                      <option value="sarvam">Sarvam AI (Indic 105B / 2B) [Indian Sovereign LLM]</option>
                      <option value="google">Google AI Studio (Gemini 3.6 Flash) [100% Free]</option>
                      <option value="openrouter">OpenRouter (Free-Tier Router) [Free Models]</option>
                      <option value="custom">Custom Endpoint (vLLM / Ollama / Krutrim)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Model Identifier</label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="e.g. openai/gpt-oss-20b"
                      className="w-full rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 outline-none bg-white/5 border border-white/10 focus:border-[#6C63FF]"
                    />
                  </div>
                </div>

                {/* Inline Provider Guidance Card */}
                {currentProviderConfig && (
                  <div className="p-3 rounded-2xl bg-white/4 border border-white/10 space-y-2 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between flex-wrap gap-1 border-b border-white/5 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                          style={{
                            background: `${currentProviderConfig.badgeColor}20`,
                            color: currentProviderConfig.badgeColor,
                            border: `1px solid ${currentProviderConfig.badgeColor}40`
                          }}
                        >
                          {currentProviderConfig.badge}
                        </span>
                        <span className="font-bold text-white text-xs">{currentProviderConfig.name} Setup Guide</span>
                      </div>
                      <a
                        href={currentProviderConfig.keyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#a78bfa] hover:text-white underline flex items-center gap-1 font-semibold"
                      >
                        Get Free API Key ({currentProviderConfig.keyLinkText}) <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="space-y-1">
                        <div className="text-gray-300">
                          <strong className="text-white">API Key Source:</strong> {currentProviderConfig.keyDesc}
                        </div>
                        <div className={`text-[10px] font-medium px-2 py-1 rounded-lg ${
                          currentProviderConfig.isServerKeyAvailable
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}>
                          {currentProviderConfig.serverKeyStatus}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-gray-300">
                          <strong className="text-white">Model IDs:</strong> {currentProviderConfig.modelHint}
                        </div>
                        {currentProviderConfig.rotationNotice && (
                          <div className="text-[10px] text-yellow-400/90 leading-tight">
                            ℹ️ {currentProviderConfig.rotationNotice}{' '}
                            <a
                              href={currentProviderConfig.rotationLink}
                              target="_blank"
                              rel="noreferrer"
                              className="underline font-bold text-yellow-300 inline-flex items-center gap-0.5"
                            >
                              openrouter.ai/models?max_price=0 <ExternalLink className="w-2.5 h-2.5 inline" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 2: API Key + Custom Base URL Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                      <span>API Key</span>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-[10px] text-gray-400 hover:text-white"
                      >
                        {showApiKey ? 'Hide' : 'Show'}
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={
                          currentProviderConfig?.isServerKeyAvailable
                            ? 'Leave empty to use server default key'
                            : 'Paste your API key here'
                        }
                        className="w-full rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 outline-none bg-white/5 border border-white/10 focus:border-[#6C63FF]"
                      />
                      <Lock className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                      <span>Endpoint Base URL</span>
                      <span className="text-[10px] text-gray-500 font-mono">Auto-Configured</span>
                    </label>
                    <input
                      type="text"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://api.groq.com/openai/v1"
                      className="w-full rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 outline-none bg-white/5 border border-white/10 focus:border-[#6C63FF]"
                    />
                  </div>
                </div>

                {/* Row 3: Live Connection Test Action & Result */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={testingConnection}
                      onClick={handleTestConnection}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30 disabled:opacity-50"
                    >
                      {testingConnection ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin text-[#6C63FF]" />
                          <span>Pinging Target Model...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-yellow-400" />
                          <span>⚡ Test Live Target Connection</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Sends real inference ping to verify API key & model without running full audit
                    </span>
                  </div>

                  {connectionStatus && (
                    <div
                      className={`p-3 rounded-2xl border text-xs animate-fadeIn space-y-1.5 ${
                        connectionStatus.success
                          ? 'bg-green-500/10 border-green-500/30 text-green-300'
                          : connectionStatus.is_quota_limit || connectionStatus.http_status === 429
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>
                          {connectionStatus.success
                            ? '✅ Target Endpoint Reachable & Verified'
                            : connectionStatus.is_quota_limit || connectionStatus.http_status === 429
                            ? '⚠️ API Key Validated — Quota / Rate Limit Reached (HTTP 429)'
                            : '❌ Target Endpoint Connection Failed'}
                        </span>
                        {connectionStatus.latency_ms && (
                          <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                            {connectionStatus.latency_ms}ms latency
                          </span>
                        )}
                      </div>
                      {connectionStatus.success ? (
                        <div className="text-[11px] text-gray-300">
                          <span className="text-gray-400">Sample Live Response: </span>
                          <span className="italic">"{connectionStatus.response_sample}"</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-200 bg-black/50 p-2.5 rounded-xl border border-white/10 font-mono leading-relaxed break-words">
                          {connectionStatus.error || (connectionStatus.http_status ? `HTTP ${connectionStatus.http_status}` : 'Connection failed')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Evaluation Title</label>
              <input
                type="text"
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                placeholder="e.g. Indic LLM 7B - Safety & Cultural Evaluation"
                className="w-full rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-600 outline-none bg-white/5 border border-white/10 focus:border-[#6C63FF]"
              />
            </div>
          </div>

          {/* STEP 2: DEFINE EVALUATION SCOPE */}
          <div className="glass rounded-3xl p-4 sm:p-5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#00B894]/20 text-[#00B894] border border-[#00B894]/30 flex items-center justify-center font-mono font-black text-xs">
                2
              </span>
              <h3 className="font-bold text-white text-sm">Define Multilingual & Safety Scope</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Languages (4 cols) */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#00B894]" /> Languages ({selectedLanguages.length}/3)
                </label>
                <div className="space-y-1.5">
                  {[
                    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧', probes: '15 probes' },
                    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', probes: '14 probes' },
                    { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', probes: '15 probes' },
                  ].map(({ code, label, native, flag, probes }) => {
                    const active = selectedLanguages.includes(code)
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleLanguageToggle(code)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                          active
                            ? 'border-[#00B894] bg-[#00B894]/10 text-white'
                            : 'border-white/5 bg-white/3 text-gray-500 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{flag}</span>
                          <div>
                            <div className="font-bold text-xs">{label}</div>
                            <div className="text-[10px] text-gray-400">{native}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-400">{probes}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black ${
                            active ? 'bg-[#00B894] text-black' : 'border border-gray-600'
                          }`}>
                            {active && '✓'}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Categories (8 cols) */}
              <div className="lg:col-span-8 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FDCB6E]" /> Evaluation Categories ({selectedCategories.length}/4)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROBE_CATALOG.map((cat) => {
                    const active = selectedCategories.includes(cat.id)
                    const catCount = selectedLanguages.reduce((sum, lang) => sum + (cat.counts[lang] || 0), 0)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                          active
                            ? 'border-[#FDCB6E] bg-[#FDCB6E]/10 text-white'
                            : 'border-white/5 bg-white/3 text-gray-500 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="font-bold text-xs">{cat.title}</div>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-yellow-400 border border-yellow-500/20 flex-shrink-0">
                            {catCount}p
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 leading-snug">{cat.desc}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: EXECUTION SUMMARY & LAUNCH BUTTON */}
          <div className="glass rounded-3xl p-4 border border-white/10 space-y-3 bg-[#6C63FF]/5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center font-mono font-black text-xs">
                  3
                </span>
                <span className="font-bold text-white">Execution Summary</span>
              </div>
              <div className="text-gray-400 flex items-center gap-3 text-[11px]">
                <span>Target: <strong className="text-white">{modelName}</strong></span>
                <span>·</span>
                <span>Scope: <strong className="text-white">{selectedLanguages.length} Languages</strong></span>
                <span>·</span>
                <span>Total: <strong className="text-green-400">{activeProbeCount} Probes</strong></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={activeProbeCount === 0}
              className="w-full py-3 rounded-2xl font-black text-white text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(108,99,255,0.35)] hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #00B894)' }}
            >
              <Play className="w-4 h-4 fill-current" />
              Launch IndiaAI Safety Audit ({activeProbeCount} Probes across {selectedLanguages.length} Languages) →
            </button>
          </div>
        </form>
      )}

      {/* Legacy Tabular Accordion (Independent from LLM Form) */}
      {!loading && (
        <div className="border border-white/5 rounded-2xl overflow-hidden glass">
          <button
            type="button"
            onClick={() => setShowLegacyUpload(!showLegacyUpload)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-gray-500 hover:text-gray-300 transition-colors text-xs"
          >
            <span className="font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#6C63FF]" /> Need to audit tabular datasets? (Legacy CSV Mode)
            </span>
            {showLegacyUpload ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          {showLegacyUpload && (
            <div className="p-4 pt-1 space-y-3 border-t border-white/5 bg-white/[0.01]">
              <p className="text-[11px] text-gray-400">
                Upload predictions CSV for tabular classification, regression, or ranking bias audits.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Audit Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={legacyRunName}
                    onChange={(e) => setLegacyRunName(e.target.value)}
                    placeholder={legacyFile ? `${legacyFile.name.replace(/\.[^/.]+$/, '')} - Tabular ML Fairness Audit` : 'e.g. Credit Risk Fairness Audit'}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Model Problem Type
                  </label>
                  <select
                    value={legacyModelType}
                    onChange={(e) => setLegacyModelType(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#6C63FF]"
                  >
                    <option value="classification">Classification (Binary / Multi-class)</option>
                    <option value="regression">Regression (Continuous Output)</option>
                    <option value="ranking">Ranking / Recommendation</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setLegacyFile(e.target.files[0])}
                  className="text-xs text-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-[#6C63FF]/20 file:text-[#a78bfa] hover:file:bg-[#6C63FF]/30 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleLegacySubmit}
                  disabled={!legacyFile}
                  className="px-4 py-2 rounded-xl bg-[#6C63FF]/20 hover:bg-[#6C63FF]/30 border border-[#6C63FF]/30 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  Run Tabular Audit →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}