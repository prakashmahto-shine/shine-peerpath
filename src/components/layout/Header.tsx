import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Award, Bell, FileText, ChevronDown, Sparkles, 
  User, Settings, LogOut, Video, Search, ArrowUpRight, ShieldCheck,
  RotateCcw, Users
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
    logout,
    switchUser,
    resetDemoData,
    setIsCreatorWizardOpen
  } = useApp();

  const isMentor = currentUser?.role === 'mentor';
  const loggedInFirstName = (currentUser?.name || '').split(' ')[0].toLowerCase();
  const upcomingCount = isMentor
    ? sessions.filter(s => s.status === 'upcoming' && (s.expert.name.toLowerCase().includes(loggedInFirstName) || s.expert.id === currentUser?.id)).length
    : sessions.filter(s => s.status === 'upcoming' && s.candidateName.toLowerCase().includes(loggedInFirstName)).length;
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

  return (
    <header className="myshine-top-header-prod">
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
              className={`myshine-link ${currentView === 'dashboard-view' ? 'active' : ''}`} 
              onClick={() => onNavigate('dashboard-view')}
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

            <button 
              onClick={() => onNavigate('guidance-view')} 
              className={`myshine-guidance-pill ${currentView === 'guidance-view' || currentView === 'experts-view' ? 'active-pill' : ''}`}
            >
              <Sparkles size={14} className="sparkle-icon" />
              <span>Peerpath</span>
              <span className="pill-new-badge">NEW</span>
            </button>
          </nav>
        </div>

        {/* Right Side: Search + Get App + Recruiter + User Dropdown / Login Button */}
        <div className="myshine-nav-right-prod">
          <form className="prod-nav-search-bar" onSubmit={handleSearchSubmit}>
            <Search size={14} className="prod-search-icon" />
            <input 
              type="text" 
              placeholder="Search Jobs or Mentors" 
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
                    <div className="flyout-name-badge-row">
                      <strong>{currentUser.name}</strong>
                      <span className={`flyout-role-badge ${isMentor ? 'mentor-badge' : 'cand-badge'}`}>
                        {isMentor ? 'MENTOR' : 'CANDIDATE'}
                      </span>
                    </div>
                    <span>{currentUser.headline.split('|')[0] || currentUser.headline}</span>
                  </div>

                  <div className="flyout-divider"></div>

                  <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('profile-view'); }}>
                    <User size={15} /> My Profile
                  </a>

                  <a href="#!" className="flyout-item flyout-item-highlight" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('sessions-view'); }}>
                    <Video size={15} className="text-purple-600" /> 
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                      {isMentor ? 'Candidate Calls (Host)' : 'My Mentorship Sessions'}
                    </span>
                    {upcomingCount > 0 && (
                      <span className="flyout-count-pill">{upcomingCount}</span>
                    )}
                  </a>

                  {!isMentor && (currentUser?.isMentorEligible ?? false) && (
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

                  <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('guidance-view'); }}>
                    <Sparkles size={15} className="text-amber-500" /> Career Roadmap (Peerpath)
                  </a>

                  {/* Persona Switcher Section */}
                  <div className="flyout-divider"></div>
                  <div className="flyout-persona-switcher-section">
                    <span className="fps-title">⚡ SWITCH PERSONA:</span>
                    <div className="fps-grid">
                      <button 
                        type="button" 
                        className={`fps-btn ${currentUser?.username === 'prakash' ? 'active' : ''}`}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          switchUser('prakash');
                        }}
                      >
                        <User size={12} className="text-blue-600" /> Prakash (Candidate)
                      </button>

                      <button 
                        type="button" 
                        className={`fps-btn ${currentUser?.username === 'nisha' ? 'active' : ''}`}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          switchUser('nisha');
                        }}
                      >
                        <Sparkles size={12} className="text-amber-500" /> Nisha (Pitch Lead)
                      </button>

                      <button 
                        type="button" 
                        className={`fps-btn ${currentUser?.username === 'akash' ? 'active' : ''}`}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          switchUser('akash');
                        }}
                      >
                        <ShieldCheck size={12} className="text-purple-600" /> Akash (Mentor)
                      </button>
                    </div>

                    <button 
                      type="button" 
                      className="btn-reset-demo-flyout"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        resetDemoData();
                      }}
                    >
                      <RotateCcw size={12} /> Reset All 3 Persona Data
                    </button>
                  </div>

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
