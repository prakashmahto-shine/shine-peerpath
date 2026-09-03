import React, { useState } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, Award, Plus, LockOpen
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
  const { userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'arch' | 'pm' | 'search' | 'ai'>('all');

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
      
      {/* 1. Hero Trajectory Engine Header */}
      <div className="peerpath-hero-banner">
        <div className="peerpath-hero-content">
          <div className="peerpath-tag-pill">
            <Sparkles size={14} className="sparkle-gold" />
            <span>SHINE PEERPATH • SKILL BRIDGE & SALARY MULTIPLIER</span>
          </div>
          
          <h1 className="peerpath-hero-title">
            Unlock Higher Salary Roles by Bridging Just 1–2 Skills
          </h1>
          
          <p className="peerpath-hero-desc">
            You already have a strong technical foundation! Discover how bridging just 1–2 target skills unlocks senior roles, higher market compensation, and fast-track recruiter shortlists.
          </p>

          <div className="hero-stats-chips-row">
            <div className="h-stat-chip">
              <TrendingUp size={16} className="text-emerald-500" />
              <span><strong>Up to +320%</strong> Salary Growth</span>
            </div>
            <div className="h-stat-chip">
              <Briefcase size={16} className="text-blue-500" />
              <span><strong>2,850+</strong> Active Verified Jobs</span>
            </div>
            <div className="h-stat-chip">
              <UserCheck size={16} className="text-amber-500" />
              <span><strong>500+</strong> Alumni who made this jump</span>
            </div>
          </div>

          <div className="hero-cta-buttons">
            <button className="btn-shine-gold-lg" onClick={scrollToTrajectories}>
              <LockOpen size={18} /> Explore Unlocked Career Paths
            </button>
            <button className="btn-white-outline-lg" onClick={() => onNavigate('experts-view')}>
              <Video size={18} /> Watch Alumni Video Snippets
            </button>
          </div>
        </div>

        {/* Right Hero Card: Baseline to Potential Multiplier */}
        <div className="peerpath-hero-graphic">
          <div className="salary-unlock-preview-card">
            <div className="sup-header">
              <span className="sup-badge">LIVE MARKET BENCHMARK</span>
              <span className="sup-role">Senior Frontend Track</span>
            </div>

            <div className="sup-comparison-row">
              <div className="sup-tier current-tier">
                <span className="tier-label">Current Baseline</span>
                <span className="tier-salary">₹5.5 - 8.5 LPA</span>
                <span className="tier-desc">React.js, JavaScript, HTML/CSS</span>
              </div>

              <div className="sup-arrow">➔</div>

              <div className="sup-tier unlocked-tier">
                <span className="tier-label">Unlocked with Peerpath</span>
                <span className="tier-salary text-emerald-600">₹22 - 38 Lakhs / Yr</span>
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

      {/* 2. Candidate Baseline Summary Strip */}
      <div className="candidate-baseline-strip">
        <div className="cb-col">
          <span className="cb-label"><User size={13} /> Candidate</span>
          <strong className="cb-val">{userProfile.name}</strong>
        </div>
        <div className="cb-divider"></div>
        <div className="cb-col">
          <span className="cb-label"><Briefcase size={13} /> Current Profile</span>
          <strong className="cb-val">Senior Frontend Developer (3.5+ Yrs)</strong>
        </div>
        <div className="cb-divider"></div>
        <div className="cb-col">
          <span className="cb-label"><CheckCircle2 size={13} /> Foundation Skills (Strong)</span>
          <strong className="cb-val text-emerald-600">{userProfile.skills.slice(0, 4).join(', ')}</strong>
        </div>
        <div className="cb-divider"></div>
        <div className="cb-col">
          <span className="cb-label"><Sparkles size={13} /> Eligible Salary Range</span>
          <strong className="cb-val text-indigo-600">₹18 - 38 Lakhs CTC</strong>
        </div>
      </div>

      {/* 3. Filter Navigation */}
      <div className="trajectories-section-header" id="trajectoriesSection">
        <div>
          <h2 className="section-main-title">Unlocked High-Growth Trajectories</h2>
          <p className="section-subtitle">
            4 curated pathways mapped to your current profile. Explore which skills to bridge, live market salary benchmarks, and alumni who successfully made the transition.
          </p>
        </div>

        <div className="track-filter-pills">
          <button className={`t-pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Tracks (4)</button>
          <button className={`t-pill ${activeTab === 'arch' ? 'active' : ''}`} onClick={() => setActiveTab('arch')}>Lead UI Architect</button>
          <button className={`t-pill ${activeTab === 'pm' ? 'active' : ''}`} onClick={() => setActiveTab('pm')}>Product Management</button>
          <button className={`t-pill ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>Search & Solr Infra</button>
          <button className={`t-pill ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>GenAI & ML</button>
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
                  <CheckCircle2 size={16} /> Your Foundation (Strong)
                </h4>
                <p className="box-sub">Skills you already have mastered:</p>
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
                  <Sparkles size={16} /> Target Bridge Skills to Unlock Role
                </h4>
                <p className="box-sub">Adding these makes you eligible:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ Micro-Frontend Architecture</span>
                  <span className="skill-chip chip-bridge">+ Module Federation (Webpack/Vite)</span>
                  <span className="skill-chip chip-bridge">+ Core Web Vitals & Performance</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Who Walked This Path?
                </h4>
                <div className="peer-proof-profile">
                  <img src="/avatars/saheli.jpg" alt="Saheli Kanjilal" className="peer-avatar" />
                  <div className="peer-meta">
                    <strong>Saheli Kanjilal</strong>
                    <span>Staff Frontend Engineer @ FinTech</span>
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
                  <CheckCircle2 size={16} /> Your Foundation (Strong)
                </h4>
                <p className="box-sub">Skills you already have mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">Technical Scoping</span>
                  <span className="skill-chip chip-ready">UI/UX Empathy</span>
                  <span className="skill-chip chip-ready">Agile & Sprint Execution</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Target Bridge Skills to Unlock Role
                </h4>
                <p className="box-sub">Adding these makes you eligible:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ PRD & Product Discovery</span>
                  <span className="skill-chip chip-bridge">+ Growth Metrics & Funnels</span>
                  <span className="skill-chip chip-bridge">+ Go-To-Market (GTM) Strategy</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Who Walked This Path?
                </h4>
                <div className="peer-proof-profile">
                  <img src="/avatars/akash.jpg" alt="Akash Jain" className="peer-avatar" />
                  <div className="peer-meta">
                    <strong>Akash Jain</strong>
                    <span>Lead Product Manager @ Shine</span>
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
                  <CheckCircle2 size={16} /> Your Foundation (Strong)
                </h4>
                <p className="box-sub">Skills you already have mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">Node.js / Python Backend</span>
                  <span className="skill-chip chip-ready">RESTful API Design</span>
                  <span className="skill-chip chip-ready">Database SQL Schema</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Target Bridge Skills to Unlock Role
                </h4>
                <p className="box-sub">Adding these makes you eligible:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ Apache Solr & Lucene Engine</span>
                  <span className="skill-chip chip-bridge">+ Inverted Indexing & Sharding</span>
                  <span className="skill-chip chip-bridge">+ Sub-10ms Query Optimization</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Who Walked This Path?
                </h4>
                <div className="peer-proof-profile">
                  <img src="/avatars/anirudh.jpg" alt="Anirudh Sharma" className="peer-avatar" />
                  <div className="peer-meta">
                    <strong>Anirudh Sharma</strong>
                    <span>Principal Search Architect @ Shine</span>
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
                  <CheckCircle2 size={16} /> Your Foundation (Strong)
                </h4>
                <p className="box-sub">Skills you already have mastered:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-ready">Fullstack App Architecture</span>
                  <span className="skill-chip chip-ready">API Integration & WebSockets</span>
                  <span className="skill-chip chip-ready">Database Modeling</span>
                </div>
              </div>

              {/* Box 2: Skills to Add */}
              <div className="traj-info-box box-bridge">
                <h4 className="box-title text-amber-700">
                  <Sparkles size={16} /> Target Bridge Skills to Unlock Role
                </h4>
                <p className="box-sub">Adding these makes you eligible:</p>
                <div className="chips-flex-wrap">
                  <span className="skill-chip chip-bridge">+ LangChain / LLM Orchestration</span>
                  <span className="skill-chip chip-bridge">+ Vector Embeddings (Pinecone)</span>
                  <span className="skill-chip chip-bridge">+ RAG Pipeline Evaluation</span>
                </div>
              </div>

              {/* Box 3: Peer Role Model Proof */}
              <div className="traj-info-box box-peer-proof">
                <h4 className="box-title text-indigo-700">
                  <UserCheck size={16} /> Who Walked This Path?
                </h4>
                <div className="peer-proof-profile">
                  <img src="/avatars/ishita.jpg" alt="Ishita Sharma" className="peer-avatar" />
                  <div className="peer-meta">
                    <strong>Ishita Sharma</strong>
                    <span>GenAI & Data Science Lead @ Swiggy</span>
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
      <div className="peerpath-bottom-acceleration-card">
        <div className="accel-left">
          <div className="accel-sparkle-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h3>Want 1:1 Guidance on Which Bridge Skill to Pick First?</h3>
            <p>
              Book a 1:1 Strategy session with mentors from Shine, Swiggy, and Razorpay. Review your resume, test your readiness, and get direct recruiter referrals.
            </p>
          </div>
        </div>
        <button className="btn-shine-gold-lg" onClick={() => onNavigate('experts-view')}>
          Explore All Verified Mentors <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
