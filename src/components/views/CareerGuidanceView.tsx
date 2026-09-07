import React, { useState } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, Award, Plus, LockOpen, Users,
  ShieldCheck
} from 'lucide-react';
import { ViewType, Expert } from '../../types';
import { useApp } from '../../context/AppContext';
import { MatchingJobsModal, PathwayTrackKey } from '../modals/MatchingJobsModal';
import { calculateSalaryBenchmark } from '../../utils/salaryBenchmark';

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
  const [activeTab, setActiveTab] = useState<'all' | 'arch' | 'pm' | 'search' | 'ai' | 'semi'>('all');
  const [isJobsModalOpen, setIsJobsModalOpen] = useState<boolean>(false);
  const [matchingJobsTrack, setMatchingJobsTrack] = useState<PathwayTrackKey>('arch');
  const isMentor = currentUser?.role === 'mentor';

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

  const handleOpenMatchingJobs = (trackKey: PathwayTrackKey) => {
    const info = trackBoosterInfo[trackKey] || trackBoosterInfo.arch;
    setSelectedJobCategory(trackKey);
    setPeerpathJobContext({
      isFromPeerpath: true,
      trackKey,
      trackTitle: info.trackTitle,
      targetRole: info.targetRole,
      targetPackage: info.targetPackage,
      requiredBoosterSkills: info.skills
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

  const trackMentorsConfig: Record<PathwayTrackKey, {
    totalInTrack: number;
    trackLabel: string;
    mentors: TrackMentorOption[];
  }> = {
    arch: {
      totalInTrack: 18,
      trackLabel: 'Architecture',
      mentors: [
        {
          id: 'saheli',
          name: 'Saheli Kanjilal',
          shortName: 'Saheli @ Razorpay',
          avatar: '/avatars/saheli.jpg',
          role: 'Staff Architect @ Razorpay',
          rating: '4.9 (58)',
          price: 999,
          pastRole: 'Junior Frontend Dev (Same baseline CV)',
          jumpRole: '3.8x Package Jump to Staff Architect @ Razorpay',
          footnote: "Get Saheli's transition roadmap + Razorpay referral tips",
          liveTag: '⚡ Slot Today'
        },
        {
          id: 'vikram',
          name: 'Vikram Joshi',
          shortName: 'Vikram @ Google',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
          role: 'Staff EM @ Google (Ex-Uber)',
          rating: '4.9 (190)',
          price: 1499,
          pastRole: 'Frontend Dev @ ₹8L',
          jumpRole: '3.5x Package Jump to Staff Lead @ Google',
          footnote: 'Tier-1 system design review + Google hiring rubric',
          liveTag: '⚡ Slot Tomorrow'
        },
        {
          id: 'prakash',
          name: 'Prakash M.',
          shortName: 'Prakash @ MMT',
          avatar: '/avatars/prakash.jpg',
          role: 'Principal Architect @ Makemytrip',
          rating: '4.9 (84)',
          price: 999,
          pastRole: 'UI Engineer (Baseline React)',
          jumpRole: '3.9x Package Jump to Principal UI Architect',
          footnote: 'Module Federation roadmap + Makemytrip referrals',
          liveTag: '⚡ Slot Today'
        }
      ]
    },
    pm: {
      totalInTrack: 14,
      trackLabel: 'Product Management',
      mentors: [
        {
          id: 'akash',
          name: 'Akash Jain',
          shortName: 'Akash @ Shine',
          avatar: '/avatars/akash.jpg',
          role: 'Lead PM @ Shine • Ex-Flipkart',
          rating: '4.9 (74)',
          price: 999,
          pastRole: 'Senior Software Engineer',
          jumpRole: '3.2x Package Jump to Lead PM @ Shine',
          footnote: 'Get PM interview case frameworks + Resume critique',
          liveTag: '⚡ Slot Today'
        },
        {
          id: 'rohan',
          name: 'Rohan Mehta',
          shortName: 'Rohan @ Freshworks',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          role: 'Director of Product @ Freshworks',
          rating: '4.9 (150)',
          price: 1299,
          pastRole: 'Technical Business Analyst',
          jumpRole: '3.4x Package Jump to Product Director',
          footnote: 'Product teardown critique + Freshworks hiring tips',
          liveTag: '⚡ Slot Tomorrow'
        },
        {
          id: 'pooja',
          name: 'Pooja Nair',
          shortName: 'Pooja @ CRED',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
          role: 'Lead PM @ CRED • Ex-Swiggy',
          rating: '4.9 (112)',
          price: 1199,
          pastRole: 'Frontend Developer',
          jumpRole: '3.6x Package Jump to Lead PM @ CRED',
          footnote: 'Product teardown critique + CRED interview prep',
          liveTag: '⚡ Slot Today'
        }
      ]
    },
    search: {
      totalInTrack: 12,
      trackLabel: 'Search & Data Infra',
      mentors: [
        {
          id: 'anirudh',
          name: 'Anirudh Sharma',
          shortName: 'Anirudh @ Shine',
          avatar: '/avatars/anirudh.jpg',
          role: 'Principal Architect @ Shine',
          rating: '4.9 (49)',
          price: 1199,
          pastRole: 'Backend & Database Engineer',
          jumpRole: '3.5x Package Jump to Principal Architect',
          footnote: 'System design mock + Search architecture guidance',
          liveTag: '⚡ Slot Tomorrow'
        },
        {
          id: 'amit',
          name: 'Amit Verma',
          shortName: 'Amit @ Salesforce',
          avatar: '/avatars/amit.jpg',
          role: 'Lead Cloud & DB Architect @ Salesforce',
          rating: '4.8 (120)',
          price: 999,
          pastRole: 'Database Administrator',
          jumpRole: '3.3x Package Jump to Cloud Architect',
          footnote: 'Distributed DB scaling + Salesforce referrals',
          liveTag: '⚡ Slot Today'
        },
        {
          id: 'neha',
          name: 'Neha Gupta',
          shortName: 'Neha @ Uber',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
          role: 'Principal Search Infra Lead @ Uber',
          rating: '4.9 (135)',
          price: 1299,
          pastRole: 'Backend & Data Engineer',
          jumpRole: '3.6x Package Jump to Uber Search Infra',
          footnote: 'Real-time pipeline mock + Uber & Zepto referrals',
          liveTag: '⚡ Slot Today'
        }
      ]
    },
    ai: {
      totalInTrack: 16,
      trackLabel: 'Generative AI & LLM',
      mentors: [
        {
          id: 'ishita',
          name: 'Ishita Sharma',
          shortName: 'Ishita @ Swiggy',
          avatar: '/avatars/ishita.jpg',
          role: 'GenAI Lead @ Swiggy',
          rating: '4.8 (63)',
          price: 899,
          pastRole: 'Fullstack Developer',
          jumpRole: '3.6x Package Jump to GenAI Lead @ Swiggy',
          footnote: 'RAG pipeline architecture review + Swiggy referrals',
          liveTag: '⚡ Slot Today'
        },
        {
          id: 'vikram',
          name: 'Vikram Joshi',
          shortName: 'Vikram @ Google',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
          role: 'AI Infrastructure Lead @ Google',
          rating: '4.9 (190)',
          price: 1499,
          pastRole: 'Senior ML Engineer',
          jumpRole: '3.7x Package Jump to AI Lead @ Google',
          footnote: 'Production LLM deployment + Google interview prep',
          liveTag: '⚡ Slot Today'
        },
        {
          id: 'amit',
          name: 'Amit Verma',
          shortName: 'Amit @ Salesforce',
          avatar: '/avatars/amit.jpg',
          role: 'Staff AI & Platform Architect @ Salesforce',
          rating: '4.85 (128)',
          price: 1199,
          pastRole: 'Backend Engineer (Python/Django)',
          jumpRole: '3.5x Package Jump to Staff AI Architect',
          footnote: 'Enterprise LLM fine-tuning + Salesforce hiring tips',
          liveTag: '⚡ Slot Tomorrow'
        }
      ]
    },
    semi: {
      totalInTrack: 9,
      trackLabel: 'Semiconductor & VLSI',
      mentors: [
        {
          id: 'arunachalam',
          name: 'Arunachalam V.',
          shortName: 'Arun @ Qualcomm',
          avatar: '/avatars/sunil.jpg',
          role: 'Staff Silicon Architect @ Qualcomm',
          rating: '4.9 (184)',
          price: 1199,
          pastRole: 'Junior Embedded / FPGA Engineer',
          jumpRole: '4.1x Package Jump to Staff Silicon Architect @ Qualcomm',
          footnote: 'ASIC testbench review + Qualcomm & Tata Fab referrals',
          liveTag: '⚡ Slot Today'
        },
        {
          id: 'anirudh',
          name: 'Anirudh S.',
          shortName: 'Anirudh @ TI',
          avatar: '/avatars/anirudh.jpg',
          role: 'Principal Hardware & EDA Lead @ TI',
          rating: '4.85 (92)',
          price: 1199,
          pastRole: 'Digital Design Engineer',
          jumpRole: '3.8x Package Jump to Principal EDA Lead',
          footnote: 'UVM & SystemVerilog testbench review + TI referrals',
          liveTag: '⚡ Slot Tomorrow'
        },
        {
          id: 'sunil',
          name: 'Sunil Kumar',
          shortName: 'Sunil @ Intel',
          avatar: '/avatars/amit.jpg',
          role: 'Principal RTL Architect @ Intel',
          rating: '4.9 (140)',
          price: 1299,
          pastRole: 'VLSI Verification Engineer',
          jumpRole: '3.9x Package Jump to Principal Intel Engineer',
          footnote: 'SoC floorplanning review + Intel/Nvidia referrals',
          liveTag: '⚡ Slot Today'
        }
      ]
    }
  };

  const renderMentorTwinCard = (trackKey: PathwayTrackKey) => {
    const config = trackMentorsConfig[trackKey];
    const activeIdx = selectedMentorIndex[trackKey] || 0;
    const activeMentor = config.mentors[activeIdx] || config.mentors[0];
    const targetSalaryDisplay = benchmark.tracks[trackKey].display;

    return (
      <div className="stc-right-col">
        <div className="stc-mentor-hero-card">
          {/* Top Header: Target Badge + Mentors Available Count */}
          <div className="stc-target-salary-badge">
            <div className="stc-salary-title-group">
              <span className="stc-salary-title">🎯 Trajectory Twin</span>
              <span className="stc-mentors-count-chip">
                <Users size={10} /> {config.mentors.length} Mentors Available
              </span>
            </div>
            <strong className="stc-salary-amount">{targetSalaryDisplay}</strong>
          </div>

          {/* Mentor Switcher Notice & Interactive Tabs */}
          <div className="stc-mentor-switcher-container">
            <div className="stc-switcher-prompt-row">
              <span className="stc-switcher-prompt-text">
                ✨ <strong>Choose Mentor:</strong> Click to view jump & roadmap
              </span>
              <span className="stc-switcher-active-idx">
                {activeIdx + 1} of {config.mentors.length}
              </span>
            </div>

            <div className="stc-mentor-switcher-row">
              {config.mentors.map((m, idx) => {
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
              <span>All {config.totalInTrack}+ Mentors ➔</span>
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
          <h2 className="section-main-title">Curated High-Growth Job Pathways & Opportunities</h2>
        </div>

        <div className="track-filter-pills">
          <button className={`t-pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All Opportunities <span className="t-pill-count">5</span>
          </button>
          <button className={`t-pill ${activeTab === 'arch' ? 'active' : ''}`} onClick={() => setActiveTab('arch')}>
            Lead UI Architect <span className="t-pill-salary">{benchmark.tracks.arch.display.replace(' LPA', 'L')}</span>
          </button>
          <button className={`t-pill ${activeTab === 'pm' ? 'active' : ''}`} onClick={() => setActiveTab('pm')}>
            Product Management <span className="t-pill-salary">{benchmark.tracks.pm.display.replace(' LPA', 'L')}</span>
          </button>
          <button className={`t-pill ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
            Search & Solr Infra <span className="t-pill-salary">{benchmark.tracks.search.display.replace(' LPA', 'L')}</span>
          </button>
          <button className={`t-pill ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
            GenAI & LLM <span className="t-pill-salary">{benchmark.tracks.ai.display.replace(' LPA', 'L')}</span>
          </button>
          <button className={`t-pill ${activeTab === 'semi' ? 'active' : ''}`} onClick={() => setActiveTab('semi')}>
            Semiconductor & VLSI <span className="t-pill-salary">{benchmark.tracks.semi.display.replace(' LPA', 'L')}</span>
          </button>
        </div>
      </div>

      {/* 4. Trajectory Cards Stack (Shine-Native Compact Clean Cards) */}
      <div className="trajectories-cards-stack">
        
        {/* Track 1: Lead UI / Micro-Frontend Architect */}
        {(activeTab === 'all' || activeTab === 'arch') && (() => {
          const archSkills = ['Micro-Frontend Architecture', 'Module Federation (Webpack/Vite)', 'Core Web Vitals & Performance'];
          const addedCount = archSkills.filter(s => isSkillOnProfile(s)).length;
          const isFullyUnlocked = addedCount === archSkills.length;

          return (
            <div className="shine-traj-card">
              <div className="stc-main-layout">
                {/* Left Column: Role Details, Openings, Current & Target Skills, View Jobs */}
                <div className="stc-left-col">
                  <div>
                    <div className="stc-meta-top">
                      <span className="stc-track-pill purple">Architecture Track</span>
                      <span>•</span>
                      <span className="stc-openings-fire">🔥 520+ Active Openings</span>
                      <span>•</span>
                      <span>Hiring: <strong>Swiggy, Razorpay, PhonePe, Makemytrip</strong></span>
                    </div>

                    <h3 className="stc-role-title">
                      Senior Frontend Developer <span className="stc-role-arrow">➔</span> <span className="stc-target-role">Lead UI & Micro-Frontend Architect</span>
                    </h3>
                  </div>

                  <div className="stc-skills-section">
                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl"><CheckCircle2 size={12} className="text-emerald-600" /> On Your CV:</span>
                      <div className="stc-chips-wrap">
                        <span className="stc-chip-base">React.js</span>
                        <span className="stc-chip-base">JavaScript (ES6+)</span>
                        <span className="stc-chip-base">TypeScript</span>
                        <span className="stc-chip-base">Component Arch</span>
                        <span className="stc-chip-base">Redux / State Mgmt</span>
                        <span className="stc-chip-base">HTML5/CSS3</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Recommended Booster Skills:</span>
                      <div className="stc-chips-wrap">
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Micro-Frontend Architecture') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Micro-Frontend Architecture')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Micro-Frontend Architecture') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Micro-Frontends</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Module Federation (Webpack/Vite)') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Module Federation (Webpack/Vite)')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Module Federation (Webpack/Vite)') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Module Federation</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Core Web Vitals & Performance') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Core Web Vitals & Performance')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Core Web Vitals & Performance') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Web Vitals</span>
                        </button>
                      </div>
                    </div>

                    {/* High Impact Unlock Alert Strip */}
                    {!isFullyUnlocked && addedCount === 0 && (
                      <div className="stc-unlock-alert-strip locked">
                        <span className="stc-alert-icon">🎯</span>
                        <div className="stc-alert-body">
                          <strong>{benchmark.tracks.arch.lockedCount}+ Verified Openings ({benchmark.tracks.arch.display.replace(' LPA', 'L')}):</strong> Current profile match is 42%. Add these 3 booster skills to reach 95% match & get direct recruiter shortlists.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Match Rate: 72% ({addedCount}/3 Skills Added):</strong> You are 1 step away from unlocking direct recruiter shortlisting!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>95% Top Match Profile!</strong> You qualify for direct recruiter shortlisting across {benchmark.tracks.arch.lockedCount}+ Architect openings.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="stc-left-footer">
                    <button 
                      type="button" 
                      className={`btn-stc-jobs ${isFullyUnlocked ? 'unlocked' : ''}`}
                      onClick={() => handleOpenMatchingJobs('arch')}
                    >
                      {isFullyUnlocked ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Briefcase size={13} />}
                      <span>{isFullyUnlocked ? `View ${benchmark.tracks.arch.lockedCount}+ High-Match Jobs (95% Fast-Track Apply)` : `Explore ${benchmark.tracks.arch.lockedCount}+ Matching Jobs (${benchmark.tracks.arch.display.replace(' LPA', 'L')})`}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                {renderMentorTwinCard('arch')}
              </div>
            </div>
          );
        })()}

        {/* Track 2: Lead Product Manager */}
        {(activeTab === 'all' || activeTab === 'pm') && (() => {
          const pmSkills = ['PRD & Product Discovery', 'Growth Metrics & Funnels', 'Go-To-Market (GTM) Strategy'];
          const addedCount = pmSkills.filter(s => isSkillOnProfile(s)).length;
          const isFullyUnlocked = addedCount === pmSkills.length;

          return (
            <div className="shine-traj-card">
              <div className="stc-main-layout">
                {/* Left Column: Role Details, Openings, Current & Target Skills, View Jobs */}
                <div className="stc-left-col">
                  <div>
                    <div className="stc-meta-top">
                      <span className="stc-track-pill gold">Product Track</span>
                      <span>•</span>
                      <span className="stc-openings-fire">🔥 430+ Active Openings</span>
                      <span>•</span>
                      <span>Hiring: <strong>Shine, Zepto, Flipkart, CRED, Amazon</strong></span>
                    </div>

                    <h3 className="stc-role-title">
                      Software Engineer <span className="stc-role-arrow">➔</span> <span className="stc-target-role">Lead Technical Product Manager</span>
                    </h3>
                  </div>

                  <div className="stc-skills-section">
                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl"><CheckCircle2 size={12} className="text-emerald-600" /> On Your CV:</span>
                      <div className="stc-chips-wrap">
                        <span className="stc-chip-base">Tech Scoping</span>
                        <span className="stc-chip-base">UI/UX Empathy</span>
                        <span className="stc-chip-base">Agile & Scrum</span>
                        <span className="stc-chip-base">Stakeholder Mgmt</span>
                        <span className="stc-chip-base">Wireframing</span>
                        <span className="stc-chip-base">Data Analytics</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Recommended Booster Skills:</span>
                      <div className="stc-chips-wrap">
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('PRD & Product Discovery') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('PRD & Product Discovery')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('PRD & Product Discovery') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>PRD Discovery</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Growth Metrics & Funnels') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Growth Metrics & Funnels')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Growth Metrics & Funnels') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Product Metrics</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Go-To-Market (GTM) Strategy') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Go-To-Market (GTM) Strategy')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Go-To-Market (GTM) Strategy') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>GTM Strategy</span>
                        </button>
                      </div>
                    </div>

                    {/* High Impact Unlock Alert Strip */}
                    {!isFullyUnlocked && addedCount === 0 && (
                      <div className="stc-unlock-alert-strip locked">
                        <span className="stc-alert-icon">🎯</span>
                        <div className="stc-alert-body">
                          <strong>{benchmark.tracks.pm.lockedCount}+ Verified Openings ({benchmark.tracks.pm.display.replace(' LPA', 'L')}):</strong> Current profile match is 45%. Add these 3 booster skills to reach 94% match & get direct PM shortlists.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Match Rate: 74% ({addedCount}/3 Skills Added):</strong> You are almost ready for direct {benchmark.tracks.pm.display} product shortlists!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>94% Top Match Profile!</strong> You qualify for direct recruiter shortlisting across {benchmark.tracks.pm.lockedCount}+ PM openings.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="stc-left-footer">
                    <button 
                      type="button" 
                      className={`btn-stc-jobs ${isFullyUnlocked ? 'unlocked' : ''}`}
                      onClick={() => handleOpenMatchingJobs('pm')}
                    >
                      {isFullyUnlocked ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Briefcase size={13} />}
                      <span>{isFullyUnlocked ? `View ${benchmark.tracks.pm.lockedCount}+ High-Match Jobs (94% Fast-Track Apply)` : `Explore ${benchmark.tracks.pm.lockedCount}+ Matching Jobs (${benchmark.tracks.pm.display.replace(' LPA', 'L')})`}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                {renderMentorTwinCard('pm')}
              </div>
            </div>
          );
        })()}

        {/* Clean, Visual Mid-Feed Mentorship Banner */}
        {activeTab === 'all' && (
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

        {/* Track 3: Principal Search & Solr Database Architect */}
        {(activeTab === 'all' || activeTab === 'search') && (() => {
          const searchSkills = ['Apache Solr & Lucene Engine', 'Inverted Indexing & Sharding', 'Sub-10ms Query Optimization'];
          const addedCount = searchSkills.filter(s => isSkillOnProfile(s)).length;
          const isFullyUnlocked = addedCount === searchSkills.length;

          return (
            <div className="shine-traj-card">
              <div className="stc-main-layout">
                {/* Left Column: Role Details, Openings, Current & Target Skills, View Jobs */}
                <div className="stc-left-col">
                  <div>
                    <div className="stc-meta-top">
                      <span className="stc-track-pill blue">Core Infrastructure</span>
                      <span>•</span>
                      <span className="stc-openings-fire">🔥 290+ High-Paying Openings</span>
                      <span>•</span>
                      <span>Hiring: <strong>Shine, Adobe, Walmart, Microsoft, Uber</strong></span>
                    </div>

                    <h3 className="stc-role-title">
                      Backend Developer <span className="stc-role-arrow">➔</span> <span className="stc-target-role">Principal Search & Solr Architect</span>
                    </h3>
                  </div>

                  <div className="stc-skills-section">
                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl"><CheckCircle2 size={12} className="text-emerald-600" /> On Your CV:</span>
                      <div className="stc-chips-wrap">
                        <span className="stc-chip-base">Node.js / Python</span>
                        <span className="stc-chip-base">REST APIs</span>
                        <span className="stc-chip-base">SQL Schema</span>
                        <span className="stc-chip-base">Microservices</span>
                        <span className="stc-chip-base">PostgreSQL/MySQL</span>
                        <span className="stc-chip-base">Distributed Systems</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Recommended Booster Skills:</span>
                      <div className="stc-chips-wrap">
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Apache Solr & Lucene Engine') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Apache Solr & Lucene Engine')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Apache Solr & Lucene Engine') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Apache Solr</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Inverted Indexing & Sharding') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Inverted Indexing & Sharding')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Inverted Indexing & Sharding') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Index Sharding</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Sub-10ms Query Optimization') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Sub-10ms Query Optimization')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Sub-10ms Query Optimization') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Latency Tuning</span>
                        </button>
                      </div>
                    </div>

                    {/* High Impact Unlock Alert Strip */}
                    {!isFullyUnlocked && addedCount === 0 && (
                      <div className="stc-unlock-alert-strip locked">
                        <span className="stc-alert-icon">🎯</span>
                        <div className="stc-alert-body">
                          <strong>{benchmark.tracks.search.lockedCount}+ Verified Openings ({benchmark.tracks.search.display.replace(' LPA', 'L')}):</strong> Current profile match is 38%. Add these 3 booster skills to reach 96% match & get direct search infra shortlists.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Match Rate: 70% ({addedCount}/3 Skills Added):</strong> You are almost ready for direct {benchmark.tracks.search.display} Principal shortlists!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>96% Top Match Profile!</strong> You qualify for direct recruiter shortlisting across {benchmark.tracks.search.lockedCount}+ Principal openings.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="stc-left-footer">
                    <button 
                      type="button" 
                      className={`btn-stc-jobs ${isFullyUnlocked ? 'unlocked' : ''}`}
                      onClick={() => handleOpenMatchingJobs('search')}
                    >
                      {isFullyUnlocked ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Briefcase size={13} />}
                      <span>{isFullyUnlocked ? `View ${benchmark.tracks.search.lockedCount}+ High-Match Jobs (96% Fast-Track Apply)` : `Explore ${benchmark.tracks.search.lockedCount}+ Matching Jobs (${benchmark.tracks.search.display.replace(' LPA', 'L')})`}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                {renderMentorTwinCard('search')}
              </div>
            </div>
          );
        })()}

        {/* Track 4: Production GenAI / LLM Engineer */}
        {(activeTab === 'all' || activeTab === 'ai') && (() => {
          const aiSkills = ['LangChain / LLM Orchestration', 'Vector Embeddings (Pinecone)', 'RAG Pipeline Evaluation'];
          const addedCount = aiSkills.filter(s => isSkillOnProfile(s)).length;
          const isFullyUnlocked = addedCount === aiSkills.length;

          return (
            <div className="shine-traj-card">
              <div className="stc-main-layout">
                {/* Left Column: Role Details, Openings, Current & Target Skills, View Jobs */}
                <div className="stc-left-col">
                  <div>
                    <div className="stc-meta-top">
                      <span className="stc-track-pill teal">Generative AI</span>
                      <span>•</span>
                      <span className="stc-openings-fire">🔥 610+ Active Openings</span>
                      <span>•</span>
                      <span>Hiring: <strong>Swiggy, OpenAI Partner Co, Postman</strong></span>
                    </div>

                    <h3 className="stc-role-title">
                      Fullstack Developer <span className="stc-role-arrow">➔</span> <span className="stc-target-role">Production GenAI & LLM Engineer</span>
                    </h3>
                  </div>

                  <div className="stc-skills-section">
                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl"><CheckCircle2 size={12} className="text-emerald-600" /> On Your CV:</span>
                      <div className="stc-chips-wrap">
                        <span className="stc-chip-base">Fullstack App</span>
                        <span className="stc-chip-base">Python / APIs</span>
                        <span className="stc-chip-base">DB Modeling</span>
                        <span className="stc-chip-base">WebSockets</span>
                        <span className="stc-chip-base">Async Queues</span>
                        <span className="stc-chip-base">Cloud Deployment</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Recommended Booster Skills:</span>
                      <div className="stc-chips-wrap">
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('LangChain / LLM Orchestration') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('LangChain / LLM Orchestration')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('LangChain / LLM Orchestration') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>LangChain/LLMs</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Vector Embeddings (Pinecone)') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Vector Embeddings (Pinecone)')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Vector Embeddings (Pinecone)') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Vector Pinecone</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('RAG Pipeline Evaluation') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('RAG Pipeline Evaluation')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('RAG Pipeline Evaluation') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>RAG Evaluation</span>
                        </button>
                      </div>
                    </div>

                    {/* High Impact Unlock Alert Strip */}
                    {!isFullyUnlocked && addedCount === 0 && (
                      <div className="stc-unlock-alert-strip locked">
                        <span className="stc-alert-icon">🎯</span>
                        <div className="stc-alert-body">
                          <strong>{benchmark.tracks.ai.lockedCount}+ Verified Openings ({benchmark.tracks.ai.display.replace(' LPA', 'L')}):</strong> Current profile match is 40%. Add these 3 booster skills to reach 95% match & get direct GenAI shortlists.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Match Rate: 72% ({addedCount}/3 Skills Added):</strong> You are almost ready for direct {benchmark.tracks.ai.display} GenAI shortlists!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>95% Top Match Profile!</strong> You qualify for direct recruiter shortlisting across {benchmark.tracks.ai.lockedCount}+ GenAI openings.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="stc-left-footer">
                    <button 
                      type="button" 
                      className={`btn-stc-jobs ${isFullyUnlocked ? 'unlocked' : ''}`}
                      onClick={() => handleOpenMatchingJobs('ai')}
                    >
                      {isFullyUnlocked ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Briefcase size={13} />}
                      <span>{isFullyUnlocked ? `View ${benchmark.tracks.ai.lockedCount}+ High-Match Jobs (95% Fast-Track Apply)` : `Explore ${benchmark.tracks.ai.lockedCount}+ Matching Jobs (${benchmark.tracks.ai.display.replace(' LPA', 'L')})`}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                {renderMentorTwinCard('ai')}
              </div>
            </div>
          );
        })()}

        {/* Track 5: Semiconductor & VLSI (Govt Fab Mission Talent Pool) */}
        {(activeTab === 'all' || activeTab === 'semi') && (() => {
          const semiSkills = ['RTL Design (SystemVerilog)', 'UVM ASIC Verification', 'Static Timing Analysis (STA)'];
          const addedCount = semiSkills.filter(s => isSkillOnProfile(s)).length;
          const isFullyUnlocked = addedCount === semiSkills.length;

          return (
            <div className="shine-traj-card">
              <div className="stc-main-layout">
                {/* Left Column: Role Details, Openings, Current & Target Skills, View Jobs */}
                <div className="stc-left-col">
                  <div>
                    <div className="stc-meta-top">
                      <span className="stc-track-pill amber">⚡ High-Demand Talent Pool</span>
                      <span>•</span>
                      <span className="stc-openings-fire">🏛️ Govt India Fab Mission</span>
                      <span>•</span>
                      <span>Sourcing: <strong>Qualcomm, Intel, Tata Electronics, Micron, TI</strong></span>
                    </div>

                    <h3 className="stc-role-title">
                      Junior Embedded / Hardware Engineer <span className="stc-role-arrow">➔</span> <span className="stc-target-role">Staff Silicon & RTL Design Architect</span>
                    </h3>
                  </div>

                  <div className="stc-skills-section">
                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl"><CheckCircle2 size={12} className="text-emerald-600" /> On Your CV:</span>
                      <div className="stc-chips-wrap">
                        <span className="stc-chip-base">C / C++</span>
                        <span className="stc-chip-base">Digital Logic</span>
                        <span className="stc-chip-base">Basic Verilog</span>
                        <span className="stc-chip-base">FPGA Boards</span>
                        <span className="stc-chip-base">Linux & Shell</span>
                        <span className="stc-chip-base">Circuit Analysis</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Recommended Booster Skills:</span>
                      <div className="stc-chips-wrap">
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('RTL Design (SystemVerilog)') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('RTL Design (SystemVerilog)')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('RTL Design (SystemVerilog)') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>RTL Design/SV</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('UVM ASIC Verification') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('UVM ASIC Verification')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('UVM ASIC Verification') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>UVM Verification</span>
                        </button>
                        <button 
                          type="button" 
                          className={`stc-chip-booster ${isSkillOnProfile('Static Timing Analysis (STA)') ? 'in-profile' : ''}`}
                          onClick={() => addSkill('Static Timing Analysis (STA)')}
                          title="Click to add to your profile"
                        >
                          {isSkillOnProfile('Static Timing Analysis (STA)') ? <Check size={11} className="text-emerald-600" /> : <Plus size={11} />}
                          <span>Static Timing (STA)</span>
                        </button>
                      </div>
                    </div>

                    {/* High Impact Strategic Talent Pool Alert Strip */}
                    {!isFullyUnlocked && addedCount === 0 && (
                      <div className="stc-unlock-alert-strip locked">
                        <span className="stc-alert-icon">🏛️</span>
                        <div className="stc-alert-body">
                          <strong>India Semiconductor Talent Pool ({benchmark.tracks.semi.display.replace(' LPA', 'L')}):</strong> 48+ Fab Partners (Qualcomm, Intel, Tata Electronics) are direct-sourcing talent before public postings. Add these 3 booster skills to activate your Direct Recruiter Spotlight.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Match Rate: 75% ({addedCount}/3 Skills Added):</strong> Profile primed for direct headhunting invites!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>Top 1% Verified Silicon Candidate!</strong> Your profile is active in Shine's Priority Sourcing Pipeline for 48+ semiconductor hiring partners.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="stc-left-footer">
                    <button 
                      type="button" 
                      className={`btn-stc-jobs ${isFullyUnlocked ? 'unlocked' : ''}`}
                      onClick={() => handleOpenMatchingJobs('semi')}
                    >
                      {isFullyUnlocked ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Sparkles size={13} className="text-amber-500" />}
                      <span>{isFullyUnlocked ? `View Verified Semiconductor Talent Pool (Priority Headhunt)` : `Join India Semiconductor Talent Pool (${benchmark.tracks.semi.display.replace(' LPA', 'L')})`}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                {renderMentorTwinCard('semi')}
              </div>
            </div>
          );
        })()}

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

      {/* 6. Matching Jobs Modal Flow */}
      <MatchingJobsModal
        isOpen={isJobsModalOpen}
        initialTrack={matchingJobsTrack}
        onClose={() => setIsJobsModalOpen(false)}
        onNavigate={onNavigate}
        onSelectExpert={onSelectExpert}
      />

    </div>
  );
};
