import React, { useState } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, Award, Plus, LockOpen, Users
} from 'lucide-react';
import { ViewType, Expert } from '../../types';
import { useApp } from '../../context/AppContext';

interface CareerGuidanceViewProps {
  onNavigate: (view: ViewType) => void;
  onSelectExpert: (expertId: string) => void;
  experts: Expert[];
}

export const CareerGuidanceView: React.FC<CareerGuidanceViewProps> = ({
  onNavigate,
  onSelectExpert,
}) => {
  const { userProfile, setIsCreatorWizardOpen, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'arch' | 'pm' | 'search' | 'ai'>('all');
  const isMentor = currentUser?.role === 'mentor';

  const scrollToTrajectories = () => {
    const el = document.getElementById('trajectoriesSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookWithMentor = (mentorId: string) => {
    onSelectExpert(mentorId);
    onNavigate('expert-profile-view');
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
      
      {/* 1. Hero Trajectory Engine Header */}
      <div className="peerpath-hero-banner">
        <div className="peerpath-hero-content">
          <div className="peerpath-tag-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>SHINE PEERPATH • YOUR FAST-TRACK SALARY MULTIPLIER</span>
          </div>
          
          <h1 className="peerpath-hero-title">
            Unlock ₹22L – ₹38L Senior Roles from Your Current Foundation
          </h1>
          
          <p className="peerpath-hero-desc">
            Your current experience is a solid base. Learn the exact 1–2 booster skills top companies (Swiggy, Razorpay, PhonePe) look for to offer 3x higher packages.
          </p>

          <div className="hero-stats-chips-row">
            <div className="h-stat-chip chip-growth">
              <TrendingUp size={15} className="chip-icon-emerald" />
              <span><strong>Up to +320%</strong> Salary Growth</span>
            </div>
            <div className="h-stat-chip chip-jobs">
              <Briefcase size={15} className="chip-icon-blue" />
              <span><strong>2,850+</strong> Verified Jobs on Shine</span>
            </div>
            <div className="h-stat-chip chip-mentors">
              <UserCheck size={15} className="chip-icon-gold" />
              <span><strong>500+</strong> Mentors from Tier-1 Tech</span>
            </div>
          </div>

          <div className="hero-cta-buttons">
            <button className="btn-hero-primary-gold" onClick={scrollToTrajectories}>
              <TrendingUp size={16} /> Explore Recommended Paths
            </button>
            <button className="btn-hero-glass" onClick={() => onNavigate('experts-view')}>
              <Video size={16} /> Talk to a Mentor
            </button>
          </div>
        </div>

        {/* Right Hero Card: Baseline to Potential Multiplier */}
        <div className="peerpath-hero-graphic">
          <div className="salary-unlock-preview-card">
            <div className="sup-header">
              <span className="sup-badge">LIVE SALARY BENCHMARK</span>
              <span className="sup-role">Senior Frontend Track</span>
            </div>

            <div className="sup-comparison-row">
              <div className="sup-tier current-tier">
                <span className="tier-label">Your Current Base</span>
                <span className="tier-salary">₹5.5 - 8.5 LPA</span>
                <span className="tier-desc">React.js, JavaScript, HTML/CSS</span>
              </div>

              <div className="sup-arrow">➔</div>

              <div className="sup-tier unlocked-tier">
                <span className="tier-label">Unlocked with Peerpath</span>
                <span className="tier-salary text-emerald-400">₹22 - 38 Lakhs / Yr</span>
                <span className="tier-desc">+ Micro-Frontends & System Arch</span>
              </div>
            </div>

            <div className="sup-peer-proof">
              <div className="sup-alumni-avatars">
                <img src="/avatars/akash.jpg" alt="Akash" />
                <img src="/avatars/anirudh.jpg" alt="Anirudh" />
                <img src="/avatars/saheli.jpg" alt="Saheli" />
              </div>
              <p className="sup-proof-text">
                <strong>Akash, Anirudh & Saheli</strong> were on the same stack and transitioned to Tier-1 tech companies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2 & 3. Curated Career Pathways Section Header */}
      <div className="trajectories-section-header" id="trajectoriesSection">
        <div className="section-title-wrap">
          <div className="profile-context-inline">
            <span className="pci-pill">
              <Sparkles size={12} className="sparkle-amber" /> Tailored for {userProfile.name} • Senior Frontend (3.5+ Yrs)
            </span>
            <span className="pci-bench">
              Target CTC: <strong>₹18 – 38 Lakhs</strong>
            </span>
          </div>
          <h2 className="section-main-title">Curated High-Growth Career Pathways</h2>
        </div>

        <div className="track-filter-pills">
          <button className={`t-pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All Paths <span className="t-pill-count">4</span>
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
          <div className="trajectory-card card-highlight-purple">
            <div className="traj-card-top-header">
              <div className="traj-title-group">
                <span className="traj-domain-badge domain-purple">ARCHITECTURE TRACK</span>
                <h3 className="traj-title">
                  Senior Frontend Developer ➔ Lead UI & Micro-Frontend Architect
                </h3>
              </div>
              <div className="traj-market-package">
                <span className="package-label">Market Package</span>
                <strong className="package-val">₹22 - 36 Lakhs / Yr</strong>
                <span className="openings-count">🔥 520+ Active Openings on Shine</span>
              </div>
            </div>

            <div className="traj-grid-3col">
              {/* Box 1: Foundation */}
              <div className="traj-info-box box-foundation">
                <h4 className="box-title text-emerald-700">
                  <CheckCircle2 size={16} /> What You Already Know (Strong Base)
                </h4>
                <p className="box-sub">Skills you have already mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">React.js</span>
                  <span className="skill-chip chip-ready">JavaScript ES6+</span>
                  <span className="skill-chip chip-ready">Component Architecture</span>
                  <span className="skill-chip chip-ready">HTML5 & CSS3</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Just 2 Booster Skills to Learn
                </h4>
                <p className="box-sub">Adding these unlocks ₹22L–36L offers:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ Micro-Frontend Architecture</span>
                  <span className="skill-chip chip-bridge">+ Module Federation (Webpack/Vite)</span>
                  <span className="skill-chip chip-bridge">+ Core Web Vitals & Performance</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Real Proof: Someone Who Did It
                </h4>
                <div className="peer-proof-profile">
                  <div className="peer-avatar-wrap">
                    <img src="/avatars/saheli.jpg" alt="Saheli Kanjilal" className="peer-avatar" />
                    <span className="peer-verified-check" title="Employment & Trajectory Verified">
                      <CheckCircle2 size={12} />
                    </span>
                  </div>
                  <div className="peer-meta">
                    <div className="peer-name-row">
                      <strong>Saheli Kanjilal</strong>
                      <span className="peer-verified-pill">
                        <CheckCircle2 size={10} /> Verified Mentor
                      </span>
                    </div>
                    <span>Staff Frontend Engineer @ Razorpay (Jumped from ₹6L to ₹26L)</span>
                    <p className="peer-quote">
                      "I was previously in a standard frontend role at ₹6 LPA. By mastering Module Federation and Web Vitals, I secured a Staff Engineer role at ₹26 LPA."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="traj-footer-bar">
              <div className="traj-footer-left">
                <span className="recruiter-tag">
                  <Building2 size={14} /> Companies Hiring: <strong>Swiggy, Razorpay, PhonePe, Makemytrip</strong>
                </span>
              </div>
              <div className="traj-actions-group">
                <button className="btn-outline-card" onClick={() => onNavigate('guidance-view')}>
                  View 520+ Jobs
                </button>
                <button className="btn-shine-gold" onClick={() => handleBookWithMentor('saheli')}>
                  <UserCheck size={15} /> 1:1 Guidance from Saheli
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Track 2: Lead Product Manager */}
        {(activeTab === 'all' || activeTab === 'pm') && (
          <div className="trajectory-card card-highlight-gold">
            <div className="traj-card-top-header">
              <div className="traj-title-group">
                <span className="traj-domain-badge domain-gold">PRODUCT TRACK</span>
                <h3 className="traj-title">
                  Software Engineer ➔ Lead Technical Product Manager
                </h3>
              </div>
              <div className="traj-market-package">
                <span className="package-label">Market Package</span>
                <strong className="package-val">₹24 - 38 Lakhs / Yr</strong>
                <span className="openings-count">🔥 430+ Active Openings on Shine</span>
              </div>
            </div>

            <div className="traj-grid-3col">
              {/* Box 1: Foundation */}
              <div className="traj-info-box box-foundation">
                <h4 className="box-title text-emerald-700">
                  <CheckCircle2 size={16} /> What You Already Know (Strong Base)
                </h4>
                <p className="box-sub">Skills you have already mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">Technical Scoping</span>
                  <span className="skill-chip chip-ready">UI/UX Empathy</span>
                  <span className="skill-chip chip-ready">Agile & Sprint Execution</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Just 2 Booster Skills to Learn
                </h4>
                <p className="box-sub">Adding these unlocks ₹24L–38L offers:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ PRD & Product Discovery</span>
                  <span className="skill-chip chip-bridge">+ Growth Metrics & Funnels</span>
                  <span className="skill-chip chip-bridge">+ Go-To-Market (GTM) Strategy</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Real Proof: Someone Who Did It
                </h4>
                <div className="peer-proof-profile">
                  <div className="peer-avatar-wrap">
                    <img src="/avatars/akash.jpg" alt="Akash Jain" className="peer-avatar" />
                    <span className="peer-verified-check" title="Employment & Trajectory Verified">
                      <CheckCircle2 size={12} />
                    </span>
                  </div>
                  <div className="peer-meta">
                    <div className="peer-name-row">
                      <strong>Akash Jain</strong>
                      <span className="peer-verified-pill">
                        <CheckCircle2 size={10} /> Verified Mentor
                      </span>
                    </div>
                    <span>Lead Product Manager @ Shine (Jumped from SWE ₹5.5L to ₹28L)</span>
                    <p className="peer-quote">
                      "Engineers transitioning to Product have a massive technical edge. Bridging product discovery and discovery metrics helped me transition from SWE to Lead PM at ₹28 LPA."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="traj-footer-bar">
              <div className="traj-footer-left">
                <span className="recruiter-tag">
                  <Building2 size={14} /> Companies Hiring: <strong>Shine, Zepto, Flipkart, CRED, Amazon</strong>
                </span>
              </div>
              <div className="traj-actions-group">
                <button className="btn-outline-card" onClick={() => onNavigate('guidance-view')}>
                  View 430+ Jobs
                </button>
                <button className="btn-shine-gold" onClick={() => handleBookWithMentor('akash')}>
                  <UserCheck size={15} /> 1:1 Guidance from Akash
                </button>
              </div>
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
          <div className="trajectory-card card-highlight-blue">
            <div className="traj-card-top-header">
              <div className="traj-title-group">
                <span className="traj-domain-badge domain-blue">CORE INFRASTRUCTURE TRACK</span>
                <h3 className="traj-title">
                  Backend Developer ➔ Principal Search & Solr Database Architect
                </h3>
              </div>
              <div className="traj-market-package">
                <span className="package-label">Market Package</span>
                <strong className="package-val">₹32 - 48 Lakhs / Yr</strong>
                <span className="openings-count">🔥 290+ High-Paying Openings</span>
              </div>
            </div>

            <div className="traj-grid-3col">
              {/* Box 1: Foundation */}
              <div className="traj-info-box box-foundation">
                <h4 className="box-title text-emerald-700">
                  <CheckCircle2 size={16} /> What You Already Know (Strong Base)
                </h4>
                <p className="box-sub">Skills you have already mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">Node.js / Python Backend</span>
                  <span className="skill-chip chip-ready">RESTful API Design</span>
                  <span className="skill-chip chip-ready">Database SQL Schema</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Just 2 Booster Skills to Learn
                </h4>
                <p className="box-sub">Adding these unlocks ₹32L–48L offers:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ Apache Solr & Lucene Engine</span>
                  <span className="skill-chip chip-bridge">+ Inverted Indexing & Sharding</span>
                  <span className="skill-chip chip-bridge">+ Sub-10ms Query Optimization</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Real Proof: Someone Who Did It
                </h4>
                <div className="peer-proof-profile">
                  <div className="peer-avatar-wrap">
                    <img src="/avatars/anirudh.jpg" alt="Anirudh Sharma" className="peer-avatar" />
                    <span className="peer-verified-check" title="Employment & Trajectory Verified">
                      <CheckCircle2 size={12} />
                    </span>
                  </div>
                  <div className="peer-meta">
                    <div className="peer-name-row">
                      <strong>Anirudh Sharma</strong>
                      <span className="peer-verified-pill">
                        <CheckCircle2 size={10} /> Verified Mentor
                      </span>
                    </div>
                    <span>Principal Search Architect @ Shine (Jumped from ₹7L to ₹38L)</span>
                    <p className="peer-quote">
                      "Distributed search talent is extremely rare in India. Mastering Solr & Lucene clustering propelled my trajectory to Principal Search Architect at ₹38 LPA."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="traj-footer-bar">
              <div className="traj-footer-left">
                <span className="recruiter-tag">
                  <Building2 size={14} /> Companies Hiring: <strong>Shine, Adobe, Walmart, Microsoft, Uber</strong>
                </span>
              </div>
              <div className="traj-actions-group">
                <button className="btn-outline-card" onClick={() => onNavigate('guidance-view')}>
                  View 290+ Jobs
                </button>
                <button className="btn-shine-gold" onClick={() => handleBookWithMentor('anirudh')}>
                  <UserCheck size={15} /> 1:1 Guidance from Anirudh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Track 4: Production GenAI / LLM Engineer */}
        {(activeTab === 'all' || activeTab === 'ai') && (
          <div className="trajectory-card card-highlight-teal">
            <div className="traj-card-top-header">
              <div className="traj-title-group">
                <span className="traj-domain-badge domain-teal">GENERATIVE AI TRACK</span>
                <h3 className="traj-title">
                  Fullstack Developer ➔ Production GenAI & LLM Application Engineer
                </h3>
              </div>
              <div className="traj-market-package">
                <span className="package-label">Market Package</span>
                <strong className="package-val">₹28 - 45 Lakhs / Yr</strong>
                <span className="openings-count">🔥 610+ Active Openings on Shine</span>
              </div>
            </div>

            <div className="traj-grid-3col">
              {/* Box 1: Foundation */}
              <div className="traj-info-box box-foundation">
                <h4 className="box-title text-emerald-700">
                  <CheckCircle2 size={16} /> What You Already Know (Strong Base)
                </h4>
                <p className="box-sub">Skills you have already mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">Fullstack App Architecture</span>
                  <span className="skill-chip chip-ready">API Integration & WebSockets</span>
                  <span className="skill-chip chip-ready">Database Modeling</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Just 2 Booster Skills to Learn
                </h4>
                <p className="box-sub">Adding these unlocks ₹28L–45L offers:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ LangChain / LLM Orchestration</span>
                  <span className="skill-chip chip-bridge">+ Vector Embeddings (Pinecone)</span>
                  <span className="skill-chip chip-bridge">+ RAG Pipeline Evaluation</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Real Proof: Someone Who Did It
                </h4>
                <div className="peer-proof-profile">
                  <div className="peer-avatar-wrap">
                    <img src="/avatars/ishita.jpg" alt="Ishita Sharma" className="peer-avatar" />
                    <span className="peer-verified-check" title="Employment & Trajectory Verified">
                      <CheckCircle2 size={12} />
                    </span>
                  </div>
                  <div className="peer-meta">
                    <div className="peer-name-row">
                      <strong>Ishita Sharma</strong>
                      <span className="peer-verified-pill">
                        <CheckCircle2 size={10} /> Verified Mentor
                      </span>
                    </div>
                    <span>GenAI & Data Science Lead @ Swiggy (Jumped to ₹35L)</span>
                    <p className="peer-quote">
                      "Fullstack engineers who adopt LLM orchestration and Vector embeddings are commanding the highest salary multipliers in tech today."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="traj-footer-bar">
              <div className="traj-footer-left">
                <span className="recruiter-tag">
                  <Building2 size={14} /> Companies Hiring: <strong>Swiggy, OpenAI Partner Co, BrowserStack, Postman</strong>
                </span>
              </div>
              <div className="traj-actions-group">
                <button className="btn-outline-card" onClick={() => onNavigate('guidance-view')}>
                  View 610+ Jobs
                </button>
                <button className="btn-shine-gold" onClick={() => handleBookWithMentor('ishita')}>
                  <UserCheck size={15} /> 1:1 Guidance from Ishita
                </button>
              </div>
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

    </div>
  );
};
