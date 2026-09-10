import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Award, Bell, FileText, ChevronDown, Sparkles, 
  User, Settings, LogOut, Video, Search, ArrowUpRight, Film, Clock, CreditCard,
  Compass, TrendingUp, ShieldCheck
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
    navigateToCreatorStudio,
    showToast
  } = useApp();

  // Determine whether current view is in Peerpath Mentorship platform or Shine Jobs portal
  const isPeerpathView = [
    'guidance-view',
    'experts-view',
    'expert-profile-view',
    'mentor-dashboard-view',
    'sessions-view',
    'payment-view',
    'confirmed-view',
    'live-call-view',
    'post-session-view',
    'recruiter-view'
  ].includes(currentView);

  const isAlreadyMentor = Boolean(
    currentUser?.role === 'mentor' || 
    userProfile?.isMentor || 
    currentUser?.id === 'akash' ||
    (currentUser?.username && currentUser.username.toLowerCase() === 'akash')
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
    <header className={`myshine-top-header-prod myshine-navbar ${isPeerpathView ? 'peerpath-ecosystem-header' : 'shine-jobs-header'}`}>
      <div className="myshine-nav-container">
        
        {/* Left Side: Brand Logo + Contextual Navigation Links */}
        <div className="myshine-nav-left">
          {isPeerpathView ? (
            /* Standalone Peerpath Brand Identity (Zomato / Blinkit model) */
            <div 
              onClick={() => onNavigate(isAlreadyMentor && isCreatorMode ? 'mentor-dashboard-view' : 'guidance-view')} 
              className="peerpath-brand-logo-wrap" 
              style={{ cursor: 'pointer' }}
              title="Peerpath by Shine • Verified 1:1 Mentorship"
            >
              <div className="peerpath-brand-symbol">
                <Compass size={20} className="peerpath-symbol-icon" />
              </div>
              <div className="peerpath-brand-text-col">
                <span className="peerpath-brand-title">PEERPATH</span>
                <span className="peerpath-brand-sub">by <strong className="shine-mark">shine.com</strong></span>
              </div>
            </div>
          ) : (
            /* Shine Official Job Board Logo */
            <div 
              onClick={() => onNavigate(currentUser ? 'dashboard-view' : 'login-view')} 
              className="shine-logo-wrap" 
              style={{ cursor: 'pointer' }}
              title="Shine.com Job Search"
            >
              <img 
                src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
                alt="Shine Logo" 
                className="shine-official-svg-logo"
              />
            </div>
          )}

          {/* Contextual Navigation Links */}
          <nav className="myshine-nav-links">
            {isPeerpathView ? (
              /* Peerpath Platform Navigation */
              isAlreadyMentor && isCreatorMode ? (
                <>
                  <button 
                    className={`myshine-link ${currentView === 'mentor-dashboard-view' ? 'active' : ''}`}
                    onClick={() => onNavigate('mentor-dashboard-view')} 
                    title="Go to Mentor & Studio Dashboard"
                  >
                    <Sparkles size={15} /> Studio Dashboard
                    <span className="pill-live-red-badge">LIVE</span>
                  </button>

                  <button 
                    className={`myshine-link ${currentView === 'sessions-view' ? 'active' : ''}`} 
                    onClick={() => onNavigate('sessions-view')}
                  >
                    <Video size={15} /> Candidate Calls
                    {upcomingCount > 0 && <span className="flyout-count-pill" style={{ marginLeft: '4px' }}>{upcomingCount}</span>}
                  </button>

                  <button 
                    className={`myshine-link ${currentView === 'experts-view' ? 'active' : ''}`} 
                    onClick={() => onNavigate('experts-view')}
                    title="Browse All Mentors"
                  >
                    <Award size={15} /> Mentors Directory
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`myshine-link ${currentView === 'experts-view' ? 'active' : ''}`} 
                    onClick={() => onNavigate('experts-view')}
                    title="Explore 500+ Mentors Directory"
                  >
                    <Compass size={15} /> Find Mentors
                  </button>
                  
                  <button 
                    className={`myshine-link ${currentView === 'sessions-view' ? 'active' : ''}`} 
                    onClick={() => onNavigate('sessions-view')}
                  >
                    <Video size={15} /> My Bookings
                    {upcomingCount > 0 && <span className="flyout-count-pill" style={{ marginLeft: '4px' }}>{upcomingCount}</span>}
                  </button>
                </>
              )
            ) : (
              /* Shine Jobs Portal Navigation */
              <>
                <button 
                  className={`myshine-link ${currentView === 'jobs-view' ? 'active' : ''}`} 
                  onClick={handleGoToMyJobs}
                >
                  <Briefcase size={15} /> My Jobs
                </button>
                
                <button className="myshine-link">
                  <Bell size={15} /> Job Alerts
                </button>
                
                <button className="myshine-link">
                  <FileText size={15} /> Blogs & Prep
                </button>

                <button 
                  className={`myshine-link ${currentView === 'profile-view' ? 'active' : ''}`} 
                  onClick={() => onNavigate('profile-view')}
                >
                  <User size={15} /> My Profile
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Search (Shine Jobs) + Creator Toggle + User Dropdown */}
        <div className="myshine-nav-right-prod">
          {!isPeerpathView && (
            <form className="prod-nav-search-bar" onSubmit={handleSearchSubmit}>
              <Search size={14} className="prod-search-icon" />
              <input 
                type="text" 
                placeholder="Search jobs, skills, companies..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="prod-search-input"
              />
            </form>
          )}

          {/* ⚡ DIRECT NAVBAR CREATOR STUDIO TOGGLE SWITCH (For users with Mentor Access, e.g. Akash & Nisha) */}
          {currentUser && isAlreadyMentor && isPeerpathView && (
            <div
              className={`navbar-creator-toggle-control ${isCreatorMode ? 'is-on' : 'is-off'}`}
              onClick={() => {
                const nextMode = !isCreatorMode;
                setIsCreatorMode(nextMode);
                showToast(
                  nextMode ? '⚡ Creator Studio Mode Activated' : '👤 Switched to Candidate View',
                  nextMode ? 'Opening Creator Studio dashboard & payouts.' : 'Switched to candidate profile & career roadmap.',
                  'info'
                );
                if (nextMode) {
                  onNavigate('mentor-dashboard-view');
                } else {
                  onNavigate('guidance-view');
                }
              }}
              role="switch"
              aria-checked={isCreatorMode}
              title={isCreatorMode ? "Creator Studio is ON (Click to turn OFF)" : "Creator Studio is OFF (Click to turn ON)"}
            >
              <div className="nct-text-wrap">
                <span className="nct-icon">⚡</span>
                <span className="nct-label">Creator Studio</span>
              </div>
              <div className={`nct-toggle-track ${isCreatorMode ? 'track-on' : 'track-off'}`}>
                <div className="nct-toggle-knob" />
              </div>
            </div>
          )}

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
                    <span>{currentUser.email || (userProfile?.email || 'prakash.mahto@gmail.com')}</span>
                  </div>

                  <div className="flyout-divider"></div>

                  {isAlreadyMentor && isCreatorMode ? (
                    <>
                      <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); navigateToCreatorStudio('bookings'); }}>
                        <Sparkles size={15} className="text-amber-500" /> <span style={{ fontWeight: 700 }}>Creator Studio Hub</span>
                      </a>
                      <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); navigateToCreatorStudio('teaser'); }}>
                        <Film size={15} className="text-purple-600" /> Teaser & Profile Listing
                      </a>
                      <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); navigateToCreatorStudio('availability'); }}>
                        <Clock size={15} className="text-blue-600" /> Manage Availability & Slots
                      </a>
                      <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); navigateToCreatorStudio('pricing'); }}>
                        <CreditCard size={15} className="text-emerald-600" /> Session Rates & Payouts
                      </a>
                      <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('sessions-view'); }}>
                        <Video size={15} className="text-purple-600" /> 
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          Candidate Calls (Host)
                        </span>
                        {upcomingCount > 0 && (
                          <span className="flyout-count-pill">{upcomingCount}</span>
                        )}
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('profile-view'); }}>
                        <User size={15} /> My Profile
                      </a>
                      <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('guidance-view'); }}>
                        <Sparkles size={15} className="text-purple-600" /> Career Roadmap & Goal
                      </a>
                      <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('sessions-view'); }}>
                        <Video size={15} className="text-purple-600" /> 
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          My 1:1 Bookings
                        </span>
                        {upcomingCount > 0 && (
                          <span className="flyout-count-pill">{upcomingCount}</span>
                        )}
                      </a>
                    </>
                  )}

                  {!isAlreadyMentor && (currentUser?.isMentorEligible || userProfile?.isMentorEligible) && (
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

