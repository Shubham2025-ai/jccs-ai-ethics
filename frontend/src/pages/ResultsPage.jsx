import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAudit } from '../utils/api'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts'
import { CheckCircle, XCircle, AlertTriangle, Shield, ChevronLeft, Loader,
         Download, Copy, Check } from 'lucide-react'

const RISK_COLORS = { low: '#00B894', medium: '#FDCB6E', high: '#E17055', critical: '#E94560' }
const SCORE_COLOR = (s) => s >= 80 ? '#00B894' : s >= 60 ? '#FDCB6E' : s >= 40 ? '#E17055' : '#E94560'
const STANDARDS = { EU_AI_ACT: 'EU AI Act 2026', DPDP: 'India DPDP Act', ISO_42001: 'ISO/IEC 42001' }

function ScoreRing({ score, riskLevel }) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(t)
  }, [score])

  const r = 74, c = 2 * Math.PI * r
  const offset = c - (animated / 100) * c
  const color = SCORE_COLOR(score)
  const riskLabel = { critical: 'CRITICAL RISK', high: 'HIGH RISK', medium: 'MEDIUM RISK', low: 'LOW RISK' }
  const riskIcon  = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer glow ring */}
      <div className="relative" style={{ filter: `drop-shadow(0 0 18px ${color}55)` }}>
        <svg width="200" height="200">
          {/* Track */}
          <circle cx="100" cy="100" r={r} fill="none" stroke="#ffffff08" strokeWidth="14" />
          {/* Tick marks */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * 2 * Math.PI - Math.PI / 2
            const x1 = 100 + (r - 8) * Math.cos(angle)
            const y1 = 100 + (r - 8) * Math.sin(angle)
            const x2 = 100 + (r + 2) * Math.cos(angle)
            const y2 = 100 + (r + 2) * Math.sin(angle)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff15" strokeWidth="1.5" />
          })}
          {/* Progress arc */}
          <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="14"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
          {/* Score number */}
          <text x="100" y="90" textAnchor="middle" fill="white" fontSize="38" fontWeight="900"
            style={{ fontFamily: 'inherit' }}>{score}</text>
          <text x="100" y="112" textAnchor="middle" fill="#6b7280" fontSize="13">/100</text>
          <text x="100" y="130" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
            ETHICS SCORE
          </text>
        </svg>
      </div>
      {/* Risk badge below ring */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase"
        style={{ background: color + '18', border: `1px solid ${color}44`, color }}>
        <span>{riskIcon[riskLevel] || '🔴'}</span>
        {riskLabel[riskLevel] || 'CRITICAL RISK'}
      </div>
    </div>
  )
}

function FairnessCard({ r }) {
  return (
    <div className={`glass rounded-xl p-4 border ${r.passed ? 'border-green-500/20' : 'border-red-500/20'}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white text-sm">{r.dimension_label}</h4>
        {r.passed ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold" style={{ color: SCORE_COLOR(r.score) }}>{r.score}</span>
        <span className="text-gray-500 text-sm mb-1">/100</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${r.score}%`, background: SCORE_COLOR(r.score) }} />
      </div>
      {r.metric_value !== null && r.metric_value !== undefined && (
        <p className="text-xs text-gray-500 mt-2">
          Disparity: <span className="text-gray-300">{(r.metric_value * 100).toFixed(1)}%</span>
          {' '}· Threshold: {(r.threshold * 100).toFixed(0)}%
        </p>
      )}
      {r.sensitive_attribute && (
        <p className="text-xs text-gray-500 mt-1">Sensitive: <span className="text-purple-400">{r.sensitive_attribute}</span></p>
      )}
    </div>
  )
}

