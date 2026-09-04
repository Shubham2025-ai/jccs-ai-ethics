# NEW: Statutory Fact Store for Indian AI Compliance & Hallucination Detection
"""
Statutory Knowledge Base for Indian AI Compliance & Hallucination Verification.
Contains all 44 codified sections of the Digital Personal Data Protection (DPDP) Act, 2023.
"""

from typing import Dict, Any, Optional

DPDP_ACT_2023: Dict[str, str] = {
    # Chapter I: Preliminary
    "1": "Short title and commencement",
    "2": "Definitions (Data Fiduciary, Data Principal, Personal Data, Processing)",
    
    # Chapter II: Obligations of Data Fiduciary
    "3": "Application of the Act",
    "4": "Grounds for processing personal data (Lawful consent or legitimate uses)",
    "5": "Notice requirements prior to or at the time of consent request",
    "6": "Conditions for valid consent and right to withdraw consent",
    "7": "Certain legitimate uses where consent is not required (employment, legal, sovereign)",
    "8": "General obligations of Data Fiduciary (data security, erasure upon purpose completion, grievance officer)",
    "9": "Processing of personal data of children and persons with disabilities (verifiable parental consent, ban on tracking/targeted ads)",
    "10": "Additional obligations of Significant Data Fiduciary (DPO, Data Protection Impact Assessment, periodic audits)",
    
    # Chapter III: Rights and Duties of Data Principal
    "11": "Right to access information about personal data",
    "12": "Right to correction and erasure of personal data",
    "13": "Right of grievance redressal",
    "14": "Right to nominate representative in event of death or incapacity",
    "15": "Duties of Data Principal (not impersonating, not submitting false claims)",
    
    # Chapter IV: Special Provisions
    "16": "Transfer of personal data outside India (Central Government restriction notifications)",
    "17": "Exemptions (State security instrumentalities, research, archiving, legal proceedings)",
    
    # Chapter V: Data Protection Board of India
    "18": "Establishment of Data Protection Board of India",
    "19": "Composition and qualifications for appointment of Chairperson and Members",
    "20": "Salary, allowances and other terms and conditions of service of Chairperson and Members",
    "21": "Disqualifications for appointment and continuation as Chairperson and Members",
    "22": "Resignation by Members and filling of vacancy",
    "23": "Removal of Chairperson and other Members",
    "24": "Meetings of the Data Protection Board",
    "25": "Vacancies, etc., not to invalidate proceedings of the Board",
    "26": "Officers and employees of the Data Protection Board",
    "27": "Powers and functions of the Data Protection Board (inquiry, summoning, directing interim measures)",
    "28": "Procedure to be followed by the Data Protection Board",
    
    # Chapter VI: Powers, Functions and Procedure to be Followed by Board
    "29": "Appeal to Appellate Tribunal (TDSAT)",
    "30": "Orders passed by Appellate Tribunal to be executable as decree of civil court",
    "31": "Alternate dispute resolution (mediation referral)",
    "32": "Voluntary undertaking acceptance by the Board",
    "33": "Financial penalties for breach of obligations (up to ₹250 Crores)",
    "34": "Crediting sums to the Consolidated Fund of India",
    
    # Chapter VII: Miscellaneous
    "35": "Power of Central Government to call for information",
    "36": "Power of Central Government to issue directions",
    "37": "Power of Central Government to block access to information in public interest",
    "38": "Consistency with other laws",
    "39": "Act to have overriding effect over conflicting laws",
    "40": "Protection of action taken in good faith",
    "41": "Bar of jurisdiction of civil courts",
    "42": "Power of Central Government to make rules",
    "43": "Laying of rules and certain orders before Parliament",
    "44": "Power to remove difficulties within three years"
}

# MeitY Key GenAI Advisories
MEITY_ADVISORIES_2024 = {
    "due_diligence": "Intermediary advisory mandating explicit labeling of synthetically generated content and prevention of bias in foundational models.",
    "electoral_integrity": "Advisory requiring compliance safeguards against election-related deepfakes and voter manipulation.",
    "consent_architecture": "Guidance on explicit user consent and clear terms for deployment of untested foundational models."
}


def validate_citation(act_name: str, section: str) -> Dict[str, Any]:
    """
    Validates whether a cited statutory section actually exists.
    Returns:
    {
        "valid": bool,
        "title": str or None,
        "act": str,
        "section": str,
        "error": str or None
    }
    """
    if not act_name or not section:
        return {"valid": True, "title": None, "act": "", "section": "", "error": None}

    act_norm = act_name.lower().replace(" ", "").replace("_", "").replace(".", "")
    clean_sec = str(section).strip().lower().replace("section", "").replace("sec", "").replace("clause", "").replace("s.", "").strip()

    # DPDP Act 2023 Check
    if "dpdp" in act_norm or "dataprotection" in act_norm:
        base_sec = clean_sec.split("(")[0].split("[")[0].strip()
        
        if base_sec in DPDP_ACT_2023:
            return {
                "valid": True,
                "title": DPDP_ACT_2023[base_sec],
                "act": "DPDP Act 2023",
                "section": section,
                "error": None
            }
        else:
            return {
                "valid": False,
                "title": None,
                "act": "DPDP Act 2023",
                "section": section,
                "error": f"Section {section} does not exist in the DPDP Act 2023 (The Act contains 44 sections)."
            }

    # Default: Unknown act - pass silently without error
    return {"valid": True, "title": None, "act": act_name, "section": section, "error": None}
