import React, { useState } from 'react';
import { 
  Video, Plus, Calendar, FileCheck, CheckCircle2, 
  Award, Clock, AlertCircle, ArrowLeft, RotateCcw, 
  XCircle, ShieldCheck, Sparkles, Star, User, Settings,
  DollarSign, Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MySessionsView: React.FC = () => {
  const { 
    sessions, 
    currentUser,
    userProfile, 
    navigate, 
    cancelSession, 
    rescheduleSession, 
    setActiveSession 
  } = useApp();

  const isMentor = currentUser?.role === 'mentor' || Boolean(userProfile.isMentor);
  const loggedInFirstName = (currentUser?.name || userProfile.name || 'Prakash').split(' ')[0].toLowerCase();

  // 1. Candidate's booked sessions (where user is the candidate)
  const candidateBookedUpcoming = sessions.filter(s => 
    s.status === 'upcoming' && 
    s.candidateName.toLowerCase().includes(loggedInFirstName) &&
    !s.expert.name.toLowerCase().includes(loggedInFirstName)
  );
  const candidateBookedCompleted = sessions.filter(s => 
    s.status === 'completed' && 
    s.candidateName.toLowerCase().includes(loggedInFirstName)
  );

  // 2. Mentor's hosted sessions (candidate bookings with this mentor)
  const mentorHostedUpcoming = sessions.filter(s => 
    s.status === 'upcoming' && 
    (s.expert.name.toLowerCase().includes(loggedInFirstName) || s.expert.id === currentUser?.id)
  );
  const mentorHostedCompleted = sessions.filter(s => 
    s.status === 'completed' && 
    (s.expert.name.toLowerCase().includes(loggedInFirstName) || s.expert.id === currentUser?.id)
  );

  const [activeTab, setActiveTab] = useState<'hosted' | 'upcoming' | 'completed'>(
    isMentor ? 'hosted' : 'upcoming'
  );
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('Tomorrow, 5 Sep');
  const [rescheduleTime, setRescheduleTime] = useState<string>('02:00 PM - 03:00 PM');

  const handleJoinCall = (session: typeof sessions[0]) => {
    setActiveSession(session);
    navigate('live-call-view');
  };

  const handleConfirmReschedule = (sessionId: string) => {
    rescheduleSession(sessionId, rescheduleDate, rescheduleTime);
    setReschedulingId(null);
  };

  return (
    <div className="content-wrapper sessions-fullwidth-wrapper">
      
      {/* Top Header Navigation Row */}
      <div className="sessions-top-nav-bar">
        <button 
          type="button" 
          className="btn-sessions-back"
          onClick={() => navigate('profile-view')}
        >
          <ArrowLeft size={16} />
          <span>Back to Profile</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isMentor ? (
            <>
              <button 
                type="button" 
                className="btn-ghost-sm"
                onClick={() => navigate('profile-view')}
                style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', fontWeight: 700 }}
              >
                <Settings size={14} /> Mentorship Settings
              </button>
              <button 
                type="button" 
                className="btn-sessions-book-new"
                onClick={() => navigate('experts-view')}
              >
                <Plus size={16} />
                <span>Book Leadership Mentor</span>
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="btn-sessions-book-new"
              onClick={() => navigate('experts-view')}
            >
              <Plus size={16} />
              <span>Book Another Mentor</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header & Quick Stats Row */}
      <div className="sessions-hero-card">
        <div className="sessions-hero-content">
          <div className="sessions-hero-badge">
            <Sparkles size={13} className="text-amber-500" />
            <span>{isMentor ? 'Peerpath Verified Mentor Studio' : 'Peerpath Mentorship Dashboard'}</span>
          </div>
          <h1 className="sessions-hero-title">
            {isMentor ? 'Mentorship Studio & Live Sessions' : 'My Mentorship Sessions'}
          </h1>
          <p className="sessions-hero-subtitle">
            {isMentor
              ? 'Host 1:1 live guidance calls with ambitious candidates, evaluate skills, and manage your booking schedule.'
              : 'Manage your live 1:1 guidance calls with verified tech leaders, enter video meeting rooms, and access verified skill badges.'}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="sessions-hero-stats-grid">
          {isMentor ? (
            <>
              <div className="sh-stat-card">
                <div className="sh-stat-icon-wrap icon-purple"><Video size={18} /></div>
                <div>
                  <strong className="sh-stat-num">{mentorHostedUpcoming.length}</strong>
                  <span className="sh-stat-label">Candidate Calls Booked</span>
                </div>
              </div>

              <div className="sh-stat-card">
                <div className="sh-stat-icon-wrap icon-emerald"><DollarSign size={18} /></div>
                <div>
                  <strong className="sh-stat-num">₹{(userProfile.mentorEarnings || 47952).toLocaleString('en-IN')}</strong>
                  <span className="sh-stat-label">Total Earned</span>
                </div>
              </div>

              <div className="sh-stat-card">
                <div className="sh-stat-icon-wrap icon-amber"><ShieldCheck size={18} /></div>
                <div>
                  <strong className="sh-stat-num">{userProfile.mentorSessionsCount || 48}</strong>
                  <span className="sh-stat-label">Candidates Mentored ({userProfile.mentorRating || 4.9}★)</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="sh-stat-card">
                <div className="sh-stat-icon-wrap icon-purple"><Video size={18} /></div>
                <div>
                  <strong className="sh-stat-num">{candidateBookedUpcoming.length}</strong>
                  <span className="sh-stat-label">Upcoming Sessions</span>
                </div>
              </div>

              <div className="sh-stat-card">
                <div className="sh-stat-icon-wrap icon-emerald"><CheckCircle2 size={18} /></div>
                <div>
                  <strong className="sh-stat-num">{candidateBookedCompleted.length}</strong>
                  <span className="sh-stat-label">Completed Sessions</span>
                </div>
              </div>

              <div className="sh-stat-card">
                <div className="sh-stat-icon-wrap icon-amber"><ShieldCheck size={18} /></div>
                <div>
                  <strong className="sh-stat-num">1</strong>
                  <span className="sh-stat-label">Skill Badge Earned</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="sessions-tabs-container">
        <div className="sessions-tab-btn-group">
          {isMentor ? (
            <>
              <button 
                type="button"
                className={`s-tab-btn ${activeTab === 'hosted' ? 'active' : ''}`}
                onClick={() => setActiveTab('hosted')}
              >
                <Video size={15} />
                <span>Candidate Calls (Hosted)</span>
                <span className="s-tab-pill">{mentorHostedUpcoming.length}</span>
              </button>

              <button 
                type="button"
                className={`s-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <Calendar size={15} />
                <span>My Booked Calls</span>
                <span className="s-tab-pill">{candidateBookedUpcoming.length}</span>
              </button>

              <button 
                type="button"
                className={`s-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                <Award size={15} />
                <span>Completed Calls</span>
                <span className="s-tab-pill">{mentorHostedCompleted.length}</span>
              </button>
            </>
          ) : (
            <>
              <button 
                type="button"
                className={`s-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <Calendar size={15} />
                <span>Upcoming Sessions</span>
                <span className="s-tab-pill">{candidateBookedUpcoming.length}</span>
              </button>

              <button 
                type="button"
                className={`s-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                <Award size={15} />
                <span>Completed & Badges</span>
                <span className="s-tab-pill">{candidateBookedCompleted.length}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* MENTOR TAB 1: Candidate Calls Hosted (for Akash / Mentor) */}
      {isMentor && activeTab === 'hosted' && (
        <div className="sessions-cards-stream">
          {mentorHostedUpcoming.length === 0 ? (
            <div className="empty-sessions-box-full">
              <div className="empty-icon-circle"><AlertCircle size={36} color="#94A3B8" /></div>
              <h3>No candidate bookings scheduled</h3>
              <p>Your availability is active on Peerpath. Candidates will book calls based on your available schedule.</p>
              <button className="btn-shine-gold" onClick={() => navigate('profile-view')}>
                <Settings size={16} /> Manage Availability & Pricing
              </button>
            </div>
          ) : (
            mentorHostedUpcoming.map((sess) => (
              <div key={sess.id} className="session-card-modern" style={{ borderLeft: '3.5px solid #8B5CF6' }}>
                
                {/* Card Top: Candidate Info */}
                <div className="sc-header-row">
                  <div className="sc-mentor-profile">
                    <div className="sc-avatar-wrap">
                      <img src={sess.candidateAvatar || '/avatars/prakash.jpg'} alt={sess.candidateName} className="sc-mentor-avatar" />
                      <span className="sc-verified-check" style={{ background: '#3B82F6' }}><User size={12} color="#fff" /></span>
                    </div>

                    <div className="sc-mentor-info">
                      <div className="sc-name-row">
                        <h3 className="sc-mentor-name">{sess.candidateName}</h3>
                        <span className="sc-confirmed-chip">
                          <span className="sc-pulse-dot"></span> Confirmed Candidate
                        </span>
                      </div>
                      <p className="sc-mentor-role">{sess.candidateRole || 'Senior Frontend Engineer'} • <strong>Goal: {sess.candidateGoal}</strong></p>
                      <div className="sc-rating-row">
                        <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>
                          💰 Session Fee: ₹{userProfile.mentorRate || 499} ({userProfile.mentorDuration || 30} mins)
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="sc-type-badge" style={{ background: '#F5F3FF', color: '#7C3AED', borderColor: '#DDD6FE' }}>
                    <Video size={14} /> 1:1 Candidate Guidance (You are Host)
                  </span>
                </div>

                {/* Card Middle: Time & Meta Strip */}
                <div className="sc-meta-strip">
                  <div className="sc-meta-item">
                    <Calendar size={15} className="sc-meta-icon text-blue-600" />
                    <span><strong>Date:</strong> {sess.date}</span>
                  </div>

                  <div className="sc-meta-item">
                    <Clock size={15} className="sc-meta-icon text-amber-600" />
                    <span><strong>Time:</strong> {sess.timeSlot}</span>
                  </div>

                  <div className="sc-meta-item">
                    <FileCheck size={15} className="sc-meta-icon text-emerald-600" />
                    <span>Candidate Profile & Target Goals Pre-Loaded</span>
                  </div>
                </div>

                {/* Inline Reschedule Drawer */}
                {reschedulingId === sess.id && (
                  <div className="reschedule-drawer-card">
                    <div className="rd-header">
                      <h4><RotateCcw size={15} /> Propose New Date & Time for {sess.candidateName}</h4>
                      <button className="btn-close-rd" onClick={() => setReschedulingId(null)}>
                        <XCircle size={16} />
                      </button>
                    </div>

                    <div className="reschedule-inputs-row">
                      <div className="rd-select-group">
                        <label>Date</label>
                        <select 
                          value={rescheduleDate} 
                          onChange={(e) => setRescheduleDate(e.target.value)} 
                          className="rd-select"
                        >
                          <option value="Tomorrow, 5 Sep">Tomorrow, 5 Sep</option>
                          <option value="Sat, 6 Sep">Sat, 6 Sep</option>
                          <option value="Sun, 7 Sep">Sun, 7 Sep</option>
                        </select>
                      </div>

                      <div className="rd-select-group">
                        <label>Time Slot</label>
                        <select 
                          value={rescheduleTime} 
                          onChange={(e) => setRescheduleTime(e.target.value)} 
                          className="rd-select"
                        >
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Morning)</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon)</option>
                          <option value="06:30 PM - 07:30 PM">06:30 PM - 07:30 PM (Evening)</option>
                          <option value="08:00 PM - 09:00 PM">08:00 PM - 09:00 PM (Late Evening)</option>
                        </select>
                      </div>

                      <div className="rd-btn-group">
                        <button 
                          type="button"
                          className="btn-confirm-reschedule" 
                          onClick={() => handleConfirmReschedule(sess.id)}
                        >
                          Confirm Reschedule
                        </button>
                        <button 
                          type="button"
                          className="btn-cancel-rd" 
                          onClick={() => setReschedulingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Actions Row */}
                <div className="sc-footer-actions">
                  <div className="sc-left-actions">
                    <button 
                      type="button"
                      className="btn-sc-reschedule" 
                      onClick={() => setReschedulingId(sess.id)}
                    >
                      <RotateCcw size={14} /> Reschedule
                    </button>
                  </div>

                  <button 
                    type="button" 
                    className="btn-sc-join-room" 
                    onClick={() => handleJoinCall(sess)}
                  >
                    <span className="live-cam-pulse-dot"></span>
                    <Video size={16} />
                    <span>Start Video Call (Host Room)</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* CANDIDATE TAB 1: Upcoming Mentorship Sessions (where user is Candidate) */}
      {activeTab === 'upcoming' && (
        <div className="sessions-cards-stream">
          {candidateBookedUpcoming.length === 0 ? (
            <div className="empty-sessions-box-full">
              <div className="empty-icon-circle"><AlertCircle size={36} color="#94A3B8" /></div>
              <h3>No booked guidance calls scheduled</h3>
              <p>Explore verified industry leaders and book your 1:1 trajectory guidance call today.</p>
              <button className="btn-shine-gold" onClick={() => navigate('experts-view')}>
                <Plus size={16} /> Explore 500+ Mentors
              </button>
            </div>
          ) : (
            candidateBookedUpcoming.map((sess) => (
              <div key={sess.id} className="session-card-modern">
                
                {/* Card Top: Mentor Header + Session Type Badge */}
                <div className="sc-header-row">
                  <div className="sc-mentor-profile">
                    <div className="sc-avatar-wrap">
                      <img src={sess.expert.avatar} alt={sess.expert.name} className="sc-mentor-avatar" />
                      <span className="sc-verified-check"><CheckCircle2 size={13} /></span>
                    </div>

                    <div className="sc-mentor-info">
                      <div className="sc-name-row">
                        <h3 className="sc-mentor-name">{sess.expert.name}</h3>
                        <span className="sc-confirmed-chip">
                          <span className="sc-pulse-dot"></span> Confirmed & Ready
                        </span>
                      </div>
                      <p className="sc-mentor-role">{sess.expert.role} • <strong>{sess.expert.company}</strong></p>
                      <div className="sc-rating-row">
                        <Star size={12} className="star-gold" />
                        <span><strong>{sess.expert.rating}</strong> ({sess.expert.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <span className="sc-type-badge">
                    <Video size={14} /> 1:1 Video Mentorship
                  </span>
                </div>

                {/* Card Middle: Time & Meta Strip */}
                <div className="sc-meta-strip">
                  <div className="sc-meta-item">
                    <Calendar size={15} className="sc-meta-icon text-blue-600" />
                    <span><strong>Date:</strong> {sess.date}</span>
                  </div>

                  <div className="sc-meta-item">
                    <Clock size={15} className="sc-meta-icon text-amber-600" />
                    <span><strong>Time:</strong> {sess.timeSlot}</span>
                  </div>

                  <div className="sc-meta-item">
                    <FileCheck size={15} className="sc-meta-icon text-emerald-600" />
                    <span>Profile & Goals Summary Pre-Loaded for Mentor</span>
                  </div>
                </div>

                {/* Inline Reschedule Drawer */}
                {reschedulingId === sess.id && (
                  <div className="reschedule-drawer-card">
                    <div className="rd-header">
                      <h4><RotateCcw size={15} /> Select New Date & Time for {sess.expert.name}</h4>
                      <button className="btn-close-rd" onClick={() => setReschedulingId(null)}>
                        <XCircle size={16} />
                      </button>
                    </div>

                    <div className="reschedule-inputs-row">
                      <div className="rd-select-group">
                        <label>Date</label>
                        <select 
                          value={rescheduleDate} 
                          onChange={(e) => setRescheduleDate(e.target.value)} 
                          className="rd-select"
                        >
                          <option value="Tomorrow, 5 Sep">Tomorrow, 5 Sep</option>
                          <option value="Sat, 6 Sep">Sat, 6 Sep</option>
                          <option value="Sun, 7 Sep">Sun, 7 Sep</option>
                        </select>
                      </div>

                      <div className="rd-select-group">
                        <label>Time Slot</label>
                        <select 
                          value={rescheduleTime} 
                          onChange={(e) => setRescheduleTime(e.target.value)} 
                          className="rd-select"
                        >
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Morning)</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon)</option>
                          <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Evening)</option>
                          <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM (Evening)</option>
                          <option value="08:30 PM - 09:30 PM">08:30 PM - 09:30 PM (Late Evening)</option>
                        </select>
                      </div>

                      <div className="rd-btn-group">
                        <button 
                          type="button"
                          className="btn-confirm-reschedule" 
                          onClick={() => handleConfirmReschedule(sess.id)}
                        >
                          Confirm Reschedule
                        </button>
                        <button 
                          type="button"
                          className="btn-cancel-rd" 
                          onClick={() => setReschedulingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Actions Row */}
                <div className="sc-footer-actions">
                  <div className="sc-left-actions">
                    <button 
                      type="button"
                      className="btn-sc-reschedule" 
                      onClick={() => setReschedulingId(sess.id)}
                    >
                      <RotateCcw size={14} /> Reschedule
                    </button>
                    
                    <button 
                      type="button"
                      className="btn-sc-cancel" 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel your session with ${sess.expert.name}? 100% refund will be credited.`)) {
                          cancelSession(sess.id);
                        }
                      }}
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  </div>

                  <button 
                    type="button"
                    className="btn-sc-join-room" 
                    onClick={() => handleJoinCall(sess)}
                  >
                    <span className="live-cam-pulse-dot"></span>
                    <Video size={16} />
                    <span>Join Video Room (Room Open)</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: Completed Sessions */}
      {activeTab === 'completed' && (
        <div className="sessions-cards-stream">
          {(isMentor ? mentorHostedCompleted : candidateBookedCompleted).length === 0 ? (
            <div className="empty-sessions-box-full">
              <div className="empty-icon-circle"><Award size={36} color="#94A3B8" /></div>
              <h3>No completed sessions yet</h3>
              <p>{isMentor ? 'Completed candidate mentorship sessions will appear here.' : 'Completed sessions and skill badges will appear here after video calls.'}</p>
            </div>
          ) : (
            (isMentor ? mentorHostedCompleted : candidateBookedCompleted).map((sess) => (
              <div key={sess.id} className="session-card-modern sc-completed-style">
                <div className="sc-header-row">
                  <div className="sc-mentor-profile">
                    <div className="sc-avatar-wrap">
                      <img 
                        src={isMentor ? (sess.candidateAvatar || '/avatars/prakash.jpg') : sess.expert.avatar} 
                        alt={isMentor ? sess.candidateName : sess.expert.name} 
                        className="sc-mentor-avatar" 
                      />
                      <span className="sc-verified-check"><CheckCircle2 size={13} /></span>
                    </div>
                    <div className="sc-mentor-info">
                      <h3 className="sc-mentor-name">{isMentor ? sess.candidateName : sess.expert.name}</h3>
                      <p className="sc-mentor-role">
                        {isMentor ? (sess.candidateRole || 'Candidate') : `${sess.expert.role} at ${sess.expert.company}`}
                      </p>
                    </div>
                  </div>

                  <span className="sc-badge-completed">
                    <CheckCircle2 size={14} /> Completed on {sess.date}
                  </span>
                </div>

                <div className="sc-outcome-highlight-box">
                  <div className="sc-outcome-icon-wrap">
                    <Award size={24} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="sc-outcome-title">Outcome: "{sess.badgeAwarded || 'System Architecture'}" Skill Badge Verified</h4>
                    <p className="sc-outcome-notes">
                      {sess.feedbackNotes || `${sess.expert.name} verified proficiency in architecture design & performance tuning. This verified badge is attached to the candidate's Shine profile.`}
                    </p>
                  </div>
                </div>

                <div className="sc-footer-actions sc-completed-footer">
                  <button 
                    type="button" 
                    className="btn-sc-view-assessment" 
                    onClick={() => navigate('post-session-view')}
                  >
                    <Award size={15} /> View Full Assessment & Verified Badge
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
