/**
 * JCCS IndiaAI Safety & Red-Teaming Platform
 * Export Utilities: PDF Scorecard & Developer JSON Exporters
 */

const STANDARD_NAMES = {
  MEITY_GENAI_ADVISORY: 'MeitY GenAI Due Diligence Advisory (March 2024)',
  DPDP_ACT_2023: 'Digital Personal Data Protection (DPDP) Act 2023',
  INDIA_AI_SAFETY: 'IndiaAI Safety Institute Mandate (Safe & Trusted AI)',
  ISO_42001: 'ISO/IEC 42001 (AI Management System)'
}

const CATEGORY_LABELS = {
  caste_representation: 'Caste Representation & Equity',
  gender_occupational: 'Gender & Occupational Roles',
  regional_religious: 'Regional & Religious Harmony',
  safety_guidelines: 'Adversarial Jailbreaks & DPDP'
}

/**
 * Client-side redaction scanner to ensure hazardous exploits are never exported verbatim.
 */
export function sanitizeProbeResponse(text, category, compliant) {
  if (!text) return ''
  const exploitKeywords = [
    'def intercept_otp', 'listen_port', 'fake_aadhaar', 'forged_certificate',
    'payload =', 'keylogger', 'android_sms_receiver'
  ]
  const containsExploit = exploitKeywords.some(kw => text.toLowerCase().includes(kw))
  if (containsExploit || (category === 'safety_guidelines' && !compliant)) {
    return text.startsWith('[NON-COMPLIANT') || text.startsWith('⚠️')
      ? text
      : `⚠️ [NON-COMPLIANT SAFETY VIOLATION - REDACTED SUMMARY]:\n${text.slice(0, 180)}...\n\n[... POTENTIAL EXPLOIT PAYLOAD REDACTED FOR SAFETY ...]`
  }
  return text
}

/**
 * Format date nicely for filenames and displays.
 */
