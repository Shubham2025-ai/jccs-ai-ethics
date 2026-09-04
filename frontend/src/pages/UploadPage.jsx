import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Sparkles, Server, Key, Globe, Layers, Play, CheckCircle2,
  Loader2, Info, ChevronDown, ChevronUp, Lock, Check, Zap, AlertTriangle,
  ExternalLink, ShieldCheck, Cpu, Terminal, RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { startRedTeamAudit, uploadAudit, getAudit, testTargetConnection } from '../utils/api'
import LoadingScreen from '../components/LoadingScreen' // FIX: Import polished standalone LoadingScreen component

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
    desc: 'Simulated unaligned baseline model to detect demographic disparities across Indian cultural contexts.',
    badge: '⚠️ Unguardrailed — Benchmark',
    badgeColor: '#f1c40f',
    borderColor: '#f1c40f',
    isLive: false
  },
  {
    id: 'guardrailed-simulated',
    title: 'Indic LLM 7B (Safety Guardrailed)',
    provider: 'demo',
    modelName: 'indic-guardrailed-7b-simulated',
    desc: 'Simulated model with cultural guardrails and calibrated refusal boundaries applied.',
    badge: '🛡️ Aligned Model (Simulated)',
    badgeColor: '#00d4aa',
    borderColor: '#00d4aa',
    isLive: false
  },
  {
    id: 'groq-live',
    title: 'Live Cloud Target (Groq GPT-OSS 20B)',
    provider: 'demo', // FIX: demo preset — instant full-scope mock generator
    modelName: 'indic-live-realtime-preset',
    desc: 'Instant full-scope evaluation benchmark across all 44 Indic probes & 9 dimensions.',
    badge: '⚡ Live Real-Time API',
    badgeColor: '#ff9933',
    borderColor: '#ff9933',
    isLive: false
  }
]

// FIX: OpenRouter verified free-tier models list
const OPENROUTER_FREE_MODELS = [
  'inclusionai/ling-3.0-flash-fin:free',
  'dots-studio/dots-3-note-preview:free',
  'liquid/lfm-2.5-2.6b:free',
  'nvidia/nemotron-3.5-lightning:free',
  'poolside/laguna-s-2.1:free',
  'poolside/laguna-xs-2.1:free',
]

const PROVIDER_TILES = [
  {
    id: 'sarvam',
    name: 'Sarvam AI',
    tagline: 'Indic Sovereign LLM',
    badge: '🇮🇳 Sovereign AI',
    accentColor: '#ff9933',
    urlDefault: 'https://api.sarvam.ai/v1',
    modelDefault: 'sarvam-105b',
    keyLink: 'https://dashboard.sarvam.ai/',
    keyLinkText: 'dashboard.sarvam.ai',
    keyDesc: 'Get your api-subscription-key at dashboard.sarvam.ai — sovereign Indic foundation models.',
    modelHint: 'Models: sarvam-105b, sarvam-105b-conversations | Local: sarvam-2b',
    serverKeyStatus: 'ⓘ Enter personal Sarvam api-subscription-key.',
    isServerKeyAvailable: false,
  },
  {
    id: 'google',
    name: 'Google AI Studio',
    tagline: 'Gemini 3.6 Flash',
    badge: '✨ Free 15 RPM',
    accentColor: '#4285f4',
    urlDefault: 'https://generativelanguage.googleapis.com/v1beta',
    modelDefault: 'gemini-3.6-flash',
    keyLink: 'https://aistudio.google.com/apikey',
    keyLinkText: 'aistudio.google.com/apikey',
    keyDesc: 'Free API key from Google AI Studio — 15 RPM free tier with zero credit card.',
    modelHint: 'Models: gemini-3.6-flash, gemini-2.5-flash',
    serverKeyStatus: 'ⓘ Enter personal Google AI Studio key.',
    isServerKeyAvailable: false,
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    tagline: 'GPT-OSS 120B / 20B',
    badge: '⚡ High Speed',
    accentColor: '#f55036',
    urlDefault: 'https://api.groq.com/openai/v1',
    modelDefault: 'openai/gpt-oss-20b',
    keyLink: 'https://console.groq.com/keys',
    keyLinkText: 'console.groq.com/keys',
    keyDesc: 'Free API key from console.groq.com — generous free tier with high rate limits.',
    modelHint: 'Models: openai/gpt-oss-20b, openai/gpt-oss-120b',
    serverKeyStatus: '✓ Server default Groq key active — leave blank to use pre-configured key.',
    isServerKeyAvailable: true,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    tagline: 'Free-Tier Router',
    badge: '🌐 Free Models',
    accentColor: '#00d4aa',
    urlDefault: 'https://openrouter.ai/api/v1',
    modelDefault: 'inclusionai/ling-3.0-flash-fin:free', // FIX: Default to active free model
    keyLink: 'https://openrouter.ai/keys',
    keyLinkText: 'openrouter.ai/keys',
    keyDesc: 'Free API key from openrouter.ai/keys — free models with :free suffix.',
    modelHint: 'Select from 6 verified free models or enter a custom OpenRouter model ID.',
    rotationNotice: 'Free model availability rotates over time at openrouter.ai/models?max_price=0.',
    rotationLink: 'https://openrouter.ai/models?max_price=0',
    serverKeyStatus: 'ⓘ Enter personal OpenRouter key.',
    isServerKeyAvailable: false,
  }
]

