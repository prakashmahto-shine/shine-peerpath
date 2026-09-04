import React, { useState } from 'react';
import { X, Lock, User, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, switchUser, currentUser } = useApp();
  
  const [username, setUsername] = useState<string>('prakash');
  const [password, setPassword] = useState<string>('shine@123');
  const [selectedRoleTab, setSelectedRoleTab] = useState<'candidate' | 'mentor'>('candidate');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const handleQuickLogin = (role: 'candidate' | 'mentor') => {
    if (role === 'candidate') {
      setUsername('prakash');
      setPassword('shine@123');
      setSelectedRoleTab('candidate');
      switchUser('prakash');
      setIsLoginModalOpen(false);
    } else {
      setUsername('akash');
      setPassword('shine@123');
      setSelectedRoleTab('mentor');
      switchUser('akash');
      setIsLoginModalOpen(false);
    }
  };

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card login-modal-card">
        <button 
          className="modal-close-btn" 
          onClick={() => setIsLoginModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Top Header */}
        <div className="login-modal-header">
          <div className="login-badge-pill">
            <Sparkles size={13} className="text-amber-500" />
            <span>Shine Peerpath • Dual Role Access</span>
          </div>
          <h2 className="login-modal-title">Sign In / Switch Role</h2>
          <p className="login-modal-subtitle">
            Choose whether you want to log in as a <strong>Candidate</strong> taking sessions or a <strong>Mentor</strong> hosting them.
          </p>
        </div>

        {/* Quick 1-Click Role Selector Cards */}
        <div className="login-role-cards-grid">
          
          {/* Card 1: Candidate (Prakash) */}
          <div 
            className={`login-role-card ${selectedRoleTab === 'candidate' ? 'active-role' : ''}`}
            onClick={() => handleQuickLogin('candidate')}
          >
            <div className="role-card-top">
              <div className="role-avatar-wrap">
                <img src="/avatars/prakash.jpg" alt="Prakash Mahto" className="role-avatar-img" />
                <span className="role-chip-cand">Candidate</span>
              </div>
              {currentUser?.username === 'prakash' && (
                <span className="role-current-active"><CheckCircle2 size={13} /> Active Now</span>
              )}
            </div>
            
            <div className="role-card-info">
              <h4>Prakash Mahto</h4>
              <p>Senior Frontend Developer</p>
              <span className="role-cred-tag">ID: <strong>prakash</strong> • Pass: <strong>shine@123</strong></span>
            </div>

            <button type="button" className="btn-role-quick-select">
              <span>Sign In as Candidate</span> <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: Mentor (Akash) */}
          <div 
            className={`login-role-card ${selectedRoleTab === 'mentor' ? 'active-role' : ''}`}
            onClick={() => handleQuickLogin('mentor')}
          >
            <div className="role-card-top">
              <div className="role-avatar-wrap">
                <img src="/avatars/akash.jpg" alt="Akash Jain" className="role-avatar-img" />
                <span className="role-chip-mentor"><ShieldCheck size={11} /> Mentor</span>
              </div>
              {currentUser?.username === 'akash' && (
                <span className="role-current-active"><CheckCircle2 size={13} /> Active Now</span>
              )}
            </div>
            
            <div className="role-card-info">
              <h4>Akash Jain</h4>
              <p>Lead Product Manager @ Shine</p>
              <span className="role-cred-tag">ID: <strong>akash</strong> • Pass: <strong>shine@123</strong></span>
            </div>

            <button type="button" className="btn-role-quick-select btn-mentor-select">
              <span>Sign In as Mentor</span> <ArrowRight size={13} />
            </button>
          </div>

        </div>

        {/* Manual Login Form */}
        <div className="login-divider-row">
          <span>Or sign in manually</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form-stack">
          <div className="login-field-group">
            <label className="login-label">
              <User size={14} /> Username / ID (prakash or akash)
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter prakash or akash"
              className="login-input"
              required
            />
          </div>

          <div className="login-field-group">
            <label className="login-label">
              <Lock size={14} /> Password (shine@123)
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter shine@123"
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="btn-shine-login-submit">
            Sign In with Credentials
          </button>
        </form>

      </div>
    </div>
  );
};