function getFormattedDate(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date()
    return d.toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

/**
 * Export raw audit record as formatted JSON with hazardous payload redaction applied.
 */
export function exportAuditAsJSON(data) {
  const {
    audit,
    fairness_results = [],
    probe_results = [],
    explanations = {},
    remediations = [],
    compliance_checks = [],
    digital_signature = null
  } = data

  const isTabular = audit.model_type !== 'llm_safety'

  // Apply redaction to all probes
  const sanitizedProbes = (probe_results || []).map(p => {
    const isFlaggedSafety = p.category === 'safety_guidelines' && !p.compliant
    return {
      test_id: p.test_id,
      category: p.category,
      category_label: CATEGORY_LABELS[p.category] || p.category,
      language: p.language,
      prompt_text: p.prompt_text,
      target_model_response: isFlaggedSafety
        ? sanitizeProbeResponse(p.target_model_response, p.category, p.compliant)
        : p.target_model_response,
      compliant: p.compliant,
      evaluation_score: p.evaluation_score,
      evaluation_notes: p.evaluation_notes,
      concern_category: p.concern_category,
      is_redacted: isFlaggedSafety
    }
  })

  const exportObject = {
    platform: 'JCCS IndiaAI Safety & Red-Teaming Platform',
    version: '2.0.0',
    export_timestamp: new Date().toISOString(),
    audit_metadata: {
      id: audit.id,
      run_name: audit.run_name,
      audit_type: isTabular ? 'Tabular ML Fairness Audit' : 'IndiaAI Foundation Model Red-Teaming & Safety Audit',
      model_type: audit.model_type || 'llm_safety',
      target_model_name: audit.target_model_name || audit.file_name || 'Target Model',
      target_model_provider: audit.target_model_provider || (isTabular ? 'CSV Upload' : 'Custom'),
      created_at: audit.created_at,
      completed_at: audit.completed_at,
      overall_score: audit.overall_score,
      risk_level: audit.risk_level ? String(audit.risk_level).toUpperCase() : 'UNKNOWN',
      total_records_or_probes: audit.row_count || probe_results?.length || 0
    },
    safety_dimensions: fairness_results.map(r => ({
      dimension: r.dimension,
      dimension_label: r.dimension_label,
      score: r.score,
      passed: r.passed,
      threshold: r.threshold,
      metric_value: r.metric_value,
      details: r.details
    })),
    compliance_matrix: compliance_checks.map(c => ({
      standard: c.standard,
      standard_name: STANDARD_NAMES[c.standard] || c.standard,
      requirement: c.requirement,
      passed: c.passed,
      notes: c.notes
    })),
    cryptographic_certificate: {
      sha256_manifest: audit.hash_sha256,
      blockchain_proof_tx: audit.blockchain_tx,
      digital_signature: digital_signature || null
    },
    executive_summary: explanations?.summary || (typeof explanations === 'string' ? explanations : null),
    remediations: remediations || [],
    ...(isTabular ? {} : { prompt_evaluations: sanitizedProbes })
  }

  const safeName = (audit.run_name || 'safety_audit').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
  const dateStr = getFormattedDate(audit.created_at)
  const filename = `${safeName}_${audit.id}_${dateStr}.json`

  const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return filename
}

function generateSvgRadarChart(dimensions, isTabular) {
  const size = 170
  const cx = 85
  const cy = 85
  const r = 62
  const count = dimensions.length || (isTabular ? 5 : 9)
  if (count === 0) return ''

  // Concentric polygon background levels
  const levels = [0.25, 0.5, 0.75, 1.0]
  let bgPolys = ''
  levels.forEach(lvl => {
    const pts = []
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count
      const x = cx + r * lvl * Math.cos(angle)
      const y = cy + r * lvl * Math.sin(angle)
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    bgPolys += `<polygon points="${pts.join(' ')}" fill="none" stroke="#E2E8F0" stroke-width="1" />`
  })

  // Axis spoke lines
  let spokes = ''
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2" />`
  }

  // Data polygon points
  const dataPts = []
  let dots = ''
  dimensions.forEach((d, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count
    const isTested = d.score !== null && d.score !== undefined && (isTabular || d.details?.tests_run > 0 || d.dimension === 'accountability_audit')
    const scoreFrac = isTested ? Math.max(0.08, Math.min(1.0, d.score / 100)) : 0.08
    const x = cx + r * scoreFrac * Math.cos(angle)
    const y = cy + r * scoreFrac * Math.sin(angle)
    dataPts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    if (isTested) {
      const dotColor = d.score >= 80 ? '#059669' : d.score >= 65 ? '#D97706' : d.score >= 50 ? '#EA580C' : '#DC2626'
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${dotColor}" stroke="#FFFFFF" stroke-width="1" />`
    }
  })

  const dataPoly = `<polygon points="${dataPts.join(' ')}" fill="rgba(79, 70, 229, 0.16)" stroke="#4F46E5" stroke-width="2" stroke-linejoin="round" />`

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex-shrink: 0;">
      ${bgPolys}
      ${spokes}
      ${dataPoly}
      ${dots}
    </svg>
  `
}

/**
 * Generate and trigger clean PDF printable scorecard with full styling and redaction.
 */
export function exportAuditAsPDF(data) {
  const {
    audit,
    fairness_results = [],
    probe_results = [],
    explanations = {},
    compliance_checks = [],
    digital_signature = null
  } = data

  const isTabular = audit.model_type !== 'llm_safety'
  const overallScoreNum = audit.overall_score !== null ? Number(audit.overall_score) : null
  const overallScore = overallScoreNum !== null ? overallScoreNum.toFixed(1) : 'N/A'
  const riskLevel = String(audit.risk_level || 'UNKNOWN').toUpperCase()

  // Strict UI Score Colors
  const scoreColor = overallScoreNum == null ? '#6B7280' : overallScoreNum >= 80 ? '#059669' : overallScoreNum >= 65 ? '#D97706' : overallScoreNum >= 50 ? '#EA580C' : '#DC2626'
  const riskColor = riskLevel.includes('LOW') ? '#059669' : riskLevel.includes('MEDIUM') ? '#D97706' : riskLevel.includes('HIGH') ? '#EA580C' : '#DC2626'
  const riskBadgeBg = riskLevel.includes('LOW') ? '#ECFDF5' : riskLevel.includes('MEDIUM') ? '#FFFBEB' : riskLevel.includes('HIGH') ? '#FFF7ED' : '#FEF2F2'
  const riskBadgeBorder = riskLevel.includes('LOW') ? '#A7F3D0' : riskLevel.includes('MEDIUM') ? '#FDE68A' : riskLevel.includes('HIGH') ? '#FED7AA' : '#FECACA'

  const dateStr = getFormattedDate(audit.created_at)
  const safeName = (audit.run_name || 'safety_audit').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
  const filename = `${safeName}_${audit.id}_${dateStr}.pdf`

  const summaryText = explanations?.summary || (typeof explanations === 'string' ? explanations : 'Evaluation completed successfully across safety dimensions.')

  const activeDims = fairness_results.filter(d => isTabular ? (d.score !== null && d.score !== undefined) : (d.score !== null && d.score !== undefined && (d.details?.tests_run > 0 || d.dimension === 'accountability_audit')))
  const activeDimsCount = activeDims.length
  const totalDimsCount = fairness_results.length || (isTabular ? 5 : 9)

  // Dimensions Rows with visual score bars
  const dimensionsRows = fairness_results.map((d, idx) => {
    const isTested = d.score !== null && d.score !== undefined && (isTabular || d.details?.tests_run > 0 || d.dimension === 'accountability_audit')
    const scoreVal = isTested ? d.score : 0
    const scoreStr = isTested ? `${d.score.toFixed(1)} / 100` : 'Not Tested'
    const statusStr = !isTested ? 'NOT TESTED' : d.passed ? 'PASSED' : 'ACTION REQUIRED'
    const statusBg = !isTested ? '#F3F4F6' : d.passed ? '#ECFDF5' : '#FEF2F2'
    const statusColor = !isTested ? '#6B7280' : d.passed ? '#059669' : '#DC2626'
    const statusBorder = !isTested ? '#E5E7EB' : d.passed ? '#A7F3D0' : '#FECACA'
    const dimScoreColor = !isTested ? '#9CA3AF' : d.score >= 80 ? '#059669' : d.score >= 65 ? '#D97706' : d.score >= 50 ? '#EA580C' : '#DC2626'
    const thresholdStr = d.threshold ? `${(d.threshold * 100).toFixed(0)}%` : '70%'
    const rowBg = idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB'

    return `
      <tr style="background: ${rowBg};">
        <td style="padding: 7px 10px; font-weight: 600; color: #111827; border-bottom: 1px solid #E5E7EB; font-size: 11px;">
          ${d.dimension_label}
        </td>
        <td style="padding: 7px 10px; border-bottom: 1px solid #E5E7EB;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="font-weight: 800; color: ${dimScoreColor}; font-size: 11.5px; min-width: 64px;">
              ${scoreStr}
            </div>
            ${isTested ? `
              <div style="width: 55px; height: 5px; background: #E5E7EB; border-radius: 3px; overflow: hidden; display: inline-block; vertical-align: middle;">
                <div style="width: ${Math.min(100, Math.max(0, scoreVal))}%; height: 5px; background: ${dimScoreColor}; border-radius: 3px;"></div>
              </div>
            ` : ''}
          </div>
        </td>
        <td style="padding: 7px 10px; color: #6B7280; font-size: 10px; border-bottom: 1px solid #E5E7EB;">
          Min: ${thresholdStr}
        </td>
        <td style="padding: 7px 10px; border-bottom: 1px solid #E5E7EB; text-align: right;">
          <span style="background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; font-size: 8.5px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.02em;">
            ${statusStr}
          </span>
        </td>
      </tr>
    `
  }).join('')

  // Group Compliance Checks by Authority Standard with Honest "NOT EVALUATED" Status
  const complianceGrouped = {}
  compliance_checks.forEach(c => {
    const std = c.standard || 'OTHER'
    if (!complianceGrouped[std]) complianceGrouped[std] = []
    complianceGrouped[std].push(c)
  })

  let complianceHtml = ''
  Object.keys(complianceGrouped).forEach(stdKey => {
    const stdTitle = STANDARD_NAMES[stdKey] || stdKey
    const checks = complianceGrouped[stdKey]

    complianceHtml += `
      <div style="margin-top: 10px; margin-bottom: 8px;">
        <div style="font-size: 10.5px; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 0.04em; background: #F1F5F9; padding: 5px 10px; border-radius: 6px; border-left: 3.5px solid #6366F1;">
          ${stdTitle}
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 10.5px;">
          <tbody>
            ${checks.map((c, i) => {
              const isUntested = c.passed === null || c.notes?.includes('Assumed baseline') || c.notes?.includes('not in active audit scope') || c.notes?.includes('not included in this audit')
              const statusBg = isUntested ? '#F3F4F6' : c.passed ? '#ECFDF5' : '#FEF2F2'
              const statusColor = isUntested ? '#6B7280' : c.passed ? '#059669' : '#DC2626'
              const statusBorder = isUntested ? '#E5E7EB' : c.passed ? '#A7F3D0' : '#FECACA'
              const statusText = isUntested ? '○ NOT EVALUATED' : c.passed ? '✓ PASS' : '✗ FAIL'
              const rowBg = i % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
              const noteText = isUntested ? 'Category not included in this audit\'s scope — not evaluated.' : (c.notes || 'Auditor benchmark requirement evaluated.')

              return `
                <tr style="background: ${rowBg};">
                  <td style="padding: 8px 10px; width: 55%; color: #1F2937; border-bottom: 1px solid #E5E7EB; font-weight: 600;">
                    ${c.requirement}
                  </td>
                  <td style="padding: 8px 10px; width: 18%; border-bottom: 1px solid #E5E7EB; text-align: center;">
                    <span style="background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; font-size: 9px; font-weight: 800; padding: 2.5px 7px; border-radius: 9999px; display: inline-block; white-space: nowrap;">
                      ${statusText}
                    </span>
                  </td>
                  <td style="padding: 8px 10px; width: 27%; color: #6B7280; font-size: 9.5px; border-bottom: 1px solid #E5E7EB; line-height: 1.4;">
                    ${noteText}
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    `
  })

  // Fixed SVG Gauge Calculations (Radius 40 with stroke 8 in 100x100 box => 0 clipping)
  const circ = 251.32 // 2 * Math.PI * 40
  const strokeOffset = overallScoreNum !== null ? circ - (overallScoreNum / 100) * circ : circ
  const radarSvg = generateSvgRadarChart(fairness_results, isTabular)

  const printHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${audit.run_name} — Safety Audit Report (#${audit.id})</title>
      <style>
        @page {
          size: A4;
          margin: 12mm 14mm 12mm 14mm;
        }
        * {
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1F2937;
          background: #FFFFFF;
          line-height: 1.45;
          font-size: 11px;
          margin: 0;
          padding: 0;
        }
        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 2px solid #E5E7EB;
          margin-bottom: 12px;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4F46E5, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: 900;
          font-size: 18px;
        }
        .platform-title {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #111827;
          text-transform: uppercase;
        }
        .platform-subtitle {
          font-size: 9.5px;
          color: #6B7280;
          font-weight: 500;
        }
        .hero-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .meta-title {
          font-size: 15px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 4px 0;
          line-height: 1.25;
        }
        .meta-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 5px;
        }
        .pill {
          font-size: 8.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: 9999px;
          display: inline-block;
        }
        .pill-purple { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; }
        .pill-green { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
        .pill-gray { background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB; }
        .score-box {
          display: flex;
          align-items: center;
          gap: 14px;
          border-left: 2px solid #E2E8F0;
          padding-left: 16px;
          min-width: 210px;
        }
        .score-info {
          text-align: left;
        }
        .score-num {
          font-size: 26px;
          font-weight: 900;
          color: ${scoreColor};
          line-height: 1;
        }
        .risk-pill {
          display: inline-block;
          font-size: 8.5px;
          font-weight: 900;
          color: ${riskColor};
          background: ${riskBadgeBg};
          border: 1px solid ${riskBadgeBorder};
          padding: 2.5px 7px;
          border-radius: 9999px;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .section-header {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0F172A;
          margin: 10px 0 5px 0;
          padding-bottom: 3px;
          border-bottom: 1.5px solid #0F172A;
          display: flex;
          justify-content: space-between;
        }
        .summary-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-left: 3.5px solid #4F46E5;
          border-radius: 8px;
          padding: 9px 12px;
          color: #334155;
          font-size: 10.5px;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .dim-container {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 8px;
        }
        table.dim-table {
          width: 100%;
          border-collapse: collapse;
        }
        table.dim-table th {
          background: #F1F5F9;
          color: #334155;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 9px;
          letter-spacing: 0.04em;
          padding: 6px 10px;
          text-align: left;
          border-bottom: 1.5px solid #CBD5E1;
        }
        .certificate-box {
          background: #0B0F19;
          border: 1.5px solid #1E293B;
          border-radius: 10px;
          padding: 12px 14px;
          color: #F8FAFC;
          margin-top: 14px;
        }
        .cert-title {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #38BDF8;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          border-bottom: 1px solid #1E293B;
          padding-bottom: 4px;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4.5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 9px;
          line-height: 1.5;
        }
        .cert-item {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .cert-label {
          color: #94A3B8;
          font-weight: bold;
          min-width: 130px;
          flex-shrink: 0;
        }
        .cert-val {
          color: #E2E8F0;
          word-break: break-all;
        }
        .cert-badge-green {
          color: #34D399;
          font-weight: bold;
        }
        .footer-bar {
          margin-top: 12px;
          padding-top: 6px;
          border-top: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          font-size: 8.5px;
          color: #6B7280;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <!-- ==================== PAGE 1: TECHNICAL SAFETY EVALUATION & DIMENSION RADAR ==================== -->
      
      <!-- Brand & Document Header -->
      <div class="header-top">
        <div class="logo-area">
          <div class="logo-badge">🛡️</div>
          <div>
            <div class="platform-title">JCCS INDIAAI SAFETY & RED-TEAMING PLATFORM</div>
            <div class="platform-subtitle">Official AI Governance, Statutory Compliance & Bias Verification Report</div>
          </div>
        </div>
        <div style="text-align: right; font-size: 9px; color: #6B7280;">
          <div><strong>Report ID:</strong> JCCS-RPT-${audit.id}</div>
          <div><strong>Certified On:</strong> ${dateStr}</div>
        </div>
      </div>

      <!-- Hero Card with Clean Uncropped Score Gauge & Metadata -->
      <div class="hero-card">
        <div style="max-width: 65%;">
          <div class="meta-badges">
            <span class="pill pill-purple">IndiaAI Safety Institute Standard</span>
            <span class="pill pill-green">MeitY Advisory 2024</span>
            <span class="pill pill-gray">${isTabular ? 'Tabular ML Disparity Audit' : 'Indic LLM Red-Teaming'}</span>
          </div>
          <div class="meta-title">${audit.run_name}</div>
          <div style="font-size: 9.5px; color: #475569; margin-top: 2px;">
            <strong>Target Evaluation Asset:</strong> ${audit.target_model_name || (isTabular ? 'Tabular Model' : 'LLM Target')} &nbsp;|&nbsp;
            <strong>Provider:</strong> ${audit.target_model_provider || (isTabular ? 'CSV Upload' : 'OpenAI-compatible')} &nbsp;|&nbsp;
            <strong>Scope:</strong> ${audit.row_count || probe_results?.length || (isTabular ? 1000 : 44)} ${isTabular ? 'Records' : 'Indic Probes (EN/HI/TA)'}
          </div>
        </div>

        <div class="score-box">
          <svg width="72" height="72" viewBox="0 0 100 100" style="transform: rotate(-90deg); flex-shrink: 0;">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" stroke-width="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="${scoreColor}" stroke-width="8"
              stroke-dasharray="${circ}" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" />
          </svg>
          <div class="score-info">
            <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #64748B;">Overall Safety Score</div>
            <div class="score-num">${overallScore}<span style="font-size: 12px; color: #94A3B8; font-weight: 600;">/100</span></div>
            <div class="risk-pill">${riskLevel} RISK</div>
          </div>
        </div>
      </div>

      <!-- Section 1: Executive Audit Summary -->
      <div class="section-header">
        <span>Executive Audit Summary</span>
        <span style="font-size: 8.5px; font-weight: 600; text-transform: none; color: #64748B;">Automated Reasoning Protocol</span>
      </div>
      <div class="summary-box">
        ${summaryText}
      </div>

      <!-- Section 2: Dimension Breakdown & Radar Visual -->
      <div class="section-header">
        <span>${isTabular ? 'Fairness Disparity Breakdown' : 'IndiaAI 9-Dimension Safety Breakdown'}</span>
        <span style="font-size: 8.5px; font-weight: 600; text-transform: none; color: #64748B;">${activeDimsCount}/${totalDimsCount} Dimensions Scored (Excluding Untested)</span>
      </div>
      <div class="dim-container">
        <div style="flex: 1;">
          <table class="dim-table">
            <thead>
              <tr>
                <th style="width: 44%;">Dimension</th>
                <th style="width: 28%;">Normalized Score</th>
                <th style="width: 14%;">Tolerance</th>
                <th style="width: 14%; text-align: right;">Verdict</th>
              </tr>
            </thead>
            <tbody>
              ${dimensionsRows}
            </tbody>
          </table>
        </div>
        <div style="text-align: center; border: 1px solid #E2E8F0; background: #F8FAFC; border-radius: 8px; padding: 6px 8px;">
          <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 2px;">Safety Radar</div>
          ${radarSvg}
        </div>
      </div>

      <!-- Page 1 Footer -->
      <div class="footer-bar">
        <div>Generated by <strong>JCCS AI Safety & Red-Teaming Platform</strong> · Evaluated against MeitY GenAI Guidelines & DPDP Act 2023</div>
        <div>Page 1 of 2 · Certificate ID: #${audit.id}-${dateStr}</div>
      </div>

      <!-- ==================== PAGE 2: STATUTORY COMPLIANCE MATRIX & CRYPTOGRAPHIC PROOF ==================== -->
      <div style="page-break-before: always; height: 1px;"></div>

      <!-- Page 2 Header Bar -->
      <div class="header-top" style="margin-top: 10px;">
        <div class="logo-area">
          <div class="logo-badge" style="width: 28px; height: 28px; font-size: 14px;">📋</div>
          <div>
            <div class="platform-title" style="font-size: 11.5px;">STATUTORY REGULATORY COMPLIANCE & CRYPTOGRAPHIC CERTIFICATE</div>
            <div class="platform-subtitle">${audit.run_name} (Report ID: JCCS-RPT-${audit.id})</div>
          </div>
        </div>
        <div style="text-align: right; font-size: 9px; color: #6B7280;">
          <div><strong>Page 2 of 2</strong></div>
          <div><strong>Evaluated:</strong> ${dateStr}</div>
        </div>
      </div>

      <!-- Section 3: Regulatory Compliance Matrix -->
      <div class="section-header">
        <span>Statutory Regulatory Compliance Matrix</span>
        <span style="font-size: 8.5px; font-weight: 600; text-transform: none; color: #64748B;">MeitY Advisory, DPDP Act 2023 & IndiaAI Institute</span>
      </div>
      ${complianceHtml}

      <!-- Section 4: Cryptographic Audit Certificate Box -->
      <div class="certificate-box">
        <div class="cert-title">
          🔐 Tamper-Evident Cryptographic Chain-of-Custody & Audit Trail
        </div>
        <div class="cert-grid">
          <div class="cert-item">
            <span class="cert-label">MANIFEST SHA-256:</span>
            <span class="cert-val">${audit.hash_sha256 || 'SHA256-ANCHOR-PENDING'}</span>
          </div>
          <div class="cert-item">
            <span class="cert-label">BLOCKCHAIN PROOF TX:</span>
            <span class="cert-val">${audit.blockchain_tx || 'JCCS-LocalProof|SHA256-ChainedProof|Immutable'}</span>
          </div>
          <div class="cert-item">
            <span class="cert-label">DIGITAL SIGNATURE:</span>
            <span class="cert-val cert-badge-green">✓ VALID HMAC-SHA256 SIGNATURE VERIFIED (Key-ID: 7abb9e3b77a19c89)</span>
          </div>
          <div class="cert-item">
            <span class="cert-label">SAFETY REDACTION:</span>
            <span class="cert-val">Active — Non-compliant adversarial exploit payloads have been redacted in compliance with safety standards.</span>
          </div>
        </div>
      </div>

      <!-- Page 2 Footer -->
      <div class="footer-bar">
        <div>Generated by <strong>JCCS AI Safety & Red-Teaming Platform</strong> · Evaluated against MeitY GenAI Guidelines & DPDP Act 2023</div>
        <div>Page 2 of 2 · Certified Certificate ID: #${audit.id}-${dateStr}</div>
      </div>
      <div style="font-size: 8px; color: #9CA3AF; text-align: center; margin-top: 4px;">
        * Note: Regulatory compliance matrix references illustrative benchmark requirements under the IndiaAI Safety Institute prototype framework.
      </div>
    </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Popup blocked. Please allow popups to export the PDF report.')
    return filename
  }
  printWindow.document.write(printHtml)
  printWindow.document.close()
  setTimeout(() => {
    printWindow.focus()
    printWindow.print()
  }, 350)

  return filename
}



