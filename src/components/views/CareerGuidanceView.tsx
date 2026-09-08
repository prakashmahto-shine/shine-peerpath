import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, Award, Plus, LockOpen, Users,
  ShieldCheck, Loader2
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
    setPeerpathJobContext 
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

  // Dynamically sort tracks by descending currentScore from the API analysis
  const sortedTracks = useMemo(() => {
    return [...allTrackKeys].sort((a, b) => {
      const scoreA = pathwayGapResults?.[a]?.currentScore ?? (a === 'arch' ? 78 : a === 'pm' ? 68 : a === 'ai' ? 65 : a === 'search' ? 62 : 55);
      const scoreB = pathwayGapResults?.[b]?.currentScore ?? (b === 'arch' ? 78 : b === 'pm' ? 68 : b === 'ai' ? 65 : b === 'search' ? 62 : 55);
      return scoreB - scoreA; // Descending: highest currentScore first!
    });
  }, [pathwayGapResults]);

  // Top 3 Recommended Careers for candidate based on API match score
  const top3Tracks = useMemo(() => sortedTracks.slice(0, 3), [sortedTracks]);

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

    const mentorsList: TrackMentorOption[] = (liveCreators && liveCreators.length > 0)
      ? liveCreators.map((m) => {
          const compName = m.creator.company.replace(/\(.*?\)/g, '').trim();
          return {
            id: m.creator.id,
            name: m.creator.name,
            shortName: `${m.creator.name.split(' ')[0]} @ ${compName.split(' ')[0]}`,
            avatar: m.creator.avatar,
            role: `${m.creator.role} @ ${compName}`,
            rating: `${m.creator.rating} (${m.creator.reviewsCount})`,
            price: m.creator.price,
            pastRole: m.creator.trajectory 
              ? `${m.creator.trajectory.role3YearsAgo} (${m.creator.trajectory.salary3YearsAgo})` 
              : 'Senior Engineer',
            jumpRole: `${m.jumpDelta} • ${m.creator.role}`,
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
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Our AI engine is pairing verified Tier-1 mentors for this vertical.</span>
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
          {/* Top Header: Target Badge + Mentors Available Count */}
          <div className="stc-target-salary-badge">
            <div className="stc-salary-title-group">
              <span className="stc-salary-title">🎯 Trajectory Twin</span>
              <span className="stc-mentors-count-chip">
                <Users size={10} /> {mentorsList.length} Mentors Available
              </span>
            </div>
            <strong className="stc-salary-amount">{targetSalaryDisplay}</strong>
          </div>

          {/* Mentor Switcher Notice & Interactive Tabs */}
          <div className="stc-mentor-switcher-container">
            <div className="stc-switcher-prompt-row">
              <div className="stc-switcher-prompt-text">
                <Sparkles size={11} className="text-amber-500" />
                <strong>Choose Mentor Twin:</strong>
                <span className="stc-switcher-sub-hint">Compare real salary jumps</span>
              </div>
              <span className="stc-switcher-active-idx">
                {activeIdx + 1} / {mentorsList.length}
              </span>
            </div>

            <div className="stc-mentor-switcher-row">
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
                    className={`stc-mentor-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedMentorIndex(prev => ({ ...prev, [trackKey]: idx }))}
                    title={`Click to view ${m.name}'s (${company}) trajectory & book 1:1 prep`}
                  >
                    <div className="stc-tab-av-wrap">
                      <img src={m.avatar} alt={m.name} className="stc-tab-av-img" />
                      {isSelected && <span className="stc-tab-active-dot">✓</span>}
                    </div>
                    <div className="stc-tab-text-wrap">
                      <span className="stc-tab-mentor-name">{firstName}</span>
                      <span className="stc-tab-mentor-company">{company}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Mentor Profile Header */}
          <div className="stc-mentor-profile-header">
            <div className="stc-mentor-avatar-wrap">
              <img src={activeMentor.avatar} alt={activeMentor.name} className="stc-mentor-avatar-img" />
              <span className="stc-mentor-badge-check">✓</span>
            </div>
            <div className="stc-mentor-meta-info">
              <div className="stc-mentor-name-row">
                <span className="stc-mentor-name">{activeMentor.name}</span>
                <span className="stc-mentor-rating-tag"><Star size={9} fill="#D97706" color="#D97706" /> {activeMentor.rating}</span>
              </div>
              <span className="stc-mentor-role-sub">{activeMentor.role}</span>
            </div>
          </div>

          {/* Active Mentor Journey Story */}
          <div className="stc-mentor-story-box">
            <div className="stc-story-headline">
              <span>How {activeMentor.name.split(' ')[0]} Made This Jump</span>
              <span className="stc-mentor-live-tag">{activeMentor.liveTag}</span>
            </div>
            <div className="stc-story-step">
              <span className="stc-step-bullet">📍</span>
              <div className="stc-step-body">
                <strong>Baseline:</strong> {activeMentor.pastRole}
              </div>
            </div>
            <div className="stc-story-step">
              <span className="stc-step-bullet">🚀</span>
              <div className="stc-step-body">
                <strong>The Jump:</strong> {activeMentor.jumpRole}
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <button 
            type="button" 
            className="btn-stc-book-mentor-hero"
            onClick={() => handleBookWithMentor(activeMentor.id)}
          >
            <Video size={12} />
            <span>Book 1:1 Prep with {activeMentor.name.split(' ')[0]} • ₹{activeMentor.price}</span>
          </button>

          {/* Footnote + Gallery Link in One Sleek Row */}
          <div className="stc-card-bottom-row">
            <span className="stc-card-footnote" title={activeMentor.footnote}>
              💡 {activeMentor.footnote}
            </span>
            <button 
              type="button" 
              className="stc-explore-gallery-link"
              onClick={() => onNavigate('experts-view')}
            >
              <span>Explore All Mentors ➔</span>
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
    const targetScore = gap?.targetScore ?? 95;
    const currentScore = Math.min(targetScore, baseScore + Math.round(addedCount * ((targetScore - baseScore) / (boosterSkills.length || 1))));
    const targetRole = gap?.targetRole || (trackBoosterInfo[trackKey]?.targetRole || meta.tabShortLabel);
    const targetSalary = gap?.targetSalaryPotential || benchmark.tracks[trackKey]?.display || 'Up to ₹36L';
    const openingsCount = meta.openingsCount;

    return (
      <div key={trackKey} className="shine-traj-card">
        <div className="stc-main-layout">
          {/* Left Column: Role Details, Openings, Current & Target Skills, View Jobs */}
          <div className="stc-left-col">
            <div>
              <div className="stc-meta-top">
                <span className={`stc-track-pill ${meta.pillColorClass}`}>
                  Career #{rank} • {meta.trackCategory}
                </span>
                <span>•</span>
                <span className="stc-openings-fire">🔥 {openingsCount}+ Active Openings</span>
                <span>•</span>
                <span>Hiring: <strong>{meta.hiringCompanies}</strong></span>
              </div>

              <h3 className="stc-role-title">
                {userRole} <span className="stc-role-arrow">➔</span> <span className="stc-target-role">{targetRole}</span>
              </h3>
            </div>

            <div className="stc-skills-section">
              <div className="stc-skills-row">
                <span className="stc-skills-lbl"><CheckCircle2 size={12} className="text-emerald-600" /> On Your CV:</span>
                <div className="stc-chips-wrap">
                  {onCvSkills.map((skill, idx) => (
                    <span key={idx} className="stc-chip-base">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="stc-skills-row">
                <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Recommended Booster Skills:</span>
                <div className="stc-chips-wrap">
                  {boosterSkills.map((skillName, idx) => {
                    const isAdded = isSkillOnProfile(skillName);
                    return (
                      <button 
                        key={idx}
                        type="button" 
                        className={`stc-chip-booster ${isAdded ? 'in-profile' : ''}`}
                        onClick={() => addSkill(skillName)}
                        title="Click to add to your profile"
                      >
                        {isAdded ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                        <span>{skillName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Unlock Alert Strip */}
              {!isFullyUnlocked && addedCount === 0 && (
                <div className="stc-unlock-alert-strip locked">
                  <span className="stc-alert-icon">🎯</span>
                  <div className="stc-alert-body">
                    <strong>{openingsCount}+ Verified Openings ({targetSalary.replace(' LPA', 'L')}):</strong> Current profile match is {currentScore}%. Add these {boosterSkills.length} booster skills to reach {targetScore}% match & get direct recruiter shortlists.
                  </div>
                </div>
              )}
              {!isFullyUnlocked && addedCount > 0 && (
                <div className="stc-unlock-alert-strip progress">
                  <span className="stc-alert-icon">⚡</span>
                  <div className="stc-alert-body">
                    <strong>{openingsCount}+ Verified Openings ({targetSalary.replace(' LPA', 'L')}):</strong> Current profile match increased to <strong>{currentScore}%</strong> ({addedCount}/{boosterSkills.length} skills added). Add {remainingCount} more booster {remainingCount === 1 ? 'skill' : 'skills'} to reach {targetScore}% match & get direct recruiter shortlists.
                  </div>
                </div>
              )}
              {isFullyUnlocked && (
                <div className="stc-unlock-alert-strip unlocked">
                  <span className="stc-alert-icon">🎉</span>
                  <div className="stc-alert-body">
                    <strong>{openingsCount}+ Verified Openings ({targetSalary.replace(' LPA', 'L')}):</strong> <strong>{targetScore}% Top Match Profile Achieved!</strong> You qualify for direct recruiter shortlisting across all {openingsCount}+ {meta.trackCategory} openings.
                  </div>
                </div>
              )}
            </div>

            <div className="stc-left-footer">
              <button 
                type="button" 
                className={`btn-stc-jobs ${isFullyUnlocked ? 'unlocked' : ''}`}
                onClick={() => handleOpenMatchingJobs(trackKey)}
              >
                {isFullyUnlocked ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Briefcase size={13} />}
                <span>{isFullyUnlocked ? `View ${openingsCount}+ High-Match Jobs (${targetScore}% Fast-Track Apply)` : `Explore ${openingsCount}+ Matching Jobs (${targetSalary.replace(' LPA', 'L')})`}</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
          {renderMentorTwinCard(trackKey)}
        </div>
      </div>
    );
  };

  return (
    <div className="content-wrapper peerpath-guidance-page">

      {/* Peerpath Top Sub-Nav View Switcher + Become Mentor CTA */}
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
      
      {/* 1. Official Shine-Native Peerpath Hero Banner */}
      <div className="peerpath-hero-banner">
        <div className="peerpath-hero-left">
          <div className="peerpath-tag-pill">
            <Sparkles size={13} className="text-amber-600" />
            <span>SHINE PEERPATH • CAREER MULTIPLIER</span>
          </div>

          <h1 className="peerpath-hero-title">
            Tailored for {userProfile.name || 'Candidate'} • {userRole} ({userExpYears})
          </h1>

          <p className="peerpath-hero-desc">
            Benchmark your current profile against Tier-1 product standards. Acquire high-demand booster skills and prepare 1:1 with verified peer mentors to multiply your salary offers.
          </p>

          <div className="hero-stats-chips-row">
            <div className="h-stat-chip chip-growth">
              <TrendingUp size={13} className="chip-icon-emerald" />
              <span>Target CTC: <strong>{userTargetSalary}</strong></span>
            </div>
            <div className="h-stat-chip chip-jobs">
              <Briefcase size={13} className="chip-icon-blue" />
              <span>Active Verified Jobs: <strong>2,850+</strong></span>
            </div>
            <div className="h-stat-chip chip-mentors">
              <UserCheck size={13} className="chip-icon-slate" />
              <span>Tier-1 Mentors: <strong>500+ Verified</strong></span>
            </div>
          </div>

          <div className="hero-cta-buttons">
            <button 
              type="button" 
              className="btn-hero-primary-gold"
              onClick={scrollToTrajectories}
            >
              <TrendingUp size={15} />
              <span>Explore High-Growth Pathways</span>
              <ArrowRight size={14} />
            </button>
            <button 
              type="button" 
              className="btn-hero-glass"
              onClick={() => onNavigate('experts-view')}
            >
              <Video size={14} />
              <span>1:1 Mock Interviews</span>
            </button>
          </div>
        </div>

        {/* Right Benchmark Summary Card (High-Impact Conversion Anchor) */}
        <div className="salary-unlock-preview-card">
          <div className="sup-header">
            <div className="sup-header-left">
              <span className="sup-badge">
                <Sparkles size={11} className="text-amber-400" /> SALARY BENCHMARK
              </span>
              <span className="sup-market-live-dot">
                <span className="sup-live-ping"></span> Live Market Data
              </span>
            </div>
            <span className="sup-role">{userRole}</span>
          </div>

          <div className="sup-comparison-row">
            {/* Current Baseline */}
            <div className="sup-tier current">
              <span className="sup-tier-label">Current Estimate</span>
              <span className="sup-tier-val">{userCurrentSalary}</span>
              <span className="sup-tier-sub">Baseline ({userCoreSkills.split(',').length} Skills)</span>
            </div>

            {/* Jump Bridge Indicator */}
            <div className="sup-arrow">
              <div className="sup-jump-pill">
                <TrendingUp size={12} />
                <strong>{jumpPercentageDisplay}</strong>
                <span>Jump</span>
              </div>
            </div>

            {/* Peerpath Target Potential (High-Value Focus) */}
            <div className="sup-tier target">
              <div className="sup-target-badge-wrap">
                <span className="sup-target-badge">🔥 TARGET CTC</span>
              </div>
              <span className="sup-tier-val sup-target-highlight">{userTargetSalary}</span>
              <span className="sup-tier-sub sup-booster-sub">With 2 Booster Skills</span>
            </div>
          </div>

          {/* Ultra-Compact High-Curiosity Formula Hook */}
          <div className="sup-hook-pill">
            <div className="shp-left">
              <span className="shp-badge">💡 THE FORMULA</span>
              <span className="shp-text">
                Add <strong>2 Booster Skills</strong> + <strong>1:1 Mentor Prep</strong> ➔ Unlock <strong>{userTargetSalary}</strong>
              </span>
            </div>
          </div>

          {/* Direct Pathway Activation CTA */}
          <button 
            type="button" 
            className="btn-sup-unlock"
            onClick={scrollToTrajectories}
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Unlock Your {userTargetSalary} Roadmap</span>
            <ArrowRight size={13} />
          </button>

          {/* Trust Meta */}
          <div className="sup-trust-row">
            <span>⚡ 3.4x Faster Shortlisting</span>
            <span>•</span>
            <span>2,850+ Direct Openings</span>
          </div>
        </div>
      </div>

      {/* 2 & 3. Lower Section: Curated Opportunity Pathways & Suggested Jobs */}
      <div className="trajectories-section-header" id="trajectoriesSection">
        <div className="section-title-wrap">
          <div className="profile-context-inline">
            <span className="pci-pill">
              <Briefcase size={12} className="sparkle-amber" /> RECOMMENDED OPPORTUNITIES • {userRole} ({userExpYears})
            </span>
            <span className="pci-bench">
              Target CTC Potential: <strong>{userTargetSalary}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="section-main-title m-0">Curated High-Growth Job Pathways & Opportunities</h2>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Live API Mapping (POST /api/cv/pathways-analysis • Descending Match Score)
            </span>
          </div>
        </div>

        <div className="track-filter-pills">
          <button 
            className={`t-pill ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            Top 3 Careers <span className="t-pill-count">3</span>
          </button>
          {top3Tracks.map((trackKey, idx) => {
            const meta = TRACKS_METADATA[trackKey];
            const gap = pathwayGapResults?.[trackKey];
            const salary = (gap?.targetSalaryPotential || benchmark.tracks[trackKey]?.display || 'Up to ₹36L').replace(' LPA', 'L');
            const score = gap?.currentScore ?? (trackKey === 'arch' ? 78 : trackKey === 'pm' ? 68 : trackKey === 'ai' ? 65 : trackKey === 'search' ? 62 : 55);
            return (
              <button
                key={trackKey}
                className={`t-pill ${activeTab === trackKey ? 'active' : ''}`}
                onClick={() => setActiveTab(trackKey)}
              >
                {idx + 1}. {meta.tabShortLabel} <span className="t-pill-salary">{salary}</span>
                <span style={{ fontSize: '10px', opacity: 0.85, marginLeft: '4px' }}>({score}%)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Trajectory Cards Stack: Dynamically mapped TOP 3 Highest-Growth Career Pathways in descending order of currentScore */}
      <div className="trajectories-cards-stack">
        {activeTab === 'all' ? (
          top3Tracks.map((trackKey, idx) => (
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
                      <h3 className="pmf-title">Want 1:1 Interview Prep & Direct Referrals?</h3>
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
          ))
        ) : (
          renderCareerCard(activeTab, top3Tracks.indexOf(activeTab) + 1 || 1)
        )}
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
