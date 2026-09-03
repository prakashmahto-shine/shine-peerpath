import React, { useState } from 'react';
import { User, FileText, Bookmark, Video, Settings, Plus, Calendar, FileCheck, CheckCircle2, Award, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MySessionsView: React.FC = () => {
  const { 
    sessions, 
    userProfile, 
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
    <div className="content-wrapper sessions-dashboard-grid">
      <aside className="sessions-sidebar">
        <div className="sb-user-card">
          <img src="/avatars/prakash.jpg" alt={userProfile.name} />
          <div>
            <h4>{userProfile.name}</h4>
            <span>{userProfile.headline.split('|')[0] || 'Candidate'}</span>
          </div>
        </div>

        <nav className="sb-nav-list">
          <button onClick={() => navigate('profile-view')} className="sb-link"><User size={16} /> My Profile</button>
          <button className="sb-link"><FileText size={16} /> My Applications</button>
          <button className="sb-link"><Bookmark size={16} /> My Bookmarks</button>
          <button className="sb-link active"><Video size={16} /> My Sessions <span className="badge-count">{upcomingSessions.length}</span></button>
          <button className="sb-link"><Settings size={16} /> Account Settings</button>
        </nav>
      </aside>

      <div className="sessions-content-main">
        <div className="sessions-header-flex">
          <div>
            <h1 className="sessions-main-title">My Mentorship Sessions</h1>
            <p className="sessions-subtitle">Manage upcoming 1:1 guidance calls and view post-session skill badges.</p>
          </div>
          <button className="btn-shine-gold" onClick={() => navigate('experts-view')}>
            <Plus size={16} /> Book Another Expert
          </button>
        </div>

        <div className="sessions-tab-row">
          <button className={`s-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
            Upcoming ({upcomingSessions.length})
          </button>
          <button className={`s-tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
            Completed ({completedSessions.length})
          </button>
        </div>

        {activeTab === 'upcoming' && (
          <div className="sessions-list-stack">
            {upcomingSessions.length === 0 ? (
              <div className="empty-sessions-box">
                <AlertCircle size={32} color="#94A3B8" />
                <h3>No upcoming sessions scheduled</h3>
                <p>Explore verified industry leaders and book your 1:1 trajectory guidance call.</p>
                <button className="btn-shine-gold" onClick={() => navigate('experts-view')}>
                  <Plus size={16} /> Explore Experts
                </button>
              </div>
            ) : (
              upcomingSessions.map((sess) => (
                <div key={sess.id} className="session-live-card">
                  <div className="s-card-top">
                    <div className="s-mentor-meta">
                      <img src={sess.expert.avatar} alt={sess.expert.name} className="s-mentor-avatar" />
                      <div>
                        <div className="name-status-row">
                          <h3 className="s-mentor-name">{sess.expert.name}</h3>
                          <span className="status-live-chip"><span className="pulse-dot"></span> Confirmed & Ready</span>
                        </div>
                        <p className="s-mentor-headline">{sess.expert.role} at {sess.expert.company}</p>
                      </div>
                    </div>
                    <span className="session-type-badge"><Video size={14} /> 1:1 Guidance Session</span>
                  </div>

                  <div className="s-card-middle">
                    <div className="s-info-item">
                      <Calendar size={15} />
                      <span>{sess.date}</span>
                    </div>
                    <div className="s-info-item">
                      <Clock size={15} />
                      <span>{sess.timeSlot}</span>
                    </div>
                    <div className="s-info-item">
                      <FileCheck size={15} />
                      <span>CV Gap Report Pre-Loaded for Mentor</span>
                    </div>
                  </div>

                  {reschedulingId === sess.id && (
                    <div className="reschedule-drawer-panel">
                      <h4>Select New Date & Time for {sess.expert.name}</h4>
                      <div className="reschedule-inputs-row">
                        <select value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="select-pill">
                          <option value="Tomorrow, 5 Sep">Tomorrow, 5 Sep</option>
                          <option value="Sat, 6 Sep">Sat, 6 Sep</option>
                          <option value="Mon, 8 Sep">Mon, 8 Sep</option>
                          <option value="Tue, 9 Sep">Tue, 9 Sep</option>
                        </select>
                        <select value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="select-pill">
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                          <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
                          <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                        </select>
                        <button className="btn-shine-gold-sm" onClick={() => handleConfirmReschedule(sess.id)}>Save Reschedule</button>
                        <button className="btn-ghost-sm" onClick={() => setReschedulingId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  <div className="s-card-bottom-actions">
                    <button className="btn-ghost-sm" onClick={() => setReschedulingId(sess.id)}>Reschedule</button>
                    <button className="btn-ghost-sm text-danger" onClick={() => cancelSession(sess.id)}>Cancel Booking</button>
                    <button className="btn-join-call" onClick={() => handleJoinCall(sess)}>
                      <Video size={16} /> Join Session (Room Open)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="sessions-list-stack">
            {completedSessions.map((sess) => (
              <div key={sess.id} className="session-completed-card">
                <div className="s-card-top">
                  <div className="s-mentor-meta">
                    <img src={sess.expert.avatar} alt={sess.expert.name} className="s-mentor-avatar" />
                    <div>
                      <h3 className="s-mentor-name">{sess.expert.name}</h3>
                      <p className="s-mentor-headline">{sess.expert.role} at {sess.expert.company}</p>
                    </div>
                  </div>
                  <span className="badge-completed"><CheckCircle2 size={14} /> Completed on {sess.date}</span>
                </div>
                <div className="s-outcome-box">
                  <Award size={24} className="outcome-icon" />
                  <div>
                    <strong>Outcome: "{sess.badgeAwarded || 'Skill Verified'}" Badge Awarded</strong>
                    <p>{sess.feedbackNotes || `${sess.expert.name} verified your technical proficiency. Badge is active on your Shine profile.`}</p>
                  </div>
                </div>
                <button className="btn-outline-dark-sm" onClick={() => navigate('post-session-view')}>
                  View Assessment & Summary
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
