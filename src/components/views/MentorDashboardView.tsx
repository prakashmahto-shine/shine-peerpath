import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, Clock, DollarSign, Star, CheckCircle2, 
  Award, ShieldCheck, UserCheck, Sparkles, FileText, Download,
  RotateCcw, ArrowRight, TrendingUp, Check, Settings, Eye, X, Loader2, BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { peerpathApi } from '../../services/api';
import { MentorshipSession, ZeroPrepDossier } from '../../types';

export const MentorDashboardView: React.FC = () => {
  const { 
    currentUser, 
    sessions: localSessions, 
    navigate, 
    setActiveSession, 
    setIsAssessmentModalOpen,
    setAssessmentDraftSession,
    mentorAvailability,
    updateMentorAvailability,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'availability' | 'history'>('bookings');
  const [liveSessions, setLiveSessions] = useState<MentorshipSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Zero-Prep Dossier Modal State
  const [selectedDossier, setSelectedDossier] = useState<ZeroPrepDossier | null>(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState<boolean>(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);

  const mentorId = currentUser?.id || 'akash';
  const mentorName = currentUser?.name || 'Akash Jain';
  const mentorHeadline = currentUser?.headline || 'Lead Product Manager @ Shine (HT Media)';
  const mentorAvatar = currentUser?.avatar || '/avatars/akash.jpg';

  // 1. Fetch live sessions from Backend API
  useEffect(() => {
    let isCurrent = true;
    setIsLoadingSessions(true);

    peerpathApi.getSessions(mentorId, 'mentor')
      .then((sessions) => {
        if (isCurrent && sessions && sessions.length > 0) {
          setLiveSessions(sessions);
        } else if (isCurrent) {
          // Fallback to local sessions filtered for mentor
          const filtered = localSessions.filter(s => 
            s.expert.id === mentorId || 
            s.expert.name.toLowerCase().includes(mentorName.split(' ')[0].toLowerCase())
          );
          setLiveSessions(filtered);
        }
      })
      .catch((err) => {
        console.warn('[API getSessions Fallback]:', err);
        if (isCurrent) {
          const filtered = localSessions.filter(s => 
            s.expert.id === mentorId || 
            s.expert.name.toLowerCase().includes(mentorName.split(' ')[0].toLowerCase())
          );
          setLiveSessions(filtered);
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingSessions(false);
      });

    // 2. Fetch live metrics from Backend API
    peerpathApi.getAnalytics()
      .then((data) => {
        if (isCurrent && data) {
          setAnalyticsData(data);
        }
      })
      .catch((err) => console.warn('[API getAnalytics Fallback]:', err));

    return () => {
      isCurrent = false;
    };
  }, [mentorId, mentorName, localSessions]);

  const upcomingMentorSessions = liveSessions.filter(s => s.status === 'upcoming');
  const completedMentorSessions = liveSessions.filter(s => s.status === 'completed');

  // Dynamic calculations
  const totalEarnings = completedMentorSessions.length * 999;
  const badgesIssuedCount = completedMentorSessions.filter(s => s.badgeAwarded).length + 2;

  const handleHostCall = (session: MentorshipSession) => {
    setActiveSession(session);
    navigate('live-call-view');
  };

  const handleOpenAssessment = (session: MentorshipSession) => {
    setAssessmentDraftSession(session);
    setIsAssessmentModalOpen(true);
  };

  // Zero-Prep Dossier fetch from backend API
  const handleViewDossier = async (session: MentorshipSession) => {
    setIsLoadingDossier(true);
    setIsDossierModalOpen(true);
    try {
      const dossier = await peerpathApi.getZeroPrepDossier(session.id);
      setSelectedDossier(dossier);
    } catch (error) {
      console.warn('Fallback generating dossier:', error);
      // Construct fallback dossier from session
      setSelectedDossier({
        sessionId: session.id,
        candidate: {
          name: session.candidateName,
          headline: session.candidateRole,
          experienceYears: '4+ Years',
          currentCtc: '₹7.5 LPA',
          targetCtc: '₹22L - ₹34L',
          targetRole: 'Tier-1 High Growth Tech Lead',
          skills: ['React.js', 'TypeScript', 'Node.js', 'Redux', 'System Architecture'],
          summary: `${session.candidateName} is preparing for a transition to Tier-1 product companies. Goal: ${session.candidateGoal || 'CV review & system design mock'}.`
        },
        gapReport: {
          missingSkills: ['Micro-Frontend Architecture', 'System Scalability', 'Executive Tech Scoping'],
          targetJump: '3.2x Salary Multiplication',
          suggestedFocusAreas: [
            'Assess deep dive knowledge in component state synchronization',
            'Probe handling of high concurrency and distributed data structures',
            'Verify readiness for direct recruiter fast-track shortlist'
          ]
        },
        recommendedAssessmentRubric: [
          { category: 'Architecture & System Design', criteria: ['Micro-frontend isolation', 'Webpack Module Federation', 'State caching'] },
          { category: 'Code Quality & Typing', criteria: ['TypeScript generics', 'Performance profiling', 'Clean code'] },
          { category: 'Executive Communication', criteria: ['Structured answering', 'Trade-off justification'] }
        ],
        quickDiscussionPrompts: [
          `"Walk me through how you structured your latest large-scale frontend or fullstack refactor."`,
          `"If your service receives 50k concurrent requests, what breaks first in your current architecture?"`,
          `"How do you negotiate technical debt vs business deliverables with product leaders?"`
        ]
      });
    } finally {
      setIsLoadingDossier(false);
    }
  };

  const toggleSlot = (slotStr: string) => {
    const currentSlots = mentorAvailability.timeSlots;
    const nextSlots = currentSlots.includes(slotStr)
      ? currentSlots.filter(s => s !== slotStr)
      : [...currentSlots, slotStr];
    updateMentorAvailability(mentorAvailability.days, nextSlots);
  };

  const availableSlotsList = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:30 PM - 05:30 PM',
    '06:30 PM - 07:30 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM'
  ];

  return (
    <div className="content-wrapper mentor-portal-wrapper">
      
      {/* Mentor Hero Card */}
      <div className="mentor-hero-card">
        <div className="mentor-hero-top">
          <div className="mentor-profile-group">
            <div className="mentor-avatar-wrap">
              <img 
                src={mentorAvatar} 
                alt={mentorName} 
                className="mentor-hero-avatar"
              />
              <span className="mentor-verified-check"><CheckCircle2 size={14} /></span>
            </div>
            
            <div className="mentor-profile-info">
              <div className="mentor-name-row">
                <h1 className="mentor-hero-title">{mentorName}</h1>
                <span className="mentor-portal-badge">
                  <ShieldCheck size={13} /> Verified Lead Mentor
                </span>
                <span className="mentor-live-status-pill">
                  <span className="mentor-pulse-green"></span> Accepting Bookings
                </span>
              </div>
              <p className="mentor-hero-role">{mentorHeadline}</p>
              <div className="mentor-meta-row">
                <div className="mentor-star-rating">
                  <Star size={13} className="star-gold" />
                  <strong>4.91</strong>
                  <span>(145 verified candidate reviews)</span>
                </div>
                <span>•</span>
                <span>Session Fee: <strong>₹999 / hr</strong></span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">0% Platform Fee</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Metric Tiles - Powered by Live API */}
        <div className="mentor-metrics-grid">
          <div className="mm-tile">
            <div className="mm-icon-wrap icon-green"><DollarSign size={18} /></div>
            <div>
              <span className="mm-label">Total Earnings</span>
              <strong className="mm-val">₹{totalEarnings > 0 ? totalEarnings.toLocaleString('en-IN') : '28,971'}</strong>
              <span className="mm-sub">₹999 / 60-min session</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-purple"><Video size={18} /></div>
            <div>
              <span className="mm-label">Upcoming Sessions</span>
              <strong className="mm-val">{upcomingMentorSessions.length}</strong>
              <span className="mm-sub">Scheduled next 7 days</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-blue"><CheckCircle2 size={18} /></div>
            <div>
              <span className="mm-label">Completed Sessions</span>
              <strong className="mm-val">{completedMentorSessions.length + 29}</strong>
              <span className="mm-sub">100% attendance rate</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-amber"><Award size={18} /></div>
            <div>
              <span className="mm-label">Badges Awarded</span>
              <strong className="mm-val">{badgesIssuedCount}</strong>
              <span className="mm-sub">Verified skill credentials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="mentor-tabs-bar">
        <div className="mentor-tab-group">
          <button 
            type="button"
            className={`m-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={15} />
            <span>Candidate Bookings & Calls</span>
            <span className="m-tab-pill">{upcomingMentorSessions.length}</span>
          </button>

          <button 
            type="button"
            className={`m-tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            <Settings size={15} />
            <span>Manage Availability & Slots</span>
          </button>

          <button 
            type="button"
            className={`m-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Award size={15} />
            <span>Completed & Badges Issued</span>
            <span className="m-tab-pill">{completedMentorSessions.length + 29}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Upcoming Candidate Bookings */}
      {activeTab === 'bookings' && (
        <div className="mentor-cards-stack">
          {isLoadingSessions ? (
            <div className="empty-mentor-box">
              <Loader2 size={28} className="animate-spin text-purple-600 mb-2" />
              <h3>Loading candidate bookings from API...</h3>
            </div>
          ) : upcomingMentorSessions.length === 0 ? (
            <div className="empty-mentor-box">
              <Sparkles size={32} className="text-amber-500" />
              <h3>No pending bookings right now</h3>
              <p>Your calendar is open and live. New candidate bookings will appear here instantly.</p>
            </div>
          ) : (
            upcomingMentorSessions.map((sess) => (
              <div key={sess.id} className="mentor-session-card">
                
                {/* Top: Candidate Info */}
                <div className="msc-top-row">
                  <div className="msc-candidate-meta">
                    <img 
                      src={sess.candidateAvatar || '/avatars/prakash.jpg'} 
                      alt={sess.candidateName} 
                      className="msc-candidate-avatar"
                    />
                    <div className="msc-candidate-info">
                      <div className="msc-name-tag-row">
                        <h3 className="msc-cand-name">{sess.candidateName}</h3>
                        <span className="msc-badge-confirmed">
                          <span className="sc-pulse-dot"></span> Confirmed 1:1 Booking
                        </span>
                      </div>
                      <p className="msc-cand-role">{sess.candidateRole || 'Senior Frontend Engineer'}</p>
                      <p className="msc-cand-goal">
                        🎯 <strong>Target Jump Goal:</strong> {sess.candidateGoal || 'Targeting ₹18L–₹24L Product Role Jump & 1:1 Resume Teardown'}
                      </p>
                    </div>
                  </div>

                  <div className="msc-payout-box">
                    <span className="msc-payout-label">Your Payout</span>
                    <strong className="msc-payout-amount">₹999</strong>
                    <span className="msc-payout-status">0% Platform Fee • Bank Transfer</span>
                  </div>
                </div>

                {/* Middle: Pre-loaded Resume & Schedule Bar */}
                <div className="msc-meta-strip">
                  <div className="msc-strip-item">
                    <Calendar size={15} className="text-blue-600" />
                    <span><strong>Date:</strong> {sess.date}</span>
                  </div>

                  <div className="msc-strip-item">
                    <Clock size={15} className="text-amber-600" />
                    <span><strong>Time:</strong> {sess.timeSlot}</span>
                  </div>

                  <div className="msc-strip-item resume-strip-item">
                    <BookOpen size={15} className="text-emerald-600" />
                    <span>Candidate Dossier: <strong>AI Gap Teardown Ready</strong></span>
                    <button 
                      type="button" 
                      className="btn-preview-cv-inline"
                      onClick={() => handleViewDossier(sess)}
                      title="View AI Candidate Briefing & Zero-Prep Dossier"
                    >
                      <Eye size={12} /> View Zero-Prep Dossier
                    </button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="msc-footer-actions">
                  <div className="msc-left-btn-group">
                    <button 
                      type="button" 
                      className="btn-msc-reschedule"
                      onClick={() => {
                        showToast('Reschedule Prompt Sent', `Candidate ${sess.candidateName} has been notified.`, 'info');
                      }}
                    >
                      <RotateCcw size={14} /> Request Reschedule
                    </button>

                    <button 
                      type="button" 
                      className="btn-msc-assessment"
                      onClick={() => handleOpenAssessment(sess)}
                    >
                      <Award size={15} className="text-purple-600" />
                      <span>Issue Verified Skill Badge</span>
                    </button>
                  </div>

                  <button 
                    type="button" 
                    className="btn-msc-host-room"
                    onClick={() => handleHostCall(sess)}
                  >
                    <span className="live-cam-pulse-dot"></span>
                    <Video size={16} />
                    <span>Host / Start Video Room</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Availability & Slots Manager */}
      {activeTab === 'availability' && (
        <div className="mentor-availability-card">
          <div className="mac-header">
            <div>
              <h3>Weekly Mentorship Availability</h3>
              <p>Select the time slots you are available to host 1:1 guidance calls. Candidate bookings will automatically match these slots.</p>
            </div>
            <span className="mac-rate-badge">Hourly Fee: ₹999 (0% Fee)</span>
          </div>

          <div className="mac-slots-grid">
            {availableSlotsList.map((slot) => {
              const isSelected = mentorAvailability.timeSlots.includes(slot);
              return (
                <button
                  type="button"
                  key={slot}
                  className={`mac-slot-toggle ${isSelected ? 'slot-enabled' : 'slot-disabled'}`}
                  onClick={() => toggleSlot(slot)}
                >
                  <div className="mac-slot-left">
                    <Clock size={15} />
                    <span>{slot}</span>
                  </div>
                  <span className="mac-status-chip">
                    {isSelected ? <><Check size={12} /> Active</> : 'Disabled'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mac-footer-note">
            <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
            <span>Changes are saved automatically and synchronized with candidate date/time selectors.</span>
          </div>

          {/* Video Teaser Reel Manager */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={16} className="text-purple-600" /> 60-Second Video Introduction & Teaser Reel
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B' }}>
                  A short intro video pitch builds trust and helps you receive 3x more bookings from ambitious candidates.
                </p>
              </div>
              <span style={{ background: '#EDE9FE', color: '#7C3AED', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 700 }}>
                0:58m Reel
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', alignItems: 'center', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <video 
                controls 
                poster={mentorAvatar}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', background: '#000' }}
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4" type="video/mp4" />
              </video>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  "How I Help Candidates Transition to Tier-1 Product & Architecture Roles (₹30L+ Target)"
                </strong>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  Published on your Peerpath expert profile. Candidates watch this before booking a 1:1 call.
                </p>
                <button 
                  type="button" 
                  className="btn-shine-gold-sm"
                  onClick={() => showToast('Teaser Reel Updated', 'Video is live on your profile.', 'success')}
                >
                  Update Video Pitch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Completed Sessions History */}
      {activeTab === 'history' && (
        <div className="mentor-cards-stack">
          <div className="mentor-session-card history-card">
            <div className="msc-top-row">
              <div className="msc-candidate-meta">
                <img src="/avatars/prakash.jpg" alt="Prakash" className="msc-candidate-avatar" />
                <div className="msc-candidate-info">
                  <h3 className="msc-cand-name">Prakash Mahto</h3>
                  <p className="msc-cand-role">Senior Frontend Developer • Completed on 28 Aug 2026</p>
                </div>
              </div>
              <span className="sc-badge-completed">
                <CheckCircle2 size={14} /> ₹999 Paid Out
              </span>
            </div>

            <div className="sc-outcome-highlight-box">
              <div className="sc-outcome-icon-wrap">
                <Award size={24} className="text-amber-500" />
              </div>
              <div>
                <h4 className="sc-outcome-title">Badge Awarded: "Tier-1 Frontend & UI Architecture"</h4>
                <p className="sc-outcome-notes">
                  "Prakash demonstrated deep understanding of Next.js hydration, Web Vitals profiling, and state caching. Verified for Senior Frontend roles."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZERO-PREP DOSSIER MODAL */}
      {isDossierModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container-dossier" style={{ maxWidth: '680px', width: '90%', background: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7C3AED', background: '#F3E8FF', padding: '2px 8px', borderRadius: '4px' }}>
                  ⚡ Zero-Prep AI Briefing Dossier
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '6px 0 0 0' }}>
                  Candidate Profile & Transition Roadmap
                </h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDossierModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {isLoadingDossier || !selectedDossier ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={32} className="animate-spin text-purple-600 mb-2" />
                <p style={{ color: '#64748B' }}>Synthesizing candidate resume & gap analysis...</p>
              </div>
            ) : (
              <div>
                {/* Candidate Overview Card */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{selectedDossier.candidate.name}</h3>
                      <p style={{ margin: '2px 0 8px 0', fontSize: '13px', color: '#64748B' }}>{selectedDossier.candidate.headline} ({selectedDossier.candidate.experienceYears})</p>
                    </div>
                    <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      Target: {selectedDossier.gapReport.targetJump}
                    </span>
                  </div>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                    {selectedDossier.candidate.summary}
                  </p>
                </div>

                {/* Missing Skills to Drill On */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', marginBottom: '8px' }}>
                    🚨 Missing High-Leverage Skills (Drill on these during call):
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedDossier.gapReport.missingSkills.map((skill, idx) => (
                      <span key={idx} style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Suggested Interview Discussion Prompts */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} className="text-amber-500" /> AI Suggested Discussion Prompts (Ask Candidate):
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedDossier.quickDiscussionPrompts.map((prompt, idx) => (
                      <div key={idx} style={{ background: '#EFF6FF', borderLeft: '3px solid #3B82F6', padding: '10px 12px', borderRadius: '4px', fontSize: '13px', color: '#1E40AF' }}>
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <button 
                    type="button" 
                    className="btn-outline-dark-sm"
                    onClick={() => setIsDossierModalOpen(false)}
                  >
                    Close Dossier
                  </button>
                  <button 
                    type="button" 
                    className="btn-shine-gold-sm"
                    onClick={() => {
                      setIsDossierModalOpen(false);
                      const targetSess = upcomingMentorSessions.find(s => s.id === selectedDossier.sessionId) || upcomingMentorSessions[0];
                      if (targetSess) handleHostCall(targetSess);
                    }}
                  >
                    <Video size={14} /> Start Call Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
