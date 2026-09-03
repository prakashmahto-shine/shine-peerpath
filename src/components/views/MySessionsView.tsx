import React, { useState } from 'react';
import { 
  Video, Plus, Calendar, FileCheck, CheckCircle2, 
  Award, Clock, AlertCircle, ArrowLeft, RotateCcw, 
  XCircle, ShieldCheck, Sparkles, Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MySessionsView: React.FC = () => {
  const { 
    sessions, 
    userProfile: _userProfile, 
    navigate, 
    cancelSession, 
    rescheduleSession, 
    setActiveSession 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('Tomorrow, 5 Sep');
  const [rescheduleTime, setRescheduleTime] = useState<string>('02:00 PM - 03:00 PM');

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const completedSessions = sessions.filter(s => s.status === 'completed');

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

        <button 
          type="button" 
          className="btn-sessions-book-new"
          onClick={() => navigate('experts-view')}
        >
          <Plus size={16} />
          <span>Book Another Mentor</span>
        </button>
      </div>

      {/* Hero Header & Quick Stats Row */}
      <div className="sessions-hero-card">
        <div className="sessions-hero-content">
          <div className="sessions-hero-badge">
            <Sparkles size={13} className="text-amber-500" />
            <span>Peerpath Mentorship Dashboard</span>
          </div>
          <h1 className="sessions-hero-title">My Mentorship Sessions</h1>
          <p className="sessions-hero-subtitle">
            Manage your live 1:1 guidance calls, enter video meeting rooms, and access verified skill badges.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="sessions-hero-stats-grid">
          <div className="sh-stat-card">
            <div className="sh-stat-icon-wrap icon-purple"><Video size={18} /></div>
            <div>
              <strong className="sh-stat-num">{upcomingSessions.length}</strong>
              <span className="sh-stat-label">Upcoming Sessions</span>
            </div>
          </div>

          <div className="sh-stat-card">
            <div className="sh-stat-icon-wrap icon-emerald"><CheckCircle2 size={18} /></div>
            <div>
              <strong className="sh-stat-num">{completedSessions.length}</strong>
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
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="sessions-tabs-container">
        <div className="sessions-tab-btn-group">
          <button 
            type="button"
            className={`s-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={15} />
            <span>Upcoming Sessions</span>
            <span className="s-tab-pill">{upcomingSessions.length}</span>
          </button>

          <button 
            type="button"
            className={`s-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <Award size={15} />
            <span>Completed & Badges</span>
            <span className="s-tab-pill">{completedSessions.length}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Upcoming Sessions */}
      {activeTab === 'upcoming' && (
        <div className="sessions-cards-stream">
          {upcomingSessions.length === 0 ? (
            <div className="empty-sessions-box-full">
              <div className="empty-icon-circle"><AlertCircle size={36} color="#94A3B8" /></div>
              <h3>No upcoming sessions scheduled</h3>
              <p>Explore verified industry leaders and book your 1:1 trajectory guidance call today.</p>
              <button className="btn-shine-gold" onClick={() => navigate('experts-view')}>
                <Plus size={16} /> Explore 500+ Mentors
              </button>
            </div>
          ) : (
            upcomingSessions.map((sess) => (
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
                          <option value="Mon, 8 Sep">Mon, 8 Sep</option>
                          <option value="Tue, 9 Sep">Tue, 9 Sep</option>
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

      {/* Tab 2: Completed Sessions */}
      {activeTab === 'completed' && (
        <div className="sessions-cards-stream">
          {completedSessions.map((sess) => (
            <div key={sess.id} className="session-card-modern sc-completed-style">
              <div className="sc-header-row">
                <div className="sc-mentor-profile">
                  <div className="sc-avatar-wrap">
                    <img src={sess.expert.avatar} alt={sess.expert.name} className="sc-mentor-avatar" />
                    <span className="sc-verified-check"><CheckCircle2 size={13} /></span>
                  </div>
                  <div className="sc-mentor-info">
                    <h3 className="sc-mentor-name">{sess.expert.name}</h3>
                    <p className="sc-mentor-role">{sess.expert.role} at <strong>{sess.expert.company}</strong></p>
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
                    {sess.feedbackNotes || `${sess.expert.name} verified your technical proficiency in architecture design & performance tuning. This verified badge is now attached to your recruiter-facing Shine profile.`}
                  </p>
                </div>
              </div>

              <div className="sc-footer-actions sc-completed-footer">
                <button 
                  type="button"
                  className="btn-sc-view-assessment" 
                  onClick={() => navigate('post-session-view')}
                >
                  <Award size={15} /> View Full Assessment & Download Verified Badge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
