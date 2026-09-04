import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expert, MentorshipSession, PeerVerifiedBadge, UserProfileData, ViewType, UserAccount, PeerpathJobContext } from '../types';
import { EXPERTS_DB } from '../data/expertsData';
import { USERS_DB } from '../data/usersData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface AppContextType {
  // Navigation
  currentView: ViewType;
  previousView: ViewType;
  navigate: (view: ViewType, customPath?: string) => void;

  // Authentication & Dual Roles (Prakash ⇄ Akash ⇄ Nisha)
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  switchUser: (username: string) => void;
  resetDemoData: (targetUser?: string) => void;

  // Experts Database (Dynamic)
  experts: Expert[];
  selectedExpert: Expert;
  setSelectedExpert: (expert: Expert) => void;
  selectExpertById: (expertId: string) => void;
  addExpert: (newExpert: Omit<Expert, 'id'>) => Expert;

  // Sessions (Dynamic Schedule & Management)
  sessions: MentorshipSession[];
  activeSession: MentorshipSession | null;
  setActiveSession: (session: MentorshipSession | null) => void;
  bookSession: (expert: Expert, date: string, timeSlot: string) => MentorshipSession;
  cancelSession: (sessionId: string) => void;
  rescheduleSession: (sessionId: string, newDate: string, newTimeSlot: string) => void;
  completeSession: (sessionId: string, rating: number, notes: string, badgeTitle?: string) => void;

  // User Profile (Candidate Profile)
  userProfile: UserProfileData;
  updateUserProfile: (updates: Partial<UserProfileData>) => void;
  updateProfileSummary: (summary: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  awardBadge: (badge: PeerVerifiedBadge) => void;
  updateJobSearchStatus: (status: string) => void;

  // Mentor Settings & Teaser Video
  mentorAvailability: { days: string[]; timeSlots: string[] };
  updateMentorAvailability: (days: string[], timeSlots: string[]) => void;
  updateMentorRatesAndAvailability: (rate: number, duration: number, days: string[], timeSlots: string[]) => void;
  updateMentorTeaserVideo: (teaser: { url: string; title: string; duration?: string; thumbnail?: string; uploadedAt?: string } | null) => void;

  // Modals
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isCreatorWizardOpen: boolean;
  setIsCreatorWizardOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAssessmentModalOpen: boolean;
  setIsAssessmentModalOpen: (open: boolean) => void;
  assessmentDraftSession: MentorshipSession | null;
  setAssessmentDraftSession: (session: MentorshipSession | null) => void;
  bookingDraft: { expert: Expert; date: string; timeSlot: string };
  setBookingDraft: (draft: { expert: Expert; date: string; timeSlot: string }) => void;

  // Global Search & Toast Notifications
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedJobCategory: string;
  setSelectedJobCategory: (category: string) => void;
  peerpathJobContext: PeerpathJobContext | null;
  setPeerpathJobContext: (ctx: PeerpathJobContext | null) => void;
  clearPeerpathJobContext: () => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const initialBadges: PeerVerifiedBadge[] = [
  {
    id: 'badge-pm-1',
    title: 'Tier-1 Frontend & UI Architecture',
    subtitle: 'Verified by Akash Jain • Lead Product Manager @ Shine',
    verifierName: 'Akash Jain',
    verifierRole: 'Lead Product Manager @ Shine',
    verifierAvatar: '/avatars/akash.jpg',
    date: 'Aug 24, 2026',
    skills: ['React.js 19', 'TypeScript Micro-Frontends', 'UI Performance', 'Design Systems'],
    status: 'verified'
  },
  {
    id: 'badge-solr-1',
    title: 'Distributed Search & Lucene Indexing',
    subtitle: 'Verified by Anirudh Sharma • Principal Search Architect @ Shine',
    verifierName: 'Anirudh Sharma',
    verifierRole: 'Principal Search Architect @ Shine',
    verifierAvatar: '/avatars/anirudh.jpg',
    date: 'Aug 12, 2026',
    skills: ['Solr Query Syntax', 'Inverted Indexing', 'Distributed Sharding', 'FastAPI'],
    status: 'verified'
  }
];

const initialUserProfile: UserProfileData = {
  name: 'Prakash Mahto',
  headline: 'Senior Frontend Engineer | React.js, TypeScript, Next.js UI Architect',
  experienceYears: '4 Years, 2 Months',
  location: 'Bengaluru, India',
  profileScore: 70,
  jobSearchStatus: 'Serving Notice Period (30 Days)',
  summary: 'Senior Frontend Developer with 4+ years of hands-on experience building high-traffic, resilient web applications at scale. Proficient in React.js, TypeScript, Next.js, and modern CSS architecture. Passionate about UI performance optimization, micro-frontends, and collaborating closely with product managers and backend search teams.',
  skills: ['React.js', 'TypeScript', 'Next.js', 'JavaScript (ES6+)', 'Redux Toolkit', 'Tailwind CSS / Vanilla CSS', 'REST APIs', 'Webpack / Vite', 'Jest & React Testing Library', 'Git & CI/CD'],
  badges: initialBadges,
  email: 'prakash.mahto@gmail.com',
  phone: '+91 98765 43210'
};

const initialSessions: MentorshipSession[] = [
  {
    id: 'sess-1',
    expert: EXPERTS_DB[0], // Akash Jain (Lead PM @ Shine)
    candidateName: 'Prakash Mahto',
    candidateRole: 'Senior Frontend Engineer',
    candidateAvatar: '/avatars/prakash.jpg',
    candidateGoal: 'Transition to Top Tier-1 Tech / ₹18L–₹24L target & Mock Interview',
    date: 'Saturday, 5 Sep 2026',
    timeSlot: '07:00 PM - 08:00 PM',
    status: 'upcoming',
    meetingLink: 'https://meet.shine.com/room/peerpath-akash-prakash'
  },
  {
    id: 'sess-2',
    expert: EXPERTS_DB[1], // Anirudh Sharma
    candidateName: 'Prakash Mahto',
    candidateRole: 'Senior Frontend Engineer',
    candidateAvatar: '/avatars/prakash.jpg',
    candidateGoal: 'Learn Search System Architecture & Lucene Sharding',
    date: 'Thu, 28 Aug 2026',
    timeSlot: '04:00 PM - 05:00 PM',
    status: 'completed',
    badgeAwarded: 'Distributed Search & Lucene Indexing',
    feedbackNotes: 'Prakash demonstrated a solid grasp of search query routing, sub-10ms response optimization, and modern frontend cache design.',
    rating: 5
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Dual User Management
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('shine_peerpath_current_user');
      if (savedUser === 'null') {
        return null;
      }
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      return USERS_DB.prakash.account;
    } catch {
      return USERS_DB.prakash.account;
    }
  });

  const isLoggedIn = currentUser !== null;

  // Navigation
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (!currentUser) return 'login-view';
    return 'dashboard-view';
  });
  const [previousView, setPreviousView] = useState<ViewType>('guidance-view');
  
  // Dynamic Experts
  const [experts, setExperts] = useState<Expert[]>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_experts');
      if (saved) {
        const parsed: Expert[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(e => e.id));
        const missing = EXPERTS_DB.filter(e => !existingIds.has(e.id));
        return [...missing, ...parsed];
      }
      return EXPERTS_DB;
    } catch {
      return EXPERTS_DB;
    }
  });
  
  const [selectedExpert, setSelectedExpert] = useState<Expert>(EXPERTS_DB[0]);
  
  // Dynamic Sessions
  const [sessions, setSessions] = useState<MentorshipSession[]>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_sessions');
      return saved ? JSON.parse(saved) : initialSessions;
    } catch {
      return initialSessions;
    }
  });
  
  const [activeSession, setActiveSession] = useState<MentorshipSession | null>(null);

  // Dynamic User Profiles Map (Prakash, Akash, Nisha)
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfileData>>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_profiles_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          prakash: { ...USERS_DB.prakash.profile, ...(parsed.prakash || {}) },
          akash: { ...USERS_DB.akash.profile, ...(parsed.akash || {}) },
          nisha: { ...USERS_DB.nisha.profile, ...(parsed.nisha || {}) }
        };
      }
      return {
        prakash: USERS_DB.prakash.profile,
        akash: USERS_DB.akash.profile,
        nisha: USERS_DB.nisha.profile
      };
    } catch {
      return {
        prakash: USERS_DB.prakash.profile,
        akash: USERS_DB.akash.profile,
        nisha: USERS_DB.nisha.profile
      };
    }
  });

  const activeUsername = currentUser?.username || 'prakash';
  const userProfile: UserProfileData = userProfiles[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.prakash.profile;

  // Mentor Availability
  const [mentorAvailability, setMentorAvailability] = useState<{ days: string[]; timeSlots: string[] }>({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '06:30 PM - 07:30 PM', '08:00 PM - 09:00 PM']
  });

  // Modals & UI Drafts
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isCreatorWizardOpen, setIsCreatorWizardOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [assessmentDraftSession, setAssessmentDraftSession] = useState<MentorshipSession | null>(null);

  const [bookingDraft, setBookingDraft] = useState<{ expert: Expert; date: string; timeSlot: string }>({
    expert: EXPERTS_DB[0],
    date: 'Tomorrow, 5 Sep',
    timeSlot: '10:00 AM - 11:00 AM'
  });

  // Search & Global Toasts & Selected Job Category & Peerpath Context
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('all');
  const [peerpathJobContext, setPeerpathJobContext] = useState<PeerpathJobContext | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const clearPeerpathJobContext = () => {
    setPeerpathJobContext(null);
    setSelectedJobCategory('all');
  };

  // Synchronize localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('shine_peerpath_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.setItem('shine_peerpath_current_user', 'null');
      }
    } catch (e) {
      console.warn('Failed to persist user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_experts', JSON.stringify(experts));
    } catch (e) {
      console.warn('Failed to persist experts', e);
    }
  }, [experts]);

  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to persist sessions', e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_profiles_db', JSON.stringify(userProfiles));
    } catch (e) {
      console.warn('Failed to persist profiles db', e);
    }
  }, [userProfiles]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (view: ViewType, customPath?: string) => {
    if (view !== currentView) {
      setPreviousView(currentView);
    }
    setCurrentView(view);
    const pathToPush = customPath || (
      view === 'dashboard-view' ? '/' : 
      view === 'login-view' ? '/pages/myshine/login' :
      `/${view.replace('-view', '')}`
    );
    if (window.location.pathname !== pathToPush) {
      window.history.pushState({}, '', pathToPush);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication methods
  const login = (usernameInput: string, passwordInput: string): boolean => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const entry = USERS_DB[cleanUser];
    if (entry && entry.password === passwordInput.trim()) {
      setCurrentUser(entry.account);
      setUserProfiles(prev => ({
        ...prev,
        [cleanUser]: { ...entry.profile, ...(prev[cleanUser] || {}) }
      }));
      setIsLoginModalOpen(false);
      navigate('dashboard-view');
      showToast(`👋 Welcome back, ${entry.account.name}!`, `Logged in to Shine.`);
      return true;
    }
    showToast('Invalid Credentials', 'Please check username or password (shine@123)', 'warning');
    return false;
  };

  const switchUser = (targetUsername: string) => {
    const cleanUser = targetUsername.trim().toLowerCase();
    const entry = USERS_DB[cleanUser];
    if (entry) {
      setCurrentUser(entry.account);
      setUserProfiles(prev => ({
        ...prev,
        [cleanUser]: { ...entry.profile, ...(prev[cleanUser] || {}) }
      }));
      navigate('dashboard-view');
      showToast(`⚡ Logged in as ${entry.account.name}`, `Dashboard & Profile updated.`);
    }
  };

  const resetDemoData = (targetUsername?: string) => {
    try {
      localStorage.removeItem('shine_peerpath_current_user');
      localStorage.removeItem('shine_peerpath_experts');
      localStorage.removeItem('shine_peerpath_sessions');
      localStorage.removeItem('shine_peerpath_profiles_db');
    } catch (e) {
      console.warn('LocalStorage clear error', e);
    }

    const freshProfiles: Record<string, UserProfileData> = {
      prakash: JSON.parse(JSON.stringify(USERS_DB.prakash.profile)),
      akash: JSON.parse(JSON.stringify(USERS_DB.akash.profile)),
      nisha: JSON.parse(JSON.stringify(USERS_DB.nisha.profile))
    };

    const freshSessions = JSON.parse(JSON.stringify(initialSessions));
    const freshExperts = JSON.parse(JSON.stringify(EXPERTS_DB));

    setExperts(freshExperts);
    setSessions(freshSessions);
    setUserProfiles(freshProfiles);

    const target = targetUsername || currentUser?.username || 'prakash';
    const userToSet = USERS_DB[target]?.account || USERS_DB.prakash.account;
    setCurrentUser(userToSet);

    try {
      localStorage.setItem('shine_peerpath_current_user', JSON.stringify(userToSet));
      localStorage.setItem('shine_peerpath_experts', JSON.stringify(freshExperts));
      localStorage.setItem('shine_peerpath_sessions', JSON.stringify(freshSessions));
      localStorage.setItem('shine_peerpath_profiles_db', JSON.stringify(freshProfiles));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }

    navigate('dashboard-view');
    showToast('🔄 Demo Data Reset Complete', `All 3 personas (Prakash: Candidate, Nisha: Pitch, Akash: Mentor) restored to pristine state.`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(false);
    navigate('login-view', '/pages/myshine/login');
    showToast('Signed Out', 'You have been safely signed out of your Shine account.', 'info');
  };

  const selectExpertById = (expertId: string) => {
    const found = experts.find(e => e.id === expertId) || EXPERTS_DB.find(e => e.id === expertId);
    if (found) {
      setSelectedExpert(found);
      setBookingDraft(prev => ({ ...prev, expert: found }));
    }
  };

  const addExpert = (newExpertData: Omit<Expert, 'id'>): Expert => {
    const id = 'exp-' + Date.now();
    const fullExpert: Expert = { ...newExpertData, id };
    setExperts(prev => [fullExpert, ...prev]);
    showToast('🎉 Creator Profile Published!', `Your 1:1 Trajectory Mentorship is now live on Shine Peerpath.`);
    return fullExpert;
  };

  const bookSession = (expert: Expert, date: string, timeSlot: string): MentorshipSession => {
    const newSession: MentorshipSession = {
      id: 'sess-' + Date.now(),
      expert,
      candidateName: userProfile.name,
      candidateRole: userProfile.headline.split('|')[0]?.trim() || 'Senior Frontend Engineer',
      candidateAvatar: '/avatars/prakash.jpg',
      candidateGoal: 'Transition to Top Product Company / ₹18L-24L package & get resume reviewed',
      date,
      timeSlot,
      status: 'upcoming',
      meetingLink: `https://meet.shine.com/room/peerpath-${expert.id}-${Date.now().toString(36)}`
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession);
    showToast('✨ Mentorship Session Scheduled!', `Booked with ${expert.name} on ${date} at ${timeSlot}.`);
    return newSession;
  };

  const cancelSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'cancelled' } : s));
    showToast('Session Cancelled', 'Your session has been cancelled and refund initiated.', 'info');
  };

  const rescheduleSession = (sessionId: string, newDate: string, newTimeSlot: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, date: newDate, timeSlot: newTimeSlot } : s));
    showToast('Session Rescheduled', `Updated to ${newDate}, ${newTimeSlot}.`, 'success');
  };

  const completeSession = (sessionId: string, rating: number, notes: string, badgeTitle?: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s,
      status: 'completed',
      rating,
      feedbackNotes: notes,
      badgeAwarded: badgeTitle || 'Trajectory Competency Verified'
    } : s));

    if (badgeTitle && activeSession) {
      const newBadge: PeerVerifiedBadge = {
        id: 'badge-' + Date.now(),
        title: badgeTitle,
        subtitle: `Verified by ${activeSession.expert.name} • ${activeSession.expert.role} @ ${activeSession.expert.company}`,
        verifierName: activeSession.expert.name,
        verifierRole: `${activeSession.expert.role} @ ${activeSession.expert.company}`,
        verifierAvatar: activeSession.expert.avatar,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        skills: activeSession.expert.skills.slice(0, 4),
        status: 'verified'
      };
      awardBadge(newBadge);
    }
    showToast('🎉 Assessment Complete!', 'Skill badge and feedback updated on your profile.');
  };

  const updateUserProfile = (updates: Partial<UserProfileData>) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.prakash.profile;
      return {
        ...prev,
        [activeUsername]: { ...existing, ...updates }
      };
    });
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const updateProfileSummary = (summary: string) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.prakash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          summary,
          profileScore: Math.min(100, existing.profileScore + 5)
        }
      };
    });
    showToast('Summary Boosted (+5%)', 'Your profile strength is now higher for recruiters!');
  };

  const addSkill = (skill: string) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.prakash.profile;
      if (!existing.skills.includes(skill)) {
        return {
          ...prev,
          [activeUsername]: {
            ...existing,
            skills: [...existing.skills, skill],
            profileScore: Math.min(100, existing.profileScore + 2)
          }
        };
      }
      return prev;
    });
    showToast('Skill Added', `${skill} added to your verified profile.`);
  };

  const removeSkill = (skill: string) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.prakash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          skills: existing.skills.filter(s => s !== skill)
        }
      };
    });
    showToast('Skill Removed', `${skill} removed from profile.`, 'info');
  };

  const awardBadge = (newBadge: PeerVerifiedBadge) => {
    setUserProfiles(prev => {
      const targetUser = 'prakash';
      const existing = prev[targetUser] || USERS_DB.prakash.profile;
      return {
        ...prev,
        [targetUser]: {
          ...existing,
          badges: [newBadge, ...existing.badges.filter(b => b.title !== newBadge.title)],
          profileScore: Math.min(100, existing.profileScore + 8)
        }
      };
    });
  };

  const updateJobSearchStatus = (status: string) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.prakash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          jobSearchStatus: status
        }
      };
    });
    showToast('Job Status Updated', `Status changed to "${status}".`);
  };

  const updateMentorAvailability = (days: string[], timeSlots: string[]) => {
    setMentorAvailability({ days, timeSlots });
    showToast('Availability Saved', 'Your weekly mentorship slots have been updated.');
  };

  const updateMentorRatesAndAvailability = (rate: number, duration: number, days: string[], timeSlots: string[]) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.akash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          mentorRate: rate,
          mentorDuration: duration,
          mentorAvailability: { days, timeSlots }
        }
      };
    });
    setMentorAvailability({ days, timeSlots });
    showToast('Mentorship Settings Saved', `Session fee set to ₹${rate} & schedule updated!`);
  };

  const updateMentorTeaserVideo = (teaser: { url: string; title: string; duration?: string; thumbnail?: string; uploadedAt?: string } | null) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || USERS_DB[activeUsername]?.profile || USERS_DB.akash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          mentorTeaserVideo: teaser
        }
      };
    });
    showToast(teaser ? '🎉 Teaser Video Published!' : 'Teaser Video Removed', teaser ? 'Candidates can now watch your introduction on Peerpath.' : undefined);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        previousView,
        navigate,
        currentUser,
        isLoggedIn,
        login,
        logout,
        switchUser,
        resetDemoData,
        experts,
        selectedExpert,
        setSelectedExpert,
        selectExpertById,
        addExpert,
        sessions,
        activeSession,
        setActiveSession,
        bookSession,
        cancelSession,
        rescheduleSession,
        completeSession,
        userProfile,
        updateUserProfile,
        updateProfileSummary,
        addSkill,
        removeSkill,
        awardBadge,
        updateJobSearchStatus,
        mentorAvailability,
        updateMentorAvailability,
        updateMentorRatesAndAvailability,
        updateMentorTeaserVideo,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isCreatorWizardOpen,
        setIsCreatorWizardOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAssessmentModalOpen,
        setIsAssessmentModalOpen,
        assessmentDraftSession,
        setAssessmentDraftSession,
        bookingDraft,
        setBookingDraft,
        searchQuery,
        setSearchQuery,
        selectedJobCategory,
        setSelectedJobCategory,
        peerpathJobContext,
        setPeerpathJobContext,
        clearPeerpathJobContext,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
