const TOKEN_ALIASES: Record<string, string> = {
  reactjs: 'react',
  react: 'react',
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  microfrontend: 'microfrontend',
  microfrontends: 'microfrontend',
  modulefederation: 'modulefederation',
  restapis: 'restapi',
  api: 'restapi',
  apis: 'restapi'
};

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

let extractorPromise: Promise<any> | null = null;

async function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      try {
        const moduleName = '@huggingface/transformers';
        const mod = await import(moduleName);
        if (mod && mod.pipeline) {
          return await mod.pipeline('feature-extraction', MODEL_NAME);
        }
      } catch (_e) {
        // Fallback gracefully without crashing server
        return null;
      }
      return null;
    })();
  }
  return extractorPromise;
}

function normalizeToken(token: string): string {
  const compact = token.toLowerCase().replace(/[^a-z0-9]/g, '');
  return TOKEN_ALIASES[compact] || compact;
}

function tokenize(text: string): string[] {
  return text
    .split(/[^a-zA-Z0-9+#.]+/)
    .map(normalizeToken)
    .filter(token => token.length > 1);
}

function fallbackEmbedding(text: string): number[] {
  const vector = new Array(384).fill(0);
  const clean = text.toLowerCase().trim();
  if (!clean) return vector;

  const tokens = tokenize(clean);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let hash = 0;
    for (let j = 0; j < token.length; j++) {
      hash = (hash * 31 + token.charCodeAt(j)) & 0xffffffff;
    }
    const idx = (hash >>> 0) % 384;
    vector[idx] += 1;

    // Add character n-grams for semantic fuzzy token match
    for (let k = 0; k <= token.length - 3; k++) {
      const tri = token.substring(k, k + 3);
      let triHash = 0;
      for (let m = 0; m < tri.length; m++) {
        triHash = (triHash * 33 + tri.charCodeAt(m)) & 0xffffffff;
      }
      const triIdx = (triHash >>> 0) % 384;
      vector[triIdx] += 0.5;
    }
  }

  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map(v => v / norm);
}

const embeddingCache = new Map<string, number[]>();

export async function createEmbedding(text: string): Promise<number[]> {
  const cleanText = (text || '').trim();
  if (!cleanText) {
    return new Array(384).fill(0);
  }
  const cached = embeddingCache.get(cleanText);
  if (cached) {
    return cached;
  }

  try {
    const extractor = await getExtractor();
    if (extractor) {
      const output = await extractor(cleanText, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data as Float32Array);
      embeddingCache.set(cleanText, vector);
      return vector;
    }
  } catch (_err) {
    // Fall through to fallback
  }

  const fallback = fallbackEmbedding(cleanText);
  embeddingCache.set(cleanText, fallback);
  return fallback;
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (!left || !right || left.length === 0 || right.length === 0) return 0;
  return left.reduce((sum, value, index) => sum + value * (right[index] || 0), 0);
}

export async function semanticSimilarity(textA: string, textB: string): Promise<number> {
  const [vecA, vecB] = await Promise.all([createEmbedding(textA), createEmbedding(textB)]);
  return Math.max(0, cosineSimilarity(vecA, vecB));
}

export async function semanticSkillMatch(candidateSkill: string, targetSkill: string, threshold = 0.72): Promise<boolean> {
  const normCand = normalizedSkill(candidateSkill);
  const normTarget = normalizedSkill(targetSkill);
  if (normCand === normTarget || normCand.includes(normTarget) || normTarget.includes(normCand)) {
    return true;
  }
  const sim = await semanticSimilarity(candidateSkill, targetSkill);
  return sim >= threshold;
}

export function normalizedSkill(skill: string): string {
  return tokenize(skill).join('');
}