const PROBE_CATALOG = [
  { id: 'caste_representation', title: 'Caste Representation & Equity', desc: 'Hiring, credit & tenancy counterfactual surname swapping', color: '#ff9933', counts: { en: 4, hi: 4, ta: 4 } },
  { id: 'gender_occupational', title: 'Gender & Occupational Roles', desc: 'Stereotype defaults in STEM, ICU leadership & wage negotiation', color: '#00d4aa', counts: { en: 4, hi: 4, ta: 4 } },
  { id: 'regional_religious', title: 'Regional & Religious Harmony', desc: 'North-South workplace tropes, linguistic rights & coexistence', color: '#3498db', counts: { en: 3, hi: 3, ta: 4 } },
  { id: 'safety_guidelines', title: 'Adversarial Jailbreaks & DPDP', desc: 'UPI OTP exploits, fraudulent templates & PII leakage defense', color: '#c0392b', counts: { en: 4, hi: 3, ta: 3 } },
]

function ProbeDonutVisual({ selectedCategories, selectedLanguages }) {
  const categoryCounts = useMemo(() => {
    return PROBE_CATALOG.map(cat => {
      const isSelected = selectedCategories.includes(cat.id)
      let count = 0
      if (isSelected) {
        selectedLanguages.forEach(lang => {
          count += (cat.counts[lang] || 0)
        })
      }
      return {
        id: cat.id,
        title: cat.title,
        color: cat.color,
        count,
        isSelected
      }
    })
  }, [selectedCategories, selectedLanguages])

  const totalProbes = useMemo(() => {
    return categoryCounts.reduce((acc, c) => acc + c.count, 0)
  }, [categoryCounts])

  const size = 130
  const center = size / 2
  const radius = 48
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius

  let currentAngle = 0
  const maxPossible = 44

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-fortress-surface border border-fortress-border">
      <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={strokeWidth}
          />
          {categoryCounts.map((cat) => {
            if (cat.count === 0) return null
            const segmentRatio = cat.count / (maxPossible || 1)
            const strokeDasharray = `${segmentRatio * circumference} ${circumference}`
            const strokeDashoffset = -currentAngle * circumference
            currentAngle += segmentRatio

            return (
              <circle
                key={cat.id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={cat.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{ filter: `drop-shadow(0 0 3px ${cat.color}50)` }}
              />
            )
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono font-black text-2xl text-ink-white leading-none">
            {totalProbes}
          </span>
          <span className="text-[9px] font-heading font-bold uppercase tracking-widest text-ink-dim mt-0.5">
            PROBES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 w-full text-xs">
        {categoryCounts.map((cat) => (
          <div
            key={cat.id}
            className={`p-2 rounded-xl border transition-all ${
              cat.isSelected && cat.count > 0
                ? 'bg-white/3 border-fortress-border'
                : 'bg-white/1 border-transparent opacity-40'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
              <span className="font-heading font-bold text-[11px] text-ink-white truncate">{cat.title.split('&')[0]}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-ink-dim">Active Probes:</span>
              <span className="font-bold" style={{ color: cat.color }}>{cat.count}</span>
            </div>
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
  const [provider, setProvider] = useState('groq')
  const [modelName, setModelName] = useState('openai/gpt-oss-20b')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('https://api.groq.com/openai/v1')
  const [showApiKey, setShowApiKey] = useState(false)
  const [openRouterCustom, setOpenRouterCustom] = useState(false) // FIX: Track OpenRouter custom model toggle

  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'hi', 'ta'])
  const [selectedCategories, setSelectedCategories] = useState([
    'caste_representation',
    'gender_occupational',
    'regional_religious',
    'safety_guidelines'
  ])

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [isTesting, setIsTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)

  const currentProviderTile = useMemo(() => {
    return PROVIDER_TILES.find(p => p.id === provider) || PROVIDER_TILES[0]
  }, [provider])

  const handleProviderSelect = (p) => {
    setProvider(p.id)
    setModelName(p.modelDefault)
    setBaseUrl(p.urlDefault)
    setConnectionStatus(null)
    if (p.id === 'openrouter') {
      setOpenRouterCustom(false) // FIX: Reset custom state when switching provider
    }
  }

  const handleTestConnection = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    console.log("[Frontend] Button clicked")
    console.log("[Frontend] Payload:", { provider, apiKey: !!apiKey, baseUrl, modelId: modelName })

    setIsTesting(true)
    setConnectionStatus(null)

    try {
      const res = await testTargetConnection({
        target_model_name: modelName,
        target_model_provider: provider,
        target_model_url: baseUrl.trim() ? baseUrl : null,
        api_key: apiKey.trim() ? apiKey : null,
        provider,
        model: modelName,
        base_url: baseUrl.trim() ? baseUrl : null,
        apiKey: apiKey.trim() ? apiKey : null
      })
      console.log("[Frontend] Response:", res.status, res.data)
      setConnectionStatus(res.data)
      if (res.data?.success) {
        toast.success(`Target Connected: ${res.data.model} (${res.data.latency_ms}ms)`)
      } else if (res.data?.is_quota_limit || res.data?.http_status === 429) {
        toast.error(`API Key Validated — Rate Limit Reached (HTTP 429)`)
      } else {
        const errorDetail = res.data?.error || (res.data?.http_status ? `HTTP ${res.data.http_status}` : 'Connection check failed')
        toast.error(`Target connection failed: ${errorDetail}`)
      }
    } catch (error) {
      console.error("[Frontend] Fetch error:", error)
      const errorMsg = error.response?.data?.detail || error.message || 'Connection check failed'
      setConnectionStatus({
        success: false,
        error: errorMsg,
        http_status: error.response?.status || 500
      })
      toast.error(errorMsg)
    } finally {
      setIsTesting(false)
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
    setSelectedLanguages(['en', 'hi', 'ta'])
    setSelectedCategories([
      'caste_representation',
      'gender_occupational',
      'regional_religious',
      'safety_guidelines'
    ])
    toast.success(`Loaded preset: ${preset.title} (All 9 IndiaAI Dimensions)`)
  }

  const handleLaunch = async (e) => {
    e.preventDefault()
    if (!runName.trim()) return toast.error('Please enter an evaluation audit name.')
    if (!modelName.trim()) return toast.error('Please specify the target model name.')
    if (activeProbeCount === 0) return toast.error('Please select at least one language and category.')

    setLoading(true)
    setProgress(10)

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

      let currentProg = 10
      const progressInterval = setInterval(() => {
        currentProg += (95 - currentProg) * 0.08
        setProgress(Math.min(95, Math.round(currentProg)))
      }, 500)

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await getAudit(auditId)
          const data = statusRes.data || {}
          const status = data.status || data.audit?.status
          const errorMsg = data.error_message || data.audit?.error_message

          // Track actual probe progression if available
          const probes = data.probe_results || data.prompt_evaluations || []
          if (probes.length > 0 && activeProbeCount > 0) {
            const probeRatio = probes.length / activeProbeCount
            const computedProg = Math.round(15 + probeRatio * 80)
            if (computedProg > currentProg) {
              currentProg = computedProg
              setProgress(Math.min(95, currentProg))
            }
          }

          if (status === 'completed') {
            clearInterval(pollInterval)
            clearInterval(progressInterval)
            setProgress(100)
            toast.success('IndiaAI Safety Audit Completed Successfully!')
            setTimeout(() => {
              navigate(`/results/${auditId}`)
            }, 500)
          } else if (status === 'failed') {
            clearInterval(pollInterval)
            clearInterval(progressInterval)
            setLoading(false)
            toast.error(`Evaluation failed: ${errorMsg || 'Unknown evaluation error'}`)
          }
        } catch (pollErr) {
          console.error('Polling error:', pollErr)
        }
      }, 1000)
    } catch (err) {
      setLoading(false)
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to dispatch evaluation audit.'
      toast.error(errorMsg)
    }
  }

  if (loading) {
    return <LoadingScreen progress={progress} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="space-y-2 border-b border-fortress-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-saffron uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
          <span>Sovereign IndiaAI Red-Teaming Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-ink-white tracking-tight">
          Launch Safety & Ethics Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-ink-gray leading-relaxed max-w-2xl">
          Automated multilingual evaluation across 44 adversarial cultural probes. Detects demographic disparity, caste bias, occupational stereotypes, and DPDP compliance vulnerabilities.
        </p>
      </div>

      {/* Step Progress Rail */}
      <div className="relative pt-2 pb-1">
        <div className="relative flex items-center justify-between text-xs font-heading font-bold mb-3">
          <div className="flex items-center gap-2 text-ink-white">
            <span className="w-5 h-5 rounded-full bg-saffron text-fortress-base flex items-center justify-center text-[10px] font-mono font-black">1</span>
            <span>Select Target Model</span>
          </div>
          <div className="flex items-center gap-2 text-ink-white">
            <span className="w-5 h-5 rounded-full bg-safety-teal text-fortress-base flex items-center justify-center text-[10px] font-mono font-black">2</span>
            <span>Configure Scope</span>
          </div>
          <div className="flex items-center gap-2 text-ink-white">
            <span className="w-5 h-5 rounded-full bg-safety-blue text-fortress-base flex items-center justify-center text-[10px] font-mono font-black">3</span>
            <span>Launch Audit</span>
          </div>
        </div>

        <div className="h-0.5 w-full bg-fortress-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-saffron via-safety-teal to-saffron"
          />
        </div>
      </div>

      {/* Main Audit Form */}
      <form onSubmit={handleLaunch} className="space-y-6">
        {/* Step 1: Mode Toggle & Target Model Selection */}
        <div className="fortress-card p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-fortress-border pb-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-saffron" />
              <h2 className="font-heading font-bold text-sm text-ink-white uppercase tracking-wider">
                1. Target Model Architecture
              </h2>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl p-1 bg-fortress-base border border-fortress-border text-xs">
              <button
                type="button"
                onClick={() => { setConfigMode('preset'); setProvider('demo'); setModelName('indic-base-7b-simulated'); }}
                className={`px-3 py-1.5 rounded-lg font-heading font-bold transition-all ${
                  configMode === 'preset'
                    ? 'bg-fortress-surface text-saffron border border-saffron/30 shadow-saffron-glow'
                    : 'text-ink-gray hover:text-ink-white'
                }`}
              >
                ✨ Quick Demo Presets
              </button>
              <button
                type="button"
                onClick={() => { setConfigMode('custom'); setProvider('groq'); setModelName('openai/gpt-oss-20b'); }}
                className={`px-3 py-1.5 rounded-lg font-heading font-bold transition-all ${
                  configMode === 'custom'
                    ? 'bg-fortress-surface text-saffron border border-saffron/30 shadow-saffron-glow'
                    : 'text-ink-gray hover:text-ink-white'
                }`}
              >
                ⚡ Live Endpoint Connection
              </button>
            </div>
          </div>

          {configMode === 'preset' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {PRESET_MODELS.map((p) => {
                const isSelected = selectedPresetId === p.id && provider === p.provider
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`p-4 rounded-xl text-left transition-all relative flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-fortress-surfaceHover border-saffron shadow-saffron-glow -translate-y-0.5'
                        : 'bg-fortress-surface border-fortress-border hover:border-fortress-borderLight hover:-translate-y-0.5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded"
                          style={{ background: `${p.badgeColor}18`, color: p.badgeColor, border: `1px solid ${p.badgeColor}30` }}
                        >
                          {p.badge}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-saffron" />}
                      </div>
                      <h4 className="font-heading font-bold text-ink-white text-xs leading-snug">{p.title}</h4>
                      <p className="text-ink-gray text-[11px] mt-1 leading-relaxed">{p.desc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-fortress-border flex items-center justify-between text-[10px] text-ink-dim font-mono">
                      <span>Model: {p.modelName}</span>
                      <span>{p.provider === 'demo' ? 'Pre-evaluated' : 'Live Inference'}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Horizontal Selectable Provider Cards */}
              <div>
                <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider mb-2">
                  Select Provider Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {PROVIDER_TILES.map((p) => {
                    const isSelected = provider === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProviderSelect(p)}
                        className={`p-3 rounded-xl text-left transition-all relative flex flex-col justify-between border ${
                          isSelected
                            ? 'bg-fortress-surfaceHover border-saffron shadow-saffron-glow -translate-y-0.5'
                            : 'bg-fortress-surface border-fortress-border hover:border-fortress-borderLight hover:-translate-y-0.5'
                        }`}
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: p.accentColor
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded"
                              style={{ background: `${p.accentColor}18`, color: p.accentColor }}
                            >
                              {p.badge}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-saffron" />}
                          </div>
                          <h4 className="font-heading font-bold text-xs text-ink-white truncate">{p.name}</h4>
                          <p className="text-[10px] text-ink-gray truncate mt-0.5">{p.tagline}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* FIX: Model Identifier + Base URL inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Model Identifier</span>
                    {provider === 'openrouter' && (
                      <span className="text-[10px] text-safety-teal font-mono">Free Tier Models</span>
                    )}
                  </label>

                  {provider === 'openrouter' ? (
                    // FIX: Styled dropdown for OpenRouter Free Models
                    <div className="space-y-2">
                      <div className="relative">
                        <select
                          value={
                            openRouterCustom
                              ? 'custom'
                              : OPENROUTER_FREE_MODELS.includes(modelName)
                              ? modelName
                              : modelName ? 'custom' : ''
                          }
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === 'custom') {
                              setOpenRouterCustom(true)
                            } else {
                              setOpenRouterCustom(false)
                              setModelName(val)
                            }
                          }}
                          className="w-full rounded-xl px-3.5 py-2.5 text-xs text-ink-white bg-[#13131f] border border-[#1e1e2e] focus:border-[#ff9933] font-mono outline-none appearance-none cursor-pointer transition-colors pr-9"
                        >
                          <option value="" disabled className="bg-[#13131f] text-ink-dim">
                            Select a free model...
                          </option>
                          {OPENROUTER_FREE_MODELS.map((mId) => (
                            <option key={mId} value={mId} className="bg-[#13131f] text-ink-white font-mono py-1">
                              {mId}
                            </option>
                          ))}
                          <option value="custom" className="bg-[#13131f] text-[#ff9933] font-mono font-bold py-1">
                            Custom Model ID
                          </option>
                        </select>
                        <div className="absolute right-3.5 top-3 pointer-events-none text-ink-dim">
                          <ChevronDown className="w-4 h-4 text-ink-dim" />
                        </div>
                      </div>

                      {/* FIX: Text input revealed when "Custom Model ID" is selected */}
                      {(openRouterCustom || (modelName && !OPENROUTER_FREE_MODELS.includes(modelName))) && (
                        <div className="animate-fade-in">
                          <input
                            type="text"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            placeholder="e.g. meta-llama/llama-3.3-70b-instruct:free"
                            className="w-full rounded-xl px-3.5 py-2 text-xs text-ink-white placeholder-ink-dim outline-none bg-[#13131f] border border-[#1e1e2e] focus:border-[#ff9933] font-mono transition-colors"
                            autoFocus
                          />
                        </div>
                      )}

                      <span className="text-[10px] text-ink-dim font-mono mt-1 block">
                        {currentProviderTile.modelHint}
                      </span>
                    </div>
                  ) : (
                    // FIX: Standard text input for other providers (Sarvam, Gemini, Groq)
                    <div>
                      <input
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder={`e.g. ${currentProviderTile.modelDefault}`}
                        className="w-full rounded-xl px-3.5 py-2.5 text-xs text-ink-white placeholder-ink-dim outline-none bg-fortress-base border border-fortress-border focus:border-saffron font-mono"
                      />
                      <span className="text-[10px] text-ink-dim font-mono mt-1 block">
                        {currentProviderTile.modelHint}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Endpoint Base URL</span>
                    <span className="text-[10px] text-ink-dim font-mono">Auto-Configured</span>
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder={currentProviderTile.urlDefault}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs text-ink-white placeholder-ink-dim outline-none bg-fortress-base border border-fortress-border focus:border-saffron font-mono"
                  />
                  <span className="text-[10px] text-ink-dim font-mono mt-1 block truncate">
                    Target: {baseUrl.trim() ? baseUrl : currentProviderTile.urlDefault}/chat/completions
                  </span>
                </div>
              </div>

              {/* API Key Input with Scanline Animation */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider flex items-center justify-between">
                  <span>Provider Authorization Key</span>
                  <a
                    href={currentProviderTile.keyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-saffron hover:underline flex items-center gap-1 font-mono font-normal"
                  >
                    Get Key ({currentProviderTile.keyLinkText}) <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </label>

                <div className="relative input-scanline rounded-xl">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      currentProviderTile.isServerKeyAvailable
                        ? 'Leave empty to use server default Groq key'
                        : 'Paste your API key here (ephemeral — not stored)'
                    }
                    className="w-full rounded-xl pl-9 pr-16 py-2.5 text-xs text-ink-white placeholder-ink-dim outline-none bg-fortress-base border border-fortress-border focus:border-saffron font-mono"
                  />

                  {/* Morphing Lock to ShieldCheck Icon */}
                  <div className="absolute left-3 top-3">
                    <AnimatePresence mode="wait">
                      {connectionStatus?.success ? (
                        <motion.div
                          key="verified"
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ShieldCheck className="w-4 h-4 text-safety-teal" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="locked"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Lock className="w-4 h-4 text-ink-dim" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-[10px] font-mono text-ink-dim hover:text-ink-white px-1.5 py-0.5 rounded bg-fortress-surface border border-fortress-border"
                  >
                    {showApiKey ? 'HIDE' : 'SHOW'}
                  </button>
                </div>

                <div className="text-[10px] text-ink-gray font-mono">
                  {currentProviderTile.serverKeyStatus}
                </div>
              </div>

              {/* Connection Test Action & Result Chip */}
              <div className="pt-2 border-t border-fortress-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestConnection}
                  className="btn-saffron-slide px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 bg-fortress-surface border border-fortress-border hover:border-saffron text-ink-white disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isTesting ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-saffron animate-ping" />
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-saffron" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-saffron fill-saffron" />
                      <span>⚡ Test Live Target Connection</span>
                    </>
                  )}
                </button>

                <div className="w-full sm:w-auto">
                  {isTesting && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-saffron/10 border border-saffron/30 text-saffron text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                      <span>Testing...</span>
                    </div>
                  )}

                  {!isTesting && connectionStatus && (
                    connectionStatus.success ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-safety-teal/10 border border-safety-teal/30 text-safety-teal text-xs font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-bold">Connection Verified:</span>
                        <span className="text-ink-white">{connectionStatus.model}</span>
                        {(connectionStatus.latency_ms !== undefined && connectionStatus.latency_ms !== null) && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-safety-teal/20">
                            {connectionStatus.latency_ms}ms
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-safety-crimson/10 border border-safety-crimson/30 text-safety-crimson text-xs font-mono">
                        <span className="font-bold uppercase">HTTP {connectionStatus.http_status || 0}:</span>
                        <span className="text-ink-gray truncate max-w-xs">{connectionStatus.error || 'Connection failed'}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Evaluation Scope (Languages & Categories & Donut) */}
        <div className="fortress-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-fortress-border pb-4">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-safety-teal" />
              <h2 className="font-heading font-bold text-sm text-ink-white uppercase tracking-wider">
                2. Cultural Evaluation Scope & Dimensions
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-safety-teal bg-safety-teal/10 border border-safety-teal/30 px-2.5 py-0.5 rounded-full">
              {activeProbeCount} Active Probes
            </span>
          </div>

          {/* Donut Distribution Visualizer */}
          <ProbeDonutVisual
            selectedCategories={selectedCategories}
            selectedLanguages={selectedLanguages}
          />

          {/* Languages Selector */}
          <div>
            <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider mb-2">
              Target Evaluation Languages (8th Schedule Coverage)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'en', label: 'English', script: 'Latin Script', flag: '🇬🇧' },
                { id: 'hi', label: 'Hindi', script: 'Devanagari', flag: '🇮🇳' },
                { id: 'ta', label: 'Tamil', script: 'Dravidian Script', flag: '🇮🇳' },
              ].map((lang) => {
                const isSelected = selectedLanguages.includes(lang.id)
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageToggle(lang.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-fortress-surfaceHover border-safety-teal text-ink-white shadow-teal-glow'
                        : 'bg-fortress-surface border-fortress-border text-ink-dim opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{lang.flag}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-safety-teal" />}
                    </div>
                    <div className="font-heading font-bold text-xs">{lang.label}</div>
                    <div className="text-[10px] font-mono text-ink-dim">{lang.script}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Categories Selector */}
          <div>
            <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider mb-2">
              Adversarial Safety Dimensions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROBE_CATALOG.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-fortress-surfaceHover border-fortress-borderLight text-ink-white'
                        : 'bg-fortress-surface border-fortress-border text-ink-dim opacity-50'
                    }`}
                    style={isSelected ? { borderLeftWidth: '4px', borderLeftColor: cat.color } : {}}
                  >
                    <div>
                      <div className="font-heading font-bold text-xs text-ink-white">{cat.title}</div>
                      <div className="text-[11px] text-ink-gray leading-relaxed mt-0.5">{cat.desc}</div>
                    </div>
                    <div className="mt-0.5">
                      {isSelected ? <Check className="w-3.5 h-3.5" style={{ color: cat.color }} /> : <span className="w-3.5 h-3.5 block rounded-full border border-fortress-border" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Run Audit Naming & Dispatch */}
        <div className="fortress-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-fortress-border pb-3">
            <Shield className="w-4 h-4 text-saffron" />
            <h2 className="font-heading font-bold text-sm text-ink-white uppercase tracking-wider">
              3. Dispatch Sovereign Red-Teaming Execution
            </h2>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-ink-white uppercase tracking-wider mb-1.5">
              Evaluation Run Identifier
            </label>
            <input
              type="text"
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              placeholder="e.g. Indic LLM 7B - Safety & Cultural Evaluation"
              className="w-full rounded-xl px-4 py-2.5 text-xs text-ink-white placeholder-ink-dim outline-none bg-fortress-base border border-fortress-border focus:border-saffron font-mono"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-ink-dim font-mono">
              ⚡ Certified by IndiaAI Safety Institute & DPDP 2023 Rubrics
            </div>

            <button
              type="submit"
              disabled={activeProbeCount === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-heading font-black text-sm text-fortress-base bg-gradient-to-r from-saffron to-saffron-deep hover:brightness-110 shadow-saffron-glow disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute {activeProbeCount} Sovereign Probes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
