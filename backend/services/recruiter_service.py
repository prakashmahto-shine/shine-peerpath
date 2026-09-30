import time
from typing import List, Dict, Optional, Any
from backend.data.store import store
from backend.models.schemas import CandidateProfile, RecruiterMatchInput
from backend.services.embedding_service import create_embedding, cosine_similarity, normalized_skill
from backend.services.milvus_service import milvus_service

class RecruiterService:
    def __init__(self):
        self._candidate_embedding_cache: Dict[str, Dict[str, Any]] = {}

    def get_candidate_embedding(self, candidate: CandidateProfile) -> List[float]:
        source_text = f"{candidate.headline} {candidate.summary} {' '.join(candidate.skills or [])}"
        cached = self._candidate_embedding_cache.get(candidate.id)
        if cached and cached.get('sourceText') == source_text:
            return cached['embedding']

        embedding = create_embedding(source_text)
        self._candidate_embedding_cache[candidate.id] = {'sourceText': source_text, 'embedding': embedding}
        return embedding

    def match_candidates_to_role(self, input_data: RecruiterMatchInput) -> List[Dict[str, Any]]:
        if input_data.candidateId:
            cand = store.get_candidate(input_data.candidateId)
            candidates = [cand] if cand else []
        else:
            candidates = store.get_candidates(peer_verified_only=bool(input_data.peerVerifiedOnly))

        role_text = f"{input_data.roleTitle} {' '.join(input_data.requiredSkills)}"
        role_embedding = create_embedding(role_text)

        matches = []
        for candidate in candidates:
            candidate_skills = candidate.skills or []
            matched_skills = []
            for req in input_data.requiredSkills:
                norm_req = normalized_skill(req)
                if any(norm_req in normalized_skill(cs) or normalized_skill(cs) in norm_req for cs in candidate_skills):
                    matched_skills.append(req)

            missing_skills = [s for s in input_data.requiredSkills if s not in matched_skills]
            skill_coverage = len(matched_skills) / len(input_data.requiredSkills) if input_data.requiredSkills else 0.0

            candidate_embedding = self.get_candidate_embedding(candidate)
            semantic_sim = max(0.0, cosine_similarity(candidate_embedding, role_embedding))
            verified_boost = 0.05 if candidate.badges else 0.0

            match_percent = round(min(99, max(0, (skill_coverage * 0.70 + semantic_sim * 0.25 + verified_boost) * 100)))

            explanation = (
                'Strong skills and profile-context match for this role.'
                if not missing_skills
                else f"Good foundation, but missing {' and '.join(missing_skills)} for this role."
            )

            matches.append({
                'candidate': candidate.model_dump(),
                'matchPercent': match_percent,
                'matchedSkills': matched_skills,
                'missingSkills': missing_skills,
                'explanation': explanation
            })

        matches.sort(key=lambda x: x['matchPercent'], reverse=True)
        return matches

    def search_candidates(
        self,
        domain: Optional[str] = None,
        query: Optional[str] = None,
        peer_verified_only: bool = False,
        min_score: Optional[int] = None
    ) -> Dict[str, Any]:
        candidates = store.get_candidates(domain=domain, peer_verified_only=peer_verified_only)

        if min_score:
            candidates = [c for c in candidates if (c.profileScore or 0) >= min_score]

        if query and query.strip():
            q = query.strip()
            q_lower = q.lower()
            query_vec = create_embedding(q)

            scored = []
            for candidate in candidates:
                cand_vec = self.get_candidate_embedding(candidate)
                similarity = max(0.0, cosine_similarity(query_vec, cand_vec))
                has_badges = bool(candidate.badges and len(candidate.badges) > 0)
                has_exact_keyword = (
                    q_lower in candidate.name.lower()
                    or q_lower in candidate.headline.lower()
                    or any(q_lower in s.lower() for s in candidate.skills)
                )

                match_score = min(99, max(50, round(
                    (similarity * 55) + (20 if has_exact_keyword else 0) + (15 if has_badges else 0) + (candidate.profileScore * 0.1)
                )))

                scored.append({
                    'candidate': candidate,
                    'similarity': similarity,
                    'has_exact_keyword': has_exact_keyword,
                    'match_score': match_score,
                    'top_badge': candidate.badges[0].model_dump() if has_badges else None,
                    'semantic_explanation': f"Semantic Match: {round(similarity * 100)}% relevance to \"{q}\""
                })

            filtered = [item for item in scored if item['similarity'] >= 0.25 or item['has_exact_keyword']]
            filtered.sort(key=lambda x: x['match_score'], reverse=True)

            enhanced = []
            for item in filtered:
                c_dict = item['candidate'].model_dump()
                c_dict['matchScore'] = item['match_score']
                c_dict['topBadge'] = item['top_badge']
                c_dict['semanticExplanation'] = item['semantic_explanation']
                enhanced.append(c_dict)

            return {
                'totalMatches': len(enhanced),
                'peerVerifiedCount': len([c for c in enhanced if c.get('badges') and len(c['badges']) > 0]),
                'candidates': enhanced
            }

        # Default view
        enhanced = []
        for c in candidates:
            c_dict = c.model_dump()
            has_badges = bool(c.badges and len(c.badges) > 0)
            c_dict['matchScore'] = 96 if has_badges else 82
            c_dict['topBadge'] = c.badges[0].model_dump() if has_badges else None
            enhanced.append(c_dict)

        return {
            'totalMatches': len(enhanced),
            'peerVerifiedCount': len([c for c in enhanced if c.get('badges') and len(c['badges']) > 0]),
            'candidates': enhanced
        }

    def send_interview_invite(self, candidate_id: str, recruiter_name: str, company: str, role_title: str, message: Optional[str] = None) -> Dict[str, Any]:
        cand = store.get_candidate(candidate_id)
        if not cand:
            raise ValueError(f"Candidate {candidate_id} not found")

        return {
            'success': True,
            'inviteId': f"inv_{int(time.time() * 1000)}",
            'candidateName': cand.name,
            'recruiterCompany': company,
            'roleTitle': role_title,
            'sentAt': time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            'status': 'INVITATION_DELIVERED',
            'note': f"Interview invitation sent to {cand.name} with verified candidate badge highlight."
        }

recruiter_service = RecruiterService()
