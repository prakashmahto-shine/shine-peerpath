import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';

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

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', MODEL_NAME);
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
  const extractor = await getExtractor();
  const output = await extractor(cleanText, { pooling: 'mean', normalize: true });
  const vector = Array.from(output.data as Float32Array);
  embeddingCache.set(cleanText, vector);
  return vector;
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

