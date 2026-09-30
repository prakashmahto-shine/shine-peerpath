import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from backend.config import DB_PATH
from backend.models.schemas import Creator, CandidateProfile, MentorshipSession, PeerVerifiedBadge

def normalize_domain_key(domain: Optional[str]) -> Optional[str]:
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

class Store:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self.data: Dict[str, Any] = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, 'r', encoding='utf-8') as f:
                    parsed = json.load(f)
                    if 'creators' in parsed and 'candidates' in parsed and 'sessions' in parsed:
                        return parsed
            except Exception as e:
                print(f"[Store] Error reading {self.db_path}, fallback: {e}")

        # Default fallback structure if db.json is missing
        return {
            "creators": [],
            "candidates": [],
            "sessions": [],
            "badges": [],
            "analytics": {
                "profileUpdatesThisMonth": 14820,
                "newRegistrationsThisMonth": 6350,
                "totalSessionsBooked": 2430,
                "totalActiveCreators": 0
            }
        }

    def save_data(self):
        try:
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.db_path, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            print(f"[Store] Error saving {self.db_path}: {e}")

    # Creators
    def get_creators(self, domain: Optional[str] = None, query: Optional[str] = None) -> List[Creator]:
        creators_raw = self.data.get('creators', [])
        creators = [Creator(**c) for c in creators_raw]

        if domain and domain != 'all':
            target_norm = normalize_domain_key(domain) or domain.lower()
            filtered = []
            for c in creators:
                c_norm = normalize_domain_key(c.domain) or c.domain.lower()
                if c_norm.lower() == target_norm.lower() or c.domain.lower() == domain.lower():
                    filtered.append(c)
            creators = filtered

        if query and query.strip():
            q = query.lower().strip()
            creators = [
                c for c in creators
                if q in c.name.lower()
                or q in c.role.lower()
                or q in c.company.lower()
                or any(q in s.lower() for s in c.skills)
            ]

        return creators

    def get_creator_by_id(self, creator_id: str) -> Optional[Creator]:
        clean = (creator_id or '').strip().lower()
        for c in self.data.get('creators', []):
            if c.get('id', '').lower() == clean:
                return Creator(**c)
        return None

    def add_creator(self, new_creator: Creator) -> Creator:
        creators = self.data.setdefault('creators', [])
        creator_dict = new_creator.model_dump()
        
        # Replace if exists, else prepend
        idx = next((i for i, c in enumerate(creators) if c.get('id') == new_creator.id), -1)
        if idx >= 0:
            creators[idx] = creator_dict
        else:
            creators.insert(0, creator_dict)
            self.data.setdefault('analytics', {})['totalActiveCreators'] = len(creators)
        
        self.save_data()
        return new_creator

    def update_creator_availability(self, creator_id: str, days: List[str], time_slots: List[str]) -> Optional[Creator]:
        creator = self.get_creator_by_id(creator_id)
        if not creator:
            return None
        
        for c in self.data.get('creators', []):
            if c.get('id', '').lower() == creator_id.strip().lower():
                c['availability'] = {'days': days, 'timeSlots': time_slots}
                break
        
        self.save_data()
        return self.get_creator_by_id(creator_id)

    # Sessions & Bookings
    def get_sessions(self, user_id: Optional[str] = None, role: Optional[str] = None) -> List[MentorshipSession]:
        sessions_raw = self.data.get('sessions', [])
        sessions = [MentorshipSession(**s) for s in sessions_raw]
        if not user_id:
            return sessions
        
        uid = user_id.lower()
        if role == 'mentor':
            return [s for s in sessions if s.expertId == user_id or uid in s.expert.name.lower()]
        return [s for s in sessions if s.candidateId == user_id or uid in s.candidateName.lower()]

    def get_session_by_id(self, session_id: str) -> Optional[MentorshipSession]:
        for s in self.data.get('sessions', []):
            if s.get('id') == session_id:
                return MentorshipSession(**s)
        return None

    def add_session(self, session: MentorshipSession) -> MentorshipSession:
        sessions = self.data.setdefault('sessions', [])
        sessions.insert(0, session.model_dump())
        self.data.setdefault('analytics', {})['totalSessionsBooked'] = self.data['analytics'].get('totalSessionsBooked', 0) + 1
        self.save_data()
        return session

    def update_session(self, session_id: str, updates: Dict[str, Any]) -> Optional[MentorshipSession]:
        for s in self.data.get('sessions', []):
            if s.get('id') == session_id:
                s.update(updates)
                self.save_data()
                return MentorshipSession(**s)
        return None

    # Candidates & Profile Updates
    def get_candidate(self, candidate_id: str) -> Optional[CandidateProfile]:
        lookup = (candidate_id or '').lower()
        for c in self.data.get('candidates', []):
            cid = c.get('id', '').lower()
            cemail = c.get('email', '').lower()
            if cid == lookup or cemail == lookup or (lookup == 'prakash' and cid == 'prakash-mahto') or (lookup == 'prakash-mahto' and cid == 'prakash'):
                return CandidateProfile(**c)
        return None

    def get_candidates(self, domain: Optional[str] = None, peer_verified_only: bool = False) -> List[CandidateProfile]:
        cands_raw = self.data.get('candidates', [])
        cands = [CandidateProfile(**c) for c in cands_raw]

        if peer_verified_only:
            cands = [c for c in cands if c.badges and len(c.badges) > 0]

        if domain and domain != 'all':
            d = domain.lower()
            cands = [
                c for c in cands
                if (c.targetRole and d in c.targetRole.lower())
                or (c.headline and d in c.headline.lower())
                or any(d in s.lower() for s in c.skills)
                or (c.domain and d in c.domain.lower())
            ]

        return cands

    def update_candidate(self, candidate_id: str, updates: Dict[str, Any]) -> Optional[CandidateProfile]:
        for c in self.data.get('candidates', []):
            cid = c.get('id', '').lower()
            if cid == candidate_id.lower() or (candidate_id.lower() == 'prakash' and cid == 'prakash-mahto') or (candidate_id.lower() == 'prakash-mahto' and cid == 'prakash'):
                c.update(updates)
                self.data.setdefault('analytics', {})['profileUpdatesThisMonth'] = self.data['analytics'].get('profileUpdatesThisMonth', 0) + 1
                self.save_data()
                return CandidateProfile(**c)
        return None

    def award_badge_to_candidate(self, candidate_id: str, badge: PeerVerifiedBadge) -> Optional[CandidateProfile]:
        cand = self.get_candidate(candidate_id)
        if not cand:
            return None
        
        for c in self.data.get('candidates', []):
            cid = c.get('id', '').lower()
            if cid == candidate_id.lower() or (candidate_id.lower() == 'prakash' and cid == 'prakash-mahto') or (candidate_id.lower() == 'prakash-mahto' and cid == 'prakash'):
                existing_badges = [b for b in c.get('badges', []) if b.get('title') != badge.title]
                c['badges'] = [badge.model_dump()] + existing_badges
                c['profileScore'] = min(100, (c.get('profileScore', 75) + 8))
                c['recruiterSearchMultiplier'] = min(5.0, (c.get('recruiterSearchMultiplier', 1.5) + 0.6))
                
                self.data.setdefault('badges', []).insert(0, badge.model_dump())
                self.data.setdefault('analytics', {})['profileUpdatesThisMonth'] = self.data['analytics'].get('profileUpdatesThisMonth', 0) + 1
                self.save_data()
                return CandidateProfile(**c)
        return None

    # Analytics
    def get_analytics(self) -> Dict[str, Any]:
        analytics = self.data.get('analytics', {})
        creators = self.data.get('creators', [])
        sessions = self.data.get('sessions', [])
        badges = self.data.get('badges', [])

        return {
            **analytics,
            'verifiedCreatorsCount': len(creators),
            'upcomingSessionsCount': len([s for s in sessions if s.get('status') == 'upcoming']),
            'completedSessionsCount': len([s for s in sessions if s.get('status') == 'completed']),
            'totalBadgesIssued': len(badges),
            'domainsCovered': ['Full-Stack', 'AI/ML', 'Semiconductor', 'Cybersecurity', 'SaaS Sales', 'Marketing'],
            'growthStats': {
                'profileUpdateRateGain': '+68% vs baseline jobs platform',
                'passiveRegistrationsInUnderservedDomains': '42% from Topmate/LinkedIn referral',
                'recruiterSearchShortlistSpeed': '3.4x faster for peer-verified candidates'
            }
        }

    def reset_to_default(self) -> Dict[str, Any]:
        # Re-read initial from db.json if present
        self.data = self._load_data()
        self.save_data()
        return self.data

store = Store()
