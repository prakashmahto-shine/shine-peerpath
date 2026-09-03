import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expert, MentorshipSession, PeerVerifiedBadge, UserProfileData, ViewType } from '../types';
import { EXPERTS_DB } from '../data/expertsData';

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

  // User Profile (Dynamic Updates)
  userProfile: UserProfileData;
  updateUserProfile: (updates: Partial<UserProfileData>) => void;
  updateProfileSummary: (summary: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  awardBadge: (badge: PeerVerifiedBadge) => void;
  updateJobSearchStatus: (status: string) => void;

  // Modals
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isCreatorWizardOpen: boolean;
  setIsCreatorWizardOpen: (open: boolean) => void;
  bookingDraft: { expert: Expert; date: string; timeSlot: string };
  setBookingDraft: (draft: { expert: Expert; date: string; timeSlot: string }) => void;

  // Global Search & Toast Notifications
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
    expert: EXPERTS_DB[0], // Akash Jain
    candidateName: 'Prakash Mahto',
    date: 'Fri, 4 Sep 2026',
    timeSlot: '10:00 AM - 11:00 AM',
    status: 'upcoming',
    meetingLink: 'https://meet.shine.com/room/peerpath-akash-prakash'
  },
  {
    id: 'sess-2',
    expert: EXPERTS_DB[1], // Anirudh Sharma
    candidateName: 'Prakash Mahto',
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
  // Navigation
  const [currentView, setCurrentView] = useState<ViewType>('dashboard-view');
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

  const [selectedExpert, setSelectedExpert] = useState<Expert>(experts[0] || EXPERTS_DB[0]);

  // Dynamic Sessions
  const [sessions, setSessions] = useState<MentorshipSession[]>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_sessions');
      return saved ? JSON.parse(saved) : initialSessions;
    } catch {
      return initialSessions;
    }
  });

  const [activeSession, setActiveSession] = useState<MentorshipSession | null>(sessions[0] || null);

  // Dynamic User Profile
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_profile');
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  // Modals & Booking Draft
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isCreatorWizardOpen, setIsCreatorWizardOpen] = useState<boolean>(false);
  const [bookingDraft, setBookingDraft] = useState<{ expert: Expert; date: string; timeSlot: string }>({
    expert: experts[0] || EXPERTS_DB[0],
    date: 'Fri, 4 Sep 2026',
    timeSlot: '10:00 AM - 11:00 AM'
  });

  // Search & Toasts
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_experts', JSON.stringify(experts));
    } catch (e) {
      console.warn('Failed to persist experts to LocalStorage', e);
    }
  }, [experts]);

  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to persist sessions to LocalStorage', e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Failed to persist profile to LocalStorage', e);
    }
  }, [userProfile]);

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
    const pathToPush = customPath || (view === 'dashboard-view' ? '/' : `/${view.replace('-view', '')}`);
    if (window.location.pathname !== pathToPush) {
      window.history.pushState({}, '', pathToPush);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setUserProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const updateProfileSummary = (summary: string) => {
    setUserProfile(prev => ({
      ...prev,
      summary,
      profileScore: Math.min(100, prev.profileScore + 5) // Automatically boost score by 5%
    }));
    showToast('Summary Boosted (+5%)', 'Your profile strength is now higher for recruiters!');
  };

  const addSkill = (skill: string) => {
    if (!userProfile.skills.includes(skill)) {
      setUserProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        profileScore: Math.min(100, prev.profileScore + 2)
      }));
      showToast('Skill Added', `${skill} added to your verified profile.`);
    }
  };

  const removeSkill = (skill: string) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const awardBadge = (badge: PeerVerifiedBadge) => {
    setUserProfile(prev => ({
      ...prev,
      badges: [badge, ...prev.badges],
      profileScore: Math.min(100, prev.profileScore + 10)
    }));
    showToast('🏆 New Peer Badge Earned!', `${badge.title} is now visible to recruiters.`);
  };

  const updateJobSearchStatus = (status: string) => {
    setUserProfile(prev => ({ ...prev, jobSearchStatus: status }));
    showToast('Status Updated', `Job search status set to "${status}".`);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        previousView,
        navigate,
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
        isBookingModalOpen,
        setIsBookingModalOpen,
        isCreatorWizardOpen,
        setIsCreatorWizardOpen,
        bookingDraft,
        setBookingDraft,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
