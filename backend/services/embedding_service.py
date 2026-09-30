import re
import math
from typing import List, Dict, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
from backend.config import EMBEDDING_MODEL_NAME, EMBEDDING_DIM

TOKEN_ALIASES = {
    'reactjs': 'react',
    'react': 'react',
    'typescript': 'typescript',
    'ts': 'typescript',
    'javascript': 'javascript',
    'js': 'javascript',
    'microfrontend': 'microfrontend',
    'microfrontends': 'microfrontend',
    'modulefederation': 'modulefederation',
    'restapis': 'restapi',
    'api': 'restapi',
    'apis': 'restapi'
}

_model: Optional[SentenceTransformer] = None
_embedding_cache: Dict[str, List[float]] = {}

def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        except Exception as e:
            print(f"[EmbeddingService] Warning loading {EMBEDDING_MODEL_NAME}: {e}")
    return _model

def normalize_token(token: str) -> str:
    compact = re.sub(r'[^a-z0-9]', '', token.lower())
    return TOKEN_ALIASES.get(compact, compact)

def tokenize(text: str) -> List[str]:
    tokens = re.split(r'[^a-zA-Z0-9+#.]+', text)
    return [normalize_token(t) for t in tokens if len(normalize_token(t)) > 1]

def normalized_skill(skill: str) -> str:
    return "".join(tokenize(skill))

def fallback_embedding(text: str) -> List[float]:
    vector = [0.0] * EMBEDDING_DIM
    clean = text.lower().strip()
    if not clean:
        return vector

    tokens = tokenize(clean)
    for token in tokens:
        h = 0
        for char in token:
            h = (h * 31 + ord(char)) & 0xFFFFFFFF
        idx = h % EMBEDDING_DIM
        vector[idx] += 1.0

        for k in range(max(0, len(token) - 2)):
            tri = token[k:k+3]
            tri_hash = 0
            for char in tri:
                tri_hash = (tri_hash * 33 + ord(char)) & 0xFFFFFFFF
            tri_idx = tri_hash % EMBEDDING_DIM
            vector[tri_idx] += 0.5

    norm = math.sqrt(sum(v * v for v in vector)) or 1.0
    return [v / norm for v in vector]

def create_embedding(text: str) -> List[float]:
    clean_text = (text or "").strip()
    if not clean_text:
        return [0.0] * EMBEDDING_DIM

    if clean_text in _embedding_cache:
        return _embedding_cache[clean_text]

    try:
        model = get_embedding_model()
        if model is not None:
            vec = model.encode(clean_text, normalize_embeddings=True)
            vec_list = vec.tolist() if isinstance(vec, np.ndarray) else list(vec)
            _embedding_cache[clean_text] = vec_list
            return vec_list
    except Exception as e:
        print(f"[EmbeddingService] Fallback embedding used due to: {e}")

    fallback = fallback_embedding(clean_text)
    _embedding_cache[clean_text] = fallback
    return fallback

def cosine_similarity(left: List[float], right: List[float]) -> float:
    if not left or not right or len(left) == 0 or len(right) == 0:
        return 0.0
    return float(np.dot(left, right))

def semantic_similarity(text_a: str, text_b: str) -> float:
    vec_a = create_embedding(text_a)
    vec_b = create_embedding(text_b)
    return max(0.0, cosine_similarity(vec_a, vec_b))

def semantic_skill_match(candidate_skill: str, target_skill: str, threshold: float = 0.72) -> bool:
    norm_cand = normalized_skill(candidate_skill)
    norm_target = normalized_skill(target_skill)
    if norm_cand == norm_target or norm_cand in norm_target or norm_target in norm_cand:
        return True
    sim = semantic_similarity(candidate_skill, target_skill)
    return sim >= threshold
