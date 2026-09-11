// Role-family and company-tier taxonomy powering the "4-Way Alignment" trajectory match:
// candidate origin/destination compared against the mentor's own origin/destination,
// not just the destination alone. See trajectoryService.ts for the weighted formula.

import { SP500_COMPANIES, INDIAN_UNICORN_COMPANIES, NSE_LISTED_COMPANIES } from '../data/companyTiers';

export type RoleFamily = 'ML' | 'BACKEND' | 'FRONTEND' | 'DATA' | 'DEVOPS' | 'SECURITY' | 'CHIP' | 'PRODUCT' | 'SALES' | 'MARKETING' | 'MOBILE' | 'QA';

// The only guilds Peerpath currently has mentors for. A candidate outside these (Finance, HR,
// Legal, etc.) gets tagged 'Others' rather than silently matched against an irrelevant
// mentor — see isSupportedDomain() and trajectoryService.matchTrajectories().
export const SUPPORTED_DOMAINS = [
  'AI/ML',
  'Semiconductor',
  'Cybersecurity',
  'Full-Stack',
  'Product Management',
  'Search & Data Infra',
  'SaaS Sales',
  'Marketing'
] as const;

export function normalizeDomain(domain?: string | null): string | null {
  if (!domain) return null;
  const clean = domain.toLowerCase().trim().replace(/[-_/]/g, ' ');
  if (clean.includes('ai') || clean.includes('ml') || clean.includes('genai') || clean.includes('machine learning')) return 'AI/ML';
  if (clean.includes('semi') || clean.includes('vlsi') || clean.includes('silicon') || clean.includes('chip')) return 'Semiconductor';
  if (clean.includes('cyber') || clean.includes('security')) return 'Cybersecurity';
  if (clean.includes('product') || clean === 'pm') return 'Product Management';
  if (clean.includes('search') || clean.includes('solr') || clean.includes('data infra') || clean.includes('lucene')) return 'Search & Data Infra';
  if (clean.includes('front') || clean.includes('back') || clean.includes('full stack') || clean.includes('arch') || clean.includes('web')) return 'Full-Stack';
  if (clean.includes('sales') || clean.includes('gtm') || clean.includes('bd')) return 'SaaS Sales';
  if (clean.includes('market') || clean.includes('growth')) return 'Marketing';
  return null;
}

export function isSupportedDomain(domain?: string | null): boolean {
  if (!domain) return false;
  if ((SUPPORTED_DOMAINS as readonly string[]).some(d => d.toLowerCase() === domain.toLowerCase())) return true;
  return normalizeDomain(domain) !== null;
}
// TIER2_LISTED = "a real, exchange-listed company we have a record of, but not elite/unicorn
// tier". UNCLASSIFIED = "no data at all" — kept distinct from every real tier so an unknown
// company is never silently treated as if it were a known Series A/B startup (see companyMatchScore).
export type CompanyTier = 'TIER0_GLOBAL' | 'TIER1_INDIA' | 'SERVICE' | 'TIER2_LISTED' | 'UNCLASSIFIED';

// Ordered so more specific phrases are checked before generic catch-alls (e.g. "full-stack"
// before a bare "developer" match).
const ROLE_FAMILY_KEYWORDS: Array<[RoleFamily, string[]]> = [
  ['CHIP', ['vlsi', 'rtl', 'physical design', 'semiconductor', 'asic', 'fpga', 'silicon', 'soc architect', 'soc design', 'chip']],
  ['SECURITY', ['security', 'pentest', 'penetration test', 'appsec', 'application security', 'threat', 'soc analyst', 'soc monitoring', 'vulnerability', 'devsecops', 'incident response']],
  ['ML', ['ml', 'ai', 'machine learning', 'data scientist', 'mlops', 'nlp', 'genai', 'gen ai', 'deep learning', 'computer vision']],
  ['DEVOPS', ['devops', 'sre', 'site reliability', 'cloud engineer', 'cloud architect', 'infra eng', 'infrastructure engineer', 'platform architect']],
  ['DATA', ['data engineer', 'analytics eng', 'bi engineer', 'bi analyst', 'business intelligence', 'data analyst', 'search architect', 'solr', 'lucene']],
  ['PRODUCT', ['product manager', 'product management', 'apm', 'gpm', 'pm', 'product lead', 'product strategy', 'technical product manager']],
  ['MOBILE', ['mobile', 'android', 'ios', 'flutter']],
  ['QA', ['sdet', 'qa', 'quality engineer', 'test engineer']],
  ['FRONTEND', ['frontend', 'front-end', 'ui dev', 'react dev', 'full-stack', 'full stack', 'web developer']],
  ['BACKEND', ['backend', 'back-end', 'sde', 'software development engineer', 'software engineer', 'platform eng', 'java developer', 'python developer', 'java/python dev', 'associate software engineer']],
  ['SALES', ['sales', 'business development', 'account executive', 'account coordinator', 'bdr', 'sdr', 'gtm', 'revenue', 'telesales', 'inside sales']],
  ['MARKETING', ['marketing', 'brand', 'growth marketing', 'performance marketing', 'seo', 'sem', 'content strategy', 'social media', 'influencer']]
];

