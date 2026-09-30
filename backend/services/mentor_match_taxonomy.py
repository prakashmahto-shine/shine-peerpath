import re
from typing import Optional, List, Tuple
from backend.data.company_tiers import SP500_COMPANIES, INDIAN_UNICORN_COMPANIES, NSE_LISTED_COMPANIES

SUPPORTED_DOMAINS = [
    'AI/ML',
    'Semiconductor',
    'Cybersecurity',
    'Full-Stack',
    'Product Management',
    'Search & Data Infra',
    'SaaS Sales',
    'Marketing'
]

def normalize_domain(domain: Optional[str]) -> Optional[str]:
    if not domain:
        return None
    clean = domain.lower().strip().replace('-', ' ').replace('_', ' ').replace('/', ' ')
    if 'ai' in clean or 'ml' in clean or 'genai' in clean or 'machine learning' in clean:
        return 'AI/ML'
    if 'semi' in clean or 'vlsi' in clean or 'silicon' in clean or 'chip' in clean:
        return 'Semiconductor'
    if 'cyber' in clean or 'security' in clean:
        return 'Cybersecurity'
    if 'product' in clean or clean == 'pm':
        return 'Product Management'
    if 'search' in clean or 'solr' in clean or 'data infra' in clean or 'lucene' in clean:
        return 'Search & Data Infra'
    if 'front' in clean or 'back' in clean or 'full stack' in clean or 'arch' in clean or 'web' in clean:
        return 'Full-Stack'
    if 'sales' in clean or 'gtm' in clean or 'bd' in clean:
        return 'SaaS Sales'
    if 'market' in clean or 'growth' in clean:
        return 'Marketing'
    return None

def is_supported_domain(domain: Optional[str]) -> bool:
    if not domain:
        return False
    if any(d.lower() == domain.lower() for d in SUPPORTED_DOMAINS):
        return True
    return normalize_domain(domain) is not None

ROLE_FAMILY_KEYWORDS: List[Tuple[str, List[str]]] = [
    ('CHIP', ['vlsi', 'rtl', 'physical design', 'semiconductor', 'asic', 'fpga', 'silicon', 'soc architect', 'soc design', 'chip']),
    ('SECURITY', ['security', 'pentest', 'penetration test', 'appsec', 'application security', 'threat', 'soc analyst', 'soc monitoring', 'vulnerability', 'devsecops', 'incident response']),
    ('ML', ['ml', 'ai', 'machine learning', 'data scientist', 'mlops', 'nlp', 'genai', 'gen ai', 'deep learning', 'computer vision']),
    ('DEVOPS', ['devops', 'sre', 'site reliability', 'cloud engineer', 'cloud architect', 'infra eng', 'infrastructure engineer', 'platform architect']),
    ('DATA', ['data engineer', 'analytics eng', 'bi engineer', 'bi analyst', 'business intelligence', 'data analyst', 'search architect', 'solr', 'lucene']),
    ('PRODUCT', ['product manager', 'product management', 'apm', 'gpm', 'pm', 'product lead', 'product strategy', 'technical product manager']),
    ('MOBILE', ['mobile', 'android', 'ios', 'flutter']),
    ('QA', ['sdet', 'qa', 'quality engineer', 'test engineer']),
    ('FRONTEND', ['frontend', 'front-end', 'ui dev', 'react dev', 'full-stack', 'full stack', 'web developer']),
    ('BACKEND', ['backend', 'back-end', 'sde', 'software development engineer', 'software engineer', 'platform eng', 'java developer', 'python developer', 'java/python dev', 'associate software engineer']),
    ('SALES', ['sales', 'business development', 'account executive', 'account coordinator', 'bdr', 'sdr', 'gtm', 'revenue', 'telesales', 'inside sales']),
    ('MARKETING', ['marketing', 'brand', 'growth marketing', 'performance marketing', 'seo', 'sem', 'content strategy', 'social media', 'influencer'])
]

DOMAIN_FALLBACK_FAMILY = {
    'ai/ml': 'ML',
    'semiconductor': 'CHIP',
    'cybersecurity': 'SECURITY',
    'full-stack': 'BACKEND',
    'product management': 'PRODUCT',
    'search & data infra': 'DATA',
    'saas sales': 'SALES',
    'marketing': 'MARKETING'
}

def has_keyword(text: str, keyword: str) -> bool:
    escaped = re.escape(keyword)
    return bool(re.search(rf'\b{escaped}\b', text, re.IGNORECASE))

def classify_role_family(role_title: Optional[str], domain_hint: Optional[str] = None) -> Optional[str]:
    if not role_title:
        return None
    for family, keywords in ROLE_FAMILY_KEYWORDS:
        if any(has_keyword(role_title, k) for k in keywords):
            return family
    if domain_hint:
        norm = normalize_domain(domain_hint)
        key = (norm or domain_hint).lower()
        fallback = DOMAIN_FALLBACK_FAMILY.get(key)
        if fallback:
            return fallback
    return None

