import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, ChevronDown, Award, Plus, LockOpen, Users,
  ShieldCheck, Loader2, BarChart2, Target, Lightbulb, IndianRupee, Wifi, Filter, Info, Cpu, Code, BookOpen
} from 'lucide-react';
import { ViewType, Expert, GapAnalysisResult, PathwayTrackKey } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateSalaryBenchmark } from '../../utils/salaryBenchmark';
import { peerpathApi } from '../../services/api';

interface TrackMetadata {
  trackCategory: string;
  tabShortLabel: string;
  pillColorClass: string;
  openingsCount: number;
  hiringCompanies: string;
  defaultMatched: string[];
  defaultBoosters: string[];
}

const TRACKS_METADATA: Record<PathwayTrackKey, TrackMetadata> = {
  pm: {
    trackCategory: 'Product Management',
    tabShortLabel: 'Product Management',
    pillColorClass: 'gold',
    openingsCount: 430,
    hiringCompanies: 'Shine, Zepto, Flipkart, CRED, Amazon',
    defaultMatched: ['Tech Scoping', 'UI/UX Empathy', 'Agile & Scrum', 'Stakeholder Mgmt', 'Wireframing', 'Data Analytics'],
    defaultBoosters: ['PRD Discovery', 'Product Metrics', 'GTM Strategy']
  },
  arch: {
    trackCategory: 'Architecture',
    tabShortLabel: 'Lead UI Architect',
    pillColorClass: 'purple',
    openingsCount: 520,
    hiringCompanies: 'Swiggy, Razorpay, PhonePe, Makemytrip',
    defaultMatched: ['React.js', 'JavaScript (ES6+)', 'TypeScript', 'Component Arch', 'Redux / State Mgmt', 'HTML5/CSS3'],
    defaultBoosters: ['Micro-Frontends', 'Module Federation', 'Web Vitals']
  },
  ai: {
    trackCategory: 'Generative AI & LLM',
    tabShortLabel: 'GenAI & LLM',
    pillColorClass: 'teal',
    openingsCount: 610,
    hiringCompanies: 'Swiggy, OpenAI Partner Co, Postman',
    defaultMatched: ['Python / APIs', 'DB Modeling', 'WebSockets', 'Async Queues', 'Cloud Deployment', 'Fullstack App'],
    defaultBoosters: ['LangChain/LLMs', 'Vector Pinecone', 'RAG Evaluation']
  },
  search: {
    trackCategory: 'Search & Solr',
    tabShortLabel: 'Search & Solr',
    pillColorClass: 'blue',
    openingsCount: 380,
    hiringCompanies: 'Shine, Adobe, Walmart, Microsoft, Uber',
    defaultMatched: ['Node.js / Python', 'REST APIs', 'SQL Schema', 'Microservices', 'PostgreSQL/MySQL', 'Distributed Systems'],
    defaultBoosters: ['Apache Solr', 'Index Sharding', 'Latency Tuning']
  },
  semi: {
    trackCategory: 'Semiconductor & VLSI',
    tabShortLabel: 'Semiconductor',
    pillColorClass: 'indigo',
    openingsCount: 240,
    hiringCompanies: 'Qualcomm, Intel, Tata Electronics, Micron, TI',
    defaultMatched: ['C / C++', 'Digital Logic', 'Basic Verilog', 'FPGA Boards', 'Linux & Shell', 'Circuit Analysis'],
    defaultBoosters: ['RTL Design/SV', 'UVM Verification', 'Static Timing (STA)']
  }
};

interface CareerGuidanceViewProps {
  onNavigate: (view: ViewType) => void;
  onSelectExpert: (expertId: string) => void;
  experts: Expert[];
}