// Fallback when a title carries no recognizable keyword (e.g. "Linux System Administrator"
// feeding into a Cybersecurity track): use the person's guild/domain as the family.
const DOMAIN_FALLBACK_FAMILY: Record<string, RoleFamily> = {
  'ai/ml': 'ML',
  'semiconductor': 'CHIP',
  'cybersecurity': 'SECURITY',
  'full-stack': 'BACKEND',
  'product management': 'PRODUCT',
  'search & data infra': 'DATA',
  'saas sales': 'SALES',
  'marketing': 'MARKETING'
};

// Word-boundary match — short/ambiguous acronyms like "ml", "ai", "pm", "sde" must not
// fire on substrings buried inside unrelated words (e.g. "ai" inside "container").
function hasKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

export function classifyRoleFamily(roleTitle?: string, domainHint?: string): RoleFamily | null {
  if (!roleTitle) return null;
  for (const [family, keywords] of ROLE_FAMILY_KEYWORDS) {
    if (keywords.some(k => hasKeyword(roleTitle, k))) return family;
  }
  if (domainHint) {
    const norm = normalizeDomain(domainHint);
    const key = (norm || domainHint).toLowerCase();
    const fallback = DOMAIN_FALLBACK_FAMILY[key];
    if (fallback) return fallback;
  }
  return null;
}

const COMPANY_TIER_KEYWORDS: Array<[CompanyTier, string[]]> = [
  // Hand-curated, fuzzy (substring) keywords — checked first so name variants like
  // "Google Cloud" or "Razorpay (FinTech)" still match. FAANG + equivalent-prestige global
  // majors: the candidate's original brief only named FAANG explicitly; extended here so
  // Semiconductor/Cybersecurity dream employers (just as "top tier" in those guilds) don't
  // all fall into a generic bucket.
  ['TIER0_GLOBAL', [
    'google', 'amazon', 'microsoft', 'meta', 'apple',
    'nvidia', 'intel', 'qualcomm', 'texas instruments', 'amd', 'broadcom', 'micron',
    'analog devices', 'mediatek', 'synopsys', 'cadence',
    'palo alto networks', 'crowdstrike', 'cisco', 'fortinet', 'zscaler', 'mcafee',
    'ibm security', 'ibm', 'sophos', 'check point', 'adobe', 'salesforce', 'atlassian', 'uber', 'netflix'
  ]],
  ['TIER1_INDIA', ['flipkart', 'swiggy', 'meesho', 'zepto', 'groww', 'phonepe', 'razorpay', 'cred', 'zomato', 'myntra', 'postman', 'freshworks', 'zoho']],
  ['SERVICE', ['tcs', 'tata consultancy', 'infosys', 'wipro', 'hcl', 'cognizant', 'capgemini', 'tech mahindra', 'mindtree', 'ltimindtree', 'sasken', 'l&t technology', 'smartsoc', 'accenture']]
];

// Large free public datasets (server/data/companyTiers.ts) — matched by exact normalized
// name rather than substring, since these are full official names, not hand-picked keywords.
function buildNormalizedSet(names: string[]): Set<string> {
  return new Set(names.map(n => normalizeCompanyName(n)).filter(Boolean));
}
const SP500_SET = buildNormalizedSet(SP500_COMPANIES);
const INDIAN_UNICORN_SET = buildNormalizedSet(INDIAN_UNICORN_COMPANIES);
const NSE_LISTED_SET = buildNormalizedSet(NSE_LISTED_COMPANIES);

