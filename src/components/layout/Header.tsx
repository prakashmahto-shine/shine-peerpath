import React, { useState } from 'react';
import { ShoppingCart, Bell, ChevronDown, Sparkles, User, ShoppingBag, Settings, LogOut, Video } from 'lucide-react';
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
  onSearch: _onSearch,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isProfileNavOpen, setIsProfileNavOpen] = useState<boolean>(false);

  return (
    <header className="myshine-navbar" id="globalNavbar">
      <div className="myshine-nav-container">
        
        <div className="myshine-nav-left">
          <div onClick={() => onNavigate('profile-view')} className="shine-logo-wrap" style={{ cursor: 'pointer' }}>
            <img 
              src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
              alt="Shine Logo" 
              className="shine-official-svg-logo"
              style={{ height: '32px', display: 'block' }}
            />
          </div>

          <nav className="myshine-nav-links">
            <button className={`myshine-link ${currentView === 'profile-view' ? 'active' : ''}`} onClick={() => onNavigate('profile-view')}>
              My Shine
            </button>
            
            <button className="myshine-link dropdown">
              Search Jobs <ChevronDown size={13} />
            </button>
            
            <button className="myshine-link">
              Jobs for You
            </button>
            
            <button className="myshine-link">
              Mailbox
            </button>
            
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setIsProfileNavOpen(true)}
              onMouseLeave={() => setIsProfileNavOpen(false)}
            >
              <button className="myshine-link dropdown" onClick={() => onNavigate('profile-view')}>
                Profile <ChevronDown size={13} />
              </button>
              {isProfileNavOpen && (
                <div className="myshine-flyout-menu">
                  <a href="#!" onClick={() => { setIsProfileNavOpen(false); onNavigate('profile-view'); }}>My Profile</a>
                  <a href="#!">My Applications</a>
                  <a href="#!">Saved Jobs</a>
                  <a href="#!" onClick={() => { setIsProfileNavOpen(false); onNavigate('sessions-view'); }} style={{ color: '#7C3AED', fontWeight: 700 }}>
                    ✨ My Mentorship Sessions
                  </a>
                </div>
              )}
            </div>

            <button className="myshine-link">
              My Job Alerts
            </button>
            
            <button className="myshine-link dropdown">
              Services <ChevronDown size={13} />
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

        <div className="myshine-nav-right">
          
          <div className="candidate-count-badge" title="Profile Viewers">
            <span className="green-circle-num">12</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>

          <button className="nav-icon-link" title="Cart">
            <ShoppingCart size={18} />
          </button>

          <button className="nav-icon-link" title="Notifications">
            <Bell size={18} />
          </button>

          <div 
            className="user-dropdown-wrapper"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <div className="user-dropdown-btn">
              <span>Hi, Prakash</span>
              <ChevronDown size={14} />
            </div>

            {isUserMenuOpen && (
              <div className="myshine-user-flyout-card">
                <a href="#!" className="flyout-item" onClick={() => { setIsUserMenuOpen(false); onNavigate('profile-view'); }}>
                  <User size={14} /> My profile
                </a>
                
                <div className="flyout-item-parent">
                  <span className="flyout-parent-title"><ShoppingBag size={14} /> My orders</span>
                  <div className="flyout-sub-list">
                    <a href="#!">- Courses</a>
                    <a href="#!">- Job Assistance Services</a>
                    <a href="#!" onClick={() => { setIsUserMenuOpen(false); onNavigate('sessions-view'); }} style={{ color: '#7C3AED', fontWeight: 700 }}>
                      <Video size={12} /> - My Sessions (Peerpath)
                    </a>
                  </div>
                </div>

                <div className="flyout-divider"></div>

                <a href="#!" className="flyout-item">
                  <Settings size={14} /> Account Settings
                </a>
                
                <a href="#!" className="flyout-item text-danger">
                  <LogOut size={14} /> Sign out
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
