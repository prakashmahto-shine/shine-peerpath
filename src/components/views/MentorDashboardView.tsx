import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Calendar, Clock, DollarSign, Star, CheckCircle2, 
  Award, ShieldCheck, UserCheck, Sparkles, FileText, Download,
  RotateCcw, ArrowRight, TrendingUp, Check, Settings, Eye, X, Loader2, BookOpen,
  Play, Film, Plus, Trash2, ExternalLink, Zap, Lock, CreditCard, RefreshCw, AlertCircle,
  SlidersHorizontal, User, Edit2, Unlock, Upload, UploadCloud, Code, Users, MessageSquare,
  ThumbsUp, Bell, Heart, Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { peerpathApi } from '../../services/api';
import { MentorshipSession, ZeroPrepDossier } from '../../types';

export interface MentorSessionOffering {
  id: string;
  category: string;
  title: string;
  duration: string;
  tag: string;
  description: string;
  price: number;
  icon: 'video' | 'award' | 'file' | 'code' | 'dollar';
  isEnabled: boolean;
}

export interface CandidateReviewItem {
  id: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar: string;
  rating: number;
  date: string;
  sessionType: string;
  comment: string;
  badgeAwarded?: string;
  isHelpfulCount: number;
  replyText?: string;
}

const candidateReviewsList: CandidateReviewItem[] = [
  {
    id: 'rev-1',
    candidateName: 'Prakash Mahto',
    candidateRole: 'Senior Frontend Engineer (4+ Years)',
    candidateAvatar: '/avatars/prakash.jpg',
    rating: 5,
    date: 'Yesterday, 4:30 PM',
    sessionType: '1:1 Career Transition & Architecture Teardown',
    comment: 'Akash completely transformed my approach to career transitions. The framework shared for handling interview objections and system design was invaluable! Received 2 recruiter calls directly after the badge was synced.',
    badgeAwarded: 'Tier-1 Frontend & UI Architecture Master',
    isHelpfulCount: 14
  },
  {
    id: 'rev-2',
    candidateName: 'Sneha Menon',
    candidateRole: 'Senior SDE-2 @ Fintech Firm',
    candidateAvatar: '/avatars/saheli.jpg',
    rating: 5,
    date: '4 Sep 2026',
    sessionType: 'Mock Interview & Recruiter Assessment',
    comment: 'The mock interview was ruthless in a good way. The best part was the verified badge added to my Shine profile — 2 recruiters contacted me directly next week with ₹28L+ packages.',
    badgeAwarded: 'Distributed Search & System Design Ready',
    isHelpfulCount: 19
  },
  {
    id: 'rev-3',
    candidateName: 'Rahul Kapoor',
    candidateRole: 'Product Engineer @ Healthtech SaaS',
    candidateAvatar: '/avatars/anirudh.jpg',
    rating: 5,
    date: '28 Aug 2026',
    sessionType: '1:1 Career Transition Call',
    comment: 'Akash pointed out 3 critical flaws in my pitch that were costing me interviews. Within 3 weeks of implementing his advice, I cleared the final round at Swiggy for a Senior role!',
    badgeAwarded: 'PRD Scoping & A/B Experimentation',
    isHelpfulCount: 24
  },
  {
    id: 'rev-4',
    candidateName: 'Vikramaditya Roy',
    candidateRole: 'Full Stack Tech Lead',
    candidateAvatar: '/avatars/prakash.jpg',
    rating: 5,
    date: '21 Aug 2026',
    sessionType: 'Salary Negotiation & Exec Coaching',
    comment: 'Direct, honest, and high-impact. He guided me on how to frame system design trade-offs and negotiate ₹34 LPA without counter-offers.',
    isHelpfulCount: 8
  },
  {
    id: 'rev-5',
    candidateName: 'Neha Sharma',
    candidateRole: 'Associate Product Manager',
    candidateAvatar: '/avatars/nisha.jpg',
    rating: 4.9,
    date: '15 Aug 2026',
    sessionType: '1:1 Career Transition Call',
    comment: 'Clear roadmap for moving from APM to PM-2 in consumer tech. The framework for metrics and North Star definition is top-notch.',
    badgeAwarded: 'Tier-1 Product Discovery & GTM',
    isHelpfulCount: 15
  }
];