export const CareerGuidanceView: React.FC<CareerGuidanceViewProps> = ({
  onNavigate,
  onSelectExpert,
}) => {
  const { 
    userProfile, 
    setIsCreatorWizardOpen, 
    currentUser, 
    addSkill, 
    setSelectedJobCategory,
    setPeerpathJobContext,
    isCreatorMode
  } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | PathwayTrackKey>('all');
  const isMentor = currentUser?.role === 'mentor';

  // Live Backend Pathways Analysis for all domains based on candidate's profile
  const [pathwayGapResults, setPathwayGapResults] = useState<Record<string, GapAnalysisResult> | null>(null);
  const [isPathwaysLoading, setIsPathwaysLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCurrent = true;
    setIsPathwaysLoading(true);

    const activeRole = userProfile.headline 
      ? userProfile.headline.split('|')[0].split('•')[0].split('@')[0].trim() 
      : 'Senior Frontend Developer';

    peerpathApi.getPathwaysAnalysis({
      skills: userProfile.skills || [],
      currentRole: activeRole,
      currentCtc: userProfile.currentCtc || '₹7.5 LPA'
    }).then(results => {
      if (isCurrent && results) {
        setPathwayGapResults(results);
      }
    }).catch(err => {
      console.log('[Pathways Analysis API Fallback]:', err);
    }).finally(() => {
      if (isCurrent) setIsPathwaysLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [userProfile.headline, userProfile.skills, userProfile.currentCtc]);

  // Dynamic benchmark calculation anchored to user's actual currentCtc & domain targets
  const benchmark = calculateSalaryBenchmark(userProfile.currentCtc, userProfile.targetCtc);
  const userCurrentSalary = benchmark.currentCtcDisplay;
  const userTargetSalary = benchmark.targetCtcDisplay;
  const jumpPercentageDisplay = benchmark.jumpPercentageDisplay;

  const trackBoosterInfo: Record<PathwayTrackKey, {
    trackTitle: string;
    targetRole: string;
    targetPackage: string;
    skills: string[];
  }> = {
    arch: {
      trackTitle: 'Staff UI & Frontend Architect',
      targetRole: 'Staff UI & Micro-Frontend Architect',
      targetPackage: benchmark.tracks.arch.display,
      skills: ['Micro-Frontend Architecture', 'Module Federation (Webpack/Vite)']
    },
    pm: {
      trackTitle: 'Technical Product Manager',
      targetRole: 'Lead Technical Product Manager',
      targetPackage: benchmark.tracks.pm.display,
      skills: ['PRD Discovery & Roadmarking', 'Product Metrics & Analytics']
    },
    search: {
      trackTitle: 'Principal Search & Solr Architect',
      targetRole: 'Principal Search & Solr Architect',
      targetPackage: benchmark.tracks.search.display,
      skills: ['Apache Solr & Lucene Engine', 'Sub-10ms Query Optimization']
    },
    ai: {
      trackTitle: 'Generative AI & LLM Full-Stack Architect',
      targetRole: 'Staff AI & Full-Stack Architect',
      targetPackage: benchmark.tracks.ai.display,
      skills: ['LangChain & LLM Agents', 'Vector Embeddings & RAG']
    },
    semi: {
      trackTitle: 'Semiconductor & VLSI (Govt Fab Mission)',
      targetRole: 'Staff Silicon & RTL Design Architect',
      targetPackage: benchmark.tracks.semi.display,
      skills: ['RTL Design (SystemVerilog)', 'UVM ASIC Verification', 'Static Timing Analysis (STA)']
    }
  };

  const allTrackKeys: PathwayTrackKey[] = ['arch', 'pm', 'ai', 'search', 'semi'];

  const [filterMode, setFilterMode] = useState<'top' | 'salary' | 'profile' | 'growth' | 'remote' | 'more'>('top');

  // Dynamically sort tracks by descending currentScore or selected filter mode
  const sortedTracks = useMemo(() => {
    const list = [...allTrackKeys];
    if (filterMode === 'salary') {
      const salaryOrder: Record<PathwayTrackKey, number> = { semi: 38, arch: 38, ai: 36, pm: 34, search: 32 };
      return list.sort((a, b) => (salaryOrder[b] || 0) - (salaryOrder[a] || 0));
    }
    if (filterMode === 'profile') {
      return list.sort((a, b) => {
        const matchedA = pathwayGapResults?.[a]?.matchedSkills?.length || 3;
        const matchedB = pathwayGapResults?.[b]?.matchedSkills?.length || 3;
        return matchedB - matchedA;
      });
    }
    if (filterMode === 'growth') {
      const growthOrder: Record<PathwayTrackKey, number> = { semi: 570, ai: 550, arch: 520, pm: 480, search: 450 };
      return list.sort((a, b) => (growthOrder[b] || 0) - (growthOrder[a] || 0));
    }
    if (filterMode === 'remote') {
      const remoteOrder: PathwayTrackKey[] = ['ai', 'arch', 'search', 'pm', 'semi'];
      return remoteOrder;
    }
    return list.sort((a, b) => {
      const scoreA = pathwayGapResults?.[a]?.currentScore ?? (a === 'semi' ? 77 : a === 'arch' ? 78 : a === 'pm' ? 68 : a === 'ai' ? 65 : 62);
      const scoreB = pathwayGapResults?.[b]?.currentScore ?? (b === 'semi' ? 77 : b === 'arch' ? 78 : b === 'pm' ? 68 : b === 'ai' ? 65 : 62);
      return scoreB - scoreA; // Descending: highest currentScore first!
    });
  }, [pathwayGapResults, filterMode]);

  // Top 5 Recommended Careers for candidate (or filtered active tab)
  const displayedTracks = useMemo(() => sortedTracks.slice(0, 5), [sortedTracks]);

  const handleOpenMatchingJobs = (trackKey: PathwayTrackKey) => {
    const gap = pathwayGapResults?.[trackKey];
    const meta = TRACKS_METADATA[trackKey];
    const info = trackBoosterInfo[trackKey] || trackBoosterInfo.arch;
    setSelectedJobCategory(trackKey);
    setPeerpathJobContext({
      isFromPeerpath: true,
      trackKey,
      trackTitle: gap?.targetDomain || meta?.trackCategory || info.trackTitle,
      targetRole: gap?.targetRole || info.targetRole,
      targetPackage: gap?.targetSalaryPotential || info.targetPackage,
      requiredBoosterSkills: (gap?.missingBoosterSkills && gap.missingBoosterSkills.length > 0)
        ? gap.missingBoosterSkills
        : info.skills
    });
    onNavigate('jobs-view');
  };

  // Dynamic user context from active profile
  const userRole = userProfile.headline 
    ? userProfile.headline.split('|')[0].split('•')[0].split('@')[0].trim() 
    : 'Senior Frontend Developer';

  const userExpYears = userProfile.experienceYears 
    ? userProfile.experienceYears.replace(/Years?/i, 'Yrs').replace(/Months?/i, 'Mos').trim() 
    : '3.5+ Yrs';

  const userCoreSkills = (userProfile.skills && userProfile.skills.length > 0)
    ? userProfile.skills.slice(0, 3).join(', ')
    : 'React.js, JavaScript, HTML/CSS';

  const isSkillOnProfile = (skillName: string) => {
    return (userProfile.skills || []).some(s => s.toLowerCase() === skillName.toLowerCase());
  };

  const scrollToTrajectories = () => {
    const el = document.getElementById('trajectoriesSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const [selectedMentorIndex, setSelectedMentorIndex] = useState<Record<PathwayTrackKey, number>>({
    arch: 0,
    pm: 0,
    search: 0,
    ai: 0,
    semi: 0
  });

  interface TrackMentorOption {
    id: string;
    name: string;
    shortName: string;
    avatar: string;
    role: string;
    rating: string;
    price: number;
    pastRole: string;
    jumpRole: string;
    footnote: string;
    liveTag: string;
  }

  const renderMentorTwinCard = (trackKey: PathwayTrackKey) => {
    const gap = pathwayGapResults?.[trackKey];
    const liveCreators = gap?.recommendedCreators;

    if (isPathwaysLoading && (!liveCreators || liveCreators.length === 0)) {
      return (
        <div className="stc-right-col">
          <div className="stc-mentor-hero-card" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
            <Loader2 size={32} className="animate-spin text-blue-600 mb-3" />
            <strong style={{ fontSize: '14px', color: '#1E293B' }}>Matching Live AI Trajectory Twins...</strong>
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Querying Shine Peerpath API (/api/cv/pathways-analysis)</span>
          </div>
        </div>
      );
    }

    const MENTOR_VERIFIED_MILESTONES: Record<string, { past: string; current: string; multiplier: string }> = {
      saheli: { past: 'Senior Frontend Dev @ TCS (₹6.2 LPA)', current: '₹26 LPA Staff Architect @ Razorpay', multiplier: '4.1x Jump' },
      akash: { past: 'Senior Backend SDE @ InfoEdge (₹8.8 LPA)', current: '₹28.5 LPA Lead PM @ Shine', multiplier: '3.2x Jump' },
      karthik: { past: 'FPGA Design Engineer @ Wipro (₹7.2 LPA)', current: '₹28 LPA Lead Silicon Lead @ Qualcomm', multiplier: '3.8x Jump' },
      ishita: { past: 'Full Stack Dev @ Infosys (₹7.5 LPA)', current: '₹32 LPA Senior GenAI Lead @ Swiggy', multiplier: '4.2x Jump' },
      anirudh: { past: 'Search SDE @ MakeMyTrip (₹11 LPA)', current: '₹34 LPA Principal Search Architect', multiplier: '3.1x Jump' },
      priya: { past: 'ASIC Engineer @ SmartSoC (₹6.0 LPA)', current: '₹24 LPA Staff ASIC Lead @ TI', multiplier: '4.0x Jump' },
      rohan: { past: 'Embedded Dev @ L&T TS (₹5.2 LPA)', current: '₹22 LPA Silicon Validation @ Intel', multiplier: '4.2x Jump' },
      nisha: { past: 'Associate PM @ PolicyBazaar (₹8.0 LPA)', current: '₹26 LPA Senior PM @ Flipkart', multiplier: '3.2x Jump' },
      pooja: { past: 'Product Analyst @ Swiggy (₹5.5 LPA)', current: '₹21 LPA Product Manager @ Zepto', multiplier: '3.8x Jump' },
      vikram: { past: 'Backend SDE @ Mindtree (₹6.5 LPA)', current: '₹28 LPA Principal Engineer @ PhonePe', multiplier: '4.3x Jump' }
    };

    const mentorsList: TrackMentorOption[] = (liveCreators && liveCreators.length > 0)
      ? liveCreators.map((m) => {
          const compName = m.creator.company.replace(/\(.*?\)/g, '').trim();
          const verified = MENTOR_VERIFIED_MILESTONES[m.creator.id];
          const pastRole = verified 
            ? verified.past 
            : (m.creator.trajectory?.role3YearsAgo 
                ? `${m.creator.trajectory.role3YearsAgo} (${m.creator.trajectory.salary3YearsAgo || '₹7 LPA'})`
                : 'Software Engineer (₹6.5 LPA)');
          const jumpRole = verified 
            ? `${verified.current} • ${verified.multiplier}` 
            : `Transitioned to ${m.creator.role} @ ${compName} • 3.5x Jump`;

          return {
            id: m.creator.id,
            name: m.creator.name,
            shortName: `${m.creator.name.split(' ')[0]} @ ${compName.split(' ')[0]}`,
            avatar: m.creator.avatar,
            role: `${m.creator.role} @ ${compName}`,
            rating: `${m.creator.rating} (${m.creator.reviewsCount})`,
            price: m.creator.price,
            pastRole: pastRole.trim(),
            jumpRole: jumpRole.trim(),
            footnote: m.matchReasons?.[0] || m.suggestedSessionGoal || `Get ${m.creator.name.split(' ')[0]}'s transition roadmap`,
            liveTag: `⚡ ${m.trajectorySimilarityScore}% AI Match`
          };
        })
      : [];

    if (mentorsList.length === 0) {
      return (
        <div className="stc-right-col">
          <div className="stc-mentor-hero-card" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
            <Users size={32} className="text-slate-400 mb-2" />
            <strong style={{ fontSize: '14px', color: '#334155' }}>Mentors Currently Being Matched</strong>
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Our AI engine is pairing verified industry mentors for this vertical.</span>
          </div>
        </div>
      );
    }

    const activeIdx = Math.min(selectedMentorIndex[trackKey] || 0, mentorsList.length - 1);
    const activeMentor = mentorsList[activeIdx] || mentorsList[0];
    const targetSalaryDisplay = gap?.targetSalaryPotential || benchmark.tracks[trackKey].display;

    return (
      <div className="stc-right-col">
        <div className="stc-mentor-hero-card">
          {/* Top Header: Title & Target Package */}
          <div className="stc-mhc-header">
            <div className="stc-mhc-tag-group">
              <span className="stc-mhc-tag">🎯 Trajectory Twin</span>
              <span className="stc-mhc-avail-chip">
                <Users size={10} /> {mentorsList.length} Mentors
              </span>
            </div>
            <span className="stc-mhc-salary">{targetSalaryDisplay}</span>
          </div>

          {/* Ultra-Compact Segmented Mentor Selector */}
          <div className="stc-mhc-switcher-row">
            {mentorsList.map((m, idx) => {
              const isSelected = activeIdx === idx;
              const company = m.shortName.includes('@') 
                ? m.shortName.split('@')[1].trim() 
                : m.shortName;
              const firstName = m.name.split(' ')[0];

              return (
                <button
                  key={m.id + idx}
                  type="button"
                  className={`stc-mhc-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedMentorIndex(prev => ({ ...prev, [trackKey]: idx }))}
                  title={`View ${m.name} (${company}) trajectory`}
                >
                  <img src={m.avatar} alt={m.name} className="stc-mhc-tab-av" />
                  <span className="stc-mhc-tab-label">
                    <strong>{firstName}</strong> <span className="stc-mhc-tab-co">({company})</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Streamlined Active Mentor Profile & Journey Info */}
          <div className="stc-mhc-profile-block">
            <div className="stc-mhc-profile-top">
              <div className="stc-mhc-avatar-wrap">
                <img src={activeMentor.avatar} alt={activeMentor.name} className="stc-mhc-avatar-img" />
                <span className="stc-mhc-verified-badge">✓</span>
              </div>
              <div className="stc-mhc-profile-info">
                <div className="stc-mhc-name-row">
                  <span className="stc-mhc-name">{activeMentor.name}</span>
                  <span className="stc-mhc-rating-tag"><Star size={9} fill="#D97706" color="#D97706" /> {activeMentor.rating}</span>
                </div>
                <span className="stc-mhc-role">{activeMentor.role}</span>
              </div>
            </div>

            {/* Clean Journey Summary */}
            <div className="stc-mhc-journey-strip">
              <div className="stc-mhc-journey-item">
                <span className="stc-mhc-j-bullet">📍</span>
                <span className="stc-mhc-j-text"><strong>Started As:</strong> {activeMentor.pastRole}</span>
              </div>
              <div className="stc-mhc-journey-item">
                <span className="stc-mhc-j-bullet">🚀</span>
                <span className="stc-mhc-j-text"><strong>Career Leap:</strong> {activeMentor.jumpRole}</span>
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <button 
            type="button" 
            className="btn-stc-book-mentor-hero"
            onClick={() => handleBookWithMentor(activeMentor.id)}
          >
            <Video size={13} />
            <span>Book 1:1 Prep with {activeMentor.name.split(' ')[0]} • ₹{activeMentor.price}</span>
          </button>

          {/* Clean Trust Tag & Gallery Link */}
          <div className="stc-card-bottom-row">
            <span className="stc-card-footnote">
              <ShieldCheck size={11} className="text-emerald-600 inline" />
              1:1 Live Mock & Roadmap
            </span>
            <button 
              type="button" 
              className="stc-explore-gallery-link"
              onClick={() => onNavigate('experts-view')}
            >
              <span>Explore 500+ Mentors ➔</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleBookWithMentor = (mentorId: string) => {
    onSelectExpert(mentorId);
  };

  const handleGoToProfileSkills = () => {
    onNavigate('profile-view');
    setTimeout(() => {
      const el = document.getElementById('skills-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-section-pulse');
        setTimeout(() => el.classList.remove('highlight-section-pulse'), 2500);
      }
    }, 120);
  };

  const renderCareerCard = (trackKey: PathwayTrackKey, rank: number) => {
    const meta = TRACKS_METADATA[trackKey];
    const gap = pathwayGapResults?.[trackKey];
    const boosterSkills = (gap?.missingBoosterSkills && gap.missingBoosterSkills.length > 0)
      ? gap.missingBoosterSkills
      : meta.defaultBoosters;
    const onCvSkills = (gap?.matchedSkills && gap.matchedSkills.length > 0)
      ? gap.matchedSkills
      : meta.defaultMatched;

    const addedCount = boosterSkills.filter(s => isSkillOnProfile(s)).length;
    const remainingCount = Math.max(0, boosterSkills.length - addedCount);
    const isFullyUnlocked = addedCount === boosterSkills.length && boosterSkills.length > 0;
    const baseScore = gap?.currentScore ?? (trackKey === 'arch' ? 78 : trackKey === 'pm' ? 68 : trackKey === 'ai' ? 65 : trackKey === 'search' ? 62 : 55);
    const targetScore = gap?.targetScore ?? 96;
    const currentScore = Math.min(targetScore, baseScore + Math.round(addedCount * ((targetScore - baseScore) / (boosterSkills.length || 1))));
    const targetRole = gap?.targetRole || (trackBoosterInfo[trackKey]?.targetRole || meta.tabShortLabel);
    const openingsCount = meta.openingsCount;

    const targetSalaryDisplay = gap?.targetSalaryPotential || benchmark.tracks[trackKey].display;

    // Get live creators for this track
    const liveCreators = gap?.recommendedCreators;
    const MENTOR_VERIFIED_MILESTONES: Record<string, { baseline: string; jump: string }> = {
      saheli: { baseline: 'Senior Frontend Dev (₹6.2 LPA)', jump: '₹6.2 LPA ➔ ₹26L - ₹32L • Staff UI Architect' },
      akash: { baseline: 'Senior Backend Engineer (₹8.8 LPA)', jump: '₹8.8 LPA ➔ ₹22L - ₹34L • Lead Product Manager' },
      karthik: { baseline: 'FPGA Design Engineer (₹7.2 LPA)', jump: '₹7.2 LPA ➔ ₹24L - ₹36L • Lead Silicon Architect' },
      ishita: { baseline: 'Full Stack Dev (₹7.5 LPA)', jump: '₹7.5 LPA ➔ ₹28L - ₹42L • Senior GenAI Lead' },
      anirudh: { baseline: 'Search SDE (₹11 LPA)', jump: '₹11 LPA ➔ ₹30L - ₹45L • Principal Search Architect' },
      priya: { baseline: 'ASIC Engineer (₹6.0 LPA)', jump: '₹6.0 LPA ➔ ₹20L - ₹30L • Staff ASIC Lead' },
      rohan: { baseline: 'Embedded Dev (₹5.2 LPA)', jump: '₹5.2 LPA ➔ ₹18L - ₹28L • Silicon Validation Lead' },
      nisha: { baseline: 'Associate PM (₹8.0 LPA)', jump: '₹8.0 LPA ➔ ₹24L - ₹35L • Senior PM' },
      pooja: { baseline: 'Product Analyst (₹5.5 LPA)', jump: '₹5.5 LPA ➔ ₹18L - ₹26L • Product Manager' },
      vikram: { baseline: 'Backend SDE (₹6.5 LPA)', jump: '₹6.5 LPA ➔ ₹26L - ₹38L • Principal Engineer' }
    };

    const TRACK_DEFAULT_MENTORS: Record<PathwayTrackKey, any[]> = {
      semi: [
        { id: 'karthik', name: 'Karthik Nambiar', avatar: '/avatars/karthik.jpg', role: 'Lead Silicon Verification Architect @ Qualcomm', rating: 4.9, reviewsCount: 88, price: 1299, baseline: 'FPGA Design Engineer (₹7.2 LPA)', jump: '₹7.2 LPA ➔ ₹24L - ₹36L • Lead Silicon Architect' },
        { id: 'priya', name: 'Priya Sharma', avatar: '/avatars/priya.jpg', role: 'Staff ASIC Verification Lead @ Intel', rating: 4.88, reviewsCount: 76, price: 1199, baseline: 'ASIC Engineer (₹6.0 LPA)', jump: '₹6.0 LPA ➔ ₹20L - ₹30L • Staff ASIC Lead' },
        { id: 'rohan', name: 'Rohan Das', avatar: '/avatars/rohan.jpg', role: 'Silicon Validation Lead @ Micron', rating: 4.85, reviewsCount: 64, price: 999, baseline: 'Embedded Dev (₹5.2 LPA)', jump: '₹5.2 LPA ➔ ₹18L - ₹28L • Silicon Validation Lead' }
      ],
      arch: [
        { id: 'saheli', name: 'Saheli Mukherjee', avatar: '/avatars/saheli.jpg', role: 'Staff UI Architect @ Razorpay', rating: 4.9, reviewsCount: 128, price: 999, baseline: 'Senior Frontend Dev (₹6.2 LPA)', jump: '₹6.2 LPA ➔ ₹26L - ₹32L • Staff UI Architect' },
        { id: 'vikram', name: 'Vikram Malhotra', avatar: '/avatars/vikram.jpg', role: 'Principal Architect @ Flipkart', rating: 4.92, reviewsCount: 95, price: 1499, baseline: 'Backend SDE (₹6.5 LPA)', jump: '₹6.5 LPA ➔ ₹26L - ₹38L • Principal Engineer' },
        { id: 'akash', name: 'Akash Jain', avatar: '/avatars/akash.jpg', role: 'Lead Product Manager @ Shine', rating: 4.9, reviewsCount: 142, price: 999, baseline: 'Senior Backend Engineer (₹8.8 LPA)', jump: '₹8.8 LPA ➔ ₹22L - ₹34L • Lead Product Manager' }
      ],
      pm: [
        { id: 'akash', name: 'Akash Jain', avatar: '/avatars/akash.jpg', role: 'Lead Product Manager @ Shine', rating: 4.9, reviewsCount: 142, price: 999, baseline: 'Senior Backend Engineer (₹8.8 LPA)', jump: '₹8.8 LPA ➔ ₹22L - ₹34L • Lead Product Manager' },
        { id: 'nisha', name: 'Nisha Singhania', avatar: '/avatars/nisha.jpg', role: 'Senior Product Manager @ Swiggy', rating: 4.9, reviewsCount: 118, price: 1299, baseline: 'Associate PM (₹8.0 LPA)', jump: '₹8.0 LPA ➔ ₹24L - ₹35L • Senior PM' },
        { id: 'pooja', name: 'Pooja Hegde', avatar: '/avatars/pooja.jpg', role: 'Group Product Manager @ Zomato', rating: 4.86, reviewsCount: 82, price: 1199, baseline: 'Product Analyst (₹5.5 LPA)', jump: '₹5.5 LPA ➔ ₹18L - ₹26L • Product Manager' }
      ],
      ai: [
        { id: 'ishita', name: 'Ishita Roy', avatar: '/avatars/ishita.jpg', role: 'Senior GenAI Lead @ Swiggy', rating: 4.95, reviewsCount: 112, price: 1599, baseline: 'Full Stack Dev (₹7.5 LPA)', jump: '₹7.5 LPA ➔ ₹28L - ₹42L • Senior GenAI Lead' },
        { id: 'saheli', name: 'Saheli Mukherjee', avatar: '/avatars/saheli.jpg', role: 'Staff UI Architect @ Razorpay', rating: 4.9, reviewsCount: 128, price: 999, baseline: 'Senior Frontend Dev (₹6.2 LPA)', jump: '₹6.2 LPA ➔ ₹26L - ₹32L • Staff UI Architect' },
        { id: 'vikram', name: 'Vikram Malhotra', avatar: '/avatars/vikram.jpg', role: 'Principal AI Architect @ Flipkart', rating: 4.92, reviewsCount: 95, price: 1499, baseline: 'Backend SDE (₹6.5 LPA)', jump: '₹6.5 LPA ➔ ₹26L - ₹38L • Principal Engineer' }
      ],
      search: [
        { id: 'anirudh', name: 'Anirudh Rao', avatar: '/avatars/anirudh.jpg', role: 'Principal Search Architect @ Adobe', rating: 4.92, reviewsCount: 94, price: 1499, baseline: 'Search SDE (₹11 LPA)', jump: '₹11 LPA ➔ ₹30L - ₹45L • Principal Search Architect' },
        { id: 'vikram', name: 'Vikram Malhotra', avatar: '/avatars/vikram.jpg', role: 'Principal Engineer @ Flipkart', rating: 4.92, reviewsCount: 95, price: 1499, baseline: 'Backend SDE (₹6.5 LPA)', jump: '₹6.5 LPA ➔ ₹26L - ₹38L • Principal Engineer' },
        { id: 'akash', name: 'Akash Jain', avatar: '/avatars/akash.jpg', role: 'Lead Product Manager @ Shine', rating: 4.9, reviewsCount: 142, price: 999, baseline: 'Senior Backend Engineer (₹8.8 LPA)', jump: '₹8.8 LPA ➔ ₹22L - ₹34L • Lead Product Manager' }
      ]
    };

    const fallbackMentors = TRACK_DEFAULT_MENTORS[trackKey] || TRACK_DEFAULT_MENTORS.semi;

    const mentorsList = (liveCreators && liveCreators.length >= 3)
      ? liveCreators.map((m) => {
          const compName = m.creator.company.replace(/\(.*?\)/g, '').trim();
          const verified = MENTOR_VERIFIED_MILESTONES[m.creator.id];
          return {
            id: m.creator.id,
            name: m.creator.name,
            avatar: m.creator.avatar || `/avatars/${m.creator.id}.jpg`,
            role: `${m.creator.role} @ ${compName}`,
            rating: m.creator.rating,
            reviewsCount: m.creator.reviewsCount || 142,
            price: m.creator.price,
            baseline: verified?.baseline || `${m.creator.trajectory?.role3YearsAgo || 'Software Engineer'} (${m.creator.trajectory?.salary3YearsAgo || '₹7 LPA'})`,
            jump: verified?.jump || `${m.creator.trajectory?.salary3YearsAgo || '₹7 LPA'} ➔ ₹22L - ₹34L • ${m.creator.role.split('•')[0].split('@')[0].trim()}`
          };
        })
      : fallbackMentors;

    const activeIdx = Math.min(selectedMentorIndex[trackKey] || 0, mentorsList.length - 1);
    const activeMentor = mentorsList[activeIdx] || mentorsList[0];

    const getTrackIcon = (key: PathwayTrackKey) => {
      switch (key) {
        case 'semi': return <Cpu size={12} className="text-indigo-600" />;
        case 'arch': return <Code size={12} className="text-purple-600" />;
        case 'ai': return <Sparkles size={12} className="text-teal-600" />;
        case 'pm': return <Compass size={12} className="text-amber-600" />;
        case 'search': return <Target size={12} className="text-blue-600" />;
        default: return <Cpu size={12} className="text-indigo-600" />;
      }
    };

    const getInitials = (name: string) => {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 1).toUpperCase();
    };

    const getInitialBg = (idx: number) => {
      const colors = ['#DBEAFE', '#F3E8FF', '#FFEDD5', '#DCFCE7'];
      const textColors = ['#1E40AF', '#6B21A8', '#9A3412', '#166534'];
      return { bg: colors[idx % colors.length], color: textColors[idx % textColors.length] };
    };

    const mentorCompanies = Array.from(new Set(
      mentorsList.slice(0, 3).map(m => {
        if (m.role.includes('@')) return m.role.split('@')[1].trim();
        if (m.role.includes('•')) return m.role.split('•').pop()?.trim() || 'Top Tech';
        return 'Top Tech';
      })
    )).join(' • ');

    return (
      <div key={trackKey} className="figma-career-card-v2">
        {/* LEFT COLUMN: Role Details, CV Verified, Match Progress, Skills to Bridge Row, Action */}
        <div className="fcc2-left-col">
          
          {/* Top Meta Line */}
          <div className="fcc2-meta-row">
            <span className="fcc2-track-category-lbl">
              {meta.trackCategory.toUpperCase()}
            </span>
            <span className="fcc2-meta-divider">|</span>
            <span className="fcc2-openings-tag">💈 {openingsCount}+ openings</span>
            <span className="fcc2-hiring-tag">{meta.hiringCompanies} +3</span>
          </div>

          {/* Main Title */}
          <h3 className="fcc2-role-title">{targetRole}</h3>

          {/* CV Verified Skills */}
          <div className="fcc2-verified-row">
            <span className="fcc2-verified-lbl">
              <Check size={12} strokeWidth={3} className="text-slate-600" /> CV verified
            </span>
            <span className="fcc2-verified-skills">
              {onCvSkills.slice(0, 4).map(s => s.replace(/\(.*?\)/g, '').trim()).join(' • ')}
            </span>
          </div>

          {/* Match Progress Bar Section */}
          <div className="fcc2-progress-section">
            <div className="fcc2-progress-top">
              <span className="fcc2-progress-current">
                {currentScore}% Match
              </span>
              <span className="fcc2-progress-target">
                {targetScore}% Target
              </span>
            </div>
            <div className="fcc2-progress-track">
              <div 
                className="fcc2-progress-fill" 
                style={{ width: `${Math.min(100, currentScore)}%` }} 
              />
            </div>
          </div>

          {/* Skills to Bridge Row */}
          <div className="fcc2-bridge-row-streamlined">
            <span className="fcc2-brs-label">
              {boosterSkills.length} SKILLS TO BRIDGE
            </span>
            <div className="fcc2-brs-skills">
              {boosterSkills.map((skillName, idx) => {
                const isAdded = isSkillOnProfile(skillName);
                const cleanName = skillName.replace(/\(.*?\)/g, '').trim();
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`fcc2-brs-skill-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => addSkill(skillName)}
                    title={isAdded ? 'Skill in your profile' : `Click to add ${cleanName}`}
                  >
                    {idx > 0 && <span className="fcc2-brs-dot">•</span>}
                    <span className="fcc2-brs-name">{cleanName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="fcc2-action-row">
            <button 
              type="button" 
              className="btn-fcc2-explore-dark"
              onClick={() => handleOpenMatchingJobs(trackKey)}
            >
              <span>Explore {openingsCount}+ matching jobs</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Mentor Match Column */}
        <div className="fcc2-right-col">
          
          {/* Top Header: MENTOR MATCH & Target Salary */}
          <div className="fcc2-mentor-header">
            <span className="fcc2-mch-badge">MENTOR MATCH</span>
            <span className="fcc2-mch-salary">{targetSalaryDisplay}</span>
          </div>

          {/* Active Mentor Profile Details */}
          <div className="fcc2-mentor-profile-box">
            {/* Top Mentor Row: Avatar / Name / Company / Rating */}
            <div className="fcc2-mpb-top">
              <div className="fcc2-mpb-avatar-wrap">
                {activeMentor.avatar ? (
                  <img src={activeMentor.avatar} alt={activeMentor.name} className="fcc2-mpb-avatar" />
                ) : (
                  <div 
                    className="fcc2-mpb-initial"
                    style={{ background: getInitialBg(activeIdx).bg, color: getInitialBg(activeIdx).color }}
                  >
                    {getInitials(activeMentor.name)}
                  </div>
                )}
              </div>
              <div className="fcc2-mpb-meta">
                <div className="fcc2-mpb-name-row">
                  <strong className="fcc2-mpb-name">{activeMentor.name}</strong>
                  <div className="fcc2-mpb-rating">
                    <Star size={11} fill="#F59E0B" color="#F59E0B" />
                    <span>{activeMentor.rating} ({activeMentor.reviewsCount})</span>
                  </div>
                </div>
                <div className="fcc2-mpb-role">
                  {activeMentor.role.includes('@') 
                    ? `${activeMentor.role.split('@')[0].trim()} • ${activeMentor.role.split('@')[1].trim()}`
                    : activeMentor.role
                  }
                </div>
              </div>
            </div>

            {/* Career Proof & Focus Grid */}
            <div className="fcc2-mpb-grid">
              <div className="fcc2-mpb-row">
                <span className="fcc2-mpb-lbl">Career proof</span>
                <span className="fcc2-mpb-val">
                  {activeMentor.baseline.replace(/^Baseline:\s*/i, '').split('(')[0].trim()} {activeMentor.jump.includes('➔') ? `₹${activeMentor.baseline.match(/₹[\d.]+\s*LPA/i)?.[0]?.replace('₹', '') || '7.2L'} ➔ ₹${activeMentor.jump.split('➔')[1]?.split('•')[0]?.trim().replace('₹', '') || '24L–₹36L'}` : activeMentor.jump}
                </span>
              </div>
              <div className="fcc2-mpb-row">
                <span className="fcc2-mpb-lbl">Focus</span>
                <span className="fcc2-mpb-val">
                  {boosterSkills.slice(0, 3).map(s => s.replace(/\(.*?\)/g, '').split(' ')[0].trim()).join(' • ')}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Recommended Mentors Strip */}
          <div className="fcc2-recommended-mentors-strip">
            <div className="fcc2-rms-left">
              <div className="fcc2-rms-bubbles">
                {mentorsList.slice(0, 3).map((m, idx) => {
                  const isCurrent = idx === activeIdx;
                  const colorScheme = getInitialBg(idx);
                  return (
                    <button
                      key={m.id || idx}
                      type="button"
                      className={`fcc2-rms-bubble-btn ${isCurrent ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMentorIndex(prev => ({ ...prev, [trackKey]: idx }));
                      }}
                      title={`Review ${m.name}`}
                      style={{
                        background: colorScheme.bg,
                        color: colorScheme.color,
                        zIndex: 10 - idx
                      }}
                    >
                      <span>{getInitials(m.name)[0]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="fcc2-rms-text">
                <span className="fcc2-rms-title">{mentorsList.length} mentors available</span>
                <span className="fcc2-rms-subtitle">{mentorCompanies || 'Qualcomm • Intel • Micron'}</span>
              </div>
            </div>

            <div className="fcc2-rms-right">
              {activeIdx < mentorsList.length - 1 ? (
                <button 
                  type="button" 
                  className="fcc2-rms-next-link" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMentorIndex(prev => ({
                      ...prev,
                      [trackKey]: (activeIdx + 1) % mentorsList.length
                    }));
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={12} />
                </button>
              ) : (
                <button 
                  type="button" 
                  className="fcc2-rms-see-more-link" 
                  onClick={() => onNavigate('experts-view')}
                >
                  <span>See more</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Book 1:1 CTA Button */}
          <button 
            type="button" 
            className="btn-fcc2-book-gold"
            onClick={() => handleBookWithMentor(activeMentor.id)}
          >
            <span>Book 1:1 with {activeMentor.name.split(' ')[0]}</span>
            <ArrowRight size={14} />
          </button>

        </div>
      </div>
    );
  };

  return (
    <div className="content-wrapper peerpath-guidance-page">

      {/* Peerpath Top Sub-Nav View Switcher + Become Mentor CTA (Candidate Mode Only) */}
      {!isCreatorMode && (
        <div className="peerpath-top-nav-switcher">
          <div className="ptn-left-group">
            <button 
              type="button"
              className="ptn-tab-btn active"
              onClick={() => {}}
            >
              <TrendingUp size={15} className="ptn-icon" />
              <span>Recommended Pathways</span>
              <span className="ptn-badge-pill">Best Fit</span>
            </button>
            
            <button 
              type="button"
              className="ptn-tab-btn ptn-mentors-highlight"
              onClick={() => onNavigate('experts-view')}
            >
              <div className="ptn-avatars-stack">
                <img src="/avatars/saheli.jpg" alt="Mentor" className="ptn-av" />
                <img src="/avatars/akash.jpg" alt="Mentor" className="ptn-av" />
                <img src="/avatars/ishita.jpg" alt="Mentor" className="ptn-av" />
                <span className="ptn-live-dot"></span>
              </div>
              <span className="ptn-label-main">Explore 500+ Mentors</span>
              <span className="ptn-count-pill">Live 1:1 Prep</span>
            </button>
          </div>

          {!isMentor && (currentUser?.isMentorEligible ?? false) && (
            <button 
              type="button"
              className="ptn-become-mentor-btn"
              onClick={() => setIsCreatorWizardOpen(true)}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Become a Mentor</span>
              <span className="ptn-zero-fee-tag">0% Fee</span>
            </button>
          )}
        </div>
      )}

      {/* Mentor Recruitment Strip for Experienced Professionals (Nisha only) */}
      {!isMentor && (currentUser?.isMentorEligible ?? false) && (
        <div className="peerpath-mentor-recruitment-strip" onClick={() => setIsCreatorWizardOpen(true)}>
          <div className="pmrs-left">
            <span className="pmrs-badge">⭐ FOUNDING MENTOR CIRCLE</span>
            <span className="pmrs-text">
              Are you a Senior Engineer or Tech Lead? Set your own rates & mentor candidates with <strong>0% platform fee</strong>.
            </span>
          </div>
          <button type="button" className="pmrs-cta-btn">
            Apply in 60 Secs <ArrowRight size={13} />
          </button>
        </div>
      )}
      
      {/* 1. Official Shine Prepare+ Peerpath Hero Banner */}
      <div className="peerpath-hero-banner-card">
        <div className="phb-main-grid">
          {/* Left Column */}
          <div className="phb-left">
            {/* Top Tag Pill */}
            <div className="phb-tag-pill">
              <Sparkles size={13} className="text-amber-600" />
              <span className="phb-tag-brand">SHINE PREPARE+</span>
              <span className="phb-tag-sep">|</span>
              <span className="phb-tag-sub">CAREER MULTIPLIER</span>
            </div>

            {/* Main Heading & Candidate Subtitle */}
            <h1 className="phb-title">
              Tailored for {userProfile.name || 'Prakash Mahto'}
            </h1>
            <div className="phb-role-subtitle">
              {userRole} • {userExpYears}
            </div>

            {/* Description */}
            <p className="phb-desc">
              Get a personalized roadmap, identify skill gaps, and connect with verified mentors to multiply your salary opportunities.
            </p>

            {/* 3 Metric Cards Row */}
            <div className="phb-stats-row">
              <div className="phb-stat-card">
                <div className="phb-stat-icon-wrap icon-green">
                  <TrendingUp size={16} />
                </div>
                <div className="phb-stat-info">
                  <span className="phb-stat-label">Career Leap</span>
                  <strong className="phb-stat-val val-green">3x – 5x Growth</strong>
                </div>
              </div>

              <div className="phb-stat-card">
                <div className="phb-stat-icon-wrap icon-blue">
                  <Briefcase size={16} />
                </div>
                <div className="phb-stat-info">
                  <span className="phb-stat-label">Verified Jobs</span>
                  <strong className="phb-stat-val val-blue">2,800+</strong>
                </div>
              </div>

              <div className="phb-stat-card">
                <div className="phb-stat-icon-wrap icon-purple">
                  <Users size={16} />
                </div>
                <div className="phb-stat-info">
                  <span className="phb-stat-label">Top Mentors</span>
                  <strong className="phb-stat-val val-purple">500+ Verified</strong>
                </div>
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="phb-actions-row">
              <button 
                type="button" 
                className="btn-phb-primary"
                onClick={scrollToTrajectories}
              >
                <span>Explore High-Growth Pathways</span>
                <ArrowRight size={15} />
              </button>
              <button 
                type="button" 
                className="btn-phb-mock"
                onClick={() => onNavigate('experts-view')}
              >
                <Video size={15} />
                <span>1:1 Mock Interviews</span>
              </button>
            </div>
          </div>

          {/* Right Column: Salary Benchmark Stack */}
          <div className="phb-right">
            {/* Benchmark Header */}
            <div className="phb-bench-header">
              <div className="phb-bench-title">
                <div className="phb-bench-icon-badge">
                  <BarChart2 size={13} />
                </div>
                <span>Salary Benchmark</span>
              </div>
              <div className="phb-market-select">
                <span>India Market</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Stack Card 1: Current Salary & Growth Potential with vertical divider */}
            <div className="phb-card-current">
              <div className="pcc-left">
                <span className="pcc-label">Current Salary</span>
                <span className="pcc-val">{userCurrentSalary}</span>
                <span className="pcc-sub">Based on your profile</span>
              </div>
              <div className="pcc-divider" />
              <div className="pcc-right">
                <div className="pcc-arrow-circle">
                  <TrendingUp size={16} />
                </div>
                <div className="pcc-growth-info">
                  <span className="pcc-growth-val">
                    {jumpPercentageDisplay.startsWith('+') ? jumpPercentageDisplay : `+${jumpPercentageDisplay}`}
                  </span>
                  <span className="pcc-growth-lbl">Growth Potential</span>
                </div>
              </div>
            </div>

            {/* Stack Card 2: Target Horizon & Bandwidth */}
            <div className="phb-card-target" onClick={scrollToTrajectories}>
              <div className="pct-icon-wrap">
                <Target size={22} className="text-emerald-600" />
              </div>
              <div className="pct-info">
                <div className="pct-top-row">
                  <span className="pct-label">Target Potential:</span>
                  <strong className="pct-val">₹24L – ₹42L+</strong>
                </div>
                <span className="pct-sub">Across 5 matched high-growth pathways</span>
              </div>
              <ChevronRight size={16} className="pct-arrow" />
            </div>

            {/* Stack Card 3: The Formula */}
            <div className="phb-card-formula" onClick={scrollToTrajectories}>
              <div className="pcf-icon-wrap">
                <Lightbulb size={18} className="text-amber-500" />
              </div>
              <div className="pcf-text">
                <strong className="pcf-title">The Career Jump Formula</strong>
                <span className="pcf-desc">
                  Bridge 3 skill gaps + 1:1 mentor prep ➔ Qualify for direct recruiter shortlists
                </span>
              </div>
              <ChevronRight size={16} className="pcf-arrow" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Opportunities Upper Section Header */}
      <div className="trajectories-upper-section" id="trajectoriesSection">
        {/* Main Title Row */}
        <div className="traj-main-title-row">
          <div className="traj-title-block">
            <h2 className="traj-main-heading">Curated High-Growth Job Pathways &amp; Opportunities</h2>
            <p className="traj-sub-heading">Personalized roles, skill gaps, and mentor guidance to accelerate your career.</p>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="traj-filter-pills-row">
          <button 
            type="button"
            className={`traj-pill-btn ${filterMode === 'top' ? 'active' : ''}`}
            onClick={() => setFilterMode('top')}
          >
            <Target size={13} className="mr-1.5" />
            <span>Top 5 for you</span>
            <span className="traj-pill-count">5</span>
          </button>

          <button 
            type="button"
            className={`traj-pill-btn ${filterMode === 'salary' ? 'active' : ''}`}
            onClick={() => setFilterMode('salary')}
          >
            <IndianRupee size={12} className="mr-1.5" />
            <span>Highest Salary</span>
          </button>

          <button 
            type="button"
            className={`traj-pill-btn ${filterMode === 'profile' ? 'active' : ''}`}
            onClick={() => setFilterMode('profile')}
          >
            <User size={13} className="mr-1.5" />
            <span>Closest to Profile</span>
          </button>

          <button 
            type="button"
            className={`traj-pill-btn ${filterMode === 'growth' ? 'active' : ''}`}
            onClick={() => setFilterMode('growth')}
          >
            <Zap size={13} className="mr-1.5" />
            <span>Fastest Growth</span>
          </button>

          <button 
            type="button"
            className={`traj-pill-btn ${filterMode === 'remote' ? 'active' : ''}`}
            onClick={() => setFilterMode('remote')}
          >
            <Wifi size={13} className="mr-1.5" />
            <span>Remote Friendly</span>
          </button>

          <button 
            type="button"
            className="traj-pill-btn"
            onClick={() => setFilterMode(prev => prev === 'more' ? 'top' : 'more')}
          >
            <Filter size={12} className="mr-1.5" />
            <span>More Filters</span>
            <ChevronDown size={12} className="ml-1 opacity-70" />
          </button>
        </div>
      </div>

      {/* 3. Trajectory Cards Stack: Dynamically mapped Recommended Career Pathways */}
      <div className="trajectories-cards-stack">
        {displayedTracks.map((trackKey, idx) => (
          <React.Fragment key={trackKey}>
            {renderCareerCard(trackKey, idx + 1)}
            {/* Clean, Visual Mid-Feed Mentorship Banner after Career #1 */}
            {idx === 0 && (
              <div className="peerpath-mid-feed-banner">
                <div className="pmf-left">
                  <div className="pmf-avatars-row">
                    <img src="/avatars/saheli.jpg" alt="Saheli" className="pmf-avatar" />
                    <img src="/avatars/akash.jpg" alt="Akash" className="pmf-avatar" />
                    <img src="/avatars/ishita.jpg" alt="Ishita" className="pmf-avatar" />
                    <span className="pmf-online-dot"></span>
                  </div>
                  <div className="pmf-text-block">
                    <h3 className="pmf-title">Want 1:1 Interview Prep &amp; Direct Referrals?</h3>
                    <div className="pmf-benefits-row">
                      <span className="pmf-benefit-chip"><CheckCircle2 size={13} className="text-emerald-600" /> Resume Review</span>
                      <span className="pmf-benefit-chip"><CheckCircle2 size={13} className="text-emerald-600" /> Mock Interview</span>
                      <span className="pmf-benefit-chip"><CheckCircle2 size={13} className="text-emerald-600" /> Direct Referrals</span>
                    </div>
                  </div>
                </div>
                <button className="btn-shine-gold-lg pmf-cta-btn" onClick={() => onNavigate('experts-view')}>
                  Explore Mentors <ArrowRight size={16} />
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 5. Bottom Mentorship Acceleration CTA */}
      <div className="peerpath-bottom-acceleration-card peerpath-pro-cta-card">
        <div className="pro-cta-left">
          <div className="pro-cta-badge-row">
            <span className="pro-cta-sparkle-pill">
              <Sparkles size={13} /> 1:1 CAREER ACCELERATION
            </span>
            <span className="pro-cta-trust-tag">500+ Successful Transitions</span>
          </div>
          
          <h3 className="pro-cta-heading">
            Turn Your Experience into ₹22L+ Offers with 1:1 Expert Guidance
          </h3>

          <div className="pro-cta-chips-row">
            <span className="pro-chip"><CheckCircle2 size={13} className="text-emerald-600" /> Resume Review & ATS Fix</span>
            <span className="pro-chip"><CheckCircle2 size={13} className="text-emerald-600" /> Real Interview Practice</span>
            <span className="pro-chip"><CheckCircle2 size={13} className="text-emerald-600" /> Direct Company Referrals</span>
          </div>
        </div>

        <div className="pro-cta-right">
          <div className="pro-cta-mentor-proof">
            <div className="pro-mentor-avatars">
              <img src="/avatars/saheli.jpg" alt="Saheli" />
              <img src="/avatars/akash.jpg" alt="Akash" />
              <img src="/avatars/ishita.jpg" alt="Ishita" />
            </div>
            <span className="pro-mentor-caption">Mentors from Swiggy, Razorpay & Shine</span>
          </div>

          <button className="btn-shine-gold-lg pro-cta-btn" onClick={() => onNavigate('experts-view')}>
            Book 1:1 Guidance Session <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
