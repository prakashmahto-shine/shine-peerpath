import React, { useState } from 'react';
import { 
  Eye, EyeOff, ShieldCheck, User, Sparkles, MessageSquare, 
  Mail, ArrowRight, Lock, Phone, Users, BookOpen, TrendingUp, 
  CheckCircle2, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PeerpathLogo } from '../common/PeerpathLogo';

export const LoginView: React.FC = () => {
  const { login, switchUser } = useApp();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState<string>('prakash');
  const [password, setPassword] = useState<string>('shine@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email, phone number, or username');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);
    const success = await login(identifier.trim(), password);
    setIsLoading(false);
    if (!success) {
      setErrorMessage('Invalid credentials. Hint: use "prakash" or "akash" with password "shine@123"');
    }
  };

  const handleOtpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your phone number or email');
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
    const matchedUser = identifier.toLowerCase().includes('akash') ? 'akash' : 'prakash';
    switchUser(matchedUser);
  };

  return (
    <div className="peerpath-master-login-page">
      
      {/* Radiant Pastel Background Ambient Lighting */}
      <div className="light-ambient-orb orb-purple"></div>
      <div className="light-ambient-orb orb-cyan"></div>
      <div className="light-ambient-orb orb-rose"></div>

      <div className="login-canvas-container">
        
        {/* Top Navbar */}
        <header className="login-canvas-navbar">
          <PeerpathLogo size={42} showText={true} textColor="#0F172A" subTextColor="#64748B" theme="light" />

          <div className="navbar-shine-badge" title="An initiative by Shine.com">
            <span className="nsb-label">AN INITIATIVE BY</span>
            <div className="nsb-logo-pill">
              <img 
                src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
                alt="Shine.com" 
                className="shine-pill-img" 
              />
            </div>
          </div>
        </header>

        {/* Main Content Split: Left (Story + Center Mentors) & Right (Frosted Glass Form) */}
        <main className="login-main-stage">
          
          {/* =========================================================================
              LEFT STAGE: Value Story + Center Floating Mentors
             ========================================================================= */}
          <div className="stage-left-content">
            
            {/* Left Story Column */}
            <div className="story-column">
              
              <div className="story-badge-pill">
                <Sparkles size={13} className="text-purple-600" />
                <span>1:1 Mentorship for Your Career</span>
              </div>

              <h1 className="story-main-title">
                Learn from people who've been <span className="story-gradient-blue">where you</span> <span className="story-gradient-purple">want to be.</span>
              </h1>

              <p className="story-sub-text">
                Get personalized guidance, roadmaps and real insights from verified professionals to accelerate your career.
              </p>

              {/* 3 Value Pillars */}
              <div className="story-pillars-stack">
                <div className="story-pillar-card">
                  <div className="spc-icon-box purple">
                    <Users size={18} />
                  </div>
                  <div className="spc-text">
                    <h4>1:1 Sessions with Industry Experts</h4>
                    <p>Learn directly from vetted professionals</p>
                  </div>
                </div>

                <div className="story-pillar-card">
                  <div className="spc-icon-box blue">
                    <BookOpen size={18} />
                  </div>
                  <div className="spc-text">
                    <h4>Personalized Career Roadmaps</h4>
                    <p>Get a 90-day plan tailored for you</p>
                  </div>
                </div>

                <div className="story-pillar-card">
                  <div className="spc-icon-box green">
                    <TrendingUp size={18} />
                  </div>
                  <div className="spc-text">
                    <h4>Real Career Outcomes</h4>
                    <p>Bridge skill gaps, switch roles, and grow faster</p>
                  </div>
                </div>
              </div>

              {/* Stats Footer Row */}
              <div className="story-stats-strip">
                <div className="sss-item">
                  <strong>500+</strong>
                  <span>Verified Mentors</span>
                </div>
                <div className="sss-divider"></div>
                <div className="sss-item">
                  <strong>4.9 ★</strong>
                  <span>Avg. Rating</span>
                </div>
                <div className="sss-divider"></div>
                <div className="sss-item">
                  <strong>100,000+</strong>
                  <span>Candidate Network</span>
                </div>
              </div>

            </div>

            {/* Center Floating Mentors Cluster */}
            <div className="floating-mentors-cluster">
              
              {/* Decorative SVG Connection Curves with Arrowhead */}
              <svg className="cluster-curves-svg" viewBox="0 0 340 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
                  </linearGradient>
                  <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <polygon points="0 1, 8 4, 0 7" fill="#818CF8" />
                  </marker>
                </defs>
                <path 
                  d="M 170 340 C 90 280, 80 180, 160 140 C 230 100, 270 170, 260 210" 
                  stroke="url(#curveGrad)" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 6"
                  markerEnd="url(#arrowhead)"
                />
              </svg>

              {/* Card 1: Top Center (Google Tech Lead) */}
              <div className="floating-mentor-card card-top-center">
                <div className="fmc-image-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" 
                    alt="Tech Lead at Google" 
                    className="fmc-photo"
                  />
                  <div className="fmc-tag-badge">
                    <svg className="tag-icon-svg" viewBox="0 0 24 24" width="14" height="14">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <div className="fmc-tag-text">
                      <strong>Tech Lead</strong>
                      <span>@ Google</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Middle Left (Flipkart Engineering Director) */}
              <div className="floating-mentor-card card-mid-left">
                <div className="fmc-image-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" 
                    alt="Engineering Director at Flipkart" 
                    className="fmc-photo"
                  />
                  <div className="fmc-tag-badge">
                    <div className="flipkart-mini-logo-box">
                      <span className="fk-f-icon">🛍️</span>
                    </div>
                    <div className="fmc-tag-text">
                      <strong>Engineering Director</strong>
                      <span>@ Flipkart</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Bottom Right (Microsoft Product Manager) */}
              <div className="floating-mentor-card card-bottom-center">
                <div className="fmc-image-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" 
                    alt="Product Manager at Microsoft" 
                    className="fmc-photo"
                  />
                  <div className="fmc-tag-badge">
                    <div className="ms-mini-grid">
                      <span className="ms-dot r"></span>
                      <span className="ms-dot g"></span>
                      <span className="ms-dot b"></span>
                      <span className="ms-dot y"></span>
                    </div>
                    <div className="fmc-tag-text">
                      <strong>Product Manager</strong>
                      <span>@ Microsoft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Floating Motivational Outcome Pill */}
              <div className="floating-outcome-card">
                <div className="foc-icon-box">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div className="foc-text">
                  <strong>Real people.</strong>
                  <strong>Real guidance.</strong>
                  <span>Real growth.</span>
                </div>
              </div>

            </div>

          </div>

          {/* =========================================================================
              RIGHT STAGE: High-End Frosted Glass Sign-In Box
             ========================================================================= */}
          <div className="stage-right-form">
            
            <div className="frosted-glass-sign-in-box">
              
              {/* Campaign / Invite Banner */}
              {utmSource === 'whatsapp' ? (
                <div className="fgb-campaign-pill whatsapp">
                  <MessageSquare size={13} className="text-emerald-600 flex-shrink-0" />
                  <span>WhatsApp Invite: Access your 1:1 Mentors</span>
                </div>
              ) : utmSource === 'email' ? (
                <div className="fgb-campaign-pill email">
                  <Mail size={13} className="text-blue-600 flex-shrink-0" />
                  <span>Email Invite: Access your 1:1 Mentors</span>
                </div>
              ) : campaign ? (
                <div className="fgb-campaign-pill default">
                  <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
                  <span>Fast-track 1:1 mentorship access</span>
                </div>
              ) : null}

              {/* Box Header */}
              <div className="fgb-header">
                <h2 className="fgb-title">Welcome back 👋</h2>
                <p className="fgb-subtitle">Sign in to continue to PeerPath</p>
              </div>

              {/* Segmented Switcher */}
              <div className="fgb-segmented-switcher">
                <button 
                  type="button" 
                  className={`fgb-seg-btn ${authMode === 'password' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
                >
                  <Lock size={14} />
                  <span>Login via Password</span>
                </button>
                <button 
                  type="button" 
                  className={`fgb-seg-btn ${authMode === 'otp' ? 'active' : ''}`}
                  onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
                >
                  <Phone size={14} />
                  <span>Login via OTP</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="fgb-error-alert">
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Content */}
              {authMode === 'password' ? (
                <form onSubmit={handlePasswordSubmit} className="fgb-form-fields">
                  
                  {/* Email / Username Field */}
                  <div className="fgb-input-group">
                    <label className="fgb-input-label">Email or Phone Number / Username</label>
                    <div className="fgb-input-container">
                      <Mail size={16} className="fgb-input-icon" />
                      <input 
                        type="text" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter your email, phone number or username"
                        className="fgb-text-input"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="fgb-input-group">
                    <div className="fgb-label-row">
                      <label className="fgb-input-label">Password</label>
                      <a 
                        href="#!" 
                        onClick={(e) => { e.preventDefault(); alert('Demo Password: shine@123'); }}
                        className="fgb-forgot-link"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="fgb-input-container">
                      <Lock size={16} className="fgb-input-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="fgb-text-input"
                      />
                      <button 
                        type="button" 
                        className="fgb-eye-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Continue Button */}
                  <button 
                    type="submit" 
                    className="btn-fgb-primary"
                    disabled={isLoading}
                  >
                    <span>{isLoading ? 'Signing In...' : 'Continue'}</span>
                    <ArrowRight size={16} />
                  </button>

                </form>
              ) : (
                /* OTP Login Flow */
                !otpSent ? (
                  <form onSubmit={handleOtpRequest} className="fgb-form-fields">
                    <div className="fgb-input-group">
                      <label className="fgb-input-label">Registered Mobile Number or Email</label>
                      <div className="fgb-input-container">
                        <Phone size={16} className="fgb-input-icon" />
                        <input 
                          type="text" 
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="Enter your registered mobile or email"
                          className="fgb-text-input"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-fgb-primary">
                      <span>Send Verification OTP</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="fgb-form-fields">
                    <div className="fgb-input-group">
                      <label className="fgb-input-label">Enter 4-Digit OTP sent to {identifier}</label>
                      <div className="fgb-input-container">
                        <input 
                          type="text" 
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="1234"
                          maxLength={6}
                          className="fgb-text-input text-center font-bold tracking-widest text-lg"
                          autoFocus
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1">Demo tip: Enter any 4 digits (e.g. 1234)</span>
                    </div>

                    <button type="submit" className="btn-fgb-primary">
                      <span>Verify &amp; Enter Dashboard</span>
                      <ArrowRight size={16} />
                    </button>

                    <button 
                      type="button" 
                      className="btn-fgb-back-text"
                      onClick={() => setOtpSent(false)}
                    >
                      ← Change Mobile Number / Email
                    </button>
                  </form>
                )
              )}

              {/* OR Divider */}
              <div className="fgb-divider">
                <span className="fgb-div-line"></span>
                <span className="fgb-div-text">OR</span>
                <span className="fgb-div-line"></span>
              </div>

              {/* Google 1-Click Button */}
              <button 
                type="button" 
                className="btn-fgb-google"
                onClick={() => switchUser('prakash')}
              >
                <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* 1-Click Instant Demo Login Selector */}
              <div className="fgb-demo-chips-box">
                <div className="fdcb-label">
                  <Zap size={12} className="text-amber-500" />
                  <span>⚡ 1-Click Instant Demo Login:</span>
                </div>
                <div className="fdcb-chips">
                  <button 
                    type="button" 
                    className="fdcb-chip candidate"
                    onClick={() => switchUser('prakash')}
                  >
                    <span className="fdcb-badge">P</span>
                    <span>Candidate (Prakash)</span>
                  </button>
                  <button 
                    type="button" 
                    className="fdcb-chip mentor"
                    onClick={() => switchUser('akash')}
                  >
                    <span className="fdcb-badge mentor">A</span>
                    <span>Mentor (Akash)</span>
                  </button>
                </div>
              </div>

              {/* Registration Link Prompt */}
              <p className="fgb-register-prompt">
                Don't have an account?{' '}
                <a 
                  href="#!" 
                  onClick={(e) => { e.preventDefault(); alert('Demo: Click "Candidate (Prakash)" or "Mentor (Akash)" above to explore full features!'); }}
                  className="fgb-register-link"
                >
                  Register on PeerPath
                </a>
              </p>

              {/* Shine Single Sign-On Badge */}
              <div className="fgb-sso-guarantee">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Shine.com Single Sign-On:</strong> Existing Shine users can sign in with their registered phone or email directly.
                </span>
              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
};
