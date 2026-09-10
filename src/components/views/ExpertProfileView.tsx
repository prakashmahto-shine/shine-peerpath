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

  const [activeTab, setActiveTab] = useState<'about' | 'trajectory' | 'sessions' | 'reviews'>('about');
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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
          
          <div className="profile-avatar-wrap">
            <img src={expert.avatar || '/avatars/akash.jpg'} alt={expert.name} className="ep-avatar-img" />
            <div className="ep-verified-shield" title="Employment Verified">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <div className="profile-meta-info">
            <div className="name-badge-row">
              <div className="name-follow-group">
                <h1 className="ep-name">{expert.name}</h1>
                <span className="ep-cohort-badge">⭐ Cohort 1 Founding Host</span>
                {!isSelf && (
                  <button 
                    type="button" 
                    className={`btn-ep-follow ${isFollowing ? 'ep-following' : ''}`}
                    onClick={() => toggleFollowMentor(expert.id, expert.name)}
                    title={isFollowing ? 'You will receive priority slot notifications' : 'Follow to get instant WhatsApp slot alerts'}
                  >
                    {isFollowing ? (
                      <>
                        <Bell size={13} className="bell-active" />
                        <span>Following ({displayFollowersCount})</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} />
                        <span>+ Follow ({displayFollowersCount})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <span className="ep-verified-tag"><CheckCircle2 size={13} /> Work Email Verified</span>
            </div>
            <p className="ep-headline">{expert.role} at {expert.company}</p>
            
            <div className="ep-metrics-bar">
              <span><MapPin size={14} /> {expert.location || 'India'}</span>
              <span><Star size={14} className="star-gold" /> <strong>{expert.rating || 4.9}</strong> ({expert.reviewsCount || 0} Reviews)</span>
              <span><Users size={14} /> <strong>{displayFollowersCount.toLocaleString()}</strong> Followers</span>
              <span><Clock size={14} /> {expert.experience || '6+ Years'}</span>
              <span><Award size={14} /> <strong>{expert.sessionsCount || 0}+</strong> Sessions Conducted</span>
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
              <span className="price-unit"> / 60 Min Session</span>
            </div>
            {isSelf ? (
              <button className="btn-shine-gold-lg" onClick={() => navigateToCreatorStudio('teaser')}>
                <Award size={18} /> Manage Your Listing
              </button>
            ) : (
              <button className="btn-shine-gold-lg" onClick={() => onOpenBooking(expert.id)}>
                <Calendar size={18} /> Book a Session
              </button>
            )}
            <button className="btn-white-outline" onClick={togglePlay}>
              <PlayCircle size={18} /> Watch Teaser Video
            </button>
          </div>

        </div>

        <div className="teaser-video-player-box">
          <div className="video-container-frame" onClick={togglePlay}>
            <div className="video-overlay-tint"></div>
            <img src={expert.videoPoster || expert.avatar || '/avatars/akash.jpg'} alt="Video Thumbnail" className="video-poster-img" />
            
            <div className="video-play-center">
              <div className="play-pulse-circle" style={{ opacity: isPlaying ? 0.3 : 1 }}>
                {isPlaying ? <Pause size={32} fill="#0f172a" /> : <Play size={32} fill="#0f172a" />}
              </div>
            </div>

            <div className="video-top-bar">
              <span className="video-badge-pill"><Film size={14} /> Trajectory Teaser</span>
              <span className="video-duration-pill">{expert.duration || '01:15'}</span>
            </div><div className="video-bottom-controls">
              <div className="video-caption-text">
                <h4>{expert.teaserTitle || `Teaser: How I Grew in ${expert.domain || 'Tech'}`}</h4>
                <p>Learn how {mentorFirstName} transitioned into top product engineering and fast-tracked compensation.</p>
              </div>
            </div>
          </div>
          
          <div className="video-custom-seekbar">
            <div className="seek-fill" style={{ width: `${videoProgress}%` }}></div>
          </div>
        </div>

        <div className="expert-tabs-bar">
          <button className={`ep-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About Mentor</button>
          <button className={`ep-tab ${activeTab === 'trajectory' ? 'active' : ''}`} onClick={() => setActiveTab('trajectory')}>Trajectory Roadmap</button>
          <button className={`ep-tab ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>1:1 Sessions</button>
          <button className={`ep-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Candidate Reviews ({expert.reviewsCount || 0})</button>
        </div>

        <div className="expert-tab-content-area">
          <div className="tab-left-col">
          {activeTab === 'about' && (
            <div className="ep-about-grid">
              <div className="ep-about-main-content">
                <h3 className="pane-title">About Me</h3>
                <p className="pane-body-text">{expert.bio || `Leading mentor at ${expert.company}. Guiding tech talent on career transition, architecture, and interview prep.`}</p>

                <h4 className="pane-subtitle mt-4"><CheckCircle2 size={16} className="text-success" /> My Sessions Help With:</h4>
                <ul className="ep-checklist">
                  <li>Career transition roadmap into {expert.domain || 'Target Role'}</li>
                  <li>Core skills, metrics, and interview strategies</li>
                  <li>Live mock interview with production-grade rubrics</li>
                  <li>Internal referral review for qualified candidates</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'trajectory' && (
            <div>
              <h3 className="pane-title">Verified Career Trajectory Roadmap</h3>
              <p className="pane-body-text">See how this mentor achieved a 3x compensation leap and the specific skills mastered along the way.</p>
              
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
            </div>
          )}

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
                    <h3 className="pane-title">Available 1:1 Sessions ({mentorSessions.length})</h3>
                    <p className="pane-subtitle">Book personalized 1:1 mentorship, live mock interviews, CV audit or direct referral evaluation with {expert.name}.</p>
                  </div>
                </div>

                {/* Free Community Session / Masterclass Teaser */}
                <div className="ep-free-community-session-card">
                  <div className="efc-left">
                    <div className="efc-icon-wrap">
                      <Video size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          🎙️ Free Community Session
                        </span>
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Assess Before 1:1 Booking</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {expert.teaserTitle || `Masterclass: Breaking into ${expert.company} & System Architecture`}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Watch {mentorFirstName}'s free masterclass teaser to assess framework depth and communication style before scheduling a 1:1 session.
                      </p>
                    </div>
                  </div>
                  <div className="efc-right">
                    <button 
                      type="button" 
                      className="btn-efc-watch"
                      onClick={() => setActiveTab('about')}
                    >
                      <Play size={13} fill="currentColor" />
                      <span>Watch Teaser</span>
                    </button>
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
                          Manage Session Details & Pricing
                        </button>
                      ) : (
                        <button className="btn-shine-gold w-100 mt-2" onClick={() => onOpenBooking(expert.id)}>
                          Book This Session
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

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
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
