import fs from 'fs';
import path from 'path';
import { Creator, CandidateProfile, MentorshipSession, PeerVerifiedBadge } from '../types';
import { SEED_CREATORS, SEED_CANDIDATES, INITIAL_SESSIONS } from './seedData';
import { normalizeDomain } from '../services/mentorMatchTaxonomy';

interface DbSchema {
  creators: Creator[];
  candidates: CandidateProfile[];
  sessions: MentorshipSession[];
  badges: PeerVerifiedBadge[];
  analytics: {
    profileUpdatesThisMonth: number;
    newRegistrationsThisMonth: number;
    totalSessionsBooked: number;
    totalActiveCreators: number;
  };
}

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'db.json');

class Store {
  private data: DbSchema;

  constructor() {
    this.data = this.loadInitialData();
  }

  private loadInitialData(): DbSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Validate basic integrity
        if (parsed.creators && parsed.sessions && parsed.candidates) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Store] Could not read db.json, using defaults:', err);
    }

    const defaultData: DbSchema = {
      creators: JSON.parse(JSON.stringify(SEED_CREATORS)),
      candidates: JSON.parse(JSON.stringify(SEED_CANDIDATES)),
      sessions: JSON.parse(JSON.stringify(INITIAL_SESSIONS)),
      badges: JSON.parse(JSON.stringify(SEED_CANDIDATES[0].badges)),
      analytics: {
        profileUpdatesThisMonth: 14820,
        newRegistrationsThisMonth: 6350,
        totalSessionsBooked: 2430,
        totalActiveCreators: SEED_CREATORS.length
      }
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(snapshot?: DbSchema) {
    try {
      const toSave = snapshot || this.data;
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Failed saving db.json:', err);
    }
  }

  // Creators
  public getCreators(domain?: string, query?: string): Creator[] {
    let list = this.data.creators;
    if (domain && domain !== 'all') {
      const targetNorm = normalizeDomain(domain) || domain.toLowerCase();
      list = list.filter(c => {
        const cNorm = normalizeDomain(c.domain) || c.domain.toLowerCase();
        return cNorm.toLowerCase() === targetNorm.toLowerCase() || c.domain.toLowerCase() === domain.toLowerCase();
      });
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getCreatorById(id: string): Creator | undefined {
    const clean = (id || '').trim().toLowerCase();
    return this.data.creators.find(c => c.id.toLowerCase() === clean);
  }

  public addCreator(newCreator: Creator): Creator {
    // Check if creator already exists
    const index = this.data.creators.findIndex(c => c.id === newCreator.id);
    if (index >= 0) {
      this.data.creators[index] = newCreator;
    } else {
      this.data.creators.unshift(newCreator);
      this.data.analytics.totalActiveCreators += 1;
    }
    this.saveData();
    return newCreator;
  }

  public updateCreatorAvailability(creatorId: string, days: string[], timeSlots: string[]): Creator | undefined {
    const creator = this.getCreatorById(creatorId);
    if (creator) {
      creator.availability = { days, timeSlots };
      this.saveData();
      return creator;
    }
    return undefined;
  }

  // Sessions & Bookings
  public getSessions(userId?: string, role?: 'candidate' | 'mentor'): MentorshipSession[] {
    if (!userId) return this.data.sessions;
    if (role === 'mentor') {
      return this.data.sessions.filter(s => s.expertId === userId || s.expert.name.toLowerCase().includes(userId.toLowerCase()));
    }
    return this.data.sessions.filter(s => s.candidateId === userId || s.candidateName.toLowerCase().includes(userId.toLowerCase()));
  }

  public getSessionById(sessionId: string): MentorshipSession | undefined {
    return this.data.sessions.find(s => s.id === sessionId);
  }

  public addSession(session: MentorshipSession): MentorshipSession {
    this.data.sessions.unshift(session);
    this.data.analytics.totalSessionsBooked += 1;
    this.saveData();
    return session;
  }

  public updateSession(sessionId: string, updates: Partial<MentorshipSession>): MentorshipSession | undefined {
    const session = this.getSessionById(sessionId);
    if (session) {
      Object.assign(session, updates);
      this.saveData();
      return session;
    }
    return undefined;
  }

  // Candidates & Profile Updates
  public getCandidate(id: string): CandidateProfile | undefined {
    const lookup = id.toLowerCase();
    return this.data.candidates.find(c =>
      c.id === id ||
      c.email?.toLowerCase() === lookup ||
      (id === 'prakash' && c.id === 'prakash-mahto') ||
      (id === 'prakash-mahto' && c.id === 'prakash')
    );
  }

  public getCandidates(domain?: string, peerVerifiedOnly: boolean = false): CandidateProfile[] {
    let list = this.data.candidates;
    if (peerVerifiedOnly) {
      list = list.filter(c => c.badges && c.badges.length > 0);
    }
    if (domain && domain !== 'all') {
      const d = domain.toLowerCase();
      list = list.filter(c => 
        (c.targetRole && c.targetRole.toLowerCase().includes(d)) ||
        (c.headline && c.headline.toLowerCase().includes(d)) ||
        c.skills.some(s => s.toLowerCase().includes(d))
      );
    }
    return list;
  }

  public updateCandidate(id: string, updates: Partial<CandidateProfile>): CandidateProfile | undefined {
    const cand = this.getCandidate(id);
    if (cand) {
      Object.assign(cand, updates);
      this.data.analytics.profileUpdatesThisMonth += 1;
      this.saveData();
      return cand;
    }
    return undefined;
  }

  public awardBadgeToCandidate(candidateId: string, badge: PeerVerifiedBadge): CandidateProfile | undefined {
    const cand = this.getCandidate(candidateId);
    if (cand) {
      cand.badges = [badge, ...cand.badges.filter(b => b.title !== badge.title)];
      cand.profileScore = Math.min(100, (cand.profileScore || 75) + 8);
      cand.recruiterSearchMultiplier = Math.min(5.0, (cand.recruiterSearchMultiplier || 1.5) + 0.6);
      this.data.badges.unshift(badge);
      this.data.analytics.profileUpdatesThisMonth += 1;
      this.saveData();
      return cand;
    }
    return undefined;
  }

  // Analytics
  public getAnalytics() {
    return {
      ...this.data.analytics,
      verifiedCreatorsCount: this.data.creators.length,
      upcomingSessionsCount: this.data.sessions.filter(s => s.status === 'upcoming').length,
      completedSessionsCount: this.data.sessions.filter(s => s.status === 'completed').length,
      totalBadgesIssued: this.data.badges.length,
      domainsCovered: ['Full-Stack', 'AI/ML', 'Semiconductor', 'Cybersecurity', 'SaaS Sales', 'Marketing'],
      growthStats: {
        profileUpdateRateGain: '+68% vs baseline jobs platform',
        passiveRegistrationsInUnderservedDomains: '42% from Topmate/LinkedIn referral',
        recruiterSearchShortlistSpeed: '3.4x faster for peer-verified candidates'
      }
    };
  }

  public resetToDefault() {
    this.data = {
      creators: JSON.parse(JSON.stringify(SEED_CREATORS)),
      candidates: JSON.parse(JSON.stringify(SEED_CANDIDATES)),
      sessions: JSON.parse(JSON.stringify(INITIAL_SESSIONS)),
      badges: JSON.parse(JSON.stringify(SEED_CANDIDATES[0].badges)),
      analytics: {
        profileUpdatesThisMonth: 14820,
        newRegistrationsThisMonth: 6350,
        totalSessionsBooked: 2430,
        totalActiveCreators: SEED_CREATORS.length
      }
    };
    this.saveData();
    return this.data;
  }
}

export const store = new Store();