export const MentorDashboardView: React.FC = () => {
  const { 
    currentUser, 
    userProfile,
    sessions: localSessions, 
    navigate, 
    selectExpertById,
    setActiveSession, 
    setIsAssessmentModalOpen,
    setAssessmentDraftSession,
    mentorAvailability,
    updateMentorAvailability,
    updateMentorRatesAndAvailability,
    updateMentorTeaserVideo,
    creatorActiveTab,
    setCreatorActiveTab,
    showToast
  } = useApp();

  // 4 Primary Clean Tabs: 'bookings' | 'reviews' | 'availability' | 'profile-settings'
  const initialTab = (creatorActiveTab === 'teaser' || creatorActiveTab === 'pricing' || creatorActiveTab === 'profile-settings') 
    ? 'profile-settings' 
    : (creatorActiveTab === 'reviews' ? 'reviews' : (creatorActiveTab === 'availability' ? 'availability' : 'bookings'));

  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews' | 'availability' | 'profile-settings'>(initialTab);
  
  // Sub-filter for sessions tab: 'upcoming' | 'completed'
  const [sessionSubFilter, setSessionSubFilter] = useState<'upcoming' | 'completed'>(
    creatorActiveTab === 'history' ? 'completed' : 'upcoming'
  );

  // Reviews filter
  const [reviewFilter, setReviewFilter] = useState<'all' | '5star' | 'badges'>('all');

  // 🔒 EXPLICIT EDIT MODE TOGGLES (FREEZE/LOCKED BY DEFAULT UNTIL "EDIT" IS CLICKED)
  const [isEditingAvailability, setIsEditingAvailability] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  const [liveSessions, setLiveSessions] = useState<MentorshipSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Sync tab with context if changed externally
  useEffect(() => {
    if (creatorActiveTab) {
      if (creatorActiveTab === 'teaser' || creatorActiveTab === 'pricing' || creatorActiveTab === 'profile-settings') {
        setActiveTab('profile-settings');
      } else if (creatorActiveTab === 'reviews') {
        setActiveTab('reviews');
      } else if (creatorActiveTab === 'availability') {
        setActiveTab('availability');
      } else if (creatorActiveTab === 'history') {
        setActiveTab('bookings');
        setSessionSubFilter('completed');
      } else {
        setActiveTab('bookings');
        setSessionSubFilter('upcoming');
      }
    }
  }, [creatorActiveTab]);

  const handleTabChange = (tab: 'bookings' | 'reviews' | 'availability' | 'profile-settings') => {
    setActiveTab(tab);
    setCreatorActiveTab(tab);
  };

  // Zero-Prep Dossier Modal State
  const [selectedDossier, setSelectedDossier] = useState<ZeroPrepDossier | null>(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState<boolean>(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);

  // Status & Vacation Mode
  const [isAcceptingBookings, setIsAcceptingBookings] = useState<boolean>(true);

  // Availability state
  const [selectedDays, setSelectedDays] = useState<string[]>(
    mentorAvailability.days && mentorAvailability.days.length > 0
      ? mentorAvailability.days
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );
  const [activeSlots, setActiveSlots] = useState<string[]>(
    mentorAvailability.timeSlots && mentorAvailability.timeSlots.length > 0
      ? mentorAvailability.timeSlots
      : ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '06:30 PM - 07:30 PM', '08:00 PM - 09:00 PM']
  );
  const [customSlotInput, setCustomSlotInput] = useState<string>('');
  const [bufferMinutes, setBufferMinutes] = useState<number>(15);
  const [minNoticeHours, setMinNoticeHours] = useState<number>(2);

  // Teaser Video & Profile Listing Form State
  const initialTeaserUrl = userProfile.mentorTeaserVideo?.url || 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4';
  const [hasTeaserVideo, setHasTeaserVideo] = useState<boolean>(Boolean(userProfile.mentorTeaserVideo !== null && initialTeaserUrl));
  const [teaserVideoUrl, setTeaserVideoUrl] = useState<string>(initialTeaserUrl);
  const [uploadedVideoName, setUploadedVideoName] = useState<string>('akash_teaser_pitch_60s.mp4');
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  const [teaserTitle, setTeaserTitle] = useState<string>(
    userProfile.mentorTeaserVideo?.title || 'How I Help Candidates Transition to Tier-1 Product & Architecture Roles (₹30L+ Target)'
  );
  const [headlineInput, setHeadlineInput] = useState<string>(
    userProfile.headline || currentUser?.headline || 'Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart'
  );
  const [bioInput, setBioInput] = useState<string>(
    userProfile.summary || 'Lead Product Manager at Shine (HT Media) heading Career Multiplier and Peerpath mentorship initiatives. Previously senior PM at Paytm and Flipkart. I mentor high-potential engineers and product thinkers targeting 3x compensation jumps and Tier-1 leadership transitions.'
  );
  const [skillsList, setSkillsList] = useState<string[]>(
    userProfile.skills && userProfile.skills.length > 0 
      ? userProfile.skills 
      : ['Product Strategy', 'System Architecture', 'Career Fast-Track', 'Mock Interviews', 'PRD Discovery']
  );
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // 1:1 Sessions & Pricing Form State
  const defaultInitialOfferings: MentorSessionOffering[] = [
    {
      id: 'offering-1',
      category: '1:1 Career Transition Call',
      title: '1:1 Career Transition Call',
      duration: '60 Mins',
      tag: 'Deep CV Audit',
      description: 'In-depth CV teardown, career transition roadmap for 3x jumps, and target tier-1 role gap audit.',
      price: userProfile.mentorRate || 999,
      icon: 'video',
      isEnabled: true
    },
    {
      id: 'offering-2',
      category: 'Mock Interview & Badge',
      title: 'Mock Interview & Badge',
      duration: '60 Mins',
      tag: 'Skill Assessment',
      description: 'Rigorous Tier-1 interview simulation. Unlock and issue Shine Verified Recruiter Skill Badge.',
      price: 1499,
      icon: 'award',
      isEnabled: true
    },
    {
      id: 'offering-3',
      category: 'Quick 30-min Resume Audit',
      title: 'Quick 30-min Resume Audit',
      duration: '30 Mins',
      tag: 'Inbound Advice',
      description: 'Rapid review of resume formatting, ATS keywords, and LinkedIn inbound optimization.',
      price: 499,
      icon: 'file',
      isEnabled: true
    }
  ];

  const [sessionOfferings, setSessionOfferings] = useState<MentorSessionOffering[]>(defaultInitialOfferings);
  const [sessionRate1, setSessionRate1] = useState<number>(userProfile.mentorRate || 999);
  const [isInstantBookingEnabled, setIsInstantBookingEnabled] = useState<boolean>(true);
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank'>('upi');
  const [upiId, setUpiId] = useState<string>('akash.jain@okaxis');
  const [bankAccount, setBankAccount] = useState<string>('918237461928');
  const [ifscCode, setIfscCode] = useState<string>('HDFC0001234');
  const [accountHolder, setAccountHolder] = useState<string>(currentUser?.name || 'Akash Jain');

  const mentorId = currentUser?.id || 'akash';
  const mentorName = currentUser?.name || 'Akash Jain';
  const mentorAvatar = currentUser?.avatar || '/avatars/akash.jpg';

  // 1. Fetch live sessions from Backend API
  useEffect(() => {
    let isCurrent = true;
    setIsLoadingSessions(true);

    peerpathApi.getSessions(mentorId, 'mentor')
      .then((sessions) => {
        if (isCurrent && sessions && sessions.length > 0) {
          setLiveSessions(sessions);
        } else if (isCurrent) {
          const filtered = localSessions.filter(s => 
            s.expert.id === mentorId || 
            s.expert.name.toLowerCase().includes(mentorName.split(' ')[0].toLowerCase())
          );
          setLiveSessions(filtered);
        }
      })
      .catch((err) => {
        console.warn('[API getSessions Fallback]:', err);
        if (isCurrent) {
          const filtered = localSessions.filter(s => 
            s.expert.id === mentorId || 
            s.expert.name.toLowerCase().includes(mentorName.split(' ')[0].toLowerCase())
          );
          setLiveSessions(filtered);
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingSessions(false);
      });

    // 2. Fetch live metrics from Backend API
    peerpathApi.getAnalytics()
      .then((data) => {
        if (isCurrent && data) {
          setAnalyticsData(data);
        }
      })
      .catch((err) => console.warn('[API getAnalytics Fallback]:', err));

    return () => {
      isCurrent = false;
    };
  }, [mentorId, mentorName, localSessions]);

  const upcomingMentorSessions = liveSessions.filter(s => s.status === 'upcoming');
  const completedMentorSessions = liveSessions.filter(s => s.status === 'completed');

  // Dynamic calculations
  const totalEarnings = completedMentorSessions.length * sessionRate1 + 28971;
  const badgesIssuedCount = completedMentorSessions.filter(s => s.badgeAwarded).length + 4;

  const handleHostCall = (session: MentorshipSession) => {
    setActiveSession(session);
    navigate('live-call-view');
  };

  const handleOpenAssessment = (session: MentorshipSession) => {
    setAssessmentDraftSession(session);
    setIsAssessmentModalOpen(true);
  };

  // Zero-Prep Dossier fetch from backend API
  const handleViewDossier = async (session: MentorshipSession) => {
    setIsLoadingDossier(true);
    setIsDossierModalOpen(true);
    try {
      const dossier = await peerpathApi.getZeroPrepDossier(session.id);
      setSelectedDossier(dossier);
    } catch (error) {
      console.warn('Fallback generating dossier:', error);
      setSelectedDossier({
        sessionId: session.id,
        candidate: {
          name: session.candidateName,
          headline: session.candidateRole || 'Senior Frontend Engineer',
          experienceYears: '4+ Years',
          currentCtc: '₹7.5 LPA',
          targetCtc: '₹22L - ₹34L',
          targetRole: 'Tier-1 High Growth Tech Lead',
          skills: ['React.js', 'TypeScript', 'Node.js', 'Redux', 'System Architecture'],
          summary: `${session.candidateName} is preparing for a transition to Tier-1 product companies. Goal: ${session.candidateGoal || 'CV review & system design mock'}.`
        },
        gapReport: {
          missingSkills: ['Micro-Frontend Architecture', 'System Scalability', 'Executive Tech Scoping'],
          targetJump: '3.2x Salary Multiplication',
          suggestedFocusAreas: [
            'Assess deep dive knowledge in component state synchronization',
            'Probe handling of high concurrency and distributed data structures',
            'Verify readiness for direct recruiter fast-track shortlist'
          ]
        },
        recommendedAssessmentRubric: [
          { category: 'Architecture & System Design', criteria: ['Micro-frontend isolation', 'Webpack Module Federation', 'State caching'] },
          { category: 'Code Quality & Typing', criteria: ['TypeScript generics', 'Performance profiling', 'Clean code'] },
          { category: 'Executive Communication', criteria: ['Structured answering', 'Trade-off justification'] }
        ],
        quickDiscussionPrompts: [
          `"Walk me through how you structured your latest large-scale frontend or fullstack refactor."`,
          `"If your service receives 50k concurrent requests, what breaks first in your current architecture?"`,
          `"How do you negotiate technical debt vs business deliverables with product leaders?"`
        ]
      });
    } finally {
      setIsLoadingDossier(false);
    }
  };

  // Availability handlers
  const toggleDay = (day: string) => {
    if (!isEditingAvailability) return;
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSlot = (slotStr: string) => {
    if (!isEditingAvailability) return;
    setActiveSlots(prev => 
      prev.includes(slotStr) ? prev.filter(s => s !== slotStr) : [...prev, slotStr]
    );
  };

  const handleAddCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingAvailability) return;
    if (!customSlotInput.trim()) return;
    if (!activeSlots.includes(customSlotInput.trim())) {
      setActiveSlots(prev => [...prev, customSlotInput.trim()]);
      setCustomSlotInput('');
      showToast('Time Slot Added', `Added slot "${customSlotInput.trim()}".`);
    }
  };

  const handleSaveAvailability = () => {
    updateMentorAvailability(selectedDays, activeSlots);
    updateMentorRatesAndAvailability(sessionRate1, 60, selectedDays, activeSlots);
    setIsEditingAvailability(false);
    showToast('Weekly Availability Saved', 'Your active days and slots have been updated and locked.');
  };

  const handleCancelAvailability = () => {
    setSelectedDays(mentorAvailability.days && mentorAvailability.days.length > 0 ? mentorAvailability.days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    setActiveSlots(mentorAvailability.timeSlots && mentorAvailability.timeSlots.length > 0 ? mentorAvailability.timeSlots : ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '06:30 PM - 07:30 PM', '08:00 PM - 09:00 PM']);
    setIsEditingAvailability(false);
  };

  // Teaser Upload & Delete Handlers
  const handleTriggerVideoUpload = () => {
    videoFileInputRef.current?.click();
  };

  const handleVideoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingVideo(true);
      const videoBlobUrl = URL.createObjectURL(file);
      setTimeout(() => {
        setTeaserVideoUrl(videoBlobUrl);
        setUploadedVideoName(file.name);
        setHasTeaserVideo(true);
        setIsUploadingVideo(false);
        showToast('Video Reel Selected', `Loaded "${file.name}" as 60-second teaser pitch. Click Save to publish.`, 'success');
      }, 500);
    }
  };

  const handleDeleteTeaserVideo = () => {
    setHasTeaserVideo(false);
    setTeaserVideoUrl('');
    setUploadedVideoName('');
    showToast('Teaser Video Removed', 'Your 60-sec teaser reel has been deleted from your listing.', 'info');
  };

  const handleVideoFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov'))) {
      setIsUploadingVideo(true);
      const videoBlobUrl = URL.createObjectURL(file);
      setTimeout(() => {
        setTeaserVideoUrl(videoBlobUrl);
        setUploadedVideoName(file.name);
        setHasTeaserVideo(true);
        setIsUploadingVideo(false);
        showToast('Video Reel Selected', `Loaded "${file.name}" as 60-second teaser pitch. Click Save to publish.`, 'success');
      }, 500);
    }
  };

  // Teaser & Profile Listing Handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingProfile) return;
    if (!newSkillInput.trim()) return;
    if (!skillsList.includes(newSkillInput.trim())) {
      setSkillsList(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!isEditingProfile) return;
    setSkillsList(prev => prev.filter(s => s !== skillToRemove));
  };

  const availableSessionCategories = [
    { name: '1:1 Career Transition Call', icon: 'video' as const, defaultDuration: '60 Mins', defaultTag: 'Career Strategy', defaultDesc: 'In-depth CV teardown, career transition roadmap for 3x jumps, and target tier-1 role gap audit.' },
    { name: 'Mock Interview & Badge', icon: 'award' as const, defaultDuration: '60 Mins', defaultTag: 'Skill Assessment', defaultDesc: 'Rigorous Tier-1 interview simulation. Unlock and issue Shine Verified Recruiter Skill Badge.' },
    { name: 'Quick 30-min Resume Audit', icon: 'file' as const, defaultDuration: '30 Mins', defaultTag: 'ATS & Keywords', defaultDesc: 'Rapid review of resume formatting, ATS keywords, and LinkedIn inbound optimization.' },
    { name: 'System Design & Architecture Mock', icon: 'code' as const, defaultDuration: '60 Mins', defaultTag: 'High Scalability', defaultDesc: 'Live system architecture whiteboard teardown, micro-frontend scoping, and concurrency review.' },
    { name: 'Salary Negotiation & Exec Coaching', icon: 'dollar' as const, defaultDuration: '45 Mins', defaultTag: '3x Compensation Jump', defaultDesc: 'Offer letter benchmarking, counter-offer strategy, ESOP evaluation, and executive level negotiation.' },
    { name: 'Custom 1:1 Mentorship', icon: 'video' as const, defaultDuration: '60 Mins', defaultTag: 'Tailored Session', defaultDesc: 'Custom one-on-one session tailored to candidate questions and career goals.' }
  ];

  const handleUpdateOffering = (id: string, field: keyof MentorSessionOffering, value: any) => {
    setSessionOfferings(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleCategoryChange = (id: string, newCategory: string) => {
    const preset = availableSessionCategories.find(c => c.name === newCategory);
    setSessionOfferings(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        category: newCategory,
        title: preset ? preset.name : newCategory,
        duration: preset ? preset.defaultDuration : item.duration,
        tag: preset ? preset.defaultTag : item.tag,
        description: preset ? preset.defaultDesc : item.description,
        icon: preset ? preset.icon : item.icon
      };
    }));
  };

  const handleAddOffering = () => {
    const newId = `offering-${Date.now()}`;
    const newOffering: MentorSessionOffering = {
      id: newId,
      category: 'System Design & Architecture Mock',
      title: 'System Design & Architecture Mock',
      duration: '60 Mins',
      tag: 'High Scalability',
      description: 'Live system architecture whiteboard teardown, micro-frontend scoping, and concurrency review.',
      price: 1999,
      icon: 'code',
      isEnabled: true
    };
    setSessionOfferings(prev => [...prev, newOffering]);
    showToast('New Session Offering Added', 'Customize category, title, duration, and pricing.', 'success');
  };

  const handleDeleteOffering = (id: string) => {
    if (sessionOfferings.length <= 1) {
      showToast('Cannot Remove', 'You must maintain at least one active session offering.', 'info');
      return;
    }
    setSessionOfferings(prev => prev.filter(item => item.id !== id));
    showToast('Session Offering Removed', 'The session type has been removed from your listing.', 'info');
  };

  const handleToggleOffering = (id: string) => {
    setSessionOfferings(prev => prev.map(item => item.id === id ? { ...item, isEnabled: !item.isEnabled } : item));
  };

  const renderOfferingIcon = (icon: string) => {
    switch (icon) {
      case 'award': return <Award size={18} />;
      case 'file': return <FileText size={18} />;
      case 'code': return <Code size={18} />;
      case 'dollar': return <DollarSign size={18} />;
      case 'video':
      default: return <Video size={18} />;
    }
  };

  const getIconClass = (icon: string) => {
    switch (icon) {
      case 'award': return 'icon-amber';
      case 'file': return 'icon-green';
      case 'code': return 'icon-blue';
      case 'dollar': return 'icon-indigo';
      case 'video':
      default: return 'icon-purple';
    }
  };

  const handleSaveAllSettings = () => {
    if (hasTeaserVideo && teaserVideoUrl) {
      updateMentorTeaserVideo({
        url: teaserVideoUrl,
        title: teaserTitle,
        duration: '0:58 min',
        thumbnail: mentorAvatar,
        uploadedAt: 'Today'
      });
    } else {
      updateMentorTeaserVideo(null);
    }
    const primaryRate = sessionOfferings.find(o => o.isEnabled)?.price || sessionOfferings[0]?.price || 999;
    setSessionRate1(primaryRate);
    updateMentorRatesAndAvailability(primaryRate, 60, selectedDays, activeSlots);
    setIsEditingProfile(false);
    showToast('Profile & Pricing Saved', `Your public listing, ${sessionOfferings.filter(o => o.isEnabled).length} session offerings, and rates have been saved & published!`);
  };

  const handleCancelProfile = () => {
    setHasTeaserVideo(Boolean(userProfile.mentorTeaserVideo?.url || initialTeaserUrl));
    setTeaserVideoUrl(userProfile.mentorTeaserVideo?.url || initialTeaserUrl);
    setTeaserTitle(userProfile.mentorTeaserVideo?.title || 'How I Help Candidates Transition to Tier-1 Product & Architecture Roles (₹30L+ Target)');
    setHeadlineInput(userProfile.headline || currentUser?.headline || 'Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart');
    setBioInput(userProfile.summary || 'Lead Product Manager at Shine (HT Media)...');
    setSkillsList(userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills : ['Product Strategy', 'System Architecture', 'Career Fast-Track', 'Mock Interviews', 'PRD Discovery']);
    setSessionOfferings(defaultInitialOfferings);
    setSessionRate1(userProfile.mentorRate || 999);
    setIsEditingProfile(false);
  };

  const standardAvailableSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:30 PM - 05:30 PM',
    '06:30 PM - 07:30 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM'
  ];

  const daysOfWeek = [
    { key: 'Mon', label: 'Monday' },
    { key: 'Tue', label: 'Tuesday' },
    { key: 'Wed', label: 'Wednesday' },
    { key: 'Thu', label: 'Thursday' },
    { key: 'Fri', label: 'Friday' },
    { key: 'Sat', label: 'Saturday' },
    { key: 'Sun', label: 'Sunday' }
  ];

  const videoPresets = [
    {
      name: 'Product Leadership Pitch',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
      title: 'How I Help Candidates Transition to Tier-1 Product & Architecture Roles (₹30L+ Target)'
    },
    {
      name: 'System Architecture Teardown',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41808-large.mp4',
      title: 'System Design & High-Concurrency Live Teardown Masterclass (60s Overview)'
    },
    {
      name: '3x Compensation Multiplier',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-giving-a-speech-at-an-event-42354-large.mp4',
      title: 'Breaking the Mid-Tier Ceiling: Step-by-Step Salary & Promotion Multiplier'
    }
  ];

  return (
    <div className="content-wrapper mentor-portal-wrapper">
      
      {/* Hidden File Input for Video Reel Upload */}
      <input 
        type="file" 
        ref={videoFileInputRef}
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleVideoFileSelected}
        style={{ display: 'none' }}
      />

      {/* Creator Studio Hero Card with TOP TABS */}
      <div className="mentor-hero-card">
        <div className="mentor-hero-top">
          <div className="mentor-profile-group">
            <div className="mentor-avatar-wrap">
              <img 
                src={mentorAvatar} 
                alt={mentorName} 
                className="mentor-hero-avatar"
              />
              <span className="mentor-verified-check"><CheckCircle2 size={14} /></span>
            </div>
            
            <div className="mentor-profile-info">
              <div className="mentor-name-row">
                <h1 className="mentor-hero-title">{mentorName}</h1>
                <span className="mentor-portal-badge">
                  <ShieldCheck size={13} /> Verified Lead Mentor
                </span>
                <button 
                  type="button" 
                  className={`mentor-live-status-pill ${isAcceptingBookings ? 'status-active' : 'status-paused'}`}
                  onClick={() => {
                    const nextStatus = !isAcceptingBookings;
                    setIsAcceptingBookings(nextStatus);
                    showToast(
                      nextStatus ? '🟢 Bookings Resumed' : '⏸️ Vacation Mode (Bookings Paused)',
                      nextStatus ? 'Candidates can book 1:1 sessions.' : 'Your calendar is temporarily hidden from candidate search.',
                      nextStatus ? 'success' : 'info'
                    );
                  }}
                  title="Click to toggle availability status"
                >
                  <span className={isAcceptingBookings ? "mentor-pulse-green" : "mentor-pulse-amber"}></span>
                  <span>{isAcceptingBookings ? 'Accepting Bookings' : 'Vacation Mode (Paused)'}</span>
                </button>
              </div>
              <p className="mentor-hero-role">{headlineInput}</p>
              <div className="mentor-meta-row">
                <div className="mentor-star-rating">
                  <Star size={13} className="star-gold" fill="#F59E0B" />
                  <strong>4.95</strong>
                  <span>(145 reviews)</span>
                </div>
                <span className="mentor-meta-dot">•</span>
                <span className="mentor-meta-item">
                  <span>Session Rate:</span>
                  <strong>₹{sessionRate1} / hr</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mentor-hero-quick-actions">
            <button 
              type="button" 
              className="btn-preview-public-listing"
              onClick={() => {
                selectExpertById(mentorId);
                navigate('expert-profile-view', `/mentor/${mentorId}`);
              }}
              title="See how candidates view your profile"
            >
              <Eye size={15} />
              <span>Preview Public Profile</span>
            </button>
          </div>
        </div>

        {/* 4 Core Mentor Metrics inside Hero Card (Earnings, Followers, Badges, Sessions) */}
        <div className="mentor-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '20px', paddingTop: '18px', borderTop: '1px solid #F1F5F9' }}>
          <div className="mm-tile">
            <div className="mm-icon-wrap icon-green"><DollarSign size={18} /></div>
            <div>
              <span className="mm-label">Total Earnings</span>
              <strong className="mm-val">₹{totalEarnings.toLocaleString('en-IN')}</strong>
              <span className="mm-sub">0% Fee • 100% Direct Payout</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-purple"><Users size={18} /></div>
            <div>
              <span className="mm-label">Total Followers</span>
              <strong className="mm-val">1,840</strong>
              <span className="mm-sub">+28 new • WhatsApp Alert Reach</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-indigo"><Award size={18} /></div>
            <div>
              <span className="mm-label">Badges Awarded</span>
              <strong className="mm-val">{badgesIssuedCount}</strong>
              <span className="mm-sub">Verified skill credentials</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-blue"><CheckCircle2 size={18} /></div>
            <div>
              <span className="mm-label">Completed Sessions</span>
              <strong className="mm-val">{completedMentorSessions.length + 30}</strong>
              <span className="mm-sub">100% attendance rate</span>
            </div>
          </div>
        </div>

      </div>

      {/* 🌟 MAIN NAVIGATION TABS (BELOW HERO CARD) */}
      <div className="clean-studio-nav-bar">
        <div className="clean-tab-segment-group">
          
          {/* TAB 1: SESSIONS & CALLS */}
          <button 
            type="button"
            className={`cs-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            <Calendar size={16} />
            <span>Sessions & Calls</span>
            <span className="cs-tab-pill">{upcomingMentorSessions.length}</span>
          </button>

          {/* TAB 2: CANDIDATE REVIEWS & FEEDBACK */}
          <button 
            type="button"
            className={`cs-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabChange('reviews')}
          >
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <span>Reviews & Ratings</span>
            <span className="cs-tab-pill-neutral">145 Reviews</span>
          </button>

          {/* TAB 3: AVAILABILITY & SLOTS */}
          <button 
            type="button"
            className={`cs-tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => handleTabChange('availability')}
          >
            <Clock size={16} />
            <span>Availability & Slots</span>
            <span className="cs-tab-pill-neutral">{activeSlots.length} Active</span>
          </button>

          {/* TAB 4: PROFILE, TEASER & PRICING */}
          <button 
            type="button"
            className={`cs-tab-btn ${activeTab === 'profile-settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile-settings')}
          >
            <Settings size={16} />
            <span>Profile, Teaser & Pricing</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SESSIONS & CALLS (DIRECT BOOKINGS & CALLS VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="mentor-cards-stack">

          {/* Clean Sub-Filter Switch: Upcoming vs Completed */}
          <div className="cs-sub-filter-row">
            <div className="cs-sub-filter-group">
              <button 
                type="button"
                className={`cs-sub-pill ${sessionSubFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setSessionSubFilter('upcoming')}
              >
                <Video size={14} />
                <span>Upcoming Bookings ({upcomingMentorSessions.length})</span>
              </button>

              <button 
                type="button"
                className={`cs-sub-pill ${sessionSubFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setSessionSubFilter('completed')}
              >
                <Award size={14} />
                <span>Completed History ({completedMentorSessions.length + 30})</span>
              </button>
            </div>
          </div>

          {/* 1A. Upcoming Bookings List */}
          {sessionSubFilter === 'upcoming' && (
            isLoadingSessions ? (
              <div className="empty-mentor-box">
                <Loader2 size={28} className="animate-spin text-purple-600 mb-2" />
                <h3>Loading candidate bookings from API...</h3>
              </div>
            ) : upcomingMentorSessions.length === 0 ? (
              <div className="empty-mentor-box">
                <Sparkles size={32} className="text-amber-500" />
                <h3>No pending bookings right now</h3>
                <p>Your calendar is open and live. New candidate bookings will appear here instantly.</p>
                <button 
                  type="button" 
                  className="btn-shine-gold-sm mt-3"
                  onClick={() => handleTabChange('availability')}
                >
                  Manage Open Time Slots
                </button>
              </div>
            ) : (
              upcomingMentorSessions.map((sess) => (
                <div key={sess.id} className="mentor-session-card">
                  
                  {/* Top: Candidate Info */}
                  <div className="msc-top-row">
                    <div className="msc-candidate-meta">
                      <img 
                        src={sess.candidateAvatar || '/avatars/prakash.jpg'} 
                        alt={sess.candidateName} 
                        className="msc-candidate-avatar"
                      />
                      <div className="msc-candidate-info">
                        <div className="msc-name-tag-row">
                          <h3 className="msc-cand-name">{sess.candidateName}</h3>
                          <span className="msc-badge-confirmed">
                            <span className="sc-pulse-dot"></span> Confirmed 1:1 Booking
                          </span>
                        </div>
                        <p className="msc-cand-role">{sess.candidateRole || 'Senior Frontend Engineer (4+ Years)'}</p>
                        <p className="msc-cand-goal">
                          🎯 <strong>Target Jump Goal:</strong> {sess.candidateGoal || 'Targeting ₹18L–₹24L Product Role Jump & 1:1 Resume Teardown'}
                        </p>
                      </div>
                    </div>

                    <div className="msc-payout-box">
                      <span className="msc-payout-label">Your Payout</span>
                      <strong className="msc-payout-amount">₹{sessionRate1}</strong>
                      <span className="msc-payout-status">0% Platform Fee • Bank Transfer</span>
                    </div>
                  </div>

                  {/* Middle: Pre-loaded Resume & Schedule Bar */}
                  <div className="msc-meta-strip">
                    <div className="msc-strip-item">
                      <Calendar size={15} className="text-blue-600" />
                      <span><strong>Date:</strong> {sess.date}</span>
                    </div>

                    <div className="msc-strip-item">
                      <Clock size={15} className="text-amber-600" />
                      <span><strong>Time:</strong> {sess.timeSlot}</span>
                    </div>

                    <div className="msc-strip-item resume-strip-item">
                      <BookOpen size={15} className="text-emerald-600" />
                      <span>Candidate Dossier: <strong>AI Gap Teardown Ready</strong></span>
                      <button 
                        type="button" 
                        className="btn-preview-cv-inline"
                        onClick={() => handleViewDossier(sess)}
                        title="View AI Candidate Briefing & Zero-Prep Dossier"
                      >
                        <Eye size={12} /> View Zero-Prep Dossier
                      </button>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="msc-footer-actions">
                    <div className="msc-left-btn-group">
                      <button 
                        type="button" 
                        className="btn-msc-reschedule"
                        onClick={() => {
                          showToast('Reschedule Prompt Sent', `Candidate ${sess.candidateName} has been notified.`, 'info');
                        }}
                      >
                        <RotateCcw size={14} /> Request Reschedule
                      </button>

                      <button 
                        type="button" 
                        className="btn-msc-assessment"
                        onClick={() => handleOpenAssessment(sess)}
                      >
                        <Award size={15} className="text-purple-600" />
                        <span>Issue Verified Skill Badge</span>
                      </button>
                    </div>

                    <button 
                      type="button" 
                      className="btn-msc-host-room"
                      onClick={() => handleHostCall(sess)}
                    >
                      <span className="live-cam-pulse-dot"></span>
                      <Video size={16} />
                      <span>Host / Start Video Room</span>
                    </button>
                  </div>

                </div>
              ))
            )
          )}

          {/* 1B. Completed History List */}
          {sessionSubFilter === 'completed' && (
            <div className="mentor-cards-stack">
              <div className="mentor-session-card history-card">
                <div className="msc-top-row">
                  <div className="msc-candidate-meta">
                    <img src="/avatars/prakash.jpg" alt="Prakash" className="msc-candidate-avatar" />
                    <div className="msc-candidate-info">
                      <h3 className="msc-cand-name">Prakash Mahto</h3>
                      <p className="msc-cand-role">Senior Frontend Developer • Completed on 28 Aug 2026</p>
                    </div>
                  </div>
                  <span className="sc-badge-completed">
                    <CheckCircle2 size={14} /> ₹999 Paid Out (0% Fee)
                  </span>
                </div>

                <div className="sc-outcome-highlight-box">
                  <div className="sc-outcome-icon-wrap">
                    <Award size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="sc-outcome-title">Badge Awarded: "Tier-1 Frontend & UI Architecture"</h4>
                    <p className="sc-outcome-notes">
                      "Prakash demonstrated deep understanding of Next.js hydration, Web Vitals profiling, and state caching. Verified for Senior Frontend roles."
                    </p>
                  </div>
                </div>
              </div>

              <div className="mentor-session-card history-card" style={{ marginTop: '16px' }}>
                <div className="msc-top-row">
                  <div className="msc-candidate-meta">
                    <img src="/avatars/anirudh.jpg" alt="Ankit" className="msc-candidate-avatar" />
                    <div className="msc-candidate-info">
                      <h3 className="msc-cand-name">Ankit Verma</h3>
                      <p className="msc-cand-role">Product Analyst • Completed on 22 Aug 2026</p>
                    </div>
                  </div>
                  <span className="sc-badge-completed">
                    <CheckCircle2 size={14} /> ₹1,499 Paid Out (0% Fee)
                  </span>
                </div>

                <div className="sc-outcome-highlight-box">
                  <div className="sc-outcome-icon-wrap">
                    <Award size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="sc-outcome-title">Badge Awarded: "PRD Scoping & A/B Experimentation"</h4>
                    <p className="sc-outcome-notes">
                      "Simulated a Tier-1 product mock interview. Clear hypothesis formulation and metric trade-off justification."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CANDIDATE REVIEWS & RATINGS (FEEDBACK FEED) */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="mentor-cards-stack">
          
          {/* Top Rating Breakdown & Follower Reach Overview */}
          <div className="reviews-dashboard-overview-grid">
            
            {/* Overall Score Card */}
            <div className="rdo-card rdo-score-box">
              <div className="rdo-score-main">
                <strong className="rdo-score-number">4.95</strong>
                <div className="rdo-stars-col">
                  <div className="rdo-stars-row">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span className="rdo-review-count">Based on <strong>145 Verified Candidate Reviews</strong></span>
                </div>
              </div>

              <div className="rdo-breakdown-bars">
                <div className="rdo-bar-row">
                  <span className="rdo-bar-lbl">5 Star</span>
                  <div className="rdo-track"><div className="rdo-fill" style={{ width: '96%' }}></div></div>
                  <span className="rdo-bar-pct">96% (139)</span>
                </div>
                <div className="rdo-bar-row">
                  <span className="rdo-bar-lbl">4 Star</span>
                  <div className="rdo-track"><div className="rdo-fill" style={{ width: '4%' }}></div></div>
                  <span className="rdo-bar-pct">4% (6)</span>
                </div>
                <div className="rdo-bar-row">
                  <span className="rdo-bar-lbl">3 Star</span>
                  <div className="rdo-track"><div className="rdo-fill" style={{ width: '0%' }}></div></div>
                  <span className="rdo-bar-pct">0%</span>
                </div>
              </div>
            </div>

            {/* Social Proof & Follower Reach Card */}
            <div className="rdo-card rdo-community-box">
              <div className="rdo-comm-header">
                <div className="rdo-comm-icon"><Users size={20} /></div>
                <div>
                  <h4>1,840 Active Followers</h4>
                  <span className="rdo-comm-sub">Candidates subscribed to your mentorship alerts</span>
                </div>
              </div>

              <div className="rdo-reach-perks">
                <div className="rdo-perk-item">
                  <span className="rdo-perk-bullet">⚡</span>
                  <div>
                    <strong>Instant Broadcast Reach:</strong>
                    <p>When you open new slots or host AMAs, all 1,840 followers get instant WhatsApp alerts.</p>
                  </div>
                </div>

                <div className="rdo-perk-item">
                  <span className="rdo-perk-bullet">🏆</span>
                  <div>
                    <strong>100% Recommendation Rate:</strong>
                    <p>94% of reviewed candidates landed interviews within 30 days of your mentorship.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Review Filter Bar */}
          <div className="cs-sub-filter-row">
            <div className="cs-sub-filter-group">
              <button 
                type="button" 
                className={`cs-sub-pill ${reviewFilter === 'all' ? 'active' : ''}`}
                onClick={() => setReviewFilter('all')}
              >
                <MessageSquare size={14} />
                <span>All Candidate Feedback (145)</span>
              </button>

              <button 
                type="button" 
                className={`cs-sub-pill ${reviewFilter === 'badges' ? 'active' : ''}`}
                onClick={() => setReviewFilter('badges')}
              >
                <Award size={14} />
                <span>With Verified Badges Awarded (28)</span>
              </button>

              <button 
                type="button" 
                className={`cs-sub-pill ${reviewFilter === '5star' ? 'active' : ''}`}
                onClick={() => setReviewFilter('5star')}
              >
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>5-Star Testimonials (139)</span>
              </button>
            </div>
          </div>

          {/* Reviews List Stack */}
          <div className="creator-reviews-feed-stack">
            {candidateReviewsList
              .filter(rev => {
                if (reviewFilter === 'badges') return Boolean(rev.badgeAwarded);
                if (reviewFilter === '5star') return rev.rating === 5;
                return true;
              })
              .map((rev) => (
                <div key={rev.id} className="creator-review-card">
                  <div className="crc-header-row">
                    <div className="crc-candidate-meta">
                      <img src={rev.candidateAvatar} alt={rev.candidateName} className="crc-avatar" />
                      <div>
                        <div className="crc-name-row">
                          <strong className="crc-name">{rev.candidateName}</strong>
                          <span className="crc-verified-student-tag">
                            <CheckCircle2 size={12} /> Verified Session Candidate
                          </span>
                        </div>
                        <p className="crc-role">{rev.candidateRole}</p>
                      </div>
                    </div>

                    <div className="crc-rating-meta">
                      <div className="crc-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                      <span className="crc-date">{rev.date}</span>
                    </div>
                  </div>

                  <div className="crc-session-tag-row">
                    <span className="crc-session-pill">
                      <Video size={12} /> {rev.sessionType}
                    </span>
                    {rev.badgeAwarded && (
                      <span className="crc-badge-pill">
                        <Award size={12} /> Awarded: <strong>"{rev.badgeAwarded}"</strong>
                      </span>
                    )}
                  </div>

                  <p className="crc-comment-text">
                    "{rev.comment}"
                  </p>

                  <div className="crc-footer-actions">
                    <div className="crc-helpful-tag">
                      <ThumbsUp size={13} className="text-emerald-600" />
                      <span>{rev.isHelpfulCount} candidates found this review helpful</span>
                    </div>

                    <div className="crc-action-buttons">
                      <button 
                        type="button" 
                        className="btn-crc-action"
                        onClick={() => showToast('💬 Thank You Sent!', `Sent a direct thank you note to ${rev.candidateName}.`, 'success')}
                      >
                        <Heart size={13} className="text-rose-500" />
                        <span>Send Thank You</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn-crc-action"
                        onClick={() => showToast('⭐ Review Pinned!', `This review is now spotlighted on your public mentor page.`, 'success')}
                      >
                        <Star size={13} className="text-amber-500" />
                        <span>Feature on Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AVAILABILITY & SLOTS SCHEDULER */}
      {/* ========================================================================= */}
      {activeTab === 'availability' && (
        <div className="mentor-settings-panel-card">
          <div className="msp-section-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 className="msp-section-title">Weekly Mentorship Availability & Slots</h3>
                {isEditingAvailability ? (
                  <span className="msp-status-pill-editing">
                    <Sparkles size={12} /> Editing Mode
                  </span>
                ) : (
                  <span className="msp-status-pill-locked">
                    <Lock size={12} /> Live & Saved
                  </span>
                )}
              </div>
              <p className="msp-section-desc">
                {isEditingAvailability 
                  ? 'Click on days or slots below to toggle active hours. Add custom slots or change buffer times.' 
                  : 'Your active weekly schedule for candidate bookings. Click "Edit Availability" to make changes.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {isEditingAvailability ? (
                <>
                  <button 
                    type="button" 
                    className="btn-cancel-sm"
                    onClick={handleCancelAvailability}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-shine-gold-sm"
                    onClick={handleSaveAvailability}
                  >
                    <Check size={14} /> Save Availability
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="btn-edit-mode-toggle"
                  onClick={() => setIsEditingAvailability(true)}
                >
                  <Edit2 size={14} />
                  <span>Edit Availability</span>
                </button>
              )}
            </div>
          </div>

          {/* 1. Active Working Days of Week */}
          <div className="msp-form-group">
            <label className="msp-label">
              <span>Active Working Days</span>
              <span className="msp-label-hint">
                {isEditingAvailability ? 'Click days to toggle active availability' : 'Currently active days'}
              </span>
            </label>
            <div className="msp-days-selector-grid">
              {daysOfWeek.map(({ key, label }) => {
                const isSelected = selectedDays.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!isEditingAvailability}
                    className={`msp-day-chip ${isSelected ? 'day-selected' : 'day-unselected'} ${!isEditingAvailability ? 'chip-frozen' : ''}`}
                    onClick={() => toggleDay(key)}
                  >
                    <span className="day-key">{key}</span>
                    <span className="day-full">{label}</span>
                    {isSelected && <span className="day-check-icon"><Check size={12} /></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Daily Time Slots Grid */}
          <div className="msp-form-group" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="msp-label" style={{ margin: 0 }}>
                <span>Available Time Slots ({activeSlots.length} Active)</span>
                <span className="msp-label-hint">
                  {isEditingAvailability ? 'Click slots to toggle Active / Disabled' : 'Slots open on candidate booking calendar'}
                </span>
              </label>
            </div>

            <div className="mac-slots-grid">
              {standardAvailableSlots.map((slot) => {
                const isSelected = activeSlots.includes(slot);
                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={!isEditingAvailability}
                    className={`mac-slot-toggle ${isSelected ? 'slot-enabled' : 'slot-disabled'} ${!isEditingAvailability ? 'slot-frozen' : ''}`}
                    onClick={() => toggleSlot(slot)}
                  >
                    <div className="mac-slot-left">
                      <Clock size={15} />
                      <span>{slot}</span>
                    </div>
                    <span className="mac-status-chip">
                      {isSelected ? <><Check size={12} /> Active</> : 'Disabled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Add Custom Slot (Only in Edit Mode) */}
          {isEditingAvailability && (
            <div className="msp-custom-slot-row">
              <form onSubmit={handleAddCustomSlot} style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Clock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                  <input 
                    type="text" 
                    className="msp-input-with-icon" 
                    placeholder="e.g. 07:00 AM - 08:00 AM or 10:00 PM - 11:00 PM"
                    value={customSlotInput}
                    onChange={(e) => setCustomSlotInput(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-outline-dark-sm">
                  <Plus size={14} /> Add Custom Slot
                </button>
              </form>
            </div>
          )}

          {/* 4. Buffer & Booking Rules */}
          <div className="msp-preferences-grid" style={{ marginTop: '24px' }}>
            <div className="msp-pref-box">
              <label className="msp-pref-label">Buffer Time Between Calls</label>
              <p className="msp-pref-desc">Time break between consecutive video sessions</p>
              {isEditingAvailability ? (
                <div className="msp-pill-selector">
                  {[10, 15, 30].map(mins => (
                    <button 
                      key={mins} 
                      type="button" 
                      className={`msp-pill-btn ${bufferMinutes === mins ? 'active' : ''}`}
                      onClick={() => setBufferMinutes(mins)}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              ) : (
                <span className="msp-readonly-tag">⏱️ {bufferMinutes} mins buffer</span>
              )}
            </div>

            <div className="msp-pref-box">
              <label className="msp-pref-label">Minimum Advance Notice</label>
              <p className="msp-pref-desc">How early candidate must book before session starts</p>
              {isEditingAvailability ? (
                <div className="msp-pill-selector">
                  {[1, 2, 6, 24].map(hours => (
                    <button 
                      key={hours} 
                      type="button" 
                      className={`msp-pill-btn ${minNoticeHours === hours ? 'active' : ''}`}
                      onClick={() => setMinNoticeHours(hours)}
                    >
                      {hours} {hours === 1 ? 'hour' : 'hours'}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="msp-readonly-tag">🔔 Minimum {minNoticeHours} {minNoticeHours === 1 ? 'hour' : 'hours'} advance notice</span>
              )}
            </div>
          </div>

          <div className="mac-footer-note" style={{ marginTop: '20px' }}>
            <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
            <span>All schedule updates are automatically synced to candidate booking modals in real-time.</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: UNIFIED PROFILE, TEASER VIDEO & PRICING SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'profile-settings' && (
        <div className="mentor-settings-panel-card">
          <div className="msp-section-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 className="msp-section-title">Mentor Profile, 60s Teaser & Session Pricing</h3>
                {isEditingProfile ? (
                  <span className="msp-status-pill-editing">
                    <Sparkles size={12} /> Editing Mode
                  </span>
                ) : (
                  <span className="msp-status-pill-locked">
                    <Lock size={12} /> Listing Published
                  </span>
                )}
              </div>
              <p className="msp-section-desc">
                {isEditingProfile 
                  ? 'Upload or delete your 60-second video pitch, update bio, session rates, and 0% platform commission payout settings.' 
                  : 'Your live public mentor listing details on Peerpath. Click "Edit Profile & Rates" to modify.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {isEditingProfile ? (
                <>
                  <button 
                    type="button" 
                    className="btn-cancel-sm"
                    onClick={handleCancelProfile}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-shine-gold-sm"
                    onClick={handleSaveAllSettings}
                  >
                    <Check size={14} /> Save Profile & Rates
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="btn-edit-mode-toggle"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit2 size={14} />
                  <span>Edit Profile & Rates</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Video Pitch & Teaser Reel */}
          <div className="msp-unified-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 className="msp-sub-section-title" style={{ margin: 0 }}>
                <Film size={16} className="text-purple-600" />
                <span>1. 60-Second Video Introduction & Teaser Reel</span>
              </h4>
              
              {/* Top Quick Actions */}
              {isEditingProfile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-teaser-action-upload"
                    onClick={handleTriggerVideoUpload}
                    title="Upload video from your computer"
                  >
                    <Upload size={13} />
                    <span>{hasTeaserVideo ? 'Upload New Video' : 'Upload Video File'}</span>
                  </button>

                  {hasTeaserVideo && (
                    <button 
                      type="button" 
                      className="btn-teaser-action-delete"
                      onClick={handleDeleteTeaserVideo}
                      title="Delete video teaser"
                    >
                      <Trash2 size={13} />
                      <span>Delete Teaser</span>
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn-teaser-action-upload"
                  onClick={() => setIsEditingProfile(true)}
                  title="Edit or change teaser video"
                >
                  <Edit2 size={13} />
                  <span>Edit Teaser</span>
                </button>
              )}
            </div>

            <p className="msp-sub-section-desc">
              Candidates watch this video before booking a 1:1 call with you. It increases your booking conversion by 3.4x.
            </p>

            {/* Video Player Box OR Empty Upload Dropzone */}
            {hasTeaserVideo && teaserVideoUrl ? (
              <div className="msp-teaser-layout-grid">
                <div>
                  <div 
                    className={`msp-video-preview-wrapper ${isDragOver ? 'border-purple-500' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleVideoFileDrop}
                  >
                    <span className="msp-video-badge">
                      <Film size={12} /> 60s Live Preview Reel
                    </span>
                    
                    {isUploadingVideo ? (
                      <div style={{ height: '190px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                        <Loader2 size={28} className="animate-spin text-purple-400 mb-2" />
                        <span style={{ fontSize: '12px' }}>Processing uploaded video...</span>
                      </div>
                    ) : (
                      <video 
                        controls 
                        poster={mentorAvatar}
                        src={teaserVideoUrl}
                        className="msp-preview-video"
                      />
                    )}

                    <div className="msp-video-meta-box">
                      <span className="msp-video-time">⏱️ 0:58 min</span>
                      <span className="msp-video-status text-emerald-600 font-semibold">● HD 1080p Ready</span>
                    </div>
                  </div>

                  {/* Below Video Action Controls */}
                  {isEditingProfile ? (
                    <div className="msp-video-action-bar">
                      <button 
                        type="button" 
                        className="btn-video-action-primary"
                        onClick={handleTriggerVideoUpload}
                        title="Upload a new video file from your computer"
                      >
                        <Upload size={13} />
                        <span>Replace Video File</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn-video-action-danger"
                        onClick={handleDeleteTeaserVideo}
                        title="Delete this teaser video"
                      >
                        <Trash2 size={13} />
                        <span>Delete Video</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className="btn-edit-mode-toggle"
                        onClick={() => setIsEditingProfile(true)}
                        style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '6px 12px' }}
                      >
                        <Edit2 size={12} />
                        <span>Edit / Replace Video</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="msp-teaser-form-column">
                  {isEditingProfile ? (
                    <>
                      {/* Active Video Status Banner */}
                      <div className="msp-teaser-upload-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UploadCloud size={20} className="text-purple-600 flex-shrink-0" />
                          <div>
                            <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block' }}>{uploadedVideoName}</strong>
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>● Active Teaser Reel (Ready to Publish)</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            type="button" 
                            className="btn-teaser-action-upload" 
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={handleTriggerVideoUpload}
                          >
                            <Upload size={11} /> Upload
                          </button>
                          <button 
                            type="button" 
                            className="btn-teaser-action-delete" 
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={handleDeleteTeaserVideo}
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>

                      <div className="msp-form-group">
                        <label className="msp-label" style={{ margin: '0 0 6px 0' }}>
                          <span>Or Choose from Pre-recorded Presets</span>
                        </label>
                        <div className="msp-presets-stack">
                          {videoPresets.map(preset => (
                            <button
                              key={preset.name}
                              type="button"
                              className={`msp-preset-btn ${teaserVideoUrl === preset.url ? 'preset-active' : ''}`}
                              onClick={() => {
                                setTeaserVideoUrl(preset.url);
                                setTeaserTitle(preset.title);
                                setUploadedVideoName(preset.name + '.mp4');
                                setHasTeaserVideo(true);
                              }}
                            >
                              <Play size={13} className={teaserVideoUrl === preset.url ? 'text-amber-500' : 'text-slate-400'} />
                              <div style={{ textAlign: 'left' }}>
                                <strong>{preset.name}</strong>
                                <span>{preset.title}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="msp-form-group" style={{ marginTop: '14px' }}>
                        <label className="msp-label">
                          <span>Teaser Video Pitch Headline</span>
                        </label>
                        <input 
                          type="text" 
                          className="msp-input-text" 
                          value={teaserTitle}
                          onChange={(e) => setTeaserTitle(e.target.value)}
                          placeholder="e.g. How I Help Candidates Transition to Tier-1 Product & Architecture Roles (₹30L+ Target)"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="msp-readonly-teaser-box">
                      <span className="msp-ro-label">Live Video Pitch Headline:</span>
                      <h3 className="msp-ro-title">"{teaserTitle}"</h3>
                      <p className="msp-ro-desc">
                        Published on your Peerpath public listing. Candidates can watch this 60s introduction reel before requesting a 1:1 call.
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <span className="msp-readonly-tag">🎬 0:58 Min Intro</span>
                        <span className="msp-readonly-tag">⚡ 1080p Stream</span>
                        <span className="msp-readonly-tag text-emerald-600">✓ Live on Listing</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty Teaser State (When Video is Deleted) */
              <div 
                className={`msp-empty-teaser-dropzone ${isDragOver ? 'msp-dropzone-dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleVideoFileDrop}
              >
                <div className="msp-etd-icon-circle">
                  <Film size={28} className="text-purple-600" />
                </div>
                <h4 className="msp-etd-title">No Teaser Reel Uploaded</h4>
                <p className="msp-etd-desc">
                  Mentors with a 60-second video pitch receive up to <strong>3.4x more candidate bookings</strong>. Upload a video file (MP4/WebM) from your computer or select a sample pitch preset.
                </p>

                {isEditingProfile ? (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button 
                      type="button" 
                      className="btn-shine-gold-sm"
                      onClick={handleTriggerVideoUpload}
                    >
                      <UploadCloud size={15} />
                      <span>Upload Video from Device (MP4, WebM)</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-outline-dark-sm"
                      onClick={() => {
                        setTeaserVideoUrl(videoPresets[0].url);
                        setTeaserTitle(videoPresets[0].title);
                        setUploadedVideoName('Product Leadership Pitch.mp4');
                        setHasTeaserVideo(true);
                        showToast('Sample Pitch Loaded', 'Loaded standard product leadership teaser reel.', 'success');
                      }}
                    >
                      <Play size={13} />
                      <span>Load Sample Pitch Reel</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="btn-edit-mode-toggle mt-3"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit2 size={13} />
                    <span>Click "Edit Profile & Rates" to Upload Teaser</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="msp-divider-line" />

          {/* Section 2: Profile Headline, Bio & Specialties */}
          <div className="msp-unified-section">
            <h4 className="msp-sub-section-title">
              <User size={16} className="text-blue-600" />
              <span>2. Public Headline, Bio & Domain Specialties</span>
            </h4>
            
            <div className="msp-form-group" style={{ marginTop: '12px' }}>
              <label className="msp-label">
                <span>Public Mentor Headline & Past Companies</span>
              </label>
              {isEditingProfile ? (
                <input 
                  type="text" 
                  className="msp-input-text" 
                  value={headlineInput}
                  onChange={(e) => setHeadlineInput(e.target.value)}
                  placeholder="e.g. Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart"
                />
              ) : (
                <div className="msp-readonly-field-box">
                  <strong>{headlineInput}</strong>
                </div>
              )}
            </div>

            <div className="msp-form-group" style={{ marginTop: '14px' }}>
              <label className="msp-label">
                <span>Mentor Bio & Transition Approach</span>
              </label>
              {isEditingProfile ? (
                <textarea 
                  className="msp-textarea" 
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Explain how you guide candidates, evaluate CVs, and prepare them for Tier-1 interviews..."
                />
              ) : (
                <div className="msp-readonly-field-box">
                  <p style={{ margin: 0, lineHeight: 1.5, color: '#334155' }}>{bioInput}</p>
                </div>
              )}
            </div>

            {/* Domain Skills Tags Manager */}
            <div className="msp-form-group" style={{ marginTop: '14px' }}>
              <label className="msp-label">
                <span>Domain Mentorship Specialties & Keywords</span>
              </label>
              <div className="msp-skills-chip-row">
                {skillsList.map(skill => (
                  <span key={skill} className="msp-skill-chip">
                    <span>{skill}</span>
                    {isEditingProfile && (
                      <button 
                        type="button" 
                        className="btn-skill-remove"
                        onClick={() => handleRemoveSkill(skill)}
                        title="Remove specialty"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditingProfile && (
                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginTop: '10px', maxWidth: '380px' }}>
                  <input 
                    type="text" 
                    className="msp-input-text-sm" 
                    placeholder="Add specialty (e.g. System Design)" 
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                  />
                  <button type="submit" className="btn-outline-dark-sm">
                    <Plus size={13} /> Add
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="msp-divider-line" />

          {/* Section 3: 1:1 Session Offerings & Rates */}
          <div className="msp-unified-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 className="msp-sub-section-title" style={{ margin: 0 }}>
                  <DollarSign size={16} className="text-emerald-600" />
                  <span>3. 1:1 Session Offerings & Pricing Rates</span>
                </h4>
                <p className="msp-sub-section-desc">
                  Choose session categories, durations, and customize your own pricing rates with <strong>0% platform commission</strong>.
                </p>
              </div>

              {isEditingProfile ? (
                <button 
                  type="button" 
                  className="btn-shine-gold-sm"
                  onClick={handleAddOffering}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Plus size={13} />
                  <span>Add Session Offering</span>
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn-edit-mode-toggle"
                  onClick={() => setIsEditingProfile(true)}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Edit2 size={12} />
                  <span>Edit Offerings & Rates</span>
                </button>
              )}
            </div>

            <div className="msp-session-offerings-grid" style={{ marginTop: '16px' }}>
              {sessionOfferings.map((offering) => (
                <div 
                  key={offering.id} 
                  className={`msp-offering-card ${!offering.isEnabled ? 'msp-card-paused' : ''}`}
                >
                  {isEditingProfile ? (
                    <>
                      {/* Top Controls: Category Dropdown, Duration, Delete */}
                      <div className="msp-oec-top-controls">
                        <select 
                          className="msp-oec-category-select"
                          value={offering.category}
                          onChange={(e) => handleCategoryChange(offering.id, e.target.value)}
                        >
                          {availableSessionCategories.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>

                        <select 
                          className="msp-oec-duration-select"
                          value={offering.duration}
                          onChange={(e) => handleUpdateOffering(offering.id, 'duration', e.target.value)}
                        >
                          <option value="30 Mins">30m</option>
                          <option value="45 Mins">45m</option>
                          <option value="60 Mins">60m</option>
                          <option value="90 Mins">90m</option>
                        </select>

                        <button 
                          type="button" 
                          className="btn-oec-delete"
                          onClick={() => handleDeleteOffering(offering.id)}
                          title="Delete this offering"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Title & Tag Inputs */}
                      <input 
                        type="text" 
                        className="msp-oec-input-title"
                        value={offering.title}
                        onChange={(e) => handleUpdateOffering(offering.id, 'title', e.target.value)}
                        placeholder="Session Title"
                      />

                      <input 
                        type="text" 
                        className="msp-input-text-sm"
                        value={offering.tag}
                        onChange={(e) => handleUpdateOffering(offering.id, 'tag', e.target.value)}
                        placeholder="Badge / Focus Area (e.g. Deep CV Audit)"
                        style={{ marginBottom: '8px' }}
                      />

                      {/* Description Textarea */}
                      <textarea 
                        className="msp-oec-textarea"
                        value={offering.description}
                        onChange={(e) => handleUpdateOffering(offering.id, 'description', e.target.value)}
                        placeholder="Describe what candidates get in this session"
                      />

                      {/* Rate and Active Toggle Row */}
                      <div className="msp-oc-price-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <label className="msp-oc-rate-label">Rate:</label>
                          <div className="msp-input-price-wrap">
                            <span>₹</span>
                            <input 
                              type="number" 
                              className="msp-input-price" 
                              value={offering.price}
                              onChange={(e) => handleUpdateOffering(offering.id, 'price', Number(e.target.value))}
                            />
                            <span className="msp-fee-tag">0% Fee</span>
                          </div>
                        </div>

                        <button 
                          type="button"
                          className={`btn-pill-filter ${offering.isEnabled ? 'active' : ''}`}
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                          onClick={() => handleToggleOffering(offering.id)}
                        >
                          {offering.isEnabled ? '✓ Active' : '⏸️ Paused'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="msp-oc-top">
                          <div className={`msp-oc-icon-wrap ${getIconClass(offering.icon)}`}>
                            {renderOfferingIcon(offering.icon)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4 className="msp-oc-title">{offering.title}</h4>
                              {!offering.isEnabled && (
                                <span className="msp-fee-tag" style={{ background: '#F1F5F9', color: '#64748B' }}>Paused</span>
                              )}
                            </div>
                            <span className="msp-oc-duration">{offering.duration} • {offering.tag}</span>
                          </div>
                        </div>
                        <p className="msp-oc-desc">{offering.description}</p>
                      </div>

                      <div className="msp-oc-price-row">
                        <label className="msp-oc-rate-label">Session Fee:</label>
                        <div className="msp-ro-rate-display">
                          <strong>₹{offering.price}</strong>
                          <span className="msp-fee-tag">0% Commission</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add New Session Offering Button in Edit Mode */}
              {isEditingProfile && (
                <button 
                  type="button" 
                  className="btn-add-offering-card"
                  onClick={handleAddOffering}
                >
                  <Plus size={24} className="text-purple-600" />
                  <span>Add New Session Offering</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>System design, salary coaching, or custom 1:1s</span>
                </button>
              )}
            </div>

            {/* Instant Booking Mode Toggle */}
            <div className="msp-instant-booking-row">
              <div className="msp-ibr-left">
                <Zap size={18} className="text-amber-500" />
                <div>
                  <strong>Instant Booking Mode</strong>
                  <p>Allow verified candidates to automatically confirm and pay without manual approval.</p>
                </div>
              </div>
              <div 
                className={`nct-toggle-track ${isInstantBookingEnabled ? 'track-on' : 'track-off'} ${!isEditingProfile ? 'toggle-frozen' : ''}`}
                onClick={() => {
                  if (isEditingProfile) setIsInstantBookingEnabled(!isInstantBookingEnabled);
                }}
                style={{ cursor: isEditingProfile ? 'pointer' : 'default' }}
              >
                <div className="nct-toggle-knob" />
              </div>
            </div>
          </div>

          <div className="msp-divider-line" />

          {/* Section 4: Bank & UPI Payout Account Settings */}
          <div className="msp-unified-section">
            <div className="msp-payout-header" style={{ marginBottom: '14px' }}>
              <div>
                <h4 className="msp-sub-section-title" style={{ margin: 0 }}>
                  <CreditCard size={16} className="text-purple-600" />
                  <span>4. Bank & UPI Payout Account</span>
                </h4>
                <p className="msp-sub-section-desc">
                  Session earnings are processed by Shine and settled to your linked account after session completion.
                </p>
              </div>
              <span className="msp-commission-badge">
                <ShieldCheck size={14} /> 0% Platform Commission
              </span>
            </div>

            {/* 0% Commission Launch Benefit Banner */}
            <div className="msp-commission-benefit-callout">
              <div className="msp-cbc-icon"><ShieldCheck size={20} className="text-emerald-600" /></div>
              <div>
                <strong className="msp-cbc-title">0% Platform Commission (Launch Period Benefit)</strong>
                <p className="msp-cbc-desc">
                  Shine is currently charging <strong>0% platform commission</strong> on all 1:1 sessions. You receive 100% of your listed session fee. Payouts are settled automatically to your verified account after each completed session.
                </p>
              </div>
            </div>

            <div className="msp-payout-box-container">
              {isEditingProfile && (
                <div className="msp-payout-method-toggle">
                  <button 
                    type="button" 
                    className={`msp-pm-btn ${payoutMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPayoutMethod('upi')}
                  >
                    UPI ID (Automated Settlement)
                  </button>
                  <button 
                    type="button" 
                    className={`msp-pm-btn ${payoutMethod === 'bank' ? 'active' : ''}`}
                    onClick={() => setPayoutMethod('bank')}
                  >
                    Bank Account (NEFT / IMPS)
                  </button>
                </div>
              )}

              {payoutMethod === 'upi' ? (
                <div className="msp-payout-fields-grid">
                  <div className="msp-form-group">
                    <label className="msp-label">Your UPI ID</label>
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        className="msp-input-text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okaxis, akash@upi"
                      />
                    ) : (
                      <div className="msp-readonly-field-box">
                        <strong>{upiId}</strong>
                        <span className="msp-verified-payout-pill">✓ Linked UPI</span>
                      </div>
                    )}
                  </div>
                  <div className="msp-form-group">
                    <label className="msp-label">Account Holder Name</label>
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        className="msp-input-text" 
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                      />
                    ) : (
                      <div className="msp-readonly-field-box">
                        <strong>{accountHolder}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="msp-payout-fields-grid">
                  <div className="msp-form-group">
                    <label className="msp-label">Bank Account Number</label>
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        className="msp-input-text" 
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                      />
                    ) : (
                      <div className="msp-readonly-field-box">
                        <strong>{bankAccount}</strong>
                        <span className="msp-verified-payout-pill">✓ Linked Account</span>
                      </div>
                    )}
                  </div>
                  <div className="msp-form-group">
                    <label className="msp-label">Bank IFSC Code</label>
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        className="msp-input-text" 
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                      />
                    ) : (
                      <div className="msp-readonly-field-box">
                        <strong>{ifscCode}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Save / Cancel Buttons in Edit Mode */}
          {isEditingProfile && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <button 
                type="button" 
                className="btn-cancel-sm"
                onClick={handleCancelProfile}
                style={{ padding: '10px 20px', fontSize: '13.5px' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-shine-gold"
                onClick={handleSaveAllSettings}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 26px', fontSize: '13.5px' }}
              >
                <Check size={16} />
                <span>Save All Profile, Teaser & Pricing Settings</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ZERO-PREP DOSSIER MODAL */}
      {/* ========================================================================= */}
      {isDossierModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container-dossier" style={{ maxWidth: '680px', width: '90%', background: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7C3AED', background: '#F3E8FF', padding: '2px 8px', borderRadius: '4px' }}>
                  ⚡ Zero-Prep AI Briefing Dossier
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '6px 0 0 0' }}>
                  Candidate Profile & Transition Roadmap
                </h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDossierModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {isLoadingDossier || !selectedDossier ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={32} className="animate-spin text-purple-600 mb-2" />
                <p style={{ color: '#64748B' }}>Synthesizing candidate resume & gap analysis...</p>
              </div>
            ) : (
              <div>
                {/* Candidate Overview Card */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{selectedDossier.candidate.name}</h3>
                      <p style={{ margin: '2px 0 8px 0', fontSize: '13px', color: '#64748B' }}>{selectedDossier.candidate.headline} ({selectedDossier.candidate.experienceYears})</p>
                    </div>
                    <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      Target: {selectedDossier.gapReport.targetJump}
                    </span>
                  </div>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                    {selectedDossier.candidate.summary}
                  </p>
                </div>

                {/* Missing Skills to Drill On */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', marginBottom: '8px' }}>
                    🚨 Missing High-Leverage Skills (Drill on these during call):
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedDossier.gapReport.missingSkills.map((skill, idx) => (
                      <span key={idx} style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Suggested Interview Discussion Prompts */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} className="text-amber-500" /> AI Suggested Discussion Prompts (Ask Candidate):
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedDossier.quickDiscussionPrompts.map((prompt, idx) => (
                      <div key={idx} style={{ background: '#EFF6FF', borderLeft: '3px solid #3B82F6', padding: '10px 12px', borderRadius: '4px', fontSize: '13px', color: '#1E40AF' }}>
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <button 
                    type="button" 
                    className="btn-outline-dark-sm"
                    onClick={() => setIsDossierModalOpen(false)}
                  >
                    Close Dossier
                  </button>
                  <button 
                    type="button" 
                    className="btn-shine-gold-sm"
                    onClick={() => {
                      setIsDossierModalOpen(false);
                      const targetSess = upcomingMentorSessions.find(s => s.id === selectedDossier.sessionId) || upcomingMentorSessions[0];
                      if (targetSess) handleHostCall(targetSess);
                    }}
                  >
                    <Video size={14} /> Start Call Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
