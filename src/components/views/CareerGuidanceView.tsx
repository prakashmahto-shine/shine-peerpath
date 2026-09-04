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

          {/* Social Proof Checklist */}
          <div className="sup-footer">
            <div className="sup-stat-item">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Shortlisting Multiplier: <strong>3.4x Faster on Shine</strong></span>
            </div>
            <div className="sup-stat-item">
              <ShieldCheck size={13} className="text-blue-600" />
              <span>Verified Direct Hiring: <strong>2,850+ Openings</strong></span>
            </div>
          </div>

          {/* Direct Pathway Activation CTA */}
          <button 
            type="button" 
            className="btn-sup-unlock"
            onClick={scrollToTrajectories}
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>Unlock Your ₹18L – ₹24L Roadmap</span>
            <ArrowRight size={13} />
          </button>
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

      {/* 4. Trajectory Cards Stack */}
      <div className="trajectories-cards-stack">
        
        {/* Track 1: Lead UI / Micro-Frontend Architect */}
        {(activeTab === 'all' || activeTab === 'arch') && (
          <div className="trajectory-card card-highlight-purple compact-traj-card">
            
            {/* 1. Compact Header */}
            <div className="traj-compact-header">
              <div className="tch-left">
                <span className="traj-domain-badge domain-purple">ARCHITECTURE TRACK</span>
                <h3 className="traj-title">
                  Senior Frontend Developer <span className="traj-flow-arrow">➔</span> <span className="text-target-role">Lead UI & Micro-Frontend Architect</span>
                </h3>
              </div>
              <div className="tch-right">
                <div className="tch-pkg-pill">
                  <span className="tch-pkg-lbl">Target Potential:</span>
                  <strong className="tch-pkg-val">₹22 - 36 LPA</strong>
                </div>
                <span className="tch-openings-tag">🔥 520+ Active Openings</span>
              </div>
            </div>

            {/* 2. Seamless Unified 3-Segment Pipeline Grid */}
            <div className="traj-pipeline-grid">
              
              {/* Segment 1: Base */}
              <div className="tpg-col tpg-col-base">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-green"><CheckCircle2 size={11} /> 1. YOUR CURRENT BASE</span>
                  <span className="tpg-match-tag">✓ 4 Matched</span>
                </div>
                <div className="tpg-skills-list">
                  <span className="tpg-chip chip-base">React.js</span>
                  <span className="tpg-chip chip-base">JS ES6+</span>
                  <span className="tpg-chip chip-base">Component Arch</span>
                  <span className="tpg-chip chip-base">HTML5/CSS3</span>
                </div>
                <div className="tpg-col-footer">
                  <span className="tpg-footnote">✓ Profile Core Skills</span>
                </div>
              </div>

              {/* Segment 2: Booster Skills to Learn / Add (Candidate Acquisition Focus!) */}
              <div className="tpg-col tpg-col-gap">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-amber"><Zap size={11} /> 2. TARGET BOOSTER SKILLS</span>
                  <span className="tpg-gap-tag">⚡ +₹14L Jump</span>
                </div>
                <div className="tpg-skills-list">
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Micro-Frontend Architecture') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Micro-Frontend Architecture') ? '✓ Micro-Frontends' : '+ Micro-Frontends'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Module Federation (Webpack/Vite)') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Module Federation (Webpack/Vite)') ? '✓ Module Federation' : '+ Module Federation'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Core Web Vitals & Performance') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Core Web Vitals & Performance') ? '✓ Web Vitals' : '+ Web Vitals'}
                  </span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-add-booster"
                    onClick={handleGoToProfileSkills}
                    title="Go to your Profile Key Skills to add or update skills for shortlisting"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    <span>Add Skills in Profile for Shortlisting ➔</span>
                  </button>
                </div>
              </div>

              {/* Segment 3: Mentor Guide (Optional Accelerator) */}
              <div className="tpg-col tpg-col-mentor">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-indigo"><UserCheck size={11} /> 3. 1:1 MENTOR GUIDANCE</span>
                  <span className="tpg-price-tag">₹999 • 45m</span>
                </div>
                <div className="tpg-mentor-card">
                  <div className="tpg-mentor-avatar-wrap">
                    <img src="/avatars/saheli.jpg" alt="Saheli" className="tpg-mentor-img" />
                    <span className="tpg-verified-check" title="Verified Mentor">✓</span>
                  </div>
                  <div className="tpg-mentor-details">
                    <div className="tpg-mentor-name-row">
                      <strong className="tpg-mentor-name">Saheli Kanjilal</strong>
                      <span className="tpg-mentor-rating"><Star size={10} className="fill-amber-400 text-amber-500" /> 4.9 <span className="tpg-rating-count">(178)</span></span>
                    </div>
                    <span className="tpg-mentor-company">Staff Architect @ Razorpay</span>
                    <span className="tpg-mentor-proof">🚀 360+ Guided • Jumped ₹6L ➔ ₹26L</span>
                  </div>
                </div>
                <div className="tpg-mentor-perks-row">
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> System Design Prep</span>
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> Razorpay Referral</span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-mentor-book" 
                    onClick={() => handleBookWithMentor('saheli')}
                  >
                    <Video size={12} />
                    <span>Book 1:1 Session ➔</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3. Streamlined Footer */}
            <div className="traj-compact-footer">
              <div className="tcf-hiring">
                <Building2 size={13} /> <span>Hiring on Shine: <strong>Swiggy, Razorpay, PhonePe, Makemytrip</strong></span>
              </div>
              <button 
                type="button" 
                className="tcf-view-jobs" 
                onClick={() => handleOpenMatchingJobs('arch')}
              >
                View 520+ Matching Jobs <ChevronRight size={13} />
              </button>
            </div>

          </div>
        )}

        {/* Track 2: Lead Product Manager */}
        {(activeTab === 'all' || activeTab === 'pm') && (
          <div className="trajectory-card card-highlight-gold compact-traj-card">
            
            {/* 1. Compact Header */}
            <div className="traj-compact-header">
              <div className="tch-left">
                <span className="traj-domain-badge domain-gold">PRODUCT TRACK</span>
                <h3 className="traj-title">
                  Software Engineer <span className="traj-flow-arrow">➔</span> <span className="text-target-role">Lead Technical Product Manager</span>
                </h3>
              </div>
              <div className="tch-right">
                <div className="tch-pkg-pill">
                  <span className="tch-pkg-lbl">Target Potential:</span>
                  <strong className="tch-pkg-val">₹24 - 38 LPA</strong>
                </div>
                <span className="tch-openings-tag">🔥 430+ Active Openings</span>
              </div>
            </div>

            {/* 2. Seamless Unified 3-Segment Pipeline Grid */}
            <div className="traj-pipeline-grid">
              
              {/* Segment 1: Base */}
              <div className="tpg-col tpg-col-base">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-green"><CheckCircle2 size={11} /> 1. YOUR CURRENT BASE</span>
                  <span className="tpg-match-tag">✓ 3 Matched</span>
                </div>
                <div className="tpg-skills-list">
                  <span className="tpg-chip chip-base">Tech Scoping</span>
                  <span className="tpg-chip chip-base">UI/UX Empathy</span>
                  <span className="tpg-chip chip-base">Agile/Sprints</span>
                </div>
                <div className="tpg-col-footer">
                  <span className="tpg-footnote">✓ Profile Core Skills</span>
                </div>
              </div>

              {/* Segment 2: Booster Skills to Learn / Add (Candidate Acquisition Focus!) */}
              <div className="tpg-col tpg-col-gap">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-amber"><Zap size={11} /> 2. TARGET BOOSTER SKILLS</span>
                  <span className="tpg-gap-tag">⚡ +₹16L Jump</span>
                </div>
                <div className="tpg-skills-list">
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('PRD & Product Discovery') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('PRD & Product Discovery') ? '✓ PRD Discovery' : '+ PRD Discovery'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Growth Metrics & Funnels') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Growth Metrics & Funnels') ? '✓ Product Metrics' : '+ Product Metrics'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Go-To-Market (GTM) Strategy') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Go-To-Market (GTM) Strategy') ? '✓ GTM Strategy' : '+ GTM Strategy'}
                  </span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-add-booster"
                    onClick={handleGoToProfileSkills}
                    title="Go to your Profile Key Skills to add or update skills for shortlisting"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    <span>Add Skills in Profile for Shortlisting ➔</span>
                  </button>
                </div>
              </div>

              {/* Segment 3: Mentor Guide (Optional Accelerator) */}
              <div className="tpg-col tpg-col-mentor">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-indigo"><UserCheck size={11} /> 3. 1:1 MENTOR GUIDANCE</span>
                  <span className="tpg-price-tag">₹999 • 45m</span>
                </div>
                <div className="tpg-mentor-card">
                  <div className="tpg-mentor-avatar-wrap">
                    <img src="/avatars/akash.jpg" alt="Akash" className="tpg-mentor-img" />
                    <span className="tpg-verified-check" title="Verified Mentor">✓</span>
                  </div>
                  <div className="tpg-mentor-details">
                    <div className="tpg-mentor-name-row">
                      <strong className="tpg-mentor-name">Akash Jain</strong>
                      <span className="tpg-mentor-rating"><Star size={10} className="fill-amber-400 text-amber-500" /> 4.9 <span className="tpg-rating-count">(142)</span></span>
                    </div>
                    <span className="tpg-mentor-company">Lead PM @ Shine</span>
                    <span className="tpg-mentor-proof">🚀 310+ Guided • SWE ➔ ₹28L Lead PM</span>
                  </div>
                </div>
                <div className="tpg-mentor-perks-row">
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> PRD Case Rounds</span>
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> Top PM Referrals</span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-mentor-book" 
                    onClick={() => handleBookWithMentor('akash')}
                  >
                    <Video size={12} />
                    <span>Book 1:1 Session ➔</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3. Streamlined Footer */}
            <div className="traj-compact-footer">
              <div className="tcf-hiring">
                <Building2 size={13} /> <span>Hiring on Shine: <strong>Shine, Zepto, Flipkart, CRED, Amazon</strong></span>
              </div>
              <button 
                type="button" 
                className="tcf-view-jobs" 
                onClick={() => handleOpenMatchingJobs('pm')}
              >
                View 430+ Matching Jobs <ChevronRight size={13} />
              </button>
            </div>

          </div>
        )}

        {/* Clean, Visual & Minimal Text High-Motivation Mentorship Banner */}
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
              Book 1:1 Session <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Track 3: Principal Search & Solr Database Architect */}
        {(activeTab === 'all' || activeTab === 'search') && (
          <div className="trajectory-card card-highlight-blue compact-traj-card">
            
            {/* 1. Compact Header */}
            <div className="traj-compact-header">
              <div className="tch-left">
                <span className="traj-domain-badge domain-blue">CORE INFRASTRUCTURE TRACK</span>
                <h3 className="traj-title">
                  Backend Developer <span className="traj-flow-arrow">➔</span> <span className="text-target-role">Principal Search & Solr Architect</span>
                </h3>
              </div>
              <div className="tch-right">
                <div className="tch-pkg-pill">
                  <span className="tch-pkg-lbl">Target Potential:</span>
                  <strong className="tch-pkg-val">₹32 - 48 LPA</strong>
                </div>
                <span className="tch-openings-tag">🔥 290+ High-Paying Openings</span>
              </div>
            </div>

            {/* 2. Seamless Unified 3-Segment Pipeline Grid */}
            <div className="traj-pipeline-grid">
              
              {/* Segment 1: Base */}
              <div className="tpg-col tpg-col-base">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-green"><CheckCircle2 size={11} /> 1. YOUR CURRENT BASE</span>
                  <span className="tpg-match-tag">✓ 3 Matched</span>
                </div>
                <div className="tpg-skills-list">
                  <span className="tpg-chip chip-base">Node/Python</span>
                  <span className="tpg-chip chip-base">REST APIs</span>
                  <span className="tpg-chip chip-base">SQL Schema</span>
                </div>
                <div className="tpg-col-footer">
                  <span className="tpg-footnote">✓ Profile Core Skills</span>
                </div>
              </div>

              {/* Segment 2: Booster Skills to Learn / Add (Candidate Acquisition Focus!) */}
              <div className="tpg-col tpg-col-gap">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-amber"><Zap size={11} /> 2. TARGET BOOSTER SKILLS</span>
                  <span className="tpg-gap-tag">⚡ +₹18L Jump</span>
                </div>
                <div className="tpg-skills-list">
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Apache Solr & Lucene Engine') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Apache Solr & Lucene Engine') ? '✓ Apache Solr' : '+ Apache Solr'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Inverted Indexing & Sharding') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Inverted Indexing & Sharding') ? '✓ Index Sharding' : '+ Index Sharding'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Sub-10ms Query Optimization') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Sub-10ms Query Optimization') ? '✓ Latency Tuning' : '+ Latency Tuning'}
                  </span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-add-booster"
                    onClick={handleGoToProfileSkills}
                    title="Go to your Profile Key Skills to add or update skills for shortlisting"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    <span>Add Skills in Profile for Shortlisting ➔</span>
                  </button>
                </div>
              </div>

              {/* Segment 3: Mentor Guide (Optional Accelerator) */}
              <div className="tpg-col tpg-col-mentor">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-indigo"><UserCheck size={11} /> 3. 1:1 MENTOR GUIDANCE</span>
                  <span className="tpg-price-tag">₹1,199 • 45m</span>
                </div>
                <div className="tpg-mentor-card">
                  <div className="tpg-mentor-avatar-wrap">
                    <img src="/avatars/anirudh.jpg" alt="Anirudh" className="tpg-mentor-img" />
                    <span className="tpg-verified-check" title="Verified Mentor">✓</span>
                  </div>
                  <div className="tpg-mentor-details">
                    <div className="tpg-mentor-name-row">
                      <strong className="tpg-mentor-name">Anirudh Sharma</strong>
                      <span className="tpg-mentor-rating"><Star size={10} className="fill-amber-400 text-amber-500" /> 4.9 <span className="tpg-rating-count">(165)</span></span>
                    </div>
                    <span className="tpg-mentor-company">Principal Search Architect @ Shine</span>
                    <span className="tpg-mentor-proof">🚀 390+ Guided • Jumped ₹7L ➔ ₹38L</span>
                  </div>
                </div>
                <div className="tpg-mentor-perks-row">
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> Solr / DB Scaling</span>
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> Mock Interview</span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-mentor-book" 
                    onClick={() => handleBookWithMentor('anirudh')}
                  >
                    <Video size={12} />
                    <span>Book 1:1 Session ➔</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3. Streamlined Footer */}
            <div className="traj-compact-footer">
              <div className="tcf-hiring">
                <Building2 size={13} /> <span>Hiring on Shine: <strong>Shine, Adobe, Walmart, Microsoft, Uber</strong></span>
              </div>
              <button 
                type="button" 
                className="tcf-view-jobs" 
                onClick={() => handleOpenMatchingJobs('search')}
              >
                View 290+ Matching Jobs <ChevronRight size={13} />
              </button>
            </div>

          </div>
        )}

        {/* Track 4: Production GenAI / LLM Engineer */}
        {(activeTab === 'all' || activeTab === 'ai') && (
          <div className="trajectory-card card-highlight-teal compact-traj-card">
            
            {/* 1. Compact Header */}
            <div className="traj-compact-header">
              <div className="tch-left">
                <span className="traj-domain-badge domain-teal">GENERATIVE AI TRACK</span>
                <h3 className="traj-title">
                  Fullstack Developer <span className="traj-flow-arrow">➔</span> <span className="text-target-role">Production GenAI & LLM Engineer</span>
                </h3>
              </div>
              <div className="tch-right">
                <div className="tch-pkg-pill">
                  <span className="tch-pkg-lbl">Target Potential:</span>
                  <strong className="tch-pkg-val">₹28 - 45 LPA</strong>
                </div>
                <span className="tch-openings-tag">🔥 610+ Active Openings</span>
              </div>
            </div>

            {/* 2. Seamless Unified 3-Segment Pipeline Grid */}
            <div className="traj-pipeline-grid">
              
              {/* Segment 1: Base */}
              <div className="tpg-col tpg-col-base">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-green"><CheckCircle2 size={11} /> 1. YOUR CURRENT BASE</span>
                  <span className="tpg-match-tag">✓ 3 Matched</span>
                </div>
                <div className="tpg-skills-list">
                  <span className="tpg-chip chip-base">Fullstack App</span>
                  <span className="tpg-chip chip-base">WebSockets/APIs</span>
                  <span className="tpg-chip chip-base">DB Modeling</span>
                </div>
                <div className="tpg-col-footer">
                  <span className="tpg-footnote">✓ Profile Core Skills</span>
                </div>
              </div>

              {/* Segment 2: Booster Skills to Learn / Add (Candidate Acquisition Focus!) */}
              <div className="tpg-col tpg-col-gap">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-amber"><Zap size={11} /> 2. TARGET BOOSTER SKILLS</span>
                  <span className="tpg-gap-tag">⚡ +₹16L Jump</span>
                </div>
                <div className="tpg-skills-list">
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('LangChain / LLM Orchestration') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('LangChain / LLM Orchestration') ? '✓ LangChain/LLMs' : '+ LangChain/LLMs'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('Vector Embeddings (Pinecone)') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('Vector Embeddings (Pinecone)') ? '✓ Vector Pinecone' : '+ Vector Pinecone'}
                  </span>
                  <span className={`tpg-chip chip-booster ${isSkillOnProfile('RAG Pipeline Evaluation') ? 'in-profile' : ''}`}>
                    {isSkillOnProfile('RAG Pipeline Evaluation') ? '✓ RAG Evaluation' : '+ RAG Evaluation'}
                  </span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-add-booster"
                    onClick={handleGoToProfileSkills}
                    title="Go to your Profile Key Skills to add or update skills for shortlisting"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    <span>Add Skills in Profile for Shortlisting ➔</span>
                  </button>
                </div>
              </div>

              {/* Segment 3: Mentor Guide (Optional Accelerator) */}
              <div className="tpg-col tpg-col-mentor">
                <div className="tpg-col-header">
                  <span className="tpg-step-pill pill-indigo"><UserCheck size={11} /> 3. 1:1 MENTOR GUIDANCE</span>
                  <span className="tpg-price-tag">₹899 • 45m</span>
                </div>
                <div className="tpg-mentor-card">
                  <div className="tpg-mentor-avatar-wrap">
                    <img src="/avatars/ishita.jpg" alt="Ishita" className="tpg-mentor-img" />
                    <span className="tpg-verified-check" title="Verified Mentor">✓</span>
                  </div>
                  <div className="tpg-mentor-details">
                    <div className="tpg-mentor-name-row">
                      <strong className="tpg-mentor-name">Ishita Sharma</strong>
                      <span className="tpg-mentor-rating"><Star size={10} className="fill-amber-400 text-amber-500" /> 4.8 <span className="tpg-rating-count">(96)</span></span>
                    </div>
                    <span className="tpg-mentor-company">GenAI Lead @ Swiggy</span>
                    <span className="tpg-mentor-proof">🚀 210+ Guided • ₹35L Package</span>
                  </div>
                </div>
                <div className="tpg-mentor-perks-row">
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> RAG & LLM Pipelines</span>
                  <span className="tpg-perk-tag"><CheckCircle2 size={10} className="text-emerald-600" /> Swiggy Referrals</span>
                </div>
                <div className="tpg-col-footer">
                  <button 
                    type="button" 
                    className="btn-tpg-mentor-book" 
                    onClick={() => handleBookWithMentor('ishita')}
                  >
                    <Video size={12} />
                    <span>Book 1:1 Session ➔</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3. Streamlined Footer */}
            <div className="traj-compact-footer">
              <div className="tcf-hiring">
                <Building2 size={13} /> <span>Hiring on Shine: <strong>Swiggy, OpenAI Partner Co, BrowserStack, Postman</strong></span>
              </div>
              <button 
                type="button" 
                className="tcf-view-jobs" 
                onClick={() => handleOpenMatchingJobs('ai')}
              >
                View 610+ Matching Jobs <ChevronRight size={13} />
              </button>
            </div>

          </div>
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