/**
 * Classifies a company into a tier using ~50 hand-curated keywords plus ~1,300 real
 * companies pulled for free from public sources (S&P 500, Indian unicorns, NSE-listed).
 * That covers most companies a candidate will realistically name as a "dream company" —
 * it does NOT cover the world's ~50,000+ companies. Anything not found here is honestly
 * reported as 'UNCLASSIFIED' rather than guessed into a real tier — see companyMatchScore.
 */
export function classifyCompanyTier(companyName?: string): CompanyTier {
  if (!companyName) return 'UNCLASSIFIED';
  const lower = companyName.toLowerCase();
  for (const [tier, keywords] of COMPANY_TIER_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return tier;
  }
  const normalized = normalizeCompanyName(companyName);
  if (!normalized) return 'UNCLASSIFIED';
  if (SP500_SET.has(normalized)) return 'TIER0_GLOBAL';
  if (INDIAN_UNICORN_SET.has(normalized)) return 'TIER1_INDIA';
  if (NSE_LISTED_SET.has(normalized)) return 'TIER2_LISTED';
  return 'UNCLASSIFIED';
}

export function normalizeCompanyName(value?: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(inc|ltd|pvt|private|limited|technologies|technology|solutions|labs|systems|corporation|corp|india)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeRoleName(value?: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function exactCompanyMatch(a?: string, b?: string): boolean {
  const na = normalizeCompanyName(a);
  const nb = normalizeCompanyName(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

function exactRoleMatch(a?: string, b?: string): boolean {
  const na = normalizeRoleName(a);
  const nb = normalizeRoleName(b);
  return !!na && na === nb;
}

/**
 * RoleMatch(a, b): 1.0 exact title (post-normalization), 0.7 same role family,
 * 0.3 different family or either side unclassifiable.
 */
export function roleMatchScore(roleA?: string, roleB?: string, domainA?: string, domainB?: string, semanticSim?: number): number {
  if (!roleA || !roleB) return 0.3;
  if (exactRoleMatch(roleA, roleB)) return 1.0;
  const famA = classifyRoleFamily(roleA, domainA);
  const famB = classifyRoleFamily(roleB, domainB);
  let baseScore = (famA && famB && famA === famB) ? 0.7 : 0.3;
  if (semanticSim !== undefined && semanticSim > 0) {
    baseScore = Math.min(1.0, Math.max(baseScore, baseScore * 0.4 + semanticSim * 0.6));
  }
  return Math.round(baseScore * 100) / 100;
}

/**
 * CompanyMatch(a, b): 1.0 exact company, 0.6 same known tier, 0.3 different known tier,
 * 0.15 either side is UNCLASSIFIED (no data — e.g. "Research Lab" or an obscure company
 * outside our free datasets). Being honest about "don't know" here matters: silently
 * guessing an unknown company into a real tier would misrepresent the match quality.
 */
export function companyMatchScore(companyA?: string, companyB?: string): number {
  if (!companyA || !companyB) return 0.15;
  if (exactCompanyMatch(companyA, companyB)) return 1.0;
  const tierA = classifyCompanyTier(companyA);
  const tierB = classifyCompanyTier(companyB);
  if (tierA === 'UNCLASSIFIED' || tierB === 'UNCLASSIFIED') return 0.15;
  if (tierA === tierB) return 0.6;
  return 0.3;
}

/**
 * TransitionMatch: compares the *type* of career move, not just the endpoints.
 * 1.0 — candidate and mentor made the same family-to-family switch (e.g. Backend -> ML both sides).
 * 0.6 — both made a cross-family switch, but to/from different families.
 * 0.2 — one of them didn't actually switch families (a within-guild promotion) while the other did.
 */
export function transitionMatchScore(
  candidateOriginFamily: RoleFamily | null,
  candidateDestFamily: RoleFamily | null,
  mentorOriginFamily: RoleFamily | null,
  mentorDestFamily: RoleFamily | null
): number {
  const candidateSwitched = !!candidateOriginFamily && !!candidateDestFamily && candidateOriginFamily !== candidateDestFamily;
  const mentorSwitched = !!mentorOriginFamily && !!mentorDestFamily && mentorOriginFamily !== mentorDestFamily;

  if (!candidateSwitched || !mentorSwitched) {
    // Neither made a cross-family move, or only one did — not comparable "transitions".
    return candidateSwitched === mentorSwitched ? 0.5 : 0.2;
  }
  if (candidateOriginFamily === mentorOriginFamily && candidateDestFamily === mentorDestFamily) {
    return 1.0;
  }
  return 0.6;
}
