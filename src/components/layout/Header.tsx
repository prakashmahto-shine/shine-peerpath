import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Award, Bell, FileText, ChevronDown, Sparkles, 
  User, ShoppingBag, Settings, LogOut, Video, Mail, Search, ArrowUpRight 
} from 'lucide-react';
import { ViewType } from '../../types';

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('experts-view');
  };

  return (
    <header className="myshine-navbar" id="globalNavbar">
      <div className="myshine-nav-container">
        
        <div className="myshine-nav-left">
          <div onClick={() => onNavigate('dashboard-view')} className="shine-logo-wrap" style={{ cursor: 'pointer' }}>
            <img 
              src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
              alt="Shine Logo" 
              className="shine-official-svg-logo"
              style={{ height: '32px', display: 'block' }}
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

        <div className="myshine-nav-right-prod">
          
          <form className="prod-nav-search-bar" onSubmit={handleSearchSubmit}>
            <Search size={14} className="prod-search-icon" />
            <input 
              type="text" 
              placeholder="Search Jobs" 
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
                  src="/avatars/prakash.jpg" 
                  alt="Prakash Kumar" 
                  className="user-nav-avatar-img" 
                />
              </div>
              <ChevronDown size={14} className="user-avatar-chevron" />
            </div>

            {isUserMenuOpen && (
              <div className="myshine-user-flyout-card">
                <div className="flyout-user-header">
                  <strong>Prakash Mahto</strong>
                  <span>Senior Frontend Developer</span>
                </div>

                <div className="flyout-divider"></div>

                <a href="#!" className="flyout-item" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('profile-view'); }}>
                  <User size={14} /> My profile
                </a>
                
                <div className="flyout-item-parent">
                  <span className="flyout-parent-title"><ShoppingBag size={14} /> My orders</span>
                  <div className="flyout-sub-list">
                    <a href="#!" onClick={(e) => e.preventDefault()}>- Courses</a>
                    <a href="#!" onClick={(e) => e.preventDefault()}>- Job Assistance Services</a>
                    <a href="#!" onClick={(e) => { e.preventDefault(); setIsUserMenuOpen(false); onNavigate('sessions-view'); }} style={{ color: '#7C3AED', fontWeight: 700 }}>
                      <Video size={12} /> - My Sessions (Peerpath)
                    </a>
                  </div>
                </div>

                <div className="flyout-divider"></div>

                <a href="#!" className="flyout-item" onClick={(e) => e.preventDefault()}>
                  <Settings size={14} /> Account Settings
                </a>
                
                <a href="#!" className="flyout-item text-danger" onClick={(e) => e.preventDefault()}>
                  <LogOut size={14} /> Sign out
                </a>
              </div>
            )}
          </div>

        </div>

      </div>

      <div className="shine-floating-peerpath-widget">
        <button 
          className="floating-peerpath-btn" 
          onClick={() => onNavigate('guidance-view')}
          title="Shine Peerpath — 1:1 Trajectory Mentorship"
        >
          <div className="peerpath-widget-icon-wrap">
            <Sparkles size={18} />
            <span className="widget-badge-count">NEW</span>
          </div>
          <span className="widget-text">Peerpath</span>
        </button>
      </div>
    </header>
  );
};
