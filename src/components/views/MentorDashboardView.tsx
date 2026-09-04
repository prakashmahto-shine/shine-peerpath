import React, { useState } from 'react';
import { 
  Video, Calendar, Clock, DollarSign, Star, CheckCircle2, 
  Award, ShieldCheck, UserCheck, Sparkles, FileText, Download,
  RotateCcw, ArrowRight, TrendingUp, Check, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MentorDashboardView: React.FC = () => {
  const { 
    currentUser, 
    sessions, 
    navigate, 
    setActiveSession, 
    setIsAssessmentModalOpen,
    setAssessmentDraftSession,
    mentorAvailability,
    updateMentorAvailability
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'availability' | 'history'>('bookings');

  // Filter sessions where expert is Akash or currentUser
  const mentorSessions = sessions.filter(s => 
    s.expert.name.toLowerCase().includes('akash') || s.expert.id === 'akash'
  );
  const upcomingMentorSessions = mentorSessions.filter(s => s.status === 'upcoming');
  const completedMentorSessions = mentorSessions.filter(s => s.status === 'completed');

  const handleHostCall = (session: typeof sessions[0]) => {
    setActiveSession(session);
    navigate('live-call-view');
  };

  const handleOpenAssessment = (session: typeof sessions[0]) => {
    setAssessmentDraftSession(session);
    setIsAssessmentModalOpen(true);
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
                src={currentUser.avatar || '/avatars/akash.jpg'} 
                alt={currentUser.name} 
                className="mentor-hero-avatar"
              />
              <span className="mentor-verified-check"><CheckCircle2 size={14} /></span>
            </div>
            
            <div className="mentor-profile-info">
              <div className="mentor-name-row">
                <h1 className="mentor-hero-title">{currentUser.name}</h1>
                <span className="mentor-portal-badge">
                  <ShieldCheck size={13} /> Verified Lead Mentor
                </span>
                <span className="mentor-live-status-pill">
                  <span className="mentor-pulse-green"></span> Accepting Bookings
                </span>
              </div>
              <p className="mentor-hero-role">{currentUser.headline || 'Lead Product Manager @ Shine (HT Media)'}</p>
              <div className="mentor-meta-row">
                <div className="mentor-star-rating">
                  <Star size={13} className="star-gold" />
                  <strong>4.9</strong>
                  <span>(142 verified candidate reviews)</span>
                </div>
                <span>•</span>
                <span>Session Fee: <strong>₹999 / hr</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Metric Tiles */}
        <div className="mentor-metrics-grid">
          <div className="mm-tile">
            <div className="mm-icon-wrap icon-green"><DollarSign size={18} /></div>
            <div>
              <span className="mm-label">Total Earnings</span>
              <strong className="mm-val">₹47,952</strong>
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
              <strong className="mm-val">48</strong>
              <span className="mm-sub">100% attendance rate</span>
            </div>
          </div>

          <div className="mm-tile">
            <div className="mm-icon-wrap icon-amber"><Award size={18} /></div>
            <div>
              <span className="mm-label">Badges Awarded</span>
              <strong className="mm-val">42</strong>
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
            <span>Candidate Bookings</span>
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
            <span className="m-tab-pill">{completedMentorSessions.length + 47}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Upcoming Candidate Bookings */}
      {activeTab === 'bookings' && (
        <div className="mentor-cards-stack">
          {upcomingMentorSessions.length === 0 ? (
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
                          <span className="sc-pulse-dot"></span> Confirmed Booking
                        </span>
                      </div>
                      <p className="msc-cand-role">{sess.candidateRole || 'Senior Frontend Engineer'} (4+ Years Exp)</p>
                      <p className="msc-cand-goal">
                        🎯 <strong>Candidate Goal:</strong> {sess.candidateGoal || 'Targeting ₹18L–₹24L Product Role Jump & 1:1 Resume Teardown'}
                      </p>
                    </div>
                  </div>

                  <div className="msc-payout-box">
                    <span className="msc-payout-label">Your Payout</span>
                    <strong className="msc-payout-amount">₹999</strong>
                    <span className="msc-payout-status">Direct Bank Transfer</span>
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
                    <FileText size={15} className="text-emerald-600" />
                    <span>Resume: <strong>Prakash-Mahto1.pdf</strong></span>
                    <button 
                      type="button" 
                      className="btn-preview-cv-inline"
                      onClick={() => alert('Opening Candidate Resume Preview...')}
                    >
                      <Download size={12} /> View CV
                    </button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="msc-footer-actions">
                  <div className="msc-left-btn-group">
                    <button 
                      type="button" 
                      className="btn-msc-reschedule"
                      onClick={() => alert('A reschedule request has been sent to the candidate.')}
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
            <span className="mac-rate-badge">Hourly Fee: ₹999 (Fixed)</span>
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
                  <p className="msc-cand-role">Senior Frontend Developer • Completed on 24 Aug 2026</p>
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

    </div>
  );
};
