import React, { useState } from 'react';
import { User, FileText, Bookmark, Video, Settings, Plus, Calendar, FileCheck, CheckCircle2, Award } from 'lucide-react';
import { Expert, ViewType } from '../../types';

interface MySessionsViewProps {
  expert: Expert;
  bookingDate: string;
  bookingTime: string;
  onNavigate: (view: ViewType) => void;
  onJoinCall: () => void;
}

export const MySessionsView: React.FC<MySessionsViewProps> = ({
  expert,
  bookingDate,
  bookingTime,
  onNavigate,
  onJoinCall,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  return (
    <div className="content-wrapper sessions-dashboard-grid">
      <aside className="sessions-sidebar">
        <div className="sb-user-card">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Prakash" />
          <div>
            <h4>Prakash Kumar</h4>
            <span>Candidate</span>
          </div>
        </div>

        <nav className="sb-nav-list">
          <button onClick={() => onNavigate('profile-view')} className="sb-link"><User size={16} /> My Profile</button>
          <button className="sb-link"><FileText size={16} /> My Applications</button>
          <button className="sb-link"><Bookmark size={16} /> My Bookmarks</button>
          <button className="sb-link active"><Video size={16} /> My Sessions <span className="badge-count">1</span></button>
          <button className="sb-link"><Settings size={16} /> Account Settings</button>
        </nav>
      </aside>

      <div className="sessions-content-main">
        <div className="sessions-header-flex">
          <div>
            <h1 className="sessions-main-title">My Mentorship Sessions</h1>
            <p className="sessions-subtitle">Manage upcoming 1:1 guidance calls and view post-session skill badges.</p>
          </div>
          <button className="btn-shine-gold" onClick={() => onNavigate('experts-view')}>
            <Plus size={16} /> Book Another Expert
          </button>
        </div>

        <div className="sessions-tab-row">
          <button className={`s-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
            Upcoming (1)
          </button>
          <button className={`s-tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
            Completed (2)
          </button>
        </div>

        {activeTab === 'upcoming' && (
          <div className="session-live-card">
            <div className="s-card-top">
              <div className="s-mentor-meta">
                <img src={expert.avatar} alt={expert.name} className="s-mentor-avatar" />
                <div>
                  <div className="name-status-row">
                    <h3 className="s-mentor-name">{expert.name}</h3>
                    <span className="status-live-chip"><span className="pulse-dot"></span> Starting Now</span>
                  </div>
                  <p className="s-mentor-headline">{expert.role} at {expert.company}</p>
                </div>
              </div>
              <span className="session-type-badge"><Video size={14} /> 1:1 Guidance Session</span>
            </div>

            <div className="s-card-middle">
              <div className="s-info-item">
                <Calendar size={15} />
                <span>{bookingDate}, {bookingTime}</span>
              </div>
              <div className="s-info-item">
                <FileCheck size={15} />
                <span>CV Gap Report Pre-Loaded for Mentor</span>
              </div>
            </div>

            <div className="s-card-bottom-actions">
              <button className="btn-ghost-sm" onClick={() => alert('Reschedule request sent to mentor!')}>Reschedule</button>
              <button className="btn-ghost-sm text-danger" onClick={() => alert('Session cancellation requested.')}>Cancel</button>
              <button className="btn-join-call" onClick={onJoinCall}>
                <Video size={16} /> Join Session (Room Open)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="session-completed-card">
            <div className="s-card-top">
              <div className="s-mentor-meta">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Ishita" className="s-mentor-avatar" />
                <div>
                  <h3 className="s-mentor-name">Ishita Sharma</h3>
                  <p className="s-mentor-headline">Senior Data Scientist at Swiggy</p>
                </div>
              </div>
              <span className="badge-completed"><CheckCircle2 size={14} /> Completed on 18 Aug</span>
            </div>
            <div className="s-outcome-box">
              <Award size={24} className="outcome-icon" />
              <div>
                <strong>Outcome: "ML Production Ready" Badge Awarded</strong>
                <p>Mentor verified your proficiency in PyTorch & Distributed Systems. Badge is active on your Shine profile.</p>
              </div>
            </div>
            <button className="btn-outline-dark-sm" onClick={() => onNavigate('post-session-view')}>
              View Assessment & Summary
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
