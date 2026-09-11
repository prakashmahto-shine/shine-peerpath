import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, User, Sparkles, RotateCcw, MessageSquare, Mail, ArrowRight, Compass, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ShowcaseMentor {
  id: string;
  name: string;
  badge: string;
  role: string;
  company: string;
  prevCompany: string;
  transition: string;
  beforeLevel: string;
  afterLevel: string;
  growth: string;
  rating: string;
  calls: string;
  avatar: string;
  tags: string[];
  quote: string;
}

const SHOWCASE_MENTORS: ShowcaseMentor[] = [
  {
    id: 'saheli',
    name: 'Saheli Kanjilal',
    badge: 'Verified Lead',
    role: 'Staff Backend & Cloud Engineer',
    company: 'Razorpay',
    prevCompany: 'Ex-TCS',
    transition: 'Services ➔ Tier-1 Product',
    beforeLevel: 'Associate SDE (L2)',
    afterLevel: 'Staff Engineer (L5)',
    growth: '3-Level Career Leap',
    rating: '4.95',
    calls: '140+ Calls',
    avatar: '/avatars/saheli.jpg',
    tags: ['⚡ System Design', '⚙️ Distributed Systems', '💼 300K+ Recruiters'],
    quote: 'Targeted system design mocks & architecture reviews helped me crack the Razorpay Staff Engineer bar.'
  },
  {
    id: 'nisha',
    name: 'Nisha Sen',
    badge: 'Staff Lead',
    role: 'Engineering Director & Tech Lead',
    company: 'Flipkart',
    prevCompany: 'Ex-Infosys',
    transition: 'WITCH SDE II ➔ Tech Lead',
    beforeLevel: 'Senior SDE (L2)',
    afterLevel: 'Tech Director (L6)',
    growth: 'Enterprise ➔ Product Lead',
    rating: '4.98',
    calls: '210+ Calls',
    avatar: '/avatars/nisha.jpg',
    tags: ['🚀 High-Scale Java', '🤖 GenAI Workflows', '🎯 Priority Shortlist'],
    quote: 'Mentored 40+ engineers on high-concurrency systems to clear product company hiring bars.'
  },
  {
    id: 'akash',
    name: 'Akash Verma',
    badge: 'Senior Mentor',
    role: 'Lead Product Manager & Architect',
    company: 'Shine.com',
    prevCompany: 'Ex-Accenture',
    transition: 'QA / Analyst ➔ Lead PM',
    beforeLevel: 'Functional QA / Analyst',
    afterLevel: 'Lead PM & Architect',
    growth: 'Services ➔ Product Leadership',
    rating: '4.92',
    calls: '95+ Calls',
    avatar: '/avatars/akash.jpg',
    tags: ['📊 Product Strategy', '💡 System Architecture', '🤝 1:1 Interview Prep'],
    quote: 'Bridge the exact skill gaps between legacy IT services and high-impact product leadership.'
  }
];

