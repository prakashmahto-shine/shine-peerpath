import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, MapPin, Star, Clock, Users, Calendar, 
  Film, Play, Pause, Zap, Award, Briefcase, 
  Video, UserPlus, UserCheck, FileText, Sparkles, TrendingUp, X, 
  ShieldCheck, ArrowRight, ThumbsUp, GraduationCap, Compass, 
  Check, Lock, RefreshCw
} from 'lucide-react';
import { Expert, ViewType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExpertProfileViewProps {
  expert: Expert;
  onNavigate: (view: ViewType) => void;
  onOpenBooking: (expertId: string) => void;
}

export const ExpertProfileView: React.FC<ExpertProfileViewProps> = ({
  expert,
  onNavigate,
  onOpenBooking,
}) => {
  const { 
    currentUser, 
    navigateToCreatorStudio, 
    isFollowingMentor, 
    toggleFollowMentor, 
    bookingDraft, 
    setBookingDraft 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'trajectory' | 'reviews'>('sessions');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(35);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        setIsVideoModalOpen(false);
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  if (!expert) {
    return (
      <div className="content-wrapper expert-profile-layout" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="cv-scan-circle-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '3px solid #EDE9FE', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748B', fontSize: '15px', fontWeight: 600 }}>Loading Mentor Profile...</p>
        </div>
      </div>
    );
  }

  const isSelf = Boolean(
    currentUser && (
      expert.id === currentUser.id ||
      (currentUser.username && expert.id?.toLowerCase() === currentUser.username.toLowerCase()) ||
      (currentUser.name && expert.name?.toLowerCase() === currentUser.name.toLowerCase())
    )
  );

  const isFollowing = isFollowingMentor(expert.id);
  const baseFollowers = expert.followersCount || ((expert.reviewsCount || 10) * 12 + 420);
  const displayFollowersCount = isFollowing ? baseFollowers + 1 : baseFollowers;

  const handleOpenTeaserModal = () => {
    setIsVideoModalOpen(true);
    setIsPlaying(true);
  };

  const handleCloseTeaserModal = () => {
    setIsVideoModalOpen(false);
    setIsPlaying(false);
  };

  const skillsList = Array.isArray(expert.skills) ? expert.skills : [];
  const mentorFirstName = (expert.name || 'Mentor').split(' ')[0];
  const basePrice = expert.price || 999;

  const cleanExperience = (exp?: string) => {
    if (!exp) return '8+ Yrs';
    const match = exp.match(/\d+(\.\d+)?\+?/);
    return match ? `${match[0]} Yrs` : exp;
  };

  const mentorServices = [
    {
      id: 'career-guidance',
      title: 'Career Guidance & Strategy',
      tag: 'Most Popular',
      tagColor: '#7C3AED',
      tagBg: '#F5F3FF',
      icon: Compass,
      iconColor: '#7C3AED',
      iconBg: '#F3E8FF',
      shortDesc: 'Personalized 1:1 strategy to map your 90-day transition roadmap, bridge skill gaps, and target senior product roles.',
      outcomes: [
        { icon: '🗺️', title: '90-Day Roadmap', desc: 'Custom milestone plan & skill gap analysis' },
        { icon: '🎯', title: 'Referral Strategy', desc: 'Tier-1 company shortlist & internal hiring criteria' },
        { icon: '💡', title: 'Live Deep-Dive', desc: 'Screen-share code, architecture & career pitch' }
      ],
      duration: '30 Mins',
      price: basePrice,
      slotInfo: 'Next slot: Today, 7:30 PM'
    },
    {
      id: 'interview-prep',
      title: '1:1 Mock Interview & Scorecard',
      tag: 'High Impact',
      tagColor: '#059669',
      tagBg: '#ECFDF5',
      icon: Video,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      shortDesc: 'Simulate actual Tier-1 technical or system design interview rounds with instant rubric evaluation.',
      outcomes: [
        { icon: '🧪', title: 'Real Simulation', desc: 'Live Tier-1 coding / architecture problem round' },
        { icon: '📊', title: 'Instant Scorecard', desc: 'Problem-solving, system design & communication metrics' },
        { icon: '⚡', title: 'Actionable Critique', desc: 'Exact trade-offs & areas to improve before actual round' }
      ],
      duration: '30 Mins',
      price: basePrice,
      slotInfo: 'Next slot: Tomorrow, 6:00 PM'
    },
    {
      id: 'resume-review',
      title: 'CV Audit & ATS Teardown',
      tag: 'Quick Win',
      tagColor: '#D97706',
      tagBg: '#FEF3C7',
      icon: FileText,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      shortDesc: 'Line-by-line ATS resume breakdown and rewrite to convert generic bullets into high-impact recruiter magnets.',
      outcomes: [
        { icon: '🔍', title: 'ATS Screener Audit', desc: 'Keyword alignment & format optimization for Tier-1 screeners' },
        { icon: '✍️', title: 'Impact Rewrites', desc: 'Metric-driven bullet points using the XYZ framework' },
        { icon: '🛡️', title: 'Candidate Badge', desc: 'Verified status eligibility for Shine Job Board recruiter priority' }
      ],
      duration: '30 Mins',
      price: Math.max(499, Math.round((basePrice * 0.7) / 50) * 50 - 1),
      slotInfo: 'Next slot: Today, 9:00 PM'
    },
    {
      id: 'salary-negotiation',
      title: 'Salary & Offer Negotiation',
      tag: 'High ROI',
      tagColor: '#2563EB',
      tagBg: '#EFF6FF',
      icon: TrendingUp,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      shortDesc: 'Accurate compensation benchmarking and counter-offer strategy to maximize fixed pay, ESOPs, and joining bonuses.',
      outcomes: [
        { icon: '💰', title: 'Market Benchmark', desc: 'Real Tier-1 CTC and level benchmarking for your experience' },
        { icon: '📝', title: 'Negotiation Scripts', desc: 'Word-for-word counter-offer emails and recruiter talking points' },
        { icon: '📈', title: 'Comp Breakdown', desc: 'Vesting schedules, strike prices, and bonus structure review' }
      ],
      duration: '30 Mins',
      price: Math.max(699, Math.round((basePrice * 0.85) / 50) * 50 - 1),
      slotInfo: 'Next slot: Tomorrow, 8:00 PM'
    }
  ];

  const handleBookSpecificSession = (s: typeof mentorServices[0]) => {
    if (setBookingDraft) {
      setBookingDraft({
        ...bookingDraft,
        expert,
        sessionType: s.title,
        amount: s.price,
        duration: s.duration
      });
    }
    onOpenBooking(expert.id);
  };

  return (
    <div className="content-wrapper unified-profile-container">
      
      {/* 🌟 2-Column Unified Layout */}
      <div className="up-layout-grid">
        
        {/* ====================================================================
            LEFT COLUMN: Sticky Mentor Identity & Social Proof Card (35%)
           ==================================================================== */}
        <aside className="up-mentor-sidebar">
          <div className="up-mentor-card">
            
            {/* Avatar with Status */}
            <div className="up-avatar-center-wrap">
              <div className="up-avatar-ring">
                <img 
                  src={expert.avatar || '/avatars/akash.jpg'} 
                  alt={expert.name} 
                  className="up-avatar-img" 
                />
                <span className="up-status-dot" title="Available for 1:1 sessions"></span>
              </div>
            </div>

            {/* Mentor Name & Headline */}
            <div className="up-mentor-info">
              <div className="up-name-badge-row">
                <h1 className="up-mentor-name">{expert.name}</h1>
                <span className="up-verified-icon-pill" title="Verified Practitioner">
                  <CheckCircle2 size={15} />
                </span>
              </div>

              <div className="up-company-role">
                <strong>{expert.role}</strong>
                <span className="up-company-dot">•</span>
                <span className="up-company-tag">{expert.company}</span>
              </div>

              <span className="up-top-mentor-pill">
                <Sparkles size={11} className="text-amber-500" />
                <span>Top 1% Mentor on PeerPath</span>
              </span>

              {isSelf && <span className="up-self-tag">Your Public Profile</span>}
            </div>

            {/* Social Proof Stats (Clean 2-Row Sleek Metrics) */}
            <div className="up-stats-clean-box">
              <div className="up-scb-row">
                <div className="up-scb-cell">
                  <Star size={14} className="star-gold-fill" />
                  <span className="up-scb-val">{expert.rating || 4.96}</span>
                  <span className="up-scb-sub">rating</span>
                </div>
                <div className="up-scb-cell">
                  <Users size={14} className="text-blue-500" />
                  <span className="up-scb-val">{displayFollowersCount >= 1000 ? `${(displayFollowersCount / 1000).toFixed(1)}k` : displayFollowersCount}</span>
                  <span className="up-scb-sub">followers</span>
                </div>
              </div>

              <div className="up-scb-row">
                <div className="up-scb-cell">
                  <Award size={14} className="text-emerald-600" />
                  <span className="up-scb-val">{expert.sessionsCount || 340}+</span>
                  <span className="up-scb-sub">sessions</span>
                </div>
                <div className="up-scb-cell">
                  <Briefcase size={14} className="text-indigo-500" />
                  <span className="up-scb-val">{cleanExperience(expert.experience)}</span>
                  <span className="up-scb-sub">Exp</span>
                </div>
              </div>
            </div>

            {/* Secondary Actions (Follow & Video Teaser) */}
            <div className="up-mentor-actions">
              {isSelf ? (
                <button 
                  type="button" 
                  className="btn-up-studio"
                  onClick={() => navigateToCreatorStudio('teaser')}
                >
                  <Award size={14} />
                  <span>Manage Studio</span>
                </button>
              ) : (
                <button 
                  type="button" 
                  className={`btn-up-follow ${isFollowing ? 'following' : ''}`}
                  onClick={() => toggleFollowMentor(expert.id, expert.name)}
                >
                  {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                  <span>{isFollowing ? 'Following' : 'Follow Mentor'}</span>
                </button>
              )}

              <button 
                type="button" 
                className="btn-up-teaser"
                onClick={handleOpenTeaserModal}
                title={`Watch ${expert.name}'s Video Introduction`}
              >
                <Play size={12} fill="currentColor" />
                <span>Watch Mentor Intro</span>
              </button>
            </div>

            {/* Mentor Bio & Value Proposition */}
            <div className="up-mentor-about-snippet">
              <p className="up-snippet-text">
                {expert.bio || `Senior engineering leader at ${expert.company} with 8+ years architecting distributed systems and GenAI platforms. Helping engineers master system design and transition into Tier-1 tech.`}
              </p>
            </div>

            {/* Fast Facts / Metadata */}
            <div className="up-mentor-facts-grid">
              <div className="up-fact-item">
                <MapPin size={13} className="text-slate-500" />
                <span><strong>Location:</strong> {expert.location || 'Bengaluru, India'}</span>
              </div>
              <div className="up-fact-item">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span><strong>Verification:</strong> {expert.company} Work Email</span>
              </div>
              <div className="up-fact-item">
                <Video size={13} className="text-indigo-500" />
                <span><strong>Format:</strong> 1:1 HD Video + Screen Share</span>
              </div>
            </div>

            {/* Core Skills Chips */}
            <div className="up-skills-wrap">
              <span className="up-skills-title">Core Expertise</span>
              <div className="up-skills-chips">
                {skillsList.map((skill) => (
                  <span key={skill} className="up-skill-chip">{skill}</span>
                ))}
              </div>
            </div>

            {/* Impact Banner */}
            <div className="up-mentor-impact-card">
              <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
              <span>98% of candidates rated their 1:1 strategy roadmap 5-stars.</span>
            </div>

          </div>
        </aside>

        {/* ====================================================================
            RIGHT COLUMN: Main Content & Services Area (65%)
           ==================================================================== */}
        <main className="up-main-content">
          
          {/* Tabs Bar (3 Clean Focused Tabs) */}
          <div className="up-tabs-bar">
            <button 
              className={`up-tab-pill ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => setActiveTab('sessions')}
            >
              <Compass size={15} />
              <span>Book 1:1 Session</span>
              <span className="up-tab-count">{mentorServices.length}</span>
            </button>

            <button 
              className={`up-tab-pill ${activeTab === 'trajectory' ? 'active' : ''}`}
              onClick={() => setActiveTab('trajectory')}
            >
              <TrendingUp size={15} />
              <span>Career Trajectory & Background</span>
            </button>

            <button 
              className={`up-tab-pill ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <Star size={15} />
              <span>Verified Reviews</span>
              <span className="up-tab-count">{expert.reviewsCount || 162}</span>
            </button>
          </div>

          {/* TAB 1: 1:1 Mentorship Sessions (Modernized, Direct & Clean) */}
          {activeTab === 'sessions' && (
            <div className="up-services-view">
              
              <div className="up-services-list-stack">
                {mentorServices.map((service) => {
                  const IconComp = service.icon;
                  return (
                    <div key={service.id} className="up-service-card-modern">
                      
                      {/* Top Header: Title, Category, Price & CTA */}
                      <div className="up-scm-header">
                        <div className="up-scm-title-wrap">
                          <div className="up-scm-icon" style={{ background: service.iconBg, color: service.iconColor }}>
                            <IconComp size={20} />
                          </div>
                          <div className="up-scm-titles">
                            <div className="up-scm-name-row">
                              <h3 className="up-scm-name">{service.title}</h3>
                              <span className="up-scm-badge" style={{ background: service.tagBg, color: service.tagColor }}>
                                {service.tag}
                              </span>
                            </div>
                            <p className="up-scm-tagline">{service.shortDesc}</p>
                          </div>
                        </div>

                        {/* Price & Book CTA */}
                        <div className="up-scm-cta-box">
                          <div className="up-scm-price">
                            <span className="up-scm-curr">₹</span>
                            <span className="up-scm-amount">{service.price}</span>
                            <span className="up-scm-unit">/ session</span>
                          </div>

                          {isSelf ? (
                            <button 
                              type="button" 
                              className="btn-scm-book"
                              onClick={() => navigateToCreatorStudio('pricing')}
                            >
                              <span>Manage</span>
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="btn-scm-book"
                              onClick={() => handleBookSpecificSession(service)}
                            >
                              <span>Book Slot</span>
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Direct Key Highlights (3 Clean Visual Outcome Chips) */}
                      <div className="up-scm-highlights-grid">
                        {service.outcomes.map((item, idx) => (
                          <div key={idx} className="up-scm-highlight-pill">
                            <span className="up-scm-hl-icon">{item.icon}</span>
                            <div className="up-scm-hl-text">
                              <strong className="up-scm-hl-bold">{item.title}:</strong> {item.desc}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Meta Row (Live Slot & Guarantees) */}
                      <div className="up-scm-footer">
                        <div className="up-scm-meta-left">
                          <span className="up-scm-meta-tag">
                            <Clock size={12} className="text-slate-500" />
                            <span>{service.duration} 1:1 Video</span>
                          </span>
                          <span className="up-scm-meta-tag slot-available">
                            <span className="pulse-green-dot"></span>
                            <span>{service.slotInfo}</span>
                          </span>
                        </div>
                        <div className="up-scm-meta-right">
                          <span className="up-scm-instant-badge">
                            <RefreshCw size={11} className="text-emerald-600" />
                            <span>Free Reschedule Anytime</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: Career Trajectory, Transition Pathway & About Details */}
          {activeTab === 'trajectory' && (
            <div className="up-trajectory-view" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* 1. Proven Transition Pathway Timeline */}
              <div className="up-white-card">
                <div className="up-pane-header">
                  <div>
                    <h3 className="up-card-title">Proven Transition Pathway</h3>
                    <p className="up-card-body-muted">How {mentorFirstName} navigated from foundational tech into {expert.role || 'Senior Leader'} at {expert.company}.</p>
                  </div>
                  <span className="up-path-tag">
                    <TrendingUp size={12} />
                    <span>Milestone Data</span>
                  </span>
                </div>

                <div className="ep-roadmap-timeline">
                  {/* Milestone 3: Target Role */}
                  <div className="ep-rm-item ep-rm-present">
                    <div className="ep-rm-indicator">
                      <div className="ep-rm-dot current"><Sparkles size={13} /></div>
                      <div className="ep-rm-line"></div>
                    </div>
                    <div className="ep-rm-card">
                      <div className="ep-rm-card-header">
                        <div>
                          <div className="ep-rm-badge-row">
                            <span className="ep-rm-status-badge present">🎯 Present Target Role</span>
                            <span className="ep-rm-period">2022 — Present</span>
                          </div>
                          <h4 className="ep-rm-role">{expert.role}</h4>
                          <span className="ep-rm-company">{expert.company} • Tier-1 Product Tech</span>
                        </div>
                      </div>
                      <p className="ep-rm-story">
                        {expert.trajectory?.jumpStory || 'Transitioned from SQL dashboards to building multi-modal LLM search algorithms and dispatch heuristics serving 2M orders daily.'}
                      </p>
                    </div>
                  </div>

                  {/* Milestone 2: Breakthrough Bridge */}
                  <div className="ep-rm-item ep-rm-bridge">
                    <div className="ep-rm-indicator">
                      <div className="ep-rm-dot bridge"><Zap size={13} /></div>
                      <div className="ep-rm-line"></div>
                    </div>
                    <div className="ep-rm-card">
                      <div className="ep-rm-card-header">
                        <div>
                          <div className="ep-rm-badge-row">
                            <span className="ep-rm-status-badge bridge">⚡ Breakthrough Bridge</span>
                            <span className="ep-rm-period">2020 — 2022</span>
                          </div>
                          <h4 className="ep-rm-role">{expert.trajectory?.role3YearsAgo || 'Senior Software Engineer'}</h4>
                          <span className="ep-rm-company">{expert.trajectory?.company3YearsAgo || 'Swiggy • Consumer Internet'}</span>
                        </div>
                      </div>
                      <p className="ep-rm-story">
                        Scaled live real-time distributed microservices and event-driven data streaming clusters that unlocked Tier-1 product tech interview ceilings.
                      </p>
                    </div>
                  </div>

                  {/* Milestone 1: Baseline Starting Point */}
                  <div className="ep-rm-item ep-rm-baseline">
                    <div className="ep-rm-indicator">
                      <div className="ep-rm-dot baseline"><MapPin size={13} /></div>
                    </div>
                    <div className="ep-rm-card baseline-card">
                      <div className="ep-rm-card-header">
                        <div>
                          <div className="ep-rm-badge-row">
                            <span className="ep-rm-status-badge baseline">📍 Candidate Starting Point</span>
                            <span className="ep-rm-period">2018 — 2020</span>
                          </div>
                          <h4 className="ep-rm-role">Software Engineer</h4>
                          <span className="ep-rm-company">TCS / IT Services Firm</span>
                        </div>
                      </div>
                      <p className="ep-rm-story">
                        Started in foundational service firm role. Mastered backend architecture, DS-Algo problem solving, and production system design.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Mentorship Mission & Philosophy */}
              <div className="up-white-card">
                <h3 className="up-card-title">About Me & Mentorship Philosophy</h3>
                <p className="up-card-body">
                  {expert.bio || `Senior engineering leader at ${expert.company}. Guiding tech talent on career transition, production system design, and interview prep.`}
                </p>
                <p className="up-card-body-muted">
                  Over the last 8+ years, I have architected high-throughput distributed systems and GenAI architectures serving millions of users. Having transitioned from IT services into Tier-1 product tech myself, I help engineers break through interview ceilings and master real-world production engineering.
                </p>

                <div className="up-quote-callout">
                  <div className="up-quote-mark">“</div>
                  <p className="up-quote-text">
                    My mission is to eliminate generic advice. In my 1:1 sessions, we dissect your actual code, architecture diagrams, and resume metrics so you walk into interviews as the top candidate hiring managers fight for.
                  </p>
                  <span className="up-quote-sig">— {expert.name}, {expert.role} at {expert.company}</span>
                </div>
              </div>

              {/* 3. Core Technical Competencies */}
              <div className="up-white-card">
                <h3 className="up-card-title">Core Technical Competencies</h3>
                <div className="up-comp-grid">
                  <div className="up-comp-box">
                    <span className="up-cb-head">AI / Machine Learning Stack</span>
                    <div className="up-cb-chips">
                      <span>PyTorch</span>
                      <span>LLM Fine-Tuning</span>
                      <span>RAG Architectures</span>
                      <span>Vector Search</span>
                      <span>FastAPI</span>
                    </div>
                  </div>

                  <div className="up-comp-box">
                    <span className="up-cb-head">Distributed Systems & Scale</span>
                    <div className="up-cb-chips">
                      <span>Microservices</span>
                      <span>High-Throughput Caching</span>
                      <span>Latency Optimization</span>
                      <span>Real-Time Processing</span>
                    </div>
                  </div>

                  <div className="up-comp-box">
                    <span className="up-cb-head">Mentoring & Career Coaching</span>
                    <div className="up-cb-chips">
                      <span>Services ➔ Product Transition</span>
                      <span>SDE-2 to Senior/Lead Jump</span>
                      <span>System Design Rounds</span>
                      <span>Executive Pitching</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Verified Credentials */}
              <div className="up-creds-grid">
                <div className="up-cred-item">
                  <GraduationCap size={18} className="text-indigo-600" />
                  <div>
                    <strong>B.Tech / M.Tech in Computer Science</strong>
                    <span>Core Foundations in Algorithms & Distributed Systems</span>
                  </div>
                </div>
                <div className="up-cred-item">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <div>
                    <strong>Verified Shine PeerPath Practitioner</strong>
                    <span>Current Practitioner at {expert.company} • Background Verified</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === 'reviews' && (() => {
            const candidateReviews = [
              {
                id: 'rev-1',
                name: 'Rahul Kapoor',
                initials: 'RK',
                avatarBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                role: 'Senior Software Engineer',
                prevCompany: 'Ex-Wipro • Cleared Tier-1 Product Tech',
                serviceType: '1:1 Mock System Design & Case Assessment',
                rating: 5.0,
                date: '2 weeks ago',
                outcome: 'Cleared Target Senior Role',
                comment: `"${expert.name} pointed out 3 critical flaws in my architecture pitch that were previously costing me interviews. She shared clear structural frameworks instead of vague suggestions. Within 3 weeks of practicing her guidance, I cleared the final rounds!"`,
                helpfulCount: 24,
              },
              {
                id: 'rev-2',
                name: 'Sneha Menon',
                initials: 'SM',
                avatarBg: 'linear-gradient(135deg, #10B981, #047857)',
                role: 'Senior ML Engineer',
                prevCompany: 'Transitioned from IT Services',
                serviceType: '30-Min Fast Track CV & Pitch Overhaul',
                rating: 5.0,
                date: '3 weeks ago',
                outcome: '2 Direct Recruiter Inbounds in 7 Days',
                comment: `"The CV audit was ruthless in the best possible way. ${expert.name} showed me how my resume lacked production metrics and real-world deployment proofs. The verified badge added to my Shine profile helped 2 recruiters reach out directly next week."`,
                helpfulCount: 19,
              },
              {
                id: 'rev-3',
                name: 'Ananya Kulkarni',
                initials: 'AK',
                avatarBg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                role: 'Data Scientist',
                prevCompany: 'Ex-Business Analyst (Non-Tech to AI)',
                serviceType: 'Career Transition Roadmap (30-Day Action Plan)',
                rating: 5.0,
                date: '1 month ago',
                outcome: 'Successfully Transitioned into AI/ML',
                comment: `"Bridging the gap from BI analytics into deep learning seemed overwhelming until this session. ${expert.name} mapped out the exact 3 GitHub repositories to build and what hiring managers look for in live coding. 100% worth every rupee."`,
                helpfulCount: 31,
              }
            ];

            return (
              <div className="up-reviews-view">
                {/* Aggregate Rating Scorecard */}
                <div className="up-reviews-summary-card">
                  <div className="up-rsc-score">
                    <span className="big-num">{expert.rating || 4.96}</span>
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span className="count-txt">Based on {expert.reviewsCount || 162} Verified Sessions</span>
                  </div>

                  <div className="up-rsc-badges">
                    <div className="up-rsc-badge-item">
                      <ShieldCheck size={18} className="text-emerald-500" />
                      <div>
                        <strong>100% Verified Mentees</strong>
                        <p>Only candidates who completed a session can review</p>
                      </div>
                    </div>
                    <div className="up-rsc-badge-item">
                      <Sparkles size={18} className="text-amber-500" />
                      <div>
                        <strong>Top 1% Mentor Rating</strong>
                        <p>Ranked #1 in {expert.domain || 'Tech'} Mentorship</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="up-reviews-stack">
                  {candidateReviews.map((rev) => (
                    <div key={rev.id} className="up-review-card">
                      <div className="up-rc-header">
                        <div className="up-rc-user">
                          <div className="up-rc-avatar" style={{ background: rev.avatarBg }}>
                            {rev.initials}
                          </div>
                          <div>
                            <div className="up-rc-name-row">
                              <strong>{rev.name}</strong>
                              <span className="up-rc-ver-pill"><CheckCircle2 size={11} /> Verified</span>
                            </div>
                            <span className="up-rc-sub">{rev.role} • {rev.prevCompany}</span>
                          </div>
                        </div>

                        <div className="up-rc-rating">
                          <div className="up-rc-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                            ))}
                          </div>
                          <span className="up-rc-date">{rev.date}</span>
                        </div>
                      </div>

                      <p className="up-rc-comment">{rev.comment}</p>

                      <div className="up-rc-footer">
                        <span className="up-rc-outcome">
                          <Sparkles size={11} /> {rev.outcome}
                        </span>
                        <span className="up-rc-helpful">
                          <ThumbsUp size={11} /> {rev.helpfulCount} found helpful
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        </main>

      </div>

      {/* Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div className="video-modal-backdrop" onClick={handleCloseTeaserModal}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <div className="video-modal-title-group">
                <span className="video-badge-pill"><Film size={13} /> Mentor Video Intro</span>
                <span className="video-modal-mentor-name">{expert.name} • {expert.role} at {expert.company}</span>
              </div>
              <button 
                type="button" 
                className="btn-vm-close" 
                onClick={handleCloseTeaserModal}
                aria-label="Close video intro"
              >
                <X size={18} />
              </button>
            </div>

            <div className="video-modal-viewport" onClick={() => setIsPlaying(!isPlaying)}>
              <div className="video-overlay-tint"></div>
              <img 
                src={expert.videoPoster || expert.avatar || '/avatars/akash.jpg'} 
                alt="Video Thumbnail" 
                className="video-poster-img" 
              />
              
              <div className="video-play-center">
                <div className={`play-pulse-circle ${isPlaying ? 'playing' : ''}`} style={{ opacity: isPlaying ? 0.35 : 1 }}>
                  {isPlaying ? <Pause size={32} fill="#0f172a" /> : <Play size={32} fill="#0f172a" style={{ marginLeft: '4px' }} />}
                </div>
              </div>

              <div className="video-bottom-controls">
                <div className="video-caption-text">
                  <h4>{expert.teaserTitle || `Mentor Introduction: How I Grew in ${expert.domain || 'Tech'}`}</h4>
                  <p>Learn how {mentorFirstName} transitioned into top product engineering and fast-tracked career growth.</p>
                </div>
              </div>
            </div>

            <div 
              className="video-custom-seekbar" 
              title="Video progress"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                setVideoProgress(Math.min(100, Math.max(0, Math.round(clickPos * 100))));
              }}
            >
              <div className="seek-fill" style={{ width: `${videoProgress}%` }}></div>
            </div>

            <div className="video-modal-footer">
              <div className="video-modal-time-indicator">
                <span className={`status-dot ${isPlaying ? 'active' : ''}`}></span>
                <span>{isPlaying ? 'Playing Intro' : 'Paused'}</span>
                <span className="dot">•</span>
                <span>{expert.duration || '01:15'}</span>
              </div>
              <div className="video-modal-actions">
                {isSelf ? (
                  <button className="btn-shine-gold" onClick={() => { handleCloseTeaserModal(); navigateToCreatorStudio('teaser'); }}>
                    <Award size={15} /> Edit Video in Studio
                  </button>
                ) : (
                  <button className="btn-shine-gold" onClick={() => { handleCloseTeaserModal(); handleBookSpecificSession(mentorServices[0]); }}>
                    <Calendar size={15} /> Book 1:1 Session with {mentorFirstName} (₹{mentorServices[0].price})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpertProfileView;