COMPANY_TIER_KEYWORDS: List[Tuple[str, List[str]]] = [
    ('TIER0_GLOBAL', [
        'google', 'amazon', 'microsoft', 'meta', 'apple',
        'nvidia', 'intel', 'qualcomm', 'texas instruments', 'amd', 'broadcom', 'micron',
        'analog devices', 'mediatek', 'synopsys', 'cadence',
        'palo alto networks', 'crowdstrike', 'cisco', 'fortinet', 'zscaler', 'mcafee',
        'ibm security', 'ibm', 'sophos', 'check point', 'adobe', 'salesforce', 'atlassian', 'uber', 'netflix'
    ]),
    ('TIER1_INDIA', ['flipkart', 'swiggy', 'meesho', 'zepto', 'groww', 'phonepe', 'razorpay', 'cred', 'zomato', 'myntra', 'postman', 'freshworks', 'zoho']),
    ('SERVICE', ['tcs', 'tata consultancy', 'infosys', 'wipro', 'hcl', 'cognizant', 'capgemini', 'tech mahindra', 'mindtree', 'ltimindtree', 'sasken', 'l&t technology', 'smartsoc', 'accenture'])
]

def normalize_company_name(value: Optional[str]) -> str:
    if not value:
        return ''
    cleaned = value.lower()
    cleaned = re.sub(r'\(.*?\)', ' ', cleaned)
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', cleaned)
    cleaned = re.sub(r'\b(inc|ltd|pvt|private|limited|technologies|technology|solutions|labs|systems|corporation|corp|india)\b', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def normalize_role_name(value: Optional[str]) -> str:
    if not value:
        return ''
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', value.lower())
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

SP500_SET = {normalize_company_name(n) for n in SP500_COMPANIES if normalize_company_name(n)}
INDIAN_UNICORN_SET = {normalize_company_name(n) for n in INDIAN_UNICORN_COMPANIES if normalize_company_name(n)}
NSE_LISTED_SET = {normalize_company_name(n) for n in NSE_LISTED_COMPANIES if normalize_company_name(n)}

def classify_company_tier(company_name: Optional[str]) -> str:
    if not company_name:
        return 'UNCLASSIFIED'
    lower = company_name.lower()
    for tier, keywords in COMPANY_TIER_KEYWORDS:
        if any(k in lower for k in keywords):
            return tier
    normalized = normalize_company_name(company_name)
    if not normalized:
        return 'UNCLASSIFIED'
    if normalized in SP500_SET:
        return 'TIER0_GLOBAL'
    if normalized in INDIAN_UNICORN_SET:
        return 'TIER1_INDIA'
    if normalized in NSE_LISTED_SET:
        return 'TIER2_LISTED'
    return 'UNCLASSIFIED'

def exact_company_match(a: Optional[str], b: Optional[str]) -> bool:
    na = normalize_company_name(a)
    nb = normalize_company_name(b)
    if not na or not nb:
        return False
    return na == nb or na in nb or nb in na

def exact_role_match(a: Optional[str], b: Optional[str]) -> bool:
    na = normalize_role_name(a)
    nb = normalize_role_name(b)
    return bool(na and na == nb)

def role_match_score(role_a: Optional[str], role_b: Optional[str], domain_a: Optional[str] = None, domain_b: Optional[str] = None, semantic_sim: Optional[float] = None) -> float:
    if not role_a or not role_b:
        return 0.3
    if exact_role_match(role_a, role_b):
        return 1.0
    fam_a = classify_role_family(role_a, domain_a)
    fam_b = classify_role_family(role_b, domain_b)
    base_score = 0.7 if (fam_a and fam_b and fam_a == fam_b) else 0.3
    if semantic_sim is not None and semantic_sim > 0:
        base_score = min(1.0, max(base_score, base_score * 0.4 + semantic_sim * 0.6))
    return round(base_score, 2)

def company_match_score(company_a: Optional[str], company_b: Optional[str]) -> float:
    if not company_a or not company_b:
        return 0.15
    if exact_company_match(company_a, company_b):
        return 1.0
    tier_a = classify_company_tier(company_a)
    tier_b = classify_company_tier(company_b)
    if tier_a == 'UNCLASSIFIED' or tier_b == 'UNCLASSIFIED':
        return 0.15
    if tier_a == tier_b:
        return 0.6
    return 0.3

def transition_match_score(
    candidate_origin_family: Optional[str],
    candidate_dest_family: Optional[str],
    mentor_origin_family: Optional[str],
    mentor_dest_family: Optional[str]
) -> float:
    cand_switched = bool(candidate_origin_family and candidate_dest_family and candidate_origin_family != candidate_dest_family)
    mentor_switched = bool(mentor_origin_family and mentor_dest_family and mentor_origin_family != mentor_dest_family)

    if not cand_switched or not mentor_switched:
        return 0.5 if cand_switched == mentor_switched else 0.2
    if candidate_origin_family == mentor_origin_family and candidate_dest_family == mentor_dest_family:
        return 1.0
    return 0.6
