import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Star, Clock, Users, Calendar, 
  PlayCircle, Film, Play, Pause, Zap, Award, Globe, Briefcase, 
  CircleDot, Shield, Video, ChevronLeft, Bell, UserPlus, UserCheck,
  FileText, Sparkles, TrendingUp 
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

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  const handleToggleTeaser = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (next) {
      const playerEl = document.getElementById('teaser-video-player');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    const target = previousView && previousView !== 'expert-profile-view' ? previousView : 'guidance-view';
    onNavigate(target);
  };

  const skillsList = Array.isArray(expert.skills) ? expert.skills : [];
  const mentorFirstName = (expert.name || 'Mentor').split(' ')[0];

  return (
    <div className="content-wrapper expert-profile-layout">
      {/* Context-Aware Back & Breadcrumb Bar */}
      <div className="view-breadcrumb-bar">
        <button 
          type="button"
          className="btn-back-breadcrumb" 
          onClick={handleBack}
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard-view')}>Home</span>
        <span className="breadcrumb-separator">/</span>
        <span 
          className="breadcrumb-link" 
          onClick={() => onNavigate(previousView === 'guidance-view' ? 'guidance-view' : 'experts-view')}
        >
          {previousView === 'guidance-view' ? 'Recommended Pathways' : 'Verified Mentors'}
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{expert.name}</span>
      </div>

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
            <div className="ep-price-tag">
              <span className="price-val">₹{expert.price || 999}</span>
              <span className="price-unit"> / 60 Min Service</span>
            </div>
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
              className={`btn-teaser-action ${isPlaying ? 'is-playing' : ''}`} 
              onClick={handleToggleTeaser}
              title={isPlaying ? 'Pause video teaser' : 'Watch video teaser'}
            >
              <span className="teaser-btn-icon-wrap">
                {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              </span>
              <span className="teaser-btn-text">
                {isPlaying ? 'Pause Teaser Video' : 'Watch Teaser Video'}
              </span>
              <span className="teaser-btn-duration">{expert.duration || '01:15'}</span>
            </button>
          </div>

        </div>

        <div className="teaser-video-player-box" id="teaser-video-player">
          <div className="video-container-frame" onClick={handleToggleTeaser}>
            <div className="video-overlay-tint"></div>
            <img src={expert.videoPoster || expert.avatar || '/avatars/akash.jpg'} alt="Video Thumbnail" className="video-poster-img" />
            
            <div className="video-play-center">
              <div className={`play-pulse-circle ${isPlaying ? 'playing' : ''}`} style={{ opacity: isPlaying ? 0.35 : 1 }}>
                {isPlaying ? <Pause size={30} fill="#0f172a" /> : <Play size={30} fill="#0f172a" style={{ marginLeft: '4px' }} />}
              </div>
            </div>

            <div className="video-top-bar">
              <span className="video-badge-pill"><Film size={14} /> Trajectory Teaser</span>
              <span className="video-duration-pill">{expert.duration || '01:15'}</span>
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
        </div>

        <div className="expert-tabs-bar">
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
                price: basePrice,
                duration: '60 Mins',
                badge: '🔥 Most Popular',
                badgeClass: 'st-badge-hot',
                desc: 'Real technical / case interview simulation with live rubric evaluation, instant feedback, and verified recruiter badge.',
                meta: [
                  { icon: Clock, label: '60 Mins' },
                  { icon: Video, label: '1:1 Live Video' },
                  { icon: Shield, label: 'Official Shine Scorecard' }
                ]
              },
              {
                id: 'resume-audit',
                title: 'Resume & Portfolio Deep-Dive',
                price: Math.max(499, Math.round((basePrice * 0.65) / 50) * 50 - 1),
                duration: '30 Mins',
                badge: '⚡ Quick Audit',
                badgeClass: 'st-badge-amber',
                desc: 'Line-by-line ATS resume audit, project showcase tuning & keyword boost to increase recruiter shortlist rate by 22%.',
                meta: [
                  { icon: Clock, label: '30 Mins' },
                  { icon: FileText, label: 'ATS CV Teardown' },
                  { icon: Sparkles, label: '+22% Search Visibility' }
                ]
              },
              {
                id: 'career-strategy',
                title: '1:1 Career Jump & CTC Strategy',
                price: Math.max(699, Math.round((basePrice * 0.85) / 50) * 50 - 1),
                duration: '45 Mins',
                badge: '🚀 High ROI',
                badgeClass: 'st-badge-blue',
                desc: 'Step-by-step roadmap to switch domains, compare competing offers, and negotiate higher CTC compensation packages.',
                meta: [
                  { icon: Clock, label: '45 Mins' },
                  { icon: TrendingUp, label: 'CTC Benchmarking' },
                  { icon: Video, label: 'Domain Transition' }
                ]
              },
              {
                id: 'referral-prep',
                title: 'Target Referral & Fast-Track',
                price: Math.max(899, Math.round((basePrice * 1.15) / 50) * 50 - 1),
                duration: '45 Mins',
                badge: '⭐ Direct Intro',
                badgeClass: 'st-badge-purple',
                desc: 'Internal referral fitment check for active openings at top product firms, interview loop secrets & direct mentor endorsement.',
                meta: [
                  { icon: Clock, label: '45 Mins' },
                  { icon: Award, label: 'Referral Evaluation' },
                  { icon: Sparkles, label: 'Mentor Endorsement' }
                ]
              }
            ];

            return (
              <div>
                <div className="sessions-tab-header">
                  <div>
                    <h3 className="pane-title">Available Services ({mentorSessions.length})</h3>
                    <p className="pane-subtitle">Book personalized 1:1 mentorship, live mock interviews, CV audit or direct referral evaluation with {expert.name}.</p>
                  </div>
                </div>

                <div className="session-types-grid">
                  {mentorSessions.map((session) => (
                    <div key={session.id} className="st-card">
                      {session.badge && (
                        <span className={`st-badge ${session.badgeClass || ''}`}>{session.badge}</span>
                      )}
                      <div>
                        <div className="st-header">
                          <h4>{session.title}</h4>
                          <span className="st-price">₹{session.price}</span>
                        </div>
                        <p className="st-desc">{session.desc}</p>
                        
                        <div className="st-meta">
                          {session.meta.map((m, idx) => {
                            const IconComp = m.icon;
                            return (
                              <span key={idx}>
                                <IconComp size={13} /> {m.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {isSelf ? (
                        <button className="btn-shine-gold w-100 mt-2" onClick={() => navigateToCreatorStudio('pricing')}>
                          Manage Service Details & Pricing
                        </button>
                      ) : (
                        <button className="btn-shine-gold w-100 mt-2" onClick={() => onOpenBooking(expert.id)}>
                          Book This Service
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeTab === 'about' && (
            <div className="ep-about-grid">
              <div className="ep-about-main-content">
                <h3 className="pane-title">About Me</h3>
                <p className="pane-body-text">{expert.bio || `Leading mentor at ${expert.company}. Guiding tech talent on career transition, architecture, and interview prep.`}</p>

                <h4 className="pane-subtitle mt-4"><CheckCircle2 size={16} className="text-success" /> My Services Help With:</h4>
                <ul className="ep-checklist">
                  <li>Career transition roadmap into {expert.domain || 'Target Role'}</li>
                  <li>Core skills, metrics, and interview strategies</li>
                  <li>Live mock interview with production-grade rubrics</li>
                  <li>Internal referral review for qualified candidates</li>
                </ul>

                <div className="ep-tab-cta-banner">
                  <div className="ep-tab-cta-content">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="cta-slot-badge">⚡ Instant Slot Booking</span>
                      <span className="text-xs text-slate-500 font-medium">100% Verified Practitioner</span>
                    </div>
                    <h4>Ready to fast-track your career transition?</h4>
                    <p>Book a tailored service with {mentorFirstName} like 1:1 Mentorship, CV Audit & Mock Interviews.</p>
                  </div>
                  <div className="ep-tab-cta-actions">
                    <button className="btn-shine-gold" onClick={() => onOpenBooking(expert.id)}>
                      <Calendar size={15} /> Book Service (₹{expert.price || 999})
                    </button>
                    <button className="btn-secondary-link" onClick={() => setActiveTab('sessions')}>
                      View All 4 Services →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trajectory' && (
            <div>
              <h3 className="pane-title">Verified Career Trajectory Roadmap</h3>
              <p className="pane-body-text">See how this mentor achieved 3x salary growth and the specific skills mastered along the way.</p>
              
              <div className="career-trajectory-timeline mt-4">
                <div className="timeline-node active">
                  <div className="node-marker"><CircleDot size={12} /></div>
                  <div className="node-content">
                    <span className="node-year">2022 — Present</span>
                    <h4>{expert.role} — {expert.company}</h4>
                    <p>{expert.trajectory?.jumpStory || 'Leading scalable architecture and engineering solutions with global teams.'}</p>
                  </div>
                </div>
                <div className="timeline-node">
                  <div className="node-marker"><CircleDot size={12} /></div>
                  <div className="node-content">
                    <span className="node-year">2020 — 2022</span>
                    <h4>{expert.trajectory?.role3YearsAgo || 'Senior Engineer'} — {expert.trajectory?.company3YearsAgo || 'Growth Tech Firm'}</h4>
                    <p>Mastered key jump skills: {(expert.trajectory?.keyJumpSkills || skillsList.slice(0, 3)).join(', ')}.</p>
                  </div>
                </div>
                <div className="timeline-node">
                  <div className="node-marker"><CircleDot size={12} /></div>
                  <div className="node-content">
                    <span className="node-year">2018 — 2020 (Candidate's Current State)</span>
                    <h4>Foundation Role ({expert.trajectory?.salary3YearsAgo || '₹6.5 LPA'})</h4>
                    <p>Started in foundational role with same baseline credentials as your current CV.</p>
                  </div>
                </div>
              </div>

              <div className="ep-tab-cta-banner">
                <div className="ep-tab-cta-content">
                  <h4>Want a tailored transition roadmap like this?</h4>
                  <p>Discuss your background with {mentorFirstName} and get an actionable execution plan to transition into high-growth roles.</p>
                </div>
                <div className="ep-tab-cta-actions">
                  <button className="btn-shine-gold" onClick={() => onOpenBooking(expert.id)}>
                    <Calendar size={15} /> Schedule Roadmap Call
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="pane-title">Candidate Reviews</h3>
              <div className="reviews-list-stack">
                <div className="review-item">
                  <div className="review-top-row">
                    <div className="reviewer-meta">
                      <div className="rev-avatar">RK</div>
                      <div>
                        <strong>Rahul Kapoor</strong>
                        <span>Transitioned to Top Product Tech</span>
                      </div>
                    </div>
                    <div className="rev-rating"><Star size={14} className="star-gold" /> 5.0</div>
                  </div>
                  <p className="rev-comment">"{expert.name} pointed out 3 critical flaws in my pitch that were costing me interviews. Within 3 weeks of implementing his advice, I cleared the final round!"</p>
                </div>

                <div className="review-item">
                  <div className="review-top-row">
                    <div className="reviewer-meta">
                      <div className="rev-avatar">SM</div>
                      <div>
                        <strong>Sneha Menon</strong>
                        <span>Senior Engineer</span>
                      </div>
                    </div>
                    <div className="rev-rating"><Star size={14} className="star-gold" /> 5.0</div>
                  </div>
                  <p className="rev-comment">"The mock interview was ruthless in a good way. The best part was the verified badge added to my Shine profile — 2 recruiters contacted me directly next week."</p>
                </div>
              </div>

              <div className="ep-tab-cta-banner">
                <div className="ep-tab-cta-content">
                  <h4>Join 96+ candidates who accelerated their offers</h4>
                  <p>Get evaluated with real production rubrics and receive your official Shine Skill Scorecard.</p>
                </div>
                <div className="ep-tab-cta-actions">
                  <button className="btn-shine-gold" onClick={() => onOpenBooking(expert.id)}>
                    <Calendar size={15} /> Book a Service
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