export const LoginView: React.FC = () => {
  const { login, switchUser, resetDemoData } = useApp();

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('password');
  const [identifier, setIdentifier] = useState<string>('prakash');
  const [password, setPassword] = useState<string>('shine@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeMentorIndex, setActiveMentorIndex] = useState<number>(0);

  // Auto-cycle showcase mentors
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMentorIndex((prev) => (prev + 1) % SHOWCASE_MENTORS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeMentor = SHOWCASE_MENTORS[activeMentorIndex];

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your username, email, or phone number');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    const success = await login(identifier.trim(), password);
    if (!success) {
      setErrorMessage('Invalid credentials. Hint: use "prakash"/"akash", or any candidate id/email from db.json, with password "shine@123"');
    }
  };

  const handleOtpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    setOtpSent(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 4-digit OTP');
      return;
    }
    // Simulate OTP success by logging into whichever user is matched or prakash
    const matchedUser = identifier.toLowerCase().includes('akash') ? 'akash' : 'prakash';
    switchUser(matchedUser);
  };

  return (
    <div className="shine-official-login-container peerpath-primary-login">
      <div className="shine-login-split-layout">
        
        {/* =========================================================================
            LEFT COLUMN: PeerPath Main Brand, Tech Transition Visuals, Shine Partnership
           ========================================================================= */}
        <div className="shine-login-left-canvas peerpath-left-canvas">
          
          {/* Top-Left Official PeerPath Logo & Partner Badge */}
          <div className="peerpath-login-brand-header">
            <div className="peerpath-brand-logo-wrap login-logo-large">
              <div className="peerpath-brand-symbol">
                <Compass size={24} className="peerpath-symbol-icon" />
              </div>
              <div className="peerpath-brand-text-col">
                <span className="peerpath-brand-title">PEERPATH</span>
                <span className="peerpath-brand-sub">Tech Career Transitions</span>
              </div>
            </div>

            {/* Official Shine Initiative Badge (Single Strategic Brand Placement) */}
            <div className="peerpath-header-shine-badge" title="An Initiative by Shine.com">
              <span className="phsb-label">An Initiative by</span>
              <div className="phsb-logo-container">
                <img 
                  src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
                  alt="Shine.com" 
                  className="shine-official-header-logo" 
                />
              </div>
            </div>
          </div>

          {/* Center Stage: PeerPath Transition & Mentorship Showcase */}
          <div className="peerpath-showcase-center-stage">
            
            {/* Headline */}
            <div className="peerpath-hero-text-block">
              <h1 className="peerpath-login-hero-title">
                Accelerate Your Tech Career with <span className="peerpath-title-gradient">1:1 Mentorship</span>
              </h1>
              <p className="peerpath-login-hero-subtitle">
                Learn directly from vetted tech leaders who made your dream transition. Unlock verified roadmaps, mock interviews.
              </p>
            </div>

            {/* Mentor Selector Switcher Tabs */}
            <div className="peerpath-mentor-switcher-tabs">
              {SHOWCASE_MENTORS.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMentorIndex(idx)}
                  className={`pp-switcher-btn ${activeMentorIndex === idx ? 'active' : ''}`}
                >
                  <img src={m.avatar} alt={m.name} className="pp-switcher-av" />
                  <span className="pp-switcher-name">{m.name.split(' ')[0]}</span>
                  <span className="pp-switcher-comp">@{m.company}</span>
                </button>
              ))}
            </div>

            {/* Main Showcase Spotlight Card */}
            <div className="peerpath-spotlight-card">
              <div className="psc-top-row">
                <div className="psc-profile">
                  <div className="psc-avatar-wrap">
                    <img src={activeMentor.avatar} alt={activeMentor.name} className="psc-avatar" />
                    <span className="psc-online-dot" title="Active on PeerPath"></span>
                  </div>
                  <div className="psc-details">
                    <div className="psc-name-row">
                      <strong className="psc-name">{activeMentor.name}</strong>
                      <span className="psc-verified-badge">
                        <CheckCircle size={11} /> {activeMentor.badge}
                      </span>
                    </div>
                    <span className="psc-role">{activeMentor.role}</span>
                    <span className="psc-company">
                      @{activeMentor.company} • <span className="psc-prev">{activeMentor.prevCompany}</span>
                    </span>
                  </div>
                </div>

                <div className="psc-rating-badge">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <strong>{activeMentor.rating}</strong>
                  <span>({activeMentor.calls})</span>
                </div>
              </div>

              {/* Visual Career Pathway Leap (Role & Level Transition, No Salary Disclosed) */}
              <div className="psc-career-leap-path">
                <div className="psc-leap-node from-node">
                  <span className="leap-label">Starting Point</span>
                  <strong className="leap-comp">{activeMentor.prevCompany.replace('Ex-', '')}</strong>
                  <span className="leap-level">{activeMentor.beforeLevel}</span>
                </div>

                <div className="psc-leap-trajectory">
                  <div className="leap-line">
                    <div className="leap-pulse-beam"></div>
                  </div>
                  <div className="leap-center-badge">
                    <TrendingUp size={12} />
                    <span>{activeMentor.growth}</span>
                  </div>
                </div>

                <div className="psc-leap-node to-node">
                  <span className="leap-label">Transitioned To</span>
                  <strong className="leap-comp">{activeMentor.company}</strong>
                  <span className="leap-level">{activeMentor.afterLevel}</span>
                </div>
              </div>
            </div>

            {/* Quick 3-Metric Proof Strip */}
            <div className="peerpath-metric-strip">
              <div className="pms-item">
                <strong className="pms-val">500+</strong>
                <span className="pms-label">Verified Mentors</span>
              </div>
              <div className="pms-divider"></div>
              <div className="pms-item">
                <strong className="pms-val text-amber-400">4.9 ★</strong>
                <span className="pms-label">Avg Rating</span>
              </div>
              <div className="pms-divider"></div>
              <div className="pms-item">
                <strong className="pms-val text-indigo-300">100,000+</strong>
                <span className="pms-label">Candidate Network</span>
              </div>
            </div>

            {/* Recruiter Network Proof Bar */}
            <div className="peerpath-partner-proof-bar">
              <div className="ppp-avatars">
                <img src="/avatars/saheli.jpg" alt="Saheli" className="ppp-avatar" />
                <img src="/avatars/akash.jpg" alt="Akash" className="ppp-avatar" />
                <img src="/avatars/nisha.jpg" alt="Nisha" className="ppp-avatar" />
              </div>
              <div className="ppp-text">
                <div className="ppp-title-row">
                  <strong>1,500+ Recruiter Network</strong>
                  <span className="ppp-verified-tag">
                    <ShieldCheck size={11} /> Verified by Shine
                  </span>
                </div>
                <span>Direct referrals to hiring teams across India's top unicorns & tech firms</span>
              </div>
            </div>

          </div>

          {/* Bottom Left Note */}
          <div className="peerpath-left-footer-note">
            <span>🤝 Official Career Transition Initiative by <strong>Shine.com (HT Media)</strong></span>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: Login Form Box (PeerPath Branded with Shine Partner SSO)
           ========================================================================= */}
        <div className="shine-login-right-canvas">
          <div className="shine-login-card-wrapper">
            
            {/* Campaign Awareness Banner */}
            {utmSource === 'whatsapp' ? (
              <div className="shine-campaign-header-pill whatsapp-pill">
                <MessageSquare size={14} className="text-emerald-500 flex-shrink-0" />
                <span><strong>WhatsApp Campaign Invite:</strong> Log in to access 1:1 Peerpath Mentors</span>
              </div>
            ) : utmSource === 'email' ? (
              <div className="shine-campaign-header-pill email-pill">
                <Mail size={14} className="text-blue-500 flex-shrink-0" />
                <span><strong>Email Campaign Invite:</strong> Log in to access 1:1 Peerpath Mentors</span>
              </div>
            ) : campaign ? (
              <div className="shine-campaign-header-pill campaign-pill">
                <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
                <span><strong>Peerpath Transition Campaign:</strong> Fast-track 1:1 career mentorship</span>
              </div>
            ) : null}

            {/* Clean & Sleek Login Header */}
            <div className="shine-login-header-group">
              <span className="peerpath-login-eyebrow">SIGN IN TO</span>
              <h2 className="shine-login-main-heading">PeerPath</h2>
              <p className="peerpath-login-subheading">
                Access your verified career transition roadmaps & 1:1 mentors
              </p>
            </div>

            {/* Segmented Control: Login Via OTP vs Password */}
            <div className="shine-segmented-tabs">
              <button 
                type="button" 
                className={`shine-seg-tab ${authMode === 'password' ? 'active' : ''}`}
                onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
              >
                Login Via Password
              </button>
              <button 
                type="button" 
                className={`shine-seg-tab ${authMode === 'otp' ? 'active' : ''}`}
                onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
              >
                Login Via OTP
              </button>
            </div>

            {/* Form Container Card */}
            <div className="shine-login-form-card">
              
              {errorMessage && (
                <div className="shine-login-error-box">
                  <span>{errorMessage}</span>
                </div>
              )}

              {authMode === 'password' ? (
                /* ----------------- Password Login Form ----------------- */
                <form onSubmit={handlePasswordSubmit} className="shine-auth-form">
                  <div className="shine-field-group">
                    <label className="shine-field-label">Email or Phone Number / Username</label>
                    <input 
                      type="text" 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your email / phone number"
                      className="shine-auth-input"
                      autoFocus
                    />
                  </div>

                  <div className="shine-field-group">
                    <div className="shine-label-with-action">
                      <label className="shine-field-label">Password</label>
                      <a href="#!" onClick={(e) => { e.preventDefault(); alert('Password for demo is shine@123'); }} className="shine-forgot-link">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="shine-password-input-wrap">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (shine@123)"
                        className="shine-auth-input"
                      />
                      <button 
                        type="button" 
                        className="shine-pwd-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`shine-btn-proceed peerpath-btn-proceed ${identifier && password ? 'active-ready' : ''}`}
                  >
                    Proceed to PeerPath <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                /* ----------------- OTP Login Form ----------------- */
                !otpSent ? (
                  <form onSubmit={handleOtpRequest} className="shine-auth-form">
                    <div className="shine-field-group">
                      <label className="shine-field-label">Email or Phone Number</label>
                      <input 
                        type="text" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter your email / phone number"
                        className="shine-auth-input"
                        autoFocus
                      />
                    </div>

                    <button 
                      type="submit" 
                      className={`shine-btn-proceed peerpath-btn-proceed ${identifier ? 'active-ready' : ''}`}
                    >
                      Get OTP <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="shine-auth-form">
                    <div className="shine-field-group">
                      <label className="shine-field-label">Enter 4-Digit OTP sent to {identifier}</label>
                      <input 
                        type="text" 
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter OTP (e.g. 1234)"
                        maxLength={6}
                        className="shine-auth-input shine-otp-input"
                        autoFocus
                      />
                      <span className="shine-otp-hint">Tip: Enter any 4 digits (e.g. 1234) for demo verification</span>
                    </div>

                    <div className="shine-otp-btn-row">
                      <button type="submit" className="shine-btn-proceed peerpath-btn-proceed active-ready">
                        Verify & Access PeerPath
                      </button>
                      <button 
                        type="button" 
                        className="shine-btn-resend"
                        onClick={() => setOtpSent(false)}
                      >
                        Change Number / Email
                      </button>
                    </div>
                  </form>
                )
              )}

              {/* Quick 1-Click Demo Accounts Selector */}
              <div className="shine-demo-accounts-box">
                <div className="demo-accounts-header-row">
                  <span className="demo-accounts-header">⚡ 1-Click Demo Login:</span>
                  <span className="demo-accounts-hint">Click persona to instant-login</span>
                </div>
                <div className="demo-cards-row">
                  <button 
                    type="button"
                    className="btn-demo-account-chip chip-candidate"
                    onClick={() => {
                      setIdentifier('prakash');
                      setPassword('shine@123');
                      login('prakash', 'shine@123');
                    }}
                    title="Sign in as Candidate Prakash"
                  >
                    <div className="demo-chip-header">
                      <img src="/avatars/prakash.jpg" alt="Prakash" className="demo-chip-av" />
                      <strong className="demo-chip-name">Prakash</strong>
                    </div>
                    <div className="demo-chip-meta">
                      <span className="demo-role-badge badge-cand">Candidate</span>
                      <span className="demo-sub-role">Junior SDE</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="btn-demo-account-chip chip-nisha"
                    onClick={() => {
                      setIdentifier('nisha');
                      setPassword('shine@123');
                      login('nisha', 'shine@123');
                    }}
                    title="Sign in as Pitch Target Nisha"
                  >
                    <div className="demo-chip-header">
                      <img src="/avatars/nisha.jpg" alt="Nisha" className="demo-chip-av" />
                      <strong className="demo-chip-name">Nisha</strong>
                    </div>
                    <div className="demo-chip-meta">
                      <span className="demo-role-badge badge-lead">Pitch Lead</span>
                      <span className="demo-sub-role">Staff @ Flipkart</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="btn-demo-account-chip chip-mentor"
                    onClick={() => {
                      setIdentifier('akash');
                      setPassword('shine@123');
                      login('akash', 'shine@123');
                    }}
                    title="Sign in as Mentor Akash"
                  >
                    <div className="demo-chip-header">
                      <img src="/avatars/akash.jpg" alt="Akash" className="demo-chip-av" />
                      <strong className="demo-chip-name">Akash</strong>
                    </div>
                    <div className="demo-chip-meta">
                      <span className="demo-role-badge badge-mentor">Mentor</span>
                      <span className="demo-sub-role">Lead PM @ Shine</span>
                    </div>
                  </button>
                </div>

                <button 
                  type="button" 
                  className="btn-reset-demo-login"
                  onClick={() => resetDemoData()}
                >
                  <RotateCcw size={11} /> Reset Demo Personas to Baseline
                </button>
              </div>

            </div>

            {/* Under Card: Register Link */}
            <div className="shine-login-footer-links">
              <p className="shine-register-prompt">
                Don't have an account?{' '}
                <a href="#!" onClick={(e) => { e.preventDefault(); alert('Demo Registration: Simply select Prakash or Akash above to get started!'); }} className="shine-gold-register-link">
                  Register on PeerPath
                </a>
              </p>

              {/* OR Divider */}
              <div className="shine-or-divider">
                <span className="or-line"></span>
                <span className="or-text">OR</span>
                <span className="or-line"></span>
              </div>

              {/* Google Social Button */}
              <button 
                type="button" 
                className="shine-btn-google"
                onClick={() => {
                  switchUser('prakash');
                }}
              >
                <svg className="google-svg-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Shine Single Sign-On Guarantee */}
              <div className="peerpath-partner-sso-guarantee">
                <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Shine.com Single Sign-On:</strong> Existing Shine users can sign in with their registered phone or email directly.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
