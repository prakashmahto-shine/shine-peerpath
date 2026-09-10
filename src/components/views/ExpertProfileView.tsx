import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, MapPin, Star, Clock, Users, Calendar, 
  PlayCircle, Film, Play, Pause, Zap, Award, Globe, Briefcase, 
  CircleDot, Shield, Video, ChevronLeft, Bell, UserPlus, UserCheck 
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
              <div>
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

              <div className="ep-sidebar-highlights">
                <div className="highlight-info-card">
                  <div className="h-card-icon"><Zap size={20} /></div>
                  <div>
                    <strong>Average Response Time</strong>
                    <p>Within 12 Hours</p>
                  </div>
                </div>
                <div className="highlight-info-card">
                  <div className="h-card-icon"><Award size={20} /></div>
                  <div>
                    <strong>Rating & Reviews</strong>
                    <p>{expert.rating || '4.9'} ({expert.reviewsCount || 0} reviews)</p>
                  </div>
                </div>
                <div className="highlight-info-card">
                  <div className="h-card-icon"><Globe size={20} /></div>
                  <div>
                    <strong>Languages</strong>
                    <p>English, Hindi</p>
                  </div>
                </div>
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

          {activeTab === 'sessions' && (
            <div>
              <h3 className="pane-title">Available 1:1 Sessions</h3>
              <div className="session-types-grid">
                <div className="st-card">
                  <div className="st-header">
                    <h4>1:1 Career Transition & Skill Gap</h4>
                    <span className="st-price">₹{expert.price || 999}</span>
                  </div>
                  <p className="st-desc">60 min deep dive into your CV, gap analysis against target role, and actionable 90-day roadmap.</p>
                  <div className="st-meta"><span><Clock size={14} /> 60 Mins</span> <span><Video size={14} /> Video Call</span></div>
                  {isSelf ? (
                    <button className="btn-shine-gold w-100 mt-3" onClick={() => navigateToCreatorStudio('pricing')}>Manage Session Details & Pricing</button>
                  ) : (
                    <button className="btn-shine-gold w-100 mt-3" onClick={() => onOpenBooking(expert.id)}>Book This Session</button>
                  )}
                </div>
                <div className="st-card">
                  <div className="st-header">
                    <h4>Mock Interview & Recruiter Badge Assessment</h4>
                    <span className="st-price">₹{(expert.price || 999) + 500}</span>
                  </div>
                  <p className="st-desc">Real interview simulation using production-grade hiring rubric. Successful completion unlocks your Shine Recruiter Shield Badge.</p>
                  <div className="st-meta"><span><Clock size={14} /> 60 Mins</span> <span><Shield size={14} /> Includes Badge</span></div>
                  {isSelf ? (
                    <button className="btn-shine-gold w-100 mt-3" onClick={() => navigateToCreatorStudio('pricing')}>Manage Session Details & Pricing</button>
                  ) : (
                    <button className="btn-shine-gold w-100 mt-3" onClick={() => onOpenBooking(expert.id)}>Book This Session</button>
                  )}
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
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
