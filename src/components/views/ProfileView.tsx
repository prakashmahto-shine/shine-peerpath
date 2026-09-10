import React, { useState } from 'react';
import { 
  Download, Sparkles, FileText, ArrowRight, 
  Trash2, Star, Upload, ChevronDown, Check, Edit2, Briefcase, 
  Plus, X, Phone, Mail, Calendar, DollarSign, Clock, CheckCircle2,
  GraduationCap, TrendingUp, Zap, User, Video, RotateCcw,
  ShieldCheck, Award, Film, Play, AlertCircle, Gift, Banknote, Users,
  Share2, ExternalLink, Copy, QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PeerVerifiedBadge } from '../../types';

export const ProfileView: React.FC = () => {
  const { 
    currentUser,
    userProfile, 
    sessions,
    setActiveSession,
    navigate, 
    navigateToCreatorStudio,
    isCreatorMode,
    updateProfileSummary, 
    addSkill, 
    removeSkill, 
    updateJobSearchStatus,
    updateMentorRatesAndAvailability,
    updateMentorTeaserVideo,
    setIsCreatorWizardOpen,
    setIsCvSyncModalOpen,
    removeCandidateResume,
    showToast
  } = useApp();

  const loggedInFirstName = (userProfile.name || currentUser?.name || 'Prakash').split(' ')[0].toLowerCase();
  const isMentor = Boolean(
    userProfile.isMentor || 
    currentUser?.role === 'mentor' || 
    currentUser?.id === 'akash' ||
    (currentUser?.username && currentUser.username.toLowerCase() === 'akash')
  );
  const isNotLooking = (userProfile.jobSearchStatus || '').toLowerCase().includes('not looking');
  
  // 1. Sessions where logged in user is candidate (booked guidance calls with other mentors)
  const candidateUpcomingSessions = isMentor ? [] : sessions.filter(s => 
    s.status === 'upcoming' && 
    s.candidateName.toLowerCase().includes(loggedInFirstName) &&
    !s.expert.name.toLowerCase().includes(loggedInFirstName) &&
    s.expert.id !== currentUser?.id
  );

  // 2. Sessions where logged in user is mentor (candidate bookings hosted by this mentor)
  const mentorHostedSessions = sessions.filter(s => 
    s.status === 'upcoming' && 
    (s.expert.name.toLowerCase().includes(loggedInFirstName) || s.expert.id === currentUser?.id || s.expert.id === 'akash')
  );

  // Modals state
  const [showJobStatusModal, setShowJobStatusModal] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    userProfile.jobSearchStatus || 'Actively Looking For Jobs'
  );
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryInput, setSummaryInput] = useState<string>(userProfile.summary);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [showAddSkillInput, setShowAddSkillInput] = useState<boolean>(false);

  // Unified Mentor Mentorship Settings & Teaser state
  const [showEditMentorshipModal, setShowEditMentorshipModal] = useState<boolean>(false);
  const [rateInput, setRateInput] = useState<number>(userProfile.mentorRate || 999);
  const [durationInput, setDurationInput] = useState<number>(userProfile.mentorDuration || 45);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    userProfile.mentorAvailability?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>(
    userProfile.mentorAvailability?.timeSlots || [
      '10:00 AM - 11:00 AM',
      '02:00 PM - 03:00 PM',
      '06:30 PM - 07:30 PM',
      '08:00 PM - 09:00 PM'
    ]
  );
  const [newSlotInput, setNewSlotInput] = useState<string>('');

  // Mentor Teaser Video state
  const [teaserTitleInput, setTeaserTitleInput] = useState<string>(
    userProfile.mentorTeaserVideo?.title || 'How I Help Candidates Transition to PM & Tech Leadership (₹30L+ Target)'
  );
  const [teaserDurationInput, setTeaserDurationInput] = useState<string>(
    userProfile.mentorTeaserVideo?.duration || '0:58 min'
  );
  const [teaserVideoUrl, setTeaserVideoUrl] = useState<string>(
    userProfile.mentorTeaserVideo?.url || 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4'
  );
  const [hasTeaserVideo, setHasTeaserVideo] = useState<boolean>(
    Boolean(userProfile.mentorTeaserVideo)
  );

  const openMentorshipModal = () => {
    setRateInput(userProfile.mentorRate || 999);
    setDurationInput(userProfile.mentorDuration || 45);
    setSelectedDays(userProfile.mentorAvailability?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    setAvailableSlots(userProfile.mentorAvailability?.timeSlots || [
      '10:00 AM - 11:00 AM',
      '02:00 PM - 03:00 PM',
      '06:30 PM - 07:30 PM',
      '08:00 PM - 09:00 PM'
    ]);
    setTeaserTitleInput(userProfile.mentorTeaserVideo?.title || 'How I Help Candidates Transition to PM & Tech Leadership (₹30L+ Target)');
    setTeaserDurationInput(userProfile.mentorTeaserVideo?.duration || '0:58 min');
    setTeaserVideoUrl(userProfile.mentorTeaserVideo?.url || 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4');
    setHasTeaserVideo(Boolean(userProfile.mentorTeaserVideo));
    setShowEditMentorshipModal(true);
  };

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleRemoveSlot = (slot: string) => {
    setAvailableSlots(availableSlots.filter(s => s !== slot));
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlotInput.trim() && !availableSlots.includes(newSlotInput.trim())) {
      setAvailableSlots([...availableSlots, newSlotInput.trim()]);
      setNewSlotInput('');
    }
  };

  const handleSaveMentorshipSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMentorRatesAndAvailability(rateInput, durationInput, selectedDays, availableSlots);
    if (hasTeaserVideo && teaserVideoUrl) {
      updateMentorTeaserVideo({
        url: teaserVideoUrl,
        title: teaserTitleInput,
        duration: teaserDurationInput,
        thumbnail: currentUser?.avatar || '/avatars/akash.jpg',
        uploadedAt: 'Updated just now'
      });
    } else {
      updateMentorTeaserVideo(null);
    }
    setShowEditMentorshipModal(false);
  };

  const handleAddBadgeToLinkedIn = (badge: PeerVerifiedBadge) => {
    const today = new Date();
    const issueYear = today.getFullYear();
    const issueMonth = today.getMonth() + 1;
    const certName = encodeURIComponent(`Shine Peer-Verified: ${badge.title}`);
    const orgName = encodeURIComponent('Shine.com');
    const certUrl = encodeURIComponent(badge.verificationUrl || `https://shine.com/verify/${badge.credentialId || 'SH-PP-84920'}`);
    const certId = encodeURIComponent(badge.credentialId || 'SH-PP-84920');

    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}&certId=${certId}`;

    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    showToast('🚀 Opening LinkedIn Certification...', 'Credential details pre-filled. Add to your LinkedIn Licenses & Certifications!', 'success');
  };

  const handleCopyBadgeLink = (badge: PeerVerifiedBadge) => {
    const link = badge.verificationUrl || `https://shine.com/verify/${badge.credentialId || 'SH-PP-84920'}`;
    navigator.clipboard?.writeText(link);
    showToast('📋 Credential Link Copied!', 'Attach this link to your Resume, CV, or LinkedIn for instant recruiter verification.', 'success');
  };

  // Blue circular arc calculation
  const strokeDashoffset = 314.15 - (314.15 * (userProfile.profileScore / 100));

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileSummary(summaryInput);
    setShowSummaryModal(false);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      addSkill(newSkillInput.trim());
      setNewSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Actively Looking For Jobs' || status === 'Actively looking for jobs') {
      return (
        <img 
          src="https://www.shine.com/next/static/images/nova/activejobs.svg" 
          alt="Actively Looking" 
          className="js-btn-icon" 
        />
      );
    }
    if (status === 'Casually Exploring Jobs' || status === 'Casually exploring opportunities' || status.toLowerCase().includes('casually exploring')) {
      return (
        <img 
          src="https://www.shine.com/next/static/images/nova/casualjobs.svg" 
          alt="Casually Exploring" 
          className="js-btn-icon" 
        />
      );
    }
    if (status === 'Not Looking For Jobs' || status.toLowerCase().includes('not looking')) {
      return (
        <img 
          src="https://www.shine.com/next/static/images/nova/notactivejobs.svg" 
          alt="Not Looking" 
          className="js-btn-icon" 
        />
      );
    }
    return (
      <img 
        src="https://www.shine.com/next/static/images/nova/activejobs.svg" 
        alt="Status" 
        className="js-btn-icon" 
      />
    );
  };

  return (
    <div className="content-wrapper shine-official-myprofile-page">
      
      {isMentor && (
        <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '14px', padding: '14px 20px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#581C87', display: 'block' }}>Verified Mentor Profile Active</strong>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6B21A8' }}>
                You are viewing candidate resume details. Manage your 60-sec teaser video, availability slots, session rates, and candidate calls in Creator Studio.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-shine-gold-sm"
            onClick={() => navigateToCreatorStudio('bookings')}
            style={{ flexShrink: 0, marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>⚡ Open Creator Studio Hub</span>
          </button>
        </div>
      )}

      <div className="myprofile-layout-2col">
        
        {/* Left Column: Floating Profile Card */}
        <div className="myprofile-left-col">
          <div className="myprofile-card prod-profile-overview-card">
            <span className="updated-today-pill">Updated today</span>

            {/* Blue Circular Arc Meter */}
            <div className="prod-profile-gauge-box">
              <svg className="prod-gauge-circle-svg" viewBox="0 0 120 120">
                <circle 
                  className="gauge-track-bg" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                />
                <circle 
                  className="gauge-blue-fill" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  strokeDasharray="314.15" 
                  strokeDashoffset={strokeDashoffset} 
                />
              </svg>
              
              <div className="prod-avatar-inner-wrap">
                <img 
                  src={currentUser?.avatar || (userProfile.isMentor ? '/avatars/akash.jpg' : '/avatars/prakash.jpg')} 
                  alt={userProfile.name} 
                  className="prod-user-avatar-img"
                />
              </div>

              <div className="prod-gauge-score-badge">{userProfile.profileScore}%</div>
            </div>

            <h2 className="prod-user-fullname">{userProfile.name}</h2>
            <div className="prod-user-designation-wrap">
              <p className="prod-user-designation-sub">{userProfile.headline}</p>
              {userProfile.isMentor && (
                <span className="profile-verified-mentor-tag">
                  <ShieldCheck size={13} /> Verified Mentor
                </span>
              )}
            </div>

            {/* Hook 1: Visual & Easy-to-Understand Salary Growth Card (Hidden if Not Looking For Jobs) */}
            {!isNotLooking && (
              <div className="profile-salary-unlock-cta" onClick={() => navigate('guidance-view')}>
                <div className="psu-header-row">
                  <span className="psu-tag-chip">
                    <TrendingUp size={12} /> SALARY TARGET
                  </span>
                  <span className="psu-growth-badge">{userProfile.isMentor ? 'Executive Leadership' : '3x Growth'}</span>
                </div>

                <div className="psu-salary-compare-row">
                  <div className="psu-col">
                    <span className="psu-col-label">Current</span>
                    <strong className="psu-col-val">{userProfile.currentCtc || '5.5L'}</strong>
                  </div>

                  <div className="psu-arrow-track">
                    <span className="psu-arrow-symbol">➔</span>
                  </div>

                  <div className="psu-col psu-col-target">
                    <span className="psu-col-label">Target</span>
                    <strong className="psu-col-val text-emerald-600">{userProfile.targetCtc || '₹18L - 24L'}</strong>
                  </div>
                </div>

                <p className="psu-simple-desc">
                  {(userProfile.isMentor || currentUser?.isMentorEligible || userProfile.isMentorEligible)
                    ? 'Executive Leadership Network • Mentoring peer talent boosts your recruiter spotlight for ₹50L+ VP & Director roles.'
                    : 'Learn 1–2 trending skills to reach your target salary.'}
                </p>

                <div className="psu-link-button">
                  <span>{(userProfile.isMentor || currentUser?.isMentorEligible || userProfile.isMentorEligible) ? 'Executive Leadership Inbounds' : `How to Get ${userProfile.targetCtc || '₹18L+'}`}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            )}

            <div className="profile-card-dashed-divider"></div>

            {/* Job Search Status Button -> Opens Production Popup Modal */}
            <div className="job-status-dropdown-wrap">
              <button 
                type="button"
                className="btn-prod-job-status"
                onClick={() => {
                  setSelectedStatus(userProfile.jobSearchStatus || 'Actively Looking For Jobs');
                  setShowJobStatusModal(true);
                }}
              >
                <div className="btn-prod-js-left">
                  {getStatusIcon(userProfile.jobSearchStatus || 'Actively Looking For Jobs')}
                  <span>{userProfile.jobSearchStatus || 'Set Your Current Job Search Status'}</span>
                </div>
                <ChevronDown size={15} className="btn-prod-js-arrow" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Exact Production Cards */}
        <div className="myprofile-right-col">
          
          {/* VIP Mentor Invitation Card for Senior Professionals (Campaign Pitch - Nisha only) */}
          {!userProfile.isMentor && (currentUser?.isMentorEligible || userProfile.isMentorEligible) && (
            <div className="profile-mentor-pitch-card">
              <div className="pmpc-top-bar">
                <div className="pmpc-badge">
                  <Sparkles size={12} className="sparkle-anim" /> SPECIAL INVITATION • FOUNDING MENTOR CIRCLE
                </div>
                <div className="pmpc-fee-tag">
                  <Gift size={12} /> 0% PLATFORM COMMISSION (6 MONTHS)
                </div>
              </div>

              <div className="pmpc-body">
                <div className="pmpc-content-left">
                  <h3 className="pmpc-title">
                    {userProfile.name?.split(' ')[0] || 'Nisha'}, monetize your {userProfile.pastCompany || 'tech'} expertise <span className="text-gold-gradient">on your own schedule</span>
                  </h3>
                  
                  <p className="pmpc-market-intel">
                    🔥 <strong>4,850+ Candidates on Shine</strong> are actively seeking 1:1 mentorship in <strong>{userProfile.skills.slice(0, 3).join(', ') || 'React, System Design'}</strong>.
                  </p>

                  <div className="pmpc-perks-grid">
                    <div className="pmpc-perk">
                      <div className="pmpc-icon bg-green"><Banknote size={14} /></div>
                      <div>
                        <strong>Set Your Own Session Rates (₹99 – ₹2,499)</strong>
                        <span>Keep 100% payouts with 0% platform fee for 6 months</span>
                      </div>
                    </div>

                    <div className="pmpc-perk">
                      <div className="pmpc-icon bg-purple"><Award size={14} /></div>
                      <div>
                        <strong>Executive Recruiter Spotlight</strong>
                        <span>Inbounds for ₹50L+ VP / Director roles</span>
                      </div>
                    </div>

                    <div className="pmpc-perk">
                      <div className="pmpc-icon bg-blue"><ShieldCheck size={14} /></div>
                      <div>
                        <strong>Issue Verified Badges</strong>
                        <span>Official hiring evaluator status</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pmpc-cta-right">
                  <div className="pmpc-est-box">
                    <span className="pmpc-est-lbl">Flexible Earning Power</span>
                    <strong className="pmpc-est-amt">Up to ₹2,499<span className="pmpc-est-mo">/session</span></strong>
                    <span className="pmpc-est-sub">Set your own rate (₹99 – ₹2,499)</span>
                  </div>

                  <button 
                    type="button" 
                    className="btn-shine-gold-lg pmpc-cta-btn glow-pulse"
                    onClick={() => setIsCreatorWizardOpen(true)}
                  >
                    <Sparkles size={16} /> Activate Mentor Mode (60s) <ArrowRight size={16} />
                  </button>
                  <span className="pmpc-prefill-note">Pre-filled from your Shine CV</span>
                </div>
              </div>
            </div>
          )}

          {/* Card: Active Mentorship Sessions Widget (Candidate Bookings ONLY - Never on Mentor Profile) */}
          {!isMentor && candidateUpcomingSessions.length > 0 && (
            <div className="myprofile-card prod-sessions-widget-card">
              <div className="prod-card-top-row">
                <div className="ps-widget-title-row">
                  <div className="ps-icon-circle"><Video size={16} /></div>
                  <div>
                    <h3 className="prod-card-title">Active 1:1 Mentorship Sessions ({candidateUpcomingSessions.length})</h3>
                    <span className="ps-sub-hint">Scheduled live guidance calls with verified tech leaders</span>
                  </div>
                </div>
                <button className="btn-text-arrow" onClick={() => navigate('sessions-view')}>
                  View All Sessions <ArrowRight size={14} />
                </button>
              </div>

              <div className="ps-widget-list">
                {candidateUpcomingSessions.slice(0, 2).map((sess) => (
                  <div key={sess.id} className="ps-widget-item">
                    <div className="ps-widget-left">
                      <img src={sess.expert.avatar} alt={sess.expert.name} className="ps-widget-avatar" />
                      <div>
                        <div className="ps-name-tag-row">
                          <strong className="ps-mentor-name">{sess.expert.name}</strong>
                          <span className="ps-live-ready-badge"><span className="pulse-dot"></span> Confirmed & Ready</span>
                        </div>
                        <p className="ps-role-text">{sess.expert.role} • {sess.expert.company}</p>
                        <div className="ps-time-chip">
                          <Clock size={12} /> {sess.date} at {sess.timeSlot}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ps-widget-actions">
                      <button 
                        type="button"
                        className="btn-reschedule-action"
                        onClick={() => navigate('sessions-view')}
                        title="Reschedule or Cancel this session"
                      >
                        <RotateCcw size={13} />
                        <span>Reschedule / Cancel</span>
                      </button>
                      
                      <button 
                        type="button"
                        className="btn-join-call-prominent"
                        onClick={() => {
                          setActiveSession(sess);
                          navigate('live-call-view');
                        }}
                      >
                        <span className="live-cam-pulse-dot"></span>
                        <Video size={14} />
                        <span>Join Video Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 1: Resume */}
          <div className="myprofile-card prod-resume-card">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Resume</h3>
              <button className="btn-prod-upload-resume" onClick={() => setIsCvSyncModalOpen(true)}>
                <Upload size={14} /> Upload Latest CV
              </button>
            </div>

            <div className="prod-resume-item-row">
              <div className="res-details-left">
                <strong className="res-file-name">{userProfile.resumeFileName || 'Prakash_Mahto_Frontend_Resume.pdf'}</strong>
                <div className="res-sub-meta">
                  <span>Uploaded: {userProfile.resumeLastUpdated || 'Almost a year ago'}</span>
                  {(userProfile.resumeLastUpdated || '').includes('Just now') || (userProfile.resumeLastUpdated || '').includes('Synced') ? (
                    <span className="res-default-blue-chip" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}>✨ AI Synced & Updated</span>
                  ) : (
                    <span className="res-default-blue-chip">Default (Outdated)</span>
                  )}
                </div>
              </div>

              <div className="res-actions-right-icons">
                <button className="res-action-circle-btn" title="Download" onClick={() => alert('Downloading resume...')}>
                  <Download size={15} />
                </button>
                <button className="res-action-circle-btn star-gold-btn" title="Set as default">
                  <Star size={15} fill="#EAB308" color="#EAB308" />
                </button>
                <button className="res-action-circle-btn" title="AI Sync / Update" onClick={() => setIsCvSyncModalOpen(true)}>
                  <Sparkles size={15} color="#7C3AED" />
                </button>
                {userProfile.resumeFileName && (
                  <button 
                    className="res-action-circle-btn res-delete-btn" 
                    title="Delete Resume" 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this resume from your Shine profile?')) {
                        removeCandidateResume();
                      }
                    }}
                  >
                    <Trash2 size={15} color="#DC2626" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Hook 2 - Opportunity Banner (Hidden/Paused if Not Looking For Jobs) */}
          {isNotLooking ? (
            <div className="profile-job-suggestions-paused-banner">
              <div className="pjsp-left">
                <img 
                  src="https://www.shine.com/next/static/images/nova/notactivejobs.svg" 
                  alt="Not Looking" 
                  className="pjsp-icon"
                />
                <div>
                  <h4 className="pjsp-title">Opportunity Recommendations are Paused</h4>
                  <p className="pjsp-sub">
                    Your status is set to <strong>Not Looking For Jobs</strong>. Opportunity suggestions and recruiter inquiries are paused.
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-pjsp-action"
                onClick={() => {
                  setSelectedStatus('Casually Exploring Jobs');
                  setShowJobStatusModal(true);
                }}
              >
                Update Status
              </button>
            </div>
          ) : (currentUser?.isMentorEligible || userProfile.isMentorEligible || userProfile.isMentor) ? (
            /* Senior Leaders & Mentors (Nisha & Akash - Executive Visibility) */
            <div className="prod-executive-spotlight-banner" onClick={() => navigate('recruiter-view')}>
              <div className="esb-left">
                <div className="esb-icon-wrap">
                  👑
                </div>
                <div className="esb-text-group">
                  <div className="ats-tag-row">
                    <span className="ats-hot-tag" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
                      👑 EXECUTIVE RECRUITER SPOTLIGHT
                    </span>
                    <span className="ats-salary-tag" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                      {userProfile.targetCtc || '₹50L – ₹65L'} Leadership Target
                    </span>
                  </div>
                  <h3 className="ats-title" style={{ fontSize: '16px', color: '#0F172A', margin: '4px 0' }}>
                    Executive Inbounds Active: Director & VP Level Opportunities
                  </h3>
                  <p className="ats-subtitle" style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                    As a verified tech leader, your profile is spotlighted to Executive Recruiters at top tech companies scouting for Director & Staff Architect inbounds.
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-shine-gold-sm" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigate('recruiter-view'); 
                }}
              >
                View Inbounds ➔
              </button>
            </div>
          ) : (
            /* Standard Candidates (Prakash - Skill Boosters) */
            <div className="prod-ats-score-banner" onClick={() => navigate('guidance-view')}>
              <div className="ats-banner-left">
                <div className="ats-illustration-box">
                  🚀
                </div>
                <div className="ats-text-group">
                  <div className="ats-tag-row">
                    <span className="ats-hot-tag">🎯 1 SKILL AWAY</span>
                    <span className="ats-salary-tag">{userProfile.targetCtc || '₹18L – ₹24L'} Target</span>
                  </div>
                  <h3 className="ats-title">
                    Reach Your {userProfile.targetCtc || '₹18L – ₹24 Lakhs'} Target with 1–2 In-Demand Skills
                  </h3>
                  <p className="ats-subtitle">
                    Your basic skills are strong. Adding skills like Next.js helps you get 4x more interview calls from top companies.
                  </p>
                </div>
              </div>

              <button className="btn-check-resume-score" onClick={() => navigate('guidance-view')}>
                See How to Get {userProfile.targetCtc || '₹18L+'} ➔
              </button>
            </div>
          )}

          {/* Card 3: Work Profile */}
          <div className="myprofile-card prod-work-profile-card">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Work Profile</h3>
              <button className="btn-edit-gold-square" onClick={() => { setSummaryInput(userProfile.summary); setShowSummaryModal(true); }}>
                <Edit2 size={15} />
              </button>
            </div>

            <div className="prod-work-profile-grid">
              <div className="wp-item-row">
                <Briefcase size={16} className="wp-icon" />
                <span>{currentUser?.headline?.split('|')[0] || userProfile.headline || 'Senior frontend developer'}</span>
              </div>

              <div className="wp-item-row">
                <Clock size={16} className="wp-icon" />
                <span>{userProfile.experienceYears || '3 yrs 6 Months'}</span>
              </div>

              <div className="wp-item-row">
                <DollarSign size={16} className="wp-icon" />
                <span>{userProfile.currentCtc || '5.5 LPA'}</span>
              </div>

              <div className="wp-item-row">
                <Phone size={16} className="wp-icon" />
                <span>{userProfile.phone || '+91 7042653680'}</span>
                <CheckCircle2 size={14} className="verified-green-check" />
              </div>

              <div className="wp-item-row">
                <Calendar size={16} className="wp-icon" />
                <span>{userProfile.experienceYears || '3 yrs 6 Months'}</span>
              </div>

              <div className="wp-item-row">
                <Mail size={16} className="wp-icon" />
                <span>{userProfile.email || 'prakashkr806@gmail.com'}</span>
                <CheckCircle2 size={14} className="verified-green-check" />
              </div>
            </div>

            {/* Hook 3: Peer Transition Proof Callout inside Work Profile (Hidden if Not Looking For Jobs) */}
            {!isNotLooking && (
              <div className="work-profile-peerpath-callout" onClick={() => navigate('guidance-view')}>
                <div className="wpc-avatars">
                  <img src="/avatars/saheli.jpg" alt="Saheli" />
                  <img src="/avatars/akash.jpg" alt="Akash" />
                </div>
                <div className="wpc-text">
                  <strong>{userProfile.isMentor ? 'Leaders with your profile transitioned to Director & VP of Product' : `Candidates with your profile jumped from ${userProfile.currentCtc || '₹5.5L'} to ${userProfile.targetCtc || '₹24L'}`}</strong>
                  <span>See what skills they learned and how they got hired.</span>
                </div>
                <button className="btn-wpc-arrow" onClick={() => navigate('guidance-view')}>
                  See How ➔
                </button>
              </div>
            )}
          </div>

          {/* Card 4: Employment History */}
          <div className="myprofile-card prod-employment-card">
            <div className="prod-card-top-row">
              <div></div>
              <span className="boost-green-chip">↑ 15%</span>
            </div>

            <div className="employment-center-content">
              <div className="emp-briefcase-3d-icon">
                💼
              </div>
              <h3 className="emp-main-title">Employment History</h3>
              <p className="emp-caption">Your past roles and organizations details help recruiters understand your expertise.</p>
              <button className="btn-prod-add-gold" onClick={() => alert('Add past organization details')}>
                + Add
              </button>
            </div>
          </div>

          {/* Card 5: Key Skills (Exact List Row Style) */}
          <div className="myprofile-card prod-key-skills-card" id="skills-section">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Key Skills</h3>
              <div className="skills-header-actions-row">
                <button className="btn-prod-upload-resume" onClick={() => setShowAddSkillInput(true)}>
                  Add
                </button>
                <button className="btn-edit-gold-square" onClick={() => setShowAddSkillInput(!showAddSkillInput)}>
                  <Edit2 size={14} />
                </button>
              </div>
            </div>

            {showAddSkillInput && (
              <form className="add-skill-inline-form" onSubmit={handleAddSkillSubmit} style={{ marginBottom: '14px' }}>
                <input 
                  type="text" 
                  placeholder="Enter skill name (e.g. Node.js, React.js, GraphQL)..." 
                  value={newSkillInput} 
                  onChange={(e) => setNewSkillInput(e.target.value)} 
                  autoFocus 
                  className="add-skill-input"
                />
                <button type="submit" className="btn-shine-gold-sm">Add</button>
                <button type="button" className="btn-ghost-sm" onClick={() => setShowAddSkillInput(false)}>Cancel</button>
              </form>
            )}

            <div className="prod-skills-rows-list">
              {userProfile.skills.map((sk, idx) => (
                <div key={idx} className="prod-skill-item-row">
                  <span className="skill-name-text">{sk}</span>
                  <button 
                    type="button" 
                    className="btn-remove-skill-trash" 
                    onClick={() => removeSkill(sk)}
                    title={`Remove ${sk}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5.5: Shine Verified Skill Badges */}
          {userProfile.badges && userProfile.badges.length > 0 && (
            <div className="myprofile-card prod-verified-badges-card" id="verified-badges-section">
              <div className="prod-card-top-row">
                <div className="verified-badges-card-title-wrap">
                  <ShieldCheck size={20} className="verified-gold-shield" />
                  <div>
                    <h3 className="prod-card-title">Shine Verified Skill Badges</h3>
                    <p className="verified-badges-card-sub">Endorsed & evaluated by verified Tech & Product Leaders</p>
                  </div>
                </div>
                <span className="verified-count-chip">{userProfile.badges.length} Verified</span>
              </div>

              <div className="verified-badges-list-grid">
                {userProfile.badges.map((badge) => (
                  <div key={badge.id} className="verified-badge-card-item">
                    <div className="v-badge-top">
                      <div className="v-badge-icon-box">
                        <Award size={22} className="v-badge-award-icon" />
                      </div>
                      <div className="v-badge-content">
                        <div className="v-badge-header-row">
                          <strong className="v-badge-title">{badge.title}</strong>
                          <div className="v-badge-tags-group">
                            {badge.scorePercentile && (
                              <span className="v-badge-percentile-pill">
                                🏆 {badge.scorePercentile}
                              </span>
                            )}
                            <span className="v-badge-status-pill">
                              <CheckCircle2 size={12} /> Verified
                            </span>
                          </div>
                        </div>

                        <div className="v-badge-verifier-row">
                          <img 
                            src={badge.verifierAvatar || '/avatars/akash.jpg'} 
                            alt={badge.verifierName} 
                            className="v-badge-verifier-img" 
                          />
                          <span className="v-badge-verifier-text">
                            Evaluated by <strong>{badge.verifierName}</strong> • {badge.verifierRole} ({badge.verifierCompany || 'Shine Leader'})
                          </span>
                        </div>

                        {badge.rubricSummary && (
                          <p className="v-badge-rubric-desc">
                            "{badge.rubricSummary}"
                          </p>
                        )}

                        <div className="v-badge-skills-chips">
                          {badge.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="v-badge-skill-chip">{skill}</span>
                          ))}
                        </div>

                        <div className="v-badge-footer-meta">
                          <div className="v-badge-id-wrap">
                            <span className="v-badge-date">Issued: {badge.date}</span>
                            <span className="v-badge-cred-id">Credential ID: <strong>{badge.credentialId || 'SH-PP-84920'}</strong></span>
                          </div>
                          <span className="v-badge-shine-stamp">✨ Shine PeerPath Verified</span>
                        </div>

                        {/* 1-Click Action Bar */}
                        <div className="v-badge-action-bar">
                          <button 
                            type="button" 
                            className="btn-v-linkedin"
                            onClick={() => handleAddBadgeToLinkedIn(badge)}
                            title="Add directly to LinkedIn Licenses & Certifications"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.37 9.74v-8.37H5.09v8.37z"/>
                            </svg>
                            <span>Add to LinkedIn</span>
                          </button>

                          <button 
                            type="button" 
                            className="btn-v-copy-link"
                            onClick={() => handleCopyBadgeLink(badge)}
                            title="Copy verifiable link to attach on your Resume, CV, or Portfolio"
                          >
                            <Copy size={13} />
                            <span>Copy Link for Resume / CV</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 6: Stand Out with Assessment Banner */}
          <div className="prod-standout-assessment-banner">
            <div className="standout-left-group">
              <div className="standout-photo-wrap">
                <img 
                  src="https://www.shine.com/next/static/images/nova/skill-assesment-illustration.svg" 
                  alt="Skill Assessment" 
                  className="standout-avatar-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="standout-text-group">
                <h3 className="standout-title">Stand Out with Assessment</h3>
                <p className="standout-subtitle">Show employers what sets you apart.</p>
              </div>
            </div>

            <button className="btn-take-assessment" onClick={() => navigate('guidance-view')}>
              Take Assessment
            </button>
          </div>

          {/* Card 7: Education */}
          <div className="myprofile-card prod-education-card">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Education</h3>
              <button className="btn-prod-upload-resume" onClick={() => alert('Add education details')}>
                Add
              </button>
            </div>

            <div className="prod-education-item-row">
              <div className="edu-left-details">
                <strong className="edu-degree-title">{userProfile.educationDegree || 'B.Tech / B.E - Computer Science & Engineering'}</strong>
                <p className="edu-college-name">{userProfile.educationCollege || 'Jaipur Engineering College And Research Centre (RTU)'}</p>
              </div>
              <button className="btn-edit-gold-square" onClick={() => alert('Edit education details')}>
                <Edit2 size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 1. Official Set Your Job Status Modal Dialog */}
      {showJobStatusModal && (
        <div className="modal-backdrop-blur">
          <div className="job-status-modal-surface">
            <div className="job-status-modal-header">
              <h3 className="js-modal-title">Set Your Job Status</h3>
              <button 
                type="button"
                className="btn-icon-close" 
                onClick={() => setShowJobStatusModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="job-status-modal-body">
              
              {/* Option 1: Actively Looking For Jobs */}
              <div 
                className={`job-status-option-card ${selectedStatus === 'Actively Looking For Jobs' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('Actively Looking For Jobs')}
              >
                <div className="js-opt-left">
                  <div className="js-opt-icon-wrap">
                    <img 
                      src="https://www.shine.com/next/static/images/nova/activejobs.svg" 
                      alt="Actively Looking" 
                    />
                  </div>
                  <div className="js-opt-text">
                    <strong className="js-opt-title">Actively Looking For Jobs</strong>
                    <p className="js-opt-sub">I'm open to being reached out by recruiters</p>
                  </div>
                </div>
                <div className="js-radio-circle">
                  {selectedStatus === 'Actively Looking For Jobs' && <div className="js-radio-inner" />}
                </div>
              </div>

              {/* Option 2: Casually Exploring Jobs */}
              <div 
                className={`job-status-option-card ${selectedStatus === 'Casually Exploring Jobs' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('Casually Exploring Jobs')}
              >
                <div className="js-opt-left">
                  <div className="js-opt-icon-wrap">
                    <img 
                      src="https://www.shine.com/next/static/images/nova/casualjobs.svg" 
                      alt="Casually Exploring" 
                    />
                  </div>
                  <div className="js-opt-text">
                    <strong className="js-opt-title">Casually Exploring Jobs</strong>
                    <p className="js-opt-sub">Apply at your own pace with being approached by recruiters</p>
                  </div>
                </div>
                <div className="js-radio-circle">
                  {selectedStatus === 'Casually Exploring Jobs' && <div className="js-radio-inner" />}
                </div>
              </div>

              {/* Option 3: Not Looking For Jobs */}
              <div 
                className={`job-status-option-card ${selectedStatus === 'Not Looking For Jobs' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('Not Looking For Jobs')}
              >
                <div className="js-opt-left">
                  <div className="js-opt-icon-wrap">
                    <img 
                      src="https://www.shine.com/next/static/images/nova/notactivejobs.svg" 
                      alt="Not Looking" 
                    />
                  </div>
                  <div className="js-opt-text">
                    <strong className="js-opt-title">Not Looking For Jobs</strong>
                    <p className="js-opt-sub">You are not active in the job market at the moment</p>
                  </div>
                </div>
                <div className="js-radio-circle">
                  {selectedStatus === 'Not Looking For Jobs' && <div className="js-radio-inner" />}
                </div>
              </div>

            </div>

            <div className="job-status-modal-footer">
              <button 
                type="button" 
                className="btn-set-job-status-now"
                onClick={() => {
                  updateJobSearchStatus(selectedStatus);
                  setShowJobStatusModal(false);
                }}
              >
                Set Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Summary Edit Modal */}
      {showSummaryModal && (
        <div className="modal-backdrop-blur">
          <div className="modal-surface-card" style={{ maxWidth: '600px' }}>
            <div className="modal-top-header">
              <h3>Edit Profile Summary</h3>
              <button className="btn-icon-close" onClick={() => setShowSummaryModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveSummary}>
              <div className="modal-body-pad">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Highlight your key technical achievements and career aspirations:
                </label>
                <textarea 
                  value={summaryInput} 
                  onChange={(e) => setSummaryInput(e.target.value)} 
                  rows={5}
                  className="custom-textarea"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>
              <div className="modal-footer-flex">
                <button type="button" className="btn-ghost-sm" onClick={() => setShowSummaryModal(false)}>Cancel</button>
                <button type="submit" className="btn-shine-gold-sm">Save & Boost Score (+5%)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Unified Mentor Settings Modal (Pricing, Days, Slots, and Video Teaser) */}
      {showEditMentorshipModal && (
        <div className="modal-backdrop-blur">
          <div className="modal-surface-card" style={{ maxWidth: '620px' }}>
            <div className="modal-top-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>Edit Mentorship Pricing, Schedule & Teaser</h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748B' }}>Configure your rates, session duration, booking slots, and Peerpath video reel</p>
              </div>
              <button 
                type="button" 
                className="btn-icon-close" 
                onClick={() => setShowEditMentorshipModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMentorshipSettings}>
              <div className="modal-body-pad">
                
                {/* Section 1: Pricing & Duration */}
                <div className="mentor-modal-section-title">
                  🏷️ 1. Session Fee & Duration
                </div>

                <div className="mentor-modal-grid-row">
                  {/* Rate */}
                  <div className="mentor-form-group" style={{ marginBottom: 0 }}>
                    <label className="mentor-form-label">Session Fee (₹ INR)</label>
                    <div className="mentor-rate-input-wrap">
                      <span className="mentor-rate-prefix">₹</span>
                      <input 
                        type="number" 
                        className="mentor-rate-field"
                        value={rateInput}
                        onChange={(e) => setRateInput(Number(e.target.value))}
                        min={0}
                        step={1}
                        required
                      />
                    </div>
                    <div className="mentor-rate-presets">
                      {[499, 999, 1499, 1999].map(p => (
                        <button 
                          key={p} 
                          type="button" 
                          className={`rate-preset-btn ${rateInput === p ? 'active' : ''}`}
                          onClick={() => setRateInput(p)}
                        >
                          ₹{p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mentor-form-group" style={{ marginBottom: 0 }}>
                    <label className="mentor-form-label">Session Duration (Mins)</label>
                    <div className="mentor-rate-input-wrap">
                      <input 
                        type="number" 
                        className="mentor-rate-field"
                        value={durationInput}
                        onChange={(e) => setDurationInput(Number(e.target.value))}
                        min={1}
                        max={180}
                        step={1}
                        required
                      />
                      <span className="mentor-rate-prefix">mins</span>
                    </div>
                    <div className="mentor-rate-presets">
                      {[30, 45, 60].map(d => (
                        <button 
                          key={d} 
                          type="button" 
                          className={`rate-preset-btn ${durationInput === d ? 'active' : ''}`}
                          onClick={() => setDurationInput(d)}
                        >
                          {d}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2: Active Days & Slots */}
                <div className="mentor-modal-section-title">
                  📅 2. Active Days & Time Slots
                </div>

                {/* Available Days */}
                <div className="mentor-form-group">
                  <label className="mentor-form-label">Available Days of the Week</label>
                  <div className="mentor-days-pill-group">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button 
                          key={day}
                          type="button"
                          className={`mentor-day-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => handleToggleDay(day)}
                        >
                          {isSelected ? '✓ ' : ''}{day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="mentor-form-group" style={{ marginBottom: 0 }}>
                  <label className="mentor-form-label">Available Time Slots ({availableSlots.length})</label>
                  <div className="mentor-manage-slots-list">
                    {availableSlots.map((slot, idx) => (
                      <span key={idx} className="mentor-editable-slot-chip">
                        🕒 {slot}
                        <button 
                          type="button" 
                          className="btn-remove-slot-x"
                          onClick={() => handleRemoveSlot(slot)}
                          title="Remove slot"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="mentor-add-slot-form" style={{ marginTop: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Add custom slot e.g. 07:00 PM - 08:00 PM"
                      value={newSlotInput}
                      onChange={(e) => setNewSlotInput(e.target.value)}
                      className="mentor-add-slot-input"
                    />
                    <button 
                      type="button" 
                      className="btn-shine-gold-sm"
                      onClick={handleAddSlot}
                      disabled={!newSlotInput.trim()}
                    >
                      <Plus size={13} /> Add Slot
                    </button>
                  </div>
                </div>

                {/* Section 3: Video Introduction & Teaser */}
                <div className="mentor-modal-section-title">
                  🎥 3. Video Introduction & Teaser Reel (Peerpath 60s)
                </div>

                {hasTeaserVideo ? (
                  <div>
                    {/* Teaser Title */}
                    <div className="mentor-form-group">
                      <label className="mentor-form-label">Teaser Video Title / Pitch</label>
                      <input 
                        type="text" 
                        value={teaserTitleInput}
                        onChange={(e) => setTeaserTitleInput(e.target.value)}
                        placeholder="e.g. How I Help Candidates Transition to PM & Tech Leadership"
                        className="custom-textarea"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                        required
                      />
                    </div>

                    <div className="mentor-modal-grid-row">
                      <div className="mentor-form-group" style={{ marginBottom: 0 }}>
                        <label className="mentor-form-label">Duration Tag</label>
                        <input 
                          type="text" 
                          value={teaserDurationInput}
                          onChange={(e) => setTeaserDurationInput(e.target.value)}
                          placeholder="e.g. 0:58 min"
                          className="custom-textarea"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                          required
                        />
                      </div>

                      <div className="mentor-form-group" style={{ marginBottom: 0 }}>
                        <label className="mentor-form-label">Sample Video Demo</label>
                        <select
                          value={teaserVideoUrl}
                          onChange={(e) => setTeaserVideoUrl(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', background: '#FFFFFF' }}
                        >
                          <option value="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4">Tech Leadership / PM Demo</option>
                          <option value="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-40030-large.mp4">System Design & Coding Demo</option>
                        </select>
                      </div>
                    </div>

                    {/* Live Preview player */}
                    {teaserVideoUrl && (
                      <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#000' }}>
                        <div style={{ padding: '6px 10px', background: '#0F172A', color: '#94A3B8', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Play size={11} color="#38BDF8" /> Live Video Preview
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setHasTeaserVideo(false)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Remove Video
                          </button>
                        </div>
                        <video 
                          controls 
                          src={teaserVideoUrl} 
                          style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', background: '#000' }} 
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="teaser-dropzone-box"
                    style={{ padding: '16px', margin: 0 }}
                    onClick={() => {
                      setHasTeaserVideo(true);
                      setTeaserVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4');
                    }}
                  >
                    <div className="tdz-icon" style={{ fontSize: '24px' }}>🎥</div>
                    <strong style={{ display: 'block', fontSize: '13.5px', color: '#0F172A', marginBottom: '2px' }}>
                      Click to Add 60-Second Video Teaser
                    </strong>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      MP4, MOV, or WebM • 60s pitch builds trust and gets 3x more bookings
                    </span>
                  </div>
                )}

              </div>

              <div className="modal-footer-flex">
                <button type="button" className="btn-ghost-sm" onClick={() => setShowEditMentorshipModal(false)}>Cancel</button>
                <button type="submit" className="btn-shine-gold-sm">
                  Save Mentorship Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