function generatePDF(data, id) {
  const { audit, fairness_results, shap_results, explanations, remediations, compliance_checks } = data
  const score = Math.round(audit.overall_score || 0)
  const riskColor = RISK_COLORS[audit.risk_level] || '#E94560'
  const scoreColor = SCORE_COLOR(score)
  const passed = fairness_results?.filter(r => r.passed).length || 0
  const failed = fairness_results?.filter(r => !r.passed).length || 0
  const stdNames = { EU_AI_ACT: 'EU AI Act 2026', DPDP: 'India DPDP Act', ISO_42001: 'ISO/IEC 42001' }
  const compByStd = {}
  compliance_checks?.forEach(c => {
    if (!compByStd[c.standard]) compByStd[c.standard] = []
    compByStd[c.standard].push(c)
  })

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>JCCS Report — ${audit.run_name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;color:#1a1a2e;font-size:13px}
.page{max-width:900px;margin:0 auto;padding:28px 36px}
.header{display:flex;justify-content:space-between;border-bottom:3px solid #6C63FF;padding-bottom:14px;margin-bottom:18px}
.logo{font-size:20px;font-weight:800}.logo span{color:#6C63FF}
.meta{text-align:right;font-size:11px;color:#666}
h1{font-size:22px;font-weight:800;margin-bottom:4px}
.subtitle{color:#666;font-size:11px;margin-bottom:14px}
.scores{display:flex;gap:16px;margin-bottom:20px}
.score-main{flex:1;background:#F0EFFF;border:2px solid #6C63FF22;border-radius:12px;padding:14px;text-align:center}
.score-big{font-size:44px;font-weight:800;color:${scoreColor};line-height:1}
.score-lbl{font-size:12px;color:#666;margin-top:4px}
.risk-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-weight:700;font-size:12px;text-transform:uppercase;background:${riskColor}22;color:${riskColor};margin-top:8px}
.stat{flex:1;border:1px solid #eee;border-radius:10px;padding:10px;text-align:center}
.stat .n{font-size:28px;font-weight:800}.stat .l{font-size:11px;color:#666;margin-top:2px}
.sec{margin-bottom:14px}
.sec-title{font-size:13px;font-weight:700;color:#6C63FF;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #6C63FF22}
.summary{background:#F0EFFF;border-left:4px solid #6C63FF;border-radius:0 8px 8px 0;padding:8px 12px;font-size:11px;line-height:1.5;color:#333}
.fg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}
.fc{border:1px solid #eee;border-radius:8px;padding:8px 10px}
.fc.pass{border-color:#00B89444;background:#00B89408}
.fc.fail{border-color:#E9456044;background:#E9456008}
.fc-lbl{font-weight:600;font-size:11px;margin-bottom:4px}
.fc-score{font-size:22px;font-weight:800}
.fc-bar{height:5px;border-radius:3px;background:#eee;margin:5px 0}
.fc-fill{height:100%;border-radius:3px}
.fc-meta{font-size:10px;color:#999}
.pb{display:inline-block;font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px}
.pb.pass{background:#00B89422;color:#00B894}.pb.fail{background:#E9456022;color:#E94560}
.sr{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.sn{font-size:12px;width:130px;flex-shrink:0;font-weight:500}
.sb{flex:1;height:14px;border-radius:4px;background:#eee;overflow:hidden}
.sf{height:100%;border-radius:4px}
.sv{font-size:11px;color:#666;width:48px;text-align:right}
.cb{margin-bottom:10px}
.ch{display:flex;justify-content:space-between;font-weight:700;font-size:12px;margin-bottom:7px}
.ci{display:flex;align-items:flex-start;gap:7px;margin-bottom:4px;font-size:12px;color:#444}
.ck{width:14px;height:14px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;margin-top:1px}
.ck.pass{background:#00B89422;color:#00B894}.ck.fail{background:#E9456022;color:#E94560}
.rc{border:1px solid #eee;border-radius:8px;padding:9px 12px;margin-bottom:6px;page-break-inside:avoid}
.rh{display:flex;justify-content:space-between;margin-bottom:5px}
.rdim{font-weight:700;font-size:12px;text-transform:capitalize}
.rpb{font-size:10px;font-weight:700;text-transform:uppercase;padding:2px 7px;border-radius:8px}
.rh-h{background:#E9456022;color:#E94560}.rh-m{background:#FDCB6E22;color:#F9A825}.rh-l{background:#00B89422;color:#00B894}
.rt{font-size:11.5px;color:#555;line-height:1.5;margin-bottom:4px}
.rs{display:flex;gap:14px;font-size:11px;color:#888}
.hash{background:#f5f5f5;border-radius:8px;padding:10px;font-family:monospace;font-size:10px;color:#666;word-break:break-all}
.footer{margin-top:36px;padding-top:14px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:10px;color:#aaa}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><div class="page">
<div class="header">
  <div><div class="logo">🛡 <span>JCCS</span> Jedi Code Compliance System</div>
  <div style="font-size:11px;color:#888;margin-top:3px">AI Ethics Auditing Platform · Star Wars Hackathon 2026 · PS9</div></div>
  <div class="meta"><div style="font-weight:700;font-size:13px;color:#1a1a2e">COMPLIANCE AUDIT REPORT</div>
  <div>Audit ID: #${id}</div><div>Generated: ${new Date().toLocaleString()}</div>
  <div>Status: <span style="color:#00B894;font-weight:600">COMPLETED</span></div></div>
</div>
<h1>${audit.run_name}</h1>
<div class="subtitle">${audit.file_name} · ${audit.row_count?.toLocaleString() || 0} rows · ${new Date(audit.created_at).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</div>
<div class="scores">
  <div class="score-main"><div class="score-big">${score}</div><div class="score-lbl">Ethics Score / 100</div>
  <div><span class="risk-badge">${(audit.risk_level||'unknown').toUpperCase()} RISK</span></div></div>
  <div class="stat"><div class="n" style="color:#00B894">${passed}</div><div class="l">Passed</div></div>
  <div class="stat"><div class="n" style="color:#E94560">${failed}</div><div class="l">Failed</div></div>
  <div class="stat"><div class="n" style="color:#6C63FF">6</div><div class="l">Tested</div></div>
</div>
${explanations?.summary ? `<div class="sec"><div class="sec-title">AI Analysis Summary</div><div class="summary">${explanations.summary.split(" ").slice(0,80).join(" ")}${explanations.summary.split(" ").length > 80 ? "..." : ""}</div></div>` : ''}
<div class="sec"><div class="sec-title">Fairness Dimensions</div><div class="fg">
${fairness_results?.map(r => {
  const c = SCORE_COLOR(r.score)
  return `<div class="fc ${r.passed?'pass':'fail'}">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
    <div class="fc-lbl">${r.dimension_label}</div>
    <span class="pb ${r.passed?'pass':'fail'}">${r.passed?'PASS':'FAIL'}</span>
  </div>
  <div class="fc-score" style="color:${c}">${Math.round(r.score)}</div>
  <div class="fc-bar"><div class="fc-fill" style="width:${r.score}%;background:${c}"></div></div>
  ${r.metric_value!=null?`<div class="fc-meta">Disparity: ${Math.abs(r.metric_value*100).toFixed(1)}% · Threshold: ${(r.threshold*100).toFixed(0)}%</div>`:''}
</div>`}).join('')||''}
</div></div>
${shap_results?.length > 0 ? `<div class="sec"><div class="sec-title">SHAP Feature Importance (Top 8)</div>
${shap_results.slice(0,8).map((s,i) => {
  const maxV = shap_results[0]?.shap_importance || 1
  const pct = Math.min(100,(s.shap_importance/maxV)*100)
  const c = i===0?'#E94560':i<=2?'#FDCB6E':'#6C63FF'
  return `<div class="sr"><div class="sn">${s.feature_name}</div><div class="sb"><div class="sf" style="width:${pct}%;background:${c}"></div></div><div class="sv">${(s.shap_importance*100).toFixed(2)}%</div></div>`
}).join('')}
<p style="font-size:11px;color:#999;margin-top:6px">Red = highest impact. These features most influence model decisions.</p></div>` : ''}
${data.lime_results?.length > 0 ? `<div class="sec"><div class="sec-title">LIME Local Explanations (Top 6)</div>
${data.lime_results.slice(0,6).map((l,i) => {
  const c = i===0?'#E94560':i<=2?'#FDCB6E':'#6C63FF'
  return `<div class="sr"><div class="sn">${l.feature_name}</div><div class="sb"><div class="sf" style="width:${Math.min(100,l.lime_importance*100).toFixed(0)}%;background:${c}"></div></div><div class="sv">${(l.lime_importance*100).toFixed(1)}%</div></div>`
}).join('')}
<p style="font-size:11px;color:#999;margin-top:6px">LIME explains individual decisions — why a specific person was approved or rejected.</p></div>` : ''}
<div class="sec"><div class="sec-title">Regulatory Compliance</div>
${Object.entries(compByStd).map(([std,checks]) => {
  const p = checks.filter(c=>c.passed).length
  return `<div class="cb"><div class="ch"><span>${stdNames[std]||std}</span><span style="color:${p===checks.length?'#00B894':'#E94560'}">${p}/${checks.length} requirements</span></div>
${checks.map(c=>`<div class="ci"><span class="ck ${c.passed?'pass':'fail'}">${c.passed?'✓':'✗'}</span><span>${c.requirement}</span></div>`).join('')}
</div>`}).join('')}
</div>
${remediations?.length > 0 ? `<div class="sec"><div class="sec-title">Remediation Recommendations</div>
${remediations.slice(0,5).map(r=>`<div class="rc">
<div class="rh"><span class="rdim">${(r.dimension||'').replace(/_/g,' ')}</span>
<span class="rpb rh-${r.priority[0]}">${r.priority}</span></div>
<div class="rt">${r.suggestion}</div>
<div class="rs"><span>📉 Bias reduction: ~${r.estimated_bias_reduction}%</span><span>⚡ Accuracy loss: ~${r.estimated_accuracy_loss}%</span></div>
</div>`).join('')}</div>` : ''}
<div style="margin-top:10px;padding-top:8px;border-top:1px solid #eee;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
<span style="font-size:10px;font-weight:700;color:#6C63FF;white-space:nowrap">⛓ SHA-256</span>
<span style="font-family:monospace;font-size:9.5px;color:#888;word-break:break-all;flex:1">${audit.hash_sha256||'Computing...'}</span>
<span style="font-size:9px;color:#bbb;white-space:nowrap">Audit #${id} · ${new Date().toLocaleDateString()}</span>
</div>
<div style="margin-top:4px;font-size:9px;color:#aaa;text-align:center">JCCS · Jedi Code Compliance System · Star Wars Hackathon 2026 · PS9</div>
</div></body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  setTimeout(() => win.print(), 600)
}

export default function ResultsPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAudit(id)
        setData(res.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-3">
        <Loader className="w-10 h-10 animate-spin" style={{ color: '#6C63FF' }} />
        <p className="text-gray-400">Loading audit results...</p>
      </div>
    </div>
  )

  if (!data) return <div className="text-center text-gray-400 py-20">Audit not found.</div>

  const { audit, fairness_results, shap_results, explanations, remediations, compliance_checks, model_metrics } = data
  const score = Math.round(audit.overall_score || 0)

  const radarData = fairness_results?.map(r => ({
    subject: r.dimension_label.replace(' Fairness','').replace('Demographic ','Demo.').replace('Counterfactual','Counter.').replace('Individual ','Indiv.'),
    score: r.score, fullMark: 100
  })) || []

  const shapData = (shap_results || []).slice(0, 10).map(s => ({
    name: s.feature_name,
    value: parseFloat((s.shap_importance * 100).toFixed(2))
  }))

  const limeData = (data.lime_results || []).slice(0, 8).map(l => ({
    name: l.feature_name,
    value: parseFloat((l.lime_importance * 100).toFixed(1)),
    explanation: l.explanation
  }))

  const complianceByStandard = {}
  compliance_checks?.forEach(c => {
    if (!complianceByStandard[c.standard]) complianceByStandard[c.standard] = []
    complianceByStandard[c.standard].push(c)
  })

  const tabs = ['overview', 'fairness', 'explainability', 'compliance', 'remediation']
  const riskColor = RISK_COLORS[audit.risk_level] || '#E94560'

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/history" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{audit.run_name}</h1>
          <p className="text-gray-400 text-sm">{audit.file_name} · {audit.row_count?.toLocaleString()} rows · {new Date(audit.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleShare}
            aria-label={copied ? 'Link copied to clipboard' : 'Copy share link'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(108,99,255,0.15)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)' }}>
            {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            {copied ? 'Copied!' : 'Share Link'}
          </button>
          <button
            onClick={() => generatePDF(data, id)}
            disabled={!data || data?.audit?.status !== 'completed'}
            aria-label={!data || data?.audit?.status !== 'completed' ? 'Export PDF — audit still processing' : 'Export audit PDF report'}
            title={!data || data?.audit?.status !== 'completed' ? 'Audit still processing...' : 'Export PDF report'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 20px rgba(108,99,255,0.3)' }}>
            <Download className="w-4 h-4" aria-hidden="true" />
            Export PDF
          </button>
          <div className="px-3 py-1 rounded-full text-xs font-bold uppercase"
            style={{ background: riskColor + '22', color: riskColor }}>
            {audit.risk_level} risk
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 glass rounded-xl p-1 w-fit overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: '📊' },
          { key: 'fairness', label: 'Fairness', icon: '⚖️' },
          { key: 'explainability', label: 'Explainability', icon: '🧠' },
          { key: 'compliance', label: 'Compliance', icon: '📋' },
          { key: 'remediation', label: 'Remediation', icon: '🔧' },
          { key: 'stakeholders', label: 'Reports', icon: '👥' },
          { key: 'beforeafter', label: 'Before/After', icon: '📈' },
        ].map(({ key, label, icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            aria-label={label}
            aria-selected={activeTab === key}
            role="tab"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === key
                ? 'text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === key ? { background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' } : {}}>
            <span className="text-base leading-none">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score */}
            <div className="glass rounded-2xl p-6 flex flex-col items-center gap-2">
              <ScoreRing score={score} riskLevel={audit.risk_level} />
              <div className="flex gap-6 mt-1 text-center">
                <div>
                  <div className="text-xl font-bold text-green-400">{fairness_results?.filter(r => r.passed).length || 0}</div>
                  <div className="text-xs text-gray-500">Passed</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <div className="text-xl font-bold text-red-400">{fairness_results?.filter(r => !r.passed).length || 0}</div>
                  <div className="text-xs text-gray-500">Failed</div>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold text-white text-sm mb-2">Fairness Radar</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                    <PolarGrid stroke="#ffffff15" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 8 }} tickCount={4} />
                    <Radar name="Score" dataKey="score" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: '#6C63FF' }} /> AI Analysis Summary
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed flex-1 overflow-y-auto max-h-36">
                {explanations?.summary && explanations.summary !== 'None'
                  ? explanations.summary
                  : audit.status === 'completed'
                    ? 'Add GROQ_API_KEY to your .env file to enable AI-powered plain-language analysis.'
                    : 'Analysis in progress...'}
              </p>
              <div className="pt-2 border-t border-white/5 space-y-1">
                <p className="text-xs text-gray-600 font-mono break-all">SHA-256: {audit.hash_sha256?.slice(0, 32)}...</p>
                {audit.blockchain_tx && (
                  <p className="text-xs font-mono" style={{ color: '#00B894' }}>
                    ⛓ {audit.blockchain_tx.split('|')[0]} · {audit.blockchain_tx.split('|')[1]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fairness Snapshot */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              All 6 Fairness Dimensions
              <span className="text-green-400">{fairness_results?.filter(r=>r.passed).length || 0} passed</span>
              <span className="text-gray-600">·</span>
              <span className="text-red-400">{fairness_results?.filter(r=>!r.passed).length || 0} failed</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {fairness_results?.map(r => (
                <div key={r.dimension}
                  className={`rounded-xl p-3 text-center border transition-all hover:scale-105 cursor-default ${r.passed ? 'border-green-500/25 bg-green-500/5' : 'border-red-500/25 bg-red-500/5'}`}>
                  <div className="text-2xl font-black leading-none mb-1" style={{ color: SCORE_COLOR(r.score) }}>{r.score}</div>
                  <div className="text-xs text-gray-400 leading-tight mb-1.5">{r.dimension_label.replace(' Fairness','').replace('Model ','')}</div>
                  <div className={`text-xs font-black ${r.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {r.passed ? '✓ PASS' : '✗ FAIL'}
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: SCORE_COLOR(r.score) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FAIRNESS */}
      {activeTab === 'fairness' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fairness_results?.map(r => <FairnessCard key={r.dimension} r={r} />)}
          </div>
          {explanations?.bias_findings?.length > 0 && (
            <div className="glass rounded-xl p-5 border border-red-500/20">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> AI Bias Findings
              </h3>
              <div className="space-y-3">
                {explanations.bias_findings.map((f, i) => (
                  <p key={i} className="text-gray-300 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: '#E94560' }}>{f}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXPLAINABILITY */}
      {activeTab === 'explainability' && (
        <div className="space-y-6">

          {/* Plain English Intro Banner */}
          <div className="rounded-2xl p-4 flex flex-col sm:flex-row gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(233,69,96,0.08))', border: '1px solid rgba(108,99,255,0.2)' }}>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">🔍 Why did the model make these decisions?</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                This tab shows which data features (like age, education, income) had the most influence on the AI model's predictions.
                A high percentage means that feature strongly affected outcomes — which can reveal hidden bias.
              </p>
            </div>
            {/* Color Legend */}
            <div className="flex sm:flex-col gap-3 justify-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#E94560' }} />
                <span className="text-xs text-gray-400">#1 highest impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#FDCB6E' }} />
                <span className="text-xs text-gray-400">#2–3 high impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#6C63FF' }} />
                <span className="text-xs text-gray-400">lower impact</span>
              </div>
            </div>
          </div>

          {/* SHAP Section */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#6C63FF22', color: '#a78bfa' }}>SHAP</span>
              <h3 className="font-semibold text-white">Global Feature Importance</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Which features most influence the model's decisions overall? (TreeExplainer — model-level view)</p>
            {shapData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapData} layout="vertical" margin={{ left: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={90} />
                    <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #6C63FF44', borderRadius: 8 }}
                      labelStyle={{ color: 'white', fontWeight: 'bold' }}
                      formatter={(val) => [`${val}%`, 'SHAP Importance']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {shapData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#E94560' : i <= 2 ? '#FDCB6E' : '#6C63FF'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-gray-500 text-sm py-8 text-center">No numeric feature columns detected.</p>}
          </div>

          {/* LIME Section */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#E9456022', color: '#E94560' }}>LIME</span>
              <h3 className="font-semibold text-white">Local Decision Explanations</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Why was THIS specific individual accepted or rejected? (Perturbation-based — individual-level view)</p>
            {limeData.length > 0 ? (
              <div className="space-y-3">
                {limeData.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 font-medium">{item.name}</span>
                      <span className="text-xs font-bold" style={{ color: i === 0 ? '#E94560' : i <= 2 ? '#FDCB6E' : '#6C63FF' }}>
                        {item.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${item.value}%`, background: i === 0 ? '#E94560' : i <= 2 ? '#FDCB6E' : '#6C63FF' }} />
                    </div>
                    {item.explanation && (
                      <p className="text-xs text-gray-500 leading-relaxed">{item.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm py-4 text-center">Run a new audit to see LIME results.</p>}
          </div>

          {/* Comparison callout */}
          <div className="glass rounded-xl p-4 border border-[#6C63FF]/20">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-purple-400 font-bold">SHAP</span> tells you which features matter most across all predictions (global view).{' '}
              <span className="text-red-400 font-bold">LIME</span> tells you why a specific individual got the decision they did (local view).{' '}
              Together they satisfy both GDPR right-to-explanation and PS9 official success criteria.
            </p>
          </div>
        </div>
      )}

      {/* COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {Object.entries(complianceByStandard).map(([standard, checks]) => {
            const passed = checks.filter(c => c.passed).length
            const pct = Math.round((passed / checks.length) * 100)
            return (
              <div key={standard} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{STANDARDS[standard] || standard}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-white/5 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#00B894' : pct >= 50 ? '#FDCB6E' : '#E94560' }} />
                    </div>
                    <span className={`text-sm font-bold ${passed === checks.length ? 'text-green-400' : 'text-yellow-400'}`}>{passed}/{checks.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {checks.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {c.passed ? <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                : <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm text-gray-300">{c.requirement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <div className="glass rounded-xl p-4 border border-[#6C63FF]/20 text-center text-xs text-gray-400">
            Mapped to <span className="text-purple-400">EU AI Act 2026</span> Art. 10,13,14,15 ·{' '}
            <span className="text-green-400">India DPDP Act</span> Sec. 4,11,16 ·{' '}
            <span className="text-yellow-400">ISO/IEC 42001</span> Cl. 6.1.2, 8.4, 9.1
          </div>

          {/* Blockchain Certificate */}
          {audit.blockchain_tx && (() => {
            const parts = (audit.blockchain_tx || '').split('|')
            const provider = parts[0] || 'JCCS'
            const network  = parts[1] || 'SHA256-ChainedProof'
            const certId   = parts[2] || ''
            const anchored = parts[3] || ''
            const isReal   = provider === 'OriginStamp'
            return (
              <div className="glass rounded-xl p-5 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                    <span>⛓</span> Blockchain Audit Certificate
                  </h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isReal ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {isReal ? '🌐 BITCOIN ANCHORED' : '🔐 CRYPTOGRAPHIC PROOF'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-500 mb-1">Provider</div>
                    <div className="text-green-400 font-bold font-mono">{provider}</div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-500 mb-1">Network</div>
                    <div className="text-white font-mono">{network}</div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-500 mb-1">Certificate ID</div>
                    <div className="text-white font-mono break-all">{certId.slice(0,20)}...</div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="text-gray-500 mb-1">Anchored At</div>
                    <div className="text-white font-mono">{anchored}</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <div className="text-xs text-gray-500 mb-1">SHA-256 Dataset Hash</div>
                  <div className="text-xs text-gray-300 font-mono break-all leading-relaxed">{audit.hash_sha256}</div>
                </div>
                {isReal && (
                  <a href={`https://app.originstamp.com/verify/${audit.hash_sha256}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors">
                    🔗 Verify on Bitcoin blockchain →
                  </a>
                )}
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  This hash uniquely fingerprints your dataset. Any modification produces a completely different hash — making tampering instantly detectable. Meets EU AI Act Article 12 audit trail requirements.
                </p>
              </div>
            )
          })()}
        </div>
      )}

      {/* REMEDIATION */}
      {activeTab === 'remediation' && (
        <div className="space-y-4">

          {/* Enhanced AI Remediation Plan */}
          {explanations?.remediation_plan && (
            <div className="glass rounded-2xl p-6 border border-[#6C63FF]/30"
              style={{ background: 'rgba(108,99,255,0.04)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)' }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">AI Remediation Plan</h3>
                  <p className="text-xs text-gray-500">Generated based on your dataset domain and failed dimensions</p>
                </div>
              </div>
              <div className="rounded-xl p-4 border border-white/5"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-gray-200 text-sm leading-relaxed">{explanations.remediation_plan}</p>
              </div>
            </div>
          )}

          {/* Per-dimension remediation cards */}
          {remediations?.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                Per-Dimension Fix Plan — {remediations.length} action{remediations.length > 1 ? 's' : ''} required
              </h3>
              {remediations.map((r, i) => {
                const techniques = {
                  demographic_parity:     { label: 'Reweighing + Fairness Constraints', color: '#6C63FF', icon: '⚖️' },
                  equal_opportunity:      { label: 'Threshold Adjustment', color: '#00B894', icon: '🎯' },
                  calibration:            { label: 'Platt Scaling', color: '#FDCB6E', icon: '📐' },
                  individual_fairness:    { label: 'Fairness Regularization', color: '#a78bfa', icon: '👤' },
                  counterfactual_fairness:{ label: 'Causal Analysis', color: '#E94560', icon: '🔄' },
                  privacy:                { label: 'PII Removal + Anonymization', color: '#06B6D4', icon: '🔒' },
                  robustness:             { label: 'Data Augmentation + Noise Testing', color: '#F97316', icon: '🛡️' },
                  accountability:         { label: 'Audit Trail Enhancement', color: '#84CC16', icon: '📋' },
                }
                const tech = techniques[r.dimension] || { label: 'Mitigation', color: '#6C63FF', icon: '🔧' }
                return (
                  <div key={i} className={`glass rounded-xl p-5 border ${
                    r.priority === 'high' ? 'border-red-500/30' :
                    r.priority === 'medium' ? 'border-yellow-500/30' : 'border-green-500/30'
                  }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tech.icon}</span>
                        <span className="text-sm font-black text-white capitalize">
                          {r.dimension?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: tech.color + '20', color: tech.color }}>
                          {tech.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold ${
                          r.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          r.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>{r.priority} priority</span>
                      </div>
                    </div>

                    {/* Suggestion text */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{r.suggestion}</p>

                    {/* Impact metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg p-3 border border-green-500/20"
                        style={{ background: 'rgba(0,184,148,0.05)' }}>
                        <div className="text-xs text-gray-500 mb-1">Expected Bias Reduction</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/5">
                            <div className="h-1.5 rounded-full"
                              style={{ width: `${r.estimated_bias_reduction}%`, background: '#00B894' }} />
                          </div>
                          <span className="text-sm font-black text-green-400">~{r.estimated_bias_reduction}%</span>
                        </div>
                      </div>
                      <div className="rounded-lg p-3 border border-yellow-500/20"
                        style={{ background: 'rgba(253,203,110,0.05)' }}>
                        <div className="text-xs text-gray-500 mb-1">Accuracy Trade-off</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/5">
                            <div className="h-1.5 rounded-full"
                              style={{ width: `${r.estimated_accuracy_loss * 10}%`, background: '#FDCB6E' }} />
                          </div>
                          <span className="text-sm font-black text-yellow-400">~{r.estimated_accuracy_loss}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="glass rounded-xl p-8 text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-white font-medium">No remediations needed!</p>
              <p className="text-gray-400 text-sm">All fairness dimensions passed their thresholds.</p>
            </div>
          )}
        </div>
      )}

      {/* STAKEHOLDER REPORTS */}
      {activeTab === 'stakeholders' && (
        <div className="space-y-4">
          {/* Tab selector */}
          {(() => {
            const [stakeholderView, setStakeholderView] = useState('executive')
            const score = Math.round(audit?.overall_score || 0)
            const risk = audit?.risk_level || 'unknown'
            const passedCount = fairness_results?.filter(r => r.passed).length || 0
            const failedCount = fairness_results?.filter(r => !r.passed).length || 0
            const failedDims = fairness_results?.filter(r => !r.passed).map(r => r.dimension_label) || []
            const topShap = shap_results?.[0]?.feature_name || 'unknown feature'

            return (
              <div className="space-y-4">
                {/* View selector */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'executive', label: '👔 Executive', color: '#6C63FF' },
                    { key: 'developer', label: '💻 Developer', color: '#00B894' },
                    { key: 'regulator', label: '⚖️ Regulator', color: '#FDCB6E' },
                    { key: 'enduser',   label: '👤 End User',   color: '#E94560' },
                  ].map(v => (
                    <button key={v.key} onClick={() => setStakeholderView(v.key)}
                      className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: stakeholderView === v.key ? v.color + '25' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${stakeholderView === v.key ? v.color : 'rgba(255,255,255,0.08)'}`,
                        color: stakeholderView === v.key ? v.color : '#9ca3af'
                      }}>
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Executive Report */}
                {stakeholderView === 'executive' && (
                  <div className="space-y-4">
                    <div className="glass rounded-2xl p-6 border border-[#6C63FF]/20">
                      <h3 className="font-black text-white text-lg mb-1">Executive Summary</h3>
                      <p className="text-gray-400 text-xs mb-4">High-level risk assessment for leadership and board</p>
                      <div className="grid grid-cols-3 gap-4 mb-5">
                        <div className="text-center rounded-xl p-4" style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
                          <div className="text-3xl font-black" style={{ color: SCORE_COLOR(score) }}>{score}</div>
                          <div className="text-xs text-gray-500 mt-1">Ethics Score / 100</div>
                        </div>
                        <div className="text-center rounded-xl p-4" style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)' }}>
                          <div className="text-3xl font-black text-green-400">{passedCount}</div>
                          <div className="text-xs text-gray-500 mt-1">Checks Passed</div>
                        </div>
                        <div className="text-center rounded-xl p-4" style={{ background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.2)' }}>
                          <div className="text-3xl font-black text-red-400">{failedCount}</div>
                          <div className="text-xs text-gray-500 mt-1">Issues Found</div>
                        </div>
                      </div>
                      <div className="rounded-xl p-4 mb-3" style={{ background: risk === 'critical' || risk === 'high' ? 'rgba(233,69,96,0.08)' : 'rgba(0,184,148,0.08)', border: `1px solid ${risk === 'critical' || risk === 'high' ? 'rgba(233,69,96,0.2)' : 'rgba(0,184,148,0.2)'}` }}>
                        <div className="font-black text-white mb-1">
                          {risk === 'critical' ? '🔴 DO NOT DEPLOY' : risk === 'high' ? '🟠 HIGH RISK — Review Required' : risk === 'medium' ? '🟡 MEDIUM RISK — Monitor Closely' : '🟢 LOW RISK — Safe to Deploy'}
                        </div>
                        <p className="text-gray-300 text-sm">
                          {risk === 'critical' || risk === 'high'
                            ? `This AI model has significant fairness issues that could expose the organization to legal liability under EU AI Act 2026 and India DPDP Act. Deployment is not recommended until ${failedCount} identified issues are resolved.`
                            : `This AI model meets minimum fairness standards. ${passedCount} of ${passedCount + failedCount} checks passed. Continue monitoring post-deployment for fairness drift.`
                          }
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Audit ID: #{audit?.id} · {audit?.file_name} · {audit?.row_count?.toLocaleString()} rows analyzed · {new Date(audit?.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Developer Report */}
                {stakeholderView === 'developer' && (
                  <div className="space-y-3">
                    <div className="glass rounded-2xl p-6 border border-green-500/20">
                      <h3 className="font-black text-white text-lg mb-1">Developer Technical Report</h3>
                      <p className="text-gray-400 text-xs mb-4">Code-level metrics and implementation suggestions</p>
                      <div className="space-y-3">
                        {failedDims.length > 0 && (
                          <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="text-xs font-black text-green-400 mb-2">// Failed Dimensions — Fix Priority</div>
                            {fairness_results?.filter(r => !r.passed).map((r, i) => (
                              <div key={i} className="text-xs font-mono text-gray-300 mb-1">
                                <span className="text-red-400">✗</span> {r.dimension} — score: {Math.round(r.score)}/100, disparity: {r.metric_value?.toFixed(4)}, threshold: {r.threshold}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="text-xs font-black text-green-400 mb-2">// Top Feature Driving Bias (SHAP)</div>
                          {shap_results?.slice(0, 5).map((s, i) => (
                            <div key={i} className="text-xs font-mono text-gray-300 mb-1">
                              <span className="text-yellow-400">→</span> {s.feature_name}: {(s.shap_importance * 100).toFixed(1)}% importance
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="text-xs font-black text-green-400 mb-2">// Recommended Libraries</div>
                          <div className="text-xs font-mono text-gray-300 space-y-1">
                            <div><span className="text-purple-400">pip install</span> fairlearn  <span className="text-gray-600"># ExponentiatedGradient, ThresholdOptimizer</span></div>
                            <div><span className="text-purple-400">pip install</span> aif360     <span className="text-gray-600"># Reweighing, AdversarialDebiasing</span></div>
                            <div><span className="text-purple-400">pip install</span> shap       <span className="text-gray-600"># TreeExplainer for feature attribution</span></div>
                          </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="text-xs font-black text-green-400 mb-2">// SHA-256 Audit Hash</div>
                          <div className="text-xs font-mono text-gray-400 break-all">{audit?.hash_sha256}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regulator Report */}
                {stakeholderView === 'regulator' && (
                  <div className="space-y-3">
                    <div className="glass rounded-2xl p-6 border border-yellow-500/20">
                      <h3 className="font-black text-white text-lg mb-1">Regulatory Compliance Report</h3>
                      <p className="text-gray-400 text-xs mb-4">Formal compliance status for regulatory submission</p>
                      {Object.entries(
                        compliance_checks?.reduce((acc, c) => {
                          if (!acc[c.standard]) acc[c.standard] = []
                          acc[c.standard].push(c)
                          return acc
                        }, {}) || {}
                      ).map(([std, checks]) => {
                        const passed = checks.filter(c => c.passed).length
                        const total = checks.length
                        const stdNames = { EU_AI_ACT: 'EU AI Act 2026', DPDP: 'India DPDP Act 2025-26', ISO_42001: 'ISO/IEC 42001' }
                        return (
                          <div key={std} className="mb-4 rounded-xl p-4 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-black text-white text-sm">{stdNames[std] || std}</span>
                              <span className={`text-sm font-black ${passed === total ? 'text-green-400' : 'text-yellow-400'}`}>{passed}/{total} COMPLIANT</span>
                            </div>
                            {checks.map((c, i) => (
                              <div key={i} className="flex items-start gap-2 mb-1.5">
                                {c.passed ? <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                                <span className="text-xs text-gray-300">{c.requirement}</span>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                      <div className="rounded-xl p-3 border border-white/5 text-xs text-gray-500 text-center">
                        Audit ID #{audit?.id} · Blockchain: {audit?.blockchain_tx?.split('|')[0]} · {new Date(audit?.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* End User Report */}
                {stakeholderView === 'enduser' && (
                  <div className="space-y-3">
                    <div className="glass rounded-2xl p-6 border border-red-500/20">
                      <h3 className="font-black text-white text-lg mb-1">Plain Language Report</h3>
                      <p className="text-gray-400 text-xs mb-4">Simple explanation of how this AI model may affect you</p>
                      <div className="space-y-3">
                        <div className="rounded-xl p-4" style={{ background: risk === 'critical' || risk === 'high' ? 'rgba(233,69,96,0.08)' : 'rgba(0,184,148,0.08)', border: `1px solid ${risk === 'critical' || risk === 'high' ? 'rgba(233,69,96,0.2)' : 'rgba(0,184,148,0.2)'}` }}>
                          <div className="font-black text-white mb-2">
                            {risk === 'critical' ? '⚠️ This AI model may be treating people unfairly' : risk === 'high' ? '⚠️ This AI model has some fairness concerns' : '✅ This AI model appears to be reasonably fair'}
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {risk === 'critical'
                              ? `Our analysis found that this AI model treats different groups of people unequally. If you were denied a service, loan, job, or healthcare by this system, the decision may have been influenced by your age, gender, or race — not just your qualifications or circumstances.`
                              : risk === 'high'
                              ? `This AI model shows some signs of unequal treatment across demographic groups. While not severely biased, there is a meaningful chance that decisions could be influenced by protected characteristics.`
                              : `This AI model shows relatively equal treatment across different demographic groups. Decisions appear to be based primarily on relevant factors rather than protected characteristics.`
                            }
                          </p>
                        </div>
                        <div className="rounded-xl p-4 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <div className="font-bold text-white text-sm mb-2">🔍 What most influences decisions in this model:</div>
                          {shap_results?.slice(0, 3).map((s, i) => (
                            <div key={i} className="flex items-center gap-3 mb-2">
                              <span className="text-sm">{i === 0 ? '1️⃣' : i === 1 ? '2️⃣' : '3️⃣'}</span>
                              <div className="flex-1">
                                <div className="text-sm text-white font-medium">{s.feature_name?.replace(/_/g, ' ')}</div>
                                <div className="w-full h-1.5 rounded-full bg-white/5 mt-1">
                                  <div className="h-1.5 rounded-full" style={{ width: `${s.shap_importance * 100}%`, background: i === 0 ? '#E94560' : i === 1 ? '#FDCB6E' : '#6C63FF' }} />
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">{(s.shap_importance * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl p-4 border border-purple-500/20" style={{ background: 'rgba(108,99,255,0.05)' }}>
                          <div className="font-bold text-white text-sm mb-2">📋 Your Rights</div>
                          <p className="text-gray-300 text-xs leading-relaxed">Under the India DPDP Act Section 11, you have the right to an explanation for any automated decision that affects you. Under EU AI Act Article 13, AI systems must be transparent about how they make decisions. This audit certificate (ID #{audit?.id}) can be used as evidence in a formal complaint.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* BEFORE / AFTER */}
      {activeTab === 'beforeafter' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 border border-[#6C63FF]/20">
            <h3 className="font-black text-white text-lg mb-1 flex items-center gap-2">
              📈 Projected After Remediation
            </h3>
            <p className="text-gray-400 text-xs mb-5">Estimated scores if all recommended fixes are applied. Based on academic benchmarks for each mitigation technique.</p>

            {/* Overall score before/after */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl p-5 text-center border border-red-500/20" style={{ background: 'rgba(233,69,96,0.05)' }}>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Current Score</div>
                <div className="text-5xl font-black mb-1" style={{ color: SCORE_COLOR(Math.round(audit?.overall_score || 0)) }}>
                  {Math.round(audit?.overall_score || 0)}
                </div>
                <div className="text-xs font-black uppercase" style={{ color: SCORE_COLOR(Math.round(audit?.overall_score || 0)) }}>
                  {audit?.risk_level} risk
                </div>
              </div>
              <div className="rounded-xl p-5 text-center border border-green-500/20" style={{ background: 'rgba(0,184,148,0.05)' }}>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Projected Score</div>
                {(() => {
                  const current = Math.round(audit?.overall_score || 0)
                  const totalReduction = remediations?.reduce((sum, r) => sum + (r.estimated_bias_reduction || 0), 0) || 0
                  const avgReduction = remediations?.length > 0 ? totalReduction / remediations.length : 0
                  const projected = Math.min(100, Math.round(current + (100 - current) * (avgReduction / 100)))
                  const projRisk = projected >= 80 ? 'low' : projected >= 60 ? 'medium' : projected >= 40 ? 'high' : 'critical'
                  return (
                    <>
                      <div className="text-5xl font-black mb-1" style={{ color: SCORE_COLOR(projected) }}>{projected}</div>
                      <div className="text-xs font-black uppercase" style={{ color: SCORE_COLOR(projected) }}>{projRisk} risk</div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Per-dimension before/after bars */}
            <div className="space-y-4">
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Per-Dimension Improvement</div>
              {fairness_results?.filter(r => !r.passed).map((r, i) => {
                const rem = remediations?.find(rem => rem.dimension === r.dimension)
                const projected = rem ? Math.min(100, Math.round(r.score + (100 - r.score) * (rem.estimated_bias_reduction / 100))) : Math.round(r.score)
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 font-medium capitalize">{r.dimension_label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-bold">{Math.round(r.score)}</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-green-400 font-bold">~{projected}</span>
                      </div>
                    </div>
                    {/* Before bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-12">Before</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5">
                        <div className="h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${r.score}%`, background: '#E94560' }} />
                      </div>
                    </div>
                    {/* After bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-12">After</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5">
                        <div className="h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${projected}%`, background: '#00B894' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
              {fairness_results?.filter(r => r.passed).map((r, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium capitalize">{r.dimension_label}</span>
                    <span className="text-green-400 font-bold text-xs">✅ Already passing — {Math.round(r.score)}/100</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Accuracy trade-off warning */}
            {remediations?.length > 0 && (
              <div className="mt-5 rounded-xl p-4 border border-yellow-500/20" style={{ background: 'rgba(253,203,110,0.05)' }}>
                <div className="text-yellow-400 font-black text-sm mb-1">⚡ Accuracy Trade-off</div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Applying all {remediations.length} recommended fixes is estimated to reduce accuracy by ~{remediations.reduce((sum, r) => sum + (r.estimated_accuracy_loss || 0), 0).toFixed(1)}% total.
                  This is the standard fairness-accuracy trade-off documented in academic literature.
                  Human approval is required before applying any automated debiasing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}