import React from 'react';
import { Sparkles } from 'lucide-react';
import { ViewType } from '../../types';

interface DemoBarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenCreatorWizard: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({
  currentView,
  onNavigate,
  onOpenCreatorWizard,
}) => {
  return (
    <div id="demo-bar" className="demo-controller-bar">
      <div className="demo-bar-left">
        <span className="demo-tag"><Sparkles size={12} /> HACKATHON LIVE DEMO</span>
        <span className="demo-title">Peerpath by Shine: <strong>Trajectory Mentorship</strong></span>
      </div>
      <div className="demo-nav-pills" id="demoNavPills">
        <button 
          className={`demo-pill ${currentView === 'profile-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('profile-view')}
        >
          1. Profile & Creator CTA
        </button>
        <button 
          className={`demo-pill ${currentView === 'guidance-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('guidance-view')}
        >
          2. Career Guidance (Gaps)
        </button>
        <button 
          className={`demo-pill ${currentView === 'experts-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('experts-view')}
        >
          3. Experts & Video Gallery
        </button>
        <button 
          className={`demo-pill ${currentView === 'expert-profile-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('expert-profile-view')}
        >
          4. Expert Profile & Teaser
        </button>
        <button 
          className={`demo-pill ${currentView === 'payment-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('payment-view')}
        >
          5. Checkout & Pay
        </button>
        <button 
          className={`demo-pill ${currentView === 'sessions-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('sessions-view')}
        >
          6. My Sessions
        </button>
        <button 
          className={`demo-pill ${currentView === 'live-call-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('live-call-view')}
        >
          7. Live 1:1 Video Call
        </button>
        <button 
          className={`demo-pill ${currentView === 'post-session-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('post-session-view')}
        >
          8. Outcome & Badge
        </button>
        <button 
          className="demo-pill highlight" 
          onClick={onOpenCreatorWizard}
        >
          9. Creator Mode Wizard
        </button>
        <button 
          className={`demo-pill recruiter ${currentView === 'recruiter-view' ? 'active' : ''}`} 
          onClick={() => onNavigate('recruiter-view')}
        >
          10. Recruiter View (The Moat)
        </button>
      </div>
    </div>
  );
};
