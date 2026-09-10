import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Star, Clock, Users, Calendar, 
  PlayCircle, Film, Play, Pause, Zap, Award, Globe, Briefcase, 
  CircleDot, Shield, Video, Bell, UserPlus, UserCheck,
  FileText, Sparkles, TrendingUp, X, ShieldCheck, ArrowRight, ThumbsUp,
  GraduationCap, Target 
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
  const { previousView, currentUser, navigateToCreatorStudio, isFollowingMentor, toggleFollowMentor } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'about' | 'trajectory' | 'reviews'>('sessions');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(35);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'mock' | 'resume' | 'roadmap'>('all');

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

  return (
    <div className="content-wrapper expert-profile-layout">
      <div className="expert-full-profile-card">
        <div className="profile-header-main">
          
          <div className="ep-avatar-container">
            <img src={expert.avatar || '/avatars/akash.jpg'} alt={expert.name} className="ep-avatar-img" />
            <div className="ep-avatar-company-badge">
              <img src={(expert as any).companyLogo || '/logos/swiggy.png'} alt={expert.company} />
            </div>
          </div>

          <div className="ep-main-details">
            <div className="ep-title-row">
              <h2>{expert.name}</h2>
              <span className="ep-verified-tag"><CheckCircle2 size={14} /> Verified Practitioner</span>
              
              {/* Creator Mode / Self Indicator or Follow Button */}
              {isSelf ? (
                <div className="self-mentor-pill">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Your Public Listing</span>
                </div>
              ) : (
                <button 
                  type="button" 
                  className={`btn-follow-mentor ${isFollowing ? 'is-following' : ''}`}
                  onClick={() => toggleFollowMentor(expert.id, expert.name)}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={14} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Follow Updates</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="ep-headline">{expert.role} at {expert.company}</p>
            
            <div className="ep-metrics-bar">
              <span><MapPin size={14} /> {expert.location || 'India'}</span>
              <span><Star size={14} className="star-gold" /> <strong>{expert.rating || 4.9}</strong> ({expert.reviewsCount || 0} Reviews)</span>
              <span><Users size={14} /> <strong>{displayFollowersCount.toLocaleString()}</strong> Followers</span>
              <span><Clock size={14} /> {expert.experience || '6+ Years'}</span>
              <span><Award size={14} /> <strong>{expert.sessionsCount || 0}+</strong> Services Delivered</span>
            </div>

            <div className="ep-skills-chips">
              {skillsList.map((s) => (
                <span key={s} className="card-skill-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="ep-action-box">
            {isSelf ? (
              <button className="btn-shine-gold-lg" onClick={() => navigateToCreatorStudio('teaser')}>
                <Award size={18} /> Manage Your Listing
              </button>
            ) : (
              <button className="btn-shine-gold-lg" onClick={() => onOpenBooking(expert.id)}>
                <Calendar size={18} /> Book a Service
              </button>
            )}
            <button 
              type="button" 
              className="btn-teaser-action" 
              onClick={handleOpenTeaserModal}
              title="Watch video teaser"
            >
              <span className="teaser-btn-icon-wrap">
                <Play size={14} fill="currentColor" />
              </span>
              <span className="teaser-btn-text">
                Watch Teaser Video
              </span>
              <span className="teaser-btn-duration">{expert.duration || '01:15'}</span>
            </button>
          </div>

        </div>

        <div className="ep-tabs-bar expert-tabs-bar">
          <button className={`ep-tab ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>Services</button>
          <button className={`ep-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About Mentor</button>
          <button className={`ep-tab ${activeTab === 'trajectory' ? 'active' : ''}`} onClick={() => setActiveTab('trajectory')}>Trajectory Roadmap</button>
          <button className={`ep-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Candidate Reviews ({expert.reviewsCount || 0})</button>
        </div>

        <div className="expert-tab-content-area">
          <div className="tab-left-col">
          {activeTab === 'sessions' && (() => {
            const basePrice = expert.price || 999;
            const mentorSessions = [
              {
                id: 'mock-interview',
                title: '1:1 Mock Interview & Case Prep',
                icon: Video,
                iconColor: '#7C3AED',
                iconBg: '#F3E8FF',
                isPopular: false,
                price: basePrice,
                duration: '60 Mins',
                desc: 'Real technical & case interview simulation with live rubrics, instant feedback & verified recruiter scorecard.',
                meta: [
                  { icon: Clock, label: '60 Mins' },
                  { icon: Video, label: '1:1 Video' },
                  { icon: ShieldCheck, label: 'Official Scorecard' }
                ]
              },
              {
                id: 'resume-audit',
                title: 'Resume & Portfolio Deep-Dive',
                icon: FileText,
                iconColor: '#059669',
                iconBg: '#ECFDF5',
                isPopular: false,
                badge: '⚡ Quick Audit',
                badgeClass: 'st-badge-audit',
                price: Math.max(499, Math.round((basePrice * 0.65) / 50) * 50 - 1),
                duration: '30 Mins',
                desc: 'Line-by-line ATS resume review, project showcase tuning & keyword boost to maximize recruiter shortlists.',
                meta: [
                  { icon: Clock, label: '30 Mins' },
                  { icon: FileText, label: 'ATS Teardown' },
                  { icon: Sparkles, label: '+22% Shortlists' }
                ]
              },
              {
                id: 'career-strategy',
                title: '1:1 Career Jump & CTC Strategy',
                icon: TrendingUp,
                iconColor: '#D97706',
                iconBg: '#FEF3C7',
                isPopular: false,
                badge: '🚀 High ROI',
                badgeClass: 'st-badge-roi',
                price: Math.max(699, Math.round((basePrice * 0.85) / 50) * 50 - 1),
                duration: '45 Mins',
                desc: 'Strategic roadmap to switch domains, benchmark competing offers & negotiate 30-50% higher compensation.',
                meta: [
                  { icon: Clock, label: '45 Mins' },
                  { icon: TrendingUp, label: 'CTC Benchmark' },
                  { icon: Video, label: 'Domain Jump' }
                ]
              },
              {
                id: 'referral-prep',
                title: 'Target Referral & Fast-Track',
                icon: Sparkles,
                iconColor: '#2563EB',
                iconBg: '#EFF6FF',
                isPopular: false,
                badge: '⭐ Direct Intro',
                badgeClass: 'st-badge-intro',
                price: Math.max(899, Math.round((basePrice * 1.15) / 50) * 50 - 1),
                duration: '45 Mins',
                desc: 'Internal referral fitment check for tier-1 openings, interview loop secrets & direct mentor endorsement.',
                meta: [
                  { icon: Clock, label: '45 Mins' },
                  { icon: Award, label: 'Referral Eval' },
                  { icon: Sparkles, label: 'Endorsement' }
                ]
              }
            ];

            return (
              <div className="sessions-tab-wrapper">
                <div className="sessions-tab-header">
                  <div>
                    <h3 className="pane-title">Available 1:1 Services ({mentorSessions.length})</h3>
                    <p className="pane-subtitle">Book personalized mentorship, live mock interviews, CV audit or referral prep with {expert.name}.</p>
                  </div>
                  <div className="sessions-tab-trust-pill">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Verified Practitioner • Instant Confirmation</span>
                  </div>
                </div>

                <div className="session-types-grid">
                  {mentorSessions.map((session) => {
                    const IconComp = session.icon;
                    return (
                      <div 
                        key={session.id} 
                        className={`st-card ${session.isPopular ? 'st-card-featured' : ''}`}
                        onClick={() => !isSelf && onOpenBooking(expert.id)}
                      >
                        <div className="st-card-top">
                          <div className="st-card-main-header">
                            <div className="st-service-icon" style={{ background: session.iconBg, color: session.iconColor }}>
                              <IconComp size={20} />
                            </div>
                            <div className="st-header-info">
                              <div className="st-header-title-row">
                                <h4 className="st-card-title">{session.title}</h4>
                                {session.badge && (
                                  <span className={`st-badge-pill ${session.badgeClass}`}>
                                    {session.badge}
                                  </span>
                                )}
                              </div>
                              <p className="st-card-desc">{session.desc}</p>
                            </div>
                          </div>

                          <div className="st-chips-row">
                            {session.meta.map((m, idx) => {
                              const MIcon = m.icon;
                              return (
                                <span key={idx} className="st-chip">
                                  <MIcon size={12} /> {m.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="st-card-footer">
                          <div className="st-price-tag-wrap">
                            <div className="st-price-main">
                              <span className="st-currency">₹</span>
                              <span className="st-amount">{session.price}</span>
                            </div>
                            <span className="st-per-session">/ {session.duration} session</span>
                          </div>

                          {isSelf ? (
                            <button 
                              type="button" 
                              className="btn-st-action" 
                              onClick={(e) => { e.stopPropagation(); navigateToCreatorStudio('pricing'); }}
                            >
                              <span>Manage</span>
                              <ArrowRight size={14} />
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="btn-st-action" 
                              onClick={(e) => { e.stopPropagation(); onOpenBooking(expert.id); }}
                            >
                              <span>Book Session</span>
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {activeTab === 'about' && (
            <div className="ep-about-tab">
              {/* 1. Header Bio & Mentorship Mission */}
              <div className="ep-about-bio-card">
                <div className="ep-about-bio-header">
                  <div>
                    <h3 className="pane-title">About Me & Mentorship Mission</h3>
                    <p className="pane-body-text">
                      {expert.bio || `Senior engineering leader at ${expert.company}. Guiding tech talent on career transition, system design, and interview prep.`}
                    </p>
                    <p className="pane-body-subtext">
                      Over the last 7+ years, I have architected real-time dispatch algorithms and high-throughput recommendation systems serving millions of daily active users at Swiggy. Having navigated the transition from IT services into Tier-1 product tech myself, I help engineers master production-grade system design, elevate their technical pitches, and break through interview ceilings.
                    </p>
                  </div>
                </div>

                {/* Mentorship Philosophy Quote Callout */}
                <div className="ep-about-quote-box">
                  <div className="ep-about-quote-mark">“</div>
                  <p className="ep-about-quote-text">
                    My mission is to eliminate generic advice. In my 1:1 sessions, we dissect your actual code, architecture diagrams, and resume metrics so you walk into interviews as the top candidate hiring managers fight for.
                  </p>
                  <span className="ep-about-quote-author">— {expert.name}, {expert.role} at {expert.company}</span>
                </div>
              </div>

              {/* 2. Key Mentor Impact Metrics Grid */}
              <div className="ep-about-stats-grid">
                <div className="ep-stat-card">
                  <div className="ep-stat-icon-wrap stat-purple">
                    <Briefcase size={20} />
                  </div>
                  <div className="ep-stat-content">
                    <span className="ep-stat-number">{expert.experience || '7+ Years'}</span>
                    <span className="ep-stat-title">Industry Experience</span>
                    <p className="ep-stat-desc">Leading distributed ML & AI systems at scale</p>
                  </div>
                </div>

                <div className="ep-stat-card">
                  <div className="ep-stat-icon-wrap stat-amber">
                    <Star size={20} />
                  </div>
                  <div className="ep-stat-content">
                    <span className="ep-stat-number">{expert.sessionsCount || 210}+</span>
                    <span className="ep-stat-title">1:1 Sessions Delivered</span>
                    <p className="ep-stat-desc">{expert.rating || 4.9} ★ rating from 96+ verified mentees</p>
                  </div>
                </div>

                <div className="ep-stat-card">
                  <div className="ep-stat-icon-wrap stat-emerald">
                    <TrendingUp size={20} />
                  </div>
                  <div className="ep-stat-content">
                    <span className="ep-stat-number">84%</span>
                    <span className="ep-stat-title">Transition Success</span>
                    <p className="ep-stat-desc">Mentees placed in Tier-1 tech & unicorns</p>
                  </div>
                </div>

                <div className="ep-stat-card">
                  <div className="ep-stat-icon-wrap stat-blue">
                    <Clock size={20} />
                  </div>
                  <div className="ep-stat-content">
                    <span className="ep-stat-number">&lt; 4 Hours</span>
                    <span className="ep-stat-title">Avg. Response Time</span>
                    <p className="ep-stat-desc">Fast confirmation & prep material sharing</p>
                  </div>
                </div>
              </div>

              {/* 3. Sleek Video Teaser Spotlight */}
              <div 
                className="ep-about-teaser-banner"
                onClick={handleOpenTeaserModal}
                role="button"
                tabIndex={0}
              >
                <div className="ep-atb-left">
                  <div className="ep-atb-badge">
                    <Film size={13} />
                    <span>1-Min Trajectory Teaser</span>
                  </div>
                  <h4 className="ep-atb-title">How I Scaled into Top Product Engineering @ {expert.company}</h4>
                  <p className="ep-atb-desc">
                    Watch {mentorFirstName} share core transition principles, architectural trade-offs, and how she conducts high-impact 1:1 sessions.
                  </p>
                </div>
                <div className="ep-atb-action">
                  <button type="button" className="btn-atb-watch">
                    <Play size={14} fill="currentColor" /> Watch Teaser (01:09)
                  </button>
                </div>
              </div>

              {/* 4. What You Can Expect in My 1:1 Sessions (Interactive 4-Card Grid) */}
              <div className="ep-about-pillars-section">
                <div className="ep-section-heading-row">
                  <h3 className="pane-title">What You Get in My 1:1 Sessions</h3>
                  <span className="ep-section-tag"><ShieldCheck size={14} /> 100% Tailored & Action-Oriented</span>
                </div>

                <div className="ep-pillars-grid">
                  <div className="ep-pillar-card">
                    <div className="ep-pillar-icon-box">
                      <Target size={18} />
                    </div>
                    <h4>Production-Grade Mock Interviews</h4>
                    <p>
                      Rigorous live technical & architecture rounds replicating actual Tier-1 hiring loops at {expert.company} and top tech companies.
                    </p>
                    <span className="ep-pillar-pill">Includes Live Scoring Rubrics</span>
                  </div>

                  <div className="ep-pillar-card">
                    <div className="ep-pillar-icon-box">
                      <FileText size={18} />
                    </div>
                    <h4>ATS Resume & Pitch Teardown</h4>
                    <p>
                      Line-by-line audit transforming passive task bullet points into measurable production metrics that senior recruiters search for.
                    </p>
                    <span className="ep-pillar-pill">ATS Optimized Format</span>
                  </div>

                  <div className="ep-pillar-card">
                    <div className="ep-pillar-icon-box">
                      <Sparkles size={18} />
                    </div>
                    <h4>System Architecture & Trade-Offs</h4>
                    <p>
                      Deep-dive into distributed systems, vector search pipelines, caching strategies, and real-world scalability decisions.
                    </p>
                    <span className="ep-pillar-pill">Architecture Whiteboarding</span>
                  </div>

                  <div className="ep-pillar-card">
                    <div className="ep-pillar-icon-box">
                      <Award size={18} />
                    </div>
                    <h4>Referral Readiness & Verified Badge</h4>
                    <p>
                      Top-performing candidates receive a verified Shine PeerPath endorsement on their profile and direct referral consideration.
                    </p>
                    <span className="ep-pillar-pill">Verified Profile Boost</span>
                  </div>
                </div>
              </div>

              {/* 5. Core Technical Competencies & Specializations */}
              <div className="ep-about-skills-section">
                <h3 className="pane-title">Core Technical Competencies</h3>
                <div className="ep-skill-groups-grid">
                  <div className="ep-skill-group-card">
                    <span className="ep-sg-title">AI / Machine Learning Stack</span>
                    <div className="ep-sg-chips">
                      <span className="ep-skill-chip">PyTorch</span>
                      <span className="ep-skill-chip">LLM Fine-Tuning</span>
                      <span className="ep-skill-chip">RAG Architectures</span>
                      <span className="ep-skill-chip">Vector Search</span>
                      <span className="ep-skill-chip">FastAPI</span>
                    </div>
                  </div>

                  <div className="ep-skill-group-card">
                    <span className="ep-sg-title">Distributed Systems & Scale</span>
                    <div className="ep-sg-chips">
                      <span className="ep-skill-chip">Microservices</span>
                      <span className="ep-skill-chip">High-Throughput Caching</span>
                      <span className="ep-skill-chip">Latency Optimization</span>
                      <span className="ep-skill-chip">Real-Time Event Processing</span>
                    </div>
                  </div>

                  <div className="ep-skill-group-card">
                    <span className="ep-sg-title">Mentoring & Career Coaching</span>
                    <div className="ep-sg-chips">
                      <span className="ep-skill-chip">Services ➔ Product Transition</span>
                      <span className="ep-skill-chip">SDE-2 to Senior/Lead Jump</span>
                      <span className="ep-skill-chip">System Design Rounds</span>
                      <span className="ep-skill-chip">Executive Pitching</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Verified Credentials & Education */}
              <div className="ep-about-credentials-bar">
                <div className="ep-cred-item">
                  <div className="ep-cred-icon">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <strong>B.Tech / M.Tech in Computer Science</strong>
                    <span>Core Foundations in Distributed Algorithms & Data Structures</span>
                  </div>
                </div>

                <div className="ep-cred-item">
                  <div className="ep-cred-icon verified">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Verified Shine PeerPath Practitioner</strong>
                    <span>Current Lead Practitioner at {expert.company} • Background & Employment Verified</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'trajectory' && (
            <div className="ep-trajectory-tab">
              {/* Trajectory Growth Overview Banner */}
              <div className="ep-trajectory-hero-banner">
                <div className="ep-th-left">
                  <div className="ep-th-badge-row">
                    <span className="ep-th-pill"><TrendingUp size={13} /> Verified Transition Pathway</span>
                    <span className="ep-th-pill-sub">Services ➔ Tier-1 Product Tech</span>
                  </div>
                  <h3 className="ep-th-title">Verified Career Trajectory Roadmap</h3>
                  <p className="ep-th-subtitle">
                    Step-by-step career progression from foundational analytics to Senior Lead at {expert.company}.
                  </p>
                </div>
                <div className="ep-th-metrics">
                  <div className="ep-th-metric-box">
                    <span className="metric-label">Starting Stage</span>
                    <strong className="metric-val">Associate IC</strong>
                  </div>
                  <div className="ep-th-metric-arrow">➔</div>
                  <div className="ep-th-metric-box highlight">
                    <span className="metric-label">Current Stage</span>
                    <strong className="metric-val">Senior Staff / Lead</strong>
                  </div>
                </div>
              </div>

              {/* Connected Milestone Pathway */}
              <div className="ep-roadmap-timeline">
                
                {/* Milestone 3: Present Target Role */}
                <div className="ep-rm-item ep-rm-present">
                  <div className="ep-rm-indicator">
                    <div className="ep-rm-dot current">
                      <Sparkles size={15} />
                    </div>
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
                      <div className="ep-rm-comp-badge">
                        <span>Staff / Lead Level</span>
                      </div>
                    </div>
                    <p className="ep-rm-story">
                      {expert.trajectory?.jumpStory || 'Transitioned from SQL dashboards to building multi-modal LLM search algorithms and dispatch heuristics serving 2M orders daily.'}
                    </p>
                    <div className="ep-rm-skills-row">
                      <span className="ep-rm-skills-label">Core Production Stack:</span>
                      {skillsList.slice(0, 4).map((s) => (
                        <span key={s} className="ep-rm-skill-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Milestone 2: Transition Bridge */}
                <div className="ep-rm-item ep-rm-bridge">
                  <div className="ep-rm-indicator">
                    <div className="ep-rm-dot bridge">
                      <Zap size={15} />
                    </div>
                    <div className="ep-rm-line"></div>
                  </div>
                  <div className="ep-rm-card">
                    <div className="ep-rm-card-header">
                      <div>
                        <div className="ep-rm-badge-row">
                          <span className="ep-rm-status-badge bridge">⚡ The Breakthrough Bridge</span>
                          <span className="ep-rm-period">2020 — 2022</span>
                        </div>
                        <h4 className="ep-rm-role">{expert.trajectory?.role3YearsAgo || 'BI & Data Analyst'}</h4>
                        <span className="ep-rm-company">{expert.trajectory?.company3YearsAgo || 'Mu Sigma Services'}</span>
                      </div>
                      <div className="ep-rm-comp-badge bridge">
                        <span>Mid-Level IC</span>
                      </div>
                    </div>
                    <p className="ep-rm-story">
                      Moved beyond ad-hoc analytics to building automated production ML pipelines and vector retrieval algorithms that unlocked tier-1 recruiter inbounds.
                    </p>
                    <div className="ep-rm-skills-row">
                      <span className="ep-rm-skills-label">Key Jump Skills Mastered:</span>
                      {(expert.trajectory?.keyJumpSkills || ['PyTorch Production Pipelines', 'Vector Search (Pinecone)', 'LLM Fine-Tuning']).map((s) => (
                        <span key={s} className="ep-rm-skill-chip highlight"><CheckCircle2 size={11} /> {s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Milestone 1: Baseline Starting Point */}
                <div className="ep-rm-item ep-rm-baseline">
                  <div className="ep-rm-indicator">
                    <div className="ep-rm-dot baseline">
                      <MapPin size={15} />
                    </div>
                  </div>
                  <div className="ep-rm-card baseline-card">
                    <div className="ep-rm-card-header">
                      <div>
                        <div className="ep-rm-badge-row">
                          <span className="ep-rm-status-badge baseline">📍 Candidate Starting Point (You Are Here)</span>
                          <span className="ep-rm-period">2018 — 2020</span>
                        </div>
                        <h4 className="ep-rm-role">Foundational Baseline Role</h4>
                        <span className="ep-rm-company">IT Services / Analytics Firm</span>
                      </div>
                      <div className="ep-rm-comp-badge baseline">
                        <span>Foundational IC</span>
                      </div>
                    </div>
                    <p className="ep-rm-story">
                      Started in foundational role with same baseline credentials as your current CV. Mentorship focuses on bridging the interview gap to reach Milestone 2 & 3.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'reviews' && (() => {
            const candidateReviews = [
              {
                id: 'rev-1',
                category: 'mock',
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
                category: 'resume',
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
                category: 'roadmap',
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
              },
              {
                id: 'rev-4',
                category: 'mock',
                name: 'Vikram Grover',
                initials: 'VG',
                avatarBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
                role: 'AI / RAG Systems Engineer',
                prevCompany: 'Senior Practitioner',
                serviceType: '1:1 Technical & Live Coding Assessment',
                rating: 5.0,
                date: '1 month ago',
                outcome: 'Received Tier-1 Offer Letter',
                comment: `"Incredible depth in LLM evaluation frameworks and real-world vector database scaling. ${expert.name} simulated actual engineering trade-offs her team deals with daily. This is 10x better than any static online course."`,
                helpfulCount: 16,
              }
            ];

            const filteredReviews = reviewFilter === 'all' 
              ? candidateReviews 
              : candidateReviews.filter(r => r.category === reviewFilter);

            return (
              <div className="ep-reviews-tab">
                {/* Aggregate Rating & Verification Summary Card */}
                <div className="ep-reviews-summary-card">
                  <div className="ep-rsc-score-box">
                    <div className="ep-rsc-big-score">
                      <span className="score-num">{expert.rating || 4.9}</span>
                      <div className="score-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                        ))}
                      </div>
                    </div>
                    <span className="score-sub">Based on {expert.reviewsCount || 96} Verified Sessions</span>
                  </div>

                  <div className="ep-rsc-bars-col">
                    <div className="ep-rsc-bar-row">
                      <span className="ep-rsc-bar-label">5 Star</span>
                      <div className="ep-rsc-bar-track">
                        <div className="ep-rsc-bar-fill" style={{ width: '94%' }}></div>
                      </div>
                      <span className="ep-rsc-bar-pct">94%</span>
                    </div>
                    <div className="ep-rsc-bar-row">
                      <span className="ep-rsc-bar-label">4 Star</span>
                      <div className="ep-rsc-bar-track">
                        <div className="ep-rsc-bar-fill" style={{ width: '6%' }}></div>
                      </div>
                      <span className="ep-rsc-bar-pct">6%</span>
                    </div>
                    <div className="ep-rsc-bar-row">
                      <span className="ep-rsc-bar-label">3 Star</span>
                      <div className="ep-rsc-bar-track">
                        <div className="ep-rsc-bar-fill" style={{ width: '0%' }}></div>
                      </div>
                      <span className="ep-rsc-bar-pct">0%</span>
                    </div>
                  </div>

                  <div className="ep-rsc-badges-col">
                    <div className="ep-rsc-badge-item">
                      <div className="ep-rsc-badge-icon verified-icon">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="ep-rsc-badge-text">
                        <strong>100% Verified Candidates</strong>
                        <p>Only learners who completed a session can submit reviews</p>
                      </div>
                    </div>
                    <div className="ep-rsc-badge-item">
                      <div className="ep-rsc-badge-icon sparkle-icon">
                        <Sparkles size={16} />
                      </div>
                      <div className="ep-rsc-badge-text">
                        <strong>Top 1% Mentor Rating</strong>
                        <p>Ranked #1 in {expert.domain || 'AI & Machine Learning'} mentoring</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Chips Bar */}
                <div className="ep-review-filters-bar">
                  <button
                    type="button"
                    className={`btn-rev-filter ${reviewFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('all')}
                  >
                    All Reviews ({candidateReviews.length})
                  </button>
                  <button
                    type="button"
                    className={`btn-rev-filter ${reviewFilter === 'mock' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('mock')}
                  >
                    Mock Interviews ({candidateReviews.filter(r => r.category === 'mock').length})
                  </button>
                  <button
                    type="button"
                    className={`btn-rev-filter ${reviewFilter === 'resume' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('resume')}
                  >
                    CV & Pitch Overhaul ({candidateReviews.filter(r => r.category === 'resume').length})
                  </button>
                  <button
                    type="button"
                    className={`btn-rev-filter ${reviewFilter === 'roadmap' ? 'active' : ''}`}
                    onClick={() => setReviewFilter('roadmap')}
                  >
                    Transition Roadmap ({candidateReviews.filter(r => r.category === 'roadmap').length})
                  </button>
                </div>

                {/* Reviews List Stack */}
                <div className="reviews-list-stack">
                  {filteredReviews.map((rev) => (
                    <div key={rev.id} className="review-item-card">
                      <div className="review-card-header">
                        <div className="reviewer-profile-group">
                          <div className="rev-avatar-circle" style={{ background: rev.avatarBg }}>
                            {rev.initials}
                          </div>
                          <div className="reviewer-meta-text">
                            <div className="reviewer-name-row">
                              <h4 className="reviewer-name">{rev.name}</h4>
                              <span className="rev-verified-pill">
                                <CheckCircle2 size={12} /> Verified Learner
                              </span>
                            </div>
                            <span className="reviewer-subtitle">{rev.role} • {rev.prevCompany}</span>
                          </div>
                        </div>

                        <div className="review-card-rating-group">
                          <div className="rev-rating-pill">
                            <Star size={13} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                            <span>{rev.rating.toFixed(1)}</span>
                          </div>
                          <span className="rev-date-text">{rev.date}</span>
                        </div>
                      </div>

                      <div className="review-service-pill">
                        <Briefcase size={12} />
                        <span>{rev.serviceType}</span>
                      </div>

                      <p className="rev-quote-content">{rev.comment}</p>

                      <div className="rev-outcome-footer">
                        <div className="rev-outcome-pill">
                          <Sparkles size={13} />
                          <span>Outcome: {rev.outcome}</span>
                        </div>
                        <span className="rev-helpful-stat">
                          <ThumbsUp size={12} /> {rev.helpfulCount} learners found this helpful
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div className="video-modal-backdrop" onClick={handleCloseTeaserModal}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <div className="video-modal-title-group">
                <span className="video-badge-pill"><Film size={13} /> Trajectory Teaser</span>
                <span className="video-modal-mentor-name">{expert.name} • {expert.role} at {expert.company}</span>
              </div>
              <button 
                type="button" 
                className="btn-vm-close" 
                onClick={handleCloseTeaserModal}
                aria-label="Close video teaser"
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
                  <h4>{expert.teaserTitle || `Teaser: How I Grew in ${expert.domain || 'Tech'}`}</h4>
                  <p>Learn how {mentorFirstName} transitioned into top product engineering and fast-tracked compensation.</p>
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
                <span>{isPlaying ? 'Playing Teaser' : 'Paused'}</span>
                <span className="dot">•</span>
                <span>{expert.duration || '01:15'}</span>
              </div>
              <div className="video-modal-actions">
                {isSelf ? (
                  <button className="btn-shine-gold" onClick={() => { handleCloseTeaserModal(); navigateToCreatorStudio('teaser'); }}>
                    <Award size={15} /> Edit Video in Studio
                  </button>
                ) : (
                  <button className="btn-shine-gold" onClick={() => { handleCloseTeaserModal(); onOpenBooking(expert.id); }}>
                    <Calendar size={15} /> Book a Service with {mentorFirstName} (₹{expert.price || 999})
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
