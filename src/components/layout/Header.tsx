import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Award, Bell, FileText, ChevronDown, Sparkles, 
  User, Settings, LogOut, Video, Search, ArrowUpRight
} from 'lucide-react';
import { ViewType } from '../../types';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenCreatorWizard: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCreatorWizard: _onOpenCreatorWizard,
  onSearch,
}) => {
  const { 
    sessions, 
    currentUser, 
    userProfile,
    logout,
    setIsCreatorWizardOpen,
    clearPeerpathJobContext,
    isCreatorMode,
    setIsCreatorMode,
    showToast
  } = useApp();

  const isMentor = currentUser?.role === 'mentor';
  const isEligibleForCreatorMode = Boolean(
    currentUser?.isMentorEligible || 
    userProfile?.isMentor || 
    currentUser?.role === 'mentor' || 
    userProfile?.isMentorEligible
  );

  const loggedInFirstName = (currentUser?.name || '').split(' ')[0].toLowerCase();
  const upcomingCount = isCreatorMode
    ? sessions.filter(s => s.status === 'upcoming' && (s.expert.name.toLowerCase().includes(loggedInFirstName) || s.expert.id === currentUser?.id)).length
    : sessions.filter(s => s.status === 'upcoming' && s.candidateName.toLowerCase().includes(loggedInFirstName) && !s.expert.name.toLowerCase().includes(loggedInFirstName) && s.expert.id !== currentUser?.id).length;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onNavigate('experts-view');
    }
  };

  const handleGoToMyJobs = () => {
    clearPeerpathJobContext();
    onNavigate('jobs-view');
  };

  return (
    <header className="myshine-top-header-prod myshine-navbar">
      <div className="myshine-nav-container">
        
        {/* Left Side: Shine Logo + Nav Links */}
        <div className="myshine-nav-left">
          <div 
            onClick={() => onNavigate(currentUser ? 'dashboard-view' : 'login-view')} 
            className="shine-logo-wrap" 
            style={{ cursor: 'pointer' }}
          >
            <img 
              src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
              alt="Shine Logo" 
              className="shine-official-svg-logo"
            />
          </div>

          <nav className="myshine-nav-links">
            <button 
              className={`myshine-link ${currentView === 'jobs-view' ? 'active' : ''}`} 
              onClick={handleGoToMyJobs}
            >
              <Briefcase size={15} /> My Jobs
            </button>
            
            <button className="myshine-link">
              <Award size={15} /> Services
            </button>
            
            <button className="myshine-link">
              <Bell size={15} /> Job Alerts
            </button>
            
            <button className="myshine-link">
              <FileText size={15} /> Blogs
            </button>

            {/* Dynamic Role Pill: Creator Studio (for Mentors) ⇄ Peerpath Guidance (for Candidates) */}
            {isCreatorMode ? (
              <button 
                onClick={() => onNavigate('mentor-dashboard-view')} 
                className={`myshine-creator-pill ${currentView === 'mentor-dashboard-view' ? 'active-creator-pill' : ''}`}
                title="Go to Creator & Mentor Studio Dashboard"
              >
                <Sparkles size={14} className="creator-sparkle-icon" />
                <span>Creator Studio</span>
                <span className="pill-creator-badge">⚡ LIVE</span>
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('guidance-view')} 
                className={`myshine-guidance-pill ${currentView === 'guidance-view' || currentView === 'experts-view' ? 'active-pill' : ''}`}
              >
                <Sparkles size={14} className="sparkle-icon" />
                <span>Peerpath</span>
                <span className="pill-new-badge">NEW</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Side: Search + Get App + Recruiter + User Dropdown / Login Button */}
        <div className="myshine-nav-right-prod">
          <form className="prod-nav-search-bar" onSubmit={handleSearchSubmit}>
            <Search size={14} className="prod-search-icon" />
            <input 
              type="text" 
              placeholder={isCreatorMode ? "Search Candidates or Mentees" : "Search Jobs or Mentors"} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="prod-search-input"
            />
          </form>

          <button 
            className="btn-shine-getapp"
            onClick={() => alert('Download Shine mobile app from Play Store or App Store!')}
          >
            Get App <ArrowUpRight size={13} />
          </button>

          <button 
            className="btn-shine-recruiter-icon-circle"
            title="Recruiter Portal (Candidate Search)"
            onClick={() => onNavigate('recruiter-view')}
          >
            <Briefcase size={16} />
          </button>

          {/* User Avatar Dropdown OR Login/Register CTA */}
          {currentUser ? (
            <div 
              ref={userMenuRef}
              className="user-avatar-dropdown-wrapper"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div 
                className="user-avatar-trigger-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(prev => !prev);
                }}
              >
                <div className="user-nav-avatar-circle">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="user-nav-avatar-img" 
                  />
                </div>
                <ChevronDown size={14} className="user-avatar-chevron" />
              </div>

              {isUserMenuOpen && (
                <div className="myshine-user-flyout-card">
                  <div className="flyout-user-header">
                    <strong>{currentUser.name}</strong>
                    <span>{currentUser.email || 'akash.jain@shine.com'}</span>
                  </div>

                  {/* ⚡ CREATOR / CANDIDATE MODE TOGGLE SWITCH (Inside Profile Hover Menu) */}
                  {isEligibleForCreatorMode && (
                    <div className="flyout-mode-switcher-row">
                      <div className="flyout-mode-info">
                        <span className="flyout-mode-label">
                          {isCreatorMode ? '⚡ Creator Studio' : '👤 Candidate View'}
                        </span>
                        <span className="flyout-mode-status">
                          {isCreatorMode ? 'Hosting & Payouts ON' : 'Job search & Roadmap'}
                        </span>
                      </div>
                      <button 
                        type="button"
                        role="switch"
                        aria-checked={isCreatorMode}
                        className={`flyout-mode-switch-btn ${isCreatorMode ? 'switch-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const nextMode = !isCreatorMode;
                          setIsCreatorMode(nextMode);
                          showToast(
                            nextMode ? '⚡ Switched to Creator Studio Mode' : '👤 Switched to Candidate View',
                            nextMode ? 'Opening Creator Studio dashboard & payouts.' : 'Switched to candidate profile & career roadmap.',
                            'info'
                          );
                          setIsUserMenuOpen(false);
                          if (nextMode) {
                            onNavigate('mentor-dashboard-view');
                          } else {
                            onNavigate('profile-view');
                          }
                        }}
                        title={isCreatorMode ? "Switch to Candidate Mode" : "Switch to Creator Studio"}
                      >
                        <span className="flyout-switch-knob">
                          {isCreatorMode ? '⚡' : '👤'}
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="flyout-divider"></div>

                  {isCreatorMode ? (
                    <>
                      <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('mentor-dashboard-view'); }}>
                        <Sparkles size={15} className="text-amber-500" /> <span style={{ fontWeight: 700 }}>Creator Studio Dashboard</span>
                      </a>
                      <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('profile-view'); }}>
                        <User size={15} /> My Profile
                      </a>
                    </>
                  ) : (
                    <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('profile-view'); }}>
                      <User size={15} /> My Profile
                    </a>
                  )}

                  {/* In Creator Mode: Always show Candidate Calls (Host) */}
                  {isCreatorMode && (
                    <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('sessions-view'); }}>
                      <Video size={15} className="text-purple-600" /> 
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        Candidate Calls (Host)
                      </span>
                      {upcomingCount > 0 && (
                        <span className="flyout-count-pill">{upcomingCount}</span>
                      )}
                    </a>
                  )}

                  {/* In Candidate Mode: Show 'My Mentorship Sessions' ONLY if user has actually booked sessions */}
                  {!isCreatorMode && upcomingCount > 0 && (
                    <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('sessions-view'); }}>
                      <Video size={15} className="text-purple-600" /> 
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        My Mentorship Sessions
                      </span>
                      <span className="flyout-count-pill">{upcomingCount}</span>
                    </a>
                  )}

                  {/* Only visible when in Candidate Mode */}
                  {!isCreatorMode && (
                    <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('guidance-view'); }}>
                      <Sparkles size={15} className="text-amber-500" /> Career Roadmap (Peerpath)
                    </a>
                  )}

                  {!isCreatorMode && !isMentor && (currentUser?.isMentorEligible ?? false) && (
                    <a 
                      href="#!" 
                      className="flyout-item flyout-item-mentor-recruit" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setIsUserMenuOpen(false); 
                        setIsCreatorWizardOpen(true); 
                      }}
                    >
                      <Sparkles size={15} className="text-amber-500" /> 
                      <span style={{ fontWeight: 700, color: '#92400E' }}>Become a Mentor (0% Fee)</span>
                      <span className="flyout-gold-tag">0% Fee</span>
                    </a>
                  )}

                  <div className="flyout-divider"></div>

                  <a href="#!" className="flyout-item" onClick={(e) => e.preventDefault()}>
                    <Settings size={14} /> Account Settings
                  </a>
                  
                  <a 
                    href="#!" 
                    className="flyout-item text-danger" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setIsUserMenuOpen(false); 
                      logout(); 
                    }}
                  >
                    <LogOut size={14} /> Sign out
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button 
              type="button"
              className="btn-header-login-gold"
              onClick={() => onNavigate('login-view')}
            >
              <User size={14} />
              <span>Login / Register</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
