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

interface CareerGuidanceViewProps {
  onNavigate: (view: ViewType) => void;
  onSelectExpert: (expertId: string) => void;
  experts: Expert[];
}

const TRACK_BOOSTER_INFO: Record<PathwayTrackKey, {
  trackTitle: string;
  targetRole: string;
  targetPackage: string;
  skills: string[];
}> = {
  arch: {
    trackTitle: 'Staff UI & Frontend Architect',
    targetRole: 'Staff UI & Micro-Frontend Architect',
    targetPackage: '₹22 - 36 LPA',
    skills: ['Micro-Frontend Architecture', 'Module Federation (Webpack/Vite)']
  },
  pm: {
    trackTitle: 'Technical Product Manager',
    targetRole: 'Lead Technical Product Manager',
    targetPackage: '₹24 - 38 LPA',
    skills: ['PRD Discovery & Roadmapping', 'Product Metrics & Analytics']
  },
  search: {
    trackTitle: 'Principal Search & Solr Architect',
    targetRole: 'Principal Search & Solr Architect',
    targetPackage: '₹28 - 45 LPA',
    skills: ['Apache Solr & Lucene Engine', 'Sub-10ms Query Optimization']
  },
  ai: {
    trackTitle: 'Generative AI & LLM Full-Stack Architect',
    targetRole: 'Staff AI & Full-Stack Architect',
    targetPackage: '₹30 - 50 LPA',
    skills: ['LangChain & LLM Agents', 'Vector Embeddings & RAG']
  }
};

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
  const [activeTab, setActiveTab] = useState<'all' | 'arch' | 'pm' | 'search' | 'ai'>('all');
  const [isJobsModalOpen, setIsJobsModalOpen] = useState<boolean>(false);
  const [matchingJobsTrack, setMatchingJobsTrack] = useState<PathwayTrackKey>('arch');
  const isMentor = currentUser?.role === 'mentor';

  const handleOpenMatchingJobs = (trackKey: PathwayTrackKey) => {
    const info = TRACK_BOOSTER_INFO[trackKey] || TRACK_BOOSTER_INFO.arch;
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

  const userCurrentSalary = userProfile.currentCtc 
    ? (userProfile.currentCtc.includes('LPA') || userProfile.currentCtc.includes('₹') 
        ? userProfile.currentCtc 
        : `₹${userProfile.currentCtc} LPA`)
    : '₹5.5 - 8.5 LPA';

  const userTargetSalary = userProfile.targetCtc || '₹18 – 38 Lakhs';

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

  const handleBookWithMentor = (mentorId: string) => {
    onSelectExpert(mentorId);
    onNavigate('expert-profile-view');
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
                <strong>+320%</strong>
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
            All Opportunities <span className="t-pill-count">4</span>
          </button>
          <button className={`t-pill ${activeTab === 'arch' ? 'active' : ''}`} onClick={() => setActiveTab('arch')}>
            Lead UI Architect <span className="t-pill-salary">₹22–36L</span>
          </button>
          <button className={`t-pill ${activeTab === 'pm' ? 'active' : ''}`} onClick={() => setActiveTab('pm')}>
            Product Management <span className="t-pill-salary">₹24–38L</span>
          </button>
          <button className={`t-pill ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
            Search & Solr Infra <span className="t-pill-salary">₹32–48L</span>
          </button>
          <button className={`t-pill ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
            GenAI & LLM <span className="t-pill-salary">₹28–45L</span>
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
                        <span className="stc-chip-base">JS ES6+</span>
                        <span className="stc-chip-base">Component Arch</span>
                        <span className="stc-chip-base">HTML5/CSS3</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Booster Skills for +₹14L Jump:</span>
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
                        <span className="stc-alert-icon">🔒</span>
                        <div className="stc-alert-body">
                          <strong>520+ Jobs Locked (₹22L–₹36L):</strong> You are currently not eligible for top Architect roles. Add these 3 booster skills to unlock direct shortlisting.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Progress ({addedCount}/3 Skills Added):</strong> You are 1 step away from unlocking 520+ high-paying shortlists!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>3/3 Skills in Your Profile!</strong> 520+ Architect openings are now fully unlocked for direct shortlist.
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
                      <span>{isFullyUnlocked ? '🔓 520+ Matching Jobs Unlocked (Apply Now)' : '🔒 View 520+ Locked Jobs (Requires 3 Skills)'}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                <div className="stc-right-col">
                  <div className="stc-mentor-hero-card">
                    <div className="stc-target-salary-badge">
                      <span className="stc-salary-title">🎯 Trajectory Twin</span>
                      <strong className="stc-salary-amount">₹22 – 36 LPA</strong>
                    </div>

                    <div className="stc-mentor-profile-header">
                      <div className="stc-mentor-avatar-wrap">
                        <img src="/avatars/saheli.jpg" alt="Saheli Kanjilal" className="stc-mentor-avatar-img" />
                        <span className="stc-mentor-badge-check">✓</span>
                      </div>
                      <div className="stc-mentor-meta-info">
                        <div className="stc-mentor-name-row">
                          <span className="stc-mentor-name">Saheli Kanjilal</span>
                          <span className="stc-mentor-rating-tag"><Star size={9} fill="#D97706" color="#D97706" /> 4.9 (58)</span>
                        </div>
                        <span className="stc-mentor-role-sub">Staff Architect @ Razorpay</span>
                      </div>
                    </div>

                    <div className="stc-mentor-story-box">
                      <div className="stc-story-headline">
                        <span>How Saheli Made This Exact Jump</span>
                        <span className="stc-mentor-live-tag">⚡ Slot Today</span>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">📍</span>
                        <div className="stc-step-body">
                          <strong>3 Yrs Ago:</strong> Frontend Dev @ ₹6L (Same CV as yours)
                        </div>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">🚀</span>
                        <div className="stc-step-body">
                          <strong>The Jump:</strong> Added Micro-Frontends ➔ Reached <strong>₹26L</strong> at Razorpay
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-stc-book-mentor-hero"
                      onClick={() => handleBookWithMentor('saheli')}
                    >
                      <Video size={13} />
                      <span>Book 1:1 Roadmap & Prep • ₹999</span>
                    </button>
                    <div className="stc-card-footnote">Get Saheli's transition roadmap + Razorpay referral tips</div>
                  </div>
                </div>
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
                        <span className="stc-chip-base">Agile/Sprints</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Booster Skills for +₹16L Jump:</span>
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
                        <span className="stc-alert-icon">🔒</span>
                        <div className="stc-alert-body">
                          <strong>430+ Jobs Locked (₹24L–₹38L):</strong> You are currently not eligible for Technical PM shortlists. Add these 3 booster skills to unlock direct shortlisting.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Progress ({addedCount}/3 Skills Added):</strong> You are almost ready for ₹24L–₹38L product roles!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>3/3 Skills in Your Profile!</strong> 430+ PM openings are now fully unlocked for direct shortlist.
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
                      <span>{isFullyUnlocked ? '🔓 430+ Matching Jobs Unlocked (Apply Now)' : '🔒 View 430+ Locked Jobs (Requires 3 Skills)'}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                <div className="stc-right-col">
                  <div className="stc-mentor-hero-card">
                    <div className="stc-target-salary-badge">
                      <span className="stc-salary-title">🎯 Trajectory Twin</span>
                      <strong className="stc-salary-amount">₹24 – 38 LPA</strong>
                    </div>

                    <div className="stc-mentor-profile-header">
                      <div className="stc-mentor-avatar-wrap">
                        <img src="/avatars/akash.jpg" alt="Akash Jain" className="stc-mentor-avatar-img" />
                        <span className="stc-mentor-badge-check">✓</span>
                      </div>
                      <div className="stc-mentor-meta-info">
                        <div className="stc-mentor-name-row">
                          <span className="stc-mentor-name">Akash Jain</span>
                          <span className="stc-mentor-rating-tag"><Star size={9} fill="#D97706" color="#D97706" /> 4.9 (74)</span>
                        </div>
                        <span className="stc-mentor-role-sub">Lead PM @ Shine • Ex-Flipkart</span>
                      </div>
                    </div>

                    <div className="stc-mentor-story-box">
                      <div className="stc-story-headline">
                        <span>How Akash Made This Exact Jump</span>
                        <span className="stc-mentor-live-tag">⚡ Slot Today</span>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">📍</span>
                        <div className="stc-step-body">
                          <strong>3 Yrs Ago:</strong> Software Engineer @ ₹7L
                        </div>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">🚀</span>
                        <div className="stc-step-body">
                          <strong>The Jump:</strong> Added PRD & Growth Metrics ➔ Reached <strong>₹28L</strong> Lead PM
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-stc-book-mentor-hero"
                      onClick={() => handleBookWithMentor('akash')}
                    >
                      <Video size={13} />
                      <span>Book 1:1 Roadmap & Prep • ₹999</span>
                    </button>
                    <div className="stc-card-footnote">Get PM interview case frameworks + Resume critique</div>
                  </div>
                </div>
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
                        <span className="stc-chip-base">Node/Python</span>
                        <span className="stc-chip-base">REST APIs</span>
                        <span className="stc-chip-base">SQL Schema</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Booster Skills for +₹18L Jump:</span>
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
                        <span className="stc-alert-icon">🔒</span>
                        <div className="stc-alert-body">
                          <strong>290+ Jobs Locked (₹32L–₹48L):</strong> You are currently not eligible for Principal Architect shortlists. Add these 3 booster skills to unlock direct eligibility.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Progress ({addedCount}/3 Skills Added):</strong> You are almost ready for ₹32L–₹48L Principal roles!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>3/3 Skills in Your Profile!</strong> 290+ Principal Architect openings are now fully unlocked for direct shortlist.
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
                      <span>{isFullyUnlocked ? '🔓 290+ Matching Jobs Unlocked (Apply Now)' : '🔒 View 290+ Locked Jobs (Requires 3 Skills)'}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                <div className="stc-right-col">
                  <div className="stc-mentor-hero-card">
                    <div className="stc-target-salary-badge">
                      <span className="stc-salary-title">🎯 Trajectory Twin</span>
                      <strong className="stc-salary-amount">₹32 – 48 LPA</strong>
                    </div>

                    <div className="stc-mentor-profile-header">
                      <div className="stc-mentor-avatar-wrap">
                        <img src="/avatars/anirudh.jpg" alt="Anirudh Sharma" className="stc-mentor-avatar-img" />
                        <span className="stc-mentor-badge-check">✓</span>
                      </div>
                      <div className="stc-mentor-meta-info">
                        <div className="stc-mentor-name-row">
                          <span className="stc-mentor-name">Anirudh Sharma</span>
                          <span className="stc-mentor-rating-tag"><Star size={9} fill="#D97706" color="#D97706" /> 4.9 (49)</span>
                        </div>
                        <span className="stc-mentor-role-sub">Principal Architect @ Shine</span>
                      </div>
                    </div>

                    <div className="stc-mentor-story-box">
                      <div className="stc-story-headline">
                        <span>How Anirudh Made This Exact Jump</span>
                        <span className="stc-mentor-live-tag">⚡ Slot Tomorrow</span>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">📍</span>
                        <div className="stc-step-body">
                          <strong>3 Yrs Ago:</strong> Backend Developer @ ₹7L
                        </div>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">🚀</span>
                        <div className="stc-step-body">
                          <strong>The Jump:</strong> Added Solr & Sharding ➔ Reached <strong>₹38L</strong> Principal
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-stc-book-mentor-hero"
                      onClick={() => handleBookWithMentor('anirudh')}
                    >
                      <Video size={13} />
                      <span>Book 1:1 Roadmap & Prep • ₹1,199</span>
                    </button>
                    <div className="stc-card-footnote">System design mock + Search architecture guidance</div>
                  </div>
                </div>
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
                        <span className="stc-chip-base">WebSockets/APIs</span>
                        <span className="stc-chip-base">DB Modeling</span>
                      </div>
                    </div>

                    <div className="stc-skills-row">
                      <span className="stc-skills-lbl-booster"><Zap size={12} className="text-amber-500" /> Booster Skills for +₹16L Jump:</span>
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
                        <span className="stc-alert-icon">🔒</span>
                        <div className="stc-alert-body">
                          <strong>610+ Jobs Locked (₹28L–₹45L):</strong> You are currently not eligible for GenAI roles. Add these 3 booster skills to unlock direct shortlisting.
                        </div>
                      </div>
                    )}
                    {!isFullyUnlocked && addedCount > 0 && (
                      <div className="stc-unlock-alert-strip progress">
                        <span className="stc-alert-icon">⚡</span>
                        <div className="stc-alert-body">
                          <strong>Progress ({addedCount}/3 Skills Added):</strong> You are almost ready for ₹28L–₹45L GenAI roles!
                        </div>
                      </div>
                    )}
                    {isFullyUnlocked && (
                      <div className="stc-unlock-alert-strip unlocked">
                        <span className="stc-alert-icon">🎉</span>
                        <div className="stc-alert-body">
                          <strong>3/3 Skills in Your Profile!</strong> 610+ GenAI openings are now fully unlocked for direct shortlist.
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
                      <span>{isFullyUnlocked ? '🔓 610+ Matching Jobs Unlocked (Apply Now)' : '🔒 View 610+ Locked Jobs (Requires 3 Skills)'}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Dedicated Mentor Trajectory Twin Card */}
                <div className="stc-right-col">
                  <div className="stc-mentor-hero-card">
                    <div className="stc-target-salary-badge">
                      <span className="stc-salary-title">🎯 Trajectory Twin</span>
                      <strong className="stc-salary-amount">₹28 – 45 LPA</strong>
                    </div>

                    <div className="stc-mentor-profile-header">
                      <div className="stc-mentor-avatar-wrap">
                        <img src="/avatars/ishita.jpg" alt="Ishita Sharma" className="stc-mentor-avatar-img" />
                        <span className="stc-mentor-badge-check">✓</span>
                      </div>
                      <div className="stc-mentor-meta-info">
                        <div className="stc-mentor-name-row">
                          <span className="stc-mentor-name">Ishita Sharma</span>
                          <span className="stc-mentor-rating-tag"><Star size={9} fill="#D97706" color="#D97706" /> 4.8 (63)</span>
                        </div>
                        <span className="stc-mentor-role-sub">GenAI Lead @ Swiggy</span>
                      </div>
                    </div>

                    <div className="stc-mentor-story-box">
                      <div className="stc-story-headline">
                        <span>How Ishita Made This Exact Jump</span>
                        <span className="stc-mentor-live-tag">⚡ Slot Today</span>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">📍</span>
                        <div className="stc-step-body">
                          <strong>3 Yrs Ago:</strong> Fullstack Dev @ ₹8L
                        </div>
                      </div>
                      <div className="stc-story-step">
                        <span className="stc-step-bullet">🚀</span>
                        <div className="stc-step-body">
                          <strong>The Jump:</strong> Added RAG & LangChain ➔ Reached <strong>₹35L</strong> AI Lead
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-stc-book-mentor-hero"
                      onClick={() => handleBookWithMentor('ishita')}
                    >
                      <Video size={13} />
                      <span>Book 1:1 Roadmap & Prep • ₹899</span>
                    </button>
                    <div className="stc-card-footnote">RAG pipeline architecture review + Swiggy referrals</div>
                  </div>
                </div>
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
