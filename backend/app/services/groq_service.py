"""
AI Explanation Service — Uses Groq (FREE) with Llama 3
Get free API key at: https://console.groq.com
"""
import re
from groq import Groq
from typing import List, Dict
from app.core.config import settings


def get_client():
    return Groq(api_key=settings.GROQ_API_KEY)


def _ask_groq(prompt: str, max_tokens: int = 400) -> str:
    """Helper — sends prompt to Groq Llama 3 and returns response text."""
    try:
        client = get_client()
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",   # Free Groq model (stable)
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.5
        )
        text = response.choices[0].message.content.strip()
        # Strip markdown formatting that renders as literal text in PDF/UI
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)   # **bold** → plain
        text = re.sub(r'\*(.*?)\*', r'\1', text)         # *italic* → plain
        text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)   # ## headers
        text = re.sub(r'^[-•]\s+', '', text, flags=re.MULTILINE) # bullet points
        return text.strip()
    except Exception as e:
        return None  # Fallback handled by each function


def generate_summary_explanation(
    fairness_results: List[Dict],
    overall_score: float,
    risk_level: str,
    run_name: str
) -> str:
    """Generate executive summary of the audit in plain language."""
    failed = [r for r in fairness_results if not r["passed"]]
    passed = [r for r in fairness_results if r["passed"]]

    prompt = f"""You are an AI ethics expert. Analyze this AI bias audit and write a plain-language summary 
a non-technical executive can understand. Be specific about what was found.

AUDIT: {run_name}
OVERALL ETHICS SCORE: {overall_score}/100
RISK LEVEL: {risk_level.upper()}

DIMENSIONS PASSED ({len(passed)}): {', '.join([r['dimension_label'] for r in passed])}

DIMENSIONS FAILED ({len(failed)}):
{chr(10).join([f"- {r['dimension_label']}: Score {r['score']}/100, Disparity: {r['metric_value']}" for r in failed])}

Write exactly 3 short paragraphs:
1. What the overall score means in plain terms
2. Key bias issues found (if any) — which groups are affected
3. Whether this model is ready for deployment

Keep it under 180 words. Be direct. Do not use markdown formatting like **bold** or ## headers."""

    result = _ask_groq(prompt, 400)
    if result:
        return result

    # Fallback template
    failed_dims = [r['dimension_label'] for r in failed]
    if failed_dims:
        return (
            f"This AI model scored {overall_score:.0f}/100 on our ethics audit, indicating a {risk_level} risk level. "
            f"The score reflects how fairly the model treats different demographic groups across 6 key dimensions.\n\n"
            f"Issues were detected in: {', '.join(failed_dims)}. These dimensions failed to meet the fairness "
            f"threshold, meaning the model may be treating certain demographic groups unequally in ways that could lead to discriminatory outcomes.\n\n"
            f"This model requires bias remediation before it can be safely deployed. "
            f"Review the Remediation tab for specific, actionable fixes."
        )
    return (
        f"This AI model scored {overall_score:.0f}/100 on our ethics audit, indicating a {risk_level} risk level.\n\n"
        f"All {len(passed)} fairness dimensions passed their thresholds. The model appears to treat demographic "
        f"groups equitably based on the data provided.\n\n"
        f"This model is cleared for deployment from a fairness perspective. Continue monitoring for drift over time."
    )


def generate_bias_finding(result: Dict, sensitive_attribute: str) -> str:
    """Generate specific bias finding for a failed dimension."""
    prompt = f"""As an AI ethics expert, explain this bias finding in 2-3 sentences for a business audience.

FAIRNESS DIMENSION: {result['dimension_label']}
SCORE: {result['score']}/100 (FAILED)
SENSITIVE ATTRIBUTE: {sensitive_attribute}
DISPARITY VALUE: {result['metric_value']} (max allowed: {result['threshold']})

Explain:
1. What this bias means in real-world terms (hiring/loan/healthcare context)
2. Who is being disadvantaged
3. Why this is a serious problem

Be specific and non-technical. No jargon. Do not use markdown formatting."""

    result_text = _ask_groq(prompt, 200)
    if result_text:
        return result_text

    return (
        f"{result['dimension_label']} failed with a disparity of {result['metric_value']:.3f} on "
        f"the '{sensitive_attribute}' attribute (threshold: {result['threshold']}). "
        f"This means the model is treating demographic groups differently beyond acceptable limits. "
        f"Certain groups are receiving unfavorable outcomes at a significantly higher rate than others, "
        f"posing legal and ethical risks that must be addressed before deployment."
    )


def generate_remediation_explanation(remediations: List[Dict]) -> str:
    """Generate plain-language remediation action plan."""
    if not remediations:
        return "No remediations required. The model passed all fairness checks and is ready for deployment."

    high = [r for r in remediations if r.get("priority") == "high"]
    medium = [r for r in remediations if r.get("priority") == "medium"]

    prompt = f"""As an AI ethics consultant, write a brief action plan for fixing these AI bias issues.

HIGH PRIORITY FIXES ({len(high)}):
{chr(10).join([f"- {r['dimension']}: {r['suggestion'][:120]}..." for r in high[:2]])}

MEDIUM PRIORITY ({len(medium)}):
{chr(10).join([f"- {r['dimension']}: est. {r['estimated_bias_reduction']}% bias reduction" for r in medium[:2]])}

Write a 3-5 sentence action plan that:
1. Prioritizes the most critical fix first  
2. Explains the approach in business terms
3. Sets realistic expectations on accuracy vs fairness trade-offs

Keep it under 130 words. Do not use markdown formatting like **bold** or bullet points."""

    result = _ask_groq(prompt, 250)
    if result:
        return result

    return (
        f"We identified {len(remediations)} bias issues requiring attention, with {len(high)} high-priority fixes. "
        f"Start immediately with reweighing training data to balance demographic representation — "
        f"this is the highest-impact change, estimated to reduce bias by 50-60%. "
        f"Next, apply threshold optimization per demographic group to equalize true positive rates. "
        f"These changes are estimated to reduce overall bias by 55-65% with a minimal accuracy trade-off of 1-3%. "
        f"Rerun this audit after applying fixes to verify improvement."
    )